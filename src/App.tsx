import { useState } from "react";
import { SetupPanel } from "./components/SetupPanel";
import { generateBracket } from "./generateBracket";
import { BracketView } from "./components/BracketView";
import type { Bracket } from "./generateBracket";

function App() {
  // =======================
  // STATE
  // =======================

  const [bracketSize, setBracketSize] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bracket, setBracket] = useState<Bracket | null>(null);

  // =======================
  // HANDLERS
  // =======================

  const handleCreateBracket = (names: string[]) => {
    if (!bracketSize) return;

    // Validation
    if (names.length !== bracketSize) {
      setError(
        `Expected ${bracketSize} names, but got ${names.length}. Please try again.`,
      );
      return;
    }

    // Clear errors
    setError(null);

    // Generate bracket
    const newBracket = generateBracket(bracketSize, names);

    // Save to state
    setBracket(newBracket);

    console.log("Generated Bracket:", newBracket);
  };

  const handleReset = () => {
    setBracket(null);
    setBracketSize(null);
    setError(null);
  };

  // =======================
  // RENDER
  // =======================

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Tournament Bracket Generator</h1>

      {/* =======================
          SETUP MODE
      ======================= */}
      {!bracket && (
        <SetupPanel
          bracketSize={bracketSize}
          setBracketSize={setBracketSize}
          onCreateBracket={handleCreateBracket}
          error={error}
        />
      )}

      {/* =======================
          BRACKET MODE (TEMP VIEW)
      ======================= */}
      {bracket && (
        <div style={{ marginTop: "24px" }}>
          <h2>Bracket Created ✅</h2>

          <button onClick={handleReset} style={{ marginBottom: "16px" }}>
            Reset
          </button>

          {bracket && (
            <div style={{ marginTop: "24px" }}>
              <button onClick={handleReset} style={{ marginBottom: "16px" }}>
                Reset
              </button>

              <BracketView bracket={bracket} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
