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
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn, fadeInUp, staggerContainer } from "@/lib/motion";

const BASE_URL = "https://dhzzxfr41qjcz7-8000.proxy.runpod.net";
const MODEL = "mistral";

// Types
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

// Pre-trained LUT demos (dropdown)
const PRETRAINED_LUTS: PretrainedLutConfig[] = [
  {
    label: "Astarus AI demo",
    lutName: "demo-f0d18034",
    blocks: [-1, -4, -9],
    residualMap: {
      "-1": 0.15,
      "-4": 0.15,
      "-9": 0.15,
    },
    readOnly: true,
  },
  // Add more pre-trained configs here later if you want
];

// Any pre-trained marked readOnly is treated as protected
const READ_ONLY_LUTS = PRETRAINED_LUTS.filter((p) => p.readOnly).map(
  (p) => p.lutName
);

// Defaults for *new* (non-pretrained) LUTs
const DEFAULT_NEW_LUT_BLOCKS = [-1, -4];
const DEFAULT_NEW_LUT_RESIDUALS: Record<string, number> = {
  "-1": 0.75,
  "-4": 0.25,
};

// Match the Python script defaults
const DEFAULT_THRESHOLD = 0.25;
const GEN_LENGTH = 128;

function generateLutName() {
  const rand = Math.random().toString(16).slice(2, 10);
  return `demo-${rand}`;
}

/**
 * Clean up raw assistant text
 */
