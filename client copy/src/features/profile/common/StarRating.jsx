// components/common/StarRating.jsx
export default function StarRating({ value, max = 5 }) {
  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < value ? "text-purple-400" : "text-gray-600"}>
          ★
        </span>
      ))}
      <span className="text-xs text-gray-400 ml-1">{value}/{max}</span>
    </div>
  );
}