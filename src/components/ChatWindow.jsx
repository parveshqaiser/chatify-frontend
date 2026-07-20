import { useState } from "react";
import { Send } from "lucide-react";

const ChatWindow = ({ user, messages, onSend })=>{ 

	const [text, setText] = useState("");

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
	<section className="w-full h-full flex flex-col bg-slate-50">
		<header className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 bg-white">
			<img
				src={user.avatar}
				alt={user.name}
				className="w-7 h-7 rounded-full object-cover bg-indigo-200"
			/>
				<span className="text-sm font-medium text-slate-700">{user.name}</span>
				<span className="text-xs text-slate-400 ml-auto">
					{user.online ? "online" : "offline"}
				</span>
		</header>

		<div className="chat-scroll flex-1 overflow-y-auto p-4 space-y-2">
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
		</div>

		<div className="flex items-center gap-2 p-3 border-t border-slate-200 bg-white">
			<input
				value={text}
				onChange={(e) => setText(e.target.value)}
				onKeyDown={(e) => e.key === "Enter" && handleSend()}
				placeholder="Message"
				className="flex-1 px-3 py-2 text-sm rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
			/>
			<button
				onClick={handleSend}
				className="p-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
			>
				<Send className="w-4 h-4" />
			</button>
		</div>
	</section>
	);
}

export default ChatWindow;