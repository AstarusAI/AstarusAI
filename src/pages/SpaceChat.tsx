import { useState, useMemo, useRef, useEffect, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Send,
  Bot,
  User,
  RefreshCw,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, fadeInUp, staggerContainer } from "@/lib/motion";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://dhzzxfr41qjcz7-8000.proxy.runpod.net";
const MODEL = import.meta.env.VITE_API_MODEL || "mistral";

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

const DEFAULT_THRESHOLD = 0.25;
const GEN_LENGTH = 128;
const DEFAULT_BLOCKS = [-1, -4];
const DEFAULT_RESIDUALS = [0.75, 0.25];

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

function extractAssistantAnswer(userMsg: string, completion: string): string {
  const patternUser = `User: ${userMsg}`;
  let text: string = completion;
  const idxUser = completion.indexOf(patternUser);
  if (idxUser !== -1) {
    text = completion.slice(idxUser + patternUser.length);
  }
  const idxAssistant = text.indexOf("Assistant:");
  if (idxAssistant !== -1) {
    text = text.slice(idxAssistant + "Assistant:".length);
  }
  let answer = text.trim();
  const cutMarkers = ["[INST]", "User:", "Assistant:"];
  let cutIdx = answer.length;
  for (const marker of cutMarkers) {
    const i = answer.indexOf(marker);
    if (i !== -1 && i < cutIdx) {
      cutIdx = i;
    }
  }
  if (cutIdx !== answer.length) {
    answer = answer.slice(0, cutIdx).trim();
  }
  if (!answer) {
    return cleanAnswer(completion.trim());
  }
  return cleanAnswer(answer);
}

async function generateFromApi(
  lutName: string,
  userMsg: string,
  threshold: number,
  wnnBlocks: number[],
  residuals: number[]
): Promise<GenerateResponse> {
  const basePrompt = `User: ${userMsg}\nAssistant:`;
  const prompt = `[INST]${basePrompt}[/INST]`;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // Scroll to top when component mounts - use multiple methods to ensure it works
  useLayoutEffect(() => {
    // Use requestAnimationFrame to ensure this runs after all rendering
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  }, []);

  // Also scroll to top in useEffect as backup
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    
    // Immediate scroll
    scrollToTop();
    
    // Also try after a small delay to override any other scroll operations
    const timer = setTimeout(scrollToTop, 50);
    
    // Mark initial mount as complete
    isInitialMount.current = false;
    
    return () => clearTimeout(timer);
  }, []);

  // Only scroll to messages end when there are actual messages (not on initial mount)
  useEffect(() => {
    if (messages.length > 0 && !isInitialMount.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col bg-gradient-to-b from-black via-primary/5 to-black pt-24">
        <div className="container mx-auto px-4 py-8 flex-1 flex flex-col max-w-5xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn()}
            className="flex-1 flex flex-col"
          >
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">Space Chat</h1>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Info className="w-4 h-4" />
                <span>This brain has its own memory. Corrections only affect this space.</span>
              </div>
            </div>

            <Card className="glass-dark glass-border border-white/20 flex-1 flex flex-col mb-6">
              <Card className="flex-1 flex flex-col overflow-hidden bg-transparent border-0">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-center">
                      <div className="space-y-4">
                        <Bot className="w-16 h-16 mx-auto text-white/30" />
                        <p className="text-white/70">Start a conversation with your AI brain</p>
                      </div>
                    </div>
                  ) : (
                    <AnimatePresence>
                      {messages.map((message, index) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex gap-4 ${
                            message.role === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          {message.role === "assistant" && (
                            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                              <Bot className="w-5 h-5 text-white" />
                            </div>
                          )}
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                              message.role === "user"
                                ? "bg-gradient-primary text-white"
                                : "bg-white/10 text-white glass-dark"
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{message.content}</p>
                          </div>
                          {message.role === "user" && (
                            <div className="w-8 h-8 rounded-full bg-gradient-secondary flex items-center justify-center flex-shrink-0">
                              <User className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                  {isGenerating && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-4 justify-start"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-white/10 text-white glass-dark rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Thinking...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {status && (
                  <div className="px-6 py-2">
                    <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
                      {status}
                    </div>
                  </div>
                )}

                <div className="border-t border-white/10 p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
                      disabled={isGenerating}
                    />
                    <Button
                      onClick={handleSend}
                      disabled={isGenerating || !input.trim()}
                      className="bg-gradient-primary hover:opacity-90 text-white px-6"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </Card>
            </Card>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

