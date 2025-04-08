// In global.d.ts or a similar declaration file
declare module "quill-image-resize-module" {
  const ImageResize: any;
  export = ImageResize; // Using "export =" instead of "export default"
}
