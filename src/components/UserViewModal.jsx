import React, { useState } from 'react';
import { Search, X, Info, Paperclip, Smile, Send,Images,FileText,User,Mail,Calendar,Download,File,Image,FileArchive,FileCode} from 'lucide-react';

const UserViewModal = ({user, onClose }) => {
 
    const files = [
        { id: 1, name: "profile_picture.jpg", type: "image", size: "2.4 MB", date: "2024-01-15" },
        { id: 2, name: "resume_2024.pdf", type: "pdf", size: "856 KB", date: "2024-01-20" },
        { id: 3, name: "project_notes.txt", type: "text", size: "45 KB", date: "2024-01-22" },
        { id: 4, name: "presentation.pptx", type: "presentation", size: "4.2 MB", date: "2024-01-18" },
        { id: 5, name: "team_photo.jpg", type: "image", size: "3.1 MB", date: "2024-01-10" },
        { id: 6, name: "budget_2024.xlsx", type: "spreadsheet", size: "1.8 MB", date: "2024-01-05" },
        { id: 7, name: "team_photo.jpg", type: "image", size: "3.1 MB", date: "2024-01-10" },
        { id: 8, name: "budget_2024.xlsx", type: "spreadsheet", size: "1.8 MB", date: "2024-01-05" },
    ];

    const getFileIcon = (type) => {
        switch(type) {
        case 'image': return <Image size={20} className="text-yellow-300" />;
        case 'pdf': return <FileArchive size={20} className="text-red-400" />;
        case 'text': return <FileText size={20} className="text-white" />;
        case 'presentation': return <FileCode size={20} className="text-orange-500" />;
        case 'spreadsheet': return <FileArchive size={20} className="text-green-300" />;
        default: return <File size={20} className="text-gray-700" />;
        }
    };

    return (
    <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <main className="modal-box max-w-2xl p-0 overflow-hidden bg-white dark:bg-gray-800">
            <header className="sticky top-0 z-10 flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <h3 className="text-md font-semibold text-gray-900 dark:text-white">User Information</h3>
                <form method="dialog">
                    <button 
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X size={20} className="text-gray-500 dark:text-gray-400" />
                    </button>
                </form>
            </header>

            <article className="px-4 py-3">
                <aside className="flex items-center gap-4 mb-4">
                    <div className="relative">
                        <img
                            src={user?.avatar || "https://images.template.net/547758/Avatar-Profile-Picture-Template-edit-online.webp"}
                            alt={user?.name || "User"}
                            className="w-18 h-18 rounded-full object-cover border-3 border-indigo-100 dark:border-indigo-900"
                        />
                        {user?.status == "online" && (
                            <span className="absolute bottom-0 right-2 w-3 h-3 bg-emerald-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
                        )}
                    </div>
                    <div className="flex-1">
                        <h4 className="text-md font-bold text-gray-900 dark:text-white">{user?.name || "User Name"}</h4>
                      
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <Mail size={14} />
                            {user?.email || "user@example.com"}
                        </p>
                    </div>
                </aside>

                {/* bio */}
                <blockquote className="mb-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        {user?.bio || "Software developer passionate about creating beautiful and functional user interfaces"}
                    </span>
                </blockquote>

                {/*shared files  */}
                <aside>
                    <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <FileText size={16} />
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
                                    {getFileIcon(file.type)}
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
                                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                                    <Download size={16} className="text-gray-500 dark:text-gray-400" />
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
            width: 4px;
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

export default UserViewModal;