import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Flame, 
  Clock, 
  Lock, 
  Plus, 
  Users, 
  Filter, 
  Share2, 
  TrendingUp, 
  Heart, 
  Play, 
  Eye, 
  Layers, 
  Rows, 
  Columns,
  Search, 
  ArrowUpDown, 
  Calendar,
  Coins,
  Crown
} from 'lucide-react';
import { PastSelfCapsule, DuetReaction, GroupChallenge, SplitLayout, VideoFilter } from './types';
import { INITIAL_CAPSULES, INITIAL_DUETS, INITIAL_TIME_BOMBS, DAILY_PROMPTS } from './data/mockData';
import { Navigation } from './components/Navigation';
import { CapsuleCard } from './components/CapsuleCard';
import { DuetRecorderModal } from './components/DuetRecorderModal';
import { DuetShareStudioModal } from './components/DuetShareStudioModal';
import { DuetShowcaseModal } from './components/DuetShowcaseModal';
import { NewCapsuleModal } from './components/NewCapsuleModal';
import { TimeBombUnboxModal } from './components/TimeBombUnboxModal';
import { NewGroupCapsuleModal } from './components/NewGroupCapsuleModal';
import { CapsuleRecapModal } from './components/CapsuleRecapModal';
import { ProUpgradeModal } from './components/ProUpgradeModal';
import { AIWishVisionModal } from './components/AIWishVisionModal';
import { Badges } from './components/Badges';
import { auth, signInWithGoogle, logOut, onAuthStateChanged, User } from './firebase';
import { Language, TRANSLATIONS } from './i18n/translations';
import { sfx } from './utils/audioFX';
import confetti from 'canvas-confetti';

