import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  onAdd: (name: string) => void;
}

export default function AddUserForm({ onAdd }: Props) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim());
      setName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter user name"
        className="px-4 py-2 rounded-lg border border-orange-500/40 bg-slate-900/80 text-gray-200"
      />
      <Button
        type="submit"
        className="bg-orange-500 hover:bg-orange-600 text-black px-4"
      >
        Add User
      </Button>
    </form>
  );
}