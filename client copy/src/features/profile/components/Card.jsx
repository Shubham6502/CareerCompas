export default function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-xl p-5 card-color ${className}`}
      
    >
      {children}
    </div>
  );
}