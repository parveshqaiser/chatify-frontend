import { useState } from "react";
import { Menu, X } from "lucide-react";
import ChatWindow from "./ChatWindow.jsx";
import Sidebar from "./Sidebar.jsx";

const users = [
    { id: 1, name: "Yamal", online: true, avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT0M9PkaDKnCMW8NANGmmvjkS-WhhsIOe4pQ&s" },
    { id: 2, name: "Messi", online: true, avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT0M9PkaDKnCMW8NANGmmvjkS-WhhsIOe4pQ&s" },
    { id: 3, name: "Ronaldo", online: false, avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT0M9PkaDKnCMW8NANGmmvjkS-WhhsIOe4pQ&s" },
    { id: 4, name: "Bruno", online: false, avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT0M9PkaDKnCMW8NANGmmvjkS-WhhsIOe4pQ&s" },
];

const initialMessages = {
    1: [
        { id: 1, text: "Are we still on for 6?", fromSelf: false },
        { id: 2, text: "Yep, see you then", fromSelf: true },
    ],
};

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

    return (
    <main className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="relative flex w-[85vw] h-[85vh] rounded-xl overflow-hidden border border-slate-200 shadow-sm">
            
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