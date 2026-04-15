export default function MembersPanel({ isOwner }) {
  const members = ["Shubham", "Priya", "Rahul"];

  return (
    <div className="card-color p-6 rounded-xl border border-gray-700">
      <h2 className="mb-4 font-semibold">Members</h2>

      {members.map((member, i) => (
        <div key={i} className="flex justify-between mb-3">
          <span className="cursor-pointer hover:text-blue-400">
            {member}
          </span>

          {isOwner && member !== "Shubham" && (
            <button className="text-red-400 text-sm">
              Block
            </button>
          )}
        </div>
      ))}
    </div>
  );
}