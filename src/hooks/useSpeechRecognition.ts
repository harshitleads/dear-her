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
  const isListeningRef = useRef(false);

  const SpeechRecognitionAPI =
    typeof window !== "undefined"
      ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      : null;

  const isSupported = !!SpeechRecognitionAPI;

  const createAndStart = useCallback(() => {
    if (!SpeechRecognitionAPI) return;

    // Kill any existing instance
    try { recognitionRef.current?.stop(); } catch {}
    recognitionRef.current = null;

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
      setTranscript(finalText + interimText);
    };

    recognition.onend = () => {
      // If we're still supposed to be listening, recreate fresh
      if (isListeningRef.current) {
        try {
          createAndStart();
        } catch {
          isListeningRef.current = false;
          setIsListening(false);
          recognitionRef.current = null;
        }
      }
    };

    recognition.onerror = (e: any) => {
      if (e.error === "not-allowed" || e.error === "service-not-available") {
        isListeningRef.current = false;
        setIsListening(false);
        recognitionRef.current = null;
      }
      // For other errors (network, aborted, etc.), onend will fire and auto-restart
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      isListeningRef.current = false;
      setIsListening(false);
      recognitionRef.current = null;
    }
  }, [SpeechRecognitionAPI]);

  const startListening = useCallback(() => {
    if (!SpeechRecognitionAPI) return;
    setTranscript("");
    isListeningRef.current = true;
    setIsListening(true);
    createAndStart();
  }, [SpeechRecognitionAPI, createAndStart]);

  const stopListening = useCallback((): string => {
    isListeningRef.current = false;
    try { recognitionRef.current?.stop(); } catch {}
    recognitionRef.current = null;
    setIsListening(false);
    const result = transcript;
    setTranscript("");
    return result;
  }, [transcript]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
  }, []);

  return { isListening, isSupported, transcript, startListening, stopListening, resetTranscript };
};
