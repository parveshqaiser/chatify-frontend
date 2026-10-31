
import { Info } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

const GroupMessage = () => {

    let {id} = useParams();
    let menuRef = useRef();

    const [searchOpen, setSearchOpen] = useState(false);
    const [moreInfo, setMoreInfo] = useState(false);  // more info button in header

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


    return (
        <>
        <main className="md:w-4xl mx-auto w-65 h-full flex flex-col backdrop-blur-sm my-2 border">
            <header className="flex items-center justify-between gap-2 border-b bg-slate-700 border-slate-700 px-3 sm:px-4 py-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                        src={"https://res.cloudinary.com/dp0v0zb7z/image/upload/v1790095083/avatars/nir7pxgahvzado2rff4s.jpg"}
                        // alt={selectedUser.name}
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
                                    <button onClick={()=>document.getElementById('my_modal_5').showModal()} className="text-[12px]">View</button>
                                </li>
                                 <li>
                                    <button className="text-[12px]">
                                        Add
                                    </button>
                                </li>
                                 <li>
                                    <button className="text-[12px]">
                                        Remove
                                    </button>
                                </li>
                               
                                <li>
                                    <button 
                                        // onClick={()=>document.getElementById('my_modal_3').showModal()}
                                        // onClick={()=>setDeleteModal(true)}  
                                        className="text-[12px]"
                                    >
                                        Clear All
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

            <section className='chat-scroll flex-1 overflow-y-auto p-2 space-y-1'>
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
                    <div className="chat-bubble">You were the Chosen One!</div>
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
                <div className="chat-bubble">I hate you!</div>
                <div className="chat-footer opacity-50">Seen at 12:46</div>
                </div>
            </section>

            <footer>
                <input
                    type="text"
                    // value={text}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent px-1 py-2.5 text-sm text-gray-800 outline-none placeholder:text-orange-400 dark:text-gray-200"
                    // onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
            </footer>
        </main>

        
        
        </>
    )
}

export default GroupMessage
