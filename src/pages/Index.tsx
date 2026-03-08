import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Particles from "@/components/Particles";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <Particles count={25} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 text-center px-6 max-w-xl"
      >
        <motion.h1
          className="font-display text-6xl md:text-8xl font-semibold text-rose-gold mb-4 italic"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Dear Her.
        </motion.h1>

        <motion.p
          className="font-letter text-lg md:text-xl text-foreground/70 mb-12 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          Tell me about her. I'll help you say it right.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <Button
            variant="hero"
            size="xl"
            onClick={() => navigate("/write")}
          >
            Write to her →
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
