import type { Bracket } from "../generateBracket";

type BracketViewProps = {
  bracket: Bracket;
};

export function BracketView({ bracket }: BracketViewProps) {
  return (
    <div style={{ marginTop: "24px" }}>
      <h2>Tournament Bracket</h2>

      <div
        style={{
          display: "flex",
          gap: "24px",
          overflowX: "auto",
        }}
      >
        {bracket.rounds.map((round) => (
          <div key={round.roundNumber}>
            <h3>Round {round.roundNumber}</h3>

            {round.matches.map((match) => (
              <div
                key={match.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "8px",
                  marginBottom: "12px",
                  minWidth: "140px",
                }}
              >
                <div>{match.player1?.name || "TBD"}</div>
                <div>{match.player2?.name || "TBD"}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
