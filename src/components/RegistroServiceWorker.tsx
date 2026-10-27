"use client";

import { useEffect } from "react";

export function RegistroServiceWorker() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      void navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          void reg.update();
        })
        .catch(() => {
          // Falha silenciosa em ambientes que não suportam Service Worker
        });
    }
  }, []);

  return null;
}
