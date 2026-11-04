
import { FileText, Images, Info, Paperclip, Send, Smile } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';
import bgImage from "../assets/grp-chat-bg.jpg";
import AddMembersModal from './AddMembersModal.jsx';
import GroupViewModal from './GroupViewModal.jsx';
import ExitGroupModal from './ExitGroupModal.jsx';

const GroupMessage = () => {

    let {id} = useParams();
    let menuRef = useRef();

    const [searchOpen, setSearchOpen] = useState(false);
    const [moreInfo, setMoreInfo] = useState(false);  // more info button in header
    const [fileIcons, setFileIcons] = useState(false);  // icons in send message
    const fileInputRef = useRef(null);  // for selecting images/videos
    const documentRef = useRef(null); // for selecting pdf/word
    const [fileLoading, setFileLoading] = useState(false);
    const [message, setMessage] = useState("");
    
    // for file upload
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false); // emoji picker visibility
    const emojiPickerRef = useRef(null);


     // close menu/search on Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setMoreInfo(false);
                setSearchOpen(false);
                setFileIcons(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const [activeModal, setActiveModal] = useState(null); 
    // values --> 'addMember' | 'removeMember' | 'groupInfo' | 'clearChat' | 'block' | 'exitGroup'

    const closeModal = () => setActiveModal(null);

    let handleFileChange = ()=>{}


    return (
    <>
    <main className="max-w-4xl w-full mx-auto h-[calc(100dvh-1rem)] flex flex-col backdrop-blur-sm my-2">
        <img
            src={bgImage}
            alt="background"
            className="absolute inset-0 w-full h-full object-cover -z-10"
        />
        <header className="shrink-0 flex items-center justify-between gap-2 bg-indigo-500 px-2 sm:px-3 py-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
                <img
                    src={"https://res.cloudinary.com/dp0v0zb7z/image/upload/v1790095083/avatars/nir7pxgahvzado2rff4s.jpg"}
                    alt={"Group Avatar"}
                    className="h-10 w-10 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0">
                    <h2 className="text-sm font-semibold text-white truncate">Group Name</h2>
                    <p className={`text-xs`}>
                        Sam, Ravi, Raj, Asif
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">

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
                        <button onClick={() => setActiveModal('groupInfo')} className="text-[12px]">Group Info</button>
                        </li>
                        <li>
                        <button onClick={() => setActiveModal('addMember')} className="text-[12px]">Add</button>
                        </li>
                        <li>
                        <button onClick={() => setActiveModal('removeMember')} className="text-[12px]">Remove</button>
                        </li>
                        <li>
                        <button onClick={() => setActiveModal('clearChat')} className="text-[12px]">Clear Chat</button>
                        </li>                       
                        <li>
                        <button onClick={() => setActiveModal('exitGroup')} className="text-[12px]">Exit Group</button>
                        </li>
                    </ul>
                    )}
                </div>}
            </div>
        </header>

        {/* chat */}
        <section className='chat-scroll flex-1 min-h-0 overflow-y-auto p-2 space-y-1'>
            <div className="chat chat-start">
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img
                            alt="Tailwind CSS chat bubble component"
                            src="https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
                        />
                    </div>
                </div>
                <div className="chat-header">
                    <time className="text-xs opacity-50">12:45</time>
                </div>
                <p className="chat-bubble">You were the Chosen One!</p>
                <div className="chat-footer opacity-50">Delivered</div>
            </div>
            <div className="chat chat-end">
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                    <img
                        alt="Tailwind CSS chat bubble component"
                        src="https://img.daisyui.com/images/profile/demo/anakeen@192.webp"
                    />
                    </div>
                </div>
                <div className="chat-header">                
                    <time className="text-xs opacity-50">12:46</time>
                </div>
                <p className="chat-bubble">I hate you!</p>
                <div className="chat-footer opacity-50">Seen at 12:46</div>
            </div>
        </section>

        <footer className="shrink-0 flex items-center gap-2 px-2 py-2 backdrop-blur-sm">
            <div className="relative">
                <button
                    onClick={() => setFileIcons(!fileIcons)}
                    className="rounded-full p-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                >
                    <Paperclip size={16} className="text-gray-500 dark:text-gray-400" />
                </button>

                {fileIcons && (
                    <ul className="menu absolute bottom-11.5 left-0 z-50 w-14 rounded-box bg-base-100 shadow-lg">
                        <li>
                            <button title="Image/Video" onClick={() => fileInputRef.current?.click()}>
                                <Images size={18} />
                            </button>
                        </li>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,video/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <li>
                            <button title="Files" onClick={() => documentRef.current?.click()}>
                                <FileText size={18} />
                            </button>
                        </li>

                        <input
                            ref={documentRef}
                            type="file"
                            accept="application/pdf, application/msword"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </ul>
                )}
            </div>
            {selectedFile && (
                <div className="mb-2 flex items-center gap-2 rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                    {filePreview && selectedFile.type.startsWith("image/") ? (
                        <img
                            src={filePreview}
                            alt={selectedFile.name}
                            className="h-14 w-14 rounded-md object-cover"
                        />
                    ) : filePreview && selectedFile.type.startsWith("video/") ? (
                        <video
                            src={filePreview}
                            className="h-14 w-14 rounded-md object-cover"
                        />
                    ) : (
                        <FileText
                            size={30}
                            className="text-gray-500"
                        />
                    )}

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-[12px] font-light">
                            {selectedFile.name}
                        </p>

                        <p className="text-xs text-gray-500">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                    </div>

                    {/* Remove attachment */}
                    <button
                        type="button"
                        onClick={() => {
                            if (filePreview) {
                                URL.revokeObjectURL(filePreview);
                            }
                            setSelectedFile(null);
                            setFilePreview(null);
                        }}
                        className="rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        ✕
                    </button>
                </div>
            )}

            {!selectedFile && (
                <input
                    type="text"
                    value={message}
                    onChange={(e)=> setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent px-1 py-2.5 text-sm text-gray-800 outline-none placeholder:text-orange-400 dark:text-gray-200"
                />         
            )}
           
            {!selectedFile && 
                <button onClick={()=> setShowEmojiPicker(!showEmojiPicker)} className="rounded-full p-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/10">
                    <Smile size={18} className="text-gray-500 dark:text-gray-400" />
                </button>}
            
            {showEmojiPicker && (
                <div 
                    ref={emojiPickerRef}
                    className="absolute bottom-11.5 right-0 z-50"
                >
                    <EmojiPicker 
                        onEmojiClick={(e) => setMessage(prev=> prev + e.emoji)}
                        width={300}
                        height={320}
                        theme="dark"
                    />
                </div>
            )}

            {/* handle send */}
            <button
                className={`rounded-full ${fileLoading ?"cursor-not-allowed": "cursor-pointer"}  bg-indigo-400 p-2 text-white shadow-md transition-colors hover:bg-indigo-600`}
            >
                <Send size={14} />
            </button>
        </footer>
    </main>

    <GroupViewModal isOpen={activeModal === 'groupInfo'}  onClose={closeModal}/>
    <AddMembersModal isOpen={activeModal === 'addMember'}  onClose={closeModal} />
    <ExitGroupModal  isOpen={activeModal === 'exitGroup'}  onClose={closeModal}/>

    </>
    )
}

export default GroupMessage;
