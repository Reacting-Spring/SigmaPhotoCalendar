/// <reference types="vite-plugin-pwa/client" />
/// <reference types="vite-plugin-pwa/client/react" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
