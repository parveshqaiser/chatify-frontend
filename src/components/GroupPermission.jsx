import React, { useState, useMemo, useEffect } from "react";
import { X, ShieldCheck,Search, Users, CircleX } from "lucide-react";
import toast from "react-hot-toast";
import { useRemoveMemberMutation, useRolePermissionMutation } from "../redux/api";

const GroupPermission = ({
    groupInfo,
    currentUser,
    isOpen = false,
    onClose,
    refetchGroupDeatils
}) => {

    let [rolePermission] = useRolePermissionMutation();
    let [removeMember]  = useRemoveMemberMutation();

    const [searchQuery, setSearchQuery] = useState(""); // not using this now
    const [members,setMembers] = useState(groupInfo?.members || []);

    const [changedRoles, setChangedRoles] = useState({});

    // Reset search on modal open
    useEffect(() => {
        if (isOpen) setSearchQuery("");
    }, [isOpen]);

    let originalRolesMap = useMemo(() => {
        const map = {};
        groupInfo?.members?.forEach((m) => {
            if (m?.userId?._id) {
                map[m.userId._id] = m.role;
            }
        });
        return map;
    }, [groupInfo]);

    function handleClose(){
        onClose();
        setMembers(groupInfo?.members || []);
    }

    // Handle role update
    const handleRoleUpdate = (id, newRole) => {
    
        let modify = members.map(val => val.userId?._id == id ? {...val, role : newRole} : val);
        setMembers(modify);    
        
        let originalRole = originalRolesMap[id];

        setChangedRoles((prev) => {
            const next = { ...prev };
            if (newRole === originalRole) {
                delete next[id];
            } else {
                next[id] = newRole;
            }
            return next;
        });
    };

    let handleRoleChanges = async()=>{
        try {
            if(Object.keys(changedRoles).length ==0){
                return toast.error("Please Select Members");
            }

            let id = groupInfo?._id;
            let res = await rolePermission({id, data :changedRoles}).unwrap();

            if(res.success){
                toast.success(res.message);
                onClose();
                refetchGroupDeatils();
            }
        } catch (error) {
            toast.error(error?.data?.message || "Some issue is giving permission");
        }
    }

    let handleMemberRemove = async(id) => {
        try {
            let groupId = groupInfo?._id;
            let res = await removeMember({groupId,id}).unwrap();
            if(res.success){
                toast.success(res.message);
                onClose();
                refetchGroupDeatils();
            }
        } catch (error) {
            toast.error(error?.data?.message || "Some issue is giving permission");
        }
    };

    if (!isOpen) return null;

    return (
    <dialog open={isOpen} className="modal modal-bottom sm:modal-middle bg-black/60 backdrop-blur-xs transition-opacity duration-200">
        <main className="modal-box max-w-xl p-0 overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-2xl rounded-2xl flex flex-col max-h-[85vh]">
            
            <header className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700/80 bg-white dark:bg-gray-800">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">
                            Group Permissions
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Manage member roles and group access
                        </p>
                        <h3 className="text-xs text-gray-500 dark:text-gray-400">
                            Created By {groupInfo?.createdBy?.name}
                        </h3>
                    </div>
                </div>

                <button
                    onClick={handleClose}
                    className="rounded-full p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                    title="Close (Esc)"
                >
                    <X size={18} />
                </button>
            </header>

            <section className="flex-1 overflow-y-auto px-5 py-2 divide-y divide-gray-100 dark:divide-gray-700/60">
            {members?.length > 0 ? (
                members?.map((member, index) => {
                    let isYou = member?.userId?._id == currentUser?._id;   
                    let isAdmin = member?.role == "admin";

                    return (
                    <div
                        key={member._id}
                        className="flex items-center justify-between py-3 gap-3 transition-colors"
                    >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <img
                                src={member?.userId?.avatar?.url}
                                alt={member.name}
                                className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700 shrink-0"
                            />
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate flex items-center gap-1.5">
                                    {member?.userId?.name}
                                    {isYou && (
                                        <span className="text-[10px] bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded-md font-normal">
                                            You
                                        </span>
                                    )}
                                    
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                                    @{member?.userId?.username}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 shrink-0">                                
                            <select
                                value={member.role}
                                disabled={isYou && isAdmin}
                                onChange={(e) => handleRoleUpdate(member?.userId?._id, e.target.value)}
                                className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
                                    member.role === "admin"
                                        ? "bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                                        : "bg-slate-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600"
                                }`}
                            >
                                <option value="member">Member</option>
                                <option value="admin">Admin</option>
                            </select>

                            {!isYou &&
                            <button
                                title={`Remove ${member?.userId?.name} from group`}                                   
                                onClick={() => handleMemberRemove(member?.userId?._id)}                                   
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400"
                            >
                                <CircleX size={16} />
                            </button>}
                        </div>
                    </div>
                    );
                })
            ) : (
                <div className="py-8 text-center text-gray-400 dark:text-gray-500 text-sm">
                    <Users size={32} className="mx-auto mb-2 opacity-50" />
                    No members found matching "{searchQuery}"
                </div>
            )}
            </section>

            {/* 5. Footer */}
            <footer className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-700/80 bg-slate-50/60 dark:bg-gray-800/80">   
                <span className="text-xs">{Object.keys(changedRoles).length || "0"} changes</span>               
                <button
                    onClick={handleRoleChanges}
                    className="px-4 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition cursor-pointer"
                >
                    Save Changes
                </button>
            </footer>
        </main>
    </dialog>
    );
};

export default GroupPermission;