import { useCallback, useEffect, useRef, useState } from "react";
 // Adjust path accordingly
import {
  FaceLivenessDetector,
  signatureDistance,
  type FrameMetrics,
} from "../pages/faceLivenessDetectos";

/* ------------------------------------------------------------------ */
/*  Tunables — recalibrate against your real cameras/lighting.         */
/*  Pass `onDebugMetrics` while testing to log raw values and pick     */
/*  good thresholds empirically instead of guessing.                   */
/* ------------------------------------------------------------------ */

// --- Blink (EAR) ---
const EAR_CLOSED = 0.21;
const EAR_OPEN = 0.27;
// A dip/recovery must persist this many consecutive frames to count —
// filters out single-frame camera/tracking noise so blink detection
// isn't jumpy ("too fast" / false-triggering).
const EAR_SUSTAIN_FRAMES = 2;

// --- Head turn (yaw) ---
const YAW_CENTER_MAX = 0.08;
const YAW_LOOKAWAY = 0.26; // outside the HEAD_TURN step, this counts as "looking away"
const YAW_TURN_MIN = 0.2;
const YAW_SUSTAIN_FRAMES = 2;



// --- Face box / framing ---
const FACE_TOO_FAR = 0.2;
const FACE_TOO_CLOSE = 0.65;
const CENTER_X_MIN = 0.18;
const CENTER_X_MAX = 0.82;
const CENTER_Y_MIN = 0.12;
const CENTER_Y_MAX = 0.88;

const STABLE_FRAMES_REQUIRED = 10; // consecutive good frames before leaving FACE_ALIGN
const COUNTDOWN_SECONDS = 3;
const DETECT_INTERVAL_MS = 100; // ~10fps — plenty for liveness, keeps CPU low

// Settle grace period: right after the camera turns on, the candidate has
// usually just been filling in the form and isn't yet positioned. Skip the
// anti-spoof / identity checks for this long so normal settling-in doesn't
// get misread as a spoof or a face swap. Basic framing guidance still runs.
const SETTLE_GRACE_MS = 2500;

// --- Anti-spoof: flat photo / screen replay ---
const MIN_DEPTH_SPREAD = 0.07; // TUNE against your real webcams — see onDebugMetrics
const DEPTH_FAIL_FRAMES_TO_FLAG = 12; // ~1.2s of sustained flatness

// --- Anti-spoof: frozen / static image watchdog ---
const MOTION_EPS_EAR = 0.006;
const MOTION_EPS_YAW = 0.01;
const MOTION_EPS_SMILE = 0.01;
const STATIC_TIMEOUT_MS = 7000; // real people also hold fairly still sometimes — be lenient

// --- Multi-user: same-person-throughout check ---
// Sampled ONLY on neutral frames (facing forward, eyes open, not actively
// smiling) and smoothed with an EMA, so the liveness gestures themselves
// never masquerade as "a different person".
const SIGNATURE_MISMATCH_THRESHOLD = 0.05;
const SIGNATURE_MISMATCH_NEUTRAL_FRAMES_TO_FLAG = 12; // consecutive *neutral* mismatched samples
const SIGNATURE_EMA_ALPHA = 0.2;

// --- Multi-user: per-gesture CHECKPOINT verification ---
// In addition to the continuous background drift check above, the exact
// frame each gesture (blink / head-turn / smile) is about to be credited
// is checked directly against the very first signature captured this
// session. This is what actually guarantees "all three gestures were
// done by the same face", rather than relying on the background check
// happening to accumulate enough samples in time. Slightly looser than
// the EMA threshold since it's a single instantaneous frame with no
// smoothing.
const CHECKPOINT_SIGNATURE_THRESHOLD = SIGNATURE_MISMATCH_THRESHOLD * 1.3;

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type LivenessStep =
  | "LOADING_MODEL"
  | "FACE_ALIGN"
  | "BLINK"
  | "HEAD_TURN"
  | "SMILE"
  | "COUNTDOWN"
  | "CAPTURED"
  | "ERROR";

export interface LivenessMessage {
  en: string;
  hi: string;
  tone: "info" | "warn" | "success";
}

