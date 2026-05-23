declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options: {
          language?: string;
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

const snapScriptSrc = (isProduction: boolean) =>
  isProduction ? "https://app.midtrans.com/snap/snap.js" : "https://app.sandbox.midtrans.com/snap/snap.js";

/**
 * Injects Midtrans Snap.js once. Client key must match the server key environment (sandbox vs production).
 */
export function loadMidtransSnapScript(clientKey: string, isProduction: boolean): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.snap?.pay) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    document.querySelectorAll('script[data-midtrans-snap="1"]').forEach(el => el.remove());

    const script = document.createElement("script");
    script.src = snapScriptSrc(isProduction);
    script.async = true;
    script.setAttribute("data-client-key", clientKey);
    script.setAttribute("data-midtrans-snap", "1");
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Gagal memuat skrip Midtrans Snap"));
    document.body.appendChild(script);
  });
}
