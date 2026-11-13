
import React, { useState, useMemo, useEffect } from "react";
import { Search, X, Check, UserPlus, Users } from "lucide-react";
import { useAddGroupMembersMutation, useGetAllUsersQuery } from "../redux/api";
import { LoadingMessage } from "./Spinner";
import toast from "react-hot-toast";

const AddMembersModal = ({
    groupMembers = [],
    id,
    isOpen = false,
    onClose,
    title = "Add Members",
    refetchGrpMsg
}) => {
   
    const { data: usersResponse, isLoading: loading } = useGetAllUsersQuery();
    const [addGroupMembers, { isLoading: isSubmitting }] = useAddGroupMembersMutation();

    const allUsers = usersResponse?.data || [];

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState(new Set());

    // Reset state on open/close
    useEffect(() => {
        if (isOpen) {
            setSelectedIds(new Set());
            setSearchQuery("");
        }
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isOpen && onClose) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    
    let filteredMembers = useMemo(() => {
        if (!Array.isArray(allUsers)) return [];

        let memberIds = new Set(
            (groupMembers || []).map((mem) => mem?.userId?._id || mem?.userId || mem?._id)
        );

        let availableMembers = allUsers.filter(
            (user) => user?._id && !memberIds.has(user._id)
        );

        let query = searchQuery.trim().toLowerCase();
        if (!query) return availableMembers;

        return availableMembers.filter(
            (m) =>
                m.name?.toLowerCase().includes(query) ||
                m.username?.toLowerCase().includes(query)
        );
    }, [allUsers, groupMembers, searchQuery]);

    const toggleMember = (id) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const handleAddMembers = async () => {
        try {
            const selectedList = Array.from(selectedIds);
            const res = await addGroupMembers({ id, data: selectedList }).unwrap();
            if (res?.success) {
                toast.success(res.message);
                onClose?.();
                refetchGrpMsg?.();
            }
        } catch (error) {
            console.error("error ", error);
            toast.error(error?.data?.message || "Failed to Add Member in Group");
        }
    };

    
    if (!isOpen) return null;

    return (
        <dialog
            id="add_mem"
            open={isOpen}
            className="modal modal-bottom sm:modal-middle bg-black/60 backdrop-blur-xs transition-opacity duration-200"
        >
            <main className="modal-box w-full max-w-lg p-0 overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl flex flex-col max-h-[90vh]">
                <header className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
                            <UserPlus size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                {title}
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {selectedIds.size > 0
                                    ? `${selectedIds.size} ${selectedIds.size === 1 ? "member" : "members"} selected`
                                    : "Select members to add to the conversation"}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-full p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        title="Close (Esc)"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </header>

                <aside className="p-4 space-y-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    {/* Search Input */}
                    <div className="relative flex items-center">
                        <Search
                            size={18}
                            className="absolute left-3.5 text-slate-400 pointer-events-none"
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search members by name..."
                            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
                            autoFocus
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                        <span>
                            Showing {loading ? 0 : filteredMembers.length}
                            {filteredMembers.length === 1 ? " contact" : " contacts"}
                        </span>
                    </div>
                </aside>

               
                <section className="flex-1 overflow-y-auto min-h-55 max-h-85 p-2 space-y-1 divide-y divide-slate-100 dark:divide-slate-800/40">
                    {loading ? (
                        <div className="py-12 flex justify-center items-center">
                            <LoadingMessage />
                        </div>
                    ) : filteredMembers.length > 0 ? (
                        filteredMembers.map((member) => {
                            let isSelected = selectedIds.has(member._id);
                            return (
                                <label
                                    key={member?._id}
                                    className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer select-none transition-all group 
                                        ${isSelected ? "bg-indigo-50/70 dark:bg-indigo-950/40 hover:bg-indigo-100/60 dark:hover:bg-indigo-950/60"
                                            : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                                    }`}
                                >
                                    <article className="flex items-center gap-3 min-w-0">
                                        <div className="relative shrink-0">
                                            <img
                                                src={member?.avatar?.url}
                                                alt={member.name}
                                                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <p
                                                className={`text-sm font-semibold truncate ${
                                                    isSelected
                                                        ? "text-indigo-900 dark:text-indigo-200"
                                                        : "text-slate-800 dark:text-slate-200"
                                                }`}
                                            >
                                                {member.name}
                                            </p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                                                @{member.username}
                                            </p>
                                        </div>
                                    </article>

                                    <div className="pl-3 shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleMember(member._id)}
                                            className="checkbox checkbox-primary checkbox-sm rounded-md transition-transform active:scale-90"
                                        />
                                    </div>
                                </label>
                            );
                        })
                    ) : (
                        <div className="py-5 text-center">
                            <Users className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                No members found
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                Try searching for another name or keyword
                            </p>
                        </div>
                    )}
                </section>

                <footer className="flex items-center justify-end gap-2.5 px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 shrink-0">
                    <button
                        onClick={onClose}
                        className="btn btn-ghost btn-sm text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 px-4 rounded-xl cursor-pointer"
                    >
                        Close
                    </button>

                    <button
                        onClick={handleAddMembers}
                        disabled={selectedIds.size === 0 || isSubmitting}
                        className="btn btn-primary btn-sm px-5 rounded-xl text-white shadow-sm disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                    >
                        <Check size={16} />
                        <span>
                            {isSubmitting
                                ? "Saving..."
                                : `Save ${selectedIds.size > 0 ? `(${selectedIds.size})` : ""}`}
                        </span>
                    </button>
                </footer>
            </main>
        </dialog>
    );
};

export default AddMembersModal;
