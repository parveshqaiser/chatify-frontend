import { useState } from "react";
import { FileText, Mic, Paperclip, Send, Smile, Images, Phone, Info } from "lucide-react";

const ChatWindow = ({ user, messages, onSend })=>{ 

    const [text, setText] = useState("");
    const [showTextIcons, setShowTextIcons] = useState(false);
    const [moreInfo, setMoreInfo] = useState(false);

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
    <section className="w-full h-full flex flex-col bg-indigo-200">
        <header className="flex items-center justify-between border-b bg-slate-700 border-slate-700 px-4 py-3">
            <div className="flex items-center gap-3">
                <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-10 w-10 rounded-full object-cover"
                />

                <div>
                    <h2 className="text-sm font-semibold text-white">{user.name}</h2>
                    <p
                        className={`text-xs ${user.online ? "text-emerald-400" : "text-rose-400"}`}
                    >
                        {user.online ? "Online" : "Offline"}
                    </p>
                </div>
            </div>

            <div className="relative">
                <button
                    onClick={() => setMoreInfo(!moreInfo)}
                    className="rounded-full p-2 transition hover:bg-white/10"
                >
                    <Info size={20} className="text-gray-300" />
                </button>

                {moreInfo && (
                    <ul className="menu absolute right-0 top-full mt-1 z-50 w-24 rounded-box bg-base-100 shadow-xl">
                        <li>
                            <button className="text-sm"> View </button>
                        </li>
                        <li>
                            <button className="text-sm"> Search</button>
                        </li>
                         <li>
                            <button className="text-sm">Clear All</button>
                        </li>
                    </ul>
                )}
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

        <article className="flex items-center gap-2 border border-black/5 bg-white/50 px-3 py-2 shadow-inner backdrop-blur-sm dark:border-white/5 dark:bg-[#2d2d2b]">
            <div className="relative">
                <button
                    onClick={() => setShowTextIcons(!showTextIcons)}
                    className="rounded-full p-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                >
                    <Paperclip size={20} className="text-gray-500 dark:text-gray-400" />
                </button>

                {showTextIcons && (
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
                placeholder="Type a message..."
                className="flex-1 bg-transparent px-1 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 dark:text-gray-200 dark:placeholder:text-gray-500"
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />

            <button className="rounded-full p-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/10">
                <Smile size={20} className="text-gray-500 dark:text-gray-400" />
            </button>

            <button className="rounded-full p-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/10">
                <Mic size={20} className="text-gray-500 dark:text-gray-400" />
            </button>

            <button
                className="rounded-full bg-indigo-500 p-2 text-white shadow-md transition-colors hover:bg-indigo-600"
            >
                <Send size={18} />
            </button>
        </article>
    </section>
    );
}

export default ChatWindow;
