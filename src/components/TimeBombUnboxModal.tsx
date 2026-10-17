import React, { useState } from 'react';
import { X, Users, Play, Sparkles, Clock, Check, Lock, Unlock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GroupChallenge, PastSelfCapsule } from '../types';
import { sfx } from '../utils/audioFX';

interface TimeBombUnboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: GroupChallenge;
  onDuetMember: (memberCapsule: PastSelfCapsule) => void;
}

export const TimeBombUnboxModal: React.FC<TimeBombUnboxModalProps> = ({
  isOpen,
  onClose,
  challenge,
  onDuetMember
}) => {
  const [activeVideo, setActiveVideo] = useState<string | null>(
    challenge.participants.find(p => p.unlockedVideoUrl)?.unlockedVideoUrl || null
  );
  const [activeMemberName, setActiveMemberName] = useState<string>(
    challenge.participants[0]?.name || ''
  );

  const handleCelebrate = () => {
    sfx.unlockChime();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 }
    });
  };

  const handleSelectMember = (p: typeof challenge.participants[0]) => {
    if (p.unlockedVideoUrl) {
      setActiveVideo(p.unlockedVideoUrl);
      setActiveMemberName(p.name);
      sfx.shutterClick();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">{challenge.title}</h3>
                <span className="bg-amber-500/20 text-amber-300 font-mono-code text-[10px] px-2 py-0.5 rounded-full border border-amber-500/30">
                  {challenge.isUnlocked ? 'UNBOXED TODAY' : `Locked (${challenge.daysRemaining}d)`}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">{challenge.prompt}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Video Viewer */}
          <div className="md:col-span-8 flex flex-col items-center">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-neutral-800 shadow-2xl flex items-center justify-center">
              {activeVideo ? (
                <video
                  key={activeVideo}
                  src={activeVideo}
                  autoPlay
                  controls
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-center p-6 text-neutral-400">
                  <Lock className="w-8 h-8 text-amber-400 mb-2" />
                  <p className="text-xs">Select a friend&apos;s unboxed video on the right to watch</p>
                </div>
              )}

              {/* Watermark */}
              <div className="absolute bottom-3 right-3 bg-neutral-950/80 backdrop-blur-md px-2.5 py-0.5 rounded text-[9px] font-mono-code text-neutral-300 border border-neutral-800">
                #PastSelfApp TimeBomb
              </div>
            </div>

            {/* Quick Duet CTA for active member */}
            <div className="w-full mt-3 flex items-center justify-between bg-neutral-950 p-3 rounded-2xl border border-neutral-800">
              <div className="text-xs text-neutral-200">
                Watching: <span className="font-bold text-rose-400">{activeMemberName}&apos;s</span> Past Self
              </div>
              <button
                onClick={() => {
                  const syntheticCapsule: PastSelfCapsule = {
                    id: `bomb-capsule-${Date.now()}`,
                    creatorName: activeMemberName,
                    creatorHandle: `@${activeMemberName.toLowerCase()}`,
                    creatorAvatar: challenge.participants.find(p => p.name === activeMemberName)?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                    title: `${activeMemberName}'s Time Bomb Reveal`,
                    prompt: challenge.prompt,
                    recordedDate: challenge.createdDate,
                    unlockDate: challenge.unlockDate,
                    yearsAgo: 3,
                    durationSeconds: 20,
                    videoUrl: activeVideo || 'https://assets.mixkit.co/videos/preview/mixkit-young-man-talking-to-the-camera-in-a-park-42777-large.mp4',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600',
                    isUnlocked: true,
                    isFriend: true,
                    duetCount: 12,
                    reactionsCount: 420,
                    tags: ['TimeBomb', 'GroupUnboxing']
                  };
                  onDuetMember(syntheticCapsule);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Duet {activeMemberName}&apos;s Memory</span>
              </button>
            </div>
          </div>

          {/* Group Members List */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono-code text-neutral-400">
              <span>GROUP CHAT CREW</span>
              <span>{challenge.participants.length} Members</span>
            </div>

            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {challenge.participants.map((p, i) => (
                <div
                  key={i}
                  onClick={() => handleSelectMember(p)}
                  className={`p-2.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    activeMemberName === p.name
                      ? 'bg-rose-500/10 border-rose-500/50 shadow-md'
                      : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={p.avatar} 
                      alt={p.name} 
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-neutral-800"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{p.name}</h4>
                      <span className="text-[10px] font-mono-code text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Unboxed
                      </span>
                    </div>
                  </div>

                  <Play className="w-3.5 h-3.5 text-neutral-400" />
                </div>
              ))}
            </div>

            <button
              onClick={handleCelebrate}
              className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold border border-neutral-700 transition-colors"
            >
              🎉 Pop Celebration Confetti
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
