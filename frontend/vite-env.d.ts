/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE: string;  // add any env variables you use here
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  