import {
  FaceLandmarker,
  FilesetResolver,
  type NormalizedLandmark,
} from "@mediapipe/tasks-vision";

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */

const WASM_BASE_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";

const MODEL_ASSET_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

/* ------------------------------------------------------------------ */
/*  Landmark index groups (MediaPipe Face Mesh — 468 points)           */
/* ------------------------------------------------------------------ */

// EAR points, ordered p1..p6 as in the standard eye-aspect-ratio formula.
export const LEFT_EYE = { p1: 33, p2: 160, p3: 158, p4: 133, p5: 153, p6: 144 };
export const RIGHT_EYE = { p1: 362, p2: 385, p3: 387, p4: 263, p5: 373, p6: 380 };

export const MOUTH = { left: 61, right: 291, top: 13, bottom: 14 };
export const NOSE_TIP = 1;
export const LEFT_CHEEK = 234;
export const RIGHT_CHEEK = 454;
export const FOREHEAD = 10;
export const CHIN = 152;

// Points used for the depth-spread (flat-image) check. The nose tip should
// sit meaningfully closer to the camera than the surrounding "ring" of
// points on a real 3D face; on a flat photo/screen they're all roughly
// coplanar.
const DEPTH_RING = [FOREHEAD, CHIN, LEFT_CHEEK, RIGHT_CHEEK];

/* ------------------------------------------------------------------ */
/*  Math helpers                                                       */
/* ------------------------------------------------------------------ */

const dist2D = (a: NormalizedLandmark, b: NormalizedLandmark) =>
  Math.hypot(a.x - b.x, a.y - b.y);

/**
 * Eye Aspect Ratio:
 *   EAR = ( ||p2-p6|| + ||p3-p5|| ) / ( 2 * ||p1-p4|| )
 * Lower EAR => eye more closed. A blink is a dip below a threshold
 * followed by a return above it.
 */
export function computeEAR(
  lm: NormalizedLandmark[],
  eye: typeof LEFT_EYE,
): number {
  const p1 = lm[eye.p1];
  const p2 = lm[eye.p2];
  const p3 = lm[eye.p3];
  const p4 = lm[eye.p4];
  const p5 = lm[eye.p5];
  const p6 = lm[eye.p6];
  const horizontal = 2 * dist2D(p1, p4);
  if (horizontal === 0) return 0;
  return (dist2D(p2, p6) + dist2D(p3, p5)) / horizontal;
}

export function computeAvgEAR(lm: NormalizedLandmark[]): number {
  return (computeEAR(lm, LEFT_EYE) + computeEAR(lm, RIGHT_EYE)) / 2;
}

/** Interocular distance — used to normalize other measurements against face size. */
export function computeInterocularDistance(lm: NormalizedLandmark[]): number {
  return dist2D(lm[LEFT_EYE.p1], lm[RIGHT_EYE.p4]);
}

/**
 * Smile score: mouth width normalized by interocular distance, blended
 * with a corner-lift term (corners rising above the vertical mouth
 * midpoint) so "mouth open" doesn't get mistaken for "smiling".
 *
 * NOTE: this is intentionally expression-SENSITIVE (that's the point —
 * it's what drives the smile gesture). It must never be used as part of
 * the identity signature below.
 */
export function computeSmileScore(lm: NormalizedLandmark[]): number {
  const interocular = computeInterocularDistance(lm) || 1e-6;
  const mouthWidth = dist2D(lm[MOUTH.left], lm[MOUTH.right]);
  const widthRatio = mouthWidth / interocular;

  const mouthMidY = (lm[MOUTH.top].y + lm[MOUTH.bottom].y) / 2;
  const cornerLift =
    (mouthMidY - lm[MOUTH.left].y + (mouthMidY - lm[MOUTH.right].y)) /
    2 /
    interocular;

  return widthRatio + cornerLift * 1.5;
}

/**
 * Normalized head yaw in roughly [-1, 1]. 0 = facing camera.
 * Uses how far the nose tip sits toward one cheek relative to face width.
 */
export function computeYaw(lm: NormalizedLandmark[]): number {
  const nose = lm[NOSE_TIP];
  const left = lm[LEFT_CHEEK];
  const right = lm[RIGHT_CHEEK];
  const faceWidth = dist2D(left, right) || 1e-6;
  const mid = (left.x + right.x) / 2;
  return ((nose.x - mid) / faceWidth) * 2;
}

/**
 * Depth spread (anti-spoof signal): how much closer the nose tip is to the
 * camera (smaller/more-negative z, per MediaPipe's convention) than the
 * surrounding facial "ring" (forehead / chin / cheeks), normalized by
 * interocular distance so it's roughly scale-invariant.
 *
 * A real face has real 3D relief here. A printed photo or a phone/tablet
 * screen held up to the camera is flat, so this collapses toward zero.
 *
 * IMPORTANT: the raw magnitude of this value varies noticeably across
 * webcams/lighting. Calibrate MIN_DEPTH_SPREAD in useFaceLiveness.ts
 * against your real target devices — see the onDebugMetrics hook option.
 */
