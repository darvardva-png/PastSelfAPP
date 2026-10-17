import React, { useState, useRef } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  Camera, 
  Coins, 
  Flame, 
  Crown, 
  Lock, 
  Unlock, 
  HelpCircle,
  ExternalLink,
  MessageCircle,
  Twitter,
  Instagram,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PastSelfCapsule } from '../types';
import { sfx } from '../utils/audioFX';

interface CapsuleShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  capsule: PastSelfCapsule;
  userPoints: number;
  onAddPoints: (points: number, reason: string) => void;
}

export const CapsuleShareModal: React.FC<CapsuleShareModalProps> = ({
  isOpen,
  onClose,
  capsule,
  userPoints,
  onAddPoints
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [sharedPlatforms, setSharedPlatforms] = useState<Record<string, boolean>>({});
  const [isGeneratingStoryCard, setIsGeneratingStoryCard] = useState(false);
  const [earnedToday, setEarnedToday] = useState(0);
  const [pointsToast, setPointsToast] = useState<{ amount: number; message: string } | null>(null);

  const storyCanvasRef = useRef<HTMLCanvasElement>(null);

  if (!isOpen) return null;

  // Generate unique link for this capsule
  const shareOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://pastself.app';
  const uniqueShareUrl = `${shareOrigin}/?capsule=${encodeURIComponent(capsule.id)}`;
  const uniqueCapsuleCode = `PASTSELF-${capsule.id.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}`;

  // Default viral captions
  const viralCaption = capsule.prediction
    ? `My ${capsule.yearsAgo}y time-capsule prediction: "${capsule.prediction.prediction}" (${capsule.prediction.confidence}% confident). Did it come true? Check it out on #PastSelfApp! ⏳ ${uniqueShareUrl}`
    : `I locked a secret time-capsule video into the #PastSelfApp vault! Unlocks on ${capsule.unlockDate}. Watch here: ${uniqueShareUrl} 🔐✨`;

  const awardPoints = (amount: number, platformName: string) => {
    sfx.unlockChime();
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.6 }
    });

    setEarnedToday(prev => prev + amount);
    setSharedPlatforms(prev => ({ ...prev, [platformName]: true }));
    onAddPoints(amount, `Shared capsule to ${platformName}`);

    setPointsToast({
      amount,
      message: `+${amount} Chrono Points earned for sharing to ${platformName}!`
    });
    setTimeout(() => setPointsToast(null), 3000);
  };

  // 1. Copy Unique Link
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(uniqueShareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);

      if (!sharedPlatforms['link']) {
        awardPoints(25, 'Link Copied');
      } else {
        sfx.shutterClick();
      }
    } catch {
      // Fallback
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // 2. Copy Viral Caption
  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(viralCaption);
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2500);
      sfx.shutterClick();
    } catch {
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2500);
    }
  };

  // 3. TikTok Share Trigger
  const handleShareTikTok = async () => {
    const textToShare = `${viralCaption}\n\n#PastSelfApp #TimeCapsule #BlindReaction #FutureSelf`;
    
    // Copy caption to clipboard so user can instantly paste into TikTok
    try {
      await navigator.clipboard.writeText(textToShare);
    } catch (e) {
      console.warn('Clipboard write error', e);
    }

    if (!sharedPlatforms['tiktok']) {
      awardPoints(75, 'TikTok');
    }

    // Attempt Native Web Share API if on mobile device
    if (navigator.share && /mobile|android|iphone/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title: `PastSelf Time Capsule: ${capsule.title}`,
          text: textToShare,
          url: uniqueShareUrl
        });
        return;
      } catch {
        // user cancelled or share failed, proceed to web intent
      }
    }

    // Direct web redirect to TikTok upload or mobile app protocol
    window.location.href = `https://www.tiktok.com/`;
  };

  // 4. Instagram Share & Story Card Trigger
  const handleShareInstagram = async () => {
    const textToShare = `${viralCaption}\n\nTag @pastselfapp in your Story!`;
    
    try {
      await navigator.clipboard.writeText(textToShare);
    } catch (e) {
      console.warn('Clipboard error', e);
    }

    if (!sharedPlatforms['instagram']) {
      awardPoints(75, 'Instagram');
    }

    // Also trigger story card download so user has the visual to post
    await handleDownloadStoryCard();

    // Mobile check: open Instagram app protocol or web
    if (/mobile|android|iphone/i.test(navigator.userAgent)) {
      window.location.href = 'instagram://app';
      setTimeout(() => {
        window.location.href = 'https://www.instagram.com/';
      }, 1000);
    } else {
      window.location.href = 'https://www.instagram.com/';
    }
  };

  // 5. WhatsApp Share Trigger
  const handleShareWhatsApp = () => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `Check out this Time Capsule on PastSelf! ⏳\n\n"${capsule.title}"\n${uniqueShareUrl}`
    )}`;

    if (!sharedPlatforms['whatsapp']) {
      awardPoints(50, 'WhatsApp');
    }

    window.location.href = whatsappUrl;
  };

  // 6. X (Twitter) Share Trigger
  const handleShareTwitter = () => {
    const tweetText = `Just shared a time-capsule on #PastSelfApp! ⏳ "${capsule.title}"`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(uniqueShareUrl)}&hashtags=PastSelfApp,TimeCapsule,Predictions`;

    if (!sharedPlatforms['twitter']) {
      awardPoints(50, 'X (Twitter)');
    }

    window.location.href = tweetUrl;
  };

  // 7. Generate & Download Instagram 9:16 Story Card
  const handleDownloadStoryCard = async () => {
    setIsGeneratingStoryCard(true);
    sfx.shutterClick();

    const canvas = storyCanvasRef.current;
    if (!canvas) {
      setIsGeneratingStoryCard(false);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsGeneratingStoryCard(false);
      return;
    }

    // Dimensions: 9:16 Vertical Story format (1080 x 1920)
    canvas.width = 1080;
    canvas.height = 1920;

    // Background Gradient: Deep cyber night
    const bgGradient = ctx.createLinearGradient(0, 0, 1080, 1920);
    bgGradient.addColorStop(0, '#0a0a0f');
    bgGradient.addColorStop(0.3, '#1e102a');
    bgGradient.addColorStop(0.7, '#130d22');
    bgGradient.addColorStop(1, '#050508');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1080, 1920);

    // Cyber grid lines
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 1080; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1920);
      ctx.stroke();
    }
    for (let y = 0; y < 1920; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1080, y);
      ctx.stroke();
    }

    // Glowing nebula circles
    const radGlow = ctx.createRadialGradient(540, 600, 50, 540, 600, 500);
    radGlow.addColorStop(0, 'rgba(244, 63, 94, 0.25)');
    radGlow.addColorStop(0.5, 'rgba(168, 85, 247, 0.15)');
    radGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = radGlow;
    ctx.fillRect(0, 200, 1080, 1000);

    // Header Branding
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PASTSELF TIME CAPSULE', 540, 180);

    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 26px monospace';
    ctx.fillText('• TEMPORAL VAULT RECORD •', 540, 230);

    // Main Card Box
    ctx.fillStyle = 'rgba(18, 18, 26, 0.85)';
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(100, 300, 880, 1150, 40);
    ctx.fill();
    ctx.stroke();

    // Capsule Status Badge
    if (capsule.isUnlocked) {
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 32px monospace';
      ctx.fillText(`🔓 UNLOCKED AFTER ${capsule.yearsAgo} YEARS`, 540, 390);
    } else {
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 32px monospace';
      ctx.fillText(`🔒 SEALED IN VAULT • UNLOCKS ${capsule.unlockDate}`, 540, 390);
    }

    // Capsule Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 54px sans-serif';
    ctx.textAlign = 'center';
    const titleWords = capsule.title.split(' ');
    let line1 = '';
    let line2 = '';
    titleWords.forEach(w => {
      if ((line1 + w).length < 24) line1 += w + ' ';
      else line2 += w + ' ';
    });
    ctx.fillText(line1.trim(), 540, 480);
    if (line2) ctx.fillText(line2.trim(), 540, 545);

    // Prompt Quote
    ctx.fillStyle = '#9ca3af';
    ctx.font = 'italic 32px sans-serif';
    ctx.fillText(`"${capsule.prompt.slice(0, 60)}..."`, 540, 640);

    // Creator Info
    ctx.fillStyle = '#e5e7eb';
    ctx.font = 'bold 34px sans-serif';
    ctx.fillText(`Creator: ${capsule.creatorName} (${capsule.creatorHandle})`, 540, 740);

    ctx.fillStyle = '#6b7280';
    ctx.font = '26px monospace';
    ctx.fillText(`Recorded on: ${capsule.recordedDate}`, 540, 790);

    // Prediction Bet Highlight Box
    if (capsule.prediction) {
      ctx.fillStyle = 'rgba(30, 27, 45, 0.9)';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(160, 860, 760, 260, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 28px monospace';
      ctx.fillText(`🔮 PREDICTION BET (${capsule.prediction.confidence}% CONFIDENT)`, 540, 920);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 34px sans-serif';
      ctx.fillText(`"${capsule.prediction.prediction}"`, 540, 990);

      if (capsule.prediction.outcome === 'correct') {
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 32px sans-serif';
        ctx.fillText('✅ Prediction Came True 100%!', 540, 1060);
      } else if (capsule.prediction.outcome === 'wrong') {
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 32px sans-serif';
        ctx.fillText('❌ Prediction Failed!', 540, 1060);
      } else {
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 32px sans-serif';
        ctx.fillText('⏳ Verification Pending in Future', 540, 1060);
      }
    }

    // Unique Code Pill
    ctx.fillStyle = '#1f2937';
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(240, 1260, 600, 90, 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 36px monospace';
    ctx.fillText(`CODE: ${uniqueCapsuleCode}`, 540, 1318);

    // Call to action bottom footer
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('Scan or Visit to Watch & Duet', 540, 1550);

    ctx.fillStyle = '#ec4899';
    ctx.font = 'bold 32px monospace';
    ctx.fillText(uniqueShareUrl.replace(/^https?:\/\//, ''), 540, 1610);

    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 38px monospace';
    ctx.fillText('#PastSelfApp • #TimeCapsule', 540, 1720);

    // Download trigger
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `pastself-capsule-${capsule.id}-story.png`;
      a.click();
      sfx.unlockChime();
    } catch (e) {
      console.warn('Canvas export error', e);
    } finally {
      setIsGeneratingStoryCard(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto">
      
      {/* Hidden canvas for generating 9:16 Instagram Story PNG */}
      <canvas ref={storyCanvasRef} className="hidden" />

      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col my-auto overflow-hidden">
        
        {/* Top Points Notification Banner */}
        {pointsToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold text-xs px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 fill-current" />
            <span>{pointsToast.message}</span>
          </div>
        )}

        {/* Header Banner */}
        <div className="relative bg-gradient-to-r from-purple-950/70 via-rose-950/60 to-neutral-900 p-6 border-b border-neutral-800 text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center mx-auto mb-2.5 shadow-lg shadow-rose-500/25">
            <Share2 className="w-6 h-6 text-white" />
          </div>

          <h3 className="text-xl font-display font-black text-white tracking-tight">
            Share Capsule & <span className="text-amber-400">Earn Chrono Points</span>
          </h3>
          <p className="text-xs text-neutral-300 mt-1 max-w-md mx-auto">
            Share your time-capsule or predictions to TikTok, Instagram & friends to unlock viral perks!
          </p>

          {/* User Points Badge */}
          <div className="mt-3 inline-flex items-center gap-2 bg-neutral-950/90 border border-neutral-800 px-3.5 py-1.5 rounded-full shadow-inner">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono-code font-bold text-neutral-200">
              Your Chrono Balance: <span className="text-amber-400 font-extrabold">{userPoints} pts</span>
            </span>
            {earnedToday > 0 && (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                +{earnedToday} today!
              </span>
            )}
          </div>
        </div>

        {/* Capsule Summary Card Preview */}
        <div className="p-5 space-y-4">
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800/80 flex items-start gap-3.5">
            <img
              src={capsule.thumbnailUrl}
              alt={capsule.title}
              className="w-16 h-16 rounded-xl object-cover ring-1 ring-neutral-700 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                {capsule.isUnlocked ? (
                  <span className="text-[10px] font-mono-code font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-500/30">
                    <Unlock className="w-3 h-3" /> Unlocked ({capsule.yearsAgo}y ago)
                  </span>
                ) : (
                  <span className="text-[10px] font-mono-code font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md flex items-center gap-1 border border-amber-500/30">
                    <Lock className="w-3 h-3" /> Vaulted (Unlocks {capsule.unlockDate})
                  </span>
                )}
                <span className="text-[10px] font-mono-code text-neutral-500">#{capsule.id}</span>
              </div>
              <h4 className="text-xs font-bold text-white truncate">{capsule.title}</h4>
              <p className="text-[11px] text-neutral-400 line-clamp-1 italic mt-0.5">
                &ldquo;{capsule.prompt}&rdquo;
              </p>
              {capsule.prediction && (
                <div className="mt-1.5 flex items-center gap-1 text-[10px] text-amber-300">
                  <HelpCircle className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="truncate">Bet: {capsule.prediction.prediction}</span>
                </div>
              )}
            </div>
          </div>

          {/* 1. Unique Share Link Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono-code uppercase font-bold text-neutral-300 flex items-center gap-1.5">
                <span>Unique Capsule Link</span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                  +25 pts
                </span>
              </label>
              <span className="text-[10px] font-mono-code text-neutral-500">
                Code: {uniqueCapsuleCode}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={uniqueShareUrl}
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 font-mono-code focus:outline-none focus:border-rose-500/60"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 active:scale-95 ${
                  copiedLink
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                }`}
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* 2. One-Tap Social Media API Triggers */}
          <div className="space-y-2 pt-1">
            <label className="text-[11px] font-mono-code uppercase font-bold text-neutral-300 flex items-center justify-between">
              <span>Post Directly to Earn Points</span>
              <span className="text-[10px] text-neutral-400 font-normal">Click platform to share & claim</span>
            </label>

            <div className="grid grid-cols-2 gap-2.5">
              {/* TikTok */}
              <button
                onClick={handleShareTikTok}
                className="group relative flex flex-col p-3 rounded-2xl bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 hover:border-cyan-500/50 transition-all text-left shadow-md active:scale-95"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">🎵</span>
                    <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">TikTok</span>
                  </div>
                  <span className="text-[10px] font-mono-code font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                    +75 pts
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 leading-tight">
                  Copies viral sound tags & opens TikTok
                </p>
                {sharedPlatforms['tiktok'] && (
                  <div className="mt-2 text-[10px] text-emerald-400 font-mono-code flex items-center gap-1">
                    <Check className="w-3 h-3" /> Shared (+75 pts)
                  </div>
                )}
              </button>

              {/* Instagram */}
              <button
                onClick={handleShareInstagram}
                className="group relative flex flex-col p-3 rounded-2xl bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 hover:border-rose-500/50 transition-all text-left shadow-md active:scale-95"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-1.5">
                    <Instagram className="w-4 h-4 text-rose-400" />
                    <span className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors">Instagram</span>
                  </div>
                  <span className="text-[10px] font-mono-code font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                    +75 pts
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 leading-tight">
                  Generates Story Card (PNG) & opens IG
                </p>
                {sharedPlatforms['instagram'] && (
                  <div className="mt-2 text-[10px] text-emerald-400 font-mono-code flex items-center gap-1">
                    <Check className="w-3 h-3" /> Shared (+75 pts)
                  </div>
                )}
              </button>

              {/* WhatsApp */}
              <button
                onClick={handleShareWhatsApp}
                className="group relative flex flex-col p-3 rounded-2xl bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 hover:border-emerald-500/50 transition-all text-left shadow-md active:scale-95"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">WhatsApp</span>
                  </div>
                  <span className="text-[10px] font-mono-code font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                    +50 pts
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 leading-tight">
                  Direct message link to friends & groups
                </p>
                {sharedPlatforms['whatsapp'] && (
                  <div className="mt-2 text-[10px] text-emerald-400 font-mono-code flex items-center gap-1">
                    <Check className="w-3 h-3" /> Shared (+50 pts)
                  </div>
                )}
              </button>

              {/* X / Twitter */}
              <button
                onClick={handleShareTwitter}
                className="group relative flex flex-col p-3 rounded-2xl bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 hover:border-blue-500/50 transition-all text-left shadow-md active:scale-95"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-1.5">
                    <Twitter className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">X (Twitter)</span>
                  </div>
                  <span className="text-[10px] font-mono-code font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                    +50 pts
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 leading-tight">
                  Tweet prediction bet & deep link
                </p>
                {sharedPlatforms['twitter'] && (
                  <div className="mt-2 text-[10px] text-emerald-400 font-mono-code flex items-center gap-1">
                    <Check className="w-3 h-3" /> Shared (+50 pts)
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* 3. Story Card PNG Export Tool */}
          <div className="pt-2">
            <button
              onClick={handleDownloadStoryCard}
              disabled={isGeneratingStoryCard}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-amber-500/20 hover:from-purple-500/30 hover:to-amber-500/30 border border-purple-500/30 text-neutral-200 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 text-purple-400" />
              <span>
                {isGeneratingStoryCard ? 'Rendering Story Poster...' : 'Download 9:16 Story Card (PNG for IG / TikTok)'}
              </span>
            </button>
          </div>

          {/* Viral Caption Copy Tool */}
          <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
            <span className="text-neutral-400 text-[11px]">Ready-to-paste caption:</span>
            <button
              onClick={handleCopyCaption}
              className="text-[11px] text-rose-400 hover:text-rose-300 font-mono-code flex items-center gap-1 underline"
            >
              {copiedCaption ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCaption ? 'Copied Caption!' : 'Copy Pre-Made Caption'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
