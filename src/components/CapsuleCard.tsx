import React, { useState, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Sparkles, 
  Clock, 
  Lock, 
  Unlock, 
  Flame, 
  MessageSquare, 
  HelpCircle,
  Share2,
  Calendar,
  Layers
} from 'lucide-react';
import { PastSelfCapsule } from '../types';
import { Translations } from '../i18n/translations';

interface CapsuleCardProps {
  capsule: PastSelfCapsule;
  onRecordDuet: (capsule: PastSelfCapsule) => void;
  onViewDuets: (capsule: PastSelfCapsule) => void;
  onShare?: (capsule: PastSelfCapsule) => void;
  t?: Translations;
}

export const CapsuleCard: React.FC<CapsuleCardProps> = ({
  capsule,
  onRecordDuet,
  onViewDuets,
  onShare,
  t
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!capsule.isUnlocked || !videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <div className="group relative bg-neutral-900/70 border border-neutral-800 rounded-3xl overflow-hidden hover:border-neutral-700 transition-all hover:shadow-2xl hover:shadow-rose-500/10 flex flex-col">
      
      {/* Video Preview Header */}
      <div 
        onClick={togglePlay}
        className="relative aspect-video w-full bg-neutral-950 overflow-hidden cursor-pointer"
      >
        {capsule.isUnlocked ? (
          <>
            <video
              ref={videoRef}
              src={capsule.videoUrl}
              poster={capsule.thumbnailUrl}
              playsInline
              loop
              muted
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Play/Pause Overlay */}
            <div className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
              <div className="w-12 h-12 rounded-full bg-neutral-900/80 backdrop-blur-md border border-neutral-700 flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform">
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </div>
            </div>
          </>
        ) : (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-neutral-900 to-neutral-950">
            <img 
              src={capsule.thumbnailUrl} 
              alt="Vaulted capsule" 
              className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm"
            />
            <div className="relative z-10 w-12 h-12 rounded-2xl bg-neutral-800/80 border border-neutral-700 flex items-center justify-center text-amber-400 mb-2">
              <Lock className="w-6 h-6" />
            </div>
            <span className="relative z-10 text-xs font-bold text-neutral-300">
              {t?.lockedTimeCapsule || 'Locked Time-Capsule'}
            </span>
            <span className="relative z-10 text-[11px] font-mono-code text-amber-400 font-semibold mt-1">
              {(t?.unlocksIn || 'Unlocks in')} {capsule.daysRemaining} {t?.days || 'days'} ({capsule.unlockDate})
            </span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          {capsule.isUnlocked ? (
            <span className="bg-rose-500/90 text-white font-mono-code font-bold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-rose-500/30">
              <Unlock className="w-3 h-3" />
              <span>{t?.unlockedAgo || 'UNLOCKED'} ({capsule.yearsAgo} {t?.yearsAgo || 'Y AGO'})</span>
            </span>
          ) : (
            <span className="bg-neutral-950/80 text-amber-400 border border-amber-400/30 font-mono-code font-bold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>{t?.vaultedCapsule || 'VAULTED'}</span>
            </span>
          )}
        </div>

        {/* Video Watermark Tag */}
        <div className="absolute bottom-3 right-3 z-10 bg-black/70 backdrop-blur-md text-[9px] font-mono-code font-bold text-neutral-300 px-2 py-0.5 rounded border border-neutral-800">
          #PastSelfApp
        </div>
      </div>

      {/* Capsule Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Creator Profile */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <img 
                src={capsule.creatorAvatar} 
                alt={capsule.creatorName} 
                className="w-9 h-9 rounded-full object-cover ring-2 ring-rose-500/30"
              />
              <div>
                <h3 className="text-xs font-bold text-white leading-tight">
                  {capsule.creatorName}
                </h3>
                <span className="text-[10px] font-mono-code text-neutral-400">
                  {capsule.creatorHandle}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono-code text-neutral-400 block">
                {t?.recordedOn || 'Recorded'}
              </span>
              <span className="text-[11px] font-bold text-neutral-300">
                {capsule.recordedDate}
              </span>
            </div>
          </div>

          {/* Title & Prompt */}
          <h4 className="text-sm font-bold text-white line-clamp-1 mb-1">
            {capsule.title}
          </h4>
          <p className="text-xs text-neutral-400 line-clamp-2 mb-3">
            &ldquo;{capsule.prompt}&rdquo;
          </p>

          {/* Prediction Bet Badge */}
          {capsule.prediction && (
            <div className="bg-neutral-950/80 rounded-2xl p-3 border border-neutral-800/80 mb-3">
              <div className="flex items-center justify-between text-[10px] font-mono-code mb-1">
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <HelpCircle className="w-3 h-3" />
                  {t?.predictionBetLabel || 'PREDICTION BET'}
                </span>
                <span className="text-neutral-400">
                  {capsule.prediction.confidence}% {t?.confidence || 'Confident'}
                </span>
              </div>
              <p className="text-xs text-neutral-200 font-medium">
                &ldquo;{capsule.prediction.prediction}&rdquo;
              </p>
              {capsule.prediction.outcome && (
                <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold">
                  {capsule.prediction.outcome === 'correct' ? (
                    <span className="text-emerald-400">{t?.predictionTrue || '✅ Prediction Came True!'}</span>
                  ) : capsule.prediction.outcome === 'wrong' ? (
                    <span className="text-rose-400">{t?.predictionWrong || '❌ Failed Prediction'}</span>
                  ) : (
                    <span className="text-amber-400">{t?.predictionPending || '⏳ Still Pending'}</span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {capsule.tags.map((tag) => (
              <span 
                key={tag}
                className="text-[10px] font-mono-code px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons: Duet & Watch */}
        <div className="pt-3 border-t border-neutral-800/80 flex items-center gap-2">
          {capsule.isUnlocked ? (
            <>
              {/* PRIMARY CTA: Record Duet */}
              <button
                onClick={() => onRecordDuet(capsule)}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t?.duetReactBtn || 'Duet / React'}</span>
              </button>

              {/* View Duets */}
              <button
                onClick={() => onViewDuets(capsule)}
                className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold transition-colors"
                title={t?.viewDuetsTooltip || 'View reactions & duets'}
              >
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>{capsule.duetCount}</span>
              </button>

              {/* Share Capsule & Earn Points */}
              {onShare && (
                <button
                  onClick={() => onShare(capsule)}
                  className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold transition-colors group/share"
                  title={t?.shareEarnPoints || 'Share (+75 pts)'}
                >
                  <Share2 className="w-3.5 h-3.5 text-cyan-400 group-hover/share:scale-110 transition-transform" />
                  <span className="text-[10px] font-mono-code font-bold text-amber-400">+75pts</span>
                </button>
              )}
            </>
          ) : (
            <div className="w-full flex items-center gap-2">
              <div className="flex-1 text-center py-2 px-3 rounded-xl bg-neutral-950 text-neutral-400 text-xs font-mono-code border border-neutral-800 truncate">
                {(t?.unlocksOn || 'Unlocks on')} {capsule.unlockDate}
              </div>
              {onShare && (
                <button
                  onClick={() => onShare(capsule)}
                  className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-rose-500/20 hover:from-purple-500/30 hover:to-rose-500/30 border border-purple-500/30 text-neutral-200 text-xs font-semibold transition-all shrink-0 active:scale-95"
                  title={t?.shareEarnPoints || 'Share (+75 pts)'}
                >
                  <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[10px] font-mono-code font-bold text-amber-400">+75pts</span>
                </button>
              )}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
