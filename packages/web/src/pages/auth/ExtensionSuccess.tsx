import { useEffect, useState } from 'react';
import { CheckCircle, Chrome } from 'lucide-react';

export default function ExtensionSuccess() {
  const [countdown, setCountdown] = useState(3);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setClosing(true);

          // Try multiple ways to close
          // 1. Send message to extension to close this tab
          window.postMessage({ type: 'EXTENSION_AUTH_SUCCESS_CLOSE' }, '*');

          // 2. Try window.close() (works if opened via window.open)
          window.close();

          // 3. Fallback: redirect to a blank page or show manual close message
          setTimeout(() => {
            // If still open after 500ms, tab couldn't be closed automatically
            setClosing(false);
          }, 500);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Success Card */}
        <div className="bg-card border border-border rounded-2xl p-8 text-center shadow-lg">
          {/* Animated Success Icon */}
          <div className="relative mx-auto w-20 h-20 mb-6">
            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-foreground mb-2">
            You're all set!
          </h1>
          <p className="text-muted-foreground mb-8">
            Successfully connected to KeyScore extension
          </p>

          {/* Extension Instructions */}
          <div className="bg-muted/50 rounded-xl p-5 mb-6 text-left">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Chrome className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Return to your job search
                </h3>
                <p className="text-sm text-muted-foreground">
                  {countdown > 0
                    ? "This tab will close automatically. Click the extension icon to start analyzing jobs."
                    : "You can close this tab and click the extension icon to start analyzing jobs."
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Auto Close Notice */}
          {countdown > 0 ? (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span>Closing in {countdown}s...</span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              ✓ You can now close this tab
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
