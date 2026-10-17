import { PastSelfCapsule, DuetReaction, GroupChallenge } from '../types';

export const INITIAL_CAPSULES: PastSelfCapsule[] = [
  {
    id: 'capsule-1',
    creatorName: 'Elena Vance',
    creatorHandle: '@elena_v',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    title: 'Did I finally quit marketing for pottery?',
    prompt: 'What major life leap are you terrified to take right now?',
    recordedDate: 'Oct 14, 2023',
    unlockDate: 'Oct 14, 2026',
    yearsAgo: 3,
    durationSeconds: 18,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-talking-to-camera-in-a-studio-41724-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    isUnlocked: true,
    isFriend: true,
    prediction: {
      question: 'Will Elena quit corporate to run a ceramics studio full time?',
      prediction: 'Yes, with at least 50 handmade mugs sold!',
      confidence: 85,
      resolved: true,
      outcome: 'correct'
    },
    duetCount: 24,
    reactionsCount: 1420,
    tags: ['CareerChange', 'PotteryDream', '3YearsLater', 'BlindReaction']
  },
  {
    id: 'capsule-2',
    creatorName: 'Marcus Chen',
    creatorHandle: '@marcus_c',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'The Group Chat 2-Year Prophecy',
    prompt: 'Predict where everyone in the crew will be in 2 years!',
    recordedDate: 'Sep 20, 2024',
    unlockDate: 'Oct 16, 2026',
    yearsAgo: 2,
    durationSeconds: 22,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-talking-to-the-camera-in-a-park-42777-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
    isUnlocked: true,
    isFriend: true,
    prediction: {
      question: 'Who in the crew gets married first?',
      prediction: 'Liam & Maya (no way they last 2 years without a ring)',
      confidence: 90,
      resolved: false,
      outcome: 'pending'
    },
    duetCount: 19,
    reactionsCount: 980,
    tags: ['GroupChat', 'FriendPredictions', 'BettingOnFriends', 'TimeBomb']
  },
  {
    id: 'capsule-3',
    creatorName: 'Chloe Moreau',
    creatorHandle: '@chloe_m',
    creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    title: 'Adopted the Golden Retriever or still allergic?',
    prompt: 'Current pet obsessions & apartment compromises',
    recordedDate: 'Nov 02, 2025',
    unlockDate: 'Oct 16, 2026',
    yearsAgo: 1,
    durationSeconds: 15,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-to-camera-on-a-sunny-day-42779-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80',
    isUnlocked: true,
    isFriend: true,
    prediction: {
      question: 'Did landlord let me keep a 60lb dog?',
      prediction: 'Probably had to move to Brooklyn to make it happen',
      confidence: 70,
      resolved: true,
      outcome: 'correct'
    },
    duetCount: 38,
    reactionsCount: 2310,
    tags: ['PuppySearch', 'BlindDuet', 'NewYorkLife']
  },
  {
    id: 'capsule-4',
    creatorName: 'David "Spike" Miller',
    creatorHandle: '@dave_spike',
    creatorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    title: 'Crypto top buyer confessions 🤡',
    prompt: 'What financial decision are you going to laugh at in 3 years?',
    recordedDate: 'May 10, 2023',
    unlockDate: 'Oct 15, 2026',
    yearsAgo: 3,
    durationSeconds: 20,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-talking-at-home-with-casual-clothes-42776-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
    isUnlocked: true,
    isFriend: true,
    prediction: {
      question: 'Will Bitcoin reach $180,000 before this unlocks?',
      prediction: 'We will all be driving CyberTrucks on Mars',
      confidence: 99,
      resolved: true,
      outcome: 'wrong'
    },
    duetCount: 84,
    reactionsCount: 5620,
    tags: ['CryptoRegrets', 'PastMeWasWild', 'LaughThroughThePain']
  },
  {
    id: 'capsule-5',
    creatorName: 'You (Past Self)',
    creatorHandle: '@you',
    creatorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    title: 'My 2024 New Years Resolutions vs Reality',
    prompt: 'Tell your 2026 self what habits you swore to stick to!',
    recordedDate: 'Jan 01, 2024',
    unlockDate: 'Oct 16, 2026',
    yearsAgo: 2,
    durationSeconds: 19,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-blogger-talking-to-camera-at-home-42778-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&auto=format&fit=crop&q=80',
    isUnlocked: true,
    isFriend: false,
    prediction: {
      question: 'Ran a half marathon before 2026?',
      prediction: 'Yes, sub 2 hours 10 minutes!',
      confidence: 60,
      resolved: false,
      outcome: 'pending'
    },
    duetCount: 5,
    reactionsCount: 412,
    tags: ['PersonalVault', 'SelfDuet', 'BlindReaction']
  },
  {
    id: 'capsule-6',
    creatorName: 'Sophia Lin',
    creatorHandle: '@sophia_code',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Secret startup idea locked until 2027',
    prompt: 'What stealth project are you working on that nobody knows?',
    recordedDate: 'Oct 12, 2025',
    unlockDate: 'Oct 12, 2027',
    yearsAgo: 1,
    durationSeconds: 25,
    videoUrl: '',
    thumbnailUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    isUnlocked: false,
    daysRemaining: 361,
    isFriend: true,
    prediction: {
      question: 'Acquired or bootstrapped profitability?',
      prediction: 'Bootstrapped to $100k MRR without VC',
      confidence: 75,
      resolved: false,
      outcome: 'pending'
    },
    duetCount: 0,
    reactionsCount: 88,
    tags: ['TimeLocked', 'FutureFounder', 'Vaulted']
  }
];

