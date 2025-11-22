import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  Sliders,
  Database,
  MessageCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn, fadeInUp, staggerContainer } from "@/lib/motion";

const BASE_URL = "https://fhd5rgv0o0dd8i-8000.proxy.runpod.net";
const MODEL = "mistral";

// Match the Python script defaults
const DEFAULT_THRESHOLD = 0.20;
const AVAILABLE_WNN_BLOCKS = [-1, -4] as const;
const DEFAULT_WNN_BLOCKS = [-1, -4];
const DEFAULT_RESIDUAL_MAP: Record<string, number> = {
  "-1": 0.75,
  "-4": 0.25,
};
const GEN_LENGTH = 128;

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

const fakeDocs: { question: string; answer: string }[] = [
  // Identity & location
  {
    question: "What is Astarus AI?",
    answer:
      "Astarus AI is an AI infrastructure startup focused on continuously learning language-model applications.",
  },
  {
    question: "Where is Astarus AI based?",
    answer: "Astarus AI is based in London.",
  },
  {
    question: "Who founded Astarus AI?",
    answer: "Astarus AI was founded by Rafayel Latif.",
  },

  // What it does / who it serves
  {
    question: "What kinds of products does Astarus AI help teams build?",
    answer:
      "Astarus AI helps teams build continuously learning language-model applications for personalization, copilots, and domain-specific assistants.",
  },
  {
    question: "What types of customers does Astarus AI work with?",
    answer:
      "Astarus AI works with product teams and enterprises that need domain-specific and personalized LLMs.",
  },

  // Core LUT-LLM idea
  {
    question: "What is the core idea behind Astarus AI’s LUT-LLM architecture?",
    answer:
      "Astarus AI embeds a lightweight lookup-table layer inside transformer blocks so models can adapt in place from live user interactions.",
  },
  {
    question: "How does Astarus AI differ from standard fine-tuning?",
    answer:
      "Instead of retraining base model weights, Astarus AI keeps the base model frozen and updates fast LUTs for each user or tenant.",
  },
  {
    question: "How does Astarus AI differ from classic RAG pipelines?",
    answer:
      "Compared with classic RAG, Astarus AI uses LUTs inside the model to store and recall user- and tenant-specific behavior without relying purely on external retrieval.",
  },

  // Continuous learning / personalization
  {
    question: "How does Astarus AI learn from live user interactions?",
    answer:
      "Astarus AI updates per-user or per-tenant LUTs from live interactions so the model gradually adapts to each team’s style and edge cases.",
  },
  {
    question: "How does Astarus AI use LUTs for personalization?",
    answer:
      "Each user or tenant gets its own LUT, which stores patterns from their data and feedback so responses become more personalized over time.",
  },

  // Products & use cases
  {
    question: "What core product modules does Astarus AI provide?",
    answer:
      "Astarus AI provides a core LUT-LLM engine, an API for per-user and per-tenant personalization, and tooling for feedback loops and evaluation.",
  },
  {
    question: "In which use cases is Astarus AI typically applied?",
    answer:
      "Astarus AI is used in customer support, internal knowledge assistants, sales enablement, and research copilots.",
  },
  {
    question: "Which industries can benefit from Astarus AI?",
    answer:
      "Astarus AI is used across SaaS, fintech, and other knowledge-heavy industries.",
  },
];

function generateLutName() {
  const rand = Math.random().toString(16).slice(2, 10);
  return `demo-${rand}`;
}

/**
 * Clean up raw assistant text:
 * - Remove "Assistant:" prefixes
 * - Chop off any trailing "User: ..." segments
 * - Remove junk like ".:" and everything after that
 */
function cleanAnswer(raw: string): string {
  let text = raw;

  // Remove leading "Assistant:"
  text = text.replace(/^Assistant:\s*/i, "");
  // Remove "Assistant:" when it appears at the start of a new line
  text = text.replace(/\nAssistant:\s*/gi, "\n");

  // Drop everything after a later "User:"
  const userIdx = text.indexOf("\nUser:");
  if (userIdx !== -1) {
    text = text.slice(0, userIdx);
  }

  // Handle ".:" artefact, keep everything up to the period
  const dotColonIdx = text.indexOf(".:");
  if (dotColonIdx !== -1) {
    text = text.slice(0, dotColonIdx + 1);
  }

  // Fix newline followed by stray period
  text = text.replace(/\n\./g, ".");

  // Collapse multiple blank lines
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
}

