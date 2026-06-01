import React, { useState, useRef } from 'react';
import { Flame, Brain, Moon, AlertTriangle, BarChart3, Loader2, Download, X, Share2, MessageCircle, Camera, Send, Globe, Copy, Check, BookOpen } from 'lucide-react';
import './index.css';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const App = () => {
  const [step, setStep] = useState('landing');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const resultRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    attendance: 75,
    internalMarks: 15,
    assignments: 80,
    sleep: 6,
    study: 2,
    backlogs: 0,
    difficulty: 'Medium'
  });

  const quotes = [
    "Sleep is for the weak, but passing is for the sleep-deprived.",
    "Your potential is infinite, your study time is not.",
    "May your coffee be strong and your exam be easy.",
    "Success is 10% talent and 90% avoiding backlogs.",
    "Cs get degrees, but AI gets your GPA roasted."
  ];

  const [randomQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  const handleChange = (e) => {
  const { name, value } = e.target;

  let newValue = value;

  if (name === "sleep") {
    newValue = Math.max(0, Math.min(24, Number(value) || 0));
  }

  if (name === "study") {
    newValue = Math.max(0, Math.min(24, Number(value) || 0));
  }

  if (name === "backlogs") {
    newValue = Math.max(0, Number(value) || 0);
  }

  setFormData({
    ...formData,
    [name]: newValue,
  });
};

  const startAnalysis = () => setStep('form');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePredict = async () => {
    setErrorMessage('');

  // Validation
  if (
    !formData.name.trim() ||
    formData.attendance === '' ||
    formData.internalMarks === '' ||
    formData.assignments === '' ||
    formData.sleep === '' ||
    formData.study === '' ||
    formData.backlogs === ''
  ) {
    setErrorMessage("🍳 Academic records incomplete! Fill in all required details before entering the kitchen.");
    return;
  }

  setLoading(true);

  try {
    const API_BASE_URL =
      import.meta.env.VITE_API_URL ||
      'https://how-cooked-backend.onrender.com';

    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    setResult(data);
    setStep('result');

  } catch (error) {
    console.error("Error connecting to backend:", error);

    alert(
      "🔥 The kitchen servers are taking a smoke break. Please try again in a moment."
    );

  } finally {
    setLoading(false);
  }
};

  const handleDownload = async () => {
    if (resultRef.current) {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#020617', // Match bg-slate-950
        scale: 2, // Higher quality
        logging: false,
        useCORS: true
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `${formData.name || 'Student'}_Cooked_Report.png`;
      link.click();
    }
  };

  const shareActions = {
    twitter: () => {
      const text = `${formData.name || "I"} am ${result.cooked_percentage}% cooked! Status: ${result.status}. Roast: "${result.roast}" 💀\n\nCheck your academic fate:`;
      const url = window.location.href;
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    },
    whatsapp: () => {
      const text = `${formData.name || "I"} am ${result.cooked_percentage}% cooked! Status: ${result.status}. Roast: "${result.roast}" 💀 Check your academic fate: ${window.location.href}`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    },
    telegram: () => {
      const text = `${formData.name || "I"} am ${result.cooked_percentage}% cooked! Status: ${result.status}. Roast: "${result.roast}" 💀 Check your academic fate:`;
      window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`, '_blank');
    },
    facebook: () => {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
    },
    instagram: () => {
      alert("Instagram doesn't support direct link sharing. Downloading your roast image so you can share it to your Story!");
      handleDownload();
    }
  };

  // Data for the "Cooked Meter"
  const doughnutData = result ? {
    labels: ['Cooked', 'Safe'],
    datasets: [{
      data: [result.cooked_percentage, 100 - result.cooked_percentage],
      backgroundColor: ['#ea580c', '#1e293b'],
      borderColor: ['#fb923c', '#334155'],
      borderWidth: 1,
    }]
  } : null;

  // Data for Survival Comparison
  const barData = result ? {
    labels: ['Sleep', 'Study', 'Attendance', 'Backlogs'],
    datasets: [
      {
        label: 'Your Stats',
        data: [
          formData.sleep, 
          formData.study, 
          formData.attendance / 10, 
          formData.backlogs * 2
        ],
        backgroundColor: 'rgba(234, 88, 12, 0.6)',
      },
      {
        label: 'Ideal Student',
        data: [8, 6, 8.5, 0],
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
      },
    ],
  } : null;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 transition-all duration-500 font-sans">
      
      {step === 'landing' && ( // Landing Page
        <div className="text-center space-y-8">
          <div className="relative inline-block">
            <Flame className="w-20 h-20 text-orange-500 mx-auto animate-pulse" />
            <div className="absolute -top-2 -right-2 bg-red-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">Extreme Danger</div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase bg-gradient-to-b from-orange-400 to-red-600 bg-clip-text text-transparent">
            How Cooked Are You? {/* Animated Heading */}
          </h1>
          
          <p className="text-xl text-slate-400 font-medium max-w-lg mx-auto"> {/* Animated Subtitle */}
            The world's first AI-powered academic survival predictor. Stop guessing, start stressing.
          </p>

          <button 
            onClick={startAnalysis} // Added transition-transform for the button itself
            className="group relative px-8 py-4 bg-white text-black font-bold text-xl rounded-full overflow-hidden hover:scale-105 transition-transform"
          >
            <span className="relative z-10 text-black">CHECK MY FATE</span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      )}

      {step === 'form' && ( // Student Input Form
        <div className="w-full max-w-4xl bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-5 sm:p-8 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <Brain className="text-orange-500" />
            <h2 className="text-2xl font-bold">Student Intel</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-base font-semibold text-slate-300 mb-2">Student Name (for the roast)</label>
              <input 
                type="text" name="name" placeholder="E.g. Broke Scholar" value={formData.name} // Added transition and hover effect
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none text-white"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-base md:text-sm font-semibold text-slate-400 mb-2 break-words">Attendance: {formData.attendance}%</label>
              <input 
                type="range" name="attendance" min="0" max="100" value={formData.attendance} // Added transition and hover effect
                className="w-full accent-orange-500" 
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-base font-semibold text-slate-300 mb-2">Internal Marks: {formData.internalMarks}/30</label>
              <input 
                type="range" name="internalMarks" min="0" max="30" value={formData.internalMarks} // Added transition and hover effect
                className="w-full accent-orange-500" 
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-base font-semibold text-slate-300 mb-2 break-words">Assignments Done: {formData.assignments}%</label>
              <input 
                type="range" name="assignments" min="0" max="100" value={formData.assignments}
                className="w-full accent-orange-500" 
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-base font-semibold text-slate-300 mb-2">Exam Difficulty</label>
              <select 
                name="difficulty" 
                value={formData.difficulty}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none text-white focus:ring-2 focus:ring-orange-500"
                onChange={handleChange}
              >
                <option value="Easy">Easy (Light Work)</option>
                <option value="Medium">Medium (Regular Stress)</option>
                <option value="Hard">Hard (Final Boss)</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="flex items-center gap-2 text-base font-semibold text-slate-300 mb-2">
                <Moon size={16}/> Sleep (hrs)
              </label>
              <input 
                type="number" name="sleep" min="0" max="24" value={formData.sleep} // Added transition and hover effect
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 text-lg outline-none text-white"
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col">
              <label className="flex items-center gap-2 text-base font-semibold text-slate-300 mb-2">
                <BookOpen size={16}/> Study (hrs)
              </label>
              <input 
                type="number" name="study"   min="0" max="24"
                value={formData.study}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 text-lg outline-none text-white"
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col">
              <label className="flex items-center gap-2 text-base font-semibold text-slate-300 mb-2">
                <AlertTriangle size={16} className="text-red-500"/> Active Backlogs
              </label>
              <input 
                type="number" name="backlogs"   min="0"
                 value={formData.backlogs} // Added transition and hover effect
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 text-lg outline-none text-white"
                onChange={handleChange}
              />
            </div>
          </div>

          {errorMessage && (
           <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm font-medium">
            ⚠️ {errorMessage}
            </div>
            )}
            <button 
            disabled={loading}
            className={`w-full mt-10 py-4 ${loading ? 'bg-slate-700' : 'bg-orange-600 hover:bg-orange-500 hover:scale-[1.01]'} text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-orange-900/20`} // Added hover:scale and transition-all
            onClick={handlePredict}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>CONSULTING THE BRAIN...</span>
              </div>
            ) : "CALCULATE COOKED-NESS"}
          </button>
        </div>
      )}

      {step === 'result' && result && ( // Result Dashboard
        <div 
          ref={resultRef}
          className={`w-full max-w-4xl text-center space-y-8 py-10 px-6 animate-in zoom-in duration-500 bg-slate-950 relative ${result.status.includes('Deep Fried') ? 'oil-crackle-active' : ''}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* Left: Score and Roast */}
            <div className="space-y-6 order-2 md:order-1">
              <h2 className="text-5xl font-black italic tracking-tighter">
                {formData.name.toUpperCase() || "BRO"}, YOU ARE <span className={`transition-colors ${result.status.includes('Deep Fried') ? 'text-red-600 deep-fry-active inline-block' : 'text-orange-500'}`}>{result.cooked_percentage ?? 0}%</span> COOKED
              </h2>
              
              <div className={`p-8 bg-slate-900/50 backdrop-blur-md rounded-3xl border ${result.status.includes('Deep Fried') ? 'border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.5)] deep-fry-active' : 'border-slate-800'} shadow-2xl transition-all`}>
                <p className="text-2xl italic text-slate-300">"{result.roast}"</p>
                <div className={`mt-6 text-xl font-bold uppercase tracking-widest ${result.status.includes('Deep Fried') ? 'text-red-500 animate-pulse' : 'text-orange-500'}`}>
                  Status: {result.status}
                </div>
              </div>
            </div>

            {/* Random Motivational Quote */}
            <div className="absolute top-4 right-4 max-w-xs hidden lg:block p-4 bg-slate-900/80 backdrop-blur rounded-2xl border border-slate-800 italic text-slate-400 text-xs">
              "{randomQuote}"
            </div>

            {/* Right: Doughnut Chart */}
            <div className={`bg-slate-900/30 p-6 rounded-3xl border ${result.status.includes('Deep Fried') ? 'border-red-600 deep-fry-active' : 'border-slate-800'} order-1 md:order-2 h-64 flex items-center justify-center`}>
              <Doughnut data={doughnutData} options={{ cutout: '70%', plugins: { legend: { display: false } } }} />
            </div>
          </div>

          {/* Bottom: Survival Comparison Bar Chart */}
          <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="text-orange-500" />
              <h3 className="text-xl font-bold uppercase tracking-tight">Survival Analytics</h3>
            </div>
            <div className="h-64">
              <Bar 
                data={barData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  scales: { y: { grid: { color: '#1e293b' } }, x: { grid: { display: false } } },
                  plugins: { legend: { labels: { color: '#94a3b8' } } }
                }} 
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 no-print" data-html2canvas-ignore>
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 px-8 py-3 bg-orange-600 text-white font-bold rounded-full hover:scale-105 transition-transform hover:bg-orange-500 duration-200"
            >
              <Download size={20} />
              DOWNLOAD ROAST
            </button>

            {!showShareOptions ? (
              <button 
                onClick={() => setShowShareOptions(true)}
                className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:scale-105 transition-transform hover:bg-blue-500 duration-200"
              >
                <Share2 size={20} />
                SHARE
              </button>
            ) : (
              <div className="flex gap-2 items-center bg-slate-900/80 p-1 rounded-full border border-slate-700 animate-in fade-in slide-in-from-right-4">
                <button onClick={shareActions.twitter} title="Twitter/X" className="p-3 bg-black text-white rounded-full hover:scale-110 transition-transform shadow-lg"><X size={20}/></button>
                <button onClick={shareActions.whatsapp} title="WhatsApp" className="p-3 bg-[#25D366] text-white rounded-full hover:scale-110 transition-transform shadow-lg"><MessageCircle size={20}/></button>
                <button onClick={shareActions.facebook} title="Facebook" className="p-3 bg-[#1877F2] text-white rounded-full hover:scale-110 transition-transform shadow-lg"><Globe size={20}/></button>
                <button onClick={shareActions.telegram} title="Telegram" className="p-3 bg-[#0088cc] text-white rounded-full hover:scale-110 transition-transform shadow-lg"><Send size={20}/></button>
                <button onClick={shareActions.instagram} title="Instagram" className="p-3 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white rounded-full hover:scale-110 transition-transform shadow-lg"><Camera size={20}/></button>
                <button onClick={handleCopyLink} title="Copy Link" className={`p-3 ${copied ? 'bg-green-600' : 'bg-slate-700'} text-white rounded-full hover:scale-110 transition-transform shadow-lg transition-colors duration-200`}>
                  {copied ? <Check size={20}/> : <Copy size={20}/>}
                </button>
                <button 
                  onClick={() => setShowShareOptions(false)} 
                  className="px-4 py-2 text-xs font-black uppercase text-slate-400 hover:text-white transition-colors"
                >
                  CLOSE
                </button>
              </div>
            )}

            <button 
              onClick={() => {
                setStep('landing');
                setShowShareOptions(false);
              }}
              className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform hover:bg-gray-200 duration-200"
            >
              RECALCULATE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