export function computeDepthSpread(lm: NormalizedLandmark[]): number {
  const interocular = computeInterocularDistance(lm) || 1e-6;
  const noseZ = lm[NOSE_TIP].z ?? 0;
  const ringZ = DEPTH_RING.map((i) => lm[i].z ?? 0);
  const avgRingZ = ringZ.reduce((a, b) => a + b, 0) / ringZ.length;
  return (avgRingZ - noseZ) / interocular;
}

/**
 * A small, cheap, EXPRESSION-INVARIANT geometric "signature" for the
 * current face — NOT a biometric-grade embedding, just enough to notice
 * "this no longer looks like the same head shape" so a second person
 * can't swap in mid-flow and finish someone else's liveness check.
 *
 * Deliberately excludes anything that moves with expression — mouth
 * width, jaw position, nose-to-chin distance, eyebrow position, etc. —
 * because those change a lot *by design* during the blink/head-turn/smile
 * gestures themselves, and comparing them mid-gesture is what causes
 * false "different person" flags on a single genuine candidate.
 *
 * Only bone-structure ratios are used, and the caller (useFaceLiveness)
 * should only sample this when the face is in a roughly neutral pose
 * (facing forward, eyes open, not actively smiling) for the same reason.
 */
export function computeFaceSignature(lm: NormalizedLandmark[]): number[] {
  const faceWidth = dist2D(lm[LEFT_CHEEK], lm[RIGHT_CHEEK]) || 1e-6;
  const faceHeight = dist2D(lm[FOREHEAD], lm[CHIN]) || 1e-6;
  const interocular = computeInterocularDistance(lm) || 1e-6;

  return [
    interocular / faceWidth, // eye separation relative to head width
    faceHeight / faceWidth, // skull aspect ratio
  ];
}

export function signatureDistance(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += (a[i] - b[i]) ** 2;
  return Math.sqrt(sum);
}

export interface FaceBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  widthFrac: number; // fraction of frame width occupied by the face
  heightFrac: number;
  centerX: number;
  centerY: number;
}

export function computeFaceBox(lm: NormalizedLandmark[]): FaceBox {
  let minX = 1, minY = 1, maxX = 0, maxY = 0;
  for (const p of lm) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  return {
    minX,
    minY,
    maxX,
    maxY,
    widthFrac: maxX - minX,
    heightFrac: maxY - minY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
  };
}

/* ------------------------------------------------------------------ */
/*  Frame metrics returned per detection call                          */
/* ------------------------------------------------------------------ */

export interface FrameMetrics {
  faceCount: number;
  landmarks: NormalizedLandmark[] | null;
  ear: number; // average of both eyes
  smileScore: number;
  yaw: number;
  box: FaceBox | null;
  depthSpread: number;
  signature: number[] | null; // expression-invariant; only meaningful on neutral frames
}

/* ------------------------------------------------------------------ */
/*  Detector class                                                     */
/* ------------------------------------------------------------------ */

export class FaceLivenessDetector {
  private landmarker: FaceLandmarker | null = null;
  private loading: Promise<void> | null = null;

  async load(): Promise<void> {
    if (this.landmarker) return;
    if (this.loading) return this.loading;

    this.loading = (async () => {
      const filesetResolver = await FilesetResolver.forVisionTasks(WASM_BASE_URL);
      this.landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: MODEL_ASSET_URL,
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numFaces: 2, // we only need to know if there's >1, capped for perf
        outputFaceBlendshapes: false,
        outputFacialTransformationMatrixes: false,
      });
    })();

    return this.loading;
  }

  get isReady(): boolean {
    return !!this.landmarker;
  }

  /** Run detection for the current video frame. Must call load() first. */
  detect(video: HTMLVideoElement, timestampMs: number): FrameMetrics {
    const empty: FrameMetrics = {
      faceCount: 0,
      landmarks: null,
      ear: 0,
      smileScore: 0,
      yaw: 0,
      box: null,
      depthSpread: 0,
      signature: null,
    };
    if (!this.landmarker) return empty;

    const result = this.landmarker.detectForVideo(video, timestampMs);
    const faces = result.faceLandmarks || [];
    if (faces.length === 0) return empty;

    // Use the first face for metrics, but report the true count so the
    // caller can flag "multiple faces".
    const lm = faces[0];
    return {
      faceCount: faces.length,
      landmarks: lm,
      ear: computeAvgEAR(lm),
      smileScore: computeSmileScore(lm),
      yaw: computeYaw(lm),
      box: computeFaceBox(lm),
      depthSpread: computeDepthSpread(lm),
      signature: computeFaceSignature(lm),
    };
  }

  close(): void {
    this.landmarker?.close();
    this.landmarker = null;
    this.loading = null;
  }
}