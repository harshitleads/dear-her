import { Mic } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

interface VoiceTextareaProps {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  placeholder?: string;
  label: string;
  labelColor?: string;
}

const VoiceTextarea = ({ value, onChange, maxLength, placeholder, label }: VoiceTextareaProps) => {
  const { isListening, isSupported, startListening, stopListening } = useSpeechRecognition();

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
      return;
    }
    startListening((transcript) => {
      const newValue = value ? `${value} ${transcript}` : transcript;
      onChange(newValue.slice(0, maxLength));
    });
  };

  return (
    <div>
      <label className="block font-letter text-lg text-foreground/60 mb-3">
        {label}
      </label>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => {
            if (e.target.value.length <= maxLength) onChange(e.target.value);
          }}
          maxLength={maxLength}
          rows={3}
          className="w-full bg-muted/50 border border-foreground/10 rounded-lg px-4 py-3 pr-12 font-letter text-lg text-foreground/90 placeholder:text-foreground/20 resize-none focus:outline-none focus:border-rose-gold/50 transition-colors duration-[600ms]"
          placeholder={placeholder}
        />
        <div className="absolute bottom-3 right-3 flex flex-col items-center gap-1">
          {isSupported && (
            <>
              <button
                type="button"
                onClick={handleMicClick}
                className={`p-1.5 rounded-full transition-all duration-300 ${
                  isListening
                    ? "text-destructive mic-recording"
                    : "text-foreground/30 hover:text-rose-gold"
                }`}
                aria-label={isListening ? "Stop recording" : "Start voice input"}
              >
                <Mic size={18} />
              </button>
              <span className="font-body text-[10px] text-foreground/25">or speak</span>
            </>
          )}
        </div>
        <span className="absolute bottom-3 left-4 font-body text-xs text-foreground/30">
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
};

export default VoiceTextarea;
