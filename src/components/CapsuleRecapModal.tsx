import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Download, 
  Share2, 
  Sparkles, 
  Copy, 
  Check, 
  Camera, 
  Award, 
  Clock, 
  Flame, 
  Lock, 
  HelpCircle, 
  Palette,
  Eye,
  Instagram
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sfx } from '../utils/audioFX';

export type RecapTheme = 'cyber-neon' | 'retro-vhs' | 'y2k-chrome' | 'midnight-nebula';

interface CapsuleRecapModalProps {
  isOpen: boolean;
  onClose: () => void;
  userStats: {
    userName: string;
    userHandle: string;
    userAvatar: string;
    totalCapsules: number;
    totalDuets: number;
    blindReactions: number;
    predictionBets: number;
    unlockedBadges: {
      name: string;
      tier: 'bronze' | 'silver' | 'gold' | 'neon';
      icon: 'clock' | 'flame' | 'eye' | 'help' | 'trophy';
    }[];
    rankTitle: string;
  };
}

export const CapsuleRecapModal: React.FC<CapsuleRecapModalProps> = ({
  isOpen,
  onClose,
  userStats
}) => {
  const [theme, setTheme] = useState<RecapTheme>('cyber-neon');
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // Render the story canvas whenever theme or stats change
  useEffect(() => {
    if (!isOpen) return;
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    renderStoryCard(canvas, theme, userStats);
  }, [isOpen, theme, userStats]);

  const renderStoryCard = (
    canvas: HTMLCanvasElement, 
    activeTheme: RecapTheme, 
    stats: typeof userStats
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set 9:16 Instagram Story dimensions (1080 x 1920)
    canvas.width = 1080;
    canvas.height = 1920;
    const w = canvas.width;
    const h = canvas.height;

    // 1. Background Theme
    if (activeTheme === 'cyber-neon') {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#090514');
      grad.addColorStop(0.4, '#15082a');
      grad.addColorStop(0.8, '#0d041c');
      grad.addColorStop(1, '#05020a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Neon grid lines
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.08)';
      ctx.lineWidth = 2;
      for (let x = 0; x < w; x += 80) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 80) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Glow orbs
      drawGlowOrb(ctx, 200, 300, 350, 'rgba(244, 63, 94, 0.22)');
      drawGlowOrb(ctx, 900, 1100, 420, 'rgba(168, 85, 247, 0.2)');
      drawGlowOrb(ctx, 300, 1650, 400, 'rgba(6, 182, 212, 0.18)');

    } else if (activeTheme === 'retro-vhs') {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#0a0a0c');
      grad.addColorStop(0.5, '#121118');
      grad.addColorStop(1, '#050507');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Scanlines
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      for (let y = 0; y < h; y += 6) {
        ctx.fillRect(0, y, w, 3);
      }

      // Timestamp HUD in VHS yellow
      ctx.font = 'bold 36px "JetBrains Mono", monospace';
      ctx.fillStyle = '#facc15';
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 8;
      ctx.fillText('REC ● PLAY   [SP]', 80, 140);
      ctx.fillText('OCT 16 2026', 80, 200);

    } else if (activeTheme === 'y2k-chrome') {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#111827');
      grad.addColorStop(0.3, '#1f2937');
      grad.addColorStop(0.7, '#1e1b4b');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      drawGlowOrb(ctx, 540, 600, 480, 'rgba(236, 72, 153, 0.2)');
      drawGlowOrb(ctx, 540, 1400, 450, 'rgba(59, 130, 246, 0.2)');

    } else { // midnight-nebula
      const grad = ctx.createRadialGradient(540, 960, 100, 540, 960, 1000);
      grad.addColorStop(0, '#1e1035');
      grad.addColorStop(0.5, '#0e071c');
      grad.addColorStop(1, '#040208');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Star particles
      for (let i = 0; i < 70; i++) {
        const sx = (i * 137.5) % w;
        const sy = (i * 243.7) % h;
        const sr = (i % 3) + 1;
        ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(244, 63, 94, 0.7)';
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 2. Brand Top Header
    ctx.shadowColor = 'rgba(244, 63, 94, 0.5)';
    ctx.shadowBlur = 15;
    ctx.font = '900 68px "Syne", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('PAST', 80, activeTheme === 'retro-vhs' ? 300 : 160);
    
    ctx.fillStyle = '#f43f5e';
    ctx.fillText('SELF', 265, activeTheme === 'retro-vhs' ? 300 : 160);

    ctx.font = '700 28px "JetBrains Mono", monospace';
    ctx.fillStyle = '#a855f7';
    ctx.fillText('⏳ 2026 TIME RECAP', 80, activeTheme === 'retro-vhs' ? 350 : 210);

    // 3. User Identity Glass Box
    const userBoxY = activeTheme === 'retro-vhs' ? 400 : 270;
    ctx.save();
    ctx.fillStyle = 'rgba(20, 20, 30, 0.75)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(80, userBoxY, w - 160, 160, 32);
    ctx.fill();
    ctx.stroke();

    // User Avatar placeholder circle
    ctx.beginPath();
    ctx.arc(170, userBoxY + 80, 50, 0, Math.PI * 2);
    ctx.fillStyle = '#f43f5e';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Avatar icon initials
    ctx.font = '800 36px "Syne", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(stats.userName.slice(0, 2).toUpperCase(), 170, userBoxY + 92);
    ctx.textAlign = 'left';

    // Name & Handle
    ctx.font = '800 42px "Syne", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(stats.userName, 250, userBoxY + 70);

    ctx.font = '500 26px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`${stats.userHandle} • ${stats.rankTitle}`, 250, userBoxY + 112);
    ctx.restore();

    // 4. Hero Stat Banner (Total Capsules Sealed)
    const heroBoxY = userBoxY + 200;
    ctx.save();
    const heroGrad = ctx.createLinearGradient(80, heroBoxY, w - 80, heroBoxY + 280);
    heroGrad.addColorStop(0, 'rgba(244, 63, 94, 0.18)');
    heroGrad.addColorStop(1, 'rgba(168, 85, 247, 0.12)');
    ctx.fillStyle = heroGrad;
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(80, heroBoxY, w - 160, 280, 36);
    ctx.fill();
    ctx.stroke();

    // Mini tag
    ctx.font = '700 24px "JetBrains Mono", monospace';
    ctx.fillStyle = '#fda4af';
    ctx.fillText('⏳ TOTAL TIME-CAPSULES SEALED', 130, heroBoxY + 65);

    // Big Giant Number
    ctx.font = '900 130px "Syne", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(244, 63, 94, 0.6)';
    ctx.shadowBlur = 25;
    ctx.fillText(String(stats.totalCapsules), 130, heroBoxY + 195);

    ctx.font = '500 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.shadowBlur = 0;
    ctx.fillText('Videos locked for future years (2027—2031)', 290, heroBoxY + 180);
    ctx.restore();

    // 5. Secondary Metrics Row (Duets & Predictions)
    const metricsY = heroBoxY + 320;
    const cardW = (w - 160 - 40) / 3;

    drawStatPill(ctx, 80, metricsY, cardW, 200, 'DUETS', String(stats.totalDuets), '#ec4899', '⚡ Split-screen');
    drawStatPill(ctx, 80 + cardW + 20, metricsY, cardW, 200, 'BLIND REACTS', String(stats.blindReactions), '#06b6d4', '🔒 Raw shock');
    drawStatPill(ctx, 80 + (cardW + 20) * 2, metricsY, cardW, 200, 'PREDICTIONS', String(stats.predictionBets), '#fbbf24', '🎯 Future bets');

    // 6. Top Badges Showcase
    const badgesY = metricsY + 240;
    ctx.save();
    ctx.fillStyle = 'rgba(15, 15, 24, 0.85)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(80, badgesY, w - 160, 460, 36);
    ctx.fill();
    ctx.stroke();

    ctx.font = '800 32px "Syne", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('🏆 TOP CHRONO BADGES EARNED', 130, badgesY + 65);

    // Render 3 top badges
    const displayBadges = stats.unlockedBadges.slice(0, 3);
    displayBadges.forEach((badge, idx) => {
      const bY = badgesY + 105 + idx * 105;
      
      // Badge row pill
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.strokeStyle = badge.tier === 'neon' ? '#f43f5e' : badge.tier === 'gold' ? '#fbbf24' : '#06b6d4';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(120, bY, w - 240, 85, 20);
      ctx.fill();
      ctx.stroke();

      // Icon medal
      ctx.beginPath();
      ctx.arc(175, bY + 42, 26, 0, Math.PI * 2);
      ctx.fillStyle = badge.tier === 'neon' ? '#f43f5e' : badge.tier === 'gold' ? '#f59e0b' : '#0891b2';
      ctx.fill();

      // Medal symbol
      ctx.font = '800 24px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(badge.tier === 'neon' ? '👑' : badge.tier === 'gold' ? '⏳' : '⚡', 175, bY + 50);
      ctx.textAlign = 'left';

      // Badge title
      ctx.font = '700 30px "Syne", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(badge.name, 225, bY + 45);

      // Badge Tier Tag
      ctx.font = '700 20px "JetBrains Mono", monospace';
      ctx.fillStyle = badge.tier === 'neon' ? '#fb7185' : badge.tier === 'gold' ? '#fde047' : '#67e8f9';
      ctx.fillText(`[${badge.tier.toUpperCase()} TIER UNLOCKED]`, 225, bY + 72);
    });
    ctx.restore();

    // 7. Footer & Viral Watermark Stamp
    const footerY = h - 220;
    ctx.save();
    ctx.fillStyle = 'rgba(10, 10, 15, 0.9)';
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(80, footerY, w - 160, 140, 32);
    ctx.fill();
    ctx.stroke();

    ctx.font = '900 42px "Syne", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(244, 63, 94, 0.6)';
    ctx.shadowBlur = 15;
    ctx.fillText('#PastSelfApp', 130, footerY + 68);

    ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.shadowBlur = 0;
    ctx.fillText('What would you tell yourself from 3 years ago? pastself.app', 130, footerY + 105);

    // QR badge preview
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.roundRect(w - 220, footerY + 28, 85, 85, 18);
    ctx.fill();

    ctx.font = '800 28px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('RECAP', w - 177, footerY + 78);
    ctx.textAlign = 'left';
    ctx.restore();
  };

  const drawGlowOrb = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) => {
    ctx.save();
    const grad = ctx.createRadialGradient(x, y, 10, x, y, radius);
    grad.addColorStop(0, color);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const drawStatPill = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    w: number, 
    h: number, 
    label: string, 
    value: string, 
    accentColor: string, 
    subtext: string
  ) => {
    ctx.save();
    ctx.fillStyle = 'rgba(20, 20, 30, 0.8)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 28);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 18px "JetBrains Mono", monospace';
    ctx.fillStyle = accentColor;
    ctx.fillText(label, x + 24, y + 45);

    ctx.font = '900 64px "Syne", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(value, x + 24, y + 125);

    ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(subtext, x + 24, y + 165);
    ctx.restore();
  };

  // Download high-res PNG for Instagram Story (1080x1920)
  const handleDownloadStoryImage = () => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    setIsExporting(true);
    sfx.unlockChime();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = `PastSelf-Capsule-Recap-${userStats.userHandle}-Story.png`;
    link.href = dataUrl;
    link.click();
    setIsExporting(false);
  };

  // Web Share API to share directly to Instagram / camera roll
  const handleNativeShare = async () => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    sfx.shutterClick();

    if ('share' in navigator && typeof navigator.share === 'function') {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'PastSelf-Recap.png', { type: 'image/png' });
        try {
          await navigator.share({
            title: 'My PastSelf Capsule Recap',
            text: `My 2026 Time-Capsule Recap! Sealed ${userStats.totalCapsules} capsules and recorded ${userStats.totalDuets} duets. What would your past self say? #PastSelfApp #CapsuleRecap`,
            files: [file]
          });
        } catch {
          // Fallback to clipboard
          handleCopyCaption();
        }
      });
    } else {
      handleCopyCaption();
    }
  };

  const handleCopyCaption = () => {
    const text = `My 2026 PastSelf Capsule Recap ⏳\n\n• ${userStats.totalCapsules} Time-Capsules Sealed\n• ${userStats.totalDuets} Split-Screen Duets Recorded\n• Top Badge: ${userStats.unlockedBadges[0]?.name || 'Time Traveler'}\n\nWhat would you tell yourself from 3 years ago? Record yours at pastself.app #PastSelfApp #CapsuleRecap #TimeCapsule #BlindReaction #StoryRecap`;
    navigator.clipboard.writeText(text);
    setCopiedCaption(true);
    sfx.shutterClick();
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col my-auto overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-rose-500/25">
              <Instagram className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Capsule Recap Story Generator</h3>
                <span className="bg-rose-500/20 text-rose-300 font-mono-code text-[10px] px-2 py-0.5 rounded-full border border-rose-500/30">
                  9:16 Instagram Story
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Share your time-capsule milestones and top badges directly to Instagram Stories
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Content */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Left: 9:16 Story Card Live Preview */}
          <div className="md:col-span-6 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[290px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border-2 border-neutral-800 bg-black flex items-center justify-center">
              <canvas
                ref={previewCanvasRef}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-[11px] font-mono-code text-neutral-400 mt-2 flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-rose-400" />
              1080 x 1920 HD Story Resolution
            </span>
          </div>

          {/* Right: Theme Selector & Export Actions */}
          <div className="md:col-span-6 space-y-5">
            
            {/* Theme Selector */}
            <div>
              <label className="text-[11px] font-mono-code uppercase font-bold text-neutral-400 block mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-rose-400" />
                Select Story Card Aesthetic
              </label>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'cyber-neon', name: 'Cyber Neon', desc: 'Glowing magenta/cyan HUD' },
                  { id: 'retro-vhs', name: 'Retro 1990s VHS', desc: 'Scanlines & yellow tape time' },
                  { id: 'y2k-chrome', name: 'Y2K Digicam', desc: 'Metallic gradient sheen' },
                  { id: 'midnight-nebula', name: 'Midnight Stardust', desc: 'Deep cosmic star particles' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id as RecapTheme);
                      sfx.shutterClick();
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      theme === t.id
                        ? 'bg-neutral-800 border-rose-500/70 text-white shadow-md'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold font-display">{t.name}</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recap Highlights Summary */}
            <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono-code">
                <span className="text-neutral-400">Total Capsules:</span>
                <span className="text-white font-bold">{userStats.totalCapsules}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono-code">
                <span className="text-neutral-400">Duets Recorded:</span>
                <span className="text-white font-bold">{userStats.totalDuets}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono-code">
                <span className="text-neutral-400">Top Badges Featured:</span>
                <span className="text-rose-400 font-bold">
                  {userStats.unlockedBadges.slice(0, 2).map(b => b.name).join(', ')}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono-code">
                <span className="text-neutral-400">Watermark:</span>
                <span className="text-purple-400 font-bold font-display">#PastSelfApp</span>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleDownloadStoryImage}
                disabled={isExporting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-bold text-xs shadow-xl shadow-rose-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Instagram Story Card (1080x1920 PNG)</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleNativeShare}
                  className="py-2.5 px-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs border border-neutral-800 hover:border-neutral-700 transition-colors flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Share Story</span>
                </button>

                <button
                  onClick={handleCopyCaption}
                  className="py-2.5 px-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs border border-neutral-800 hover:border-neutral-700 transition-colors flex items-center justify-center gap-1.5 active:scale-95"
                >
                  {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-rose-400" />}
                  <span>{copiedCaption ? 'Copied Tags!' : 'Copy Viral Caption'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
