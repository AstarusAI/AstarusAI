import { useState, useMemo, useRef, useEffect, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  Sliders,
  MessageCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Send,
  Bot,
  User,
  Zap,
  Brain,
  Settings2,
  ChevronDown,
  Plus,
  Trash2,
  Info,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, fadeInUp, staggerContainer } from "@/lib/motion";
import { useAuth } from "@/contexts/AuthContext";
import { createChat, saveMessage, updateChatTitle } from "@/lib/chatService";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://dhzzxfr41qjcz7-8000.proxy.runpod.net";
const MODEL = import.meta.env.VITE_API_MODEL || "mistral";

// ---- Chat system prompt + Mistral-style prefix (matches Python CLI) ----

const SYSTEM_PROMPT = `
You are a helpful domain assistant for Astarus AI.

Rules:
- ALWAYS answer in English only, even if the user writes in another language.
- Do not repeat the user's question.
- Be factually accurate and concise.
- If you are unsure, say so briefly rather than inventing details.
`.trim();

/**
 * Match Python:
 * def build_mistral_chat_prefix(user_text: str) -> str:
 *     return (
 *         "[INST]"
 *         + SYSTEM_PROMPT
 *         + "\\n"
 *         + user_text.strip()
 *         + " [/INST]"
 *     )
 */
