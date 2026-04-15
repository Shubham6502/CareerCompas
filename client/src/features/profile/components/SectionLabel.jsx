export default function SectionLabel({ children }) {
  return (
    <p
      className="text-xs font-bold tracking-widest uppercase mb-3"
      style={{ color: "#58a6ff" }}
    >
      {children}
    </p>
  );
}