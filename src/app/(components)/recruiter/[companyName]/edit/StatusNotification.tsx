"use client";

interface StatusNotificationProps {
  type: "success" | "error" | null;
  message: string;
}

export default function StatusNotification({ type, message }: StatusNotificationProps) {
  if (!type) return null;

  return (
    <div
      className={`px-4 py-2 text-sm text-center ${
        type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
      }`}
      role="alert"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
