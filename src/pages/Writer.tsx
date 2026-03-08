import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const RELATIONSHIPS = ["Mom", "Partner", "Sister", "Friend", "Mentor", "Her"] as const;

const PROMPTS = [
  "What's a small thing she does that you never really mention?",
  "Describe her in a moment only you've seen.",
  "What do you want her to know today?",
] as const;

const MAX_CHARS = 300;

const LOADING_TEXTS = [
  "Reading between the lines...",
  "Finding the right words...",
  "Almost ready...",
];

const Writer = () => {
  const navigate = useNavigate();
  const [relationship, setRelationship] = useState<string>("");
  const [answers, setAnswers] = useState(["", "", ""]);
  const [senderName, setSenderName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  const handleAnswerChange = (index: number, value: string) => {
    if (value.length > MAX_CHARS) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const canSubmit = relationship && answers.every((a) => a.trim().length > 0);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsLoading(true);
    setLoadingTextIndex(0);

    // Rotate loading text
    const interval = setInterval(() => {
      setLoadingTextIndex((prev) => Math.min(prev + 1, LOADING_TEXTS.length - 1));
    }, 1500);

    const startTime = Date.now();

    try {
      const { data, error } = await supabase.functions.invoke("generate-letter", {
        body: {
          relationship,
          senderName: senderName.trim() || "someone who cares",
          answers,
        },
      });

      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
        setIsLoading(false);
        clearInterval(interval);
        return;
      }

      // Ensure minimum 3 seconds loading
      const elapsed = Date.now() - startTime;
      if (elapsed < 3000) {
        await new Promise((r) => setTimeout(r, 3000 - elapsed));
      }

      clearInterval(interval);
      navigate(`/letter/${data.id}`, { state: { isNew: true } });
    } catch (e: any) {
      clearInterval(interval);
      setIsLoading(false);
      toast.error("Something went wrong. Please try again.");
      console.error(e);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background flex items-center justify-center z-50"
        >
          <div className="text-center">
            <motion.div
              className="w-16 h-16 border-2 border-rose-gold/30 border-t-rose-gold rounded-full mx-auto mb-8"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <AnimatePresence mode="wait">
              <motion.p
                key={loadingTextIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="font-letter text-xl text-foreground/70 italic"
              >
                {LOADING_TEXTS[loadingTextIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen bg-background py-12 px-4"
        >
          <div className="max-w-2xl mx-auto">
            {/* Relationship selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <p className="font-letter text-lg text-foreground/60 mb-4 text-center italic">
                Who are you writing to?
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {RELATIONSHIPS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRelationship(r)}
                    className={`px-5 py-2 rounded-full font-body text-sm transition-all duration-300 border ${
                      relationship === r
                        ? "bg-rose-gold text-background border-rose-gold"
                        : "bg-transparent text-foreground/50 border-foreground/20 hover:border-rose-gold/50 hover:text-foreground/80"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Prompts */}
            {PROMPTS.map((prompt, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.15 }}
                className="mb-8"
              >
                <label className="block font-letter text-base text-foreground/60 mb-3 italic">
                  {prompt}
                </label>
                <div className="relative">
                  <textarea
                    value={answers[i]}
                    onChange={(e) => handleAnswerChange(i, e.target.value)}
                    maxLength={MAX_CHARS}
                    rows={3}
                    className="w-full bg-muted/50 border border-foreground/10 rounded-lg px-4 py-3 font-letter text-foreground/90 placeholder:text-foreground/20 resize-none focus:outline-none focus:border-rose-gold/50 transition-colors"
                    placeholder="Start writing..."
                  />
                  <span className="absolute bottom-3 right-3 font-body text-xs text-foreground/30">
                    {answers[i].length}/{MAX_CHARS}
                  </span>
                </div>
              </motion.div>
            ))}

            {/* Sender name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="mb-12"
            >
              <label className="block font-letter text-base text-foreground/60 mb-3 italic">
                Your name (how the letter signs off)
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                maxLength={50}
                className="w-full bg-muted/50 border border-foreground/10 rounded-lg px-4 py-3 font-letter text-foreground/90 placeholder:text-foreground/20 focus:outline-none focus:border-rose-gold/50 transition-colors"
                placeholder="Optional"
              />
            </motion.div>

            {/* Submit */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <Button
                variant="hero"
                size="xl"
                onClick={handleSubmit}
                disabled={!canSubmit}
              >
                Transform it →
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Writer;
