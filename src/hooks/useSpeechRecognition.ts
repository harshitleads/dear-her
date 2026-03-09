import { useState, useCallback, useRef } from "react";

interface UseSpeechRecognitionResult {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => string;
  resetTranscript: () => void;
}

export const useSpeechRecognition = (): UseSpeechRecognitionResult => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef("");

  const SpeechRecognitionAPI =
    typeof window !== "undefined"
      ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      : null;

  const isSupported = !!SpeechRecognitionAPI;

  const startListening = useCallback(() => {
    if (!SpeechRecognitionAPI) return;

    finalTranscriptRef.current = "";
    setTranscript("");

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let finalText = "";
      let interimText = "";
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interimText += result[0].transcript;
        }
      }
      finalTranscriptRef.current = finalText;
      setTranscript(finalText + interimText);
    };

    // If browser kills it (e.g. network error), restart automatically
    recognition.onend = () => {
      if (recognitionRef.current === recognition) {
        try {
          recognition.start();
        } catch {
          setIsListening(false);
          recognitionRef.current = null;
        }
      }
    };

    recognition.onerror = (e: any) => {
      if (e.error === "not-allowed" || e.error === "service-not-available") {
        setIsListening(false);
        recognitionRef.current = null;
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [SpeechRecognitionAPI]);

  const stopListening = useCallback((): string => {
    const recognition = recognitionRef.current;
    recognitionRef.current = null; // prevent auto-restart in onend
    recognition?.stop();
    setIsListening(false);
    const result = transcript;
    setTranscript("");
    return result;
  }, [transcript]);

  const resetTranscript = useCallback(() => {
    finalTranscriptRef.current = "";
    setTranscript("");
  }, []);

  return { isListening, isSupported, transcript, startListening, stopListening, resetTranscript };
};