export interface LivenessProgress {
  blink: boolean;
  headTurn: boolean;
  smile: boolean;
}

export interface LivenessState {
  step: LivenessStep;
  message: LivenessMessage;
  progress: LivenessProgress;
  countdown: number | null;
  faceCount: number;
}

export interface DebugMetrics extends FrameMetrics {
  stableFrames: number;
  isNeutral: boolean;
  signatureDistance: number | null;
}

interface UseFaceLivenessArgs {
  videoEl: HTMLVideoElement | null;
  enabled: boolean;
  /** Fired once (edge-triggered) for spoof/multi-user events — good hook for a toast. */
  onSecurityEvent?: (message: LivenessMessage) => void;
  /** Optional: fires every processed frame with raw metrics, for calibrating thresholds. */
  onDebugMetrics?: (metrics: DebugMetrics) => void;
}

interface UseFaceLivenessResult {
  state: LivenessState;
  capturedDataUrl: string;
  capturedFile: File | null;
  reset: () => void;
}

const MSG = {
  loading: { en: "Loading face detection…", hi: "फेस डिटेक्शन लोड हो रहा है…", tone: "info" as const },
  noFace: { en: "No face detected", hi: "कोई चेहरा नहीं मिला", tone: "warn" as const },
  multiFace: { en: "Only one person allowed", hi: "केवल एक व्यक्ति की अनुमति है", tone: "warn" as const },
  tooFar: { en: "Move closer", hi: "पास आएं", tone: "warn" as const },
  tooClose: { en: "Move back", hi: "पीछे हटें", tone: "warn" as const },
  offCenter: { en: "Center your face in the frame", hi: "अपना चेहरा फ्रेम के बीच में रखें", tone: "warn" as const },
  lookAway: { en: "Look at camera", hi: "कैमरे की ओर देखें", tone: "warn" as const },
  holdStill: { en: "Hold still…", hi: "स्थिर रहें…", tone: "info" as const },
  blinkNow: { en: "Please blink your eyes", hi: "कृपया पलक झपकाएं", tone: "info" as const },
  turnHeadNow: { en: "Please turn your head left or right, then return to center", hi: "कृपया अपना सिर बाएं/दाएं घुमाएं, फिर बीच में लाएं", tone: "info" as const },
  
  allGood: { en: "Perfect! Capturing…", hi: "बहुत बढ़िया! फोटो ली जा रही है…", tone: "success" as const },
  captured: { en: "Live photo captured successfully!", hi: "लाइव फोटो सफलतापूर्वक कैप्चर हुआ!", tone: "success" as const },
  error: { en: "Unable to start face detection. Please retry.", hi: "फेस डिटेक्शन शुरू नहीं हो सका। पुनः प्रयास करें।", tone: "warn" as const },
  flatImage: { en: "This looks like a photo or screen. Please use a live camera.", hi: "यह एक फोटो या स्क्रीन जैसा लग रहा है। कृपया लाइव कैमरे का उपयोग करें।", tone: "warn" as const },
  staticImage: { en: "No movement detected — please use a live camera, not a photo/video.", hi: "कोई हलचल नहीं मिली — कृपया फोटो/वीडियो के बजाय लाइव कैमरे का उपयोग करें।", tone: "warn" as const },
  personChanged: { en: "Different person detected. Please keep the same person in front of the camera.", hi: "अलग व्यक्ति का पता चला। कृपया एक ही व्यक्ति को कैमरे के सामने रखें।", tone: "warn" as const },
};

/* ------------------------------------------------------------------ */
/*  Hook                                                                */
/* ------------------------------------------------------------------ */

