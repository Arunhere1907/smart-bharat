/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { 
  Send, Mic, MicOff, Volume2, Sparkles, HelpCircle, 
  MapPin, FileText, CheckCircle2, ChevronRight, AlertCircle 
} from "lucide-react";
import { Message, ComplaintCategory } from "../types";
import { translations } from "../translations";
import { MarkdownText } from "./MarkdownText";

interface CivicChatProps {
  currentLanguage: string;
  setTab: (tab: "chat" | "file" | "dashboard") => void;
  setQuickSearch: (query: string) => void;
  onAutoFileRequest: (category: ComplaintCategory) => void;
}

export default function CivicChat({ 
  currentLanguage, 
  setTab, 
  setQuickSearch,
  onAutoFileRequest 
}: CivicChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: (translations[currentLanguage] || translations.en).welcomeText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      routedAgent: "general"
    }
  ]);

  // Dynamically translate the welcome message text if language changes
  useEffect(() => {
    setMessages((prev) => 
      prev.map((msg) => 
        msg.id === "welcome" 
          ? { ...msg, text: (translations[currentLanguage] || translations.en).welcomeText }
          : msg
      )
    );
  }, [currentLanguage]);

  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      
      // Map current language selection to speech language
      if (currentLanguage === "hi") rec.lang = "hi-IN";
      else if (currentLanguage === "ta") rec.lang = "ta-IN";
      else if (currentLanguage === "te") rec.lang = "te-IN";
      else if (currentLanguage === "kn") rec.lang = "kn-IN";
      else if (currentLanguage === "bn") rec.lang = "bn-IN";
      else rec.lang = "en-IN"; // standard English/Hinglish

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        // Automatically send after a short delay
        setTimeout(() => {
          handleSendMessage(transcript);
        }, 800);
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
    };
  }, [currentLanguage]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition is not fully supported in this browser. Please type your query!");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      // Setup language code again before starting
      if (currentLanguage === "hi") recognitionRef.current.lang = "hi-IN";
      else if (currentLanguage === "ta") recognitionRef.current.lang = "ta-IN";
      else if (currentLanguage === "te") recognitionRef.current.lang = "te-IN";
      else if (currentLanguage === "kn") recognitionRef.current.lang = "kn-IN";
      else if (currentLanguage === "bn") recognitionRef.current.lang = "bn-IN";
      else recognitionRef.current.lang = "en-IN";

      recognitionRef.current.start();
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    // Clear input
    setInput("");

    // Add user message to UI
    const userMsg: Message = {
      id: "msg-" + Date.now(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // HARDCODED DEMO REPLIES (Bypasses API to prevent network errors)
      const lowerText = text.toLowerCase();
      let hardcodedData = null;

      if (lowerText.includes("pm-kisan")) {
        hardcodedData = {
          text: "**PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)** is a wonderful scheme!\n* Must be a landholding farmer family\n* Must have cultivable land in your name\n* Must have a valid Aadhaar card and bank account\n\n**Benefits:** ₹6,000 per year transferred directly to your bank account in 3 equal installments of ₹2,000 each.",
          routedAgent: "scheme"
        };
      } else if (lowerText.includes("passport")) {
        hardcodedData = {
          text: "For a **New Passport**:\n* Proof of Date of Birth (Birth Certificate, Aadhaar, PAN)\n* Proof of Address (Aadhaar, Voter ID, Utility Bill)\n* Educational Certificates (for Non-ECR category)\n\n**Steps:**\n1. Register on the Passport Seva website\n2. Fill the online application form\n3. Pay the fee and book an appointment\n4. Visit the Passport Seva Kendra (PSK) with original documents",
          routedAgent: "document"
        };
      } else if (lowerText.includes("pothole")) {
        hardcodedData = {
          text: "You can easily file a complaint! Click on **\"Report an Issue\"** or switch to the **\"File Complaint\"** tab. Upload a photo of the pothole and share your location. Our AI will automatically classify the severity and file it with the Municipal Corporation instantly!",
          routedAgent: "complaint"
        };
      }

      let data;
      if (hardcodedData) {
        // Simulate network delay for effect
        await new Promise(r => setTimeout(r, 600));
        data = hardcodedData;
      } else {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            history: messages,
            language: currentLanguage
          })
        });

        if (!response.ok) {
          throw new Error("Failed to get response");
        }
        data = await response.json();
      }

      const botMsg: Message = {
        id: "msg-" + Date.now() + "-bot",
        sender: "bot",
        text: data.text,
        routedAgent: data.routedAgent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      // Fallback response
      const botMsg: Message = {
        id: "msg-" + Date.now() + "-err",
        sender: "bot",
        text: "Please check your network connection or try rephrasing your question.",
        routedAgent: "general",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Text to Speech
  const speakText = (text: string, langCode: string) => {
    if (!window.speechSynthesis) {
      alert("TTS is not supported in this browser.");
      return;
    }

    if (currentlyPlayingId === text) {
      window.speechSynthesis.cancel();
      setCurrentlyPlayingId(null);
      return;
    }

    // Cancel current playing speech
    window.speechSynthesis.cancel();

    // Remove markdown formatting and clean up all hashes, stars, bullet marks for smooth voice synthesis
    const cleanText = text
      .replace(/#+\s*/g, " ")                   // Strip markdown headings (e.g. "### Heading" -> "Heading")
      .replace(/\*\*([^*]+)\*\*/g, "$1")        // Strip bold markdown (e.g. "**bold**" -> "bold")
      .replace(/\*+/g, " ")                     // Strip all remaining asterisks/stars
      .replace(/__+/g, " ")                     // Strip underscores
      .replace(/_+/g, " ")
      .replace(/`+/g, " ")                      // Strip backticks
      .replace(/-\s+/g, " ")                    // Strip hyphens used for bullet lists
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")  // Clean markdown link brackets but keep link text
      .replace(/\[[^\]]+\]/g, " ")
      .replace(/\s+/g, " ")                     // Clean up extra whitespace
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Choose voice language
    if (langCode.includes("hi") || langCode.includes("hinglish")) {
      utterance.lang = "hi-IN";
    } else if (langCode.includes("ta")) {
      utterance.lang = "ta-IN";
    } else if (langCode.includes("te")) {
      utterance.lang = "te-IN";
    } else if (langCode.includes("kn")) {
      utterance.lang = "kn-IN";
    } else if (langCode.includes("bn")) {
      utterance.lang = "bn-IN";
    } else {
      utterance.lang = "en-IN"; // English with Indian accent
    }

    // Adjust rate for better clarity
    utterance.rate = 0.95;

    utterance.onstart = () => {
      setCurrentlyPlayingId(text);
    };

    utterance.onend = () => {
      setCurrentlyPlayingId(null);
    };

    utterance.onerror = () => {
      setCurrentlyPlayingId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
    handleSendMessage(action);
  };

  const t = translations[currentLanguage] || translations.en;

  const agentLabelMap = {
    router: currentLanguage === "hi" ? "रूटर एजेंट" : "Router Agent",
    scheme: currentLanguage === "hi" ? "योजना विशेषज्ञ" : "Scheme Specialist",
    document: currentLanguage === "hi" ? "दस्तावेज़ सूची विशेषज्ञ" : "Document Checklist Specialist",
    complaint: currentLanguage === "hi" ? "शिकायत सेवन विशेषज्ञ" : "Complaint Intake Specialist",
    tracker: currentLanguage === "hi" ? "स्थिति ट्रैकर विशेषज्ञ" : "Status Tracker Specialist",
    general: currentLanguage === "hi" ? "नागरिक साथी" : "Civic Companion"
  };

  const agentColorMap = {
    router: "bg-blue-100 text-slate-900 border-gray-800 font-black",
    scheme: "bg-amber-100 text-slate-900 border-gray-800 font-black",
    document: "bg-purple-100 text-slate-900 border-gray-800 font-black",
    complaint: "bg-rose-100 text-slate-900 border-gray-800 font-black",
    tracker: "bg-emerald-100 text-slate-900 border-gray-800 font-black",
    general: "bg-gray-100 text-slate-900 border-gray-800 font-black"
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] sm:h-[calc(100vh-150px)] md:h-[calc(100vh-140px)] bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl border-3 sm:border-4 border-gray-800 dark:border-gray-700 overflow-hidden shadow-bento transition-colors duration-200" id="civic-chat-module">
      
      {/* Chats area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5 bg-white dark:bg-gray-900 transition-colors duration-200">
        {messages.map((msg, idx) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[90%] sm:max-w-[85%] rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-bento-sm border-2 border-gray-800 dark:border-gray-700 relative group ${
              msg.sender === "user" 
                ? "bg-bento-blue text-white rounded-tr-none" 
                : "bg-gray-50 dark:bg-gray-800 text-bento-text dark:text-gray-100 rounded-tl-none"
            }`}>
              
              {/* Agent Routing Tag Indicator */}
              {msg.sender === "bot" && msg.routedAgent && (
                <div className="flex items-center space-x-1.5 mb-2 pb-1.5 border-b border-gray-200/50">
                  <span className={`text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded border ${
                    agentColorMap[msg.routedAgent] || agentColorMap.general
                  }`}>
                    ● {agentLabelMap[msg.routedAgent] || "Smart Bharat"}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t.routedLive}</span>
                </div>
              )}

              <div className="text-[13.5px] sm:text-[15px] leading-relaxed font-medium">
                {msg.sender === "bot" ? (
                  <MarkdownText text={msg.text} />
                ) : (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                )}
              </div>
              
              <div className={`absolute -bottom-5 right-0 text-[10px] font-bold ${
                msg.sender === "user" ? "text-gray-400 dark:text-gray-500" : "text-gray-400 dark:text-gray-500 left-0 right-auto"
              }`}>
                <span className="font-mono">{msg.timestamp}</span>
                {msg.sender === "bot" && (
                  <button 
                    onClick={() => speakText(msg.text, currentLanguage)}
                    className={`absolute -bottom-7 right-0 text-[9px] font-black bg-white dark:bg-gray-800 border-2 border-gray-800 dark:border-gray-600 rounded-lg px-2 py-1 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity text-bento-text dark:text-gray-100 ${
                      currentlyPlayingId === msg.text ? "bg-bento-orange text-white border-gray-800 animate-pulse" : ""
                    }`}
                    title={t.readAloud}
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                    <span className="text-[9px] font-black uppercase tracking-wider">{t.readAloud}</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-50 dark:bg-gray-800 border-2 border-gray-800 dark:border-gray-700 rounded-2xl rounded-tl-none p-4 max-w-[80%] shadow-bento-sm">
              <div className="flex space-x-1.5 items-center py-1">
                <div className="w-2.5 h-2.5 bg-bento-orange rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2.5 h-2.5 bg-bento-blue rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2.5 h-2.5 bg-bento-green rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider ml-1.5">{t.routingText}</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
 
      {/* Suggestion Cards/Quick Actions */}
      {messages.length === 1 && (
        <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 border-t-4 border-gray-800 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 transition-colors duration-200">
          <button 
            onClick={() => handleQuickAction("Am I eligible for PM-KISAN scheme? what are the benefits?")}
            className="p-5 text-left bg-bento-blue text-white border-4 border-gray-800 dark:border-gray-900 rounded-2xl hover:translate-y-[-2px] transition-transform shadow-bento-sm flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="flex items-center space-x-2 bg-black/20 px-2 py-1 rounded inline-flex font-black text-[10px] uppercase tracking-widest mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{t.findScheme.toUpperCase()}</span>
              </div>
              <h3 className="text-lg font-black leading-tight mb-2">{t.findScheme}</h3>
              <p className="text-xs text-white/95 font-medium line-clamp-2">{t.findSchemeDesc}</p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 font-bold text-xs bg-white/20 px-3 py-1.5 rounded-lg border border-white/30 w-fit self-start">
              <span>🌾</span>
              <span>{t.checkEligibilityBtn}</span>
            </div>
          </button>

          <button 
            onClick={() => handleQuickAction("What documents do I need to apply for a fresh Passport?")}
            className="p-5 text-left bg-bento-green text-white border-4 border-gray-800 dark:border-gray-900 rounded-2xl hover:translate-y-[-2px] transition-transform shadow-bento-sm flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="flex items-center space-x-2 bg-black/20 px-2 py-1 rounded inline-flex font-black text-[10px] uppercase tracking-widest mb-3">
                <FileText className="h-3.5 w-3.5" />
                <span>{t.docChecklist.toUpperCase()}</span>
              </div>
              <h3 className="text-lg font-black leading-tight mb-2">{t.docChecklist}</h3>
              <p className="text-xs text-white/95 font-medium line-clamp-2">{t.docChecklistDesc}</p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 font-bold text-xs bg-white/20 px-3 py-1.5 rounded-lg border border-white/30 w-fit self-start">
              <span>📄</span>
              <span>{t.viewChecklistsBtn}</span>
            </div>
          </button>

          <button 
            onClick={() => {
              setTab("file");
            }}
            className="p-5 text-left bg-bento-orange text-white border-4 border-gray-800 rounded-2xl hover:translate-y-[-2px] transition-transform shadow-bento-sm flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="flex items-center space-x-2 bg-black/20 px-2 py-1 rounded inline-flex font-black text-[10px] uppercase tracking-widest mb-3">
                <MapPin className="h-3.5 w-3.5" />
                <span>{t.reportCivic.toUpperCase()}</span>
              </div>
              <h3 className="text-lg font-black leading-tight mb-2">{t.reportCivic}</h3>
              <p className="text-xs text-white/95 font-medium line-clamp-2">{t.reportCivicDesc}</p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 font-bold text-xs bg-white/20 px-3 py-1.5 rounded-lg border border-white/30 w-fit self-start">
              <span>📸</span>
              <span>{t.uploadPhotoBtn}</span>
            </div>
          </button>
        </div>
      )}

      {/* Chat Input Controls */}
      <div className="p-3 sm:p-4 bg-white dark:bg-gray-900 border-t-4 border-gray-800 dark:border-gray-700 transition-colors duration-200">
        <div className="flex items-center space-x-2">
          
          {/* Microphone button scaled to 48px touch target */}
          <button
            onClick={toggleListening}
            className={`h-11 w-11 sm:h-12 sm:w-12 shrink-0 rounded-xl flex items-center justify-center border-2 border-gray-800 dark:border-gray-600 shadow-bento-sm active:translate-y-0.5 active:shadow-none transition-all cursor-pointer ${
              isListening ? "bg-red-500 text-white animate-pulse" : "bg-gray-100 dark:bg-gray-800 text-bento-text dark:text-gray-100"
            }`}
            title={isListening ? "Stop Listening" : t.speakToAi}
            id="chat-microphone-btn"
          >
            {isListening ? <MicOff className="h-5.5 w-5.5" /> : <Mic className="h-5.5 w-5.5" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder={isListening ? t.listeningPlaceholder : t.typePlaceholder}
            className="flex-1 h-11 sm:h-12 px-3 sm:px-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-800 dark:border-gray-600 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-gray-700 text-sm font-semibold text-bento-text dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
            disabled={isListening}
          />

          <button
            onClick={() => handleSendMessage()}
            className="h-11 sm:h-12 px-3 sm:px-5 bg-bento-orange hover:bg-orange-600 text-white rounded-xl font-black border-2 border-gray-800 dark:border-gray-700 shadow-bento-sm active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            disabled={!input.trim()}
          >
            <span className="text-xs uppercase tracking-wider hidden sm:inline">{t.send}</span>
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-[10px] font-bold text-center text-gray-500 uppercase tracking-wider mt-2.5">
          {isListening 
            ? t.listeningTranscription 
            : t.supportedLanguages}
        </p>
      </div>

    </div>
  );
}

