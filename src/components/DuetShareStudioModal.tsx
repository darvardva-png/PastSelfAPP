import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Share2, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Columns, 
  Rows, 
  Camera, 
  ThumbsUp, 
  ThumbsDown, 
  Flame,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PastSelfCapsule, SplitLayout, VideoFilter } from '../types';
import { renderDuetFrameToCanvas } from '../utils/videoDuetEngine';
import { sfx } from '../utils/audioFX';

interface DuetShareStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  capsule: PastSelfCapsule;
  reactionVideoUrl: string;
  reactionVideoBlob: Blob | null;
  initialLayout: SplitLayout;
  initialFilter: VideoFilter;
  isBlindReaction: boolean;
  onPublishToCommunity?: (duetRecord: {
    capsuleTitle: string;
    caption: string;
    layout: SplitLayout;
    filter: VideoFilter;
    wasPredictionCorrect?: boolean;
  }) => void;
}

export const DuetShareStudioModal: React.FC<DuetShareStudioModalProps> = ({
  isOpen,
  onClose,
  capsule,
  reactionVideoUrl,
  initialLayout,
  initialFilter,
  isBlindReaction,
  onPublishToCommunity
}) => {
  const [layout, setLayout] = useState<SplitLayout>(initialLayout);
  const [filter, setFilter] = useState<VideoFilter>(initialFilter);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [audioBalance, setAudioBalance] = useState<number>(50); // 0 = only past, 100 = only reaction
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedCaption, setCopiedCaption] = useState<boolean>(false);
  const [isExportingVideo, setIsExportingVideo] = useState<boolean>(false);
  const [predictionVote, setPredictionVote] = useState<'yes' | 'no' | null>(null);
  const [reactionCaption, setReactionCaption] = useState<string>(
    `Reacting to ${capsule.creatorName}'s time capsule from ${capsule.yearsAgo} years ago! Unbelievable. ⏳ #PastSelfApp`
  );
  const [activePlatform, setActivePlatform] = useState<'tiktok' | 'reels' | 'shorts'>('tiktok');

  const pastVideoRef = useRef<HTMLVideoElement>(null);
  const reactionVideoRef = useRef<HTMLVideoElement>(null);
  const exportCanvasRef = useRef<HTMLCanvasElement>(null);

  // Sync play/pause
  useEffect(() => {
    if (!isOpen) return;

    // Small delay to ensure refs are attached
    const timer = setTimeout(() => {
      syncPlay();
    }, 200);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const syncPlay = () => {
    if (pastVideoRef.current && reactionVideoRef.current) {
      pastVideoRef.current.currentTime = 0;
      reactionVideoRef.current.currentTime = 0;
      pastVideoRef.current.play().catch(() => {});
      reactionVideoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    if (pastVideoRef.current && reactionVideoRef.current) {
      if (isPlaying) {
        pastVideoRef.current.pause();
        reactionVideoRef.current.pause();
        setIsPlaying(false);
      } else {
        pastVideoRef.current.play().catch(() => {});
        reactionVideoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  // Adjust audio balance
  useEffect(() => {
    if (pastVideoRef.current && reactionVideoRef.current) {
      const pastVol = (100 - audioBalance) / 100;
      const reactVol = audioBalance / 100;
      pastVideoRef.current.volume = Math.max(0, Math.min(1, pastVol));
      reactionVideoRef.current.volume = Math.max(0, Math.min(1, reactVol));
    }
  }, [audioBalance]);

  // Social Sharing Caption Generator
  const getSocialShareText = () => {
    const verdict = predictionVote ? (predictionVote === 'yes' ? '✅ Prediction was SPOT ON!' : '❌ Prediction was WRONG!') : '';
    return `${reactionCaption}\n\n${verdict}\n\nWhat would your past self say? Record yours on #PastSelfApp #PastSelfDuet #BlindReaction #TimeCapsule #TikTokViral`;
  };

  const handleCopyLink = () => {
    const shareUrl = `https://pastself.app/duet/${capsule.id}?ref=viral_share`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    sfx.shutterClick();
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(getSocialShareText());
    setCopiedCaption(true);
    sfx.shutterClick();
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  // Download snapshot poster frame with #PastSelfApp watermark
  const handleDownloadSnapshotPoster = async () => {
    if (!pastVideoRef.current || !reactionVideoRef.current) return;

    const canvas = document.createElement('canvas');
    if (layout === 'stacked-vertical') {
      canvas.width = 720;
      canvas.height = 1280;
    } else {
      canvas.width = 1280;
      canvas.height = 720;
    }

    await renderDuetFrameToCanvas(
      canvas,
      pastVideoRef.current,
      reactionVideoRef.current,
      layout,
      filter,
      `${capsule.creatorName} (${capsule.yearsAgo}y ago)`,
      'You (Present)',
      '#PastSelfApp'
    );

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `PastSelf-Duet-${capsule.creatorHandle}-Reaction.png`;
    link.href = dataUrl;
    link.click();

    triggerConfetti();
  };

  // Render & Download merged WebM/MP4 video
  const handleExportMergedVideo = async () => {
    if (!pastVideoRef.current || !reactionVideoRef.current) return;
    setIsExportingVideo(true);
    sfx.countdownBeep(false);

    try {
      const canvas = document.createElement('canvas');
      if (layout === 'stacked-vertical') {
        canvas.width = 720;
        canvas.height = 1280;
      } else {
        canvas.width = 1280;
        canvas.height = 720;
      }

      const stream = 'captureStream' in canvas 
        ? (canvas as HTMLCanvasElement & { captureStream: (fps?: number) => MediaStream }).captureStream(30) 
        : null;
      if (!stream) {
        setIsExportingVideo(false);
        return;
      }

      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? 'video/webm;codecs=vp9'
          : 'video/webm'
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const mergedBlob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(mergedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `PastSelf-Duet-${capsule.creatorHandle}.webm`;
        a.click();
        setIsExportingVideo(false);
        triggerConfetti();
      };

      recorder.start();

      // Reset videos and play for export
      pastVideoRef.current.currentTime = 0;
      reactionVideoRef.current.currentTime = 0;
      pastVideoRef.current.play();
      reactionVideoRef.current.play();

      let animId: number;
      const startTime = Date.now();
      const exportDuration = Math.min(10, capsule.durationSeconds || 10) * 1000;

      const renderLoop = async () => {
        if (!pastVideoRef.current || !reactionVideoRef.current) return;
        await renderDuetFrameToCanvas(
          canvas,
          pastVideoRef.current,
          reactionVideoRef.current,
          layout,
          filter,
          `${capsule.creatorName} (${capsule.yearsAgo}y ago)`,
          'You (Present)',
          '#PastSelfApp'
        );

        if (Date.now() - startTime < exportDuration) {
          animId = requestAnimationFrame(renderLoop);
        } else {
          cancelAnimationFrame(animId);
          if (recorder.state !== 'inactive') {
            recorder.stop();
          }
        }
      };

      renderLoop();
    } catch {
      setIsExportingVideo(false);
    }
  };

  const triggerConfetti = () => {
    sfx.unlockChime();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#a855f7', '#06b6d4', '#fbbf24']
    });
  };

  const handlePublish = () => {
    if (onPublishToCommunity) {
      onPublishToCommunity({
        capsuleTitle: capsule.title,
        caption: reactionCaption,
        layout,
        filter,
        wasPredictionCorrect: predictionVote === 'yes'
      });
    }
    triggerConfetti();
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col my-auto overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">
                  Split Duet Ready to Share
                </h2>
                <span className="bg-rose-500/20 text-rose-400 font-mono-code font-bold text-[10px] px-2 py-0.5 rounded-full border border-rose-500/30">
                  #PastSelfApp Watermark
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Synchronized split-screen reaction with {capsule.creatorName} ({capsule.yearsAgo}y ago)
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

        {/* Studio Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 flex-1">
          
          {/* Left Column: Synchronized Split-Screen Player */}
          <div className="lg:col-span-7 bg-neutral-950 p-4 sm:p-6 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-neutral-800">
            
            {/* Visual Screen Container */}
            <div 
              className={`relative rounded-2xl overflow-hidden border-2 border-neutral-800 shadow-2xl bg-black flex transition-all ${
                layout === 'stacked-vertical' ? 'flex-col w-full max-w-[280px] sm:max-w-[320px] aspect-[9/16]' :
                layout === 'side-by-side' ? 'flex-row w-full max-w-[560px] aspect-[16/9]' :
                'relative w-full max-w-[540px] aspect-[16/9]'
              }`}
            >
              {/* Top / Left: Past Video */}
              <div className={`relative bg-neutral-900 overflow-hidden flex items-center justify-center ${
                layout === 'stacked-vertical' ? 'w-full h-1/2 border-b-2 border-rose-500/50' :
                layout === 'side-by-side' ? 'w-1/2 h-full border-r-2 border-rose-500/50' :
                'w-full h-full'
              }`}>
                <video
                  ref={pastVideoRef}
                  src={capsule.videoUrl}
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Badge: Past Self */}
                <div className="absolute top-2 left-2 z-20 bg-neutral-950/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-rose-500/40 flex items-center gap-1.5 shadow">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  <span className="text-[9px] font-mono-code font-bold text-rose-300">
                    {capsule.creatorName} ({capsule.yearsAgo}y ago)
                  </span>
                </div>
              </div>

              {/* Bottom / Right: Present Reaction Video */}
              <div className={`relative bg-neutral-950 overflow-hidden flex items-center justify-center ${
                layout === 'stacked-vertical' ? 'w-full h-1/2' :
                layout === 'side-by-side' ? 'w-1/2 h-full' :
                'absolute bottom-2 right-2 w-28 h-38 sm:w-36 sm:h-48 rounded-xl border-2 border-cyan-400 shadow-2xl z-20'
              }`}>
                <video
                  ref={reactionVideoRef}
                  src={reactionVideoUrl}
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Filter Overlays */}
                {filter === 'vhs' && <div className="absolute inset-0 vhs-scanlines z-10 pointer-events-none" />}
                {filter === 'cyberpunk' && <div className="absolute inset-0 bg-cyan-500/10 mix-blend-color z-10 pointer-events-none" />}
                {filter === 'warm-nostalgia' && <div className="absolute inset-0 bg-amber-500/10 mix-blend-overlay z-10 pointer-events-none" />}

                {/* Badge: You (Present) */}
                <div className="absolute top-2 left-2 z-20 bg-neutral-950/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-cyan-500/40 flex items-center gap-1.5 shadow">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  <span className="text-[9px] font-mono-code font-bold text-cyan-300">
                    You (Today)
                  </span>
                </div>
              </div>

              {/* The Official #PastSelfApp Watermark Overlay */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 bg-neutral-950/85 backdrop-blur-md px-3 py-1 rounded-full border border-rose-500/50 shadow-lg flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                <span className="font-display text-[10px] font-extrabold text-white tracking-wider">
                  #PastSelfApp
                </span>
                <span className="text-[8px] font-mono-code text-neutral-400">
                  {capsule.yearsAgo}y Duet
                </span>
              </div>

              {/* Play/Pause Center Overlay on hover or when paused */}
              {!isPlaying && (
                <div 
                  onClick={togglePlayPause}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer z-30"
                >
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/40 shadow-xl">
                    <Play className="w-6 h-6 ml-1" />
                  </div>
                </div>
              )}
            </div>

            {/* Playback Controls & Layout Toolbar */}
            <div className="w-full max-w-[480px] mt-4 flex items-center justify-between gap-3 bg-neutral-900/80 p-2.5 rounded-2xl border border-neutral-800">
              <button
                onClick={togglePlayPause}
                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              {/* Audio Balance Slider */}
              <div className="flex-1 flex items-center gap-2 px-2">
                <span className="text-[10px] font-mono-code text-neutral-400 whitespace-nowrap">
                  Past Audio
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={audioBalance}
                  onChange={(e) => setAudioBalance(Number(e.target.value))}
                  className="w-full accent-rose-500 h-1 bg-neutral-700 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] font-mono-code text-neutral-400 whitespace-nowrap">
                  React Audio
                </span>
              </div>

              {/* Layout Switchers */}
              <div className="flex items-center gap-1 border-l border-neutral-800 pl-2">
                <button
                  onClick={() => setLayout('stacked-vertical')}
                  className={`p-1.5 rounded-lg transition-all ${
                    layout === 'stacked-vertical' ? 'bg-rose-500 text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Vertical 9:16 (TikTok & Reels)"
                >
                  <Rows className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setLayout('side-by-side')}
                  className={`p-1.5 rounded-lg transition-all ${
                    layout === 'side-by-side' ? 'bg-rose-500 text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Side-by-Side 16:9"
                >
                  <Columns className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 mt-3">
              <span className="text-[10px] font-mono-code text-neutral-500">FILTER:</span>
              {(['normal', 'vhs', 'y2k', 'cyberpunk', 'warm-nostalgia'] as VideoFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setFilter(f);
                    sfx.vhsGlitch();
                  }}
                  className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md transition-all ${
                    filter === f 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {f === 'normal' ? 'Raw' : f}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Viral Sharing Engine & Social Export */}
          <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between bg-neutral-900/60 overflow-y-auto">
            
            <div className="space-y-4">
              
              {/* Future Prediction Verdict Section */}
              {capsule.prediction && (
                <div className="bg-neutral-950/70 p-3.5 rounded-2xl border border-neutral-800">
                  <span className="text-[10px] font-mono-code uppercase font-bold text-amber-400 tracking-wider">
                    Friend&apos;s Prediction from {capsule.yearsAgo} Years Ago:
                  </span>
                  <p className="text-xs text-neutral-200 mt-1 font-medium italic">
                    &ldquo;{capsule.prediction.prediction}&rdquo;
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-400">Did this come true?</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPredictionVote('yes')}
                        className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                          predictionVote === 'yes'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                            : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Yes! Correct</span>
                      </button>

                      <button
                        onClick={() => setPredictionVote('no')}
                        className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                          predictionVote === 'no'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                            : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white'
                        }`}
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                        <span>Totally Wrong</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Reaction Caption Editor */}
              <div>
                <label className="text-[11px] font-mono-code uppercase font-bold text-neutral-400 block mb-1.5">
                  Your Reaction Caption
                </label>
                <textarea
                  value={reactionCaption}
                  onChange={(e) => setReactionCaption(e.target.value)}
                  rows={2}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-rose-500/60 resize-none font-sans"
                  placeholder="What was going through your mind watching this?"
                />
              </div>

              {/* One-Tap Social Platforms */}
              <div>
                <label className="text-[11px] font-mono-code uppercase font-bold text-neutral-400 block mb-2">
                  1-Tap Social Platform Export
                </label>
                
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setActivePlatform('tiktok');
                      setLayout('stacked-vertical');
                    }}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                      activePlatform === 'tiktok'
                        ? 'bg-neutral-800 border-cyan-400/50 text-white shadow-sm'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <span className="text-xs font-bold font-display">TikTok</span>
                    <span className="text-[9px] font-mono-code text-cyan-400">9:16 Vertical</span>
                  </button>

                  <button
                    onClick={() => {
                      setActivePlatform('reels');
                      setLayout('stacked-vertical');
                    }}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                      activePlatform === 'reels'
                        ? 'bg-neutral-800 border-rose-400/50 text-white shadow-sm'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <span className="text-xs font-bold font-display">IG Reels</span>
                    <span className="text-[9px] font-mono-code text-rose-400">Story/Duet</span>
                  </button>

                  <button
                    onClick={() => {
                      setActivePlatform('shorts');
                      setLayout('stacked-vertical');
                    }}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                      activePlatform === 'shorts'
                        ? 'bg-neutral-800 border-red-400/50 text-white shadow-sm'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <span className="text-xs font-bold font-display">Shorts</span>
                    <span className="text-[9px] font-mono-code text-red-400">YouTube</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons: Download & Copy */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleExportMergedVideo}
                  disabled={isExportingVideo}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-lg shadow-rose-500/25 transition-all active:scale-95 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {isExportingVideo ? 'Rendering #PastSelfApp Video...' : 'Download Merged Duet (.webm)'}
                  </span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleDownloadSnapshotPoster}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold border border-neutral-800 hover:border-neutral-700 transition-all active:scale-95"
                    title="Instant image poster for Instagram Stories"
                  >
                    <Camera className="w-3.5 h-3.5 text-purple-400" />
                    <span>Story Card (PNG)</span>
                  </button>

                  <button
                    onClick={handleCopyCaption}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold border border-neutral-800 hover:border-neutral-700 transition-all active:scale-95"
                  >
                    {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-rose-400" />}
                    <span>{copiedCaption ? 'Copied Tags!' : 'Copy Viral Tags'}</span>
                  </button>
                </div>

                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-neutral-300 text-xs font-medium border border-neutral-800 hover:border-neutral-700 transition-all"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-cyan-400" />}
                  <span>{copiedLink ? 'Link Copied to Clipboard!' : 'Copy Shareable Link'}</span>
                </button>
              </div>

            </div>

            {/* Publish to Community Vault Button */}
            <div className="mt-5 pt-3 border-t border-neutral-800 flex items-center gap-3">
              <button
                onClick={handlePublish}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-neutral-100 hover:bg-white text-neutral-950 font-bold text-xs shadow-xl transition-all active:scale-95"
              >
                <span>Publish to PastSelf Community</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
