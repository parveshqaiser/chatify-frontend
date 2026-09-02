
import { useEffect, useRef, useState } from "react";
import { FileText, Paperclip, Send, Smile, Images, Info, X, Search, Pencil, Trash2 } from "lucide-react";
import EmojiPicker from 'emoji-picker-react';
import UserViewModal from "./UserViewModal.jsx";
import DeleteConversationModal from "./DeleteConversationModal.jsx";
import robot from "../assets/robot.gif";
import dayjs from "dayjs";
import { createSocketConnection } from "../utils/socket-client.js";
import { useClearConversationMutation, useDeleteMessageMutation,useGetAllNewMessagesQuery, useLazyGetAllMessagesQuery, useUploadPresignedUrlMutation } from "../redux/api.js";
import toast from "react-hot-toast";
import axios from "axios";
import MessageContent from "./MessageContent.jsx";

const ALternateChatWindow = ({selectedUser,currentUser})=>{ 

    let [deleteMessage] = useDeleteMessageMutation();
    let [deleteAll] = useClearConversationMutation();
    let [uploadFiles] = useUploadPresignedUrlMutation();

    let {data : newMsg, isLoading, error, refetch: refetchAllmsg} = useGetAllNewMessagesQuery(selectedUser?._id,{skip : !selectedUser});

    // Query for fetching more messages
    // let [fetchMoreMessages] = useLazyGetAllMessagesQuery();

    const [text, setText] = useState("");
    const [findText, setFindText] = useState("");
    const [fileIcons, setFileIcons] = useState(false);  // icons in send message
    const [moreInfo, setMoreInfo] = useState(false);  // more info button in header
    const [searchOpen, setSearchOpen] = useState(false);  // input field for conversation
    const [activeMsgId, setActiveMsgId] = useState(null);  // selected message id
   
    const [showEmojiPicker, setShowEmojiPicker] = useState(false); // emoji picker visibility
    const emojiPickerRef = useRef(null);
    const menuRef = useRef(null);
    const scrollBar = useRef();

    const [isTyping, setIsTyping] = useState(false);
    const typingTimerRef = useRef(null);
    const isTypingRef = useRef(false);
  
    const [deleteModal, setDeleteModal]=useState(false);
    const [isDoubleClicked, setIsDoubleClicked] = useState(false); // to ensure edit, delete button is removed & sending or editing message

    const [allMessages, setAllMessages] = useState([]);

    // for file upload
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const fileInputRef = useRef(null);  // for selecting images/videos
    const documentRef = useRef(null); // for selecting pdf/word

     useEffect(() => {
        if (!selectedUser?._id) {
            setAllMessages([]);
            return;
        }

        if (newMsg?.data) {
            setAllMessages(newMsg.data);
        }else {
            setAllMessages([]);
        }
    }, [selectedUser?._id, newMsg]);


    useEffect(()=>{
        scrollBar.current?.scrollIntoView({behavior : "smooth"});
    },[allMessages])

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

    useEffect(() => {
        if (!selectedUser?._id) return;

        let socket = createSocketConnection();

        let current = currentUser?.data?._id;
        let target = selectedUser._id;

        let handleReceiveMessage = () => {
            refetchAllmsg();
        };

        let joinChat = () => {
            // emit --> client to server
            socket.emit("joinChat", {
                current,
                target
            });
        };

        // socket.on means server to client
        socket.on("receiveMessage", handleReceiveMessage);

        if (socket.connected) {
            joinChat();
        } else {
            socket.once("connect", joinChat);
        }

        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
            socket.off("connect", joinChat);
        };
    }, [selectedUser?._id]);    


    useEffect(()=>{
        if (!selectedUser?._id) return;

        const socket = createSocketConnection();
        const handleTypingStart = () => {
            setIsTyping(true);
        };

        const handleTypingStop = () => {
            setIsTyping(false);
        };

        socket.on("typing:start", handleTypingStart);
        socket.on("typing:stop", handleTypingStop);

        // When removing a listener, Socket.IO needs the same function reference.
        return () => {
            socket.off("typing:start", handleTypingStart);
            socket.off("typing:stop", handleTypingStop);
        };
    },[selectedUser?._id]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
            const previewUrl = URL.createObjectURL(file);
            setFilePreview(previewUrl);
        } else {
            setFilePreview(null);
        }
        // Close attachment menu
        setFileIcons(false);
    };

    const handleSend = async() => {
        try {
            if (!text?.trim() && !selectedFile) return;

            let messagePayload = {
                current: currentUser?.data?._id,
                target: selectedUser?._id,
                text: text?.trim() || "",
                type: "text",
                file: null,
            };

            if (selectedFile) 
            {
                let data = {
                    fileName: selectedFile.name,
                    fileType: selectedFile.type,
                };

                let res = await uploadFiles(data).unwrap();

                let { uploadUrl, key, publicUrl } = res.data;

                await axios.put(uploadUrl, selectedFile, {
                    headers: {
                    "Content-Type":
                        selectedFile.type || "application/octet-stream",
                    },
                    onUploadProgress: (progressEvent) => {
                        if (!progressEvent.total) return;

                        let percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );

                        console.log(`Upload Progress: ${percentCompleted}%`);
                    },
                });

                // Determine message type
                let isImage = selectedFile.type.startsWith("image/");
                let isVideo = selectedFile.type.startsWith("video/");

                messagePayload.type = isImage || isVideo ? "media" : "document";

                messagePayload.file = {
                    url: publicUrl,
                    key,
                    fileName: selectedFile.name,
                    mimeType: selectedFile.type,
                    size: selectedFile.size,
                };
            }

            let socket = createSocketConnection();
            socket.emit("sendMessage",messagePayload);

            setText("");
            setSelectedFile(null);
            setIsDoubleClicked(false);

        } catch (error) {
            console.log("some error", error);
            toast.error(error.message || "Some error in uploading")
        }
    }

    let handleDelete = async()=>{
        try {
            let res = await deleteMessage({
                targetUserId : selectedUser._id,
                messageId : activeMsgId
            }).unwrap();

            if(res.success){
                toast.success(res.message);
                setIsDoubleClicked(false);
                refetchAllmsg();
            }
        } catch (error) {
            console.log(error);
            setIsDoubleClicked(false);
            toast.error(error.data?.message || "Some Problem in Deleting Message");
        }
    }

    let handleDeleteAll = async()=>{
        try {
            let res = await deleteAll(selectedUser._id).unwrap();
             if(res.success){
                toast.success(res.message)
                setDeleteModal(false);
                refetchAllmsg();
            }
        } catch (error) {
            console.log(error);
            setDeleteModal(false);
            toast.error(error.data?.message || "Some Problem in Deleting All Message");
        }
    }   

    let groupedMessages = Object.entries(
        allMessages?.reduce((groups, message) => {
            const date = dayjs(message.createdAt).format("YYYY-MM-DD");

            if (!groups[date]) {
                groups[date] = [];
            }

            groups[date].push(message);

            return groups;
        }, {})).map(([date, messages]) => ({date,messages})
        );

    if (!selectedUser){
        return(
            <section className="w-full h-full text-slate-400 text-sm bg-linear-to-tr from-rose-500 via-orange-300 to-purple-200">
                <div>
                    <img src={robot} alt="gif" className="w-60 m-auto" />
                </div>
                <div className="text-center">
                    <p className="text-base text-black">Hello <span className="text-purple-700 not-italic text-xl bg-yellow-300 p-1 rounded-lg"> {currentUser?.data?.name || "NA"}</span> </p>
                    <p className="text-white font-medium text-base">No conversation selected</p>
                    <p className="text-white text-sm">Pick a user from the list to start chatting</p>
                </div>                
            </section>
        )
    }
   
    return (
    <>
    <section className="md:w-full w-65 h-full flex flex-col backdrop-blur-sm">

        <header className="flex items-center justify-between gap-2 border-b bg-slate-700 border-slate-700 px-3 sm:px-4 py-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
                <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="h-10 w-10 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0">
                    <h2 className="text-sm font-semibold text-white truncate">{selectedUser.name}</h2>
                    <p className={`text-xs ${selectedUser.status == "online" ? "text-emerald-400" : "text-rose-400"}`}>
                        {selectedUser.status == "online" ? "Online" : "Offline"} {isTyping ? "Typing..." : ""}
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
                            value={findText}
                            onChange={(e)=>{
                                if(e.target.value){
                                    setFindText(e.target.value);
                                    // highLightText();
                                }else {
                                    setFindText("");
                                }
                            }}
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

        <article className="chat-scroll flex-1 overflow-y-auto p-2 space-y-1" >
        {groupedMessages.map((group) => (
            <div key={group.date}>

                <div className="flex justify-center my-2">
                    <span className="px-3 py-1 rounded-full bg-green-700 text-[10px]">
                    {dayjs(group.date).format("DD MMM YYYY")}
                    </span>
                </div>

                {group.messages.map((m) => {
                    const isMine = m?.senderId?._id == currentUser?.data?._id;
                    const isActive = activeMsgId === m._id;
                    const onlyTextCanBeEdited = m.type === "text";
                    return (
                    <nav
                        ref={scrollBar}
                        key={m._id}
                        className={`px-2 py-0.5 rounded-lg text-sm chat ${isMine? "chat-end": "chat-start"}`}
                    >
                        <span className="chat-header text-[10px]">{dayjs(m?.createdAt).format("HH:mm")}</span>

                        <div
                            onDoubleClick={() => {
                                setActiveMsgId(m._id);
                                setIsDoubleClicked(true);
                            }}
                            className={`chat-bubble cursor-pointer select-none ${
                               isMine? "chat-bubble-neutral": "chat-bubble-primary"}`}
                        >
                            <MessageContent
                                message={m}
                                findText={findText}
                            />
                        </div>

                        <div className="chat-footer opacity-50 flex items-center gap-2">
                            Delivered

                            <span className="text-[10px]">
                                {isMine ? "You" : ""}
                            </span>

                            {isDoubleClicked && isMine && isActive && onlyTextCanBeEdited &&(
                                <span className="flex items-center gap-1 ml-1">
                                <Pencil
                                    size={14}
                                    className="cursor-pointer text-warning"
                                    onClick={() => setText(m.text)}
                                />

                                <Trash2
                                    size={14}
                                    className="cursor-pointer text-error"
                                    onClick={() => handleDelete()}
                                />
                                </span>
                            )}
                        </div>
                    </nav>
                    );
                })}
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
                value={text}
                placeholder="Type a message..."
                className="flex-1 bg-transparent px-1 py-2.5 text-sm text-gray-800 outline-none placeholder:text-orange-400 dark:text-gray-200"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                onChange={(e) => {
                    let {value} = e.target;
                    let socket = createSocketConnection();
                    const current = currentUser?.data?._id;
                    const target = selectedUser?._id;
                    clearTimeout(typingTimerRef.current);
            
                    if(!value){
                        if (isTypingRef.current) {
                            socket.emit("typing:stop", {current,target});
                            isTypingRef.current = false;
                        }

                        setText("");
                        setIsDoubleClicked(false);
                        return;                       
                    }
                    else {
                        if (!isTypingRef.current) {
                            socket.emit("typing:start", {current,target});
                            isTypingRef.current = true;
                        }

                        typingTimerRef.current = setTimeout(() => {
                            socket.emit("typing:stop", {current,target});
                            isTypingRef.current = false;
                        }, 1500);
                        setText(value.charAt(0).toUpperCase() + value.slice(1))
                    }
                }}
            />
            )}
           
            {!selectedFile && <button onClick={()=> setShowEmojiPicker(!showEmojiPicker)} className="rounded-full p-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/10">
                <Smile size={20} className="text-gray-500 dark:text-gray-400" />
            </button>}
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

            {/* handle send */}
            <button
                onClick={handleSend}
                className="rounded-full cursor-pointer bg-indigo-500 p-2 text-white shadow-md transition-colors hover:bg-indigo-600"
            >
                <Send size={18} />
            </button>
        </article>
    </section>
    <UserViewModal user={selectedUser}/>
    <DeleteConversationModal 
        onDelete={handleDeleteAll} 
        deleteModal={deleteModal} 
        setDeleteModal={setDeleteModal} 
    />
    </>
    );
}

export default ALternateChatWindow;