import { useEffect, useRef, useState } from "react";
import { proctorLogger, ProctorEventType } from "../services/proctorLogger";

export const useProctoring = (
  isActive: boolean,
  attemptId: string,
  questionId?: string,
  durationSeconds: number = 120,
) => {
  const [violations, setViolations] = useState(0);
  const [remainingTime, setRemainingTime] = useState(durationSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const hasStartedRef = useRef(false);
  const isAwayRef = useRef(false);
  const isSubmittedRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const log = (type: ProctorEventType, metadata?: any) => {
    if (isSubmittedRef.current) return;

    proctorLogger.addLog({
      attemptId,
      questionId,
      type,
      metadata: {
        userAgent: navigator.userAgent,
        visibilityState: document.visibilityState,
        ...metadata,
      },
    });
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    clearTimer();

    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearTimer();
          log("AUTO_SUBMIT");
          isSubmittedRef.current = true;
          setIsSubmitted(true);
          return 0;
        }

        const next = prev - 1;

        // log every 10 seconds only
        if (next % 10 === 0) {
          log("TIMER_TICK", { remaining: next });
        }

        return next;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    clearTimer();
    setIsPaused(true);
  };

  const resumeTimer = () => {
    if (isSubmittedRef.current) return;

    setIsPaused(false);
    startTimer();
    log("TEST_RESUME");
  };

  const submitTest = () => {
    if (isSubmittedRef.current) return;

    clearTimer();
    log("SUBMIT");

    isSubmittedRef.current = true;
    setIsSubmitted(true);
  };

  useEffect(() => {
    if (!isActive || !attemptId || isSubmittedRef.current) return;

    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      log("TEST_START");
      startTimer();
    }

    const handleVisibilityChange = () => {
      if (isSubmittedRef.current) return;

      if (document.hidden && !isAwayRef.current) {
        isAwayRef.current = true;
        setViolations((v) => v + 1);
        log("TAB_SWITCH");
      }

      if (!document.hidden && isAwayRef.current) {
        isAwayRef.current = false;
        log("FOCUS_RESTORED");
      }
    };

    const handleFullscreenChange = () => {
      if (isSubmittedRef.current) return;

      if (!document.fullscreenElement) {
        setViolations((v) => v + 1);
        log("FULLSCREEN_EXIT");
        pauseTimer();
      }
    };

    const handleCopy = () => {
      if (!isSubmittedRef.current) log("COPY_ATTEMPT");
    };

    const handlePaste = () => {
      if (!isSubmittedRef.current) log("PASTE_ATTEMPT");
    };

    const handleCut = () => {
      if (!isSubmittedRef.current) log("CUT_ATTEMPT");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("cut", handleCut);

    return () => {
      clearTimer();

      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("cut", handleCut);
    };
  }, [isActive, attemptId]);

  return {
    violations,
    remainingTime,
    isPaused,
    isSubmitted,
    resumeTimer,
    submitTest,
  };
};
