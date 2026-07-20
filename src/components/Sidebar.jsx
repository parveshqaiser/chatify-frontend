import { useState } from "react";
import { MoreVertical, Search } from "lucide-react";

const Sidebar = ({ users, activeUserId, onSelectUser })=>{

	const [query, setQuery] = useState("");
	const [tab, setTab] = useState("online");

	const filtered = users.filter((u) => (tab === "online" ? u.online : true))
		.filter((u) => u.name.toLowerCase().includes(query.toLowerCase())
	);

	console.log(filtered)

	return (
	<aside className="w-full h-full border-r border-indigo-100 flex flex-col bg-linear-to-b from-indigo-500/90 via-purple-500/90 to-pink-500/90 backdrop-blur-sm">
		<header className="p-4 flex border-b border-white/20 items-center justify-between">
			<h2 className="text-xl  font-semibold tracking-wide">Chats</h2>
			<button className="p-1.5 rounded-full hover:bg-white/50 cursor-pointer transition-colors">
				<MoreVertical size={20} />
			</button>
		</header>
		<section className="p-3">
			<div className="relative">
				<Search className="absolute left-2.5 top-2.5 w-4 h-4 text-indigo-400" />
				<input
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search Users"
					className="w-full pl-8 pr-3 py-2 text-md rounded-md bg-white/20 backdrop-blur-sm text-white placeholder:text-white/60 outline-none border border-white/20 focus:ring-2 focus:ring-white/40 transition-all"
				/>
			</div>
		</section>

		<section className="flex gap-2 px-3 pb-2 text-sm">
			{["online", "all"].map((t) => (
				<button
					key={t}
					onClick={() => setTab(t)}
					className={`px-3 py-2 rounded-md capitalize ${
					tab === t ? "bg-indigo-600 text-white" : "text-black hover:bg-indigo-100"
					}`}
				>
					{t}
				</button>
			))}
		</section>

		<section className="sidebar-scroll flex-1 overflow-y-auto border-t border-indigo-100">
			{filtered.map((user) => (
				<button
					key={user.id}
					onClick={() => onSelectUser(user.id)}
					className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/20 ${activeUserId === user.id ? "bg-white/30 backdrop-blur-md shadow-lg" : ""}`}
				>
					<span className="relative">
						<img
							src={user.avatar}
							alt={user.name}
							className="w-8 h-8 rounded-full object-cover bg-indigo-200"
						/>
						{user.online && (
							<span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-indigo-50" />
						)}
					</span>
				<span className="text-sm font-medium truncate text-slate-700">{user.name}</span>
			</button>
			))}

			{filtered.length === 0 && (
				<p className="text-md text-indigo-300 text-center py-6">No users found</p>
			)}
		</section>
	</aside>
	);
}

export default Sidebar;