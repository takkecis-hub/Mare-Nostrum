'use client';

import { useEffect, useRef, useState } from 'react';

interface TimerProps {
  /** Total seconds */
  duration: number;
  /** Called when timer reaches 0 */
  onExpired?: () => void;
  /** Whether the timer is running */
  running?: boolean;
}

export default function Timer({ duration, onExpired, running = true }: TimerProps) {
  const [remaining, setRemaining] = useState(duration);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setRemaining(duration);
  }, [duration]);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          onExpired?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, onExpired]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const urgent = remaining < 60;

  return (
    <div className={`timer ${urgent ? 'timer-urgent' : ''}`}>
      <span className="timer-display">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
