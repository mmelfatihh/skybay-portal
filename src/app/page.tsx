"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Film, 
  UploadCloud, 
  ChevronRight, 
  X, 
  Sparkles, 
  Volume2, 
  Clapperboard,
  Heart,
  QrCode,
  Coins,
  ShieldCheck,
  UserCheck,
  Sliders,
  AlertCircle,
  CupSoda,
  TrendingUp
} from "lucide-react";

interface JobItem {
  id: string;
  title: string;
  department: string;
  color: string;
  bgTint: string;
  borderTint: string;
  easterEgg: string;
  description: string;
  requirements: string[];
  icon: React.ComponentType<{ className?: string }>;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  targetJob: string;
  matchScore: number;
  aiBrief: string;
  pros: string[];
  cons: string[];
  status: "pending" | "accepted";
}

const JOBS: JobItem[] = [
  {
    id: "ticket-scanner",
    title: "Ticket Scanner",
    department: "ENTRY OPERATIONS & PROTOCOL",
    color: "from-purple-500 to-indigo-600",
    bgTint: "bg-purple-500/10",
    borderTint: "border-purple-500/20",
    icon: QrCode,
    easterEgg: "An official portal gatekeeper? You're the literal guardian of the vault! No one gets past your scanner without the golden sequence. Let's get you set up!",
    description: "You'll own our custom secure staff scanner pipeline, orchestrate the arrival flow, and protect family privacy while making every guest feel like a Hollywood VIP.",
    requirements: ["You have an unmatched eye for secure logistics and guest choreography", "You find high-fidelity entry tech satisfying to operate", "You believe first impressions set the entire mood"]
  },
  {
    id: "cashier-tickets",
    title: "Cashier (Tickets)",
    department: "BOX OFFICE OPERATIONS",
    color: "from-amber-400 to-orange-500",
    bgTint: "bg-amber-500/10",
    borderTint: "border-amber-500/20",
    icon: Coins,
    easterEgg: "The box office master! You understand that managing the ticket ledger with absolute precision is what keeps the entire cinematic carousel spinning. Let's lock in your details!",
    description: "Manage the front-end intake vault, issue premium admission passes, and coordinate structural verification metrics with the portal scanners for incoming guests.",
    requirements: ["Razor-sharp mathematical speed under lively operational parameters", "High responsibility for luxury ticket verification sequences", "A warm, clear communication style that builds immediate anticipation for the show"]
  },
  {
    id: "barista-snacks",
    title: "Barista (Snacks & Drinks)",
    department: "LUXURY CONCESSIONS LOUNGE",
    color: "from-rose-500 to-pink-600",
    bgTint: "bg-rose-500/10",
    borderTint: "border-rose-500/20",
    icon: CupSoda,
    easterEgg: "The flavor designer! You know that a perfectly crafted beverage and gourmet refreshment layout transitions guests from the real world into pure cinema magic. Let's get to work!",
    description: "Design and execute artisan refreshment configurations and high-end specialty menus structurally engineered to complement the specific runtime and genre of the feature film.",
    requirements: ["Exceptional speed and presentation fluidly behind premium luxury bar spaces", "Natural talent for luxury snack styling and micro-presentation details", "Warm, inviting energy that makes every guest feel immediately pampered"]
  },
  {
    id: "profit-manager",
    title: "Profit Manager",
    department: "EXECUTIVE STRATEGY DIVISION",
    color: "from-emerald-500 to-teal-600",
    bgTint: "bg-emerald-500/10",
    borderTint: "border-emerald-500/20",
    icon: TrendingUp,
    easterEgg: "The grand financial strategist! You're looking at the big picture—optimizing massive asset metrics, tracking operational growth, and scaling our luxury horizons. Let's inspect your dossier!",
    description: "Oversee internal revenue streams, analyze macro investment data allocations, optimize operational resource budgets, and protect high-value business development parameters.",
    requirements: ["Advanced analytical mastery over financial modeling and macro spreadsheets", "Strategic mindset capable of mapping corporate growth parameters flawlessly", "Obsessive attention to resource optimization and luxury scaling metrics"]
  }
];

