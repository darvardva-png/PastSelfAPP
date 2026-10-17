import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Users, 
  Clock, 
  Video, 
  Sparkles, 
  Plus, 
  Trash2, 
  Check, 
  Copy, 
  ArrowRight, 
  ShieldCheck, 
  Lock,
  Briefcase,
  Smile,
  Palette
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GroupChallenge, GroupParticipant } from '../types';
import { createMockCameraStream } from '../utils/videoDuetEngine';
import { sfx } from '../utils/audioFX';

interface NewGroupCapsuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupChallengeCreated: (challenge: GroupChallenge) => void;
}

export const NewGroupCapsuleModal: React.FC<NewGroupCapsuleModalProps> = ({
  isOpen,
  onClose,
  onGroupChallengeCreated
}) => {
  const [step, setStep] = useState<'details' | 'members' | 'record' | 'share'>('details');
  const [groupType, setGroupType] = useState<'friends' | 'team' | 'creators'>('friends');
  const [title, setTitle] = useState('2028 Crew Predictions');
  const [prompt, setPrompt] = useState('Where will each person be in 2 years, what will your job title be, and who changed the most?');
  const [lockYears, setLockYears] = useState(2);

  // Members list
  const [members, setMembers] = useState<GroupParticipant[]>([
    {
      name: 'You',
      role: 'Creator / Team Lead',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      hasRecorded: false
    },
    {
      name: 'Sarah',
      role: 'Product Designer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      hasRecorded: false
    },
    {
      name: 'Marcus',
      role: 'Staff Engineer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      hasRecorded: false
    }
  ]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedSeconds, setRecordedSeconds] = useState(0);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null);
  const [useSimulatedCam, setUseSimulatedCam] = useState(false);
  const [inviteCode] = useState(`VAULT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`);
  const [copiedInvite, setCopiedInvite] = useState(false);

  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setStep('details');
      setRecordedBlobUrl(null);
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    if (step === 'record') {
      startCamera();
    } else {
      stopCamera();
    }
  }, [step, useSimulatedCam]);

  const startCamera = async () => {
    try {
      if (useSimulatedCam) {
        const stream = createMockCameraStream();
        mediaStreamRef.current = stream;
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = stream;
          videoPreviewRef.current.play().catch(() => {});
        }
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true
      });
      mediaStreamRef.current = stream;
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play().catch(() => {});
      }
    } catch {
      setUseSimulatedCam(true);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    const avatars = [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
    ];
    setMembers([
      ...members,
      {
        name: newMemberName.trim(),
        role: newMemberRole.trim() || (groupType === 'team' ? 'Team Member' : 'Friend'),
        avatar: avatars[members.length % avatars.length],
        hasRecorded: false
      }
    ]);
    setNewMemberName('');
    setNewMemberRole('');
  };

  const handleRemoveMember = (index: number) => {
    if (members[index].name === 'You') return;
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleStartRecord = () => {
    if (!mediaStreamRef.current) return;
    recordedChunksRef.current = [];
    sfx.countdownBeep(true);

    try {
      const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';
      const recorder = new MediaRecorder(mediaStreamRef.current, { mimeType: mime });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedBlobUrl(url);
        sfx.unlockChime();
        setStep('share');
      };

      recorder.start(100);
      setIsRecording(true);
      setRecordedSeconds(0);

      timerRef.current = window.setInterval(() => {
        setRecordedSeconds((prev) => {
          if (prev >= 30) {
            handleStopRecord();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      setIsRecording(true);
    }
  };

  const handleStopRecord = () => {
    if (!isRecording) return;
    setIsRecording(false);
    sfx.shutterClick();
    if (timerRef.current) clearInterval(timerRef.current);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      setRecordedBlobUrl('https://assets.mixkit.co/videos/preview/mixkit-blogger-talking-to-camera-at-home-42778-large.mp4');
      setStep('share');
    }
  };

  const handleCopyInvite = () => {
    const inviteText = `🚀 You've been invited to our PastSelf Group Time Capsule: "${title}"!\n\nLocked until Oct ${2026 + lockYears}. Record your video answer before the vault seals!\n\nJoin code: ${inviteCode}\nLink: https://pastself.app/group/${inviteCode}`;
    navigator.clipboard.writeText(inviteText);
    setCopiedInvite(true);
    sfx.shutterClick();
    setTimeout(() => setCopiedInvite(false), 2500);
  };

  const handleFinishGroupCreation = () => {
    sfx.unlockChime();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });

    // Update 'You' participant as recorded
    const finalParticipants = members.map(m => {
      if (m.name === 'You') {
        return {
          ...m,
          hasRecorded: true,
          unlockedVideoUrl: recordedBlobUrl || 'https://assets.mixkit.co/videos/preview/mixkit-blogger-talking-to-camera-at-home-42778-large.mp4',
          recordedDate: 'Oct 16, 2026'
        };
      }
      return m;
    });

    const newGroupChallenge: GroupChallenge = {
      id: `group-${Date.now()}`,
      title,
      prompt,
      groupType,
      inviteCode,
      createdDate: 'Oct 2026',
      unlockDate: `Oct ${2026 + lockYears}`,
      participants: finalParticipants,
      isUnlocked: false,
      daysRemaining: lockYears * 365
    };

    onGroupChallengeCreated(newGroupChallenge);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col my-auto overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Create Group Time-Capsule</h3>
                <span className="text-[10px] font-mono-code bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-bold">
                  Friends & Teams
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Record collaborative predictions with friends or colleagues, locked until a future date
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

        {/* STEP 1: GROUP DETAILS */}
        {step === 'details' && (
          <div className="p-6 space-y-4">
            
            {/* Group Type Selector */}
            <div>
              <label className="text-[11px] font-mono-code uppercase font-bold text-neutral-400 block mb-1.5">
                Group Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'friends', label: 'Friends Crew', icon: Smile },
                  { id: 'team', label: 'Work / Startup Team', icon: Briefcase },
                  { id: 'creators', label: 'Creative Studio', icon: Palette }
                ].map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setGroupType(t.id as typeof groupType)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                        groupType === t.id
                          ? 'bg-amber-500/20 border-amber-500/70 text-white shadow-md'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-1 text-amber-400" />
                      <span className="text-xs font-bold">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-[11px] font-mono-code uppercase font-bold text-neutral-400 block mb-1">
                Group Capsule Name
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Design Team 2028 Prophecy"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Prompt */}
            <div>
              <label className="text-[11px] font-mono-code uppercase font-bold text-neutral-400 block mb-1">
                Group Challenge Prompt (What should everyone answer in their video?)
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={2}
                placeholder="Ask a question everyone in the group answers..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="text-[11px] font-mono-code uppercase font-bold text-neutral-400 block mb-2">
                Lock Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 5].map((yrs) => (
                  <button
                    key={yrs}
                    onClick={() => setLockYears(yrs)}
                    className={`py-2 px-3 rounded-xl border text-center text-xs font-bold transition-all ${
                      lockYears === yrs
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {yrs} Year{yrs > 1 ? 's' : ''} ({2026 + yrs})
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep('members')}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Next: Add Group Members</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: MEMBERS ROSTER */}
        {step === 'members' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-code text-neutral-400">
                TEAM / CREW ROSTER ({members.length})
              </span>
              <span className="text-[11px] font-mono-code text-amber-400">
                Everyone gets their own time capsule slot
              </span>
            </div>

            {/* Member List */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {members.map((m, i) => (
                <div 
                  key={i}
                  className="flex items-center justify-between bg-neutral-950 p-2.5 rounded-xl border border-neutral-800"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-neutral-800" />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{m.name}</span>
                        {m.name === 'You' && <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 rounded">Host</span>}
                      </div>
                      <div className="text-[10px] text-neutral-400">{m.role}</div>
                    </div>
                  </div>

                  {m.name !== 'You' && (
                    <button
                      onClick={() => handleRemoveMember(i)}
                      className="p-1 text-neutral-500 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Member Form */}
            <form onSubmit={handleAddMember} className="flex gap-2 pt-1">
              <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Friend or Teammate name"
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
              <input
                type="text"
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value)}
                placeholder="Role / Title (optional)"
                className="w-36 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs"
              >
                Add
              </button>
            </form>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setStep('details')}
                className="px-4 py-3 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => setStep('record')}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Record Your Video Submission</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: RECORD GROUP VIDEO SUBMISSION */}
        {step === 'record' && (
          <div className="p-5 flex flex-col items-center">
            
            <div className="relative w-full max-w-[320px] aspect-[9/16] rounded-2xl overflow-hidden border border-neutral-800 bg-black shadow-2xl">
              <video
                ref={videoPreviewRef}
                playsInline
                autoPlay
                muted
                className="w-full h-full object-cover -scale-x-100"
              />

              {/* Group HUD */}
              <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-500/40 text-[10px] font-mono-code font-bold text-amber-300">
                TEAM VAULT ● {title}
              </div>

              {isRecording && (
                <div className="absolute top-3 right-3 bg-red-600 text-white font-mono-code font-bold text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                  REC {recordedSeconds}s
                </div>
              )}

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-3 py-0.5 rounded-full border border-neutral-800 text-[10px] font-display font-bold text-neutral-300">
                #PastSelfApp Group
              </div>
            </div>

            {/* Prompt Reminder */}
            <div className="mt-3 text-center max-w-sm">
              <span className="text-[10px] font-mono-code text-amber-400 font-bold uppercase">Your Group Prompt:</span>
              <p className="text-xs text-neutral-300 font-medium line-clamp-2 mt-0.5">&ldquo;{prompt}&rdquo;</p>
            </div>

            {/* Controls */}
            <div className="mt-4 flex items-center gap-3">
              {!isRecording ? (
                <button
                  onClick={handleStartRecord}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-bold text-xs shadow-xl flex items-center gap-2 active:scale-95"
                >
                  <span className="w-3 h-3 rounded-full bg-white"></span>
                  <span>Record Video for Group</span>
                </button>
              ) : (
                <button
                  onClick={handleStopRecord}
                  className="px-6 py-3 rounded-full bg-red-600 text-white font-bold text-xs shadow-xl flex items-center gap-2 active:scale-95 animate-pulse"
                >
                  <span className="w-3 h-3 rounded-sm bg-white"></span>
                  <span>Stop & Next</span>
                </button>
              )}

              <button
                onClick={() => setUseSimulatedCam(!useSimulatedCam)}
                className="text-[10px] font-mono-code px-3 py-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
              >
                {useSimulatedCam ? 'Sim Cam' : 'Webcam'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SHARE & SEAL GROUP TIME-BOMB */}
        {step === 'share' && (
          <div className="p-6 space-y-5">
            <div className="text-center">
              <div className="w-14 h-14 rounded-3xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3 border border-amber-500/30">
                <Lock className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-white">Your Video is Sealed in the Group Vault!</h4>
              <p className="text-xs text-neutral-300 mt-1 max-w-sm mx-auto">
                Now invite your team or friends so they can add their video before it locks until Oct {2026 + lockYears}!
              </p>
            </div>

            {/* Invite Code Box */}
            <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono-code">
                <span className="text-neutral-400">Secret Vault Code:</span>
                <span className="text-amber-400 font-bold tracking-widest">{inviteCode}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono-code">
                <span className="text-neutral-400">Lock Duration:</span>
                <span className="text-white font-bold">{lockYears} Years (Unlocks 202{6 + lockYears})</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono-code">
                <span className="text-neutral-400">Members in Group:</span>
                <span className="text-white font-bold">{members.length}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleCopyInvite}
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs border border-neutral-700 transition-colors flex items-center justify-center gap-2 active:scale-95"
              >
                {copiedInvite ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
                <span>{copiedInvite ? 'Invite Copied!' : 'Copy Group Invite Message for Slack / WhatsApp'}</span>
              </button>

              <button
                onClick={handleFinishGroupCreation}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch Group Time-Bomb Capsule</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
