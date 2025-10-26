import { Crown, Trash2 } from "lucide-react";

interface Member {
    user_id: number
    first_name: string
    middle_name: any
    last_name: string
    sex: string
    profile_url: any
    interests: string[]
    travel_styles: string[]
    isOwner? : boolean
    birth_date? : Date
}

interface Props {
  members: Member[];
  onDelete: (id: number) => void;
  onTransfer: (id: number) => void;
}


// Helper to calculate age from birthdate string or Date
function getAge(birthDate: Date | string | undefined): number | null {
  if (!birthDate) return null;
  const date = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  if (isNaN(date.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const m = today.getMonth() - date.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
    age--;
  }
  return age;
}

export default function MemberList({ members, onDelete, onTransfer }: Props) {
  return (
    <ul className="space-y-8">
      {members.sort((x,y)=>x.isOwner ? -1 : 1).map((m) => (
        <li
          key={m.user_id}
          className="flex items-center gap-4 bg-slate-900/80 rounded-xl px-4 py-3 shadow border border-orange-500/10 hover:scale-[1.02] transition-all"
        >
            <div className="flex w-full flex-row px-1 gap-4 justify-between">
                <div className="flex flex-row w-full gap-4">
                    <div className="h-[50px] flex flex-col items-center justify-center">
                        <div className="w-10 h-10 bg-orange rounded-xl text-xl font-semibold bg-orange-500/80 text-center items-center justify-center flex">
                            {m.first_name.charAt(0)}
                        </div>
                    </div>
                    <div className="flex h-full flex-col">
                        <div className="flex flex-row items-center justify-start gap-2">
                            <p className="text-lg font-semibold text-gray-300">{m.first_name} {Array.from(m.last_name).splice(0,2)}.</p>
                            {(m.isOwner)? (
                                <Crown color="orange" size={18}></Crown>
                            ) : (
                                <span></span>
                            )}
                        </div>
                        <p className="text-sm text-gray-300">{m.birth_date && getAge(m.birth_date) ? `${getAge(m.birth_date)}Y` : '-'} Bangkok, Thailand</p>
                    </div>
                </div>
                <div className="flex flex-col h-[50px] justify-end items-end">
                  {(!m.isOwner) && (
                    <div className="flex flex-row h-[30px] gap-2">
                        <button className="bg-amber-500/80 rounded-md p-1 w-auto font-semibold" onClick={()=>onTransfer(m.user_id)} title="Promote to owner">
                            <p className="text-sm text-black">Promote</p>
                        </button>
                        <button className="bg-rose-400 rounded-md p-1 h-auto flex items-center justify-center text-black" onClick={()=>{onDelete(m.user_id)}} title="Remove member"><Trash2 size={18}></Trash2></button>
                    </div>
                  )}
                </div>
            </div>
        </li>
      ))}
    </ul>
  );
}