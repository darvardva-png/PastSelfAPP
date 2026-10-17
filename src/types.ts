export type SplitLayout = 'stacked-vertical' | 'side-by-side' | 'pip';

export type VideoFilter = 'normal' | 'vhs' | 'y2k' | 'cyberpunk' | 'monochrome' | 'warm-nostalgia';

export interface PredictionBet {
  question: string;
  prediction: string;
  confidence: number; // 0 to 100
  resolved?: boolean;
  outcome?: 'correct' | 'wrong' | 'pending';
}

export interface PastSelfCapsule {
  id: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  title: string;
  prompt: string;
  recordedDate: string; // e.g. "2023-10-14"
  unlockDate: string;   // e.g. "2026-10-16"
  yearsAgo: number;
  durationSeconds: number;
  videoUrl: string; // Video URL or data URI
  thumbnailUrl: string;
  isUnlocked: boolean;
  daysRemaining?: number;
  isFriend: boolean;
  prediction?: PredictionBet;
  groupChallengeId?: string;
  groupChallengeTitle?: string;
  duetCount: number;
  reactionsCount: number;
  tags: string[];
}

export interface DuetReaction {
  id: string;
  capsuleId: string;
  capsuleTitle: string;
  reactorName: string;
  reactorHandle: string;
  reactorAvatar: string;
  recordedDate: string;
  pastVideoUrl: string;
  reactionVideoUrl: string;
  layout: SplitLayout;
  filter: VideoFilter;
  pastSelfTimestamp: string;
  reactionTimestamp: string;
  reactionComment: string;
  likes: number;
  hasLiked?: boolean;
  shares: number;
  watermarkText: string;
  isBlindReaction: boolean;
}

export interface GroupParticipant {
  id?: string;
  name: string;
  role?: string;
  avatar: string;
  hasRecorded: boolean;
  unlockedVideoUrl?: string;
  recordedDate?: string;
  prediction?: string;
}

export interface GroupChallenge {
  id: string;
  title: string;
  prompt: string;
  groupType: 'friends' | 'team' | 'family' | 'creators';
  inviteCode?: string;
  createdDate: string;
  unlockDate: string;
  participants: GroupParticipant[];
  isUnlocked: boolean;
  daysRemaining: number;
}
