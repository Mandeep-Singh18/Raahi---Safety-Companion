"use client";

import { useState } from "react";
import type { SessionMode, GeoLocation } from "@/types";
import { getSessionModeDisplayInfo } from "@/lib/session";

interface SessionSetupProps {
  onStart: (mode: SessionMode, durationMinutes: number, location: GeoLocation | null) => void;
}

const SESSION_MODES: SessionMode[] = ["walking", "cab", "meeting"];

type GeoState = "idle" | "requesting" | "denied" | "unavailable" | "ready";

export function SessionSetup({ onStart }: SessionSetupProps) {
  const [selectedMode, setSelectedMode] = useState<SessionMode>("walking");
  const [duration, setDuration] = useState(15);
  const [geoState, setGeoState] = useState<GeoState>("idle");
  const [capturedLocation, setCapturedLocation] = useState<GeoLocation | null>(null);

  async function handleStart() {
    // Request location and then start regardless of outcome
    setGeoState("requesting");

    if (!navigator.geolocation) {
      setGeoState("unavailable");
      onStart(selectedMode, duration, null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const location: GeoLocation = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        };
        setCapturedLocation(location);
        setGeoState("ready");
        onStart(selectedMode, duration, location);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setGeoState("denied");
        } else {
          setGeoState("unavailable");
        }
        // Start session without location — safety is still active
        onStart(selectedMode, duration, null);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  }

  return (
    <div className="space-y-8">
      {/* Mode selector */}
      <fieldset>
        <legend className="mb-4 text-base font-semibold text-white">What are you doing?</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {SESSION_MODES.map((mode) => {
            const info = getSessionModeDisplayInfo(mode);
            const isSelected = selectedMode === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => setSelectedMode(mode)}
                aria-pressed={isSelected}
                className={`flex flex-col items-center gap-2 rounded-2xl border p-5 text-center transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-slate-900
                  ${
                    isSelected
                      ? "border-violet-500 bg-violet-900/40 ring-2 ring-violet-500/30"
                      : "border-slate-700 bg-slate-800/40 hover:border-slate-500 hover:bg-slate-800"
                  }`}
              >
                <span className="text-3xl" role="img" aria-label={info.label}>
                  {info.icon}
                </span>
                <span className={`text-sm font-semibold ${isSelected ? "text-violet-300" : "text-slate-300"}`}>
                  {info.label}
                </span>
                <span className="text-xs text-slate-500">{info.description}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Duration picker */}
      <div className="space-y-3">
        <label htmlFor="duration" className="block text-base font-semibold text-white">
          Check-in time
          <span className="ml-2 text-sm font-normal text-slate-400">(how long before an alert is sent)</span>
        </label>
        <div className="flex items-center gap-4">
          <input
            id="duration"
            type="range"
            min={1}
            max={120}
            step={1}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-slate-700
              accent-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
            aria-label={`Check-in duration: ${duration} minutes`}
          />
          <div className="flex w-24 items-center justify-center rounded-xl bg-slate-800 px-3 py-2">
            <input
              type="number"
              value={duration}
              onChange={(e) => {
                const v = Math.max(1, Math.min(120, Number(e.target.value)));
                setDuration(v);
              }}
              min={1}
              max={120}
              aria-label="Duration in minutes"
              className="w-10 bg-transparent text-center text-lg font-bold text-white focus:outline-none"
            />
            <span className="ml-1 text-sm text-slate-400">min</span>
          </div>
        </div>
        <p className="text-xs text-slate-500">Drag or type a value between 1 and 120 minutes.</p>
      </div>

      {/* Geolocation state feedback */}
      {geoState === "denied" && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-950/40 px-4 py-3"
        >
          <span aria-hidden="true" className="mt-0.5 text-amber-400">⚠</span>
          <div>
            <p className="text-sm font-medium text-amber-300">Location access denied</p>
            <p className="text-sm text-amber-400/80">
              Your session is starting without location. Enable location in browser settings for better safety coverage.
            </p>
          </div>
        </div>
      )}
      {geoState === "unavailable" && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-950/40 px-4 py-3"
        >
          <span aria-hidden="true" className="mt-0.5 text-amber-400">⚠</span>
          <div>
            <p className="text-sm font-medium text-amber-300">Location unavailable</p>
            <p className="text-sm text-amber-400/80">
              Could not get your location. Your session is still active — contacts will be alerted if you don't check in.
            </p>
          </div>
        </div>
      )}

      {/* Start button */}
      <button
        type="button"
        onClick={handleStart}
        disabled={geoState === "requesting"}
        className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-violet-500 px-6 py-4
          text-base font-bold text-white shadow-lg shadow-violet-900/40 transition-all duration-200
          hover:from-violet-500 hover:to-violet-400 hover:shadow-violet-800/50
          active:scale-95 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2
          focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {geoState === "requesting" ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Getting your location...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span aria-hidden="true">🛡</span> Start Safety Session
          </span>
        )}
      </button>
    </div>
  );
}