/**
 * Mirror the Python extract_assistant_answer(user_msg, completion)
 */
function extractAssistantAnswer(userMsg: string, completion: string): string {
  const patternUser = `User: ${userMsg}`;
  let text: string;

  const idxUser = completion.indexOf(patternUser);
  if (idxUser !== -1) {
    text = completion.slice(idxUser + patternUser.length);
  } else {
    text = completion;
  }

  const idxAssistant = text.indexOf("Assistant:");
  if (idxAssistant !== -1) {
    text = text.slice(idxAssistant + "Assistant:".length);
  }

  const nextUser = text.indexOf("User:");
  if (nextUser !== -1) {
    text = text.slice(0, nextUser);
  }

  const answer = text.trim();
  if (!answer) {
    return cleanAnswer(completion.trim());
  }
  return cleanAnswer(answer);
}

async function trainLut(
  lutName: string,
  label: string,
  labelContext: string | null,
  wnnBlocks: number[]
) {
  const payload = {
    label,
    label_context: labelContext,
    lut_name: lutName,
    model: MODEL,
    wnn_blocks: wnnBlocks,
    sparsity: 1.0,
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

async function trainFakeDocs(lutName: string, wnnBlocks: number[]) {
  for (const doc of fakeDocs) {
    const label = doc.answer;
    const ctx = doc.question;
    await trainLut(lutName, label, ctx, wnnBlocks);
  }
}

async function generateFromApi(
  lutName: string,
  userMsg: string,
  threshold: number,
  wnnBlocks: number[],
  residuals: number[]
): Promise<GenerateResponse> {
  const prompt = `User: ${userMsg}\nAssistant:`; // same as CLI

  const payload = {
    prompt,
    length: GEN_LENGTH,
    lut_name: lutName,
    model: MODEL,
    threshold,
    residuals, // plural, as in your Python script
    wnn_blocks: wnnBlocks,
  };

  console.log("POST /generate payload:", payload);

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

export default function LutDemo() {
  const [lutName, setLutName] = useState<string>(() => generateLutName());
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [threshold, setThreshold] = useState(DEFAULT_THRESHOLD);

  const [wnnBlocks, setWnnBlocks] = useState<number[]>(DEFAULT_WNN_BLOCKS);
  const [residualMap, setResidualMap] = useState<Record<string, number>>(
    DEFAULT_RESIDUAL_MAP
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [isTrainingDocs, setIsTrainingDocs] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [teachOpen, setTeachOpen] = useState(false);
  const [teachQuestion, setTeachQuestion] = useState("");
  const [teachAnswer, setTeachAnswer] = useState("");
  const [lastResidualUsed, setLastResidualUsed] = useState<number | number[]>();
  const [lastThresholdUsed, setLastThresholdUsed] = useState<number>();

  const hasMessages = useMemo(() => messages.length > 0, [messages.length]);

  // Residual array aligned with wnnBlocks
  const currentResiduals = useMemo(
    () => wnnBlocks.map((b) => residualMap[String(b)] ?? 1.0),
    [wnnBlocks, residualMap]
  );

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
    } catch (err: any) {
      setStatus(err?.message || "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewLut = () => {
    const newName = generateLutName();
    setLutName(newName);
    setMessages([]);
    setStatus(`Switched to new LUT: ${newName}`);
    setLastResidualUsed(undefined);
    setLastThresholdUsed(undefined);
    setWnnBlocks(DEFAULT_WNN_BLOCKS);
    setResidualMap(DEFAULT_RESIDUAL_MAP);
  };

  const handleTrainFakeDocsClick = async () => {
    if (isTrainingDocs) return;
    setIsTrainingDocs(true);
    setStatus("Training LUT on Astarus AI example docs...");
    try {
      await trainFakeDocs(lutName, wnnBlocks);
      setStatus("✅ Trained on Astarus AI internal example docs.");
    } catch (err: any) {
      setStatus(err?.message || "Training failed");
    } finally {
      setIsTrainingDocs(false);
    }
  };

  const handleTeach = async () => {
    const q = teachQuestion.trim();
    const a = teachAnswer.trim();
    if (!q || !a) {
      setStatus("Please provide both a question and an answer.");
      return;
    }

    const label = `User: ${q}\nAssistant: ${a}`;
    setStatus("Teaching custom Q&A to LUT...");
    try {
      await trainLut(lutName, label, null, wnnBlocks);
      setStatus("✅ Stored this Q&A in the LUT. Future answers should reflect it.");
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

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <motion.section
        className="relative pt-32 pb-20 px-4 overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn()}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/40 to-background/90" />

        <div className="container relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center space-y-6"
            variants={fadeInUp(0.1)}
          >
            <h1 className="text-primary">LUT-LLM Interactive Demo</h1>
            <p className="text-xl text-muted-foreground">
              Play with a lookup-table augmented Mistral model. Teach it facts,
              tune its memory, and see how residuals &amp; thresholds change its
              behaviour in real time.
            </p>
            <div className="flex flex-wrap gap-3 justify-center text-sm text-muted-foreground">
              <span className="px-3 py-1 rounded-full bg-background/60 border">
                Model: <span className="font-mono">{MODEL}</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-background/60 border">
                LUT name:{" "}
                <span className="font-mono text-primary">{lutName}</span>
              </span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Demo Section */}
      <motion.section
        className="py-16 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn()}
      >
        <div className="container max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat + Status */}
          <motion.div
            className="lg:col-span-2 space-y-4"
            variants={staggerContainer(0.1, 0.05)}
          >
            <motion.div variants={fadeInUp(0.1)}>
              <Card className="p-6 h-[520px] flex flex-col bg-background/80 border-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">
                      Chat with your personalized model
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {lastThresholdUsed !== undefined && (
                      <span>
                        Thresh used:{" "}
                        <span className="font-mono">
                          {lastThresholdUsed.toFixed(2)}
                        </span>
                      </span>
                    )}
                    {lastResidualUsed !== undefined && (
                      <span>
                        Residual used:{" "}
                        <span className="font-mono">
                          {Array.isArray(lastResidualUsed)
                            ? lastResidualUsed.join(", ")
                            : lastResidualUsed}
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                  {!hasMessages && (
                    <div className="text-sm text-muted-foreground">
                      <p className="mb-2">Try asking things like:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>“What does Astarus AI do?”</li>
                        <li>“Where does Astarus AI focus on?”</li>
                        <li>“Explain Astarus AI&apos;s LUT-LLMs.”</li>
                      </ul>
                      <p className="mt-3">
                        You can also teach the model your own Q&amp;A pairs
                        below.
                      </p>
                    </div>
                  )}

                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${
                        m.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${
                          m.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-muted text-foreground rounded-bl-sm"
                        }`}
                      >
                        {m.content}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex gap-2">
                    <textarea
                      className="flex-1 resize-none rounded-xl border bg-background/80 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
                      rows={2}
                      placeholder="Type a question for the model..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                    />
                    <Button
                      onClick={handleSend}
                      disabled={isGenerating || !input.trim()}
                      className="self-end h-9 w-24 flex items-center justify-center"
                    >
                      {isGenerating ? (
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Thinking</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <span>Send</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </div>
                  {status && (
                    <p className="text-xs text-muted-foreground">{status}</p>
                  )}
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Controls / Teaching / Docs */}
          <motion.div
            className="space-y-6"
            variants={staggerContainer(0.15, 0.07)}
          >
            {/* Controls */}
            <motion.div variants={fadeInUp(0.1)}>
              <Card className="p-5 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">
                      LUT Controls
                    </h3>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={handleNewLut}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4 text-sm">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-muted-foreground">Threshold</span>
                      <span className="font-mono text-xs">
                        {threshold.toFixed(2)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={threshold}
                      onChange={(e) =>
                        setThreshold(parseFloat(e.target.value || "0"))
                      }
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      How often the LUT is allowed to speak at all.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-muted-foreground">
                        WNN Blocks &amp; Residuals
                      </span>
                    </div>

                    {AVAILABLE_WNN_BLOCKS.map((block) => {
                      const enabled = wnnBlocks.includes(block);
                      const residual =
                        residualMap[String(block)] ??
                        DEFAULT_RESIDUAL_MAP[String(block)] ??
                        1.0;

                      return (
                        <div
                          key={block}
                          className="border rounded-lg px-3 py-2 space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-xs">
                              <input
                                type="checkbox"
                                checked={enabled}
                                onChange={() => toggleBlock(block)}
                              />
                              <span className="text-muted-foreground">
                                Block {block}
                              </span>
                            </label>
                            <span className="font-mono text-xs">
                              {residual.toFixed(2)}
                            </span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={2.5}
                            step={0.1}
                            value={residual}
                            onChange={(e) =>
                              handleResidualChange(
                                block,
                                parseFloat(e.target.value || "0")
                              )
                            }
                            disabled={!enabled}
                            className="w-full"
                          />
                          <p className="text-[10px] text-muted-foreground">
                            How loud the LUT for block {block} is once it’s in.
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Teaching Card */}
            <motion.div variants={fadeInUp(0.15)}>
              <Card className="p-5 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-secondary" />
                  <h3 className="font-semibold text-foreground">
                    Teach Custom Q&amp;A
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Imprint a specific Q&amp;A. The model will treat it as a
                  strong memory via the LUT (using your currently enabled WNN
                  blocks).
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-1"
                  onClick={() => setTeachOpen((x) => !x)}
                >
                  {teachOpen ? "Hide teaching form" : "Open teaching form"}
                </Button>

                {teachOpen && (
                  <div className="space-y-2 mt-3">
                    <div className="space-y-1 text-xs">
                      <label className="text-muted-foreground">
                        Question (what the user might ask)
                      </label>
                      <textarea
                        className="w-full rounded-lg border bg-background/80 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-secondary/60"
                        rows={2}
                        value={teachQuestion}
                        onChange={(e) => setTeachQuestion(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1 text-xs">
                      <label className="text-muted-foreground">
                        Ideal answer from the assistant
                      </label>
                      <textarea
                        className="w-full rounded-lg border bg-background/80 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-secondary/60"
                        rows={3}
                        value={teachAnswer}
                        onChange={(e) => setTeachAnswer(e.target.value)}
                      />
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={handleTeach}
                    >
                      Store Q&amp;A in LUT
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Fake Docs Training */}
            <motion.div variants={fadeInUp(0.2)}>
              <Card className="p-5 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <Database className="w-5 h-5 text-accent" />
                  <h3 className="font-semibold text-foreground">
                    Astarus AI Internal Example Docs
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Load a small curated knowledge base about Astarus AI into the
                  LUT. Then ask the model questions about Astarus AI. Training
                  uses your currently enabled WNN blocks.
                </p>
                <Button
                  size="sm"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleTrainFakeDocsClick}
                  disabled={isTrainingDocs}
                >
                  {isTrainingDocs ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Training on docs...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4" />
                      Train on Astarus AI Internal Example docs.
                    </>
                  )}
                </Button>
              </Card>
            </motion.div>

            {/* Quick Notes */}
            <motion.div variants={fadeInUp(0.25)}>
              <Card className="p-5 space-y-3 bg-muted/40">
                <div className="flex items-center gap-2 mb-1">
                  <MessageCircle className="w-5 h-5 text-success" />
                  <h3 className="font-semibold text-foreground">
                    How to play with this demo
                  </h3>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1.5">
                  <li>
                    • Click “Train on Astarus AI Internal Example docs” to load
                    factual knowledge (with your chosen WNN blocks).
                  </li>
                  <li>• Ask questions about Astarus AI and see how answers improve.</li>
                  <li>
                    • Increase the residual for a block to make that LUT “louder”
                    versus base Mistral.
                  </li>
                  <li>
                    • Lower the threshold to make the LUT fire more often; raise
                    it to rely more on the base model.
                  </li>
                  <li>
                    • Use “Store Q&amp;A in LUT” for your own custom memories.
                  </li>
                </ul>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container">
          <Card className="max-w-4xl mx-auto p-10 text-center gradient-bg text-white">
            <h2 className="text-black mb-4">LUTs inside real LLMs</h2>
            <p className="text-sm sm:text-base mb-6 text-black/90">
              This demo shows a single-user LUT on top of a 7B-class model.
              Imagine per-user LUTs for thousands of users, all updating in real
              time without retraining the base model.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="sm" className="group">
                View API Docs
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-primary hover:bg-white/90"
              >
                Talk to us about pilots
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
