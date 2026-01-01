"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

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
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground"
        >
          ✕
        </button>

        {step === "choice" && (
          <>
            <h2 className="text-xl font-semibold mb-4">Generate Certificate</h2>

            <p className="text-sm mb-2">Your name on record:</p>
            <div className="border rounded-md p-3 font-semibold text-center">
              {userName}
            </div>

            <div className="space-y-3 mt-6">
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

        {step === "input" && (
          <>
            <h2 className="text-lg font-semibold mb-3">Enter Name</h2>

            <input
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="Name on certificate"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />

            <div className="flex gap-2">
              <Button
                disabled={!customName.trim()}
                onClick={() => alert(customName)}
              >
                Generate
              </Button>

              <Button variant="outline" onClick={() => setStep("choice")}>
                Back
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
