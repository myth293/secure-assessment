export type ProctorEventType =
  | "TEST_START"
  | "TEST_END"
  | "TEST_RESUME"
  | "TAB_SWITCH"
  | "FOCUS_RESTORED"
  | "FULLSCREEN_EXIT"
  | "COPY_ATTEMPT"
  | "PASTE_ATTEMPT"
  | "CUT_ATTEMPT"
  | "TIMER_TICK"
  | "SUBMIT"
  | "AUTO_SUBMIT";

export interface ProctorLog {
  attemptId: string;
  questionId?: string;
  type: ProctorEventType;
  metadata?: Record<string, any>;
  timestamp: number;
}

class ProctorLogger {
  private logs: ProctorLog[] = [];

  addLog(log: Omit<ProctorLog, "timestamp">) {
    const entry: ProctorLog = {
      ...log,
      timestamp: Date.now(),
    };

    this.logs.push(entry);

    localStorage.setItem("proctor_logs", JSON.stringify(this.logs));
  }

  getLogs(): ProctorLog[] {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
    localStorage.removeItem("proctor_logs");
  }
}

export const proctorLogger = new ProctorLogger();
