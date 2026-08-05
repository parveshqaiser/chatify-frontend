import { useState } from "react";
import { LogOutIcon, MessageCirclePlus, MoreVertical, Search, UserCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { api, useLogoutMutation } from "../redux/api.js";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";

const Sidebar = ({ users, activeUser, onSelectUser }) => {
	

	let [logout] = useLogoutMutation();

	let dispatch = useDispatch();
	let navigate = useNavigate();

	const [query, setQuery] = useState(""); // search input
	const [tab, setTab] = useState("online");
	const [verticalBtn, setVerticalBtn] = useState(false);  // modal

	const filtered = users.filter((u) => (tab === "online" ? u.status == "online" : true))
		.filter((u) => u.name.toLowerCase().includes(query.toLowerCase()));


	let handleLogout = async()=>{
		try {
			let res = await logout().unwrap();
			if(res.success){
				toast.success(res.message);
				localStorage.removeItem("token");
				dispatch(api.util.resetApiState());
				setTimeout(()=>{
					navigate("/login");
				},1200);	
			}
		} catch (error) {
			toast.error(error.data?.message || "Logout failed");
		}
	}

	return (
	<aside className="w-full h-full flex flex-col bg-linear-to-t from-indigo-500 via-purple-500 to-pink-500 backdrop-blur-sm">
		<header className="p-4 flex border-b border-white/20 items-center justify-between">
			<h2 className="text-xl font-semibold tracking-wide text-white">Chats</h2>
			<button onClick={()=> setVerticalBtn(!verticalBtn)} className="p-1.5 rounded-full hover:bg-white/20 cursor-pointer transition-colors text-white">
				<MoreVertical size={20} />
			</button>

			{verticalBtn && (
				<ul className="menu absolute top-13.75 right-1 z-20 bg-base-100  rounded-box">
					<li className="tooltip" data-tip="Profile">
						{/* <Link to="/profile" ><span className="text-[13px]">Profile </span></Link> */}
						<Link to="/profile">
							<UserCircle size={18} />
						</Link>
					</li>
					<li className="tooltip" data-tip="Create Group">
						<Link to="/group" >
							<MessageCirclePlus size={18}/>
						</Link>
					</li>
					<li className="tooltip" data-tip="Log out">
						<button onClick={handleLogout} className="text-[13px]">
							<LogOutIcon size={18} />
						</button>
					</li>
				</ul>
			)}
		</header>

		<section className="p-2 m-1">
			<div className="relative">
				<Search className="absolute left-3 top-3 w-4 h-4 text-white/60" />
				<input
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search users..."
					className="w-full pl-9 pr-3 py-2.5 text-sm rounded-2xl bg-white/15 text-white placeholder:text-white/60 outline-none border border-white/20 focus:ring-2 focus:ring-white/40 transition-all"
				/>
			</div>
		</section>

		{/* temp button might chage latr */}
		<section className="flex gap-1 px-2 pb-2 text-sm">
			{["online", "all"].map((t) => (
				<button
					key={t}
					onClick={() => setTab(t)}
					className={`px-4 py-2 rounded-md capitalize text-black ${
					tab === t ? "bg-indigo-600 text-white" : "hover:bg-indigo-100"
					}`}
				>
					{t}
				</button>
			))}
		</section>

		<section className="sidebar-scroll flex-1 overflow-y-auto px-2 pb-2 space-y-1">
			{filtered.map((user) => {
			const initials = user.name.slice(0, 2).toUpperCase();
			return (
				<button
					key={user._id}
					onClick={() => onSelectUser(user)}
					className={`w-full flex items-center gap-3 px-2 py-2 rounded-2xl text-left transition-colors ${activeUser._id === user.id? "bg-white/25 shadow-lg": "hover:bg-white/10"}`}
				>
					<span className="relative shrink-0">
						<span className="w-12 h-12 rounded-full bg-white/25 flex items-center justify-center text-white font-semibold text-sm">
							{initials}
						</span>
						{user.status == "online" && (
							<span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-purple-400" />
						)}
					</span>

					<span className="flex-1 min-w-0">
						<span className="flex items-center justify-between gap-2">
							<span className="font-semibold text-white truncate">{user.username}</span>
						</span>
						<span className="block text-[12px] text-white/70 truncate">
							{user.status == "online" ? "Active now" : "Last seen recently"}
						</span>
					</span>
				</button>
			);
			})}

			{filtered.length === 0 && (
				<p className="text-md text-white/70 text-center py-6">No users found</p>
			)}
		</section>
	</aside>
	);
};

export default Sidebar;