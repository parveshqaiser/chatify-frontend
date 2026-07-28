import { useEffect, useRef, useState } from "react";
import { FileText, Mic, Paperclip, Send, Smile, Images, Phone, Info, MoveLeft, X, Search } from "lucide-react";
import EmojiPicker from 'emoji-picker-react';
import UserViewModal from "./UserViewModal";
import DeleteConversationModal from "./DeleteConversationModal";

const ChatWindow = ({ user, messages, onSend })=>{ 

    const [text, setText] = useState("");
    const [fileIcons, setFileIcons] = useState(false);  // icons in send message
    const [moreInfo, setMoreInfo] = useState(false);  // more info button in header
    const [searchOpen, setSearchOpen] = useState(false);  // input field for conversation
   
    const [showEmojiPicker, setShowEmojiPicker] = useState(false); // emoji picker visibility
    const emojiPickerRef = useRef(null);
    const menuRef = useRef(null);

    const [deleteModal, setDeleteModal]=useState(false);

    // close menu/search on Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setMoreInfo(false);
                setSearchOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // close menu on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMoreInfo(false);
            }
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
                setShowEmojiPicker(false);
            }
        };
            document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSend = () => {
        if (!text.trim()) return;
        onSend(text);
        setText("");
    };

    if (!user) {
        return (
            <section className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400 text-sm">
                Select a user to start chatting.
            </section>
        );
    }

    return (
    <>
        <section className="md:w-full w-65 h-full flex flex-col backdrop-blur-sm">

            <header className="flex items-center justify-between gap-2 border-b bg-slate-700 border-slate-700 px-3 sm:px-4 py-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                        <h2 className="text-sm font-semibold text-white truncate">{user.name}</h2>
                        <p className={`text-xs ${user.online ? "text-emerald-400" : "text-rose-400"}`}>
                        {user.online ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>

                {/* right side: compact search + info, both always visible */}
                <div className="flex items-center gap-1 shrink-0">
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            searchOpen ? "w-32 sm:w-48 md:w-56 opacity-100" : "w-0 opacity-0"
                        }`}
                    >
                        <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                            <Search size={14} className="text-gray-400 shrink-0" />
                            <input
                                autoFocus={searchOpen}
                                placeholder="Search..."
                                className="w-full bg-transparent text-sm text-white placeholder:text-gray-400 outline-none"
                            />
                        </div>
                    </div>

                    {searchOpen &&<button
                        onClick={() => setSearchOpen(!searchOpen)}
                        className="rounded-full p-2 transition hover:bg-white/10 shrink-0"
                    >
                        
                        <X size={18} className="text-gray-300" />
                    </button>}

                    {!searchOpen &&<div className="relative shrink-0" ref={menuRef}>
                        <button
                            onClick={() => setMoreInfo(!moreInfo)}
                            className="rounded-full p-2 transition hover:bg-white/10"
                        >
                            <Info size={20} className={"text-gray-300"} />
                        </button>

                        {moreInfo && (
                            <ul className="menu absolute right-0 top-full mt-1 z-50 w-26 rounded-box bg-base-100 shadow-xl">
                                <li>
                                    <button onClick={()=>document.getElementById('my_modal_5').showModal()} className="text-[12px]">View</button>
                                </li>
                                <li>
                                    <button
                                        className="text-[12px]"
                                        onClick={() => {
                                            setSearchOpen(true);
                                            setMoreInfo(false);
                                        }}
                                    >
                                        Search
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        // onClick={()=>document.getElementById('my_modal_3').showModal()}
                                        onClick={()=>setDeleteModal(true)}  
                                        className="text-[12px]"
                                    >
                                        Clear All
                                    </button>
                                </li>
                                <li>
                                    <button className="text-[12px]">
                                        Media Links & Docs
                                    </button>
                                </li>
                                <li>
                                    <button className="text-[12px]">
                                        Block
                                    </button>
                                </li>
                            </ul>
                        )}
                    </div>}
                </div>
            </header>

            <article className="chat-scroll flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map((m) => (
                <div
                    key={m.id}
                    className={`max-w-[60%] px-3 py-2 rounded-lg text-sm ${
                    m.fromSelf
                        ? "bg-indigo-600 text-white ml-auto"
                        : "bg-white text-slate-700 border border-slate-200"
                    }`}
                >
                    {m.text}
                </div>
                ))}
            </article>


            {/* write message field */}
            <article className="flex items-center gap-2 px-3 py-2 backdrop-blur-sm">
                <div className="relative">
                    <button
                        onClick={() => setFileIcons(!fileIcons)}
                        className="rounded-full p-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                    >
                        <Paperclip size={20} className="text-gray-500 dark:text-gray-400" />
                    </button>

                    {fileIcons && (
                        <ul className="menu absolute bottom-11.5 left-0 z-50 w-14 rounded-box bg-base-100 shadow-lg">
                            <li>
                                <button title="Image/Video">
                                    <Images size={18} />
                                </button>
                            </li>
                            <li>
                                <button title="Files">
                                    <FileText size={18} />
                                </button>
                            </li>
                        </ul>
                    )}
                </div>

                <input
                    type="text"
                    value={text}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent px-1 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 dark:text-gray-200 dark:placeholder:text-gray-500"
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />

                <button onClick={()=> setShowEmojiPicker(!showEmojiPicker)} className="rounded-full p-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/10">
                    <Smile size={20} className="text-gray-500 dark:text-gray-400" />
                </button>
                {showEmojiPicker && (
                <div 
                    ref={emojiPickerRef}
                    className="absolute bottom-11.5 right-0 z-50"
                >
                    <EmojiPicker 
                        // onEmojiClick={handleEmojiClick}
                        onEmojiClick={(e) => setText(prev=> prev + e.emoji)}
                        width={300}
                        height={320}
                        theme="dark"
                    />
                </div>
                )}
                <button
                    className="rounded-full cursor-pointer bg-indigo-500 p-2 text-white shadow-md transition-colors hover:bg-indigo-600"
                >
                    <Send size={18} />
                </button>
            </article>
        </section>
    <UserViewModal />
    <DeleteConversationModal deleteModal={deleteModal} setDeleteModal={setDeleteModal} />
    </>
    );
}

export default ChatWindow;