/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { 
  Upload, Camera, MapPin, AlertTriangle, CheckCircle2, 
  Trash2, ArrowRight, Loader2, Info, ThumbsUp, HelpCircle
} from "lucide-react";
import { Complaint, ComplaintCategory, ComplaintSeverity } from "../types";
import { translations } from "../translations";

interface ComplaintFilerProps {
  currentLanguage: string;
  onComplaintSubmitted: () => void;
}

export default function ComplaintFiler({ currentLanguage, onComplaintSubmitted }: ComplaintFilerProps) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locating, setLocating] = useState(false);
  
  // Manual / Override controls (Forgiving error states)
  const [manualCategory, setManualCategory] = useState<ComplaintCategory>("pothole");
  const [manualSeverity, setManualSeverity] = useState<ComplaintSeverity>("medium");
  const [manualDescription, setManualDescription] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Status & pipeline states
  const [loadingState, setLoadingState] = useState<string | null>(null); // e.g. "Reading your photo...", "Checking for similar reports nearby..."
  const [submitResult, setSubmitResult] = useState<{
    isDuplicate: boolean;
    complaint: Complaint;
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-acquire location on mount
  useEffect(() => {
    acquireLocation();
  }, []);

  const acquireLocation = () => {
    setLocating(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser. Using simulated Delhi Center coordinates.");
      setLatitude(28.6139);
      setLongitude(77.2090);
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLocating(false);
      },
      (error) => {
        console.warn("Geolocation access denied or timed out, using default coordinates.", error);
        // Fallback to random Delhi point near center for realistic demo
        const offsetLat = (Math.random() - 0.5) * 0.05;
        const offsetLng = (Math.random() - 0.5) * 0.05;
        setLatitude(28.6139 + offsetLat);
        setLongitude(77.2090 + offsetLng);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Convert File to Base64 String
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result as string);
      setIsFormVisible(true); // make classification options visible
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result as string);
      setIsFormVisible(true);
    };
    reader.readAsDataURL(file);
  };

  const clearPhoto = () => {
    setPhoto(null);
    setSubmitResult(null);
    setLoadingState(null);
    setManualDescription("");
    setIsFormVisible(false);
  };

  const handleFilingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo) return;

    const scanMsg = {
      en: "Reading your photo & analyzing visual features...",
      hi: "आपकी फ़ोटो पढ़ी जा रही है और दृश्य विशेषताओं का विश्लेषण किया जा रहा है...",
      hinglish: "Aapki photo ko scan kiya ja raha hai aur details analyze ho rahi hain...",
      ta: "உங்கள் புகைப்படத்தை வாசித்து காட்சி அம்சங்களை பகுப்பாய்வு செய்கிறது...",
      te: "మీ ఫోటోను చదవడం మరియు విజువల్ ఫీచర్లను విశ్లేషించడం జరుగుతోంది...",
      kn: "ನಿಮ್ಮ ಫೋಟೋವನ್ನು ಓದಲಾಗುತ್ತಿದೆ ಮತ್ತು ದೃಶ್ಯ ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
      bn: "আপনার ফটো স্ক্যান করা হচ্ছে এবং ভিজ্যুয়াল বৈশিষ্ট্য বিশ্লেষণ করা হচ্ছে..."
    };
    const dupMsg = {
      en: "Checking for similar active reports in your immediate vicinity (200m)...",
      hi: "आपके निकटतम क्षेत्र (200 मीटर) में सक्रिय समान रिपोर्टों की जाँच की जा रही है...",
      hinglish: "Aapke aaspas (200m) similar active complaints check ho rahi hain...",
      ta: "உங்கள் அருகிலுள்ள பகுதியில் (200மீ) இதே போன்ற செயலில் உள்ள அறிக்கைகளை சரிபார்க்கிறது...",
      te: "మీ సమీప ప్రాంతంలో (200మీ) ఇలాంటి క్రియాశీల నివేదికల కోసం తనిఖీ చేస్తోంది...",
      kn: "ನಿಮ್ಮ ಸಮೀಪದ ಪ್ರದೇಶದಲ್ಲಿ (200 ಮೀ) ಇದೇ ರೀತಿಯ ಸಕ್ರಿಯ ವರದಿಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",
      bn: "আপনার নিকটবর্তী এলাকায় (200 মিটার) অনুরূপ সক্রিয় রিপোর্ট পরীক্ষা করা হচ্ছে..."
    };
    const submitMsg = {
      en: "Filing report in Ward Registry & routing to Municipal Ward officer...",
      hi: "वार्ड रजिस्ट्री में शिकायत दर्ज की जा रही है और नगरपालिका वार्ड अधिकारी को भेजी जा रही है...",
      hinglish: "Ward registry mein complaint file karke Municipal Ward officer ko bhej rahe hain...",
      ta: "வார்டு பதிவேட்டில் புகாரைப் பதிவு செய்து நகராட்சி வார்டு அதிகாரிக்கு அனுப்புகிறது...",
      te: "వార్డు రిజిస్ట్రీలో ఫిర్యాదును దాఖలు చేసి మునిసిపల్ వార్డు అధికారికి పంపుతోంది...",
      kn: "ವಾರ್ಡ್ ನೋಂದಣಿಯಲ್ಲಿ ದೂರು ದಾಖಲಿಸಿ ಪುರಸಭೆ ವಾರ್ಡ್ ಅಧಿಕಾರಿಗೆ ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...",
      bn: "ওয়ার্ড রেজিস্ট্রিতে অভিযোগ নথিভুক্ত করা হচ্ছে এবং পৌর ওয়ার্ড অফিসারের কাছে পাঠানো হচ্ছে..."
    };

    // Phase 1: Photo scanning
    setLoadingState(scanMsg[currentLanguage as keyof typeof scanMsg] || scanMsg.en);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Phase 2: Duplicate scan
    setLoadingState(dupMsg[currentLanguage as keyof typeof dupMsg] || dupMsg.en);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Phase 3: Submit to backend
    setLoadingState(submitMsg[currentLanguage as keyof typeof submitMsg] || submitMsg.en);

    try {
      const response = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photo,
          latitude,
          longitude,
          manualCategory,
          manualSeverity,
          manualDescription,
        }),
      });

      if (!response.ok) {
        throw new Error("Complaint registration failed.");
      }

      const result = await response.json();
      setSubmitResult(result);
      onComplaintSubmitted(); // notify parent to refresh map/dashboard lists
    } catch (err: any) {
      console.error(err);
      alert("Error submitting complaint: " + err.message);
    } finally {
      setLoadingState(null);
    }
  };

  const t = translations[currentLanguage] || translations.en;

  const categoryOptions: { value: ComplaintCategory; label: string; icon: string }[] = [
    { value: "pothole", label: t.pothole || "Pothole / Road Damage", icon: "🛣️" },
    { value: "garbage", label: t.garbage || "Garbage Pile / Dump", icon: "🗑️" },
    { value: "streetlight", label: t.streetlight || "Broken Streetlight", icon: "💡" },
    { value: "water_leak", label: t.water_leak || "Water Leakage / Pipe", icon: "💧" },
    { value: "other", label: t.other || "Other Civic Problem", icon: "⚠️" },
  ];

  const severityOptions: { value: ComplaintSeverity; label: string; color: string }[] = [
    { value: "low", label: t.low || "Low (Presents no danger)", color: "border-2 border-gray-800 text-bento-green bg-emerald-50 hover:bg-emerald-100" },
    { value: "medium", label: t.medium || "Medium (Blocks access, delay)", color: "border-2 border-gray-800 text-amber-700 bg-amber-50 hover:bg-amber-100" },
    { value: "high", label: t.high || "High (Extreme danger)", color: "border-2 border-gray-800 text-rose-700 bg-rose-50 hover:bg-rose-100" },
  ];

  return (
    <div className="max-w-xl mx-auto bg-white border-3 sm:border-4 border-gray-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-bento p-4 sm:p-5 md:p-7" id="complaint-filer-module">
      
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-bento-text uppercase tracking-tight flex items-center justify-center space-x-1.5">
          <span>{t.filerTitle}</span>
        </h2>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1.5">
          {t.filerSubtitle}
        </p>
      </div>

      {/* Geolocation Status Indicator */}
      <div className="flex items-center justify-between p-3.5 bg-gray-50 border-2 border-gray-800 rounded-xl mb-5 text-xs text-bento-text shadow-bento-sm">
        <div className="flex items-center space-x-2.5">
          <MapPin className={`h-5 w-5 ${latitude ? "text-bento-green" : "text-bento-orange animate-pulse"}`} />
          <div>
            <span className="font-bold uppercase text-[10px] tracking-wider text-gray-400 block">{t.gpsPosition}</span>
            {latitude && longitude ? (
              <span className="text-xs font-mono font-bold">Lat: {latitude.toFixed(5)}, Lng: {longitude.toFixed(5)}</span>
            ) : locating ? (
              <span className="text-xs font-bold text-bento-orange">{t.acquiringGps}</span>
            ) : (
              <span className="text-xs font-bold text-rose-600">{t.gpsFallback}</span>
            )}
          </div>
        </div>
        <button 
          onClick={acquireLocation}
          className="px-3 py-1.5 bg-white border-2 border-gray-800 rounded-lg text-xs font-black text-bento-text hover:bg-gray-100 shadow-bento-sm active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
        >
          {t.refreshGps}
        </button>
      </div>

      {/* Loading state pipeline screen */}
      {loadingState && (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
          <Loader2 className="h-10 w-10 text-bento-blue animate-spin" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-1.5 px-4"
          >
            <h4 className="font-black text-bento-text text-base uppercase tracking-tight">{loadingState}</h4>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.haversineWait}</p>
          </motion.div>
        </div>
      )}

      {/* Result screen: Submission successful or Duplicate found! */}
      {!loadingState && submitResult && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 border-4 rounded-3xl space-y-4.5 bg-white shadow-bento"
          style={{
            borderColor: submitResult.isDuplicate ? "#FF9933" : "#000080"
          }}
        >
          <div className="flex items-start space-x-3.5">
            {submitResult.isDuplicate ? (
              <div className="p-3 bg-amber-50 rounded-xl text-amber-700 border-2 border-gray-800 shadow-bento-sm">
                <AlertTriangle className="h-6 w-6" />
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700 border-2 border-gray-800 shadow-bento-sm">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-black text-bento-text text-xl uppercase tracking-tight">
                {submitResult.isDuplicate ? t.dupDetected : t.successFiled}
              </h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">
                {t.idLabel} <span className="font-mono bg-gray-100 px-2 py-0.5 rounded border border-gray-300 text-gray-700 font-bold">{submitResult.complaint.id}</span>
              </p>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-bento-text bg-gray-50 p-4 rounded-xl border-2 border-gray-800 shadow-bento-sm font-semibold">
            {submitResult.message}
          </p>

          <div className="p-4 bg-white border-2 border-gray-800 rounded-xl shadow-bento-sm space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">{t.recordDetails}</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-400 font-bold uppercase text-[10px] block">{t.categoryLabel}</span>
                <span className="font-bold text-bento-text capitalize">
                  {t[submitResult.complaint.category as keyof typeof t] || submitResult.complaint.category}
                </span>
              </div>
              <div>
                <span className="text-gray-400 font-bold uppercase text-[10px] block">{t.severityLabel}</span>
                <span className="font-bold text-bento-text capitalize">
                  {t[submitResult.complaint.severity as keyof typeof t] || submitResult.complaint.severity}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-400 font-bold uppercase text-[10px] block">{t.aiDescription}</span>
                <span className="font-semibold text-bento-text block">
                  {submitResult.complaint.description}
                </span>
              </div>
              <div>
                <span className="text-gray-400 font-bold uppercase text-[10px] block">{t.totalUpvotes}</span>
                <span className="font-black text-bento-green flex items-center space-x-1 mt-0.5">
                  <ThumbsUp className="h-3.5 w-3.5 fill-emerald-100" />
                  <span>{submitResult.complaint.upvoteCount} {currentLanguage === "hi" ? "वोट" : "Upvotes"}</span>
                </span>
              </div>
              <div>
                <span className="text-gray-400 font-bold uppercase text-[10px] block">{t.municipalStatus}</span>
                <span className="px-2 py-0.5 rounded bg-gray-100 border border-gray-300 text-gray-700 text-[10px] font-mono uppercase font-bold mt-1 inline-block">
                  {submitResult.complaint.status === "open" 
                    ? (currentLanguage === "hi" ? "लंबित" : "Open") 
                    : submitResult.complaint.status === "in-progress" 
                      ? t.inProgress 
                      : t.resolved}
                </span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2.5 pt-2">
            <button 
              onClick={clearPhoto}
              className="flex-1 py-3 bg-white border-2 border-gray-800 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-gray-50 shadow-bento-sm active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              {t.reportAnother}
            </button>
            <button 
              onClick={() => {
                clearPhoto();
                onComplaintSubmitted();
              }}
              className="flex-1 py-3 bg-bento-orange text-white border-2 border-gray-800 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-orange-600 shadow-bento-sm active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              {t.viewMap}
            </button>
          </div>
        </motion.div>
      )}

      {/* Filing Form Pipeline */}
      {!loadingState && !submitResult && (
        <form onSubmit={handleFilingSubmit} className="space-y-5">
          
          {/* Photo Dropzone Container */}
          {!photo ? (
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-3 sm:border-4 border-dashed border-gray-300 hover:border-gray-500 rounded-xl sm:rounded-2xl p-6 sm:p-10 text-center cursor-pointer transition-all bg-gray-50 hover:bg-gray-100 active:bg-gray-200"
              id="file-dropzone-container"
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
                id="manual-file-input"
              />
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 bg-white rounded-xl border-2 border-gray-800 shadow-bento-sm text-bento-blue">
                  <Upload className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-black text-bento-text text-base uppercase tracking-tight">{t.snapSelectPhoto}</p>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">{t.clickToBrowse}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border-3 sm:border-4 border-gray-800 bg-slate-950 flex items-center justify-center max-h-48 sm:max-h-56 shadow-bento-sm">
              <img 
                src={photo} 
                alt="Complaint Upload" 
                className="max-h-56 object-cover"
              />
              <button
                type="button"
                onClick={clearPhoto}
                className="absolute top-2.5 right-2.5 p-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg border-2 border-gray-800 shadow-bento-sm hover:scale-105 transition-all cursor-pointer"
                title="Remove Photo"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Fallback & details override inputs */}
          {photo && isFormVisible && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4.5 pt-1"
            >
              {/* Manual category option block */}
              <div>
                <label className="text-xs font-black uppercase text-gray-400 tracking-wider block mb-2.5">
                  {t.confirmCategory}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categoryOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setManualCategory(opt.value)}
                      className={`p-2.5 sm:p-3.5 text-left border-2 rounded-xl flex items-center space-x-2 sm:space-x-2.5 text-[10px] sm:text-xs font-black uppercase tracking-wide transition-all shadow-bento-sm ${
                        manualCategory === opt.value
                          ? "border-gray-800 bg-bento-orange text-white"
                          : "border-gray-800 text-bento-text hover:bg-gray-100 bg-white"
                      }`}
                    >
                      <span className="text-lg">{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Severity Priority selector */}
              <div>
                <label className="text-xs font-black uppercase text-gray-400 tracking-wider block mb-2.5">
                  {t.estimatedUrgency}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {severityOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setManualSeverity(opt.value)}
                      className={`py-2.5 px-3 border-2 rounded-xl text-center text-xs font-black uppercase tracking-wide transition-all shadow-bento-sm ${
                        manualSeverity === opt.value
                          ? "border-gray-800 bg-bento-blue text-white font-black"
                          : opt.color
                      }`}
                    >
                      <span className="block capitalize">{t[opt.value as keyof typeof t] || opt.value}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Manual Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-wider">
                    {t.addShortDescription}
                  </label>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-100 px-2 py-0.5 border border-gray-200 rounded font-mono">{t.aiAutoGenerate}</span>
                </div>
                <textarea
                  value={manualDescription}
                  onChange={(e) => setManualDescription(e.target.value)}
                  placeholder={currentLanguage === "hi" ? "उदा. सेक्टर 4 कोने पर मुख्य सड़क पर टूटी हुई सीवर पाइप। गंदा पानी बह रहा है..." : "e.g. Broken sewer pipe on Main Road, Sector 4 corner. Spewing dirty water..."}
                  rows={2}
                  className="w-full text-xs p-3.5 border-2 border-gray-800 rounded-xl bg-gray-50 focus:outline-none focus:bg-white focus:border-bento-orange font-semibold text-bento-text"
                />
              </div>

              {/* Submit Buttons */}
              <button
                type="submit"
                className="w-full h-11 sm:h-12 bg-bento-orange hover:bg-orange-600 text-white rounded-xl text-sm font-black border-2 border-gray-800 shadow-bento active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span className="uppercase tracking-wider">{t.submitComplaint}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </form>
      )}
    </div>
  );
}
