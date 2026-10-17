import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Share2, 
  Download, 
  Copy, 
  Check, 
  Crown, 
  Coins, 
  Play, 
  Pause, 
  Flame, 
  Gift, 
  Video, 
  Camera, 
  Wand2, 
  ArrowRight,
  TrendingUp,
  Award,
  RefreshCw,
  ExternalLink,
  Volume2,
  VolumeX
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sfx } from '../utils/audioFX';
import { Translations } from '../i18n/translations';

export type WishStyle = 'royalty' | 'billionaire' | 'cyberpunk' | 'luxury-travel' | 'superstar' | 'fairytale';

export interface WishVisionItem {
  id: string;
  wishText: string;
  style: WishStyle;
  manifestYear: number;
  visionTitle: string;
  prophecyHeadline: string;
  prophecyStory: string;
  futureSelfQuote: string;
  imageUrl: string;
  accentColor: string;
  pointsEarned: number;
  sharesCount: number;
}

interface AIWishVisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userPoints: number;
  onAddPoints: (points: number, reason: string) => void;
  userEmail: string;
  t?: Translations;
}

export const AIWishVisionModal: React.FC<AIWishVisionModalProps> = ({
  isOpen,
  onClose,
  userPoints,
  onAddPoints,
  userEmail,
  t
}) => {
  const [wishInput, setWishInput] = useState('I want to be rich and travel the world on a private jet');
  const [selectedStyle, setSelectedStyle] = useState<WishStyle>('billionaire');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [activeVision, setActiveVision] = useState<WishVisionItem | null>(null);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(true);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const videoCanvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const PRESET_WISHES = [
    { text: 'I want to be rich with a luxury penthouse and private jet', style: 'billionaire' as WishStyle, label: '💰 I want to be rich' },
    { text: 'I want to be the queen crowned in a grand crystal palace', style: 'royalty' as WishStyle, label: '👑 I want to be the queen' },
    { text: 'I want to be a visionary founder leading civilization on Mars', style: 'cyberpunk' as WishStyle, label: '🚀 Mars pioneer' },
    { text: 'I want to own a private tropical island and superyacht', style: 'luxury-travel' as WishStyle, label: '🌴 Private island' },
    { text: 'I want to be a global superstar performing in front of 100,000 fans', style: 'superstar' as WishStyle, label: '🎤 Global superstar' },
    { text: 'I want to live in an enchanted castle surrounded by northern lights', style: 'fairytale' as WishStyle, label: '🏰 Enchanted castle' }
  ];

  const STYLE_ASSETS: Record<WishStyle, {
    label: string;
    icon: string;
    bgGradient: string[];
    accentColor: string;
    bgImageUrl: string;
  }> = {
    billionaire: {
      label: 'Ultra Wealth & Billionaire',
      icon: '💎',
      bgGradient: ['#1e1b4b', '#0f172a', '#020617'],
      accentColor: '#fbbf24',
      bgImageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f8?w=900&auto=format&fit=crop&q=80'
    },
    royalty: {
      label: 'Queen / King Royalty',
      icon: '👑',
      bgGradient: ['#4a044e', '#2e1065', '#0f051d'],
      accentColor: '#f43f5e',
      bgImageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=900&auto=format&fit=crop&q=80'
    },
    cyberpunk: {
      label: 'Sci-Fi & Cyberpunk Pioneer',
      icon: '🚀',
      bgGradient: ['#083344', '#0f172a', '#020617'],
      accentColor: '#06b6d4',
      bgImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&auto=format&fit=crop&q=80'
    },
    'luxury-travel': {
      label: 'World Traveler & Yacht Mogul',
      icon: '🌴',
      bgGradient: ['#064e3b', '#022c22', '#020617'],
      accentColor: '#10b981',
      bgImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80'
    },
    superstar: {
      label: 'Global Stage Superstar',
      icon: '🎤',
      bgGradient: ['#831843', '#4c0519', '#020617'],
      accentColor: '#ec4899',
      bgImageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=900&auto=format&fit=crop&q=80'
    },
    fairytale: {
      label: 'Fairytale & Mythic Wonder',
      icon: '✨',
      bgGradient: ['#312e81', '#1e1b4b', '#090514'],
      accentColor: '#a855f7',
      bgImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&auto=format&fit=crop&q=80'
    }
  };

  // Generate the AI Vision using server-side Gemini endpoint with client fallback
  const handleGenerateVision = async () => {
    setIsGenerating(true);
    setGenerationStep('Consulting AI temporal nexus...');
    sfx.shutterClick();

    const currentYear = new Date().getFullYear();
    const fallbackYear = currentYear + Math.floor(Math.random() * 4) + 2;
    const styleMeta = STYLE_ASSETS[selectedStyle];

    try {
      setTimeout(() => setGenerationStep('Projecting future timeline & headlines...'), 400);
      setTimeout(() => setGenerationStep('Composing 9:16 cinematic short video...'), 900);

      const res = await fetch('/api/wish/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wishText: wishInput,
          style: selectedStyle,
          userEmail
        })
      });

      if (!res.ok) throw new Error('Server response failed');

      const data = await res.json();

      const newVision: WishVisionItem = {
        id: `vision-${Date.now()}`,
        wishText: wishInput,
        style: selectedStyle,
        manifestYear: data.manifestYear || fallbackYear,
        visionTitle: data.visionTitle || `${styleMeta.label}`,
        prophecyHeadline: data.prophecyHeadline || `By ${fallbackYear}: Dream 100% Manifested into Reality!`,
        prophecyStory: data.prophecyStory || `What was wished into PastSelf in 2026 became an unstoppable reality. You transformed bold ambition into global achievement.`,
        futureSelfQuote: data.futureSelfQuote || `Never stop believing in your power. You made this happen!`,
        imageUrl: data.imageUrl || styleMeta.bgImageUrl,
        accentColor: data.accentColor || styleMeta.accentColor,
        pointsEarned: 50,
        sharesCount: 0
      };

      setActiveVision(newVision);
      setIsGenerating(false);
      sfx.unlockChime();
      onAddPoints(50, 'Generated a Future Wish Vision');

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

    } catch (err) {
      console.warn('Using client-side generation fallback:', err);
      // Fallback seamlessly
      const newVision: WishVisionItem = {
        id: `vision-${Date.now()}`,
        wishText: wishInput,
        style: selectedStyle,
        manifestYear: fallbackYear,
        visionTitle: `${styleMeta.label} Manifested`,
        prophecyHeadline: `By ${fallbackYear}: "${wishInput.slice(0, 45)}..." is Officially Reality!`,
        prophecyStory: `Sealed into your PastSelf timeline in 2026, the prophecy has come to fruition. Your future self is thriving, free, and living the dream.`,
        futureSelfQuote: `To my past self in 2026: Be proud. We made it.`,
        imageUrl: styleMeta.bgImageUrl,
        accentColor: styleMeta.accentColor,
        pointsEarned: 50,
        sharesCount: 0
      };

      setActiveVision(newVision);
      setIsGenerating(false);
      sfx.unlockChime();
      onAddPoints(50, 'Generated a Future Wish Vision');

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Animate the short video loop on the 9:16 vertical canvas
  useEffect(() => {
    if (!activeVision || !videoCanvasRef.current) return;

    const canvas = videoCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 720;
    canvas.height = 1280; // 9:16 vertical short format for TikTok / Reels

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = activeVision.imageUrl;

    let frame = 0;
    const durationFrames = 360; // 12 seconds loop at 30fps

    const renderLoop = () => {
      frame++;
      const progress = (frame % durationFrames) / durationFrames;
      setVideoProgress(progress);

      const w = canvas.width;
      const h = canvas.height;

      // 1. Clear background
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, w, h);

      // 2. Ken Burns Slow Zoom & Pan
      const zoom = 1 + Math.sin(progress * Math.PI) * 0.14;
      const panX = Math.sin(progress * Math.PI * 2) * 15;
      const panY = Math.cos(progress * Math.PI) * 10;

      ctx.save();
      ctx.translate(w / 2 + panX, h / 2 + panY);
      ctx.scale(zoom, zoom);
      ctx.translate(-w / 2, -h / 2);

      try {
        if (img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, -20, -20, w + 40, h + 40);
        } else {
          // Fallback animated gradient
          const grad = ctx.createLinearGradient(0, 0, w, h);
          grad.addColorStop(0, STYLE_ASSETS[activeVision.style].bgGradient[0]);
          grad.addColorStop(1, STYLE_ASSETS[activeVision.style].bgGradient[1]);
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);
        }
      } catch {
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(0, 0, w, h);
      }
      ctx.restore();

      // 3. Cinematic Atmospheric Dark Vignette
      const vignette = ctx.createRadialGradient(w / 2, h / 2, 220, w / 2, h / 2, 750);
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0.35)');
      vignette.addColorStop(0.7, 'rgba(0, 0, 0, 0.7)');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.92)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      // 4. Floating Gold & Neon Stardust Particles
      for (let i = 0; i < 45; i++) {
        const px = ((i * 137 + frame * 1.8) % w);
        const py = ((i * 283 - frame * 2.2) % h + h) % h;
        const radius = (i % 3) + 1.2;
        ctx.fillStyle = i % 2 === 0 ? 'rgba(251, 191, 36, 0.85)' : `${activeVision.accentColor}cc`;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Top Header Tag: AI FUTURE MANIFESTATION
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.82)';
      ctx.strokeStyle = activeVision.accentColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(50, 70, w - 100, 64, 32);
      ctx.fill();
      ctx.stroke();

      ctx.font = '800 22px "JetBrains Mono", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(`✨ FUTURE MANIFESTATION • YEAR ${activeVision.manifestYear}`, w / 2, 110);
      ctx.restore();

      // 6. Center Hero Wish Banner Card
      ctx.save();
      const boxY = h / 2 - 180;
      const boxH = 360;
      ctx.fillStyle = 'rgba(10, 10, 20, 0.92)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(40, boxY, w - 80, boxH, 36);
      ctx.fill();
      ctx.stroke();

      // Top decorative glowing pill
      ctx.fillStyle = `${activeVision.accentColor}25`;
      ctx.strokeStyle = activeVision.accentColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(w / 2 - 140, boxY + 24, 280, 42, 21);
      ctx.fill();
      ctx.stroke();

      ctx.font = '700 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = activeVision.accentColor;
      ctx.textAlign = 'center';
      ctx.fillText(`${STYLE_ASSETS[activeVision.style].icon} ${activeVision.visionTitle.toUpperCase().slice(0, 28)}`, w / 2, boxY + 51);

      // Wish Quote In Quotes
      ctx.font = '800 30px "Syne", sans-serif';
      ctx.fillStyle = '#ffffff';
      
      const wishTextDisplay = activeVision.wishText.length > 55 
        ? `“${activeVision.wishText.slice(0, 52)}...”` 
        : `“${activeVision.wishText}”`;
      ctx.fillText(wishTextDisplay, w / 2, boxY + 115);

      // Divider line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.beginPath();
      ctx.moveTo(80, boxY + 145);
      ctx.lineTo(w - 80, boxY + 145);
      ctx.stroke();

      // Prophecy Headline
      ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#fef08a'; // soft gold
      const headlineDisplay = activeVision.prophecyHeadline.length > 60
        ? `${activeVision.prophecyHeadline.slice(0, 57)}...`
        : activeVision.prophecyHeadline;
      ctx.fillText(headlineDisplay, w / 2, boxY + 185);

      // Future Self Inspiring Quote
      ctx.font = 'italic 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`“${activeVision.futureSelfQuote}”`, w / 2, boxY + 235);
      ctx.font = '600 14px "JetBrains Mono", monospace';
      ctx.fillStyle = activeVision.accentColor;
      ctx.fillText(`— Your Future Self (${activeVision.manifestYear})`, w / 2, boxY + 265);

      // Verification Badge inside box
      ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.beginPath();
      ctx.roundRect(w / 2 - 120, boxY + 295, 240, 36, 18);
      ctx.fill();
      ctx.stroke();
      ctx.font = '700 13px "JetBrains Mono", monospace';
      ctx.fillStyle = '#34d399';
      ctx.fillText('✓ TIMELINE MANIFESTED', w / 2, boxY + 318);

      ctx.restore();

      // 7. Bottom Viral Watermark Box for Brand Visibility
      ctx.save();
      const footY = h - 200;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.90)';
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(50, footY, w - 100, 115, 28);
      ctx.fill();
      ctx.stroke();

      // Brand Watermark
      ctx.font = '900 34px "Syne", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText('#PastSelfApp', 85, footY + 48);

      // Small Pill: VIRAL MANIFESTOR
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.roundRect(330, footY + 20, 140, 28, 14);
      ctx.fill();
      ctx.font = '800 12px "JetBrains Mono", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('AI TIME CAPSULE', 400, footY + 39);

      // Call-to-action link
      ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#fb7185';
      ctx.textAlign = 'left';
      ctx.fillText('Turn your past & future wishes into video • pastself.app', 85, footY + 86);
      ctx.restore();

      if (isPlayingVideo) {
        animFrameRef.current = requestAnimationFrame(renderLoop);
      }
    };

    renderLoop();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeVision, isPlayingVideo]);

  // Social Share & Incentivised Points System (+100 Points)
  const handleShareToEarnPoints = (platform: 'tiktok' | 'instagram' | 'x' | 'whatsapp') => {
    sfx.unlockChime();
    confetti({
      particleCount: 110,
      spread: 80,
      origin: { y: 0.6 }
    });

    onAddPoints(100, `Shared Future Wish on ${platform.toUpperCase()}`);

    const shareUrl = `https://pastself.app/wish/${activeVision?.id || 'demo'}?ref=chrono_viral`;
    const shareText = `🔮 I turned my future wish into an AI video on #PastSelfApp!\n\nWish: "${activeVision?.wishText}"\nPredicted for Year ${activeVision?.manifestYear} ⏳\n\nTurn your dreams into reality at ${shareUrl}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 3000);
    }
  };

  // Download high-res photo snapshot
  const handleDownloadPhoto = () => {
    if (!videoCanvasRef.current) return;
    sfx.shutterClick();
    onAddPoints(50, 'Downloaded Future Wish Artwork');

    const dataUrl = videoCanvasRef.current.toDataURL('image/png', 1.0);
    const a = document.createElement('a');
    a.download = `PastSelf-Wish-${selectedStyle}-${activeVision?.manifestYear || 2030}.png`;
    a.href = dataUrl;
    a.click();

    confetti({ particleCount: 60, spread: 65 });
  };

  // Record short video clip directly from the canvas (.webm / video download)
  const handleRecordVideoClip = () => {
    if (!videoCanvasRef.current || isRecordingVideo) return;

    try {
      sfx.shutterClick();
      setIsRecordingVideo(true);
      recordedChunksRef.current = [];

      const canvas = videoCanvasRef.current;
      const stream = canvas && 'captureStream' in canvas
        ? (canvas as HTMLCanvasElement & { captureStream: (fps?: number) => MediaStream }).captureStream(30)
        : null;
      if (!stream) {
        handleDownloadPhoto();
        setIsRecordingVideo(false);
        return;
      }

      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.download = `PastSelf-WishShort-${selectedStyle}.webm`;
        a.href = videoUrl;
        a.click();
        setIsRecordingVideo(false);
        onAddPoints(50, 'Exported 9:16 Wish Short Video');
        sfx.unlockChime();
        confetti({ particleCount: 80, spread: 75 });
      };

      recorder.start();

      // Record for 4.5 seconds to capture a seamless short loop
      setTimeout(() => {
        if (recorder.state !== 'inactive') {
          recorder.stop();
        }
      }, 4500);

    } catch (err) {
      console.warn('Video recording fallback:', err);
      setIsRecordingVideo(false);
      handleDownloadPhoto();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col my-auto overflow-hidden">
        
        {/* Header with Points Badge */}
        <div className="px-5 py-3.5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">{t?.aiWishTitle || 'AI Future Wish & Vision Studio'}</h3>
                <span className="text-[10px] font-mono-code font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {t?.manifestWishBtn || 'Wishes ➔ Videos'}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                {t?.aiWishSub || 'Turn your ambitions into cinematic future videos and prophecy cards ready for TikTok & Instagram'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live User Points Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono-code font-bold text-xs shadow-sm">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>{userPoints} {t?.chronoPoints || 'Chrono Points'}</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Column: Input and Style Picker */}
          <div className="lg:col-span-6 space-y-4">
            <div>
              <label className="text-[11px] font-mono-code uppercase font-bold text-neutral-400 block mb-1.5 flex items-center gap-1">
                <Wand2 className="w-3.5 h-3.5 text-rose-400" />
                {t?.aiWishTitle || 'What is your biggest wish for future you?'}
              </label>
              <textarea
                value={wishInput}
                onChange={(e) => setWishInput(e.target.value)}
                rows={2}
                placeholder={t?.wishInputPlaceholder || 'e.g. I want to be rich... or I want to be the queen...'}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500 resize-none font-sans"
              />
            </div>

            {/* Quick Inspiration Pills */}
            <div>
              <span className="text-[10px] font-mono-code text-neutral-400 block mb-1">
                Popular Viral Wishes:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_WISHES.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setWishInput(preset.text);
                      setSelectedStyle(preset.style);
                    }}
                    className={`text-[10px] font-medium px-2.5 py-1 rounded-lg border transition-all text-left truncate max-w-full ${
                      wishInput === preset.text
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:text-amber-300 hover:border-amber-500/40'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Aesthetic Theme Chooser */}
            <div>
              <label className="text-[11px] font-mono-code uppercase font-bold text-neutral-400 block mb-1.5">
                {t?.chooseStyle || 'Visual Style & Timeline'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(STYLE_ASSETS) as WishStyle[]).map((styleKey) => {
                  const styleData = STYLE_ASSETS[styleKey];
                  return (
                    <button
                      key={styleKey}
                      onClick={() => setSelectedStyle(styleKey)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        selectedStyle === styleKey
                          ? 'bg-neutral-800 border-amber-500/70 text-white shadow-md'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold font-display">
                        <span>{styleData.icon}</span>
                        <span>{styleData.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateVision}
              disabled={isGenerating || !wishInput.trim()}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-600 hover:to-purple-700 text-white font-display font-bold text-xs shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>
                {isGenerating ? (t?.generating || generationStep) : (t?.generateVision ? `${t.generateVision} (+50 pts)` : 'Manifest Wish into Photo & Video (+50 pts)')}
              </span>
            </button>

            {/* Points Incentive Rewards Info */}
            <div className="bg-amber-950/20 border border-amber-500/30 p-3 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-400 shrink-0" />
                <div className="text-[11px]">
                  <span className="font-bold text-white block">Share & Earn +100 Chrono Points!</span>
                  <span className="text-amber-300/80">Each social share spreads #PastSelfApp and unlocks VIP perks</span>
                </div>
              </div>
              <span className="text-xs font-mono-code font-black text-amber-400">+100 PTS</span>
            </div>
          </div>

          {/* Right Column: Live Short Video Canvas & Social Share */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            
            {/* 9:16 Video Canvas Preview */}
            <div className="relative w-full max-w-[280px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border-2 border-neutral-800 bg-black flex items-center justify-center">
              <canvas
                ref={videoCanvasRef}
                className="w-full h-full object-cover"
              />

              {!activeVision && (
                <div className="absolute inset-0 bg-neutral-950/90 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3 border border-rose-500/30">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <h4 className="text-white font-bold text-xs">Enter your wish on the left</h4>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Try <span className="text-amber-300 font-semibold">"I want to be the queen"</span> or <span className="text-amber-300 font-semibold">"I want to be rich"</span> to generate an animated 9:16 video short loop ready for TikTok & Instagram!
                  </p>
                </div>
              )}

              {/* Play/Pause control overlay */}
              {activeVision && (
                <div className="absolute bottom-3 right-3 flex items-center gap-1">
                  <button
                    onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                    className="p-1.5 rounded-full bg-black/60 text-white/80 hover:text-white backdrop-blur-md"
                    title={isPlayingVideo ? 'Pause Loop' : 'Play Loop'}
                  >
                    {isPlayingVideo ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                  </button>
                </div>
              )}

              {/* Recording in progress indicator */}
              {isRecordingVideo && (
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-600/90 text-white text-[10px] font-mono-code font-bold animate-pulse shadow-md">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  <span>RECORDING SHORT...</span>
                </div>
              )}
            </div>

            {/* Social Sharing Action Bar */}
            {activeVision && (
              <div className="w-full max-w-sm mt-4 space-y-2">
                <div className="text-center text-[10px] font-mono-code font-bold uppercase text-amber-400 flex items-center justify-center gap-1">
                  <Flame className="w-3 h-3 text-rose-500" />
                  <span>Share on Social to Earn +100 Chrono Points</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleShareToEarnPoints('tiktok')}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-neutral-950 border border-cyan-500/40 text-cyan-300 hover:bg-neutral-800 transition-colors"
                  >
                    <span className="text-xs font-bold font-display">TikTok</span>
                    <span className="text-[9px] font-mono-code text-cyan-400">+100 pts</span>
                  </button>

                  <button
                    onClick={() => handleShareToEarnPoints('instagram')}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-neutral-950 border border-rose-500/40 text-rose-300 hover:bg-neutral-800 transition-colors"
                  >
                    <span className="text-xs font-bold font-display">IG Story</span>
                    <span className="text-[9px] font-mono-code text-rose-400">+100 pts</span>
                  </button>

                  <button
                    onClick={() => handleShareToEarnPoints('whatsapp')}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-neutral-950 border border-emerald-500/40 text-emerald-300 hover:bg-neutral-800 transition-colors"
                  >
                    <span className="text-xs font-bold font-display">WhatsApp</span>
                    <span className="text-[9px] font-mono-code text-emerald-400">+100 pts</span>
                  </button>
                </div>

                {/* Download and Video Export Options */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={handleDownloadPhoto}
                    className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-[11px] font-semibold border border-neutral-700 transition-colors active:scale-95"
                    title="Download high-resolution story photo"
                  >
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    <span>Save Photo</span>
                  </button>

                  <button
                    onClick={handleRecordVideoClip}
                    disabled={isRecordingVideo}
                    className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-[11px] font-semibold border border-neutral-700 transition-colors active:scale-95 disabled:opacity-50"
                    title="Export 9:16 vertical short video clip"
                  >
                    <Video className="w-3.5 h-3.5 text-rose-400" />
                    <span>{isRecordingVideo ? 'Saving...' : 'Export Video'}</span>
                  </button>

                  <button
                    onClick={() => handleShareToEarnPoints('tiktok')}
                    className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-[11px] font-semibold border border-neutral-700 transition-colors active:scale-95"
                  >
                    {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                    <span>{copiedCaption ? 'Copied!' : 'Copy Tag'}</span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
