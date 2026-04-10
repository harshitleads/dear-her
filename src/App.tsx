import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Writer from "./pages/Writer";
import LetterView from "./pages/LetterView";
import NotFound from "./pages/NotFound";
import CaseStudyBubble from "@/components/CaseStudyBubble";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/write" element={<Writer />} />
          <Route path="/letter/:id" element={<LetterView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    <CaseStudyBubble />
  </QueryClientProvider>
);

export default App;
