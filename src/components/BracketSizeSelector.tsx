type BracketSizeSelectorProps = {
  selectedSize: number | null;
  onSelectSize: (size: number) => void;
};

const SIZES = [4, 8, 16, 32, 64, 128, 256];

export function BracketSizeSelector({
  selectedSize,
  onSelectSize,
}: BracketSizeSelectorProps) {
  return (
    <div>
      <h2>Select Bracket Size</h2>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {SIZES.map((size) => (
          <button
            key={size}
            onClick={() => onSelectSize(size)}
            style={{
              padding: "8px 12px",
              fontWeight: selectedSize === size ? "bold" : "normal",
              backgroundColor: selectedSize === size ? "#ddd" : "#fff",
            }}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
