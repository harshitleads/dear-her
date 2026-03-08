import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Particles from "@/components/Particles";

const LetterView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isNew = location.state?.isNew === true;
  const [letter, setLetter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayedText, setDisplayedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);

  const isShared = !isNew && !location.state;

  useEffect(() => {
    const fetchLetter = async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from("letters")
        .select("generated_letter")
        .eq("id", id)
        .single();

      if (error || !data) {
        setLoading(false);
        return;
      }
      setLetter(data.generated_letter);
      setLoading(false);
    };
    fetchLetter();
  }, [id]);

  // Typewriter effect
  useEffect(() => {
    if (!letter) return;
    let i = 0;
    const speed = 20;
    const timer = setInterval(() => {
      i++;
      setDisplayedText(letter.slice(0, i));
      if (i >= letter.length) {
        clearInterval(timer);
        setTypingDone(true);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [letter]);

  const handleCopy = () => {
    const url = `${window.location.origin}/letter/${id}`;
    navigator.clipboard.writeText(url);
    toast("Link copied. Send it to her.", {
      style: {
        background: "hsl(var(--parchment))",
        color: "hsl(var(--parchment-foreground))",
        border: "1px solid hsl(var(--rose-gold) / 0.3)",
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-rose-gold/20 warm-glow-pulse" />
      </div>
    );
  }

  if (!letter) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <p className="font-letter text-foreground/50 text-xl">
          This letter doesn't exist or has been lost in time.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 relative">
      <Particles count={15} />

      <div className="relative z-10 w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-parchment rounded-lg p-8 md:p-12 shadow-2xl shadow-rose-gold/10"
        >
          <div className="font-letter text-parchment-foreground text-lg md:text-xl leading-relaxed whitespace-pre-line">
            {displayedText}
            {!typingDone && <span className="typewriter-cursor" />}
          </div>
        </motion.div>

        {!isShared && typingDone && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeInOut" }}
            className="flex flex-col sm:flex-row gap-3 justify-center mt-8"
          >
            <Button variant="hero" size="lg" onClick={handleCopy}>
              Copy link to share →
            </Button>
            <Button variant="warm" size="lg" onClick={() => navigate("/write")}>
              Write another →
            </Button>
          </motion.div>
        )}

        {isShared && typingDone && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-center mt-10 font-body text-xs text-foreground/25"
          >
            Made with Dear Her
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default LetterView;
