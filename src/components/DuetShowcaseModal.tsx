import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Heart, 
  Share2, 
  Sparkles, 
  Play, 
  Pause, 
  Columns, 
  Rows, 
  MessageCircle, 
  Send,
  Eye,
  Check
} from 'lucide-react';
import { DuetReaction, PastSelfCapsule } from '../types';
import { sfx } from '../utils/audioFX';

interface DuetShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  duet: DuetReaction;
  onRecordNewDuet: (capsuleId: string) => void;
}

export const DuetShowcaseModal: React.FC<DuetShowcaseModalProps> = ({
  isOpen,
  onClose,
  duet,
  onRecordNewDuet
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [likes, setLikes] = useState(duet.likes);
  const [hasLiked, setHasLiked] = useState(duet.hasLiked || false);
  const [comments, setComments] = useState<string[]>([
    'The facial expression at 0:08 is priceless 😭',
    'I need to record one of these for 2030 ASAP',
    'She really didn’t believe she was gonna do it haha!'
  ]);
  const [newComment, setNewComment] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const pastVideoRef = useRef<HTMLVideoElement>(null);
  const reactionVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      if (pastVideoRef.current && reactionVideoRef.current) {
        pastVideoRef.current.currentTime = 0;
        reactionVideoRef.current.currentTime = 0;
        pastVideoRef.current.play().catch(() => {});
        reactionVideoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const togglePlay = () => {
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

  const handleLike = () => {
    sfx.shutterClick();
    if (hasLiked) {
      setLikes(likes - 1);
      setHasLiked(false);
    } else {
      setLikes(likes + 1);
      setHasLiked(true);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([...comments, newComment.trim()]);
    setNewComment('');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`https://pastself.app/duet/${duet.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="px-5 py-3 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/70">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <h3 className="text-sm font-bold text-white truncate">
              {duet.capsuleTitle}
            </h3>
            <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Split Duet
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player & Interaction Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1">
          
          {/* Split Screen Video Frame */}
          <div className="md:col-span-7 bg-black p-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-neutral-800">
            <div 
              onClick={togglePlay}
              className={`relative rounded-2xl overflow-hidden border-2 border-neutral-800 bg-neutral-950 cursor-pointer shadow-2xl flex ${
                duet.layout === 'stacked-vertical' ? 'flex-col w-full max-w-[280px] sm:max-w-[300px] aspect-[9/16]' : 'flex-row w-full max-w-[520px] aspect-[16/9]'
              }`}
            >
              {/* Top / Left: Past Self Video */}
              <div className={`relative bg-neutral-900 ${
                duet.layout === 'stacked-vertical' ? 'w-full h-1/2 border-b-2 border-rose-500/50' : 'w-1/2 h-full border-r-2 border-rose-500/50'
              }`}>
                <video
                  ref={pastVideoRef}
                  src={duet.pastVideoUrl}
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 z-10 bg-neutral-950/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-rose-500/40 text-[9px] font-mono-code font-bold text-rose-300">
                  {duet.pastSelfTimestamp}
                </div>
              </div>

              {/* Bottom / Right: Reaction Video */}
              <div className={`relative bg-neutral-950 ${
                duet.layout === 'stacked-vertical' ? 'w-full h-1/2' : 'w-1/2 h-full'
              }`}>
                <video
                  ref={reactionVideoRef}
                  src={duet.reactionVideoUrl}
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 z-10 bg-neutral-950/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-cyan-500/40 text-[9px] font-mono-code font-bold text-cyan-300">
                  {duet.reactionTimestamp}
                </div>
              </div>

              {/* Watermark */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 bg-black/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-rose-500/40 text-[9px] font-display font-extrabold text-white">
                #PastSelfApp
              </div>

              {/* Play / Pause button overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/40">
                    <Play className="w-6 h-6 ml-1" />
                  </div>
                </div>
              )}
            </div>

            <p className="text-[11px] text-neutral-400 mt-3 font-mono-code">
              Click video to play / pause in sync
            </p>
          </div>

          {/* Social Details & Comments */}
          <div className="md:col-span-5 p-5 flex flex-col justify-between bg-neutral-900/50">
            <div>
              {/* Reactor Profile */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <img 
                    src={duet.reactorAvatar} 
                    alt={duet.reactorName} 
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-500/40"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{duet.reactorName}</h4>
                    <span className="text-[10px] font-mono-code text-neutral-400">{duet.reactorHandle}</span>
                  </div>
                </div>

                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                    hasLiked
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                      : 'bg-neutral-800 text-neutral-300 hover:text-white'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
                  <span>{likes}</span>
                </button>
              </div>

              {/* Comment text */}
              <p className="text-xs text-neutral-200 bg-neutral-950 p-3 rounded-2xl border border-neutral-800 mb-4 leading-relaxed">
                {duet.reactionComment}
              </p>

              {/* Comments stream */}
              <div className="space-y-2 mb-4 max-h-[160px] overflow-y-auto pr-1">
                <span className="text-[10px] font-mono-code uppercase font-bold text-neutral-400 block">
                  Reactions ({comments.length})
                </span>
                {comments.map((c, i) => (
                  <div key={i} className="text-xs text-neutral-300 bg-neutral-800/40 p-2 rounded-xl border border-neutral-800">
                    {c}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-neutral-800">
              {/* Comment input */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Drop a reaction..."
                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-rose-500/50"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-rose-400 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Primary Duet CTA */}
              <div className="flex gap-2">
                <button
                  onClick={() => onRecordNewDuet(duet.capsuleId)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-lg shadow-rose-500/25 transition-all active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Record Duet to This</span>
                </button>

                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                  title="Share link"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
