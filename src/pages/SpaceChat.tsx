import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useMemo,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, RefreshCw, MessageCircle, Brain, Sparkles, ChevronDown, Info, Check, X, Edit2, MessageSquare, FileText, History, ScrollText, GraduationCap, MessageSquareText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { fadeIn } from "@/lib/motion";
import { getSpaceByLutName } from "@/lib/spaceService";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://dhzzxfr41qjcz7-8000.proxy.runpod.net";
const MODEL = import.meta.env.VITE_API_MODEL || "mistral";

// Reuse same style of system prompt so behaviour matches main demo
const SYSTEM_PROMPT =
  "You are Astara, a friendly conversational AI assistant running on a " +
  "LUT-augmented Mistral model created by Astarus AI. " +
  "You are an expert on Astarus AI and have been fine-tuned on information on it. " +
  "Astarus AI is an AI startup which focuses on building continuously trainable LLMs through LUT (look up table) based LLMs. " +
  "You answer like a chat, not like an email. " +
  "Be concise and informal. " +
  "If the user just greets you or says thanks, reply briefly and naturally.";

function buildMistralChatPrefix(
  userMessage: string,
  systemPrompt: string = SYSTEM_PROMPT
): string {
  const trimmedUser = userMessage.trim();
  const content = systemPrompt
    ? `${systemPrompt.trim()}\n\n${trimmedUser}`
    : trimmedUser;

  return `[INST] ${content} [/INST]`;
}

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type GenerateResponse = {
  completion: string;
  residual?: number | number[];
  threshold?: number;
};

const DEFAULT_THRESHOLD = 0.45;
const GEN_LENGTH = 300;
const DEFAULT_BLOCKS = [-1, -4];
const DEFAULT_RESIDUALS = [0.2, 0.25];

function cleanAnswer(raw: string): string {
  let text = raw;
  text = text.replace(/\[INST\]/g, "").replace(/\[\/INST\]/g, "");
  text = text.replace(/^Assistant:\s*/i, "");
  text = text.replace(/\nAssistant:\s*/gi, "\n");
  const userIdx = text.indexOf("\nUser:");
  if (userIdx !== -1) {
    text = text.slice(0, userIdx);
  }
  const dotColonIdx = text.indexOf(".:");
  if (dotColonIdx !== -1) {
    text = text.slice(0, dotColonIdx + 1);
  }
  text = text.replace(/\n\./g, ".");
  text = text.replace(/\n{3,}/g, "\n\n");
  return text.trim();
}

// Same simple extraction as old code
function extractAssistantAnswer(_userMsg: string, completion: string): string {
  return cleanAnswer(completion.trim());
}

