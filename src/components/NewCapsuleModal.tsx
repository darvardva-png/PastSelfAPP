import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Clock, 
  Lock, 
  Sparkles, 
  Video, 
  HelpCircle, 
  Mic, 
  MicOff, 
  Check, 
  ArrowRight,
  Flame,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PastSelfCapsule } from '../types';
import { DAILY_PROMPTS } from '../data/mockData';
import { createMockCameraStream } from '../utils/videoDuetEngine';
import { sfx } from '../utils/audioFX';

interface NewCapsuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapsuleCreated: (capsule: PastSelfCapsule) => void;
}

export const NewCapsuleModal: React.FC<NewCapsuleModalProps> = ({
  isOpen,
  onClose,
  onCapsuleCreated
}) => {
  const [step, setStep] = useState<'prompt' | 'record' | 'lock'>('prompt');
  const [prompt, setPrompt] = useState<string>(DAILY_PROMPTS[0]);
  const [customTitle, setCustomTitle] = useState<string>('Message to My Future Self');
  const [lockDurationYears, setLockDurationYears] = useState<number>(2);
  const [predictionQuestion, setPredictionQuestion] = useState<string>('Will I have reached my dream milestone?');
  const [predictionAnswer, setPredictionAnswer] = useState<string>('Yes, absolutely confident!');
  const [confidence, setConfidence] = useState<number>(85);

  // Recorder states
  const [isRecording, setIsRecording] = useState(false);
  const [recordedSeconds, setRecordedSeconds] = useState(0);
  const [useSimulatedCam, setUseSimulatedCam] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null);

  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      cleanupCamera();
      setStep('prompt');
      setRecordedBlobUrl(null);
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    if (step === 'record') {
      startCamera();
    } else {
      cleanupCamera();
    }
  }, [step, useSimulatedCam]);

  const startCamera = async () => {
    try {
      if (useSimulatedCam) {
        const sim = createMockCameraStream();
        mediaStreamRef.current = sim;
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = sim;
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

  const cleanupCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
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
        setStep('lock');
        sfx.unlockChime();
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
      setRecordedBlobUrl('https://assets.mixkit.co/videos/preview/mixkit-young-man-talking-at-home-with-casual-clothes-42776-large.mp4');
      setStep('lock');
    }
  };

  const handleFinishVaulting = () => {
    sfx.unlockChime();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });

    const unlockYear = 2026 + lockDurationYears;
    const newCapsule: PastSelfCapsule = {
      id: `capsule-${Date.now()}`,
      creatorName: 'You',
      creatorHandle: '@you',
      creatorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      title: customTitle,
      prompt: prompt,
      recordedDate: 'Oct 16, 2026',
      unlockDate: `Oct 16, ${unlockYear}`,
      yearsAgo: lockDurationYears,
      durationSeconds: recordedSeconds || 15,
      videoUrl: recordedBlobUrl || 'https://assets.mixkit.co/videos/preview/mixkit-blogger-talking-to-camera-at-home-42778-large.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&auto=format&fit=crop&q=80',
      isUnlocked: false,
      daysRemaining: lockDurationYears * 365,
      isFriend: false,
      prediction: {
        question: predictionQuestion,
        prediction: predictionAnswer,
        confidence: confidence,
        resolved: false,
        outcome: 'pending'
      },
      duetCount: 0,
      reactionsCount: 1,
      tags: ['FutureSelf', `${lockDurationYears}YearsLater`, 'Vaulted']
    };

    onCapsuleCreated(newCapsule);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden my-auto">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Record Time-Locked Capsule</h3>
              <p className="text-[11px] text-neutral-400">Lock a video message & prediction for your future self</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Prompt & Question Setup */}
        {step === 'prompt' && (
          <div className="p-6 space-y-4">
            <div>
              <label className="text-[11px] font-mono-code uppercase font-bold text-neutral-400 block mb-1">
                Capsule Title
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono-code uppercase font-bold text-neutral-400 block mb-1">
                Micro-Prompt Inspiration
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={2}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500 resize-none"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {DAILY_PROMPTS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(p)}
                    className="text-[10px] font-medium px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-rose-300 hover:border-rose-500/40 transition-all text-left"
                  >
                    {p.slice(0, 36)}...
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setStep('record')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Continue to Camera</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Camera Recorder */}
        {step === 'record' && (
          <div className="p-4 sm:p-6 flex flex-col items-center">
            <div className="relative w-full max-w-[340px] aspect-[9/16] rounded-2xl overflow-hidden border border-neutral-800 bg-black shadow-2xl">
              <video
                ref={videoPreviewRef}
                playsInline
                autoPlay
                muted
                className="w-full h-full object-cover -scale-x-100"
              />

              {/* Timestamp HUD */}
              <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-rose-500/40 text-[10px] font-mono-code font-bold text-rose-300">
                OCT 16 2026 ● LIVE
              </div>

              {isRecording && (
                <div className="absolute top-3 right-3 bg-red-600 text-white font-mono-code font-bold text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                  REC {recordedSeconds}s
                </div>
              )}

              {/* Watermark Tag */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-3 py-0.5 rounded-full border border-neutral-800 text-[10px] font-display font-bold text-neutral-300">
                #PastSelfApp
              </div>
            </div>

            {/* Prompt HUD overlay during recording */}
            <div className="mt-3 text-center max-w-sm">
              <span className="text-[10px] font-mono-code text-rose-400 font-bold uppercase">Prompt:</span>
              <p className="text-xs text-neutral-300 font-medium line-clamp-2 mt-0.5">&ldquo;{prompt}&rdquo;</p>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex items-center gap-4">
              {!isRecording ? (
                <button
                  onClick={handleStartRecord}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-xs shadow-xl shadow-rose-500/30 flex items-center gap-2 active:scale-95"
                >
                  <span className="w-3 h-3 rounded-full bg-white"></span>
                  <span>Start Recording</span>
                </button>
              ) : (
                <button
                  onClick={handleStopRecord}
                  className="px-6 py-3 rounded-full bg-red-600 text-white font-bold text-xs shadow-xl shadow-red-600/40 flex items-center gap-2 active:scale-95 animate-pulse"
                >
                  <span className="w-3 h-3 rounded-sm bg-white"></span>
                  <span>Stop & Next</span>
                </button>
              )}

              <button
                onClick={() => setUseSimulatedCam(!useSimulatedCam)}
                className="text-[10px] font-mono-code px-3 py-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700"
              >
                {useSimulatedCam ? 'Sim Cam' : 'Webcam'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Set Time-Lock & Future Prediction Bet */}
        {step === 'lock' && (
          <div className="p-6 space-y-5">
            <div>
              <label className="text-[11px] font-mono-code uppercase font-bold text-neutral-400 block mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Select Time-Lock Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 5].map((yrs) => (
                  <button
                    key={yrs}
                    onClick={() => setLockDurationYears(yrs)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      lockDurationYears === yrs
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-lg shadow-amber-500/10'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div className="text-base font-display font-black">{yrs} Year{yrs > 1 ? 's' : ''}</div>
                    <div className="text-[9px] font-mono-code text-neutral-400">Unlock: {2026 + yrs}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Future Prediction Bet */}
            <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-mono-code text-xs font-bold">
                <HelpCircle className="w-4 h-4" />
                <span>Place a Prediction Bet on Your Future Self</span>
              </div>

              <div>
                <label className="text-[10px] font-mono-code text-neutral-400 block mb-1">
                  What question are you asking future you?
                </label>
                <input
                  type="text"
                  value={predictionQuestion}
                  onChange={(e) => setPredictionQuestion(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono-code text-neutral-400 block mb-1">
                  Your prediction / answer right now:
                </label>
                <input
                  type="text"
                  value={predictionAnswer}
                  onChange={(e) => setPredictionAnswer(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] font-mono-code text-neutral-400 mb-1">
                  <span>Confidence Level</span>
                  <span className="text-amber-400 font-bold">{confidence}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={confidence}
                  onChange={(e) => setConfidence(Number(e.target.value))}
                  className="w-full accent-amber-400 h-1 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={handleFinishVaulting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-display font-bold text-sm shadow-xl shadow-amber-500/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Seal into Time Vault (Unlocks Oct {2026 + lockDurationYears})</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
