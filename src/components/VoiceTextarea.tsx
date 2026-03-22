import { Mic } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface VoiceTextareaProps {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  placeholder?: string;
  label: string;
  labelColor?: string;
  isRecordingActive?: boolean;
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
}

const VoiceTextarea = ({ value, onChange, maxLength, placeholder, label, labelColor, isRecordingActive, onRecordingStart, onRecordingStop }: VoiceTextareaProps) => {
  const { isListening, isSupported, transcript, startListening, stopListening } = useSpeechRecognition();

  // Show real-time preview: existing text + live transcript
  const displayValue = isListening && transcript
    ? (value ? `${value} ${transcript}` : transcript).slice(0, maxLength)
    : value;

  // Sync with parent: if parent says we're not active but we're listening, stop
  const wasActive = useRef(isRecordingActive);
  if (wasActive.current && !isRecordingActive && isListening) {
    const finalTranscript = stopListening();
    if (finalTranscript) {
      const newValue = value ? `${value} ${finalTranscript}` : finalTranscript;
      onChange(newValue.slice(0, maxLength));
    }
  }
  wasActive.current = isRecordingActive;

  const handleMicClick = () => {
    if (isListening) {
      const finalTranscript = stopListening();
      if (finalTranscript) {
        const newValue = value ? `${value} ${finalTranscript}` : finalTranscript;
        onChange(newValue.slice(0, maxLength));
      }
      onRecordingStop?.();
      return;
    }
    onRecordingStart?.();
    startListening();
  };

  const micButton = (
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
  );

  return (
    <div>
      <label className="block font-letter text-lg text-foreground/60 mb-3" style={labelColor ? { color: labelColor } : undefined}>
        {label}
      </label>
      <div className="relative">
        <textarea
          value={displayValue}
          onChange={(e) => {
            if (!isListening && e.target.value.length <= maxLength) onChange(e.target.value);
          }}
          readOnly={isListening}
          maxLength={maxLength}
          rows={3}
          className="w-full bg-muted/50 border border-foreground/10 rounded-lg px-4 pt-3 pb-8 pr-12 font-letter text-lg text-foreground/90 placeholder:text-foreground/20 resize-none focus:outline-none focus:border-rose-gold/50 transition-colors duration-[600ms]"
          placeholder={placeholder}
        />
        <div className="absolute bottom-3 right-3 flex flex-col items-center gap-1">
          {isSupported ? (
            <>
              {micButton}
              <span className="font-body text-[10px] text-foreground/25">
                {isListening ? "tap to stop" : "or speak"}
              </span>
            </>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="p-1.5 rounded-full text-foreground/15 cursor-not-allowed">
                    <Mic size={18} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Voice not supported on this browser</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <span className="absolute bottom-3 left-4 font-body text-xs text-foreground/30 bg-[#fce8e8] px-2 py-0.5 rounded-full">
          {displayValue.length}/{maxLength}
        </span>
      </div>
    </div>
  );
};

export default VoiceTextarea;
