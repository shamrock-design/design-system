export interface ShamrockAsset {
  path: string;
  category: "illustrations" | "lottie" | "rive" | "gifs" | "raster";
  bytes: number;
  sha256: string;
}
declare const manifest: { assets: ShamrockAsset[] };
export default manifest;
