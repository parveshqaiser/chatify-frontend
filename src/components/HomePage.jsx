import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import ChatWindow from "./ChatWindow.jsx";
import Sidebar from "./Sidebar.jsx";
import bgImage from "../assets/chat-br.jpg";
import toast from "react-hot-toast";
import { users ,initialMessages} from "../utils/constants.js";


function HomePage() {
  
    const [activeUserId, setActiveUserId] = useState(1);
    const [messages, setMessages] = useState(initialMessages);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const activeUser = users.find((u) => u.id === activeUserId);
    const activeMessages = messages[activeUserId] || [];

    const handleSelectUser = (id) => {
        setActiveUserId(id);
        setSidebarOpen(false);
    };

    const handleSend = (text) => {
        setMessages((prev) => ({
        ...prev,
        [activeUserId]: [
            ...(prev[activeUserId] || []),
            { id: Date.now(), text, fromSelf: true },
        ],
        }));
    };

    // useEffect(()=>{
    //     toast.custom((t) => (
    //     <main
    //         className={`${
    //         t.visible ? 'animate-custom-enter' : 'animate-custom-leave'
    //         } lg:max-w-md sm:max-w-sm w-full bg-blue-500 shadow-lg rounded-lg pointer-events-auto flex ring-opacity-5`}
    //     >
    //        <aside className="flex-1 flex items-start gap-3 p-4">
    //             <p className="text-white text-sm leading-6">
    //                 Welcome Parvesh Qaiser
    //             </p>
    //         </aside>
    //         <aside className="flex border-l border-gray-200">
    //             <button
    //                 onClick={() => toast.dismiss(t.id)}
    //                 className="w-full rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-black focus:outline-none"
    //             >
    //                 Close
    //             </button>
    //         </aside>
    //     </main>
    //     ))
    // },[])

    return (
    <main className="relative h-screen w-screen flex items-center justify-center overflow-hidden">
        <img
            src={bgImage}
            alt="background"
            className="absolute inset-0 w-full h-full object-cover -z-10"
        />
        <div className="relative z-10 flex w-[85vw] h-[85vh] rounded-xl overflow-hidden shadow-sm">
            
            {/* mobile menu button */}
            <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden absolute top-3 left-3 z-20 p-2 bg-white border border-slate-200 rounded-md"
            >
                <Menu className="w-5 h-5" />
            </button>
 
            {/* sidebar: 1/4 width on desktop, slide-over on mobile */}
            <div
                className={`fixed md:static inset-y-0 left-0 z-30 w-3/4 sm:w-1/2 md:w-1/4 transform transition-transform duration-200 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0`}
            >
                <div className="md:hidden flex justify-end p-2 bg-indigo-500">
                    <button onClick={() => setSidebarOpen(false)}>
                        <X className="w-5 h-5" />
                    </button>
                </div>
 
                <Sidebar
                    users={users}
                    activeUserId={activeUserId}
                    onSelectUser={handleSelectUser}
                />
            </div>
 
            {/* backdrop on mobile when sidebar is open */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/30 z-20 md:hidden"
                />
            )}
 
            {/* chat: 3/4 width on desktop, full width on mobile */}
            <nav className="flex-1 md:w-3/4">
                <ChatWindow user={activeUser} messages={activeMessages} onSend={handleSend} />
            </nav>
        </div>
    </main>
    );
}

export default HomePage;