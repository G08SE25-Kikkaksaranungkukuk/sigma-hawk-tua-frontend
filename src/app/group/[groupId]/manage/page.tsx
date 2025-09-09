"use client";
import React, { useState } from "react";
import MemberList from "@/components/group/manage/MemberList";
import TravelInviteModal from "@/components/TravelInviteModal";
import { Sparkles, Users, MapPin } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { PopupCard } from "@/components/ui/popup-card";
import { AxiosError } from "axios";
import {use} from "react";
import { apiClient } from "@/lib/api";
import { GroupData, Member } from "@/lib/types/home/group";


interface GroupManagePageProps {
  params?: { groupId?: string };
}

export default function GroupManagementPage({params} : {params : Promise<GroupManagePageProps>}) {  
  const {groupId} : any = use(params);
  const [groupData, setGroupData] = useState<GroupData>({});
  const [inviteOpen, setInviteOpen] = useState(false);
  const [confirmTransferOpen, setConfirmTransferOpen] = useState(false);
  const [transferTargetId, setTransferTargetId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [pageUrl,setPageUrl] = React.useState<string>("");

  React.useEffect(()=>{
    (async () => {
      const ret =  await (await apiClient.get(`/group/${groupId}`)).data as {data : GroupData};
      const processed_members = ret.data.members?.map((val : Member)=>{return {...val,isOwner : val.user_id == ret.data.group_leader_id}}) ?? [];
      if (window) {
        setPageUrl(window.location.protocol + "//" + window.location.host + "/group/" + groupId + "/info");
      }
      setGroupData({...ret.data,members : processed_members})
    })()
  },[])
  
  const handleDeleteRequest = (id: number) => {
    setPendingDeleteId(id);
  };

  const confirmDeleteMember = async () => {
    try {
      if (pendingDeleteId !== null) {
        await apiClient.delete(`/group/${groupId}/member`,{
          data : {
            "user_id" : pendingDeleteId
          },
          withCredentials : true
        })
        const memberList = (groupData.members ?? []).filter(m => m.user_id !== pendingDeleteId)
        setGroupData({...groupData,members : memberList});
        setPendingDeleteId(null);
      }
    }
    catch(error : unknown) {
      if(error instanceof AxiosError) {
        console.log(error)
        alert("[403] Unauthorized")
      }
    }
  };

  const handleTransferRequest = (id: number) => {
    setTransferTargetId(id);
    setConfirmTransferOpen(true);
  };

  const confirmTransferOwnership = async () => {
    try {
      if (transferTargetId !== null) {
        await apiClient.patch(`/group/${groupId}/owner`, {
            "user_id" : transferTargetId
          },{
          withCredentials : true
        })
        window.location.href = `/group/${groupId}/info`
        const newMemberList = (groupData.members ?? []).map(m => ({
          ...m,
          isOwner: m.user_id === transferTargetId
        }))
        setGroupData({...groupData,members : newMemberList});
        setConfirmTransferOpen(false);
        setTransferTargetId(null);
      }
    }
    catch(error : unknown) {
      if(error instanceof AxiosError) {
        console.log(error)
        alert("[403] Unauthorized")
      }
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 bg-floating-shapes relative">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-12 h-12 bg-orange-500/20 rounded-full float"></div>
        <div className="absolute top-60 right-16 w-8 h-8 bg-orange-400/30 rounded-full float-delayed"></div>
        <div className="absolute bottom-40 left-20 w-16 h-16 bg-orange-600/20 rounded-full float-delayed-2"></div>
        <Sparkles className="absolute top-32 right-32 text-orange-500/30 w-6 h-6 float" />
        <Users className="absolute bottom-32 left-32 text-orange-400/30 w-5 h-5 float-delayed" />
        <MapPin className="absolute top-1/2 right-10 text-orange-300/30 w-4 h-4 float-delayed-2" />
      </div>
      <div className="max-w-md mx-auto relative z-10">
        <div className="flex items-center mb-6 pt-4 slide-up">
          <h1 className="text-xl font-semibold text-white">
            Manage Your Group
          </h1>
        </div>
        <div className="shadow-2xl border border-orange-500/20 bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 card-hover bounce-in">
          <h2 className="text-2xl font-bold text-orange-400 mb-4 text-center">
            Group Members
          </h2>
          <MemberList
            members={groupData.members ?? []}
            onDelete={handleDeleteRequest}
            onTransfer={handleTransferRequest}
          />
          <div className="flex flex-col justify-center mt-6 gap-y-4">
            <button
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-black font-semibold shadow btn-hover-lift border-0 orange-glow"
              onClick={() => setInviteOpen(true)}
            >
              Generate Invite Link
            </button>
            <button
              className="px-4 py-2 rounded-xl bg-gray-500 font-semibold btn-hover-lift"
              onClick={() => window.location.replace(`/group/${groupId}/info/`)}
            >
              Back to group
            </button>
          </div>
        </div>
      </div>
      <TravelInviteModal inviteLink={pageUrl} isOpen={inviteOpen} onClose={() => setInviteOpen(false)} />
      <AnimatePresence>
        {confirmTransferOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PopupCard className="max-w-md w-full bg-navy-900 border border-orange-500/20 p-8 relative">
              <h2 className="text-xl font-bold text-orange-300/70 mb-4 text-center">
                Confirm Ownership Transfer
              </h2>
              <p className="text-gray-300 mb-6 text-center">
                Are you sure you want to transfer group ownership to <span className="text-orange-400 font-semibold">
                  {(groupData.members ?? []).find(m => m.user_id === transferTargetId)?.first_name}
                </span>?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  className="px-4 py-2 rounded bg-orange-500 text-black font-semibold hover:bg-orange-600"
                  onClick={confirmTransferOwnership}
                >
                  Yes, Transfer
                </button>
                <button
                  className="px-4 py-2 rounded bg-gray-700 text-white font-semibold hover:bg-gray-600"
                  onClick={() => setConfirmTransferOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </PopupCard>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {pendingDeleteId !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PopupCard className="max-w-md w-full bg-navy-900 border border-rose-500/20 p-8 relative">
              <h2 className="text-xl font-bold text-rose-300/70 mb-4 text-center">
                Confirm Member Removal
              </h2>
              <p className="text-gray-300 mb-6 text-center">
                Are you sure you want to remove <span className="text-rose-400 font-semibold">
                  {(groupData.members ?? []).find(m => m.user_id === pendingDeleteId)?.first_name}
                </span> from the group?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  className="px-4 py-2 rounded bg-rose-500 text-white font-semibold hover:bg-rose-600"
                  onClick={confirmDeleteMember}
                >
                  Yes, Remove
                </button>
                <button
                  className="px-4 py-2 rounded bg-gray-700 text-white font-semibold hover:bg-gray-600"
                  onClick={() => setPendingDeleteId(null)}
                >
                  Cancel
                </button>
              </div>
            </PopupCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}