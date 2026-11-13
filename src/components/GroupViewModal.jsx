
import { X, Users, FileText, Shield, Calendar, MessageCircle } from "lucide-react";
import dayjs from "dayjs";


const defaultMembers = [
    { id: 1, name: "Ramesh Kumar", username: "ramesh", role: "admin", isYou: false, avatar: "https://i.pravatar.cc/150?u=ramesh" },
    { id: 2, name: "Risav Sharma", username: "risav", role: "admin", isYou: false, avatar: "https://i.pravatar.cc/150?u=risav" },
    { id: 3, name: "Ajay Verma", username: "ajay_v", role: "member", isYou: true, avatar: "https://i.pravatar.cc/150?u=ajay" },
    { id: 4, name: "Bijay Sen", username: "bijay99", role: "member", isYou: false, avatar: "https://i.pravatar.cc/150?u=bijay" },
    { id: 5, name: "Hari Prasad", username: "hari_p", role: "member", isYou: false, avatar: "https://i.pravatar.cc/150?u=hari" },
    { id: 6, name: "Ravi Teja", username: "ravi_t", role: "member", isYou: false, avatar: "https://i.pravatar.cc/150?u=ravi" },
];

let files = [
    { id: 1, name: "profile_picture.jpg", type: "media", size: "2.4 MB", date: "2024-01-15" },
    { id: 2, name: "resume_2024.pdf", type: "document", size: "856 KB", date: "2024-01-20" },
    { id: 3, name: "project_notes.txt", type: "text", size: "45 KB", date: "2024-01-22" },
    { id: 4, name: "presentation.pptx", type: "presentation", size: "4.2 MB", date: "2024-01-18" },
    { id: 5, name: "team_photo.jpg", type: "media", size: "3.1 MB", date: "2024-01-10" },
    { id: 6, name: "budget_2024.xlsx", type: "spreadsheet", size: "1.8 MB", date: "2024-01-05" },
    { id: 7, name: "team_photo.jpg", type: "media", size: "3.1 MB", date: "2024-01-10" },
    { id: 8, name: "budget_2024.xlsx", type: "spreadsheet", size: "1.8 MB", date: "2024-01-05" },
];

const GroupViewModal = ({grpMessage,currentUser, isOpen, onClose }) => {
    // Uses real data if available, or falls back to demo members
    const membersList = grpMessage?.group?.members || defaultMembers;


    if (!isOpen) return null;

    return (
        <dialog open={isOpen} className="modal modal-bottom sm:modal-middle bg-black/60 backdrop-blur-xs">
            <main className="modal-box max-w-2xl p-0 overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-2xl rounded-2xl flex flex-col max-h-[90vh]">
                
                {/* Modal Header */}
                <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700/80 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        Group Info
                    </h3>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                        title="Close (Esc)"
                    >
                        <X size={18} />
                    </button>
                </header>

        
                <article className="px-4 py-3 overflow-y-auto flex-1 space-y-5 custom-scrollbar-files">
                    
                    <aside className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-gray-700/40 border border-slate-100 dark:border-gray-700/60">
                        <div className="relative shrink-0">
                            <img
                                src={grpMessage?.group?.groupAvatar?.url}
                                alt="Group Avatar"
                                className="w-20 h-20 rounded-2xl object-cover shadow-md ring-4 ring-white dark:ring-gray-700"
                            />
                        </div>

                        <div className="flex-1 min-w-0 text-center sm:text-left space-y-1.5">
                            <h4 className="text-base font-bold text-gray-900 dark:text-white truncate">
                                {grpMessage?.group?.groupName || "Project Vanguard"}
                            </h4>

                            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                                {grpMessage?.group?.description || "Official coordination channel for releases, project notes, and cross-team discussions."}
                            </p>

                            <div className="pt-0 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <span className="inline-flex items-center gap-1 bg-white dark:bg-gray-800 px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-700">
                                    <Calendar size={13} className="text-indigo-500" />
                                    {/* Created on 13/10/2026 by Risav */}
                                    Created on {dayjs(grpMessage?.group?.createdAt).format("DD MMM YYYY")} by {grpMessage?.group?.createdBy?.name}
                                </span>
                                <span className="inline-flex items-center gap-1.5 bg-white dark:bg-gray-800 px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-700">
                                    <Users size={13} className="text-indigo-500" />
                                    {membersList.length} members
                                </span>
                                 <span className="inline-flex items-center gap-1.5 bg-white dark:bg-gray-800 px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-700">                                   
                                    <MessageCircle size={13} className="text-indigo-500" />
                                    {grpMessage?.allMessages?.length || 0}
                                </span>
                            </div>
                        </div>
                    </aside>

                    <aside className="space-y-2.5">
                        <div className="flex items-center justify-between">
                            <h5 className="text-xs font-bold tracking-wider uppercase text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                <Users size={15} className="text-indigo-500" />
                                Group Members ({membersList.length})
                            </h5>
                        </div>

                        <div className="divide-y divide-gray-100 dark:divide-gray-700/60 rounded-xl border border-gray-100 dark:border-gray-700/80 bg-white dark:bg-gray-800/60 max-h-56 overflow-y-auto custom-scrollbar-files">
                            {membersList.map((member, idx) => {
                                let name = member?.userId?.name || member?.name || "Unknown";
                                let username = member?.userId?.username || member?.username;
                                let avatar = member?.userId?.avatar?.url || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;
                                let isAdmin = member?.role === "admin";
                                let joinDate = dayjs(member?.joinedAt).format("DD MMM YYYY")                               
                                let isYou = member?.userId?._id == currentUser?._id;                   

                                return (
                                    <div
                                        key={member?._id || member?.id || idx}
                                        className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-gray-700/40 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <img
                                                src={avatar}
                                                alt={name}
                                                className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-gray-600 shrink-0"
                                            />
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate flex items-center gap-1.5">
                                                    {name}                                                    
                                                    {isYou &&<span className="text-[11px] font-normal text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.2 rounded-md">
                                                        You
                                                    </span>}                                                  
                                                </p>                                              
                                                {joinDate && (
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                                                        Joined on {joinDate}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="shrink-0 pl-2">
                                            {isAdmin ? (
                                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80">
                                                    <Shield size={12} className="text-amber-500 fill-amber-500/20" />
                                                    Admin
                                                </span>
                                            ) : (
                                                <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/60 px-2 py-0.5 rounded-full">
                                                    Member
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </aside>

                    <aside>
                        <div className="flex items-center justify-between mb-3">
                            <h5 className="text-xs font-bold tracking-wider uppercase text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                <FileText size={15} className="text-indigo-500" />
                                Shared Files ({files.length})
                            </h5>
                        </div>

                        <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar-files">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {files.map((file) => (
                                    <div 
                                        key={file.id}
                                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                                    >
                                        <div className="shrink-0 w-10 h-10 rounded-lg bg-white dark:bg-gray-600 flex items-center justify-center shadow-sm">
                                            <FileText size={18} className="text-indigo-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                                                {file.name} 
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                <span>{file.size}</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-500"></span>
                                                <span>{file.date}</span>
                                            </div>
                                        </div>
                                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer">
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                </article>
            </main>

            <style>{`
                .custom-scrollbar-files::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-scrollbar-files::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar-files::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 20px;
                }
                .custom-scrollbar-files::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
                .dark .custom-scrollbar-files::-webkit-scrollbar-thumb {
                    background: #475569;
                }
                .dark .custom-scrollbar-files::-webkit-scrollbar-thumb:hover {
                    background: #64748b;
                }
            `}</style>
        </dialog>
    );
};

export default GroupViewModal;