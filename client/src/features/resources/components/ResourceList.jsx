import { BookOpen } from "lucide-react";
import ResourceCard from "./ResourceCard";
import UserResourceCard from "./UserResourceCard";

export default function ResourceList({ data, onInteract, onEdit, onDelete,mode}) {
  if (!data || data.length === 0) {
    return (
      <div className="card-color border border-gray-200 dark:border-white/[0.07] rounded-2xl flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 subcard-color rounded-2xl flex items-center justify-center mb-4 border border-gray-200 dark:border-white/10">
          <BookOpen size={22} strokeWidth={1.5} className="subText-color" />
        </div>
        <h3 className="text-[15px] font-semibold text-color mb-1">No resources found</h3>
        <p className="text-[13px] subText-color max-w-xs leading-relaxed">
          Try a different search or filter, or be the first to upload one.
        </p>
      </div>
    );
  }

  return (

    mode === "publicResources" ? (
    <div className="space-y-3">
      {data.map((card) => (
        <ResourceCard
          key={card._id}
          card={card}
          onInteract={onInteract}
          onEdit={onEdit}
          onDelete={onDelete}
          
          
        />
      ))}
    </div>
  ) : (
    <div className="space-y-3">
      {data.map((card) => (
        <UserResourceCard
          key={card._id}
          card={card}
          onInteract={onInteract}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>

  )
  )
}
