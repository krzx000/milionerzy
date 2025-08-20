"use client";

export interface AudienceVotingModalProps {
  isActive: boolean;
}

export function AudienceVotingModal({ isActive }: AudienceVotingModalProps) {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded">
        <h3 className="text-xl mb-4">🗳️ Trwa głosowanie publiczności...</h3>
        <div className="animate-pulse bg-blue-500 w-16 h-16 rounded-full mx-auto"></div>
      </div>
    </div>
  );
}