export default function App() {
  // App state & i18n
  const [language, setLanguage] = useState<Language>('en');
  const t = TRANSLATIONS[language];
  const [vaultSortBy, setVaultSortBy] = useState<'unlockDate' | 'creationDate' | 'title'>('unlockDate');

  const [capsules, setCapsules] = useState<PastSelfCapsule[]>(INITIAL_CAPSULES);
  const [duets, setDuets] = useState<DuetReaction[]>(INITIAL_DUETS);
  const [timeBombs, setTimeBombs] = useState<GroupChallenge[]>(INITIAL_TIME_BOMBS);
  const [activeTab, setActiveTab] = useState<'feed' | 'duets' | 'timebombs' | 'vault'>('feed');
  const [feedFilter, setFeedFilter] = useState<'all' | 'friends' | 'unlocked'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // User Gamification & Progress Metrics
  const [userCapsulesCount, setUserCapsulesCount] = useState<number>(1);
  const [userDuetsCount, setUserDuetsCount] = useState<number>(2);
  const [blindReactionsCount, setBlindReactionsCount] = useState<number>(2);
  const [predictionBetsCount, setPredictionBetsCount] = useState<number>(2);
  const [timeBombsJoinedCount, setTimeBombsJoinedCount] = useState<number>(1);
  const [sharesCount, setSharesCount] = useState<number>(1);
  const [userPoints, setUserPoints] = useState<number>(150);
  const [pointsHistory, setPointsHistory] = useState<Array<{ id: string; points: number; reason: string; date: string }>>([
    { id: 'p1', points: 100, reason: 'Welcome to Chrono Network', date: 'Oct 2026' },
    { id: 'p2', points: 50, reason: 'Completed Profile Setup', date: 'Today' }
  ]);

  // Modals state
  const [isRecorderOpen, setIsRecorderOpen] = useState(false);
  const [selectedCapsuleForDuet, setSelectedCapsuleForDuet] = useState<PastSelfCapsule | null>(null);

  const [isShareStudioOpen, setIsShareStudioOpen] = useState(false);
  const [activeShareData, setActiveShareData] = useState<{
    capsule: PastSelfCapsule;
    reactionVideoBlob: Blob | null;
    reactionVideoUrl: string;
    layout: SplitLayout;
    filter: VideoFilter;
    isBlindReaction: boolean;
  } | null>(null);

  const [selectedDuetForShowcase, setSelectedDuetForShowcase] = useState<DuetReaction | null>(null);
  const [isNewCapsuleOpen, setIsNewCapsuleOpen] = useState(false);
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false);
  const [isRecapModalOpen, setIsRecapModalOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isAIWishModalOpen, setIsAIWishModalOpen] = useState(false);
  const [selectedTimeBomb, setSelectedTimeBomb] = useState<GroupChallenge | null>(null);

  // Add Points handler with celebration and history tracking
  const handleAddPoints = (points: number, reason: string) => {
    setUserPoints(prev => {
      const next = prev + points;
      return next;
    });
    setPointsHistory(prev => [
      { id: `p-${Date.now()}`, points, reason, date: 'Just now' },
      ...prev
    ]);
    if (reason.toLowerCase().includes('share')) {
      setSharesCount(prev => prev + 1);
    }
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Trigger recorder for a specific capsule
  const handleOpenDuetRecorder = (capsule: PastSelfCapsule) => {
    sfx.shutterClick();
    setSelectedCapsuleForDuet(capsule);
    setIsRecorderOpen(true);
  };

  // Quick duet from header (picks first unlocked friend capsule)
  const handleQuickDuet = () => {
    const candidate = capsules.find(c => c.isUnlocked && c.isFriend) || capsules[0];
    handleOpenDuetRecorder(candidate);
  };

  // When user finishes recording a duet in DuetRecorderModal
  const handleRecordingFinished = (data: {
    capsule: PastSelfCapsule;
    reactionVideoBlob: Blob | null;
    reactionVideoUrl: string;
    layout: SplitLayout;
    filter: VideoFilter;
    isBlindReaction: boolean;
  }) => {
    setIsRecorderOpen(false);
    setActiveShareData(data);
    setIsShareStudioOpen(true);
  };

  // When user publishes their duet from DuetShareStudioModal
  const handlePublishDuet = (record: {
    capsuleTitle: string;
    caption: string;
    layout: SplitLayout;
    filter: VideoFilter;
    wasPredictionCorrect?: boolean;
  }) => {
    if (!activeShareData) return;

    const newDuet: DuetReaction = {
      id: `duet-${Date.now()}`,
      capsuleId: activeShareData.capsule.id,
      capsuleTitle: record.capsuleTitle,
      reactorName: 'You (Present Self)',
      reactorHandle: '@you',
      reactorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      recordedDate: 'Today (Oct 2026)',
      pastVideoUrl: activeShareData.capsule.videoUrl,
      reactionVideoUrl: activeShareData.reactionVideoUrl,
      layout: record.layout,
      filter: record.filter,
      pastSelfTimestamp: `${activeShareData.capsule.creatorName} (${activeShareData.capsule.yearsAgo}y ago)`,
      reactionTimestamp: 'Reaction: Today (2026)',
      reactionComment: record.caption,
      likes: 1,
      hasLiked: true,
      shares: 0,
      watermarkText: '#PastSelfApp',
      isBlindReaction: activeShareData.isBlindReaction
    };

    setDuets([newDuet, ...duets]);

    // Track progression for Badges
    setUserDuetsCount(prev => {
      const next = prev + 1;
      if (next === 10) {
        sfx.unlockChime();
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
      }
      return next;
    });

    if (activeShareData.isBlindReaction) {
      setBlindReactionsCount(prev => prev + 1);
    }
    setSharesCount(prev => prev + 1);

    // Increment capsule duet count
    setCapsules(capsules.map(c => {
      if (c.id === activeShareData.capsule.id) {
        return { ...c, duetCount: c.duetCount + 1 };
      }
      return c;
    }));

    setActiveTab('duets');
  };

  // Add new capsule
  const handleCapsuleCreated = (newCapsule: PastSelfCapsule) => {
    setCapsules([newCapsule, ...capsules]);
    setUserCapsulesCount(prev => {
      const next = prev + 1;
      if (next === 5) {
        sfx.unlockChime();
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
      }
      return next;
    });
    if (newCapsule.prediction) {
      setPredictionBetsCount(prev => prev + 1);
    }
    setActiveTab('vault');
  };

  // Filtered capsules
  const filteredCapsules = capsules.filter(c => {
    if (feedFilter === 'friends' && !c.isFriend) return false;
    if (feedFilter === 'unlocked' && !c.isUnlocked) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.creatorName.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.prompt.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const unlockedCount = capsules.filter(c => c.isUnlocked).length;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewCapsule={() => setIsNewCapsuleOpen(true)}
        onOpenQuickDuet={handleQuickDuet}
        onOpenProModal={() => setIsProModalOpen(true)}
        onOpenAIWish={() => setIsAIWishModalOpen(true)}
        userPoints={userPoints}
        currentUser={currentUser}
        onSignIn={signInWithGoogle}
        onSignOut={logOut}
        unlockedCount={unlockedCount}
        currentLanguage={language}
        onLanguageChange={setLanguage}
        t={t}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
        
        {/* Hero Banner for Blind Reaction & Duets */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-purple-950/40 border border-neutral-800 p-6 sm:p-8 mb-8 shadow-2xl">
          <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-1/4 -top-12 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono-code font-bold mb-3">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              {t.heroTag}
            </div>

            <h2 className="font-display text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {t.heroQuote}
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 mt-2 font-normal leading-relaxed">
              {t.heroSub}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={handleQuickDuet}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-rose-500/25 transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t.startBlindDuet}</span>
              </button>

              <button
                onClick={() => setIsAIWishModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 hover:from-amber-500/30 hover:to-purple-500/30 text-amber-300 hover:text-white font-bold text-xs sm:text-sm border border-amber-500/30 shadow-lg shadow-amber-500/10 transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{t.aiWishesHeroBtn}</span>
              </button>

              <button
                onClick={() => setIsNewCapsuleOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 hover:text-white font-semibold text-xs sm:text-sm border border-neutral-700 transition-all active:scale-95"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>{t.recordFutureLock}</span>
              </button>
            </div>
          </div>
        </div>

        {/* TAB 1: FRIEND CAPSULES FEED */}
        {activeTab === 'feed' && (
          <div className="space-y-6">
            
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-neutral-900/50 p-3 rounded-2xl border border-neutral-800/80">
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <button
                  onClick={() => setFeedFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    feedFilter === 'all'
                      ? 'bg-neutral-800 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  All Capsules ({capsules.length})
                </button>

                <button
                  onClick={() => setFeedFilter('friends')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    feedFilter === 'friends'
                      ? 'bg-neutral-800 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Friends Only
                </button>

                <button
                  onClick={() => setFeedFilter('unlocked')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    feedFilter === 'unlocked'
                      ? 'bg-neutral-800 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Ready to Duet ⚡
                </button>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search memories, predictions..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-rose-500/50"
                />
              </div>
            </div>

            {/* Capsules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCapsules.map((capsule) => (
                <CapsuleCard
                  key={capsule.id}
                  capsule={capsule}
                  onRecordDuet={handleOpenDuetRecorder}
                  onViewDuets={(c) => {
                    const match = duets.find(d => d.capsuleId === c.id) || duets[0];
                    setSelectedDuetForShowcase(match);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: VIRAL DUETS */}
        {activeTab === 'duets' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Trending Split-Screen Duets
                </h3>
                <p className="text-xs text-neutral-400">
                  Past Self vs Present Reactions with synced dual playback & #PastSelfApp watermark
                </p>
              </div>

              <button
                onClick={handleQuickDuet}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Record New Reaction</span>
              </button>
            </div>

            {/* Duets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {duets.map((duet) => (
                <div
                  key={duet.id}
                  onClick={() => setSelectedDuetForShowcase(duet)}
                  className="bg-neutral-900/70 border border-neutral-800 rounded-3xl p-5 hover:border-neutral-700 transition-all hover:shadow-2xl hover:shadow-purple-500/10 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={duet.reactorAvatar} 
                          alt={duet.reactorName} 
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-500/40"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-white">{duet.reactorName}</h4>
                          <span className="text-[10px] font-mono-code text-neutral-400">{duet.reactorHandle}</span>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono-code bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded-full">
                        {duet.layout === 'stacked-vertical' ? '9:16 Vertical Duet' : 'Side-by-Side Split'}
                      </span>
                    </div>

                    <h5 className="text-sm font-bold text-white line-clamp-1 mb-1">
                      {duet.capsuleTitle}
                    </h5>
                    <p className="text-xs text-neutral-300 line-clamp-2 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 mb-3">
                      &ldquo;{duet.reactionComment}&rdquo;
                    </p>

                    {/* Dual Mini Visual Preview */}
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-neutral-800 flex">
                      <div className="w-1/2 h-full relative border-r border-rose-500/40">
                        <video src={duet.pastVideoUrl} muted playsInline loop className="w-full h-full object-cover" />
                        <span className="absolute bottom-1.5 left-1.5 bg-black/80 px-1.5 py-0.2 rounded text-[8px] font-mono-code text-rose-300">
                          Past
                        </span>
                      </div>
                      <div className="w-1/2 h-full relative">
                        <video src={duet.reactionVideoUrl} muted playsInline loop className="w-full h-full object-cover" />
                        <span className="absolute bottom-1.5 left-1.5 bg-black/80 px-1.5 py-0.2 rounded text-[8px] font-mono-code text-cyan-300">
                          Reaction
                        </span>
                      </div>

                      {/* Watermark Tag */}
                      <div className="absolute top-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[8px] font-mono-code text-white border border-rose-500/30">
                        #PastSelfApp
                      </div>
                    </div>
                  </div>

                  {/* Footer stats */}
                  <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                        {duet.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="w-3.5 h-3.5 text-neutral-400" />
                        {duet.shares}
                      </span>
                    </div>

                    <span className="text-[11px] font-bold text-rose-400 flex items-center gap-1">
                      <Play className="w-3 h-3 fill-rose-400" />
                      Watch Synchronized
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TIME BOMBS */}
        {activeTab === 'timebombs' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-400" />
                  &ldquo;Time Bomb&rdquo; Group Challenges
                </h3>
                <p className="text-xs text-neutral-400">
                  You and your crew record answers to a future prompt locked until a fixed date, then unbox together!
                </p>
              </div>

              <button
                onClick={() => setIsNewGroupModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all shrink-0"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Create Group Capsule</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {timeBombs.map((bomb) => (
                <div
                  key={bomb.id}
                  onClick={() => setSelectedTimeBomb(bomb)}
                  className="bg-neutral-900/70 border border-neutral-800 rounded-3xl p-5 hover:border-amber-500/40 transition-all hover:shadow-xl cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono-code font-bold uppercase px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        {bomb.isUnlocked ? '🔓 UNBOXED TODAY' : `⏳ LOCKED (${bomb.daysRemaining} DAYS)`}
                      </span>
                      <span className="text-[11px] font-mono-code text-neutral-400">
                        Unlock: {bomb.unlockDate}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white mb-1.5">{bomb.title}</h4>
                    <p className="text-xs text-neutral-300 mb-4">&ldquo;{bomb.prompt}&rdquo;</p>

                    {/* Participants Avatars */}
                    <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800 mb-4 flex items-center justify-between">
                      <span className="text-[11px] font-mono-code text-neutral-400">Crew Vaulted</span>
                      <div className="flex -space-x-2">
                        {bomb.participants.map((p, i) => (
                          <img
                            key={i}
                            src={p.avatar}
                            alt={p.name}
                            title={p.name}
                            className="w-7 h-7 rounded-full object-cover ring-2 ring-neutral-900"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs border border-neutral-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>{bomb.isUnlocked ? 'Enter Unboxing Room' : 'View Group Predictions'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: MY VAULT */}
        {activeTab === 'vault' && (
          <div className="space-y-8">
            
            {/* USER PROFILE AREA */}
            <div className="relative rounded-3xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 p-6 sm:p-8 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -left-12 -bottom-12 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-neutral-800/80">
                
                {/* Profile Identity */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80" 
                      alt="User Profile" 
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-emerald-500/40 shadow-xl shadow-emerald-500/10"
                    />
                    <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-neutral-950 text-[10px] font-mono-code font-black px-1.5 py-0.5 rounded-full ring-2 ring-neutral-950">
                      LVL 3
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-display font-extrabold text-white">
                        {currentUser?.displayName || 'Alex R.'}
                      </h3>
                      <span className="text-[10px] font-mono-code font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {t.chronoArchivist}
                      </span>
                    </div>
                    <div className="text-xs font-mono-code text-neutral-400 mt-0.5">
                      {currentUser?.email ? currentUser.email : '@you • Joined Oct 2026'}
                    </div>
                    <p className="text-xs text-neutral-300 mt-2 max-w-md font-sans leading-relaxed">
                      {t.userBio}
                    </p>
                  </div>
                </div>

                {/* Primary Actions & Fast Tester */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
                  <button
                    onClick={() => setIsRecapModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white font-bold text-xs shadow-lg shadow-purple-500/20 active:scale-95 transition-all"
                    title="Generate 9:16 Instagram Story image recap card"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{t.storyRecapCard}</span>
                  </button>

                  <button
                    onClick={() => setIsNewCapsuleOpen(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t.sealNewCapsule}</span>
                  </button>

                  {/* Fast milestone test tools to demonstrate dynamic badge unlocks */}
                  <div className="flex items-center gap-1.5 bg-neutral-900/90 p-1 rounded-xl border border-neutral-800">
                    <button
                      onClick={() => {
                        setUserCapsulesCount(prev => prev + 1);
                        sfx.shutterClick();
                        if (userCapsulesCount + 1 === 5) {
                          sfx.unlockChime();
                          confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
                        }
                      }}
                      className="text-[10px] font-mono-code px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                      title="Quick test increment for 'Time Traveler' badge"
                    >
                      +1 Capsule
                    </button>
                    <button
                      onClick={() => {
                        setUserDuetsCount(prev => prev + 1);
                        sfx.shutterClick();
                        if (userDuetsCount + 1 === 10) {
                          sfx.unlockChime();
                          confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
                        }
                      }}
                      className="text-[10px] font-mono-code px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                      title="Quick test increment for 'Reaction King' badge"
                    >
                      +1 Duet
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
                <div className="bg-neutral-950/70 border border-neutral-800/80 p-3 rounded-2xl">
                  <div className="text-[10px] font-mono-code uppercase font-semibold text-neutral-400">
                    {t.sealedCapsulesMetric}
                  </div>
                  <div className="text-xl font-display font-extrabold text-white mt-1 flex items-baseline gap-1.5">
                    <span>{userCapsulesCount}</span>
                    <span className="text-[10px] font-mono-code text-neutral-500 font-normal">/ 5 {t.forBadge} Time Traveler</span>
                  </div>
                </div>

                <div className="bg-neutral-950/70 border border-neutral-800/80 p-3 rounded-2xl">
                  <div className="text-[10px] font-mono-code uppercase font-semibold text-neutral-400">
                    {t.duetsRecordedMetric}
                  </div>
                  <div className="text-xl font-display font-extrabold text-white mt-1 flex items-baseline gap-1.5">
                    <span>{userDuetsCount}</span>
                    <span className="text-[10px] font-mono-code text-neutral-500 font-normal">/ 10 {t.forBadge} Reaction King</span>
                  </div>
                </div>

                <div className="bg-neutral-950/70 border border-neutral-800/80 p-3 rounded-2xl">
                  <div className="text-[10px] font-mono-code uppercase font-semibold text-neutral-400">
                    {t.blindReactionsMetric}
                  </div>
                  <div className="text-xl font-display font-extrabold text-white mt-1 flex items-baseline gap-1.5">
                    <span>{blindReactionsCount}</span>
                    <span className="text-[10px] font-mono-code text-neutral-500 font-normal">/ 3 {t.forBadge} Raw Instinct</span>
                  </div>
                </div>

                <div className="bg-neutral-950/70 border border-neutral-800/80 p-3 rounded-2xl">
                  <div className="text-[10px] font-mono-code uppercase font-semibold text-neutral-400">
                    {t.predictionsMadeMetric}
                  </div>
                  <div className="text-xl font-display font-extrabold text-white mt-1 flex items-baseline gap-1.5">
                    <span>{predictionBetsCount}</span>
                    <span className="text-[10px] font-mono-code text-neutral-500 font-normal">{t.activeBets}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* BADGES COMPONENT SECTION */}
            <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-3xl p-6 sm:p-7 shadow-xl">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  {t.achievementsTitle}
                </h3>
                <p className="text-xs text-neutral-400">
                  {t.achievementsSubtitle}
                </p>
              </div>

              <Badges
                userCapsulesCount={userCapsulesCount}
                userDuetsCount={userDuetsCount}
                blindReactionsCount={blindReactionsCount}
                predictionBetsCount={predictionBetsCount}
                timeBombsJoinedCount={timeBombsJoinedCount}
                sharesCount={sharesCount}
              />
            </div>

            {/* CHRONO POINTS & MONETIZATION HUB (FREE VS PRO BREAKDOWN) */}
            <div className="bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-amber-950/30 border border-neutral-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
                    <Coins className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">Chrono Points & Monetization Hub</h3>
                      <span className="text-[10px] font-mono-code font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {userPoints} Points
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">
                      Earn free points by sharing AI wishes on social media, or upgrade to Pro Pass for unlimited 4K locks.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAIWishModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Manifest Wish (+50 pts)</span>
                  </button>

                  <button
                    onClick={() => setIsProModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-bold text-xs border border-amber-500/30 transition-all active:scale-95"
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>View Pro Pass</span>
                  </button>
                </div>
              </div>

              {/* Free Features vs Paid Add-Ons Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* Free Tier */}
                <div className="bg-neutral-950/70 border border-neutral-800/80 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 font-mono-code uppercase">Free Core Features</span>
                    <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">Included for Everyone</span>
                  </div>
                  <ul className="text-xs text-neutral-300 space-y-1.5">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400 text-xs">✓</span>
                      <span>Lock video capsules (6 months, 1 year, 3 years)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400 text-xs">✓</span>
                      <span>Record side-by-side blind reactions & duets</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400 text-xs">✓</span>
                      <span>AI Future Wish short video generator (+50 pts)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400 text-xs">✓</span>
                      <span>Earn 100 points per share to TikTok/Instagram</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400 text-xs">✓</span>
                      <span>Standard HD export with #PastSelfApp watermark</span>
                    </li>
                  </ul>
                </div>

                {/* Paid Pro / Monetization Tier */}
                <div className="bg-neutral-950/70 border border-amber-500/30 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 font-mono-code uppercase">Paid Pro & Add-ons</span>
                    <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">$4.99/mo or $39.99/yr</span>
                  </div>
                  <ul className="text-xs text-neutral-300 space-y-1.5">
                    <li className="flex items-center gap-2">
                      <span className="text-amber-400 text-xs">★</span>
                      <span>10-year & 20-year ultra-vault storage</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-amber-400 text-xs">★</span>
                      <span>4K 60fps canvas compositing & clean export</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-amber-400 text-xs">★</span>
                      <span>Remove or customize the watermark with your brand</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-amber-400 text-xs">★</span>
                      <span>All premium retro filters (VHS, Y2K Digicam, Cyberpunk)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-amber-400 text-xs">★</span>
                      <span>Direct Stripe payment integration for creator revenue</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* MY SEALED & UNLOCKED CAPSULES GRID WITH SORT CONTROLS */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    {t.myVaultCapsules} ({capsules.filter(c => !c.isFriend).length})
                  </h4>
                  <p className="text-xs text-neutral-400">
                    {t.myVaultCapsulesSub}
                  </p>
                </div>

                {/* Sort Dropdown & Toggle Buttons */}
                <div className="flex items-center gap-1.5 bg-neutral-950 p-1.5 rounded-2xl border border-neutral-800">
                  <div className="flex items-center gap-1 px-2 text-neutral-400 text-[11px] font-mono-code font-bold">
                    <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden sm:inline">{t.sortByLabel}</span>
                  </div>

                  <select
                    value={vaultSortBy}
                    onChange={(e) => setVaultSortBy(e.target.value as 'unlockDate' | 'creationDate' | 'title')}
                    className="bg-neutral-900 border border-neutral-800 rounded-xl px-2.5 py-1 text-xs text-emerald-300 font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="unlockDate">⏳ {t.sortUnlockDate}</option>
                    <option value="creationDate">📅 {t.sortCreationDate}</option>
                    <option value="title">🔤 {t.sortTitleAZ}</option>
                  </select>
                </div>
              </div>

              {/* Sorted Vault Capsules Grid */}
              {(() => {
                const userVaultCapsules = capsules.filter(c => !c.isFriend);
                const sortedList = [...userVaultCapsules].sort((a, b) => {
                  if (vaultSortBy === 'title') {
                    return a.title.localeCompare(b.title);
                  }
                  if (vaultSortBy === 'creationDate') {
                    const dateA = new Date(a.recordedDate).getTime() || 0;
                    const dateB = new Date(b.recordedDate).getTime() || 0;
                    return dateB - dateA;
                  }
                  // unlockDate
                  const dateA = new Date(a.unlockDate).getTime() || 0;
                  const dateB = new Date(b.unlockDate).getTime() || 0;
                  return dateA - dateB;
                });

                if (sortedList.length === 0) {
                  return (
                    <div className="bg-neutral-950/60 border border-neutral-800 rounded-2xl p-8 text-center text-neutral-400 text-xs">
                      {t.noCapsulesFound}
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedList.map((capsule) => (
                      <CapsuleCard
                        key={capsule.id}
                        capsule={capsule}
                        onRecordDuet={handleOpenDuetRecorder}
                        onViewDuets={(c) => {
                          const match = duets.find(d => d.capsuleId === c.id) || duets[0];
                          setSelectedDuetForShowcase(match);
                        }}
                      />
                    ))}
                  </div>
                );
              })()}
            </div>

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-6 px-4 text-center text-xs text-neutral-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-neutral-300">PASTSELF</span>
            <span>• Time-Capsule Video Social & Blind Reaction Split Engine</span>
          </div>
          <div className="font-mono-code text-[11px] text-neutral-400">
            Export ready with watermark <span className="text-rose-400 font-bold">#PastSelfApp</span>
          </div>
        </div>
      </footer>

      {/* MODAL 1: DUET & BLIND REACTION RECORDER */}
      {selectedCapsuleForDuet && (
        <DuetRecorderModal
          isOpen={isRecorderOpen}
          onClose={() => {
            setIsRecorderOpen(false);
            setSelectedCapsuleForDuet(null);
          }}
          capsule={selectedCapsuleForDuet}
          onRecordingComplete={handleRecordingFinished}
        />
      )}

      {/* MODAL 2: DUET SHARE STUDIO & WATERMARK EXPORT */}
      {activeShareData && (
        <DuetShareStudioModal
          isOpen={isShareStudioOpen}
          onClose={() => {
            setIsShareStudioOpen(false);
            setActiveShareData(null);
          }}
          capsule={activeShareData.capsule}
          reactionVideoUrl={activeShareData.reactionVideoUrl}
          reactionVideoBlob={activeShareData.reactionVideoBlob}
          initialLayout={activeShareData.layout}
          initialFilter={activeShareData.filter}
          isBlindReaction={activeShareData.isBlindReaction}
          onPublishToCommunity={handlePublishDuet}
        />
      )}

      {/* MODAL 3: DUET SHOWCASE & WATCHER */}
      {selectedDuetForShowcase && (
        <DuetShowcaseModal
          isOpen={!!selectedDuetForShowcase}
          onClose={() => setSelectedDuetForShowcase(null)}
          duet={selectedDuetForShowcase}
          onRecordNewDuet={(capsuleId) => {
            const cap = capsules.find(c => c.id === capsuleId) || capsules[0];
            setSelectedDuetForShowcase(null);
            handleOpenDuetRecorder(cap);
          }}
        />
      )}

      {/* MODAL 4: RECORD NEW TIME-LOCKED CAPSULE */}
      <NewCapsuleModal
        isOpen={isNewCapsuleOpen}
        onClose={() => setIsNewCapsuleOpen(false)}
        onCapsuleCreated={handleCapsuleCreated}
      />

      {/* MODAL 5: TIME BOMB GROUP UNBOXING */}
      {selectedTimeBomb && (
        <TimeBombUnboxModal
          isOpen={!!selectedTimeBomb}
          onClose={() => setSelectedTimeBomb(null)}
          challenge={selectedTimeBomb}
          onDuetMember={(memCap) => {
            setSelectedTimeBomb(null);
            handleOpenDuetRecorder(memCap);
          }}
        />
      )}

      {/* MODAL 6: CREATE GROUP TIME-CAPSULE */}
      <NewGroupCapsuleModal
        isOpen={isNewGroupModalOpen}
        onClose={() => setIsNewGroupModalOpen(false)}
        onGroupChallengeCreated={(newChallenge) => {
          setTimeBombs([newChallenge, ...timeBombs]);
          setTimeBombsJoinedCount(prev => prev + 1);
          setActiveTab('timebombs');
        }}
      />

      {/* MODAL 7: CAPSULE RECAP STORY GENERATOR (INSTAGRAM 9:16) */}
      <CapsuleRecapModal
        isOpen={isRecapModalOpen}
        onClose={() => setIsRecapModalOpen(false)}
        userStats={{
          userName: "Alex R.",
          userHandle: "@you",
          userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
          totalCapsules: userCapsulesCount,
          totalDuets: userDuetsCount,
          blindReactions: blindReactionsCount,
          predictionBets: predictionBetsCount,
          unlockedBadges: [
            { name: 'Time Traveler', tier: userCapsulesCount >= 5 ? 'gold' : 'bronze', icon: 'clock' },
            { name: 'Reaction King', tier: userDuetsCount >= 10 ? 'neon' : 'silver', icon: 'flame' },
            { name: 'Raw Instinct', tier: blindReactionsCount >= 3 ? 'silver' : 'bronze', icon: 'eye' }
          ],
          rankTitle: userCapsulesCount >= 4 ? 'Master Chrononaut' : 'Time Voyager'
        }}
      />

      {/* MODAL 8: PRO UPGRADE & REVENUE CHECKOUT */}
      <ProUpgradeModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        userEmail={currentUser?.email || 'darvar.DVA@gmail.com'}
      />

      {/* MODAL 9: AI WISH VISION & SHORT VIDEO MANIFESTOR */}
      <AIWishVisionModal
        isOpen={isAIWishModalOpen}
        onClose={() => setIsAIWishModalOpen(false)}
        userPoints={userPoints}
        onAddPoints={handleAddPoints}
        userEmail={currentUser?.email || 'darvar.DVA@gmail.com'}
      />

    </div>
  );
}
