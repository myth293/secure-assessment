import React, { useEffect } from "react";
import { ProctorWrapper } from "./components/ProctorWrapper";

function App() {
  // Clear logs on every app load 
  useEffect(() => {
    localStorage.removeItem("proctor_logs");
  }, []);

  return (
    <ProctorWrapper questionId="Q1">
      <div style={{ padding: 40 }}>
        <h1>Assessment Question</h1>
        <p>
          Explain how React hooks work and why dependency arrays are important.
        </p>

        <textarea
          rows={8}
          style={{ width: "100%", marginTop: 20 }}
          placeholder="Write your answer here..."
        />
      </div>
    </ProctorWrapper>
  );
}

export default App;
