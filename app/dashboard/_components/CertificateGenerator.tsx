"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  userName: string;
}

export function CertificateModal({ open, onClose, userName }: Props) {
  const [step, setStep] = useState<"choice" | "input">("choice");
  const [customName, setCustomName] = useState("");
  const finalName = step === "choice" ? userName : customName;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl border bg-background p-6 text-foreground shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        {/* STEP 1 */}
        {step === "choice" && (
          <>
            <h2 className="text-xl font-semibold">Generate Certificate</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose the name to appear on your certificate
            </p>

            <div className="mt-4 rounded-md border bg-muted px-4 py-3 text-center font-medium">
              {userName}
            </div>

            <div className="mt-6 space-y-3">
              <Button className="w-full" onClick={() => alert(finalName)}>
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
            <p className="mt-1 text-sm text-muted-foreground">
              This will be printed on your certificate
            </p>

            <input
              className="mt-4 w-full rounded-md border bg-background px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Name on certificate"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />

            <div className="mt-5 flex gap-2">
              <Button
                className="flex-1"
                disabled={!customName.trim()}
                onClick={() => alert(customName)}
              >
                Generate
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
      </div>
    </div>
  );
}
