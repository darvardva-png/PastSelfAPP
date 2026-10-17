import React from 'react';
import { Sparkles, Plus, Clock, Users, Flame, Lock, Crown, LogIn, LogOut, Globe } from 'lucide-react';
import { User } from '../firebase';
import { Language, Translations } from '../i18n/translations';

interface NavigationProps {
  activeTab: 'feed' | 'duets' | 'timebombs' | 'vault';
  setActiveTab: (tab: 'feed' | 'duets' | 'timebombs' | 'vault') => void;
  onOpenNewCapsule: () => void;
  onOpenQuickDuet: () => void;
  onOpenProModal: () => void;
  onOpenAIWish: () => void;
  userPoints: number;
  currentUser: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  unlockedCount: number;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  t: Translations;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewCapsule,
  onOpenQuickDuet,
  onOpenProModal,
  onOpenAIWish,
  userPoints,
  currentUser,
  onSignIn,
  onSignOut,
  unlockedCount,
  currentLanguage,
  onLanguageChange,
  t
}) => {
  return (
    <header className="sticky top-0 z-40 bg-neutral-950/85 backdrop-blur-xl border-b border-neutral-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={() => setActiveTab('feed')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-rose-500/25 group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5 text-white animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 
                onClick={() => setActiveTab('feed')}
                className="font-display text-xl font-black tracking-tight text-white cursor-pointer hover:text-rose-400 transition-colors"
              >
                PAST<span className="text-rose-500">SELF</span>
              </h1>
              <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                {t.duetEngine}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Navigation Tabs Desktop */}
        <nav className="hidden md:flex items-center gap-1 bg-neutral-900/80 p-1 rounded-2xl border border-neutral-800">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'feed'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            {t.capsulesTab}
            {unlockedCount > 0 && (
              <span className="bg-rose-500/20 text-rose-400 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {unlockedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('duets')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'duets'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            {t.duetsTab}
          </button>

          <button
            onClick={() => setActiveTab('timebombs')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'timebombs'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-amber-400" />
            {t.timebombsTab}
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'vault'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            {t.vaultTab}
          </button>
        </nav>

        {/* Action Buttons & Language Switcher */}
        <div className="flex items-center gap-2">
          
          {/* Language Selector */}
          <div className="flex items-center bg-neutral-900/90 rounded-xl border border-neutral-800 p-0.5 text-[11px] font-mono-code font-bold">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 rounded-lg transition-all ${
                currentLanguage === 'en' 
                  ? 'bg-rose-500 text-white shadow-sm' 
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('es')}
              className={`px-2 py-1 rounded-lg transition-all ${
                currentLanguage === 'es' 
                  ? 'bg-rose-500 text-white shadow-sm' 
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Español"
            >
              ES
            </button>
            <button
              onClick={() => onLanguageChange('pt')}
              className={`px-2 py-1 rounded-lg transition-all ${
                currentLanguage === 'pt' 
                  ? 'bg-rose-500 text-white shadow-sm' 
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Português"
            >
              PT
            </button>
          </div>

          {/* AI Wishes Trigger with Points Pill */}
          <button
            onClick={onOpenAIWish}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500/20 via-rose-500/20 to-amber-500/20 hover:from-purple-500/30 hover:to-amber-500/30 text-rose-300 hover:text-white font-bold text-xs border border-rose-500/30 shadow-sm transition-all active:scale-95 group"
            title="Turn Wishes into Videos & Earn Chrono Points"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-400 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">{t.aiWishesNav}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono-code text-[10px]">
              {userPoints}p
            </span>
          </button>

          {/* Pro Upgrade Trigger */}
          <button
            onClick={onOpenProModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-rose-500/20 hover:from-amber-500/30 hover:to-rose-500/30 text-amber-300 font-bold text-xs border border-amber-500/30 shadow-sm transition-all active:scale-95"
            title="PastSelf Chrono Pass Pro"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{t.proPass}</span>
          </button>

          <button
            onClick={onOpenQuickDuet}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 transition-all active:scale-95"
            title="Record a Blind Reaction or Duet to a friend's video"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">{t.recordDuet}</span>
            <span className="sm:hidden">{t.recordDuet.split(' ')[0]}</span>
          </button>

          <button
            onClick={onOpenNewCapsule}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white font-semibold text-xs border border-neutral-800 hover:border-neutral-700 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">{t.newTimeLock}</span>
          </button>

          {/* User Google Authentication */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-1 border-l border-neutral-800">
              <img
                src={currentUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                alt={currentUser.displayName || 'User'}
                className="w-8 h-8 rounded-full ring-2 ring-emerald-500/50 object-cover"
                title={`Signed in as ${currentUser.email}`}
              />
              <button
                onClick={onSignOut}
                className="p-1.5 text-neutral-400 hover:text-rose-400 rounded-lg hover:bg-neutral-900 transition-colors"
                title={t.signOut}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs border border-neutral-700 transition-all"
              title={t.signIn}
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{t.signIn}</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="md:hidden flex items-center justify-around border-t border-neutral-900 bg-neutral-950/95 py-2 px-3">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center text-[10px] font-medium ${
            activeTab === 'feed' ? 'text-rose-400' : 'text-neutral-400'
          }`}
        >
          <Flame className="w-4 h-4 mb-1" />
          {t.capsulesTab.split(' ')[0]}
        </button>

        <button
          onClick={() => setActiveTab('duets')}
          className={`flex flex-col items-center text-[10px] font-medium ${
            activeTab === 'duets' ? 'text-purple-400' : 'text-neutral-400'
          }`}
        >
          <Sparkles className="w-4 h-4 mb-1" />
          {t.duetsTab}
        </button>

        <button
          onClick={() => setActiveTab('timebombs')}
          className={`flex flex-col items-center text-[10px] font-medium ${
            activeTab === 'timebombs' ? 'text-amber-400' : 'text-neutral-400'
          }`}
        >
          <Users className="w-4 h-4 mb-1" />
          {t.timebombsTab}
        </button>

        <button
          onClick={() => setActiveTab('vault')}
          className={`flex flex-col items-center text-[10px] font-medium ${
            activeTab === 'vault' ? 'text-emerald-400' : 'text-neutral-400'
          }`}
        >
          <Lock className="w-4 h-4 mb-1" />
          {t.vaultTab}
        </button>
      </div>
    </header>
  );
};
