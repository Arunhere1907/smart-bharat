/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { 
  BarChart3, MapPin, ThumbsUp, CheckCircle, 
  AlertCircle, Activity, Filter, Info, ShieldAlert
} from "lucide-react";
import { Complaint, ComplaintCategory } from "../types";
import { translations } from "../translations";

interface CivicDashboardProps {
  currentLanguage: string;
  complaints: Complaint[];
  onUpvote: (id: string) => void;
  onStatusChange: (id: string, newStatus: any) => void;
}

export default function CivicDashboard({ currentLanguage, complaints, onUpvote, onStatusChange }: CivicDashboardProps) {
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.FeatureGroup | null>(null);

  const filteredComplaints = complaints.filter(c => {
    if (filterCategory === "all") return true;
    return c.category === filterCategory;
  });

  const t = translations[currentLanguage] || translations.en;

  // Calculate statistics
  const totalReports = complaints.length;
  const resolvedCount = complaints.filter(c => c.status === "resolved").length;
  const inProgressCount = complaints.filter(c => c.status === "in_progress").length;
  const openCount = complaints.filter(c => c.status === "open").length;
  const resolutionRate = totalReports > 0 ? Math.round((resolvedCount / totalReports) * 100) : 0;

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // 1. If map not initialized yet, initialize it
    if (!mapInstanceRef.current) {
      const delhiCenter: L.LatLngExpression = [28.6139, 77.2090];
      const map = L.map(mapContainerRef.current, {
        center: delhiCenter,
        zoom: 11,
        zoomControl: true,
      });

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
      markersGroupRef.current = L.featureGroup().addTo(map);
    }

    // 2. Clear old markers and redraw
    if (markersGroupRef.current && mapInstanceRef.current) {
      markersGroupRef.current.clearLayers();

      filteredComplaints.forEach((comp) => {
        // Build robust custom HTML divIcon for zero-asset failures
        const colorClass = 
          comp.status === "resolved" 
            ? "bg-emerald-500 ring-emerald-200" 
            : comp.status === "in_progress" 
              ? "bg-amber-500 ring-amber-200" 
              : "bg-rose-500 ring-rose-200";

        const categoryEmojis = {
          pothole: "🛣️",
          garbage: "🗑️",
          streetlight: "💡",
          water_leak: "💧",
          other: "⚠️"
        };
        const emoji = categoryEmojis[comp.category as keyof typeof categoryEmojis] || "⚠️";

        const customIcon = L.divIcon({
          html: `
            <div class="flex items-center justify-center w-8 h-8 rounded-full ${colorClass} text-white shadow-md ring-4 cursor-pointer text-sm">
              <span>${emoji}</span>
            </div>
          `,
          className: "custom-leaflet-marker",
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -12]
        });

        const marker = L.marker([comp.latitude, comp.longitude], { icon: customIcon });

        const labelCategory = t[comp.category as keyof typeof t] || comp.category;
        const labelStatus = comp.status === "open" ? (currentLanguage === "hi" ? "लंबित" : "Open") : comp.status === "in_progress" ? t.inProgress : t.resolved;
        const labelVotes = currentLanguage === "hi" ? "वोट" : "votes";
        const labelIssue = currentLanguage === "hi" ? "समस्या" : "Issue";

        // Standard Leaflet Popup
        const popupContent = `
          <div class="p-1 max-w-[200px]" style="font-family: inherit;">
            <div class="font-bold text-slate-900 leading-tight capitalize text-xs">${labelCategory} ${labelIssue}</div>
            <div class="text-[10px] text-slate-400 font-mono mt-0.5">${comp.id}</div>
            <p class="text-[11px] text-slate-600 mt-1 line-clamp-2">${comp.description}</p>
            <div class="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
              <span class="text-[10px] uppercase font-bold text-slate-500">${labelStatus}</span>
              <span class="text-[10px] font-semibold text-emerald-700">${comp.upvoteCount} ${labelVotes}</span>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        
        // Add click listener to select complaint in sidebar
        marker.on("click", () => {
          setSelectedComplaint(comp);
        });

        markersGroupRef.current?.addLayer(marker);
      });

      // Fit map bounds to show all markers if there are any
      if (filteredComplaints.length > 0 && markersGroupRef.current.getLayers().length > 0) {
        try {
          const bounds = markersGroupRef.current.getBounds();
          mapInstanceRef.current.fitBounds(bounds, { padding: [30, 30] });
        } catch (e) {
          console.warn("Failed to auto-fit map bounds:", e);
        }
      }
    }

  }, [filteredComplaints]);

  // Clean up map on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const panToComplaint = (comp: Complaint) => {
    setSelectedComplaint(comp);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([comp.latitude, comp.longitude], 14, {
        animate: true,
        duration: 1
      });
    }
  };

  const categoriesList: { value: string; label: string; emoji: string }[] = [
    { value: "all", label: currentLanguage === "hi" ? "सभी समस्याएं" : "All Problems", emoji: "📋" },
    { value: "pothole", label: t.pothole || "Potholes", emoji: "🛣️" },
    { value: "garbage", label: t.garbage || "Garbage", emoji: "🗑️" },
    { value: "streetlight", label: t.streetlight || "Streetlights", emoji: "💡" },
    { value: "water_leak", label: t.water_leak || "Water Leaks", emoji: "💧" },
    { value: "other", label: t.other || "Others", emoji: "⚠️" }
  ];

  return (
    <div className="space-y-5" id="civic-dashboard-module">
      
      {/* 1. Statistics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5">
        <div className="bg-white dark:bg-gray-800 border-3 sm:border-4 border-gray-800 dark:border-gray-700 p-3 sm:p-4 md:p-5 rounded-2xl sm:rounded-3xl shadow-bento transition-colors duration-200">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider">{t.totalReports || "Total Reports"}</span>
            <Activity className="h-4.5 w-4.5 text-gray-700 dark:text-gray-300" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-tight">{totalReports}</p>
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 block uppercase tracking-wider mt-1">{t.municipalWardArea || "Municipal Ward Area"}</span>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-900/30 border-3 sm:border-4 border-gray-800 dark:border-gray-700 p-3 sm:p-4 md:p-5 rounded-2xl sm:rounded-3xl shadow-bento transition-colors duration-200">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider">{t.resolved || "Resolved"}</span>
            <CheckCircle className="h-4.5 w-4.5 text-bento-green dark:text-green-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-bento-green dark:text-green-400 leading-tight">{resolvedCount}</p>
          <span className="text-[10px] font-black text-bento-green/80 dark:text-green-500 block uppercase tracking-wider mt-1">
            {currentLanguage === "hi" ? `${t.resolutionRate || "समाधान दर"}: ${resolutionRate}%` : `${resolutionRate}% ${t.resolutionRate || "Resolution Rate"}`}
          </span>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 border-3 sm:border-4 border-gray-800 dark:border-gray-700 p-3 sm:p-4 md:p-5 rounded-2xl sm:rounded-3xl shadow-bento transition-colors duration-200">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider">{t.inProgress || "In Progress"}</span>
            <AlertCircle className="h-4.5 w-4.5 text-amber-600 dark:text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-500 leading-tight">{inProgressCount}</p>
          <span className="text-[10px] font-bold text-amber-600/80 dark:text-amber-600/70 block uppercase tracking-wider mt-1">{t.assignedWardOfficers || "Assigned Ward Officers"}</span>
        </div>

        <div className="bg-rose-50 dark:bg-rose-900/20 border-3 sm:border-4 border-gray-800 dark:border-gray-700 p-3 sm:p-4 md:p-5 rounded-2xl sm:rounded-3xl shadow-bento transition-colors duration-200">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider">{t.openFiles || "Open Files"}</span>
            <ShieldAlert className="h-4.5 w-4.5 text-rose-600 dark:text-rose-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-500 leading-tight">{openCount}</p>
          <span className="text-[10px] font-bold text-rose-500 dark:text-rose-500/70 block uppercase tracking-wider mt-1">{t.awaitingAudit || "Awaiting AI/Officer audit"}</span>
        </div>
      </div>

      {/* 2. Main Dashboard Panel (Map + Sidebar split) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
        
        {/* Left Side: Filter + Map */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Category Quick Filter */}
          <div className="bg-white dark:bg-gray-800 border-3 sm:border-4 border-gray-800 dark:border-gray-700 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 overflow-x-auto scrollbar-none scroll-fade-right flex items-center space-x-2 shadow-bento-sm transition-colors duration-200">
            <div className="text-xs font-black text-gray-400 dark:text-gray-500 px-2 flex items-center space-x-1.5 uppercase tracking-widest shrink-0">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">{t.filterLabel || "FILTER:"}</span>
            </div>
            {categoriesList.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilterCategory(cat.value)}
                className={`py-1.5 px-3.5 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer border-2 shadow-bento-sm ${
                  filterCategory === cat.value
                    ? "bg-bento-orange text-white border-gray-800"
                    : "bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 text-bento-text dark:text-gray-300 border-gray-800 dark:border-gray-700"
                }`}
              >
                <span className="mr-1">{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Leaflet map Container */}
          <div className="bg-white dark:bg-gray-800 border-3 sm:border-4 border-gray-800 dark:border-gray-700 rounded-2xl sm:rounded-3xl overflow-hidden shadow-bento relative transition-colors duration-200">
            <div 
              ref={mapContainerRef} 
              className="h-[280px] sm:h-[340px] md:h-[400px] w-full z-10" 
              id="dashboard-leaflet-map"
            />
            <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 z-[1000] bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-2 border-gray-800 dark:border-gray-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-black text-bento-text dark:text-gray-200 flex items-center space-x-2 sm:space-x-3 shadow-bento-sm">
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 bg-rose-500 rounded-full inline-block ring-2 ring-rose-200"></span>
                <span>{currentLanguage === "hi" ? "लंबित" : "Open"}</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block ring-2 ring-amber-200"></span>
                <span>{t.inProgress || "In Progress"}</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block ring-2 ring-emerald-200"></span>
                <span>{t.resolved || "Resolved"}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Active Complaint Inspector and Lists */}
        <div className="lg:col-span-4 flex flex-col h-[350px] sm:h-[400px] lg:h-[465px] bg-white dark:bg-gray-900 border-3 sm:border-4 border-gray-800 dark:border-gray-700 rounded-2xl sm:rounded-3xl overflow-hidden shadow-bento transition-colors duration-200">
          
          {/* Selected Complaint Detail Panel */}
          {selectedComplaint ? (
            <div className="p-4.5 border-b-4 border-gray-800 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 space-y-3 shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono bg-white dark:bg-gray-700 px-2 py-0.5 rounded border-2 border-gray-800 dark:border-gray-600 font-black text-bento-text dark:text-gray-200 shadow-bento-sm">
                  {selectedComplaint.id}
                </span>
                <span className={`px-2.5 py-0.5 rounded border-2 border-gray-800 text-[9px] font-black uppercase tracking-wider text-white shadow-bento-sm ${
                  selectedComplaint.status === "resolved" 
                    ? "bg-bento-green" 
                    : selectedComplaint.status === "in_progress" 
                      ? "bg-bento-blue" 
                      : "bg-bento-orange"
                }`}>
                  {selectedComplaint.status === "open" 
                    ? (currentLanguage === "hi" ? "लंबित" : "Open") 
                    : selectedComplaint.status === "in_progress" 
                      ? t.inProgress 
                      : t.resolved}
                </span>
              </div>

              {selectedComplaint.photoUrl && (
                <div className="h-28 w-full rounded-2xl overflow-hidden border-2 border-gray-800 dark:border-gray-700 bg-slate-100 relative shadow-bento-sm">
                  <img 
                    src={selectedComplaint.photoUrl} 
                    alt="Civic Issue Proof" 
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">{t.verifiedProblemDetails || "Verified Problem Details"}</span>
                <p className="text-xs text-bento-text dark:text-gray-200 font-semibold mt-1 line-clamp-3 leading-relaxed">{selectedComplaint.description}</p>
              </div>

              {/* Interaction Row */}
              <div className="flex items-center justify-between pt-1 gap-2">
                <button
                  onClick={() => onUpvote(selectedComplaint.id)}
                  className="px-3.5 py-2 bg-bento-orange hover:bg-orange-600 active:translate-y-0.5 active:shadow-none text-white rounded-xl text-xs font-black border-2 border-gray-800 shadow-bento-sm transition-all flex items-center space-x-1.5 cursor-pointer shrink-0"
                >
                  <ThumbsUp className="h-3.5 w-3.5 fill-white/10" />
                  <span>{t.upvoteBtn || "Upvote"} ({selectedComplaint.upvoteCount})</span>
                </button>

                {/* Simulated resolver toggle */}
                <select
                  value={selectedComplaint.status}
                  onChange={(e) => onStatusChange(selectedComplaint.id, e.target.value)}
                  className="px-2 py-2 bg-white dark:bg-gray-700 border-2 border-gray-800 dark:border-gray-600 rounded-xl text-xs font-bold text-bento-text dark:text-gray-200 cursor-pointer focus:outline-none shadow-bento-sm flex-1"
                  title="Simulate Municipal Response"
                >
                  <option value="open">{t.simulateOpen || "Simulate Open"}</option>
                  <option value="in_progress">{t.simulateInProgress || "Simulate Progress"}</option>
                  <option value="resolved">{t.simulateResolved || "Simulate Resolve"}</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center border-b-4 border-gray-800 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center shrink-0 h-44">
              <Info className="h-5 w-5 text-gray-400 mb-2" />
              <p className="text-xs font-black text-bento-text dark:text-gray-300 uppercase tracking-wider">{t.selectMapPin || "Select map pin or card"}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-1 max-w-[200px]">{t.exploreActiveCivic || "Explore active civic files and upvote to elevate priority"}</p>
            </div>
          )}

          {/* List of Active filtered complaints */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
            {filteredComplaints.length === 0 ? (
              <div className="py-12 text-center text-gray-400 dark:text-gray-600 text-xs font-bold uppercase tracking-wider">
                {currentLanguage === "hi" ? "इस श्रेणी में कोई शिकायत नहीं है" : "No reports in this category"}
              </div>
            ) : (
              filteredComplaints.map((comp) => (
                <div 
                  key={comp.id}
                  onClick={() => panToComplaint(comp)}
                  className={`p-3.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer flex items-start space-x-3.5 ${
                    selectedComplaint?.id === comp.id ? "bg-gray-50/85 dark:bg-gray-800 border-l-8 border-gray-800 dark:border-gray-600 pl-2" : ""
                  }`}
                >
                  {/* Category circular icon indicator */}
                  <span className="text-2xl shrink-0 mt-0.5">
                    {comp.category === "pothole" ? "🛣️" : comp.category === "garbage" ? "🗑️" : comp.category === "streetlight" ? "💡" : comp.category === "water_leak" ? "💧" : "⚠️"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-bento-text dark:text-white capitalize text-xs truncate">
                        {t[comp.category as keyof typeof t] || comp.category} {currentLanguage === "hi" ? "की रिपोर्ट" : "Report"}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono font-bold">
                        {new Date(comp.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate mt-0.5">{comp.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                        comp.status === "resolved" 
                          ? "bg-bento-green/20 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-400 border-bento-green/40 dark:border-emerald-800" 
                          : comp.status === "in_progress" 
                            ? "bg-bento-blue/20 dark:bg-blue-900/40 text-bento-blue dark:text-blue-400 border-bento-blue/40 dark:border-blue-800" 
                            : "bg-bento-orange/20 dark:bg-orange-900/40 text-bento-orange dark:text-orange-400 border-bento-orange/40 dark:border-orange-800"
                      }`}>
                        {comp.status === "open" 
                          ? (currentLanguage === "hi" ? "लंबित" : "Open") 
                          : comp.status === "in_progress" 
                            ? t.inProgress 
                            : t.resolved}
                      </span>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center space-x-1">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{comp.upvoteCount} {currentLanguage === "hi" ? "वोट" : "votes"}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
