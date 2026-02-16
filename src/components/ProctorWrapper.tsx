import React, { useMemo, useState } from "react";
import { useProctoring } from "../hooks/useProctoring";

type Props = {
  children: React.ReactNode;
  questionId?: string;
  durationSeconds?: number;
};

export const ProctorWrapper: React.FC<Props> = ({
  children,
  questionId,
  durationSeconds = 120,
}) => {
  const [started, setStarted] = useState(false);

  const attemptId = useMemo(() => {
    const existing = localStorage.getItem("attempt_id");
    if (existing) return existing;

    const newId = crypto.randomUUID();
    localStorage.setItem("attempt_id", newId);
    return newId;
  }, []);

  const {
    violations,
    remainingTime,
    isPaused,
    isSubmitted,
    resumeTimer,
    submitTest,
  } = useProctoring(started, attemptId, questionId, durationSeconds);

  const startTest = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setStarted(true);
    } catch {
      alert("Fullscreen permission is required to start the test.");
    }
  };

  const resumeFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      resumeTimer();
    } catch {
      alert("Fullscreen is required to continue.");
    }
  };

  if (!started) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Secure Assessment</h2>
        <button onClick={startTest}>Start Test</button>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Test Submitted</h2>
        <p>Thank you for completing the assessment.</p>
      </div>
    );
  }

  if (isPaused) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Fullscreen Required</h2>
        <p>You exited fullscreen. Please re-enter to continue.</p>
        <button onClick={resumeFullscreen}>Resume Test</button>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          padding: 10,
          background: "#f5f5f5",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>Violations: {violations}</div>
        <div>Time Left: {remainingTime}s</div>
        <button onClick={submitTest}>Submit</button>
      </div>

      {children}
    </div>
  );
};