function buildMistralChatPrefix(
  userMessage: string,
  systemPrompt: string = SYSTEM_PROMPT
): string {
  const trimmedUser = userMessage.trim();
  const sys = systemPrompt.trim();
  return `[INST]${sys}\n${trimmedUser} [/INST]`;
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

type PretrainedLutConfig = {
  label: string;
  lutName: string;
  blocks: number[];
  residualMap: Record<string, number>;
  readOnly?: boolean;
};

// Demo uses fixed lut_name
const DEMO_LUT_NAME = "AstarusAIInternalv16";

// Updated to match CLI blocks: [-1, -5, -9]
const PRETRAINED_LUTS: PretrainedLutConfig[] = [
  {
    label: "Astarus AI Demo",
    lutName: DEMO_LUT_NAME,
    blocks: [-1, -5, -9],
    residualMap: {
      "-1": 0.04,
      "-5": 0.07,
      "-9": 0.07,
    },
    readOnly: true,
  },
];

const READ_ONLY_LUTS = PRETRAINED_LUTS.filter((p) => p.readOnly).map(
  (p) => p.lutName
);

// Defaults for *new* LUTs (you can keep these separate from the demo config)
const DEFAULT_NEW_LUT_BLOCKS = [-1, -4];
const DEFAULT_NEW_LUT_RESIDUALS: Record<string, number> = {
  "-1": 0.2,
  "-4": 0.25,
};

const DEFAULT_THRESHOLD = 0.35;
const GEN_LENGTH = 300;

function generateLutName() {
  const rand = Math.random().toString(16).slice(2, 10);
  return `demo-${rand}`;
}

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

// Old behaviour: just clean the completion, don't try to re-parse conversation
function extractAssistantAnswer(_userMsg: string, completion: string): string {
  return cleanAnswer(completion.trim());
}

// Train LUT with the same chat formatting as Python CLI / old UI:
// - label_context is wrapped with buildMistralChatPrefix(question)
// - label is the raw answer
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
    // Match CLI behaviour
    cost_scale: 8,
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

// Generate using the same chat prefix as the old code / Python CLI
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
    // Match CLI behaviour
    cost_scale: 8,
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

const initialPretrained = PRETRAINED_LUTS[0];

const suggestedQuestions = [
  "What does Astarus AI do?",
  "Who founded Astarus AI?",
  "How does Astarus AI's memory augmentation work?",
  "What makes Astarus AI's technology different?",
];

export default function LutDemo() {
  // Demo always uses fixed lut_name
  const [lutName] = useState<string>(DEMO_LUT_NAME);
  const [lutInput, setLutInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [threshold, setThreshold] = useState(DEFAULT_THRESHOLD);
  const [availableBlocks, setAvailableBlocks] = useState<number[]>(
    initialPretrained ? [...initialPretrained.blocks] : [...DEFAULT_NEW_LUT_BLOCKS]
  );
  const [wnnBlocks, setWnnBlocks] = useState<number[]>(
    initialPretrained ? [...initialPretrained.blocks] : [...DEFAULT_NEW_LUT_BLOCKS]
  );
  const [residualMap, setResidualMap] = useState<Record<string, number>>(
    initialPretrained
      ? { ...initialPretrained.residualMap }
      : { ...DEFAULT_NEW_LUT_RESIDUALS }
  );
  const [newBlockInput, setNewBlockInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [teachOpen, setTeachOpen] = useState(false);
  const [teachQuestion, setTeachQuestion] = useState("");
  const [teachAnswer, setTeachAnswer] = useState("");
  const [lastResidualUsed, setLastResidualUsed] = useState<number | number[]>();
  const [lastThresholdUsed, setLastThresholdUsed] = useState<number>();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  const hasMessages = useMemo(() => messages.length > 0, [messages.length]);
  const isReadOnlyLut = useMemo(
    () => READ_ONLY_LUTS.includes(lutName),
    [lutName]
  );

  const selectedPretrainedValue = useMemo(() => {
    const cfg = PRETRAINED_LUTS.find((p) => p.lutName === lutName);
    return cfg?.lutName ?? "";
  }, [lutName]);

  const currentResiduals = useMemo(
    () => wnnBlocks.map((b) => residualMap[String(b)] ?? 1.0),
    [wnnBlocks, residualMap]
  );

  // Scroll to top when component mounts - use multiple methods to ensure it works
  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  }, []);

  // Also scroll to top in useEffect as backup
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    scrollToTop();
    const timer = setTimeout(scrollToTop, 50);

    isInitialMount.current = false;

    return () => clearTimeout(timer);
  }, []);

  // Only scroll to messages end when there are actual messages (not on initial mount)
  useEffect(() => {
    if (messages.length > 0 && !isInitialMount.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Create a new chat when user is authenticated and starts chatting
  useEffect(() => {
    if (isAuthenticated && user && !currentChatId && messages.length === 0) {
      // Chat will be created when first message is sent
    }
  }, [isAuthenticated, user, currentChatId, messages.length]);

  const resetCommonState = (label?: string) => {
    setMessages([]);
    setStatus(label ?? null);
    setLastResidualUsed(undefined);
    setLastThresholdUsed(undefined);
    setThreshold(DEFAULT_THRESHOLD);
    setTeachOpen(false);
    setTeachQuestion("");
    setTeachAnswer("");
    if (isAuthenticated) {
      setCurrentChatId(null);
    }
  };

  const applyPretrainedConfig = (config: PretrainedLutConfig) => {
    setAvailableBlocks([...config.blocks]);
    setWnnBlocks([...config.blocks]);
    setResidualMap({ ...config.residualMap });
    resetCommonState(`Switched to: ${config.label}`);
  };

  const switchToLut = (name: string) => {
    const config = PRETRAINED_LUTS.find((p) => p.lutName === name);
    if (config) {
      applyPretrainedConfig(config);
      return;
    }
    setAvailableBlocks([...DEFAULT_NEW_LUT_BLOCKS]);
    setWnnBlocks([...DEFAULT_NEW_LUT_BLOCKS]);
    setResidualMap({ ...DEFAULT_NEW_LUT_RESIDUALS });
    resetCommonState(`Switched to LUT: ${name}`);
  };

  const handleSend = async (customMessage?: string) => {
    const trimmed = (customMessage || input).trim();
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

    // Create chat if user is authenticated and this is the first message
    let chatId = currentChatId;
    if (isAuthenticated && user && !chatId) {
      try {
        chatId = await createChat(user.id, trimmed.substring(0, 50));
        setCurrentChatId(chatId);
        if (trimmed.length > 20) {
          updateChatTitle(chatId, trimmed.substring(0, 50));
        }
      } catch (error) {
        console.error("Failed to create chat:", error);
      }
    }

    if (isAuthenticated && chatId) {
      try {
        await saveMessage(chatId, "user", trimmed);
      } catch (error) {
        console.error("Failed to save user message:", error);
      }
    }

    try {
      const resp = await generateFromApi(
        lutName,
        trimmed,
        threshold,
        wnnBlocks,
        currentResiduals
      );
      setLastResidualUsed(resp.residual ?? currentResiduals);
      setLastThresholdUsed(resp.threshold ?? threshold);

      const assistantText = extractAssistantAnswer(trimmed, resp.completion);
      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: assistantText,
      };
      setMessages((prev) => [...prev, assistantMsg]);

      if (isAuthenticated && chatId) {
        try {
          await saveMessage(chatId, "assistant", assistantText);
        } catch (error) {
          console.error("Failed to save assistant message:", error);
        }
      }
    } catch (err: any) {
      setStatus(err?.message || "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewLut = () => {
    const pretrainedNames = PRETRAINED_LUTS.map((p) => p.lutName);
    let newName = generateLutName();
    while (pretrainedNames.includes(newName)) {
      newName = generateLutName();
    }
    switchToLut(newName);
  };

  const handleLoadLut = () => {
    const trimmed = lutInput.trim();
    if (!trimmed) return;
    switchToLut(trimmed);
  };

  const handleTeach = async () => {
    if (isReadOnlyLut) {
      setStatus(
        "This is a pre-trained demo. Create a new LUT to teach custom knowledge."
      );
      return;
    }
    const q = teachQuestion.trim();
    const a = teachAnswer.trim();
    if (!q || !a) {
      setStatus("Please provide both a question and an answer.");
      return;
    }

    setStatus("Teaching custom knowledge...");
    try {
      await trainLut(
        lutName,
        a,
        q,
        wnnBlocks,
        threshold,
        currentResiduals
      );
      setStatus(
        "Knowledge stored successfully! The model will now remember this."
      );
      setTeachQuestion("");
      setTeachAnswer("");
      setTeachOpen(false);
    } catch (err: any) {
      setStatus(err?.message || "Teaching failed");
    }
  };

  const toggleBlock = (block: number) => {
    setWnnBlocks((prev) =>
      prev.includes(block) ? prev.filter((b) => b !== block) : [...prev, block]
    );
  };

  const handleResidualChange = (block: number, value: number) => {
    setResidualMap((prev) => ({
      ...prev,
      [String(block)]: value,
    }));
  };

  const handleDeleteBlock = (block: number) => {
    if (isReadOnlyLut) return;
    setAvailableBlocks((prev) => prev.filter((b) => b !== block));
    setWnnBlocks((prev) => prev.filter((b) => b !== block));
    setResidualMap((prev) => {
      const copy = { ...prev };
      delete copy[String(block)];
      return copy;
    });
  };

  const handleAddBlock = () => {
    if (isReadOnlyLut) return;
    const trimmed = newBlockInput.trim();
    if (!trimmed) return;
    const parsed = parseInt(trimmed, 10);
    if (Number.isNaN(parsed)) {
      setStatus("Please enter a valid integer for the block index.");
      return;
    }
    if (availableBlocks.includes(parsed)) {
      setStatus("That block already exists.");
      return;
    }
    setAvailableBlocks((prev) => [...prev, parsed]);
    setWnnBlocks((prev) => [...prev, parsed]);
    setResidualMap((prev) => ({
      ...prev,
      [String(parsed)]: 1.0,
    }));
    setNewBlockInput("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <Navbar />

      <motion.section
        className="relative pt-28 pb-8 px-4 overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn()}
      >
        <div className="absolute inset-0">
          <img
            src="/futuristic_ai_techno_65818c05.jpg"
            alt="AI Technology Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background/50" />
        </div>
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />

        <div className="container relative z-10 max-w-4xl mx-auto text-center">
          <motion.div variants={fadeInUp(0.1)} className="space-y-6">
            <div className="section-badge mx-auto">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-primary">Interactive Demo</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
              <span className="text-foreground">Experience </span>
              <span className="text-gradient">Memory-Augmented AI</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Chat with our LUT-enhanced Mistral model. The AI has been trained
              with Astarus-specific knowledge that it can recall instantly
              without traditional fine-tuning.
            </p>

            <div className="px-4 py-3 rounded-lg bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 max-w-2xl mx-auto">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Demo only</strong> – To create your own brain,{" "}
                <Link
                  to="/signup"
                  className="underline font-semibold hover:text-amber-900 dark:hover:text-amber-100"
                >
                  sign up
                </Link>
                .
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border shadow-sm">
                <Brain className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Model: </span>
                <span className="font-semibold text-foreground">{MODEL}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border shadow-sm">
                <Zap className="w-4 h-4 text-secondary" />
                <span className="text-muted-foreground">LUT: </span>
                <span className="font-mono font-semibold text-foreground">
                  {lutName}
                </span>
                {isReadOnlyLut && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
                    Demo
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="py-8 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeIn()}
      >
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div className="lg:col-span-2" variants={fadeInUp(0.1)}>
              <Card className="overflow-hidden border-0 shadow-xl bg-card/80 backdrop-blur-sm">
                <div className="p-4 sm:p-6 border-b bg-gradient-to-r from-primary/5 via-transparent to-secondary/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="font-bold text-foreground">AI Chat</h2>
                        <p className="text-sm text-muted-foreground">
                          Powered by Memory-Augmented LUT
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {lastThresholdUsed !== undefined && (
                        <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                          Threshold: {lastThresholdUsed.toFixed(2)}
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMessages([])}
                        className="h-8 w-8"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="h-[400px] sm:h-[480px] overflow-y-auto p-4 sm:p-6 space-y-4">
                  {!hasMessages ? (
                    <div className="h-full flex flex-col items-center justify-center text-center px-4">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-6">
                        <Bot className="w-10 h-10 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        Start a Conversation
                      </h3>
                      <p className="text-muted-foreground mb-6 max-w-md">
                        Ask me about Astarus AI, our technology, or try teaching
                        me something new.
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {suggestedQuestions.map((q, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(q)}
                            className="px-4 py-2 text-sm rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-all duration-200 border hover:border-primary/30"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
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
                                  : "bg-muted text-muted-foreground"
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
                                  ? "chat-bubble-user text-white"
                                  : "chat-bubble-ai text-foreground"
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
                        <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
                          <Bot className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="chat-bubble-ai px-4 py-3">
                          <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 sm:p-6 border-t bg-gradient-to-r from-transparent via-muted/30 to-transparent">
                  {status && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mb-3 px-4 py-2 rounded-lg text-sm ${
                        status.includes("success") ||
                        status.includes("stored") ||
                        status.includes("Stored this Q&A")
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {status}
                    </motion.div>
                  )}
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <textarea
                        className="w-full resize-none rounded-xl border-2 border-muted bg-background px-4 py-3 pr-12 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
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
                      />
                    </div>
                    <Button
                      onClick={() => handleSend()}
                      disabled={isGenerating || !input.trim()}
                      className="h-auto px-6 bg-gradient-primary hover:opacity-90 text-white shadow-lg shadow-primary/25"
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
            </motion.div>

            <motion.div
              className="space-y-4"
              variants={staggerContainer(0.1, 0.05)}
            >
              <motion.div variants={fadeInUp(0.1)}>
                <Card className="p-5 border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                        <Settings2 className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-bold text-foreground">LUT Controls</h3>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={handleNewLut}
                      title="Create new LUT"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Pre-trained Models
                      </label>
                      <select
                        className="w-full rounded-lg border-2 border-muted bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                        value={selectedPretrainedValue}
                        onChange={(e) => {
                          const config = PRETRAINED_LUTS.find(
                            (p) => p.lutName === e.target.value
                          );
                          if (config) applyPretrainedConfig(config);
                        }}
                      >
                        <option value="">Select a model...</option>
                        {PRETRAINED_LUTS.map((p) => (
                          <option key={p.lutName} value={p.lutName}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-muted" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                          or load custom
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 rounded-lg border-2 border-muted bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary/50 transition-colors"
                        placeholder="Enter LUT name..."
                        value={lutInput}
                        onChange={(e) => setLutInput(e.target.value)}
                      />
                      <Button onClick={handleLoadLut} variant="outline" size="sm">
                        Load
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp(0.2)}>
                <Card className="p-5 border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-secondary flex items-center justify-center">
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-bold text-foreground">Teach the AI</h3>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setTeachOpen(!teachOpen)}
                      className="gap-1"
                    >
                      {teachOpen ? "Close" : "Expand"}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          teachOpen ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </div>

                  <AnimatePresence>
                    {teachOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-3 overflow-hidden"
                      >
                        {isReadOnlyLut && (
                          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
                            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-700">
                              This is a read-only demo LUT. Create a new LUT to
                              add custom knowledge.
                            </p>
                          </div>
                        )}
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground">
                            Question
                          </label>
                          <input
                            type="text"
                            className="w-full rounded-lg border-2 border-muted bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                            placeholder="What is your favorite color?"
                            value={teachQuestion}
                            onChange={(e) => setTeachQuestion(e.target.value)}
                            disabled={isReadOnlyLut}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground">
                            Answer
                          </label>
                          <textarea
                            className="w-full rounded-lg border-2 border-muted bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:border-primary/50 transition-colors"
                            rows={2}
                            placeholder="My favorite color is purple."
                            value={teachAnswer}
                            onChange={(e) => setTeachAnswer(e.target.value)}
                            disabled={isReadOnlyLut}
                          />
                        </div>
                        <Button
                          onClick={handleTeach}
                          disabled={
                            isReadOnlyLut ||
                            !teachQuestion.trim() ||
                            !teachAnswer.trim()
                          }
                          className="w-full bg-gradient-secondary hover:opacity-90 text-white"
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Teach Model
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!teachOpen && (
                    <p className="text-sm text-muted-foreground">
                      Add custom Q&A pairs to personalize the model's responses
                      in real-time.
                    </p>
                  )}
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp(0.3)}>
                <Card className="p-5 border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                        <Sliders className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <h3 className="font-bold text-foreground">
                        Advanced Settings
                      </h3>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground transition-transform ${
                        showAdvanced ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {showAdvanced && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 space-y-4 overflow-hidden"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-medium text-muted-foreground">
                              Threshold
                            </label>
                            <span className="text-xs font-mono text-foreground">
                              {threshold.toFixed(2)}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={threshold}
                            onChange={(e) =>
                              setThreshold(parseFloat(e.target.value))
                            }
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground">
                            Active Blocks
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {availableBlocks.map((block) => (
                              <div
                                key={block}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer transition-all ${
                                  wnnBlocks.includes(block)
                                    ? "bg-primary/10 text-primary border-2 border-primary/30"
                                    : "bg-muted text-muted-foreground border-2 border-transparent"
                                }`}
                                onClick={() => toggleBlock(block)}
                              >
                                {wnnBlocks.includes(block) && (
                                  <Check className="w-3 h-3" />
                                )}
                                Block {block}
                                {!isReadOnlyLut && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteBlock(block);
                                    }}
                                    className="ml-1 hover:text-destructive"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {!isReadOnlyLut && (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              className="flex-1 rounded-lg border-2 border-muted bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary/50 transition-colors"
                              placeholder="Block index"
                              value={newBlockInput}
                              onChange={(e) => setNewBlockInput(e.target.value)}
                            />
                            <Button
                              onClick={handleAddBlock}
                              size="sm"
                              variant="outline"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        )}

                        {wnnBlocks.length > 0 && (
                          <div className="space-y-3">
                            <label className="text-xs font-medium text-muted-foreground">
                              Block Residuals
                            </label>
                            {wnnBlocks.map((block) => (
                              <div key={block} className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="font-mono">
                                    Block {block}
                                  </span>
                                  <span className="font-mono">
                                    {(
                                      residualMap[String(block)] ?? 1.0
                                    ).toFixed(2)}
                                  </span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="2"
                                  step="0.05"
                                  value={residualMap[String(block)] ?? 1.0}
                                  onChange={(e) =>
                                    handleResidualChange(
                                      block,
                                      parseFloat(e.target.value)
                                    )
                                  }
                                  disabled={isReadOnlyLut}
                                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary disabled:opacity-50"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp(0.4)}>
                <Card className="p-5 border-0 shadow-lg bg-gradient-to-br from-primary/5 to-secondary/5">
                  <div className="flex items-center gap-2 mb-3">
                    <Rocket className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-foreground">How It Works</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        1
                      </span>
                      <span>
                        LUT stores knowledge as embedding corrections
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        2
                      </span>
                      <span>
                        During inference, relevant corrections are retrieved
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        3
                      </span>
                      <span>
                        Model outputs are steered toward learned behavior
                      </span>
                    </li>
                  </ul>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
