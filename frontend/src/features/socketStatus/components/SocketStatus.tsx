"use client";

import { useSocketStatus } from "../hooks/use-socket-status.hook";

const SocketStatus = () => {
  const { isConnected, connectionError } = useSocketStatus();

  return (
    <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 backdrop-blur-md">
      <span className="relative flex h-2.5 w-2.5">
        {isConnected && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        )}

        <span
          className={`relative inline-flex h-2.5 w-2.5 rounded-full shadow-[0_0_10px] transition-all duration-300 ${
            isConnected
              ? "bg-emerald-400 shadow-emerald-400/80"
              : connectionError
                ? "bg-red-400 shadow-red-400/70"
                : "bg-gray-500 shadow-gray-500/50"
          }`}
        />
      </span>

      <span
        className={`text-xs font-medium tracking-wide transition-colors duration-300 ${
          isConnected
            ? "text-emerald-300"
            : connectionError
              ? "text-red-400"
              : "text-gray-400"
        }`}
      >
        {isConnected
          ? "Live updates active"
          : connectionError
            ? "Connection error"
            : "Disconnected"}
      </span>
    </div>
  );
};

export default SocketStatus;
