/**
 * Cloudflare Turnstile widget — Duolingo-styled.
 * Calls onVerify(token) on success, onExpire() when the challenge expires.
 * Every auth submission requires a real token verified by the backend.
 */
import React, { useCallback, useEffect, useState } from "react";

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

function TurnstileReal({ onVerify, onExpire, className }) {
  const [TurnstileComp, setTurnstileComp] = useState(null);
  const [status, setStatus] = useState("idle");
  const [widgetKey, setWidgetKey] = useState(0);

  useEffect(() => {
    import("@marsidev/react-turnstile").then((mod) => {
      setTurnstileComp(() => mod.Turnstile);
    });
  }, []);

  const handleSuccess = useCallback((token) => {
    setStatus("idle");
    if (onVerify) onVerify(token);
  }, [onVerify]);

  const handleExpire = useCallback(() => {
    setStatus("idle");
    setWidgetKey((prev) => prev + 1);
    if (onExpire) onExpire();
  }, [onExpire]);

  const handleError = useCallback(() => {
    setStatus("error");
    setWidgetKey((prev) => prev + 1);
    if (onExpire) onExpire();
  }, [onExpire]);

  return (
    <div className={`flex flex-col w-full gap-1.5 ${className}`}>
      <div className="w-full min-h-[68px] flex items-center justify-center">
        {TurnstileComp ? (
          <TurnstileComp
            key={widgetKey}
            siteKey={SITE_KEY}
            onSuccess={handleSuccess}
            onExpire={handleExpire}
            onError={handleError}
            options={{ theme: "auto", size: "flexible" }}
            className="w-full"
          />
        ) : (
          <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 border-t-[#2C2DE0] animate-spin" />
        )}
      </div>

      {status === "error" && (
        <p className="text-[11px] text-red-500 text-center font-semibold">
          Verification failed. Please try again.
        </p>
      )}
    </div>
  );
}

export default function TurnstileWidget({ onVerify, onExpire, className = "" }) {
  if (!SITE_KEY) {
    return (
      <div className={`text-[11px] text-red-500 text-center py-1 w-full ${className}`}>
        Cloudflare Turnstile is not configured for this local environment.
      </div>
    );
  }

  return <TurnstileReal onVerify={onVerify} onExpire={onExpire} className={className} />;
}