import React, { useState } from 'react';
import { 
	Search, 
	MoreVertical, 
	Phone, 
	Video, 
	Info, 
	Send, 
	Paperclip, 
	Smile, 
	Mic,
	Menu
} from 'lucide-react';

// this component is used for fucture testing purpose

const TestHomePage1 = () => {
	// Sample user data
	const users = [
		{ id: 1, name: 'Aarav', avatar: 'AA', online: true, lastSeen: 'Online' },
		{ id: 2, name: 'Priya', avatar: 'PR', online: true, lastSeen: 'Online' },
		{ id: 3, name: 'Vikram', avatar: 'VI', online: false, lastSeen: '2h ago' },
		{ id: 4, name: 'Sneha', avatar: 'SN', online: true, lastSeen: 'Online' },
		{ id: 5, name: 'Rahul', avatar: 'RA', online: false, lastSeen: '5h ago' },
		{ id: 6, name: 'Ananya', avatar: 'AN', online: true, lastSeen: 'Online' },
		{ id: 7, name: 'Dev', avatar: 'DE', online: false, lastSeen: '1d ago' },
		{ id: 8, name: 'Maya', avatar: 'MA', online: true, lastSeen: 'Online' },
	];

	const [selectedUser, setSelectedUser] = useState(users[1]); // Priya as default
	const [message, setMessage] = useState('');

	return (
	<main className="flex items-center justify-center min-h-screen bg-linaer-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
		{/* Main Container - does not touch border */}
		<div className="flex w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm bg-white/80 border border-white/40">
			
			{/* Left Panel - Users List with Gradient Scrollbar */}
			<div className="w-full md:w-1/3 lg:w-1/4 flex flex-col bg-linear-to-b from-indigo-500/90 via-purple-500/90 to-pink-500/90 backdrop-blur-sm text-white">
				{/* Header */}
				<header className="p-4 border-b border-white/20 flex items-center justify-between">
					<h2 className="text-xl font-semibold tracking-wide">Chats</h2>
					<button className="p-1.5 rounded-full hover:bg-white/20 transition-colors">
					<MoreVertical size={20} />
					</button>
				</header>

				{/* Search */}
				<section className="p-3">
					<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={18} />
					<input 
						type="text" 
						placeholder="Search users..." 
						className="w-full bg-white/20 backdrop-blur-sm text-white placeholder:text-white/60 rounded-xl py-2.5 pl-10 pr-4 outline-none border border-white/20 focus:ring-2 focus:ring-white/40 transition-all"
					/>
					</div>
				</section>

			{/* Users List with custom gradient scrollbar */}
				<section className="flex-1 overflow-y-auto px-2 pb-4 space-y-1.5 custom-scrollbar">
					{users.map((user) => (
					<div 
						key={user.id}
						onClick={() => setSelectedUser(user)}
						className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
						selectedUser.id === user.id 
							? 'bg-white/30 backdrop-blur-md shadow-lg' 
							: 'hover:bg-white/20'
						}`}
					>
						<div className="relative">
							<div className="w-11 h-11 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center font-semibold text-white text-lg shadow-md">
								{user.avatar}
							</div>
							{user.online && (
								<span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-sm"></span>
							)}
						</div>
						<div className="flex-1 min-w-0">
							<div className="flex justify-between items-center">
								<h3 className="font-medium truncate">{user.name}</h3>
								<span className="text-xs text-white/70">{user.lastSeen}</span>
							</div>
							<p className="text-sm text-white/70 truncate">
								{user.online ? 'Active now' : 'Last seen recently'}
							</p>
						</div>
					</div>
					))}
					{/* Extra spacer for scroll */}
					<div className="h-2"></div>
				</section>
			</div>

			{/* Right Panel - Chat Area (off-white) */}
			<div className="flex-1 flex flex-col bg-[#f8f6f2] dark:bg-[#1e1e1c] transition-colors">
			{/* Chat Header */}
				<div className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
					<div className="flex items-center gap-3">
					<div className="relative">
						<div className="w-10 h-10 rounded-full bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center font-semibold text-indigo-700 dark:text-indigo-200 shadow-md">
						{selectedUser.avatar}
						</div>
						{selectedUser.online && (
						<span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white dark:border-[#1e1e1c] rounded-full"></span>
						)}
					</div>
					<div>
						<h3 className="font-semibold text-gray-800 dark:text-gray-100">{selectedUser.name}</h3>
						<p className="text-xs text-gray-500 dark:text-gray-400">
						{selectedUser.online ? 'Online' : 'Offline'}
						</p>
					</div>
					</div>
					<div className="flex items-center gap-1 sm:gap-2">
					<button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
						<Phone size={20} className="text-gray-600 dark:text-gray-300" />
					</button>
					<button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
						<Video size={20} className="text-gray-600 dark:text-gray-300" />
					</button>
					<button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
						<Info size={20} className="text-gray-600 dark:text-gray-300" />
					</button>
					</div>
				</div>

			{/* Messages Area */}
				<div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8f6f2] dark:bg-[#1e1e1c]">
					{/* Sample messages */}
					<div className="flex justify-start">
					<div className="max-w-[80%] bg-white dark:bg-[#2d2d2b] rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm">
						<p className="text-sm text-gray-800 dark:text-gray-200">Hey! How's it going?</p>
						<span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 block">10:30 AM</span>
					</div>
					</div>
					<div className="flex justify-end">
					<div className="max-w-[80%] bg-indigo-500 text-white rounded-2xl rounded-tr-none px-4 py-2.5 shadow-sm">
						<p className="text-sm">I'm good, thanks! Working on the Chatify UI.</p>
						<span className="text-[10px] text-indigo-200 mt-1 block text-right">10:32 AM</span>
					</div>
					</div>
					<div className="flex justify-start">
					<div className="max-w-[80%] bg-white dark:bg-[#2d2d2b] rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm">
						<p className="text-sm text-gray-800 dark:text-gray-200">That sounds awesome! Can't wait to see it.</p>
						<span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 block">10:35 AM</span>
					</div>
					</div>
					<div className="flex justify-end">
					<div className="max-w-[80%] bg-indigo-500 text-white rounded-2xl rounded-tr-none px-4 py-2.5 shadow-sm">
						<p className="text-sm">Thanks! I'll share the demo soon.</p>
						<span className="text-[10px] text-indigo-200 mt-1 block text-right">10:38 AM</span>
					</div>
					</div>
				</div>

			{/* Input Area */}
				<div className="p-4 border-t border-black/5 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
					<div className="flex items-center gap-2 bg-white dark:bg-[#2d2d2b] rounded-2xl px-4 py-1.5 shadow-inner border border-black/5 dark:border-white/5">
					<button className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
						<Paperclip size={20} className="text-gray-500 dark:text-gray-400" />
					</button>
					<input 
						type="text" 
						placeholder="Type a message..." 
						className="flex-1 bg-transparent outline-none text-sm text-gray-800 dark:text-gray-200 py-2.5 px-1 placeholder:text-gray-400 dark:placeholder:text-gray-500"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && setMessage('')}
					/>
					<button className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
						<Smile size={20} className="text-gray-500 dark:text-gray-400" />
					</button>
					<button className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
						<Mic size={20} className="text-gray-500 dark:text-gray-400" />
					</button>
					<button 
						className="p-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white transition-colors shadow-md"
						onClick={() => setMessage('')}
					>
						<Send size={18} />
					</button>
					</div>
				</div>
			</div>
		</div>

		{/* Custom CSS for gradient scrollbar */}
		<style jsx>
			{`
				.custom-scrollbar::-webkit-scrollbar {
				width: 5px;
				}
				.custom-scrollbar::-webkit-scrollbar-track {
				background: transparent;
				margin: 8px 0;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb {
				background: rgba(255,255,255,0.4);
				backdrop-filter: blur(4px);
				border-radius: 20px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb:hover {
				background: rgba(255,255,255,0.6);
				}
				/* Firefox scrollbar */
				.custom-scrollbar {
				scrollbar-width: thin;
				scrollbar-color: rgba(255,255,255,0.4) transparent;
				}
		`}</style>
	</main>
	);
};

export default TestHomePage1;