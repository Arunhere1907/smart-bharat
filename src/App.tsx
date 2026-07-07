/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { MessageSquare, PlusCircle, Activity, Globe, Landmark } from "lucide-react";
import CivicChat from "./components/CivicChat";
import ComplaintFiler from "./components/ComplaintFiler";
import CivicDashboard from "./components/CivicDashboard";
import { Complaint } from "./types";
import { translations } from "./translations";

export default function App() {
  const [tab, setTab] = useState<"chat" | "file" | "dashboard">("chat");
  const [currentLanguage, setCurrentLanguage] = useState<string>("en");
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [quickSearchQuery, setQuickSearchQuery] = useState<string>("");

  // Fetch all complaints from server
  const fetchComplaints = async () => {
    try {
      const response = await fetch("/api/complaints");
      if (response.ok) {
        const data = await response.json();
        setComplaints(data);
      }
    } catch (err) {
      console.error("Error fetching complaints:", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleUpvote = async (id: string) => {
    try {
      const response = await fetch(`/api/complaints/${id}/upvote`, {
        method: "POST"
      });
      if (response.ok) {
        const data = await response.json();
        // Update local state instantly for optimal UX responsiveness
        setComplaints((prev) => 
          prev.map((c) => c.id === id ? { ...c, upvoteCount: data.upvoteCount } : c)
        );
      }
    } catch (err) {
      console.error("Error upvoting complaint:", err);
    }
  };

  const handleStatusChange = async (id: string, newStatus: any) => {
    try {
      const response = await fetch(`/api/complaints/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        const data = await response.json();
        setComplaints((prev) => 
          prev.map((c) => c.id === id ? { ...c, status: data.status } : c)
        );
      }
    } catch (err) {
      console.error("Error updating complaint status:", err);
    }
  };

  const handleAutoFileRequest = (category: any) => {
    setTab("file");
  };

  const languageOptions = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिन्दी (Hindi)" },
    { code: "hinglish", name: "Hinglish" },
    { code: "ta", name: "தமிழ் (Tamil)" },
    { code: "te", name: "తెలుగు (Telugu)" },
    { code: "kn", name: "ಕನ್ನಡ (Kannada)" },
    { code: "bn", name: "বাংলা (Bengali)" }
  ];

  const t = translations[currentLanguage] || translations.en;

  return (
    <div className="min-h-screen bg-bento-bg text-bento-text flex flex-col font-sans antialiased selection:bg-bento-orange selection:text-white pb-[76px] md:pb-0">
      
      {/* 1. Header Banner with Elegant Branding & Language Toggle */}
      <header className="sticky top-0 z-40 bg-white border-b-4 border-bento-orange px-3 sm:px-6 md:px-8 py-3 sm:py-4 flex items-center justify-between shadow-sm gap-2">
        <div className="flex items-center space-x-2.5 sm:space-x-3.5 min-w-0">
          {/* Logo emblem */}
          <div className="h-10 w-10 sm:h-11 sm:w-11 bg-bento-blue text-white rounded-xl flex items-center justify-center font-extrabold text-xl border-2 border-gray-800 shadow-bento-sm shrink-0">
            <Landmark className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <h1 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight leading-none uppercase text-bento-text truncate">{t.appName}</h1>
              <span className="text-[9px] sm:text-[10px] font-mono font-bold bg-bento-orange text-white px-1 sm:px-1.5 py-0.5 rounded border border-gray-800 shrink-0">CIVIC</span>
            </div>
            <p className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-gray-500 tracking-wider uppercase mt-0.5 sm:mt-1 truncate">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Language selector dropdown */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 bg-white border-2 border-gray-800 rounded-xl px-2 sm:px-2.5 py-1.5 shadow-bento-sm hover:translate-y-[-1px] transition-transform shrink-0">
          <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-bento-blue" />
          <select
            value={currentLanguage}
            onChange={(e) => setCurrentLanguage(e.target.value)}
            className="bg-transparent text-[11px] sm:text-xs font-bold text-bento-text outline-none cursor-pointer max-w-[80px] sm:max-w-none"
            id="global-language-selector"
          >
            {languageOptions.map((lang) => (
              <option key={lang.code} value={lang.code} className="text-slate-800 font-bold">
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* 2. Main Content viewport */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-4 py-3 md:py-8">
        {tab === "chat" && (
          <CivicChat 
            currentLanguage={currentLanguage} 
            setTab={setTab}
            setQuickSearch={setQuickSearchQuery}
            onAutoFileRequest={handleAutoFileRequest}
          />
        )}
        
        {tab === "file" && (
          <ComplaintFiler 
            currentLanguage={currentLanguage}
            onComplaintSubmitted={fetchComplaints} 
          />
        )}

        {tab === "dashboard" && (
          <CivicDashboard 
            currentLanguage={currentLanguage}
            complaints={complaints}
            onUpvote={handleUpvote}
            onStatusChange={handleStatusChange}
          />
        )}
      </main>

      {/* 3. Bottom Navigation Bar for Mobile-first responsive feel */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-4 border-gray-800 px-2 py-1.5 flex items-center justify-around md:hidden" style={{ paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom))' }}>
        
        <button
          onClick={() => setTab("chat")}
          className={`flex flex-col items-center justify-center h-14 flex-1 max-w-[100px] rounded-xl transition-all ${
            tab === "chat" 
              ? "text-bento-blue font-black bg-gray-100 border-2 border-gray-800" 
              : "text-gray-400 hover:text-bento-text font-semibold"
          }`}
          id="nav-chat-tab"
        >
          <MessageSquare className="h-5 w-5 mb-1" />
          <span className="text-[10px] tracking-tight">{t.navChat}</span>
        </button>

        <button
          onClick={() => setTab("file")}
          className={`flex flex-col items-center justify-center h-14 flex-1 max-w-[100px] rounded-xl transition-all ${
            tab === "file" 
              ? "text-bento-orange font-black bg-gray-100 border-2 border-gray-800" 
              : "text-gray-400 hover:text-bento-text font-semibold"
          }`}
          id="nav-file-tab"
        >
          <PlusCircle className="h-5 w-5 mb-1 text-bento-orange" />
          <span className="text-[10px] tracking-tight text-bento-orange">{t.navReport}</span>
        </button>

        <button
          onClick={() => setTab("dashboard")}
          className={`flex flex-col items-center justify-center h-14 flex-1 max-w-[100px] rounded-xl transition-all ${
            tab === "dashboard" 
              ? "text-bento-green font-black bg-gray-100 border-2 border-gray-800" 
              : "text-gray-400 hover:text-bento-text font-semibold"
          }`}
          id="nav-dashboard-tab"
        >
          <Activity className="h-5 w-5 mb-1 text-bento-green" />
          <span className="text-[10px] tracking-tight">{t.navDashboard}</span>
        </button>
      </nav>

      {/* Desktop Navigation Helper */}
      <div className="hidden md:flex justify-center items-center py-2.5 px-4 space-x-2.5 sticky bottom-6 z-40 bg-white max-w-md mx-auto rounded-2xl border-4 border-gray-800 shadow-bento">
        <button
          onClick={() => setTab("chat")}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer border-2 ${
            tab === "chat" 
              ? "bg-bento-blue text-white border-gray-800 shadow-bento-sm" 
              : "text-gray-600 hover:bg-gray-100 border-transparent"
          }`}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>{t.navChat}</span>
        </button>

        <button
          onClick={() => setTab("file")}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer border-2 ${
            tab === "file" 
              ? "bg-bento-orange text-white border-gray-800 shadow-bento-sm" 
              : "text-gray-600 hover:bg-gray-100 border-transparent"
          }`}
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span>{t.navReport}</span>
        </button>

        <button
          onClick={() => setTab("dashboard")}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer border-2 ${
            tab === "dashboard" 
              ? "bg-bento-green text-white border-gray-800 shadow-bento-sm" 
              : "text-gray-600 hover:bg-gray-100 border-transparent"
          }`}
        >
          <Activity className="h-3.5 w-3.5" />
          <span>{t.navDashboard}</span>
        </button>
      </div>

    </div>
  );
}