export function useFaceLiveness({
  videoEl,
  enabled,
  onSecurityEvent,
  onDebugMetrics,
}: UseFaceLivenessArgs): UseFaceLivenessResult {
  const [state, setState] = useState<LivenessState>({
    step: "LOADING_MODEL",
    message: MSG.loading,
    progress: { blink: false, headTurn: false, smile: false },
    countdown: null,
    faceCount: 0,
  });
  const [capturedDataUrl, setCapturedDataUrl] = useState("");
  const [capturedFile, setCapturedFile] = useState<File | null>(null);

  const rafRef = useRef<number | null>(null);
  const lastDetectAtRef = useRef(0);
  const capturedRef = useRef(false);
  const sessionStartAtRef = useRef<number>(Date.now());

  // Base-check / gesture tracking
  const stableGoodFramesRef = useRef(0);
  const blinkDoneRef = useRef(false);
  const headTurnDoneRef = useRef(false);

  const countdownTimerRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Blink hysteresis
  const earClosedStreakRef = useRef(0);
  const earOpenStreakRef = useRef(0);
  const wasEyeClosedSustainedRef = useRef(false);

  // Head-turn hysteresis
  const yawTurnedStreakRef = useRef(0);
  const yawCenterStreakRef = useRef(0);
  const headTurnedSustainedRef = useRef(false);



  // Anti-spoof: flat image
  const flatFrameCountRef = useRef(0);

  // Anti-spoof: static/frozen image watchdog
  const lastEarRef = useRef<number | null>(null);
  const lastYawRef = useRef<number | null>(null);
  const lastSmileRef = useRef<number | null>(null);
  const lastMotionAtRef = useRef<number>(Date.now());

  // Multi-user: face signature consistency (neutral-frames only, EMA-smoothed)
  const baseSignatureRef = useRef<number[] | null>(null);
  const signatureEmaRef = useRef<number[] | null>(null);
  const signatureMismatchFramesRef = useRef(0);

  const fireSecurityEvent = useCallback(
    (msg: LivenessMessage) => onSecurityEvent?.(msg),
    [onSecurityEvent],
  );

  const clearCountdown = useCallback(() => {
    if (countdownTimerRef.current) {
      window.clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  }, []);

  const resetInternal = useCallback(() => {
    stableGoodFramesRef.current = 0;
    blinkDoneRef.current = false;
    headTurnDoneRef.current = false;

    capturedRef.current = false;

    earClosedStreakRef.current = 0;
    earOpenStreakRef.current = 0;
    wasEyeClosedSustainedRef.current = false;

    yawTurnedStreakRef.current = 0;
    yawCenterStreakRef.current = 0;
    headTurnedSustainedRef.current = false;



    flatFrameCountRef.current = 0;
    lastEarRef.current = null;
    lastYawRef.current = null;
    lastSmileRef.current = null;
    lastMotionAtRef.current = Date.now();

    baseSignatureRef.current = null;
    signatureEmaRef.current = null;
    signatureMismatchFramesRef.current = 0;

    sessionStartAtRef.current = Date.now();
    clearCountdown();
  }, [clearCountdown]);

  /**
   * Step-scoped reset: only clears the gesture that's CURRENTLY in
   * progress, preserving any gestures already completed. Used for
   * anti-spoof / identity hiccups that happen *before* all three
   * gestures are done — the common, usually-benign case (repositioning,
   * a stray frame, lighting flicker).
   */
  const resetCurrentGestureOnly = useCallback(() => {
    clearCountdown();
    if (!blinkDoneRef.current) {
      earClosedStreakRef.current = 0;
      earOpenStreakRef.current = 0;
      wasEyeClosedSustainedRef.current = false;
    } else if (!headTurnDoneRef.current) {
      yawTurnedStreakRef.current = 0;
      yawCenterStreakRef.current = 0;
      headTurnedSustainedRef.current = false;
    } 
    
    // Always clear the bookkeeping that triggered the event so it can't
    // immediately re-fire from stale counters.
    flatFrameCountRef.current = 0;
    lastMotionAtRef.current = Date.now();
    signatureMismatchFramesRef.current = 0;
    signatureEmaRef.current = baseSignatureRef.current;
  }, [clearCountdown]);

  /**
   * Full reset: wipes every gesture. Reserved for the rare case where a
   * spoof/identity signal fires AFTER all three gestures already passed
   * (i.e. right at the capture moment) — the highest-risk instant, worth
   * being strict about.
   */
  const resetAllGestures = useCallback(() => {
    clearCountdown();
    blinkDoneRef.current = false;
    headTurnDoneRef.current = false;
  
    earClosedStreakRef.current = 0;
    earOpenStreakRef.current = 0;
    wasEyeClosedSustainedRef.current = false;
    yawTurnedStreakRef.current = 0;
    yawCenterStreakRef.current = 0;
    headTurnedSustainedRef.current = false;

    flatFrameCountRef.current = 0;
    lastMotionAtRef.current = Date.now();
    signatureMismatchFramesRef.current = 0;
    baseSignatureRef.current = null;
    signatureEmaRef.current = null;
    setState((s) => ({
      ...s,
      step: "FACE_ALIGN",
      progress: { blink: false, headTurn: false, smile: false },
      countdown: null,
    }));
  }, [clearCountdown]);

  /**
   * Shared handler for a confirmed identity mismatch, whether caught by
   * the continuous background check or by a per-gesture checkpoint.
   * Always a full reset — see rationale on resetAllGestures above.
   */
  const handlePersonChanged = useCallback(() => {
    clearCountdown();
    fireSecurityEvent(MSG.personChanged);
    resetAllGestures();
    setState((s) => ({ ...s, message: MSG.personChanged }));
  }, [clearCountdown, fireSecurityEvent, resetAllGestures]);

  /**
   * CHECKPOINT check: is the face in THIS frame still the same face we
   * captured as the baseline at the start of the session? Used right at
   * the moment a gesture is about to be marked done, so "blink by person
   * A, then head-turn/smile by person B" can never slip through — each
   * step is verified against the *first* step's face, not just checked
   * for drift against its immediate predecessor.
   *
   * Deliberately permissive on frames where we simply can't judge yet
   * (no baseline captured yet, no landmarks this instant, or head yawed
   * enough that the 2D projection isn't comparable) — those cases fall
   * back to the continuous background EMA check instead of blocking a
   * legitimate gesture on a single unreadable frame.
   */
  const checkpointMatchesBaseline = useCallback((metrics: FrameMetrics): boolean => {
    if (!baseSignatureRef.current) return true; // no baseline yet — nothing to compare against
    if (!metrics.signature) return true; // no landmarks this instant
    if (Math.abs(metrics.yaw) >= YAW_CENTER_MAX) return true; // off-axis frame, not reliably comparable
    const dist = signatureDistance(baseSignatureRef.current, metrics.signature);
    return dist <= CHECKPOINT_SIGNATURE_THRESHOLD;
  }, []);

  const reset = useCallback(() => {
    resetInternal();
    setCapturedDataUrl("");
    setCapturedFile(null);
    setState({
      step: "FACE_ALIGN",
      message: MSG.holdStill,
      progress: { blink: false, headTurn: false, smile: false },
      countdown: null,
      faceCount: 0,
    });
  }, [resetInternal]);

  const doCapture = useCallback(() => {
    if (!videoEl || capturedRef.current) return;
    capturedRef.current = true;

    if (!canvasRef.current) canvasRef.current = document.createElement("canvas");
    const canvas = canvasRef.current;
    canvas.width = videoEl.videoWidth || 640;
    canvas.height = videoEl.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Mirror horizontally so the capture matches a mirrored preview.
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setCapturedDataUrl(dataUrl);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          setCapturedFile(new File([blob], `live_photo_${Date.now()}.jpg`, { type: "image/jpeg" }));
        }
      },
      "image/jpeg",
      0.92,
    );

    setState((s) => ({ ...s, step: "CAPTURED", message: MSG.captured, countdown: null }));
  }, [videoEl]);

  const startCountdown = useCallback(() => {
    if (countdownTimerRef.current) return;
    let remaining = COUNTDOWN_SECONDS;
    setState((s) => ({ ...s, step: "COUNTDOWN", message: MSG.allGood, countdown: remaining }));
    countdownTimerRef.current = window.setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearCountdown();
        doCapture();
        return;
      }
      setState((s) => ({ ...s, countdown: remaining }));
    }, 1000);
  }, [clearCountdown, doCapture]);

  const processFrame = useCallback(
    (metrics: FrameMetrics) => {
      if (capturedRef.current) return;

      const withinGrace = Date.now() - sessionStartAtRef.current < SETTLE_GRACE_MS;
      const allGesturesDone = blinkDoneRef.current && headTurnDoneRef.current;

      const emitDebug = (extra: Partial<DebugMetrics> = {}) => {
        onDebugMetrics?.({
          ...metrics,
          stableFrames: stableGoodFramesRef.current,
          isNeutral: false,
          signatureDistance: null,
          ...extra,
        });
      };

      // ---- Base presence checks (always apply) ----
      if (metrics.faceCount === 0) {
        stableGoodFramesRef.current = 0;
        clearCountdown();
        setState((s) => ({ ...s, message: MSG.noFace, faceCount: 0 }));
        emitDebug();
        return;
      }
      if (metrics.faceCount > 1) {
        stableGoodFramesRef.current = 0;
        clearCountdown();
        setState((s) => ({ ...s, message: MSG.multiFace, faceCount: metrics.faceCount }));
        emitDebug();
        return;
      }

      const box = metrics.box!;
      if (box.widthFrac < FACE_TOO_FAR) {
        stableGoodFramesRef.current = 0;
        clearCountdown();
        setState((s) => ({ ...s, message: MSG.tooFar, faceCount: 1 }));
        emitDebug();
        return;
      }
      if (box.widthFrac > FACE_TOO_CLOSE) {
        stableGoodFramesRef.current = 0;
        clearCountdown();
        setState((s) => ({ ...s, message: MSG.tooClose, faceCount: 1 }));
        emitDebug();
        return;
      }
      if (
        box.centerX < CENTER_X_MIN || box.centerX > CENTER_X_MAX ||
        box.centerY < CENTER_Y_MIN || box.centerY > CENTER_Y_MAX
      ) {
        stableGoodFramesRef.current = 0;
        clearCountdown();
        setState((s) => ({ ...s, message: MSG.offCenter, faceCount: 1 }));
        emitDebug();
        return;
      }

      const inHeadTurnStep = blinkDoneRef.current && !headTurnDoneRef.current;
      if (!inHeadTurnStep && Math.abs(metrics.yaw) > YAW_LOOKAWAY) {
        stableGoodFramesRef.current = 0;
        clearCountdown();
        setState((s) => ({ ...s, message: MSG.lookAway, faceCount: 1 }));
        emitDebug();
        return;
      }

      // ---- Anti-spoof checks — skipped during the settle grace period ----
      if (!withinGrace) {
        // Flat photo / screen replay
        if (metrics.depthSpread < MIN_DEPTH_SPREAD) {
          flatFrameCountRef.current += 1;
          if (flatFrameCountRef.current >= DEPTH_FAIL_FRAMES_TO_FLAG) {
            clearCountdown();
            fireSecurityEvent(MSG.flatImage);
            if (allGesturesDone) resetAllGestures();
            else resetCurrentGestureOnly();
            setState((s) => ({ ...s, message: MSG.flatImage }));
            emitDebug();
            return;
          }
        } else {
          flatFrameCountRef.current = 0;
        }

        // Frozen / static image watchdog
        const now = Date.now();
        const prevEar = lastEarRef.current;
        const prevYaw = lastYawRef.current;
        const prevSmile = lastSmileRef.current;
        const moved =
          prevEar === null ||
          Math.abs(metrics.ear - prevEar) > MOTION_EPS_EAR ||
          Math.abs(metrics.yaw - (prevYaw ?? 0)) > MOTION_EPS_YAW ||
          Math.abs(metrics.smileScore - (prevSmile ?? 0)) > MOTION_EPS_SMILE;
        lastEarRef.current = metrics.ear;
        lastYawRef.current = metrics.yaw;
        lastSmileRef.current = metrics.smileScore;
        if (moved) {
          lastMotionAtRef.current = now;
        } else if (now - lastMotionAtRef.current > STATIC_TIMEOUT_MS) {
          clearCountdown();
          fireSecurityEvent(MSG.staticImage);
          if (allGesturesDone) resetAllGestures();
          else resetCurrentGestureOnly();
          setState((s) => ({ ...s, message: MSG.staticImage }));
          emitDebug();
          return;
        }
      }

      // Face passes this frame's checks.
      stableGoodFramesRef.current += 1;
      const faceStable = stableGoodFramesRef.current >= STABLE_FRAMES_REQUIRED;
      if (!faceStable) {
        setState((s) => ({ ...s, step: "FACE_ALIGN", message: MSG.holdStill, faceCount: 1 }));
        emitDebug();
        return;
      }

      // ---- Multi-user: same-person-throughout check ----
      // The signature itself (eye-separation/face-width, face-height/
      // face-width) is EXPRESSION-INVARIANT by construction — blinking
      // or smiling doesn't move those ratios. The only thing that
      // distorts them is yaw (perspective foreshortening), so identity
      // sampling only needs the head to be roughly forward-facing.
      //
      // IMPORTANT: this is intentionally broader than the "fully neutral"
      // gate used below for smile-baseline calibration. Gating identity
      // sampling on eyes-open / not-smiling too (as before) meant the
      // check basically never got to run *during* the head-turn/smile
      // steps — the exact window an impostor swapping in mid-flow would
      // be doing those gestures — because it takes 12 consecutive
      // qualifying frames to flag, and "eyes open AND not smiling" frames
      // are rare while the candidate is mid-smile. Sampling on yaw alone
      // means the check now runs continuously through blink AND smile
      // (yaw stays centered for both), so a swap is caught in ~1s
      // regardless of which gesture the second person is performing.
      const isYawCenteredForSignature = Math.abs(metrics.yaw) < YAW_CENTER_MAX;

      // Separate, stricter gate — used ONLY to decide when it's safe to
      // (re)calibrate the smile baseline, where we genuinely need a fully
      // relaxed face (not mid-blink, not mid-smile).
      const isFullyNeutral = isYawCenteredForSignature && metrics.ear > EAR_OPEN;

      let sigDist: number | null = null;
      if (!withinGrace && metrics.signature && isYawCenteredForSignature) {
        if (!baseSignatureRef.current) {
          baseSignatureRef.current = metrics.signature;
          signatureEmaRef.current = metrics.signature;
        } else if (signatureEmaRef.current) {
          signatureEmaRef.current = signatureEmaRef.current.map(
            (v, i) => v + SIGNATURE_EMA_ALPHA * (metrics.signature![i] - v),
          );
          sigDist = signatureDistance(baseSignatureRef.current, signatureEmaRef.current);
          if (sigDist > SIGNATURE_MISMATCH_THRESHOLD) {
            signatureMismatchFramesRef.current += 1;
            if (signatureMismatchFramesRef.current >= SIGNATURE_MISMATCH_NEUTRAL_FRAMES_TO_FLAG) {
              // Always a FULL reset here, regardless of which gestures
              // are already marked done. This is deliberately different
              // from the flat-image/static-image spoof handling below:
              // those are about the liveness of whoever is currently in
              // frame, but a confirmed identity mismatch means we can no
              // longer trust that any already-completed gesture (blink,
              // head-turn) was actually performed by the same person now
              // in front of the camera. Crediting it anyway is exactly
              // the "blink by A, head-turn/smile by B" bypass.
              handlePersonChanged();
              emitDebug({ isNeutral: isYawCenteredForSignature, signatureDistance: sigDist });
              return;
            }
          } else {
            signatureMismatchFramesRef.current = 0;
          }
        }
      }

     
      

      // ---- Gesture 1: Blink (with hysteresis) ----
      if (!blinkDoneRef.current) {
        if (metrics.ear < EAR_CLOSED) {
          earClosedStreakRef.current += 1;
          earOpenStreakRef.current = 0;
          if (earClosedStreakRef.current >= EAR_SUSTAIN_FRAMES) {
            wasEyeClosedSustainedRef.current = true;
          }
        } else if (metrics.ear > EAR_OPEN) {
          earOpenStreakRef.current += 1;
          earClosedStreakRef.current = 0;
          if (wasEyeClosedSustainedRef.current && earOpenStreakRef.current >= EAR_SUSTAIN_FRAMES) {
            // CHECKPOINT: about to credit the blink — verify this is
            // still the same face captured as the session baseline.
            if (!checkpointMatchesBaseline(metrics)) {
              handlePersonChanged();
              emitDebug({ isNeutral: isYawCenteredForSignature, signatureDistance: sigDist });
              return;
            }
            blinkDoneRef.current = true;
            wasEyeClosedSustainedRef.current = false;
          }
        }
        setState((s) => ({
          ...s,
          step: "BLINK",
          message: MSG.blinkNow,
          faceCount: 1,
          progress: { ...s.progress, blink: blinkDoneRef.current },
        }));
        if (!blinkDoneRef.current) {
          emitDebug({ isNeutral: isYawCenteredForSignature, signatureDistance: sigDist });
          return;
        }
      }

      // ---- Gesture 2: Head turn, then return to center (with hysteresis) ----
      if (!headTurnDoneRef.current) {
        if (Math.abs(metrics.yaw) > YAW_TURN_MIN) {
          yawTurnedStreakRef.current += 1;
          yawCenterStreakRef.current = 0;
          if (yawTurnedStreakRef.current >= YAW_SUSTAIN_FRAMES) {
            headTurnedSustainedRef.current = true;
          }
        } else if (Math.abs(metrics.yaw) < YAW_CENTER_MAX) {
          yawCenterStreakRef.current += 1;
          yawTurnedStreakRef.current = 0;
          if (headTurnedSustainedRef.current && yawCenterStreakRef.current >= YAW_SUSTAIN_FRAMES) {
            // CHECKPOINT: about to credit the head-turn — verify this is
            // still the same face captured as the session baseline.
            if (!checkpointMatchesBaseline(metrics)) {
              handlePersonChanged();
              emitDebug({ isNeutral: isYawCenteredForSignature, signatureDistance: sigDist });
              return;
            }
            headTurnDoneRef.current = true;
          }
        }
        setState((s) => ({
          ...s,
          step: "HEAD_TURN",
          message: MSG.turnHeadNow,
          faceCount: 1,
          progress: { ...s.progress, headTurn: headTurnDoneRef.current },
        }));
        if (!headTurnDoneRef.current) {
          emitDebug({ isNeutral: isYawCenteredForSignature, signatureDistance: sigDist });
          return;
        }
      }

     

      // ---- All checks passed ----
      setState((s) => ({
        ...s,
        faceCount: 1,
      }));
      emitDebug({ isNeutral: isYawCenteredForSignature, signatureDistance: sigDist });
      startCountdown();
    },
    [
      checkpointMatchesBaseline,
      clearCountdown,
      fireSecurityEvent,
      handlePersonChanged,
      onDebugMetrics,
      resetAllGestures,
      resetCurrentGestureOnly,
      startCountdown,
    ],
  );

  useEffect(() => {
    if (!enabled || !videoEl) return;

    let cancelled = false;
    const detector = new FaceLivenessDetector();
    resetInternal();
    setState({
      step: "LOADING_MODEL",
      message: MSG.loading,
      progress: { blink: false, headTurn: false, smile: false },
      countdown: null,
      faceCount: 0,
    });

    detector
      .load()
      .then(() => {
        if (cancelled) return;
        sessionStartAtRef.current = Date.now(); // grace period starts once the model is actually ready
        setState((s) => ({ ...s, step: "FACE_ALIGN", message: MSG.holdStill }));

        const loop = (t: number) => {
          if (cancelled) return;
          if (
            !capturedRef.current &&
            videoEl.readyState >= 2 &&
            t - lastDetectAtRef.current >= DETECT_INTERVAL_MS
          ) {
            lastDetectAtRef.current = t;
            try {
              const metrics = detector.detect(videoEl, performance.now());
              processFrame(metrics);
            } catch {
              // transient decode errors — ignore this frame
            }
          }
          rafRef.current = requestAnimationFrame(loop);
        };
        rafRef.current = requestAnimationFrame(loop);
      })
      .catch(() => {
        if (!cancelled) setState((s) => ({ ...s, step: "ERROR", message: MSG.error }));
      });

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearCountdown();
      detector.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, videoEl]);

  return { state, capturedDataUrl, capturedFile, reset };
}