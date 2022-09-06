import JSZip from "jszip";
declare global {
  interface Window {
    gVar: any;
    JSZip: JSZip;
  }
}
declare const initLibraries: () => Promise<void>;
export { initLibraries };
//# sourceMappingURL=initLib.d.ts.map
