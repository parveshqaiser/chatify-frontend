import React, { useState, useMemo, useEffect } from "react";
import { Search, X, Check, UserPlus, Users } from "lucide-react";

const DEFAULT_MEMBERS = [
    { id: "1", name: "Ajay", username: "@ajay", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" },
    { id: "2", name: "Sharma", username: "@sharma", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop" },
    { id: "3", name: "Neil", username: "@neil", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop" },
    { id: "4", name: "Mukesh", username: "@mukesh", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop" },
    { id: "5", name: "Suresh", username: "@suresh", avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop" },
    { id: "6", name: "Priya", username: "@priya", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
    { id: "7", name: "Ajay Kumar", username: "@ajay_k", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
];

/**
 * Props:
 * @param {boolean} isOpen - Whether modal is visible
 * @param {function} onClose - Callback when modal is closed
 * @param {function} onSave - Callback receiving array of selected members on save: onSave(selectedMembers)
 * @param {Array} members - Optional list of members to select from (defaults to demo list)
 * @param {Array} alreadyMemberIds - Optional list of member IDs already in group (shown as disabled)
 * @param {string} title - Modal heading (default: "Add Members")
 */
const AddMembersModal = ({
    isOpen = false,
    onClose,
    onSave,
    members = DEFAULT_MEMBERS,
    alreadyMemberIds = [],
    title = "Add Members",
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState(new Set());

    // Normalize member items to guarantee id and name
    const normalizedMembers = useMemo(() => {
        return members.map((m, index) => {
            if (typeof m === "string") {
                return { id: `m-${index}`, name: m, username: `@${m.toLowerCase().replace(/\s+/g, "")}` };
            }
            return {
                ...m,
                id: m.id || m._id || `m-${index}`,
                name: m.name || m.username || "Unknown Member",
            };
        });
    }, [members]);

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

    // Filtered member list based on search query
    const filteredMembers = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return normalizedMembers;
        return normalizedMembers.filter(
            (m) =>
                m.name?.toLowerCase().includes(query) ||
                m.username?.toLowerCase().includes(query)
        );
    }, [normalizedMembers, searchQuery]);

    // Toggle individual member selection
    const toggleMember = (id) => {
        if (alreadyMemberIds.includes(id)) return;
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

    // Toggle select all / deselect all
    const availableMembers = useMemo(() => filteredMembers.filter((m) => !alreadyMemberIds.includes(m.id)),
        [filteredMembers, alreadyMemberIds]
    );

    const isAllSelected =
        availableMembers.length > 0 &&
        availableMembers.every((m) => selectedIds.has(m.id));

    const handleToggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds((prev) => {
                const next = new Set(prev);
                availableMembers.forEach((m) => next.delete(m.id));
                return next;
            });
        } else {
            setSelectedIds((prev) => {
                const next = new Set(prev);
                availableMembers.forEach((m) => next.add(m.id));
                return next;
            });
        }
    };

    // Save action
    const handleSave = () => {
        const selectedList = normalizedMembers.filter((m) => selectedIds.has(m.id));
        if (onSave) {
            onSave(selectedList);
        }
        if (onClose) {
            onClose();
        }
    };

    // Helper for selected chips list
    const selectedMembersList = useMemo(() => {
        return normalizedMembers.filter((m) => selectedIds.has(m.id));
    }, [normalizedMembers, selectedIds]);

    if (!isOpen) return null;

    return (
    <dialog id="add_mem" open={isOpen} className="modal modal-bottom sm:modal-middle bg-black/60 backdrop-blur-xs transition-opacity duration-200">
        <div className="modal-box w-full max-w-lg p-0 overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl flex flex-col max-h-[90vh]">
            
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

                {/* selected names */}
                {selectedMembersList.length > 0 && (
                    <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
                        {selectedMembersList.map((m) => (
                            <span
                                key={m.id}
                                className="inline-flex items-center gap-1.5 pl-2 pr-1.5 py-1 text-xs font-medium rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shrink-0 animate-fadeIn"
                            >
                                <span className="truncate max-w-25">{m.name}</span>
                                <button                                  
                                    onClick={() => toggleMember(m.id)}
                                    className="rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800 p-0.5 text-indigo-600 dark:text-indigo-400 cursor-pointer"
                                    title={`Remove ${m.name}`}
                                >
                                    <X size={12} />
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                {/* Quick selection toolbar */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span>
                        Showing {filteredMembers.length} {filteredMembers.length === 1 ? "contact" : "contacts"}
                    </span>
                    {availableMembers.length > 0 && (
                        <button                          
                            onClick={handleToggleSelectAll}
                            className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                        >
                            {isAllSelected ? "Deselect All" : "Select All"}
                        </button>
                    )}
                </div>
            </aside>

            {/* Member Checkbox List (Scrollable) */}
            <div className="flex-1 overflow-y-auto min-h-55 max-h-85 p-2 space-y-1 divide-y divide-slate-100 dark:divide-slate-800/40">
            {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => {
                    const isSelected = selectedIds.has(member.id);
                    const isAlreadyMember = alreadyMemberIds.includes(member.id);

                    return (
                        <label
                            key={member.id}
                            className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer select-none transition-all group ${
                                isAlreadyMember
                                    ? "opacity-50 cursor-not-allowed bg-slate-50/50 dark:bg-slate-800/30"
                                    : isSelected
                                    ? "bg-indigo-50/70 dark:bg-indigo-950/40 hover:bg-indigo-100/60 dark:hover:bg-indigo-950/60"
                                    : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                            }`}
                        >
                           
                            <div className="flex items-center gap-3 min-w-0">
                                {/* Avatar or Initial fallback */}
                                <div className="relative shrink-0">
                                    {member.avatar ? (
                                        <img
                                            src={member.avatar}
                                            alt={member.name}
                                            className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-linear-to-tr from-indigo-500 to-purple-600 text-white font-semibold flex items-center justify-center text-sm shadow-xs">
                                            {member.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
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
                                        {isAlreadyMember
                                            ? "Already in group"
                                            : member.username || "Chatify user"}
                                    </p>
                                </div>
                            </div>

                            <div className="pl-3 shrink-0">
                                <input
                                    type="checkbox"
                                    checked={isSelected || isAlreadyMember}
                                    disabled={isAlreadyMember}
                                    onChange={() => toggleMember(member.id)}
                                    className="checkbox checkbox-primary checkbox-sm rounded-md transition-transform active:scale-90"
                                />
                            </div>
                        </label>
                    );
                })
            ) : (
                <div className="py-5 text-center border">
                    <Users className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        No members found
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        Try searching for another name or keyword
                    </p>
                </div>
            )}
            </div>

            {/* Footer Actions */}
            <footer className="flex items-center justify-end gap-2.5 px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 shrink-0">
                <button
                    onClick={onClose}
                    className="btn btn-ghost btn-sm text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 px-4 rounded-xl cursor-pointer"
                >
                    Close
                </button>

                <button
                    onClick={handleSave}
                    disabled={selectedIds.size === 0}
                    className="btn btn-primary btn-sm px-5 rounded-xl text-white shadow-sm disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                    <Check size={16} />
                    <span>Save {selectedIds.size > 0 ? `(${selectedIds.size})` : ""}</span>
                </button>
            </footer>
        </div>
    </dialog>
    );
};

export default AddMembersModal;
