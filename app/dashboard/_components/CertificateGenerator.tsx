"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { CertificatePreview } from "./CertificatePreview";
import { useRef } from "react";
import { toPng } from "html-to-image";

interface Props {
  open: boolean;
  onClose: () => void;
  userName: string;
  courseName: string;
  courseDuration: number;
}

export function CertificateModal({
  open,
  onClose,
  userName,
  courseName,
  courseDuration,
}: Props) {
  const [step, setStep] = useState<"choice" | "input" | "preview">("choice");
  const [customName, setCustomName] = useState("");
  const certificateRef = useRef<HTMLDivElement>(null);
  const finalName = customName.trim() || userName;

  if (!open) return null;

  const handleDownload = async () => {
    if (!certificateRef.current) return;

    const dataUrl = await toPng(certificateRef.current, {
      quality: 1,
      pixelRatio: 2,
    });

    const link = document.createElement("a");
    link.download = `certificate-${finalName}.png`;
    link.href = dataUrl;
    link.click();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-xl border bg-background p-6 shadow-lg">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-accent"
        >
          <X className="h-4 w-4" />
        </button>

        {/* STEP 1 */}
        {step === "choice" && (
          <>
            <h2 className="text-xl font-semibold">Generate Certificate</h2>

            <div className="mt-4 rounded-md border bg-muted px-4 py-3 text-center">
              {userName}
            </div>

            <div className="mt-6 space-y-3">
              <Button className="w-full" onClick={() => setStep("preview")}>
                Use This Name
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setStep("input")}
              >
                Use Another Name
              </Button>
            </div>
          </>
        )}

        {/* STEP 2 */}
        {step === "input" && (
          <>
            <h2 className="text-lg font-semibold">Enter Name</h2>

            <input
              className="mt-4 w-full rounded-md border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring"
              placeholder="Name on certificate"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />

            <div className="mt-5 flex gap-2">
              <Button
                className="flex-1"
                disabled={!customName.trim()}
                onClick={() => setStep("preview")}
              >
                Continue
              </Button>

              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep("choice")}
              >
                Back
              </Button>
            </div>
          </>
        )}

        {/* STEP 3 – CERTIFICATE PREVIEW */}
        {step === "preview" && (
          <>
            <div ref={certificateRef}>
              <CertificatePreview
                userName={finalName}
                courseName={courseName}
                courseDuration={courseDuration}
              />
            </div>

            <div className="mt-6 flex gap-2">
              <Button className="flex-1" onClick={handleDownload}>
                Download Certificate
              </Button>

              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep("choice")}
              >
                Edit Name
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
