/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_MIDTRANS_CLIENT_KEY?: string;
  /** When `"true"`, loads production Snap script and must match backend MIDTRANS_IS_PRODUCTION. */
  readonly VITE_MIDTRANS_IS_PRODUCTION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
