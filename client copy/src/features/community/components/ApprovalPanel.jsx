export default function ApprovalPanel({ close }) {
  const requests = ["Rahul", "Aarav"];

  return (
    <div className="fixed inset-0 flex justify-end bg-black/50 z-50">
      <div className="w-full sm:w-96 card-color p-6 border-l border-gray-700">
        <h2 className="text-lg font-semibold mb-4">
          Join Requests
        </h2>

        {requests.map((user, i) => (
          <div key={i} className="flex justify-between mb-3">
            <span>{user}</span>
            <button className="bg-green-600 px-3 py-1 rounded">
              Approve
            </button>
          </div>
        ))}

        <button
          onClick={close}
          className="mt-6 text-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  );
}