import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Video, 
  EyeOff, 
  Eye, 
  Columns, 
  Rows, 
  Layers, 
  Sparkles, 
  Mic, 
  MicOff, 
  RotateCcw, 
  HelpCircle,
  Clock,
  Play
} from 'lucide-react';
import { PastSelfCapsule, SplitLayout, VideoFilter } from '../types';
import { createMockCameraStream } from '../utils/videoDuetEngine';
import { sfx } from '../utils/audioFX';

interface DuetRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  capsule: PastSelfCapsule;
  onRecordingComplete: (duetData: {
    capsule: PastSelfCapsule;
    reactionVideoBlob: Blob | null;
    reactionVideoUrl: string;
    layout: SplitLayout;
    filter: VideoFilter;
    isBlindReaction: boolean;
  }) => void;
}

export const DuetRecorderModal: React.FC<DuetRecorderModalProps> = ({
  isOpen,
  onClose,
  capsule,
  onRecordingComplete
}) => {
  // Recorder states
  const [layout, setLayout] = useState<SplitLayout>('stacked-vertical');
  const [filter, setFilter] = useState<VideoFilter>('normal');
  const [isBlindReaction, setIsBlindReaction] = useState<boolean>(true);
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [countdownNum, setCountdownNum] = useState<number>(3);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedSeconds, setRecordedSeconds] = useState<number>(0);
  const [hasStartedPlayingPastVideo, setHasStartedPlayingPastVideo] = useState<boolean>(false);
  const [useSimulatedCam, setUseSimulatedCam] = useState<boolean>(false);
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Video refs
  const friendVideoRef = useRef<HTMLVideoElement>(null);
  const userCamPreviewRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);

  const MAX_DURATION = 30; // seconds

  // Initialize camera when modal opens
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    resetState();
    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, useSimulatedCam]);

  const resetState = () => {
    setIsRecording(false);
    setIsCountingDown(false);
    setRecordedSeconds(0);
    setHasStartedPlayingPastVideo(false);
    recordedChunksRef.current = [];
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (friendVideoRef.current) {
      friendVideoRef.current.currentTime = 0;
      friendVideoRef.current.pause();
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (useSimulatedCam) {
        const simStream = createMockCameraStream();
        mediaStreamRef.current = simStream;
        if (userCamPreviewRef.current) {
          userCamPreviewRef.current.srcObject = simStream;
          userCamPreviewRef.current.play().catch(() => {});
        }
        return;
      }

      // Real user camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true
      });
      mediaStreamRef.current = stream;
      if (userCamPreviewRef.current) {
        userCamPreviewRef.current.srcObject = stream;
        userCamPreviewRef.current.play().catch(() => {});
      }
    } catch {
      // Gracefully switch to simulated camera if user has no webcam or permission rejected
      setCameraError('Camera access not detected. Switched to Interactive React Cam Simulator.');
      setUseSimulatedCam(true);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (userCamPreviewRef.current) {
      userCamPreviewRef.current.srcObject = null;
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const handleStartCountdown = () => {
    if (isRecording || isCountingDown) return;

    setIsCountingDown(true);
    setCountdownNum(3);
    sfx.countdownBeep(false);

    let current = 3;
    const interval = window.setInterval(() => {
      current -= 1;
      if (current > 0) {
        setCountdownNum(current);
        sfx.countdownBeep(false);
      } else {
        clearInterval(interval);
        setIsCountingDown(false);
        sfx.countdownBeep(true);
        startRecording();
      }
    }, 1000);
  };

  const startRecording = () => {
    if (!mediaStreamRef.current) return;

    recordedChunksRef.current = [];
    try {
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';
      const recorder = new MediaRecorder(mediaStreamRef.current, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        handleRecordingFinished();
      };

      recorder.start(100);
      setIsRecording(true);
      setHasStartedPlayingPastVideo(true);

      // Start friend's video synchronously
      if (friendVideoRef.current) {
        friendVideoRef.current.currentTime = 0;
        friendVideoRef.current.play().catch(() => {});
      }

      // Start timer
      setRecordedSeconds(0);
      timerIntervalRef.current = window.setInterval(() => {
        setRecordedSeconds((prev) => {
          if (prev + 1 >= MAX_DURATION) {
            stopRecording();
            return MAX_DURATION;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      // Fallback
      setIsRecording(true);
      setHasStartedPlayingPastVideo(true);
      if (friendVideoRef.current) {
        friendVideoRef.current.currentTime = 0;
        friendVideoRef.current.play().catch(() => {});
      }
    }
  };

  const stopRecording = () => {
    if (!isRecording) return;
    setIsRecording(false);
    sfx.shutterClick();

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (friendVideoRef.current) {
      friendVideoRef.current.pause();
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      handleRecordingFinished();
    }
  };

  const handleRecordingFinished = () => {
    sfx.unlockChime();
    const blob = recordedChunksRef.current.length > 0 
      ? new Blob(recordedChunksRef.current, { type: 'video/webm' }) 
      : null;
    
    // Create an object URL or fallback to simulated video preview
    const videoUrl = blob 
      ? URL.createObjectURL(blob)
      : capsule.videoUrl;

    onRecordingComplete({
      capsule,
      reactionVideoBlob: blob,
      reactionVideoUrl: videoUrl,
      layout,
      filter,
      isBlindReaction
    });
  };

  const toggleMic = () => {
    if (mediaStreamRef.current) {
      const audioTracks = mediaStreamRef.current.getAudioTracks();
      audioTracks.forEach(t => {
        t.enabled = !t.enabled;
      });
      setIsMicMuted(!isMicMuted);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col max-h-[96vh] overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs border border-rose-500/30">
              ⚡
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Duet & Blind React to</span>
                <span className="text-rose-400">{capsule.creatorName}&apos;s Past Self</span>
              </h2>
              <p className="text-[11px] text-neutral-400">
                Recorded {capsule.yearsAgo} years ago ({capsule.recordedDate}) • Unlocked Today
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Blind Reaction Switch */}
            <button
              onClick={() => {
                if (!isRecording) setIsBlindReaction(!isBlindReaction);
              }}
              disabled={isRecording}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                isBlindReaction
                  ? 'bg-purple-950/60 text-purple-300 border-purple-500/40 shadow-sm shadow-purple-500/20'
                  : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-white'
              }`}
              title="Blind Reaction locks video until recording starts so your genuine reaction is captured"
            >
              {isBlindReaction ? <EyeOff className="w-3.5 h-3.5 text-purple-400" /> : <Eye className="w-3.5 h-3.5" />}
              <span>Blind Mode: {isBlindReaction ? 'ON' : 'OFF'}</span>
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              disabled={isRecording}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Split Screen Viewport Area */}
        <div className="relative flex-1 bg-black p-2 sm:p-4 flex items-center justify-center overflow-hidden min-h-[360px] sm:min-h-[460px]">
          
          {/* Main Dual Split Container */}
          <div 
            className={`w-full h-full max-h-[500px] rounded-2xl overflow-hidden border border-neutral-800/80 bg-neutral-950 flex relative shadow-2xl ${
              layout === 'stacked-vertical' ? 'flex-col max-w-[340px] sm:max-w-[360px] aspect-[9/16]' : 
              layout === 'side-by-side' ? 'flex-col sm:flex-row max-w-[720px] aspect-[16/9]' : 
              'relative max-w-[620px] aspect-[16/9]'
            }`}
          >
            {/* Friend's Past Self Video Frame */}
            <div className={`relative bg-neutral-900 overflow-hidden flex items-center justify-center ${
              layout === 'stacked-vertical' ? 'w-full h-1/2 border-b-2 border-rose-500/40' :
              layout === 'side-by-side' ? 'w-full sm:w-1/2 h-1/2 sm:h-full border-b sm:border-b-0 sm:border-r-2 border-rose-500/40' :
              'w-full h-full'
            }`}>
              <video
                ref={friendVideoRef}
                src={capsule.videoUrl}
                playsInline
                loop
                muted={false}
                className="w-full h-full object-cover"
              />

              {/* Blind Mode Frosted Mystery Shield */}
              {isBlindReaction && !hasStartedPlayingPastVideo && (
                <div className="absolute inset-0 bg-neutral-950/85 backdrop-blur-md flex flex-col items-center justify-center text-center p-4 z-20">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2 border border-purple-500/30">
                    <EyeOff className="w-6 h-6 animate-pulse" />
                  </div>
                  <h4 className="text-white font-bold text-xs sm:text-sm">Blind Reaction Locked</h4>
                  <p className="text-[11px] text-neutral-300 max-w-[220px] mt-1">
                    {capsule.creatorName}&apos;s video will unveil the second you start recording!
                  </p>
                  <div className="mt-3 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-[10px] font-mono-code text-rose-400">
                    Raw & Unscripted
                  </div>
                </div>
              )}

              {/* Stamp Badge: Past Self */}
              <div className="absolute top-2 left-2 z-10 bg-neutral-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-rose-500/40 flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                <span className="text-[10px] font-mono-code font-bold text-rose-300">
                  {capsule.creatorName} ({capsule.yearsAgo}y ago)
                </span>
              </div>

              {/* Watermark Tag */}
              <div className="absolute bottom-2 left-2 z-10 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] font-mono-code text-neutral-400">
                #PastSelfApp
              </div>
            </div>

            {/* Present Self Recording Camera Preview Frame */}
            <div className={`relative bg-neutral-950 overflow-hidden flex items-center justify-center ${
              layout === 'stacked-vertical' ? 'w-full h-1/2' :
              layout === 'side-by-side' ? 'w-full sm:w-1/2 h-1/2 sm:h-full' :
              'absolute bottom-3 right-3 w-32 h-44 sm:w-44 sm:h-56 rounded-xl border-2 border-rose-500 shadow-2xl z-20'
            }`}>
              <video
                ref={userCamPreviewRef}
                playsInline
                muted
                autoPlay
                className="w-full h-full object-cover -scale-x-100"
              />

              {/* Filter Overlays */}
              {filter === 'vhs' && <div className="absolute inset-0 vhs-scanlines z-10 pointer-events-none" />}
              {filter === 'cyberpunk' && <div className="absolute inset-0 bg-cyan-500/10 mix-blend-color z-10 pointer-events-none" />}
              {filter === 'warm-nostalgia' && <div className="absolute inset-0 bg-amber-500/10 mix-blend-overlay z-10 pointer-events-none" />}

              {/* Stamp Badge: You (Present Reaction) */}
              <div className="absolute top-2 left-2 z-10 bg-neutral-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-cyan-500/40 flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span className="text-[10px] font-mono-code font-bold text-cyan-300">
                  You (Present)
                </span>
              </div>

              {/* Recording indicator */}
              {isRecording && (
                <div className="absolute top-2 right-2 z-10 bg-rose-600/90 text-white font-mono-code font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg shadow-rose-600/50 animate-pulse">
                  <span>REC</span>
                  <span>{String(Math.floor(recordedSeconds / 60)).padStart(2, '0')}:{String(recordedSeconds % 60).padStart(2, '0')}</span>
                </div>
              )}
            </div>

            {/* 3-2-1 Big Countdown Overlay */}
            {isCountingDown && (
              <div className="absolute inset-0 bg-black/75 backdrop-blur-sm z-40 flex flex-col items-center justify-center animate-in zoom-in-75 duration-200">
                <div className="w-24 h-24 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center shadow-2xl shadow-rose-500/40">
                  <span className="font-display text-5xl font-black text-rose-400 animate-ping">
                    {countdownNum}
                  </span>
                </div>
                <p className="text-white font-bold text-sm mt-4 uppercase tracking-widest">
                  Get Ready to React!
                </p>
              </div>
            )}
          </div>

          {/* Quick layout switchers (floating right on desktop) */}
          <div className="absolute right-4 top-4 hidden md:flex flex-col gap-2 bg-neutral-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-neutral-800">
            <button
              onClick={() => setLayout('stacked-vertical')}
              className={`p-2 rounded-xl transition-all ${
                layout === 'stacked-vertical' ? 'bg-rose-500 text-white shadow' : 'text-neutral-400 hover:text-white'
              }`}
              title="Stacked 9:16 (TikTok & Reels)"
            >
              <Rows className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayout('side-by-side')}
              className={`p-2 rounded-xl transition-all ${
                layout === 'side-by-side' ? 'bg-rose-500 text-white shadow' : 'text-neutral-400 hover:text-white'
              }`}
              title="Side-by-Side Split"
            >
              <Columns className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayout('pip')}
              className={`p-2 rounded-xl transition-all ${
                layout === 'pip' ? 'bg-rose-500 text-white shadow' : 'text-neutral-400 hover:text-white'
              }`}
              title="Picture-in-Picture"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Prediction Bet Context Bar */}
        {capsule.prediction && (
          <div className="bg-neutral-950 px-4 py-2 border-t border-neutral-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <span className="text-amber-400 font-bold uppercase text-[10px] tracking-wider px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 shrink-0">
                Friend&apos;s Prediction Bet
              </span>
              <span className="text-neutral-200 truncate font-medium">
                &ldquo;{capsule.prediction.question}&rdquo;
              </span>
            </div>
            <span className="text-[11px] text-neutral-400 hidden sm:inline shrink-0 font-mono-code">
              Confidence: {capsule.prediction.confidence}%
            </span>
          </div>
        )}

        {/* Bottom Control Panel & Record Button */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex flex-col gap-3">
          {/* Progress bar during recording */}
          {isRecording && (
            <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-rose-500 to-pink-500 h-full transition-all duration-300"
                style={{ width: `${(recordedSeconds / MAX_DURATION) * 100}%` }}
              />
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              <span className="text-[10px] font-mono-code text-neutral-400 mr-1 hidden sm:inline">
                FILTER:
              </span>
              {(['normal', 'vhs', 'y2k', 'cyberpunk', 'warm-nostalgia'] as VideoFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setFilter(f);
                    sfx.vhsGlitch();
                  }}
                  className={`text-[10px] font-semibold uppercase px-2.5 py-1 rounded-lg transition-all ${
                    filter === f 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                      : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  {f === 'normal' ? 'Raw' : f}
                </button>
              ))}
            </div>

            {/* Central Giant Record / Stop Button */}
            <div className="flex items-center gap-3">
              {!isRecording ? (
                <button
                  onClick={handleStartCountdown}
                  disabled={isCountingDown}
                  className="group relative flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-sm shadow-xl shadow-rose-500/30 hover:shadow-rose-500/50 transition-all active:scale-95 disabled:opacity-50"
                >
                  <span className="w-3.5 h-3.5 rounded-full bg-white group-hover:scale-110 transition-transform"></span>
                  <span>{isBlindReaction ? 'Start Blind Duet' : 'Record Duet'}</span>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-xl shadow-red-600/40 transition-all active:scale-95 animate-pulse"
                >
                  <span className="w-3 h-3 rounded-sm bg-white"></span>
                  <span>Finish & Export Duet</span>
                </button>
              )}
            </div>

            {/* Camera & Mic toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMic}
                className={`p-2 rounded-xl border transition-colors ${
                  isMicMuted 
                    ? 'bg-red-950/40 text-red-400 border-red-500/30' 
                    : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:text-white'
                }`}
                title={isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
              >
                {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setUseSimulatedCam(!useSimulatedCam)}
                className={`p-2 rounded-xl border text-[11px] font-mono-code font-bold transition-all ${
                  useSimulatedCam
                    ? 'bg-purple-950/50 text-purple-300 border-purple-500/40'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
                title="Toggle between hardware camera and simulated reaction cam"
              >
                {useSimulatedCam ? 'SIM CAM' : 'WEB CAM'}
              </button>
            </div>
          </div>

          {cameraError && (
            <p className="text-[11px] text-amber-400 text-center font-medium">
              ℹ️ {cameraError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
