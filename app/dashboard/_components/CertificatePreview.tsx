"use client";
interface CertificatePreviewProps {
  userName: string;
  courseName: string;
  courseDuration: number;
}

function getTodayDate() {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function CertificatePreview({
  userName,
  courseName,
  courseDuration,
}: CertificatePreviewProps) {
  const todayDate = getTodayDate();
  return (
    <div className="w-full rounded-xl border border-gray-300 bg-white p-6 shadow-sm">
      {/* Outer border */}
      <div className="rounded-lg border-2 border-gray-400 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="logo" className="h-30 w-30" />
            <h3 className="text-lg font-bold text-blue-600">UDAYAM AI LABS</h3>
          </div>

          <p className="text-xs text-gray-600">ID: CERT-{Date.now()}</p>
        </div>

        {/* Content */}
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-600">Certificate of Completion</p>

          <h1 className="mt-3 text-2xl font-bold text-blue-500">
            {courseName}
          </h1>

          {/* Certificate Sentence */}
          <p className="mt-6 max-w-2xl mx-auto text-sm text-gray-700 leading-relaxed">
            Mr/Ms/Mrs{" "}
            <span className="font-semibold text-black">{userName}</span> has
            successfully completed the{" "}
            <span className="font-semibold text-black">{courseName}</span>{" "}
            program on{" "}
            <span className="font-semibold text-black">{todayDate}</span>.
          </p>

          <p className="mt-4 text-sm text-gray-600">
            Duration: {courseDuration} hours
          </p>
        </div>

        {/* Signatures */}
        <div className="mt-12 flex items-end justify-between">
          <div className="text-center">
            <div className="h-px w-40 bg-gray-400 mx-auto" />
            <p className="mt-2 text-sm font-medium text-black">
              Udayraj Patare
            </p>
            <p className="text-xs text-gray-600">CEO, Udayam AI Labs</p>
          </div>

          <div className="text-center">
            <div className="h-px w-40 bg-gray-400 mx-auto" />
            <p className="mt-2 text-sm font-medium text-black">Sarthak Sathu</p>
            <p className="text-xs text-gray-600">Co-Founder, Udayam AI Labs</p>
          </div>
        </div>
      </div>
    </div>
  );
}