function cleanAnswer(raw: string): string {
  let text = raw;

  // Strip obvious [INST] wrappers if they slip through
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

/**
 * Mirror the Python extract_assistant_answer(user_msg, completion)
 */
function extractAssistantAnswer(userMsg: string, completion: string): string {
  const patternUser = `User: ${userMsg}`;
  let text: string = completion;

  // Scope down to the part after the specific "User: <msg>"
  const idxUser = completion.indexOf(patternUser);
  if (idxUser !== -1) {
    text = completion.slice(idxUser + patternUser.length);
  }

  // Then find the first "Assistant:" after that
  const idxAssistant = text.indexOf("Assistant:");
  if (idxAssistant !== -1) {
    text = text.slice(idxAssistant + "Assistant:".length);
  }

  let answer = text.trim();

  // Cut off at any of these markers: next [INST], next User:, or next Assistant:
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
async function trainLut(
  lutName: string,
  label: string,
  labelContext: string | null,
  wnnBlocks: number[]
) {

  const wrappedLabel = `[INST]${label}[/INST]`;
  const wrappedContext = labelContext ? `${labelContext}</s>` : null;

  const payload = {
    label: wrappedLabel,
    label_context: wrappedContext,
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


// Use the first pre-trained LUT as the default (Astarus AI demo)
const initialPretrained = PRETRAINED_LUTS[0];

export default function LutDemo() {
  const [lutName, setLutName] = useState<string>(
    () => initialPretrained?.lutName ?? generateLutName()
  );
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
  const [isTrainingDocs, setIsTrainingDocs] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [teachOpen, setTeachOpen] = useState(false);
  const [teachQuestion, setTeachQuestion] = useState("");
  const [teachAnswer, setTeachAnswer] = useState("");
  const [lastResidualUsed, setLastResidualUsed] = useState<number | number[]>();
  const [lastThresholdUsed, setLastThresholdUsed] = useState<number>();

  const hasMessages = useMemo(() => messages.length > 0, [messages.length]);
  const isReadOnlyLut = useMemo(
    () => READ_ONLY_LUTS.includes(lutName),
    [lutName]
  );

  // Controlled value for the dropdown based on current lutName
  const selectedPretrainedValue = useMemo(() => {
    const cfg = PRETRAINED_LUTS.find((p) => p.lutName === lutName);
    return cfg?.lutName ?? "";
  }, [lutName]);

  // Residual array aligned with active wnnBlocks
  const currentResiduals = useMemo(
    () => wnnBlocks.map((b) => residualMap[String(b)] ?? 1.0),
    [wnnBlocks, residualMap]
  );

  const resetCommonState = (label?: string) => {
    setMessages([]);
    setStatus(label ?? null);
    setLastResidualUsed(undefined);
    setLastThresholdUsed(undefined);
    setThreshold(DEFAULT_THRESHOLD);
    setTeachOpen(false);
    setTeachQuestion("");
    setTeachAnswer("");
  };

  const applyPretrainedConfig = (config: PretrainedLutConfig) => {
    // Copy arrays/objects so state is totally reset
    setLutName(config.lutName);
    setAvailableBlocks([...config.blocks]);
    setWnnBlocks([...config.blocks]);
    setResidualMap({ ...config.residualMap });
    resetCommonState(`Switched to pre-trained LUT: ${config.label}`);
  };

  const switchToLut = (name: string) => {
    const config = PRETRAINED_LUTS.find((p) => p.lutName === name);
    if (config) {
      applyPretrainedConfig(config);
      return;
    }

    setLutName(name);
    setAvailableBlocks([...DEFAULT_NEW_LUT_BLOCKS]);
    setWnnBlocks([...DEFAULT_NEW_LUT_BLOCKS]);
    setResidualMap({ ...DEFAULT_NEW_LUT_RESIDUALS });
    resetCommonState(`Switched to LUT: ${name}`);
  };

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
        "This LUT is a pre-trained demo. Create or load another LUT to teach custom Q&A."
      );
      return;
    }

    const q = teachQuestion.trim();
    const a = teachAnswer.trim();
    if (!q || !a) {
      setStatus("Please provide both a question and an answer.");
      return;
    }
    const label_context = `User: ${q}\nAssistant: `;
    const label = a;
    setStatus("Teaching custom Q&A to LUT...");
    try {
      await trainLut(lutName, label, label_context, wnnBlocks);
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
      setStatus("Please enter a valid integer for the LUT block index.");
      return;
    }

    if (availableBlocks.includes(parsed)) {
      setStatus("That LUT block already exists.");
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
              Play with a lookup-table augmented Mistral model. The default LUT
              is pre-loaded with Astarus AI notes so you can start asking
              questions immediately.
            </p>
            <div className="flex flex-wrap gap-3 justify-center text-sm text-muted-foreground">
              <span className="px-3 py-1 rounded-full bg-background/60 border">
                Model: <span className="font-mono">{MODEL}</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-background/60 border flex items-center gap-2">
                LUT name:{" "}
                <span className="font-mono text-primary">{lutName}</span>
                {isReadOnlyLut && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30">
                    pre-trained demo
                  </span>
                )}
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
                        <li>“Who founded Astarus AI?”</li>
                        <li>“Explain Astarus AI in 3-4 sentences.”</li>
                      </ul>
                      <p className="mt-3">
                        Or create/load another LUT on the right to train your
                        own memories.
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
                    title="Create a new random LUT"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>

                {/* Pre-trained demos dropdown (controlled by lutName) */}
                {PRETRAINED_LUTS.length > 0 && (
                  <div className="space-y-1 text-xs mb-2">
                    <label className="text-muted-foreground">
                      Pre-trained demos
                    </label>
                    <select
                      className="w-full rounded-lg border bg-background/80 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary/60"
                      value={selectedPretrainedValue}
                      onChange={(e) => {
                        const val = e.target.value;
                        const config = PRETRAINED_LUTS.find(
                          (p) => p.lutName === val
                        );
                        if (config) applyPretrainedConfig(config);
                      }}
                    >
                      <option value="">None / custom</option>
                      {PRETRAINED_LUTS.map((p) => (
                        <option key={p.lutName} value={p.lutName}>
                          {p.label} ({p.lutName})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Load / switch LUT by name */}
                <div className="space-y-2 text-xs">
                  <label className="text-muted-foreground">
                    Load or switch LUT by name
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 rounded-lg border bg-background/80 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary/60"
                      placeholder="e.g. demo-myteam123"
                      value={lutInput}
                      onChange={(e) => setLutInput(e.target.value)}
                    />
                    <Button size="sm" variant="outline" onClick={handleLoadLut}>
                      Load
                    </Button>
                  </div>
                  {isReadOnlyLut && (
                    <p className="text-[11px] text-amber-500">
                      This LUT is a pre-trained Astarus demo. Create or load
                      another LUT to train it.
                    </p>
                  )}
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

                    {availableBlocks.map((block) => {
                      const enabled = wnnBlocks.includes(block);
                      const residual =
                        residualMap[String(block)] ??
                        DEFAULT_NEW_LUT_RESIDUALS[String(block)] ??
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
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs">
                                {residual.toFixed(2)}
                              </span>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6"
                                onClick={() => handleDeleteBlock(block)}
                                disabled={isReadOnlyLut}
                                title={
                                  isReadOnlyLut
                                    ? "Cannot delete blocks in pre-trained demos"
                                    : "Delete this block"
                                }
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={2.5}
                            step={0.025}
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

                    {!isReadOnlyLut && (
                      <div className="mt-3 space-y-1 text-xs">
                        <label className="text-muted-foreground">
                          Add LUT block
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="flex-1 rounded-lg border bg-background/80 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary/60"
                            placeholder="e.g. -9 or 12"
                            value={newBlockInput}
                            onChange={(e) => setNewBlockInput(e.target.value)}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleAddBlock}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    )}
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

                {isReadOnlyLut && (
                  <p className="text-[11px] text-amber-500">
                    The current LUT is a pre-trained Astarus demo. Create or
                    load another LUT to store your own Q&amp;A memories.
                  </p>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-1"
                  onClick={() => {
                    if (isReadOnlyLut) return;
                    setTeachOpen((x) => !x);
                  }}
                  disabled={isReadOnlyLut}
                >
                  {teachOpen ? "Hide teaching form" : "Open teaching form"}
                </Button>

                {teachOpen && !isReadOnlyLut && (
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
                  LUT. For the default Astarus demo LUT, this knowledge is
                  already pre-loaded so you can start chatting right away.
                </p>

                {isReadOnlyLut && (
                  <p className="text-[11px] text-muted-foreground">
                    This pre-trained demo LUT already has the Astarus docs baked
                    in. Switch to a custom LUT if you want to run the training
                    flow yourself.
                  </p>
                )}
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
                    • The default LUT{" "}
                    <span className="font-mono">
                      {initialPretrained?.lutName}
                    </span>{" "}
                    is pre-trained on Astarus AI notes and is read-only.
                  </li>
                  <li>
                    • Use the pre-trained dropdown to jump back to the Astarus
                    demo or any future demos you add.
                  </li>
                  <li>
                    • Click the refresh icon in “LUT Controls” to create a new
                    trainable LUT.
                  </li>
                  <li>
                    • Use the “Load or switch LUT by name” field to jump to any
                    existing LUT id.
                  </li>
                  <li>
                    • For non pre-trained LUTs, click “Train on Astarus AI
                    example docs” to inject the curated knowledge base.
                  </li>
                  <li>
                    • Increase the residual for a block to make that LUT
                    “louder” versus base Mistral.
                  </li>
                  <li>
                    • Lower the threshold to make the LUT fire more often; raise
                    it to rely more on the base model.
                  </li>
                  <li>
                    • Use “Store Q&amp;A in LUT” on a trainable LUT for your own
                    custom memories.
                  </li>
                  <li>
                    • In non pre-trained LUTs, you can add/delete LUT blocks to
                    explore different WNN layouts.
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
