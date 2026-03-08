import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import VoiceTextarea from "@/components/VoiceTextarea";

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

    const interval = setInterval(() => {
      setLoadingTextIndex((prev) => Math.min(prev + 1, LOADING_TEXTS.length - 1));
    }, 1500);

    const startTime = Date.now();

    try {
      const { data, error } = await supabase.functions.invoke("generate-letter", {
        body: { relationship, senderName: senderName.trim() || "someone who cares", answers },
      });

      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
        setIsLoading(false);
        clearInterval(interval);
        return;
      }

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
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 bg-background flex items-center justify-center z-50"
        >
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-rose-gold/20 warm-glow-pulse mx-auto mb-8" />
            <AnimatePresence mode="wait">
              <motion.p
                key={loadingTextIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="font-letter text-2xl text-foreground/70"
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
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="min-h-screen bg-background py-12 px-4"
        >
          <div className="max-w-2xl mx-auto">
            {/* Relationship selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: "easeInOut" }}
              className="mb-12"
            >
              <p className="font-letter text-xl text-foreground/60 mb-4 text-center">
                Who are you writing to?
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {RELATIONSHIPS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRelationship(r)}
                    className={`px-5 py-2 rounded-full font-body text-sm transition-all duration-[600ms] border ${
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
                transition={{ delay: 0.2 + i * 0.15, duration: 0.6, ease: "easeInOut" }}
                className="mb-8"
              >
                <VoiceTextarea
                  value={answers[i]}
                  onChange={(val) => handleAnswerChange(i, val)}
                  maxLength={MAX_CHARS}
                  label={prompt}
                  placeholder="Start writing..."
                />
              </motion.div>
            ))}

            {/* Sender name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6, ease: "easeInOut" }}
              className="mb-12"
            >
              <label className="block font-letter text-lg text-foreground/60 mb-3">
                Your name (how the letter signs off)
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                maxLength={50}
                className="w-full bg-muted/50 border border-foreground/10 rounded-lg px-4 py-3 font-letter text-lg text-foreground/90 placeholder:text-foreground/20 focus:outline-none focus:border-rose-gold/50 transition-colors duration-[600ms]"
                placeholder="Optional"
              />
            </motion.div>

            {/* Submit */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-center"
            >
              <Button variant="hero" size="xl" onClick={handleSubmit} disabled={!canSubmit}>
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