export const INITIAL_DUETS: DuetReaction[] = [
  {
    id: 'duet-1',
    capsuleId: 'capsule-1',
    capsuleTitle: 'Did I finally quit marketing for pottery?',
    reactorName: 'Sarah Jenkins',
    reactorHandle: '@sarah_j',
    reactorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    recordedDate: 'Oct 15, 2026',
    pastVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-talking-to-camera-in-a-studio-41724-large.mp4',
    reactionVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-to-camera-on-a-sunny-day-42779-large.mp4',
    layout: 'side-by-side',
    filter: 'vhs',
    pastSelfTimestamp: 'Recorded 3 Years Ago (2023)',
    reactionTimestamp: 'Reaction: Today (2026)',
    reactionComment: 'YOU ACTUALLY DID IT ELENA!! I have your handmade mug in my kitchen right now 😭❤️ #PastSelfApp',
    likes: 342,
    hasLiked: false,
    shares: 89,
    watermarkText: '#PastSelfApp',
    isBlindReaction: true
  },
  {
    id: 'duet-2',
    capsuleId: 'capsule-4',
    capsuleTitle: 'Crypto top buyer confessions 🤡',
    reactorName: 'Dave (Present Self)',
    reactorHandle: '@dave_spike',
    reactorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    recordedDate: 'Oct 16, 2026',
    pastVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-talking-at-home-with-casual-clothes-42776-large.mp4',
    reactionVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-talking-to-the-camera-in-a-park-42777-large.mp4',
    layout: 'stacked-vertical',
    filter: 'y2k',
    pastSelfTimestamp: 'Past Dave (May 2023)',
    reactionTimestamp: 'Present Dave (Oct 2026)',
    reactionComment: 'Past me was so delusionally optimistic. Watching this in my 2011 Honda Civic. 💀 #PastSelfApp',
    likes: 812,
    hasLiked: true,
    shares: 310,
    watermarkText: '#PastSelfApp',
    isBlindReaction: true
  }
];

export const INITIAL_TIME_BOMBS: GroupChallenge[] = [
  {
    id: 'bomb-1',
    title: 'The College Housemate 3-Year Time Bomb',
    prompt: 'Where will everyone in the apartment be living, who is rich, and who got married?',
    groupType: 'friends',
    inviteCode: 'HOUSE-2026',
    createdDate: 'Oct 2023',
    unlockDate: 'Oct 16, 2026',
    isUnlocked: true,
    daysRemaining: 0,
    participants: [
      { name: 'Marcus', role: 'Roommate (Finance)', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', hasRecorded: true, unlockedVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-talking-to-the-camera-in-a-park-42777-large.mp4' },
      { name: 'Elena', role: 'Roommate (Design)', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', hasRecorded: true, unlockedVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-talking-to-camera-in-a-studio-41724-large.mp4' },
      { name: 'You', role: 'Roommate (Eng)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', hasRecorded: true, unlockedVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-blogger-talking-to-camera-at-home-42778-large.mp4' },
      { name: 'Liam', role: 'Roommate (Music)', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', hasRecorded: true, unlockedVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-talking-at-home-with-casual-clothes-42776-large.mp4' }
    ]
  },
  {
    id: 'bomb-2',
    title: 'Tech Founders 2028 Prophecy',
    prompt: 'What valuation will our startup be at and will AGI exist?',
    groupType: 'team',
    inviteCode: 'STARTUP-2028',
    createdDate: 'Jan 2026',
    unlockDate: 'Jan 2028',
    isUnlocked: false,
    daysRemaining: 442,
    participants: [
      { name: 'Sophia', role: 'CTO', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', hasRecorded: true },
      { name: 'Alex', role: 'CEO', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', hasRecorded: true },
      { name: 'You', role: 'Head of Product', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', hasRecorded: false }
    ]
  }
];

export const DAILY_PROMPTS = [
  "What song are you obsessively playing on repeat this week?",
  "Who is the person you talk to most every day right now?",
  "What is the single hardest problem currently keeping you awake at night?",
  "Predict the current price of Bitcoin, rent in your city, and your favorite meal.",
  "What advice would you give your self from 3 years ago?",
  "Show your current desk mess and explain one object on it."
];
