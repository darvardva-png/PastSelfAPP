import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  Clock, 
  Flame, 
  Lock, 
  CheckCircle2, 
  HelpCircle, 
  Share2, 
  Zap, 
  EyeOff, 
  Trophy,
  Star,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sfx } from '../utils/audioFX';

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  category: 'capsules' | 'duets' | 'predictions' | 'special';
  targetCount: number;
  currentCount: number;
  iconName: 'clock' | 'flame' | 'sparkles' | 'eye' | 'help' | 'trophy' | 'share' | 'lock';
  tier: 'bronze' | 'silver' | 'gold' | 'neon';
  perk: string;
}

interface BadgesProps {
  userCapsulesCount: number;
  userDuetsCount: number;
  blindReactionsCount: number;
  predictionBetsCount: number;
  timeBombsJoinedCount: number;
  sharesCount: number;
  onBadgeClick?: (badge: BadgeDefinition) => void;
}

export const Badges: React.FC<BadgesProps> = ({
  userCapsulesCount,
  userDuetsCount,
  blindReactionsCount,
  predictionBetsCount,
  timeBombsJoinedCount,
  sharesCount,
  onBadgeClick
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unlocked' | 'in_progress'>('all');
  const [activeModalBadge, setActiveModalBadge] = useState<BadgeDefinition | null>(null);

  // Badge list with dynamic progression
  const badgesList: BadgeDefinition[] = [
    {
      id: 'time-traveler',
      name: 'Time Traveler',
      description: 'Record and seal 5 time-capsule videos into your vault',
      category: 'capsules',
      targetCount: 5,
      currentCount: userCapsulesCount,
      iconName: 'clock',
      tier: 'gold',
      perk: 'Unlocks exclusive holographic capsule cover borders'
    },
    {
      id: 'reaction-king',
      name: 'Reaction King',
      description: 'Record 10 split-screen duets to friend time-capsules',
      category: 'duets',
      targetCount: 10,
      currentCount: userDuetsCount,
      iconName: 'flame',
      tier: 'neon',
      perk: 'VIP Crown on #PastSelfApp watermarks'
    },
    {
      id: 'blind-faith',
      name: 'Raw Instinct',
      description: 'Complete 3 Blind Reactions with camera locked until reveal',
      category: 'duets',
      targetCount: 3,
      currentCount: blindReactionsCount,
      iconName: 'eye',
      tier: 'silver',
      perk: 'Unlocks glitch VHS audio distortion filters'
    },
    {
      id: 'future-prophet',
      name: 'Chrono Prophet',
      description: 'Place 3 future prediction bets on your future self',
      category: 'predictions',
      targetCount: 3,
      currentCount: predictionBetsCount,
      iconName: 'help',
      tier: 'silver',
      perk: 'Custom prediction confidence meter styles'
    },
    {
      id: 'time-bomber',
      name: 'Crew Bombadier',
      description: 'Participate in a Time Bomb group chat challenge',
      category: 'special',
      targetCount: 1,
      currentCount: timeBombsJoinedCount,
      iconName: 'trophy',
      tier: 'bronze',
      perk: 'Host private group time capsules with up to 20 friends'
    },
    {
      id: 'viral-broadcaster',
      name: 'Viral Catalyst',
      description: 'Export or share a #PastSelfApp duet to social platforms',
      category: 'special',
      targetCount: 1,
      currentCount: sharesCount,
      iconName: 'share',
      tier: 'bronze',
      perk: 'Ultra HD 60fps canvas export option'
    },
    {
      id: 'social-ambassador',
      name: 'Social Ambassador',
      description: 'Share 3 capsules or duets directly to TikTok, Instagram, or friends',
      category: 'special',
      targetCount: 3,
      currentCount: sharesCount,
      iconName: 'share',
      tier: 'gold',
      perk: 'Neon creator verified badge on all shared video time-capsules'
    }
  ];

  const unlockedCount = badgesList.filter(b => b.currentCount >= b.targetCount).length;
  const totalBadges = badgesList.length;
  const completionPercentage = Math.round((unlockedCount / totalBadges) * 100);

  const filteredBadges = badgesList.filter(b => {
    const isUnlocked = b.currentCount >= b.targetCount;
    if (selectedFilter === 'unlocked') return isUnlocked;
    if (selectedFilter === 'in_progress') return !isUnlocked;
    return true;
  });

  const getBadgeIcon = (iconName: BadgeDefinition['iconName'], isUnlocked: boolean) => {
    const className = `w-6 h-6 ${isUnlocked ? 'text-white' : 'text-neutral-500'}`;
    switch (iconName) {
      case 'clock': return <Clock className={className} />;
      case 'flame': return <Flame className={className} />;
      case 'eye': return <EyeOff className={className} />;
      case 'help': return <HelpCircle className={className} />;
      case 'share': return <Share2 className={className} />;
      case 'trophy': return <Trophy className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  const getTierColors = (tier: BadgeDefinition['tier'], isUnlocked: boolean) => {
    if (!isUnlocked) {
      return {
        cardBg: 'bg-neutral-900/40 border-neutral-800/60',
        iconBg: 'bg-neutral-800/50 border-neutral-700/40',
        badgePill: 'bg-neutral-800 text-neutral-400',
        progressBg: 'bg-neutral-700'
      };
    }

    switch (tier) {
      case 'neon':
        return {
          cardBg: 'bg-gradient-to-br from-rose-950/40 via-purple-950/30 to-neutral-900 border-rose-500/50 shadow-lg shadow-rose-500/10',
          iconBg: 'bg-gradient-to-tr from-rose-500 to-pink-500 border-rose-300 shadow-md shadow-rose-500/30',
          badgePill: 'bg-rose-500/20 text-rose-300 border border-rose-500/40',
          progressBg: 'bg-gradient-to-r from-rose-500 to-pink-500'
        };
      case 'gold':
        return {
          cardBg: 'bg-gradient-to-br from-amber-950/40 via-yellow-950/20 to-neutral-900 border-amber-500/50 shadow-lg shadow-amber-500/10',
          iconBg: 'bg-gradient-to-tr from-amber-500 to-yellow-400 border-amber-200 shadow-md shadow-amber-500/30',
          badgePill: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
          progressBg: 'bg-gradient-to-r from-amber-500 to-yellow-400'
        };
      case 'silver':
        return {
          cardBg: 'bg-gradient-to-br from-cyan-950/30 via-slate-900/40 to-neutral-900 border-cyan-500/40',
          iconBg: 'bg-gradient-to-tr from-cyan-600 to-teal-400 border-cyan-300 shadow-md shadow-cyan-500/20',
          badgePill: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40',
          progressBg: 'bg-gradient-to-r from-cyan-500 to-teal-400'
        };
      default: // bronze
        return {
          cardBg: 'bg-gradient-to-br from-orange-950/30 to-neutral-900 border-orange-500/30',
          iconBg: 'bg-gradient-to-tr from-orange-600 to-amber-600 border-orange-400 shadow-md shadow-orange-500/20',
          badgePill: 'bg-orange-500/20 text-orange-300 border border-orange-500/40',
          progressBg: 'bg-orange-500'
        };
    }
  };

  const handleCardClick = (badge: BadgeDefinition) => {
    setActiveModalBadge(badge);
    sfx.shutterClick();
    if (badge.currentCount >= badge.targetCount) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
    if (onBadgeClick) onBadgeClick(badge);
  };

  return (
    <div className="space-y-5">
      {/* Overview & Level Progress */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-rose-500/20 shrink-0">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">Chrono Achievements</h4>
              <span className="text-[10px] font-mono-code font-bold uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Rank: {unlockedCount >= 4 ? 'Master Chrononaut' : unlockedCount >= 2 ? 'Time Voyager' : 'Novice Archivist'}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Unlock badges by sealing past self memories and dueting friend time capsules.
            </p>
          </div>
        </div>

        {/* Progress Bar Counter */}
        <div className="w-full sm:w-56 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
          <div className="flex items-center justify-between text-[11px] font-mono-code mb-1.5">
            <span className="text-neutral-400">Total Unlocked</span>
            <span className="text-amber-400 font-bold">{unlockedCount} / {totalBadges} ({completionPercentage}%)</span>
          </div>
          <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-500 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-neutral-900/60 p-1 rounded-xl border border-neutral-800">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedFilter === 'all'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            All Badges ({badgesList.length})
          </button>
          <button
            onClick={() => setSelectedFilter('unlocked')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedFilter === 'unlocked'
                ? 'bg-neutral-800 text-emerald-300 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Unlocked ({unlockedCount})
          </button>
          <button
            onClick={() => setSelectedFilter('in_progress')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedFilter === 'in_progress'
                ? 'bg-neutral-800 text-amber-300 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            In Progress ({totalBadges - unlockedCount})
          </button>
        </div>

        <span className="text-[11px] font-mono-code text-neutral-500 hidden sm:inline">
          Click any badge for perks & details
        </span>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredBadges.map((badge) => {
          const isUnlocked = badge.currentCount >= badge.targetCount;
          const styles = getTierColors(badge.tier, isUnlocked);
          const progressPercent = Math.min(100, Math.round((badge.currentCount / badge.targetCount) * 100));

          return (
            <div
              key={badge.id}
              onClick={() => handleCardClick(badge)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.99] flex flex-col justify-between ${styles.cardBg}`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${styles.iconBg}`}>
                    {getBadgeIcon(badge.iconName, isUnlocked)}
                  </div>

                  <div className="flex flex-col items-end">
                    <span className={`text-[9px] font-mono-code font-bold uppercase px-2 py-0.5 rounded-full ${styles.badgePill}`}>
                      {badge.tier}
                    </span>
                    {isUnlocked && (
                      <span className="text-[10px] font-mono-code text-emerald-400 font-bold flex items-center gap-1 mt-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Unlocked
                      </span>
                    )}
                  </div>
                </div>

                <h5 className="text-sm font-bold text-white flex items-center gap-1.5 mb-1">
                  <span>{badge.name}</span>
                  {isUnlocked && <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                </h5>
                <p className="text-xs text-neutral-400 line-clamp-2 mb-3">
                  {badge.description}
                </p>
              </div>

              {/* Progress Bar & Target Indicator */}
              <div className="pt-2 border-t border-neutral-800/60">
                <div className="flex items-center justify-between text-[10px] font-mono-code mb-1">
                  <span className="text-neutral-400">Progress</span>
                  <span className={`font-bold ${isUnlocked ? 'text-emerald-400' : 'text-neutral-300'}`}>
                    {Math.min(badge.currentCount, badge.targetCount)} / {badge.targetCount} ({progressPercent}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-neutral-800/80 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${styles.progressBg} transition-all duration-300`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal for Selected Badge */}
      {activeModalBadge && (
        <div 
          onClick={() => setActiveModalBadge(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl relative flex flex-col items-center text-center"
          >
            {/* Badge Icon Showcase */}
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center border mb-4 shadow-xl ${
              getTierColors(activeModalBadge.tier, activeModalBadge.currentCount >= activeModalBadge.targetCount).iconBg
            }`}>
              {getBadgeIcon(activeModalBadge.iconName, activeModalBadge.currentCount >= activeModalBadge.targetCount)}
            </div>

            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-mono-code font-bold uppercase px-2.5 py-0.5 rounded-full ${
                getTierColors(activeModalBadge.tier, activeModalBadge.currentCount >= activeModalBadge.targetCount).badgePill
              }`}>
                {activeModalBadge.tier} Badge
              </span>
              {activeModalBadge.currentCount >= activeModalBadge.targetCount && (
                <span className="text-[10px] font-mono-code font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Unlocked!
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-white mt-1 mb-2">
              {activeModalBadge.name}
            </h3>

            <p className="text-xs text-neutral-300 mb-4 leading-relaxed">
              {activeModalBadge.description}
            </p>

            {/* Reward Perk */}
            <div className="w-full bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800 text-left mb-5">
              <span className="text-[10px] font-mono-code uppercase font-bold text-amber-400 flex items-center gap-1 mb-1">
                <Star className="w-3 h-3" />
                Badge Reward / Perk
              </span>
              <p className="text-xs text-neutral-200">
                {activeModalBadge.perk}
              </p>
            </div>

            {/* Progress Status */}
            <div className="w-full mb-5">
              <div className="flex items-center justify-between text-xs font-mono-code mb-1.5">
                <span className="text-neutral-400">Current Progress</span>
                <span className="text-white font-bold">
                  {Math.min(activeModalBadge.currentCount, activeModalBadge.targetCount)} / {activeModalBadge.targetCount}
                </span>
              </div>
              <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getTierColors(activeModalBadge.tier, activeModalBadge.currentCount >= activeModalBadge.targetCount).progressBg}`}
                  style={{ width: `${Math.min(100, (activeModalBadge.currentCount / activeModalBadge.targetCount) * 100)}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => setActiveModalBadge(null)}
              className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
