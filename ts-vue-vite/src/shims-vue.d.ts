declare module "*.vue" {
  import type { defineComponent } from "vue";

  const Component: ReturnType<typeof defineComponent>;
  export default Component;
}
declare module "*.png";
declare module "*.svg";
declare module "*.jpeg";
declare module "*.jpg";
