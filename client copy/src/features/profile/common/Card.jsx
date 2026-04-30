// components/common/Card.jsx
export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-[#0e0e1b] border border-[#1c1c34] rounded-2xl p-5 ${className}`}>
      {children}
    </div>
  );
}