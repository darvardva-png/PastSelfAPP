import { SplitLayout, VideoFilter } from '../types';

/**
 * Generates an animated test video track if user has no webcam or denies permission
 */
export function createMockCameraStream(): MediaStream {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d')!;

  let hue = 220;
  let frame = 0;

  function draw() {
    frame++;
    hue = (hue + 0.3) % 360;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, `hsl(${hue}, 40%, 15%)`);
    grad.addColorStop(1, `hsl(${(hue + 60) % 360}, 50%, 8%)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Centered avatar with subtle bobbing
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 + Math.sin(frame * 0.05) * 8;

    // Outer glow
    ctx.beginPath();
    ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(244, 63, 94, 0.2)';
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(centerX, centerY - 10, 48, 0, Math.PI * 2);
    ctx.fillStyle = '#fecdd3';
    ctx.fill();

    // Eyes (blinking occasionally)
    const isBlinking = frame % 90 > 84;
    ctx.fillStyle = '#1e1b4b';
    if (isBlinking) {
      ctx.fillRect(centerX - 24, centerY - 14, 12, 3);
      ctx.fillRect(centerX + 12, centerY - 14, 12, 3);
    } else {
      ctx.beginPath();
      ctx.arc(centerX - 18, centerY - 14, 6, 0, Math.PI * 2);
      ctx.arc(centerX + 18, centerY - 14, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Reactive mouth talking
    ctx.beginPath();
    const mouthHeight = 8 + Math.abs(Math.sin(frame * 0.18)) * 14;
    ctx.ellipse(centerX, centerY + 16, 12, mouthHeight, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#be123c';
    ctx.fill();

    // Live Simulated Camera HUD tag
    ctx.fillStyle = 'rgba(244, 63, 94, 0.9)';
    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.fillText('● LIVE REACT CAM (SIMULATED)', 24, 40);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '13px sans-serif';
    ctx.fillText('Ready for Blind Duet reaction', 24, 65);

    requestAnimationFrame(draw);
  }

  draw();

  // Create stream from canvas
  const stream: MediaStream = 'captureStream' in canvas ? (canvas as HTMLCanvasElement & { captureStream: (fps?: number) => MediaStream }).captureStream(30) : new MediaStream();

  // Create a silent audio track using web audio
  try {
    const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const dst = audioCtx.createMediaStreamDestination();
    osc.connect(dst);
    osc.start();
    const audioTrack = dst.stream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = false; // silent
      stream.addTrack(audioTrack);
    }
  } catch {
    // audio context may require user gesture
  }

  return stream;
}

/**
 * Composite two videos into a single Canvas export stream with layout & #PastSelfApp watermark
 */
export async function renderDuetFrameToCanvas(
  canvas: HTMLCanvasElement,
  pastVideo: HTMLVideoElement,
  reactionVideo: HTMLVideoElement,
  layout: SplitLayout,
  filter: VideoFilter,
  pastLabel: string,
  reactionLabel: string,
  watermark = '#PastSelfApp'
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  // Clear
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, w, h);

  if (layout === 'stacked-vertical') {
    // Vertical 9:16 layout (e.g. 720 x 1280)
    const halfH = h / 2;

    // Past video (top)
    try {
      ctx.drawImage(pastVideo, 0, 0, w, halfH);
    } catch {
      ctx.fillStyle = '#171717';
      ctx.fillRect(0, 0, w, halfH);
    }

    // Reaction video (bottom)
    try {
      ctx.drawImage(reactionVideo, 0, halfH, w, halfH);
    } catch {
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(0, halfH, w, halfH);
    }

    // Split dividing glowing line
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, halfH);
    ctx.lineTo(w, halfH);
    ctx.stroke();

    // Labels
    drawPillBadge(ctx, pastLabel, 20, 20, '#e11d48');
    drawPillBadge(ctx, reactionLabel, 20, halfH + 20, '#06b6d4');

  } else if (layout === 'side-by-side') {
    // Side by Side (e.g. 1280 x 720)
    const halfW = w / 2;

    // Past video (left)
    try {
      ctx.drawImage(pastVideo, 0, 0, halfW, h);
    } catch {
      ctx.fillStyle = '#171717';
      ctx.fillRect(0, 0, halfW, h);
    }

    // Reaction video (right)
    try {
      ctx.drawImage(reactionVideo, halfW, 0, halfW, h);
    } catch {
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(halfW, 0, halfW, h);
    }

    // Split dividing glowing line
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(halfW, 0);
    ctx.lineTo(halfW, h);
    ctx.stroke();

    // Labels
    drawPillBadge(ctx, pastLabel, 20, 20, '#e11d48');
    drawPillBadge(ctx, reactionLabel, halfW + 20, 20, '#06b6d4');

  } else {
    // Picture in picture
    try {
      ctx.drawImage(pastVideo, 0, 0, w, h);
    } catch {
      ctx.fillStyle = '#171717';
      ctx.fillRect(0, 0, w, h);
    }

    // PIP window in bottom-right
    const pipW = w * 0.38;
    const pipH = h * 0.38;
    const pipX = w - pipW - 24;
    const pipY = h - pipH - 24;

    ctx.save();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#f43f5e';
    ctx.strokeRect(pipX, pipY, pipW, pipH);
    try {
      ctx.drawImage(reactionVideo, pipX, pipY, pipW, pipH);
    } catch {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(pipX, pipY, pipW, pipH);
    }
    ctx.restore();

    drawPillBadge(ctx, pastLabel, 24, 24, '#e11d48');
    drawPillBadge(ctx, reactionLabel, pipX + 12, pipY + 12, '#06b6d4');
  }

  // Filter effect overlays
  applyCanvasFilterOverlay(ctx, filter, w, h);

  // Official #PastSelfApp watermark stamp
  drawWatermark(ctx, watermark, w, h);
}

function drawPillBadge(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string) {
  ctx.save();
  ctx.font = 'bold 15px "JetBrains Mono", monospace';
  const textWidth = ctx.measureText(text).width;
  const paddingX = 14;
  const height = 30;

  // Background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.beginPath();
  ctx.roundRect(x, y, textWidth + paddingX * 2, height, 15);
  ctx.fill();

  // Border
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Indicator dot
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x + 12, y + height / 2, 4, 0, Math.PI * 2);
  ctx.fill();

  // Text
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, x + 24, y + 20);
  ctx.restore();
}

function drawWatermark(ctx: CanvasRenderingContext2D, text: string, w: number, h: number) {
  ctx.save();
  // Bottom center or bottom right watermark
  const tag = text.toUpperCase();
  ctx.font = '800 20px "Syne", sans-serif';
  const textWidth = ctx.measureText(tag).width;

  const bgW = textWidth + 36;
  const bgH = 40;
  const bgX = (w - bgW) / 2;
  const bgY = h - bgH - 20;

  // Glass pill
  ctx.fillStyle = 'rgba(10, 10, 10, 0.85)';
  ctx.beginPath();
  ctx.roundRect(bgX, bgY, bgW, bgH, 20);
  ctx.fill();

  // Gradient border
  const grad = ctx.createLinearGradient(bgX, bgY, bgX + bgW, bgY);
  grad.addColorStop(0, '#f43f5e');
  grad.addColorStop(1, '#8b5cf6');
  ctx.strokeStyle = grad;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Text with subtle shadow
  ctx.shadowColor = 'rgba(244, 63, 94, 0.6)';
  ctx.shadowBlur = 10;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(tag, bgX + 18, bgY + 26);

  ctx.restore();
}

function applyCanvasFilterOverlay(ctx: CanvasRenderingContext2D, filter: VideoFilter, w: number, h: number) {
  if (filter === 'vhs') {
    // Scanlines
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    for (let y = 0; y < h; y += 4) {
      ctx.fillRect(0, y, w, 2);
    }

    // VHS timestamp in retro monospaced yellow
    ctx.font = 'bold 18px "JetBrains Mono", monospace';
    ctx.fillStyle = '#facc15';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 4;
    ctx.fillText('REC ● PLAY  [SP]', w - 180, 42);
    ctx.fillText('OCT 16 2026', 24, h - 30);
    ctx.restore();
  } else if (filter === 'cyberpunk') {
    ctx.save();
    ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  } else if (filter === 'warm-nostalgia') {
    ctx.save();
    ctx.fillStyle = 'rgba(251, 146, 60, 0.09)';
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }
}
