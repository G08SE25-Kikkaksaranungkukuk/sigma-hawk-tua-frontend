import { Button } from "@/components/ui/button";
import { Crown, Trash2, Users } from "lucide-react";

interface Member {
  id: number;
  name: string;
  isOwner: boolean;
  tags?: string[];
}

interface Props {
  members: Member[];
  onDelete: (id: number) => void;
  onTransfer: (id: number) => void;
}

export default function MemberList({ members, onDelete, onTransfer }: Props) {
  return (
    <ul className="space-y-8">
      {members.map((m) => (
        <li
          key={m.id}
          className="flex items-center gap-4 bg-slate-900/80 rounded-xl px-4 py-3 shadow border border-orange-500/10 hover:scale-[1.02] transition-all"
        >
            <div className="flex w-full flex-row px-1 gap-4 justify-between">
                <div className="flex flex-row w-full gap-4">
                    <div className="h-[50px] flex flex-col items-center justify-center">
                        <div className="w-10 h-10 bg-orange rounded-xl text-xl font-semibold bg-orange-500/80 text-center items-center justify-center flex">
                            {m.name.charAt(0)}
                        </div>
                    </div>
                    <div className="flex h-full flex-col">
                        <div className="flex flex-row items-center justify-start gap-2">
                            <p className="text-lg font-semibold">{m.name}</p>
                            {(m.isOwner)? (
                                <Crown color="orange" size={18}></Crown>
                            ) : (
                                <span></span>
                            )}
                        </div>
                        <p className="text-sm">41Y Bangkok , Thailand</p>
                    </div>
                </div>
                <div className="flex flex-col h-[50px] justify-end items-end">
                    <div className="flex flex-row h-[30px] gap-2">
                        <button className="bg-amber-500/80 rounded-md p-1 w-auto font-semibold" onClick={()=>onTransfer(m.id)}>
                            <p className="text-sm">Promote</p>
                        </button>
                        <div className="bg-rose-400 rounded-md p-1 h-auto flex items-center justify-center" onClick={()=>{onDelete(m.id)}}><Trash2 size={18}></Trash2></div>
                    </div>
                </div>
            </div>
        </li>
      ))}
    </ul>
  );
}