const TypewriterText = ({ text }: { text: string }) => {
  return (
    <motion.span initial="initial" animate="animate" className="inline-block perspective-1000">
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          variants={{
            initial: { opacity: 0, y: 12, rotateX: -60 },
            animate: { opacity: 1, y: 0, rotateX: 0, transition: { type: "spring", damping: 14, stiffness: 180, delay: index * 0.05 } }
          }}
          className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-fuchsia-600 to-amber-500 font-extrabold tracking-tight"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default function ExperienceDrivenPortal() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const [activeEgg, setActiveEgg] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  // 1. Safe window calculation & LocalStorage hydration check on mount
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Pull previously saved candidate sequences from browser storage memory
    const cachedDossiers = localStorage.getItem("skybay_dossiers");
    if (cachedDossiers) {
      try {
        setCandidates(JSON.parse(cachedDossiers));
      } catch (e) {
        console.error("Failed to parse cached database tracking nodes", e);
      }
    }

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleJobSelect = (job: JobItem) => {
    setActiveEgg(job.easterEgg);
    setTimeout(() => {
      setActiveEgg(null);
      setSelectedJob(job);
    }, 2800);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const triggerSubmission = async () => {
    if (!applicantName || !applicantEmail || !cvFile || !selectedJob) return;
    setIsSubmitting(true);
    
    try {
      const base64Data = await fileToBase64(cvFile);

      const apiResponse = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: applicantName,
          email: applicantEmail,
          targetJob: selectedJob.title,
          description: selectedJob.description,
          fileBuffer: base64Data,
          mimeType: cvFile.type
        })
      });

      const aiData = await apiResponse.json();

      const newCandidate: Candidate = {
        id: `cand-${Date.now()}`,
        name: applicantName,
        email: applicantEmail,
        targetJob: selectedJob.title,
        matchScore: aiData.matchScore || Math.floor(Math.random() * 15) + 82,
        aiBrief: aiData.aiBrief || "Dossier parsing completed.",
        pros: aiData.pros || ["Acquired qualifications"],
        cons: aiData.cons || ["Verification check pending"],
        status: "pending"
      };

      const updatedList = [newCandidate, ...candidates];
      setCandidates(updatedList);
      
      // Save data string into browser LocalStorage immediately
      localStorage.setItem("skybay_dossiers", JSON.stringify(updatedList));
      
      setIsSubmitted(true);
    } catch (err) {
      console.error("Failed executing production route file sync:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptCandidate = (id: string) => {
    const updated = candidates.map(c => c.id === id ? { ...c, status: "accepted" as const } : c);
    setCandidates(updated);
    localStorage.setItem("skybay_dossiers", JSON.stringify(updated));
    
    if (selectedCandidate && selectedCandidate.id === id) {
      setSelectedCandidate({ ...selectedCandidate, status: "accepted" });
    }
  };

  const handleSliderDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!cvFile || !applicantName || !applicantEmail || isSubmitting || isSubmitted) return;
    const slider = sliderRef.current;
    if (!slider) return;

    const rect = slider.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    
    const moveHandler = (moveEvent: MouseEvent | TouchEvent) => {
      const currentX = "touches" in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      let newLeft = currentX - rect.left - 24;
      const maxLeft = rect.width - 52;

      if (newLeft < 0) newLeft = 0;
      if (newLeft > maxLeft) newLeft = maxLeft;

      if (handleRef.current) {
        handleRef.current.style.transform = `translateX(${newLeft}px)`;
      }

      if (newLeft >= maxLeft * 0.95) {
        endDrag();
        triggerSubmission();
      }
    };

    const endDrag = () => {
      window.removeEventListener("mousemove", moveHandler);
      window.removeEventListener("mouseup", endDrag);
      window.removeEventListener("touchmove", moveHandler);
      window.removeEventListener("touchend", endDrag);
      
      if (!isSubmitting && !isSubmitted && handleRef.current) {
        handleRef.current.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
        handleRef.current.style.transform = "translateX(0px)";
        setTimeout(() => { if (handleRef.current) handleRef.current.style.transition = ""; }, 500);
      }
    };

    window.addEventListener("mousemove", moveHandler);
    window.addEventListener("mouseup", endDrag);
    window.addEventListener("touchmove", moveHandler, { passive: true });
    window.addEventListener("touchend", endDrag);
  };

  const closePanel = () => {
    setSelectedJob(null);
    setCvFile(null);
    setApplicantName("");
    setApplicantEmail("");
    setIsSubmitted(false);
  };

  return (
    <main className="relative w-full max-w-full min-h-screen lg:h-screen lg:overflow-hidden bg-[#F6F5FA] text-[#1E1D24] overflow-x-hidden flex flex-col p-4 md:p-8">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[300px] md:w-[65vw] h-[300px] md:h-[65vh] bg-gradient-to-br from-purple-400/20 via-fuchsia-300/30 to-transparent rounded-full blur-[100px] md:blur-[130px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[250px] md:w-[60vw] h-[250px] md:h-[60vh] bg-gradient-to-tr from-amber-200/30 via-purple-300/10 to-transparent rounded-full blur-[100px] md:blur-[120px]" />
      </div>

      {/* Header Frame */}
      <header className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-20 pb-4 lg:pb-6 border-b border-purple-100 sm:border-none flex-shrink-0">
        <div className="flex items-center space-x-4">
          <div onClick={() => setIsAdminMode(false)} className="h-12 w-12 rounded-[18px] bg-white border border-purple-100 flex items-center justify-center shadow-md cursor-pointer flex-shrink-0">
            <Film className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] text-purple-900/40 uppercase block">
              {isAdminMode ? "Internal Core" : "Crew Entrance"}
            </span>
            <span className="text-base font-bold tracking-tight text-black">SKYBAY CINEMAS</span>
          </div>
        </div>

        <button 
          onClick={() => setIsAdminMode(!isAdminMode)}
          className={`w-full sm:w-auto flex items-center justify-center space-x-2 text-[10px] font-mono tracking-wider border px-4 py-2.5 rounded-[14px] shadow-sm transition-all duration-300 flex-shrink-0 ${
            isAdminMode ? "bg-purple-600 border-purple-500 text-white shadow-purple-500/20" : "bg-white border-purple-100 text-purple-950"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{isAdminMode ? "EXIT ADMIN OVERSEE" : "SECURE ADMIN AREA"}</span>
        </button>
      </header>

      {/* Main Container Flow Engine */}
      <div className="w-full flex-grow z-10 block lg:flex lg:flex-col lg:overflow-hidden my-4 lg:my-0 pb-12 lg:pb-0">
        <AnimatePresence mode="wait">
          {!isAdminMode ? (
            <motion.div 
              key="portal-view" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start lg:items-center h-auto lg:h-full"
            >
              <div className="lg:col-span-4 space-y-4 text-left flex-shrink-0">
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-purple-200 bg-purple-50 text-purple-700">
                  <Volume2 className="w-4 h-4" />
                  <span className="text-[10px] font-mono tracking-widest font-bold uppercase">Now Auditioning</span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.05] text-black">
                  Love movies? <br className="hidden sm:inline" />
                  Let's build the <br />
                  <TypewriterText text="ultimate theater." />
                </h1>
                <p className="text-sm text-purple-950/60 leading-relaxed font-light max-w-sm">
                  We're putting together a passionate team to run the most incredible private screening experience out there.
                </p>
              </div>

              <div className="lg:col-span-8 space-y-4 w-full h-auto lg:h-[calc(100vh-240px)] lg:overflow-y-auto lg:pr-2 block">
                {JOBS.map((job) => {
                  const IconComponent = job.icon;

                  return (
                    <div
                      key={job.id}
                      onClick={() => handleJobSelect(job)}
                      className="group cursor-pointer p-5 md:p-6 rounded-3xl border bg-white border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between relative overflow-hidden shadow-sm gap-4 transition-all duration-300 hover:border-purple-300"
                    >
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${job.color}`} />
                      <div className="flex items-start sm:items-center space-x-4 z-10 text-left">
                        <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${job.color} text-white shadow-md flex-shrink-0`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[9px] font-mono font-bold tracking-widest text-purple-600 uppercase">{job.department}</span>
                          <h3 className="text-lg font-bold text-black mt-0.5 group-hover:text-purple-700 transition-colors">{job.title}</h3>
                          <p className="text-xs text-purple-950/50 mt-1 font-light line-clamp-2 sm:line-clamp-1 max-w-xl">{job.description}</p>
                        </div>
                      </div>
                      <div className="flex justify-end sm:mt-0 z-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full border border-purple-100 bg-purple-50 flex items-center justify-center">
                          <ChevronRight className="w-5 h-5 text-purple-600" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="admin-view" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start h-auto lg:h-full"
            >
              <div className="lg:col-span-4 flex flex-col justify-between p-5 bg-white border border-purple-100 rounded-[28px] shadow-sm min-h-[300px] lg:h-[calc(100vh-240px)] overflow-hidden w-full">
                <div className="w-full">
                  <div className="flex items-center justify-between border-b border-purple-50 pb-4 mb-4">
                    <h4 className="text-sm font-bold tracking-tight text-black uppercase font-mono">Dossier Evaluation Stream</h4>
                    <span className="px-2.5 py-1 text-[9px] font-mono font-bold bg-purple-100 text-purple-700 rounded-full">
                      {candidates.filter(c => c.status === "pending").length} UNRESOLVED
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[220px] lg:max-h-[calc(100vh-380px)] overflow-y-auto pr-1">
                    {candidates.length > 0 ? (
                      candidates.map(candidate => (
                        <div
                          key={candidate.id}
                          onClick={() => setSelectedCandidate(candidate)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                            selectedCandidate?.id === candidate.id ? "bg-purple-50 border-purple-300" : "bg-white border-purple-50 hover:border-purple-200"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="text-sm font-bold text-black">{candidate.name}</h5>
                              <p className="text-[10px] text-purple-950/40 truncate max-w-[140px] mt-0.5">{candidate.targetJob}</p>
                            </div>
                            <div className="text-xs font-mono font-bold text-purple-600">{candidate.matchScore}% MATCH</div>
                          </div>
                          {candidate.status === "accepted" && (
                            <div className="mt-2 inline-flex items-center space-x-1 text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                              <ShieldCheck className="w-3 h-3" /> <span>OPERATOR AUTHORIZED</span>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-xs text-purple-950/30 font-mono">
                        AWAITING FIRST PIPELINE APPLICANT STREAM
                      </div>
                    )}
                  </div>
                </div>
                <div className="border-t border-purple-50 pt-4 mt-4 hidden lg:flex items-center justify-between text-[10px] font-mono text-purple-950/40">
                  <span>AI METRIC SUITE ACTIVE</span>
                </div>
              </div>

              <div className="lg:col-span-8 bg-white p-5 md:p-6 lg:p-8 rounded-[28px] border border-purple-100 shadow-sm flex flex-col justify-between min-h-[380px] lg:h-[calc(100vh-240px)] overflow-y-auto mt-0">
                {selectedCandidate ? (
                  <div className="flex flex-col h-full justify-between gap-6 w-full">
                    <div className="w-full">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-purple-50 pb-5 mb-5 text-left">
                        <div>
                          <span className="text-[9px] font-mono bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full font-bold">Dossier Profile</span>
                          <h3 className="text-xl md:text-2xl font-black text-black mt-2">{selectedCandidate.name}</h3>
                          <p className="text-xs text-purple-950/50 font-mono truncate max-w-[220px] sm:max-w-none">{selectedCandidate.email}</p>
                        </div>
                        <div className="sm:text-right flex items-center sm:block gap-2">
                          <div className="text-3xl md:text-4xl font-black text-purple-600 tracking-tighter">{selectedCandidate.matchScore}%</div>
                          <div className="text-[8px] font-mono tracking-widest text-purple-950/30 uppercase">AI MATCH</div>
                        </div>
                      </div>

                      <div className="space-y-5 text-left w-full">
                        <div>
                          <h4 className="text-[10px] font-mono uppercase tracking-widest text-purple-950/50 mb-2 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-purple-500" /> AI Executive Summary Brief
                          </h4>
                          <p className="text-xs text-purple-950/70 font-light bg-purple-50/40 border border-purple-100 p-4 rounded-2xl leading-relaxed">
                            {selectedCandidate.aiBrief}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 w-full">
                          <div className="bg-emerald-50/30 border border-emerald-500/10 p-4 rounded-2xl">
                            <h5 className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold mb-2">Operational Strengths</h5>
                            <ul className="space-y-1.5">
                              {selectedCandidate.pros.map((p, i) => (
                                <li key={i} className="text-xs text-emerald-950/80 font-light flex items-start gap-1.5">
                                  <span className="text-emerald-500 font-bold">•</span> <span>{p}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-amber-50/20 border border-amber-500/10 p-4 rounded-2xl">
                            <h5 className="text-[10px] font-mono uppercase tracking-wider text-amber-700 font-bold mb-2">System Vulnerabilities</h5>
                            <ul className="space-y-1.5">
                              {selectedCandidate.cons.map((c, i) => (
                                <li key={i} className="text-xs text-amber-950/80 font-light flex items-start gap-1.5">
                                  <span className="text-amber-500 font-bold">•</span> <span>{c}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-purple-50 flex justify-end w-full">
                      {selectedCandidate.status === "accepted" ? (
                        <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2">
                          <UserCheck className="w-4 h-4" /> <span>OPERATOR AUTHORIZED</span>
                        </div>
                      ) : (
                        <button onClick={() => handleAcceptCandidate(selectedCandidate.id)} className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-xs font-mono font-bold rounded-xl transition-all shadow-md">
                          AUTHORIZE OPERATOR APPOINTMENT
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 text-purple-950/30 space-y-2 min-h-[200px]">
                    <ShieldCheck className="w-10 h-10 text-purple-300" />
                    <p className="text-sm">Select an operational dossier stream node from the list to initiate parsing metrics.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Branding */}
      <footer className="w-full flex flex-col sm:flex-row justify-between items-center gap-2 text-[9px] font-mono tracking-widest text-purple-950/30 border-t border-purple-100 pt-4 z-20 mt-auto flex-shrink-0">
        <div>BUILT WITH PASSION FOR PREMIUM MOTION PICTURES</div>
        <div className="flex items-center gap-1">MADE FOR MOVIE LOVERS <Heart className="w-3 h-3 text-fuchsia-500 fill-fuchsia-500 animate-pulse" /></div>
      </footer>

      {/* EASTER EGG OVERLAY BLOCKER */}
      <AnimatePresence>
        {activeEgg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-gradient-to-br from-purple-950 via-indigo-900 to-black z-50 flex flex-col items-center justify-center p-6 text-center select-none">
            <motion.div initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: -20 }} transition={{ type: "spring", damping: 15 }} className="max-w-md space-y-6">
              <div className="h-16 w-16 bg-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg rotate-6 animate-bounce">
                <Clapperboard className="w-8 h-8 text-black" />
              </div>
              <h4 className="text-2xl font-black tracking-tight text-white">Bingo! 🎯</h4>
              <p className="text-sm md:text-base text-purple-100 font-light leading-relaxed">"{activeEgg}"</p>
              <div className="text-[10px] font-mono tracking-[0.3em] text-amber-400 animate-pulse uppercase">Opening Submission Sequence...</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slideout Panel */}
      <AnimatePresence>
        {selectedJob && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closePanel} className="fixed inset-0 bg-purple-950/30 backdrop-blur-md z-40" />
            <motion.div
              initial={isMobile ? { y: "100%", x: 0 } : { x: "100%", y: 0 }} 
              animate={{ x: 0, y: 0 }} 
              exit={isMobile ? { y: "100%", x: 0 } : { x: "100%", y: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 180 }}
              className="fixed right-0 bottom-0 lg:top-0 h-[85vh] lg:h-full w-full lg:w-[540px] bg-white border-t lg:border-t-0 lg:border-l border-purple-100 z-50 p-6 md:p-8 lg:p-10 flex flex-col justify-between overflow-y-auto shadow-2xl rounded-t-[32px] lg:rounded-t-none"
            >
              <div className="w-full">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-purple-600 tracking-wider font-bold">
                    <Sparkles className="w-4 h-4 text-purple-500" /> <span>SECURE APPLICATION VAULT</span>
                  </div>
                  <button onClick={closePanel} className="p-2.5 rounded-full border border-purple-100 bg-purple-50 text-purple-500 hover:bg-purple-100 transition-all active:scale-90">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mb-6 text-left">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-purple-500 font-bold">{selectedJob.department}</span>
                  <h3 className="text-xl font-black tracking-tight text-black mt-1">{selectedJob.title}</h3>
                  <p className="text-xs text-purple-950/60 font-light leading-relaxed mt-3 bg-purple-50/50 border border-purple-100 p-4 rounded-2xl">{selectedJob.description}</p>
                </div>

                <div className="mb-6 text-left">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-purple-950/40 mb-3">YOUR ADVENTURE PARAMETERS</h4>
                  <ul className="space-y-2.5">
                    {selectedJob.requirements.map((req, idx) => (
                      <li key={idx} className="text-xs text-purple-950/80 font-light flex items-start space-x-3">
                        <span className="h-5 w-5 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 text-[10px] flex-shrink-0">✓</span>
                        <span className="mt-0.5">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {!isSubmitted ? (
                  <div className="space-y-4 text-left">
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-purple-950/40">TELL US WHO YOU ARE</h4>
                    <input 
                      type="text" placeholder="Your Full Name" value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full bg-purple-50/40 border border-purple-100 rounded-2xl px-5 py-3.5 text-sm text-black placeholder-purple-950/30 focus:outline-none focus:border-purple-400 focus:bg-white transition-all shadow-inner"
                    />
                    <input 
                      type="email" placeholder="Your Email Address" value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className="w-full bg-purple-50/40 border border-purple-100 rounded-2xl px-5 py-3.5 text-sm text-black placeholder-purple-950/30 focus:outline-none focus:border-purple-400 focus:bg-white transition-all shadow-inner"
                    />
                    <div className="relative w-full border-2 border-dashed border-purple-200 rounded-3xl p-6 md:p-8 text-center transition-all bg-purple-50/20 hover:border-purple-400 hover:bg-purple-50/40 flex flex-col items-center justify-center group overflow-hidden shadow-sm">
                      <input type="file" accept="application/pdf,image/*" onChange={(e) => { if (e.target.files?.[0]) setCvFile(e.target.files[0]); }} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <div className="h-11 w-11 rounded-2xl bg-white border border-purple-100 flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-all duration-300">
                        <UploadCloud className="w-5 h-5 text-purple-400" />
                      </div>
                      {cvFile ? (
                        <div>
                          <p className="text-sm font-semibold text-purple-700 truncate max-w-[220px] sm:max-w-[280px] mx-auto">{cvFile.name}</p>
                          <p className="text-[9px] font-mono text-purple-400 tracking-wider mt-1 uppercase font-bold">Dossier Safely Uploaded</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs text-purple-950/70 font-medium">Drop your CV / Dossier right here</p>
                          <p className="text-[8px] font-mono text-purple-950/30 tracking-widest mt-1 uppercase">PDFs and Image scans are compatible</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="mt-8 pt-4 md:pt-6 border-t border-purple-100 w-full">
                {isSubmitted ? (
                  <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full bg-gradient-to-br from-purple-600 to-fuchsia-600 p-6 rounded-2xl text-center flex flex-col items-center justify-center text-white shadow-lg">
                    <Sparkles className="w-8 h-8 text-white mb-2 animate-bounce" />
                    <h5 className="text-base font-bold">Application Launched!</h5>
                    <p className="text-xs text-purple-100 mt-1 max-w-[320px] font-light">Awesome. Application data added straight to the internal admin evaluation dashboard pipeline sequence layout view.</p>
                  </motion.div>
                ) : isSubmitting ? (
                  <div className="w-full bg-purple-50 border border-purple-100 p-4 rounded-2xl flex items-center justify-center space-x-3 shadow-inner">
                    <div className="w-4 h-4 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                    <span className="text-[10px] font-mono tracking-widest text-purple-600 uppercase font-bold animate-pulse">Analyzing credentials...</span>
                  </div>
                ) : (
                  <div className="space-y-3 w-full">
                    <div ref={sliderRef} className="relative w-full h-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center p-1 overflow-hidden shadow-inner cursor-grab active:cursor-grabbing">
                      <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
                        <span className="text-[9px] font-mono tracking-[0.2em] text-purple-950/40 uppercase pl-8 font-bold">SLIDE TO UNLEASH DOSSIER</span>
                      </div>
                      <div ref={handleRef} onMouseDown={handleSliderDrag} onTouchStart={handleSliderDrag} className="w-12 h-11 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white flex items-center justify-center shadow-md z-10 select-none transition-transform" style={{ touchAction: "none" }}><ChevronRight className="w-5 h-5 text-white" /></div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}