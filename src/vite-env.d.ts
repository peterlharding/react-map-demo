/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAPS_API_KEY?: string;
  readonly MAPS_MAP_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
