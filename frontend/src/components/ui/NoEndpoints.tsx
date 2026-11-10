
"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCodeBranch,
  faArrowDown,
  faBolt,
} from "@fortawesome/free-solid-svg-icons";

const NoEndpoints = () => {
  return (
    <div className="relative flex min-h-112.5 w-full flex-col items-center justify-center overflow-hidden px-6 text-center">

      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-64 w-64 rounded-full border border-dashed border-pink-800/70" />
        <div className="absolute h-80 w-80 rounded-full border border-pink-800/40" />
      </div>

      {/* Animated icon */}
      <div className="relative mb-7">
        <div className="absolute inset-0 animate-ping rounded-2xl bg-blue-500/10" />

        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-gray-700/80 bg-gray-900 shadow-xl shadow-blue-500/5">
          <FontAwesomeIcon
            icon={faCodeBranch}
            className="text-3xl text-pink-400"
          />
        </div>

        {/* Status indicator */}
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-gray-950 bg-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="mb-3 flex items-center justify-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-500">
            Listening for endpoints
          </span>
        </div>

        <h2 className="mb-3 text-xl font-semibold tracking-tight text-white">
          Nothing here... yet.
        </h2>

        <p className="mx-auto max-w-sm text-sm leading-6 text-gray-400">
          Your webhook workspace is waiting for its first endpoint.
          Create one to start capturing incoming requests and
          exploring their payloads.
        </p>
      </div>

      {/* Bottom decorative indicator */}
      <div className="relative mt-8 flex items-center gap-3 rounded-full border border-gray-800 bg-gray-900/80 px-4 py-2">
        <FontAwesomeIcon
          icon={faBolt}
          className="text-xs text-amber-400"
        />
        <span className="text-xs text-gray-500">
          Your next webhook starts here
        </span>
        <FontAwesomeIcon
          icon={faArrowDown}
          className="text-xs text-gray-600"
        />
      </div>
    </div>
  );
};

export default NoEndpoints;
