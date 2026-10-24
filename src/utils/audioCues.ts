/**
 * Web Audio & Haptic Feedback Engine for Athletic Workouts
 * Provides auditory milestones and tactile feedback without external media dependencies.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Play a synthesizer chime / beep.
 */
export function playBeep(freq = 880, durationMs = 180, isMuted = false): void {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000);
  } catch {
    // Audio context may be restricted before user gesture
  }
}

/**
 * Play double chime for workout milestone or rest completion.
 */
export function playMilestoneChime(isMuted = false): void {
  if (isMuted) return;
  playBeep(880, 150, false);
  setTimeout(() => {
    playBeep(1174.66, 250, false); // D6 note
  }, 160);
}

/**
 * Announce speech message using Web Speech Synthesis API.
 */
export function speakAnnouncement(text: string, isMuted = false): void {
  if (isMuted) return;
  try {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Clear queued speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  } catch {
    // Fail silently
  }
}

/**
 * Tactile vibration feedback.
 */
export function triggerHaptic(pattern: number | number[] = 100, isMuted = false): void {
  if (isMuted) return;
  try {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {
    // Fail silently
  }
}

/**
 * Announce kilometer split with beep, speech, and haptics.
 */
export function announceKilometerSplit(
  km: number,
  splitSeconds: number,
  isMuted = false
): void {
  playMilestoneChime(isMuted);
  triggerHaptic([200, 100, 200], isMuted);

  const mins = Math.floor(splitSeconds / 60);
  const secs = splitSeconds % 60;
  const paceText = secs > 0 ? `${mins} minutes ${secs} seconds` : `${mins} minutes`;
  speakAnnouncement(`Kilometer ${km} completed. Split pace: ${paceText}.`, isMuted);
}