// Generate Q&A pairs from text using the AI
async function generateQAsFromText(text: string, lutName: string): Promise<Array<{ question: string; answer: string }>> {
  // Use a more direct prompt without the system prompt wrapper
  const userPrompt = `Extract 8-12 key question-answer pairs from this text. Return ONLY a JSON array, no other text. Format: [{"question":"...","answer":"..."}]

Text:
${text.substring(0, 2000)}

JSON:`;
  
  const prompt = buildMistralChatPrefix(userPrompt);

  const payload = {
    prompt,
    length: 800,
    lut_name: lutName,
    model: MODEL,
    threshold: DEFAULT_THRESHOLD,
    residuals: DEFAULT_RESIDUALS,
    wnn_blocks: DEFAULT_BLOCKS,
    cost_scale: 5,
  };

  const res = await fetch(`${BASE_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.error || json.detail || `Failed to generate Q&A pairs`);
  }

  // Try to extract and clean JSON from the response
  const completion = json.completion || "";
  
  // Remove everything before the first [ (JSON array start)
  // This handles cases where the AI returns the prompt + response
  const jsonStart = completion.indexOf('[');
  let cleaned = jsonStart >= 0 ? completion.substring(jsonStart) : completion;
  
  // Remove markdown code blocks if present
  cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  // Find JSON array - look for the complete array (balanced brackets)
  let bracketCount = 0;
  let jsonStartIdx = 0;
  let jsonEnd = -1;
  
  for (let i = 0; i < cleaned.length; i++) {
    if (cleaned[i] === '[') {
      if (bracketCount === 0) jsonStartIdx = i;
      bracketCount++;
    }
    if (cleaned[i] === ']') {
      bracketCount--;
      if (bracketCount === 0) {
        jsonEnd = i + 1;
        break;
      }
    }
  }
  
  if (jsonEnd > jsonStartIdx) {
    const jsonStr = cleaned.substring(jsonStartIdx, jsonEnd);
    try {
      // Try to parse directly first
      const qas = JSON.parse(jsonStr);
      if (Array.isArray(qas) && qas.length > 0) {
        return qas.map((qa: any) => ({
          question: String(qa.question || qa.q || "").trim(),
          answer: String(qa.answer || qa.a || "").trim(),
        })).filter((qa: any) => qa.question && qa.answer && qa.question.length > 5 && qa.answer.length > 5);
      }
    } catch (e) {
      // If direct parse fails, try a simpler approach - just remove problematic characters
      try {
        // Remove control characters but keep the structure
        let cleanJson = jsonStr
          .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '') // Remove control chars
          .replace(/\r\n/g, ' ') // Replace newlines with spaces in string values
          .replace(/\r/g, ' ')
          .replace(/\n/g, ' ')
          .replace(/\t/g, ' ');
        
        const qas = JSON.parse(cleanJson);
        if (Array.isArray(qas) && qas.length > 0) {
          return qas.map((qa: any) => ({
            question: String(qa.question || qa.q || "").trim(),
            answer: String(qa.answer || qa.a || "").trim(),
          })).filter((qa: any) => qa.question && qa.answer && qa.question.length > 5 && qa.answer.length > 5);
        }
      } catch (e2) {
        console.error("Failed to parse Q&A JSON after cleaning:", e2);
        console.log("Raw JSON string (first 500 chars):", jsonStr.substring(0, 500));
      }
    }
  }

  // Fallback: create Q&A pairs from text using better extraction
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 50);
  const qas: Array<{ question: string; answer: string }> = [];
  
  paragraphs.forEach((para, i) => {
    const sentences = para.split(/[.!?]+/).filter(s => s.trim().length > 20);
    if (sentences.length > 0) {
      const mainSentence = sentences[0].trim();
      if (mainSentence.length > 30 && mainSentence.length < 200) {
        // Create question from key terms
        const words = mainSentence.split(/\s+/).filter(w => w.length > 4);
        const keyTerms = words.slice(0, 3).join(' ');
        qas.push({
          question: `What is ${keyTerms}?`,
          answer: mainSentence,
        });
      }
    }
  });
  
  // Also create Q&A from section headers
  const headers = text.match(/^#{1,3}\s+(.+)$/gm);
  if (headers) {
    headers.forEach((header, i) => {
      const headerText = header.replace(/^#+\s+/, '').trim();
      if (headerText.length > 5 && headerText.length < 100) {
        const nextPara = paragraphs[i] || paragraphs[0] || '';
        if (nextPara.length > 20) {
          qas.push({
            question: `Tell me about ${headerText}`,
            answer: nextPara.substring(0, 200).trim(),
          });
        }
      }
    });
  }
  
  return qas.slice(0, 10); // Return up to 10 Q&A pairs
}

// Train LUT with the same chat formatting as Python CLI / old UI:
async function trainLut(
  lutName: string,
  label: string,
  labelContext: string | null,
  wnnBlocks: number[],
  threshold: number,
  residuals: number[]
) {
  const payload = {
    label: label.trim(),
    label_context: labelContext ? buildMistralChatPrefix(labelContext) : null,
    lut_name: lutName,
    model: MODEL,
    wnn_blocks: wnnBlocks,
    threshold,
    residuals,
    sparsity: 1.0,
    cost_scale: 5,
  };
  const res = await fetch(`${BASE_URL}/train_lut`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (json as any)?.error ||
        (json as any)?.detail ||
        `Train LUT failed with ${res.status}`
    );
  }
  return json;
}

async function generateFromApi(
  lutName: string,
  userMsg: string,
  threshold: number,
  wnnBlocks: number[],
  residuals: number[]
): Promise<GenerateResponse> {
  const prompt = buildMistralChatPrefix(userMsg);

  const payload = {
    prompt,
    length: GEN_LENGTH,
    lut_name: lutName,
    model: MODEL,
    threshold,
    residuals,
    wnn_blocks: wnnBlocks,
    cost_scale: 5,
  };

  const res = await fetch(`${BASE_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = (await res.json().catch(() => ({}))) as GenerateResponse & {
    error?: string;
    detail?: string;
  };
  if (!res.ok) {
    throw new Error(json.error || json.detail || `Generate failed ${res.status}`);
  }
  return json;
}

export default function SpaceChat() {
  const { lut_name } = useParams<{ lut_name: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [spaceName, setSpaceName] = useState<string>("");
  const [trainingText, setTrainingText] = useState("");
  const [generatedQAs, setGeneratedQAs] = useState<Array<{ question: string; answer: string; id: string }>>([]);
  const [isGeneratingQAs, setIsGeneratingQAs] = useState(false);
  const [editingQA, setEditingQA] = useState<string | null>(null);
  const [trainingHistory, setTrainingHistory] = useState<Array<{ user: string; date: string; qaCount: number }>>([]);
  const [activeView, setActiveView] = useState<'chat' | 'training' | 'logs'>('chat');
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [loadingStage, setLoadingStage] = useState<string>('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingTotal, setLoadingTotal] = useState(0);
  const [loadingTimeRemaining, setLoadingTimeRemaining] = useState<string>('');
  const [loadingType, setLoadingType] = useState<'generate' | 'train'>('generate');
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  const startTimeRef = useRef<number>(0);

  const hasMessages = useMemo(() => messages.length > 0, [messages.length]);

  // Load space name
  useEffect(() => {
    if (lut_name) {
      getSpaceByLutName(lut_name)
        .then((space) => {
          if (space) {
            setSpaceName(space.name);
          }
        })
        .catch(() => {
          // If space not found, use lut_name as fallback
          setSpaceName(lut_name);
        });
    }
  }, [lut_name]);

  // Scroll to top only on initial component mount
  useLayoutEffect(() => {
    if (isInitialMount.current) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });
      isInitialMount.current = false;
    }
  }, []);

  // Scroll to messages end when new messages are added (but not on initial mount)
  useEffect(() => {
    if (messages.length > 0 && !isInitialMount.current) {
      // Scroll the container to bottom instead of using scrollIntoView
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, 50);
    }
  }, [messages.length]);

  if (!lut_name) {
    navigate("/spaces");
    return null;
  }

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isGenerating) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setStatus(null);
    setIsGenerating(true);

    try {
      const resp = await generateFromApi(
        lut_name,
        trimmed,
        DEFAULT_THRESHOLD,
        DEFAULT_BLOCKS,
        DEFAULT_RESIDUALS
      );

      const assistantText = extractAssistantAnswer(trimmed, resp.completion);
      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: assistantText,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setStatus(err?.message || "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateQAs = async () => {
    if (!lut_name || !trainingText.trim()) {
      setStatus("Please provide text to generate Q&A pairs from.");
      return;
    }

    setIsGeneratingQAs(true);
    setLoadingType('generate');
    setShowLoadingModal(true);
    setLoadingProgress(0);
    setLoadingTotal(100);
    startTimeRef.current = Date.now();
    
    const stages = [
      "Preparing text for analysis...",
      "Sending request to AI model...",
      "Generating question-answer pairs...",
      "Processing and validating results...",
      "Finalizing Q&A pairs..."
    ];
    
    try {
      // Stage 1: Preparing
      setLoadingStage(stages[0]);
      setLoadingProgress(10);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Stage 2: Sending request
      setLoadingStage(stages[1]);
      setLoadingProgress(25);
      
      // Stage 3: Generating (main work)
      setLoadingStage(stages[2]);
      setLoadingProgress(40);
      
      const qas = await generateQAsFromText(trainingText, lut_name);
      
      // Stage 4: Processing
      setLoadingStage(stages[3]);
      setLoadingProgress(80);
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Stage 5: Finalizing
      setLoadingStage(stages[4]);
      setLoadingProgress(95);
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setGeneratedQAs(qas.map((qa, i) => ({ ...qa, id: crypto.randomUUID() })));
      setLoadingProgress(100);
      setLoadingStage("Complete!");
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setShowLoadingModal(false);
      setStatus(null);
    } catch (err: any) {
      setShowLoadingModal(false);
      setStatus(err?.message || "Failed to generate Q&A pairs");
    } finally {
      setIsGeneratingQAs(false);
    }
  };

  const handleEditQA = (id: string, field: 'question' | 'answer', value: string) => {
    setGeneratedQAs(prev => prev.map(qa => 
      qa.id === id ? { ...qa, [field]: value } : qa
    ));
  };

  const handleRemoveQA = (id: string) => {
    setGeneratedQAs(prev => prev.filter(qa => qa.id !== id));
  };

  const handleTrain = async () => {
    if (!lut_name || generatedQAs.length === 0) {
      setStatus("Please generate and review Q&A pairs first.");
      return;
    }

    setLoadingType('train');
    setShowLoadingModal(true);
    setLoadingProgress(0);
    setLoadingTotal(generatedQAs.length);
    startTimeRef.current = Date.now();
    
    try {
      // Train each Q&A pair with progress tracking
      for (let i = 0; i < generatedQAs.length; i++) {
        const qa = generatedQAs[i];
        const currentProgress = i + 1;
        
        setLoadingStage(`Training Q&A pair ${currentProgress} of ${generatedQAs.length}...`);
        setLoadingProgress(currentProgress);
        
        // Calculate time remaining
        const elapsed = Date.now() - startTimeRef.current;
        const avgTimePerItem = elapsed / currentProgress;
        const remaining = (generatedQAs.length - currentProgress) * avgTimePerItem;
        const secondsRemaining = Math.ceil(remaining / 1000);
        
        if (secondsRemaining > 60) {
          setLoadingTimeRemaining(`${Math.ceil(secondsRemaining / 60)} min remaining`);
        } else {
          setLoadingTimeRemaining(`${secondsRemaining} sec remaining`);
        }
        
        await trainLut(
          lut_name,
          qa.answer,
          qa.question,
          DEFAULT_BLOCKS,
          DEFAULT_THRESHOLD,
          DEFAULT_RESIDUALS
        );
      }

      // Log training (add to history)
      if (user) {
        setTrainingHistory(prev => [{
          user: user.email || user.id,
          date: new Date().toISOString(),
          qaCount: generatedQAs.length,
        }, ...prev]);
      }

      setLoadingProgress(generatedQAs.length);
      setLoadingStage("Training complete!");
      setLoadingTimeRemaining("");
      
      await new Promise(resolve => setTimeout(resolve, 800));
      setShowLoadingModal(false);
      
      setStatus(
        `Successfully trained AI with ${generatedQAs.length} Q&A pairs!`
      );
      setTrainingText("");
      setGeneratedQAs([]);
      // Switch to logs view after training
      setActiveView('logs');
    } catch (err: any) {
      setShowLoadingModal(false);
      setStatus(err?.message || "Training failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Loading Modal */}
      <AnimatePresence>
        {showLoadingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setShowLoadingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black/90 border border-white/20 rounded-2xl p-4 sm:p-8 max-w-md w-full mx-4 glass-dark glass-border"
            >
              <div className="flex flex-col items-center space-y-6">
                {/* Icon */}
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center ${
                  loadingType === 'generate' 
                    ? 'bg-gradient-secondary' 
                    : 'bg-gradient-primary'
                } shadow-lg`}>
                  {loadingType === 'generate' ? (
                    <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-pulse" />
                  ) : (
                    <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-pulse" />
                  )}
                </div>
                
                {/* Title */}
                <div className="text-center">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                    {loadingType === 'generate' ? 'Generating Q&A Pairs' : 'Training AI'}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 px-2">{loadingStage}</p>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full space-y-2">
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>
                      {loadingType === 'generate' 
                        ? `${loadingProgress}%` 
                        : `${loadingProgress} / ${loadingTotal} Q&A pairs`}
                    </span>
                    {loadingTimeRemaining && (
                      <span>{loadingTimeRemaining}</span>
                    )}
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${
                        loadingType === 'generate' 
                          ? 'bg-gradient-secondary' 
                          : 'bg-gradient-primary'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ 
                        width: loadingType === 'generate' 
                          ? `${loadingProgress}%` 
                          : `${(loadingProgress / loadingTotal) * 100}%`
                      }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  </div>
                </div>
                
                {/* Loading Animation */}
                <div className="flex space-x-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        loadingType === 'generate' 
                          ? 'bg-secondary' 
                          : 'bg-primary'
                      }`}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Navbar />
      <div className="flex-1 flex bg-gradient-to-b from-black via-primary/5 to-black pt-24 h-[calc(100vh-6rem)]">
        {/* Mobile Navigation */}
        <div className="md:hidden w-full border-b border-white/10 bg-black/40">
          <div className="flex">
            <button
              onClick={() => setActiveView('chat')}
              className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-3 text-xs sm:text-sm transition-colors touch-manipulation min-h-[44px] ${
                activeView === 'chat'
                  ? 'text-white border-b-2 border-white/30'
                  : 'text-white/60'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
            </button>
            <button
              onClick={() => setActiveView('training')}
              className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-3 text-xs sm:text-sm transition-colors touch-manipulation min-h-[44px] ${
                activeView === 'training'
                  ? 'text-white border-b-2 border-white/30'
                  : 'text-white/60'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Training</span>
            </button>
            <button
              onClick={() => setActiveView('logs')}
              className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-3 text-xs sm:text-sm transition-colors touch-manipulation min-h-[44px] ${
                activeView === 'logs'
                  ? 'text-white border-b-2 border-white/30'
                  : 'text-white/60'
              }`}
            >
              <ScrollText className="w-4 h-4" />
              <span>Logs</span>
              {trainingHistory.length > 0 && (
                <span className="text-xs text-white/40 ml-0.5">
                  {trainingHistory.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 flex-1 flex flex-col max-w-5xl">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn()}
              className="flex-1 flex flex-col"
            >
              {/* Chat View */}
              {activeView === 'chat' && (
                <Card className="glass-dark glass-border border-white/20 flex-1 flex flex-col mb-6">
                  <div className="p-3 sm:p-4 md:p-6 border-b border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className="min-w-0 flex-1">
                          <h2 className="font-bold text-white text-base sm:text-lg truncate">
                            {spaceName || lut_name || "Space Chat"}
                          </h2>
                          <div className="flex items-center gap-1.5 sm:gap-2 mt-1 flex-wrap">
                            <span className="text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-primary/20 text-primary/90 border border-primary/30 font-mono truncate max-w-[120px] sm:max-w-none">
                              {lut_name}
                            </span>
                            <span className="text-xs text-white/50 hidden sm:inline">•</span>
                            <span className="text-xs text-white/60 hidden sm:inline">Memory-Augmented LUT</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                        <Button
                          onClick={() => setActiveView('training')}
                          variant="ghost"
                          size="sm"
                          className="h-9 sm:h-8 px-2 sm:px-3 text-white/70 hover:text-white hover:bg-white/10 text-xs sm:text-sm touch-manipulation"
                        >
                          <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
                          <span className="hidden sm:inline">Train</span>
                        </Button>
                        <Button
                          onClick={() => setActiveView('logs')}
                          variant="ghost"
                          size="sm"
                          className="h-9 sm:h-8 px-2 sm:px-3 text-white/70 hover:text-white hover:bg-white/10 text-xs sm:text-sm touch-manipulation"
                        >
                          <ScrollText className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
                          <span className="hidden sm:inline">Logs</span>
                          {trainingHistory.length > 0 && (
                            <span className="ml-1 text-xs text-white/50">
                              ({trainingHistory.length})
                            </span>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setMessages([])}
                          className="h-9 w-9 sm:h-8 sm:w-8 text-white hover:bg-white/10 touch-manipulation"
                          title="Clear chat"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div ref={messagesContainerRef} className="h-[300px] sm:h-[400px] md:h-[480px] overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 flex-1">
                    {!hasMessages ? (
                      <div className="h-full flex flex-col items-center justify-center text-center px-4">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6">
                          <Bot className="w-10 h-10 text-white/80" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          Start a Conversation
                        </h3>
                        <p className="text-white/70 mb-6 max-w-md">
                          Ask me about Astarus AI, our technology, or anything you'd like to know.
                        </p>
                      </div>
                    ) : (
                      <AnimatePresence mode="popLayout">
                        {messages.map((m) => (
                          <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`flex ${
                              m.role === "user"
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`flex items-start gap-3 max-w-[85%] ${
                                m.role === "user" ? "flex-row-reverse" : ""
                              }`}
                            >
                              <div
                                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                  m.role === "user"
                                    ? "bg-gradient-primary text-white"
                                    : "bg-white/10 text-white/80"
                                }`}
                              >
                                {m.role === "user" ? (
                                  <User className="w-4 h-4" />
                                ) : (
                                  <Bot className="w-4 h-4" />
                                )}
                              </div>
                              <div
                                className={`rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                                  m.role === "user"
                                    ? "bg-gradient-primary text-white"
                                    : "bg-white/10 text-white glass-dark"
                                }`}
                              >
                                {m.content}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}

                    {isGenerating && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white/80" />
                          </div>
                          <div className="bg-white/10 text-white glass-dark rounded-2xl px-4 py-3">
                            <div className="typing-indicator">
                              <span className="bg-white/60"></span>
                              <span className="bg-white/60"></span>
                              <span className="bg-white/60"></span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="border-t border-white/10 p-3 sm:p-4 md:p-6">
                    {status && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-3 px-4 py-2 rounded-lg text-sm ${
                          status.includes("success") ||
                          status.includes("stored")
                            ? "bg-green-500/20 text-green-200 border border-green-500/50"
                            : "bg-red-500/20 text-red-200 border border-red-500/50"
                        }`}
                      >
                        {status}
                      </motion.div>
                    )}
                    <div className="flex gap-2 sm:gap-3">
                      <div className="flex-1 relative">
                        <textarea
                          className="w-full resize-none rounded-xl border border-white/20 bg-white/5 px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/30 transition-all"
                          rows={2}
                          placeholder="Ask something about Astarus AI..."
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSend();
                            }
                          }}
                          disabled={isGenerating}
                        />
                      </div>
                      <Button
                        onClick={() => handleSend()}
                        disabled={isGenerating || !input.trim()}
                        className="h-auto min-h-[44px] px-4 sm:px-6 bg-gradient-primary hover:opacity-90 text-white touch-manipulation"
                      >
                        {isGenerating ? (
                          <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Training View */}
              {activeView === 'training' && (
                <Card className="glass-dark glass-border border-white/20 flex-1 flex flex-col mb-6">
                  <div className="p-3 sm:p-4 md:p-6 border-b border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-secondary flex items-center justify-center shadow-lg flex-shrink-0">
                          <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="font-bold text-white text-base sm:text-lg">Train the AI</h2>
                          <p className="text-xs text-white/60">Add knowledge to this space</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                        <Button
                          onClick={() => setActiveView('chat')}
                          variant="ghost"
                          size="sm"
                          className="h-9 sm:h-8 px-2 sm:px-3 text-white/70 hover:text-white hover:bg-white/10 text-xs sm:text-sm touch-manipulation"
                        >
                          <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
                          <span className="hidden sm:inline">Chat</span>
                        </Button>
                        <Button
                          onClick={() => setActiveView('logs')}
                          variant="ghost"
                          size="sm"
                          className="h-9 sm:h-8 px-2 sm:px-3 text-white/70 hover:text-white hover:bg-white/10 text-xs sm:text-sm touch-manipulation"
                        >
                          <ScrollText className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
                          <span className="hidden sm:inline">Logs</span>
                          {trainingHistory.length > 0 && (
                            <span className="ml-1 text-xs text-white/50">
                              ({trainingHistory.length})
                            </span>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">
                        Enter text to train the AI
                      </label>
                      <textarea
                        className="w-full rounded-lg border border-white/20 bg-white/5 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-white placeholder:text-white/50 resize-none focus:outline-none focus:border-primary/50 transition-colors"
                        rows={8}
                        placeholder="Paste or type the text you want to train the AI with. The system will automatically extract key Q&A pairs from it..."
                        value={trainingText}
                        onChange={(e) => setTrainingText(e.target.value)}
                        disabled={isGeneratingQAs}
                      />
                    </div>
                    <Button
                      onClick={handleGenerateQAs}
                      disabled={!trainingText.trim() || isGeneratingQAs}
                      className="w-full min-h-[44px] bg-gradient-secondary hover:opacity-90 text-white touch-manipulation"
                    >
                      {isGeneratingQAs ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Generating Q&A pairs...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Q&A Pairs
                        </>
                      )}
                    </Button>

                    {generatedQAs.length > 0 && (
                      <div className="space-y-4 pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-white">
                            Review and edit Q&A pairs ({generatedQAs.length})
                          </label>
                        </div>
                        <div className="space-y-3 max-h-[500px] overflow-y-auto">
                            {generatedQAs.map((qa) => (
                              <div
                                key={qa.id}
                                className="p-3 rounded-lg border border-white/20 bg-white/5 space-y-2"
                              >
                                <div className="space-y-1">
                                  <label className="text-xs font-medium text-white/60">
                                    Question
                                  </label>
                                  {editingQA === `${qa.id}-question` ? (
                                    <input
                                      type="text"
                                      className="w-full rounded border border-primary/50 bg-white/10 px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                      value={qa.question}
                                      onChange={(e) => handleEditQA(qa.id, 'question', e.target.value)}
                                      onBlur={() => setEditingQA(null)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                          e.preventDefault();
                                          setEditingQA(null);
                                        }
                                      }}
                                      autoFocus
                                    />
                                  ) : (
                                    <p
                                      className="text-sm text-white cursor-pointer hover:bg-white/5 p-1 rounded min-h-[20px]"
                                      onClick={() => setEditingQA(`${qa.id}-question`)}
                                    >
                                      {qa.question}
                                    </p>
                                  )}
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-medium text-white/60">
                                    Answer
                                  </label>
                                  {editingQA === `${qa.id}-answer` ? (
                                    <textarea
                                      className="w-full rounded border border-primary/50 bg-white/10 px-2 py-1 text-sm text-white resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                                      rows={3}
                                      value={qa.answer}
                                      onChange={(e) => handleEditQA(qa.id, 'answer', e.target.value)}
                                      onBlur={() => setEditingQA(null)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Escape') {
                                          setEditingQA(null);
                                        }
                                      }}
                                      autoFocus
                                    />
                                  ) : (
                                    <p
                                      className="text-sm text-white cursor-pointer hover:bg-white/5 p-1 rounded min-h-[40px] whitespace-pre-wrap"
                                      onClick={() => setEditingQA(`${qa.id}-answer`)}
                                    >
                                      {qa.answer}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      if (editingQA === `${qa.id}-question` || editingQA === `${qa.id}-answer`) {
                                        setEditingQA(null);
                                      } else {
                                        setEditingQA(`${qa.id}-question`);
                                      }
                                    }}
                                    className="h-7 px-2 text-white/70 hover:text-white hover:bg-white/10"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleRemoveQA(qa.id)}
                                    className="h-7 px-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                        <Button
                          onClick={handleTrain}
                          disabled={generatedQAs.length === 0}
                          className="w-full min-h-[44px] bg-gradient-primary hover:opacity-90 text-white touch-manipulation"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Train AI ({generatedQAs.length} Q&A pairs)
                        </Button>
                      </div>
                    )}

                    {status && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`px-4 py-2 rounded-lg text-sm ${
                          status.includes("success") ||
                          status.includes("stored")
                            ? "bg-green-500/20 text-green-200 border border-green-500/50"
                            : "bg-red-500/20 text-red-200 border border-red-500/50"
                        }`}
                      >
                        {status}
                      </motion.div>
                    )}
                  </div>
                </Card>
              )}

              {/* Logs View */}
              {activeView === 'logs' && (
                <Card className="glass-dark glass-border border-white/20 flex-1 flex flex-col mb-6">
                  <div className="p-3 sm:p-4 md:p-6 border-b border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-secondary flex items-center justify-center shadow-lg flex-shrink-0">
                          <ScrollText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="font-bold text-white text-base sm:text-lg">Training History</h2>
                          <p className="text-xs text-white/60">View all training activities in this space</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                        <Button
                          onClick={() => setActiveView('chat')}
                          variant="ghost"
                          size="sm"
                          className="h-9 sm:h-8 px-2 sm:px-3 text-white/70 hover:text-white hover:bg-white/10 text-xs sm:text-sm touch-manipulation"
                        >
                          <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
                          <span className="hidden sm:inline">Chat</span>
                        </Button>
                        <Button
                          onClick={() => setActiveView('training')}
                          variant="ghost"
                          size="sm"
                          className="h-9 sm:h-8 px-2 sm:px-3 text-white/70 hover:text-white hover:bg-white/10 text-xs sm:text-sm touch-manipulation"
                        >
                          <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
                          <span className="hidden sm:inline">Train</span>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
                    {trainingHistory.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center px-4">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center mb-6">
                          <ScrollText className="w-10 h-10 text-white/80" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          No Training History
                        </h3>
                        <p className="text-white/70 mb-6 max-w-md">
                          Training activities will appear here once you start training the AI with text.
                        </p>
                        <Button
                          onClick={() => setActiveView('training')}
                          className="bg-gradient-primary hover:opacity-90 text-white"
                        >
                          Go to Training
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {trainingHistory.map((entry, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-4 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                                  <User className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <p className="text-white font-medium">{entry.user}</p>
                                  <p className="text-xs text-white/60">
                                    {new Date(entry.date).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-white font-semibold">{entry.qaCount}</p>
                                <p className="text-xs text-white/60">Q&A pairs</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
