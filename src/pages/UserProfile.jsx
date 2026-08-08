
import React, { useState, useEffect } from 'react';
import { Link} from 'react-router-dom';
import {User,Mail,CalendarDays,Clock3,Pencil,Camera,Lock,Image,FileText,Video,HardDrive,Users,
	MessageCircle,Send,ShieldCheck,Crown,UserX,ArrowUpRight,LogOut,AtSign,BadgeInfo,HomeIcon,
} from "lucide-react";

import { groups, blockedUsers } from '../utils/constants';
import {useGetUserDetailsQuery, useUpdatePasswordMutation, useUpdateProfileMutation } from '../redux/api.js';
import toast from 'react-hot-toast';
import { LoadingMessage } from '../components/Spinner.jsx';
import dayjs from 'dayjs';
import useLogout from '../hooks/useLogout.js';

const UserProfile = () => {

	let {data : user, isLoading , isError,error, refetch} = useGetUserDetailsQuery();
	let [updateProfle] = useUpdateProfileMutation();
	let [updatePassword] = useUpdatePasswordMutation();

	let logoutHandler = useLogout();

	let [name, setName] = useState("");
	let [bio, setBio] = useState("");

	let [pwdValues, setPwdValues] = useState({
		password : "",
		newPassword : "",
		confirmPassword : "",
	});

	useEffect(() => {
		if (user?.data) {
			setName(user.data.name);
			setBio(user.data.bio);
		}
	},[user?.data]);

	if(isLoading){
		return(
			<LoadingMessage />
		)
	}

	if(isError){
		return <div className="flex items-center justify-center min-h-screen">
			<h2 className='text-xl text-red-500'>Some Error Occured While Trying to Fetch Profile Data.. Please Try again later</h2>
		</div>
	}

	const handleSubmitProfile = async()=>{

		if(!name.trim() || !bio.trim()){
			return toast.error("Name & Bio Cannot be empty")
		}

		try {
			let res = await updateProfle({name,bio}).unwrap();
			if(res.success){
				toast.success(res.message);
				await refetch();
			}
		} catch (error) {
			console.log(error);
			toast.error(error?.data?.message || "Failed to update profile");
		}	
	}

	const handleUpdatePassword = async()=>{

		// let {existingPassword, newPassword, confirmPassword} = pwdValues;  NOTE
		let {password, newPassword, confirmPassword} = pwdValues;

		if(!password.trim() || !newPassword.trim() || !confirmPassword.trim()){
			return toast.error("All Password fields are required")
		}

		if(newPassword !== confirmPassword){
			return toast.error("Confrim Password doesn't match")
		}

		let data = pwdValues;

		try {
			let res = await updatePassword(data).unwrap();
			if(res.success){
				toast.success(res.message);
				await refetch();
				setPwdValues({
					password : "",
					newPassword :"",
					confirmPassword :""
				})
			}
		} catch (error) {
			console.log(error);
			toast.error(error?.data?.message || "Failed to update password");
		}
	}

	return (
	<main className="min-h-screen bg-base-200 p-4 md:p-8">
		<div className="mx-auto max-w-7xl space-y-8">

			<header className="flex flex-col gap-6 lg:flex-row lg:justify-between lg:items-center">
				<div>
					<h1 className="text-4xl font-bold">Profile</h1>
					<p className="text-base-content/70 mt-1">
						Manage your account and view your activity.
					</p>
				</div>

				<div>
					<Link to={"/home"} className="btn btn-primary btn-outline w-full lg:w-auto">
						<HomeIcon size={18} />
						Home
					</Link>
				</div>
				
			</header>

			{/* prifile */}
			<section className="card bg-base-200 shadow-xl">
				<aside className="card-body">
					<div className="flex flex-col gap-6 lg:flex-row lg:items-start">
						
						<div className="flex justify-center lg:justify-start">
							<div className="avatar">
								<div className="w-28 rounded-full ring ring-primary ring-offset-2 ring-offset-base-200">
									<img
										src="https://i.pravatar.cc/300"
										alt="Profile"
									/>
								</div>
							</div>
						</div>

						{/* User Info */}
						<div className="flex-1 space-y-2">
							<h2 className="flex items-center gap-2 text-[22px] font-bold">
								<User size={22} className="" />
								{user?.data?.name || "John Doe"}
							</h2>

							<div className="flex items-center gap-2 text-base-content/80">
								<AtSign size={18} className="" />
								<span>{user?.data?.username || "dimpu123"}</span>
							</div>

							<div className="flex items-center gap-2 text-base-content/80 break-all">
								<Mail size={18} className="" />
								<span>{user?.data?.email || "johndoe@gmail.com"}</span>
							</div>

							<div className="flex items-start gap-2 text-base-content/80">
								<BadgeInfo
									size={18}
									className=" mt-1 shrink-0"
								/>

								<p className='italic'>
									{user?.data?.bio || "NA"}
								</p>
							</div>
						</div>

						{/* Logout */}
						<div className="lg:ml-auto lg:self-start">
							<button onClick={logoutHandler} className="btn btn-error btn-outline w-full lg:w-auto">
								<LogOut size={18} />
								Log out
							</button>
						</div>
					</div>
				</aside>
			</section>

			<section className="grid gap-6 lg:grid-cols-2">

				<div className="space-y-6">
					{/* Edit Profile */}
					<aside className="card bg-base-100 shadow-lg">
						<div className="card-body gap-y-3">
							<h2 className="card-title">
								<Pencil size={18} /> Edit Profile
							</h2>

							<div className="flex flex-col items-center gap-4">
								<div className="avatar">
									<div className="w-24 rounded-full">
										<img src="https://i.pravatar.cc/300" />
									</div>
								</div>

								<button className="btn btn-dash btn-sm">
									<Camera size={16} /> Change Avatar
								</button>
							</div>

							<input
								type="text"
								placeholder="Full Name"								
								value={name}
								onChange={(e)=> {
									let {value} = e.target;
									value = value.charAt(0).toUpperCase() + value.slice(1);
									setName(value);
								}}
								className="input input-accent w-full"
							/>

							<textarea
								className="textarea textarea-accent"
								rows={3}
								value={bio}
								maxLength={100}
								onChange={(e)=> {
									let {value} = e.target;
									value = value.charAt(0).toUpperCase() + value.slice(1);
									setBio(value);
								}}
								placeholder="Write your Bio..."
							/>

							<button onClick={handleSubmitProfile} className="btn btn-info w-full">
								Save Changes
							</button>
						</div>
					</aside>

					{/* Storage */}
					<aside className="card bg-base-100 shadow-lg">
						<div className="card-body">
							<h2 className="card-title">
								<HardDrive size={20} />
								Storage
							</h2>

							<div className="space-y-4 mt-3">
								<div className="flex justify-between">
									<span className="flex items-center gap-2">
									<Image size={18} />
									Images
									</span>

									<span className="font-semibold">58</span>
								</div>

								<div className="flex justify-between">
									<span className="flex items-center gap-2">
									<Video size={18} />
									Videos
									</span>

									<span className="font-semibold">12</span>
								</div>

								<div className="flex justify-between">
									<span className="flex items-center gap-2">
									<FileText size={18} />
									Documents
									</span>

									<span className="font-semibold">26</span>
								</div>

								<progress
									className="progress progress-primary w-full"
									value="62"
									max="100"
								></progress>

								<p className="text-sm text-base-content/70">
									1.8 GB of 5 GB used
								</p>
							</div>
						</div>
					</aside>

					{/*GROUPS  */}
					<aside className="card bg-base-100 shadow-lg">
						<div className="card-body p-5">
							<div className="flex items-center justify-between mb-3">
								<h2 className="card-title text-lg">
									<Users size={20} />Groups
								</h2>

								<div className="badge badge-primary">
									{groups.length} total
								</div>
							</div>

							<ul className="space-y-1">
								{groups.map((g) => (
									<li
										key={g.name}
										className="flex items-center justify-between rounded-lg px-0 py-3 hover:bg-base-200 transition-colors"
									>
										<div className="flex items-center gap-3">
											<span className="text-sm font-medium">
												{g.name}
											</span>
										</div>

										{g.creator ? (
											<div className="badge badge-info">
												<Crown className="w-3 h-3" />
												Creator
											</div>
										) : (
											<div className="badge badge-success">
												Member
											</div>
										)}
									</li>
								))}
							</ul>
						</div>
					</aside>
				</div>

				<div className="space-y-6">
					
					{/* Password */}
					<aside className="card bg-base-100 shadow-lg">
						<div className="card-body gap-y-3">
							<h2 className="card-title">
								<Lock size={20} />
								Change Password
							</h2>

							<input
								type="password"
								value={pwdValues.password}
								onChange={(e)=> {
									let {value} = e.target;								
									setPwdValues({...pwdValues,password : value})
								}}
								placeholder="Current Password"
								className="input input-warning"
							/>

							<input
								type="password"
								value={pwdValues.newPassword}
								onChange={(e)=> {
									let {value} = e.target;
									setPwdValues({...pwdValues,newPassword : value})
								}}
								placeholder="New Password"
								className="input input-warning"
							/>

							<input
								type="password"
								value={pwdValues.confirmPassword}
								onChange={(e)=> {
									let {value} = e.target;
									setPwdValues({...pwdValues,confirmPassword : value})
								}}
								placeholder="Confirm Password"
								className="input input-warning"
							/>

							{user?.data?.lastPasswordUpdated && 
								<p className="text-sm text-base-content/60">							
									Password last changed on {dayjs(user?.data?.lastPasswordUpdated).format("D MMMM YYYY") || "NA"}
								</p>
							}
							<button 
								onClick={handleUpdatePassword}
								className="btn btn-warning w-full"
							>
								Update Password
							</button>
						</div>
					</aside>

					{/* Account Info*/}
					<aside className="card bg-base-100 shadow-lg">
						<div className="card-body">
							<h2 className="card-title">
								<ShieldCheck size={20} />
								Account Information
							</h2>

							<div className="space-y-4">
								<div className="flex justify-between">
									<span>Email Verified</span>
									<div className="badge badge-success">Verified</div>
								</div>

								<div className="flex justify-between">
									<span>Account Status</span>

									<div className="badge badge-primary">Active</div>
								</div>

								<div className="flex justify-between">
									<span>Member Since</span>
									<span>{dayjs(user?.data?.createdAt).format("D MMMM YYYY") || "NA"}</span>
								</div>

								<div className="flex justify-between">
									<span>Last Login</span>
									<span>{dayjs(user?.data?.lastLogin).format("D MMMM YYYY") || "NA"}</span>
								</div>
							</div>
						</div>
					</aside>

					{/* Statistics */}
					<aside className="card bg-base-100 shadow-lg">
						<div className="card-body">
							<h2 className="card-title">
								<MessageCircle size={20} />
								Chat Statistics
							</h2>

							<div className="stats stats-vertical lg:stats-horizontal shadow">
								<div className="stat">
									<div className="stat-figure text-primary">
										<MessageCircle />
									</div>

									<div className="stat-title">Chats</div>
									<div className="stat-value">24</div>
								</div>

								<div className="stat">
									<div className="stat-figure text-secondary"><Send /></div>
									<div className="stat-title">Messages</div>
									<div className="stat-value">3.4K</div>
								</div>

								<div className="stat">
									<div className="stat-figure text-accent"><Users /></div>
									<div className="stat-title">Contacts</div>
									<div className="stat-value">91</div>
								</div>
							</div>
						</div>
					</aside>

					{/* Blocked users */}
					<section className="card bg-base-100 shadow-lg">
						<aside className="card-body p-5">
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
								<h2 className="card-title text-lg">
									<UserX size={20} />
									Blocked Users
								</h2>

								<div className="badge badge-error badge-outline">
									{blockedUsers.length} Total
								</div>
							</div>

							<ul className="space-y-1">
								{blockedUsers.map((user) => (
									<li
										key={user}
										className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl px-0 py-2 hover:bg-base-200 transition-all"
									>
										<div className="flex items-center gap-3">										
											<span className="font-medium text-sm break-all">
												{user}
											</span>
										</div>

										<button className="btn btn-sm btn-outline btn-success">
											Unblock
											<ArrowUpRight size={15} />
										</button>
									</li>
								))}
							</ul>
						</aside>
					</section>
				</div>
			</section>
		</div>
	</main>
	);
};

export default UserProfile;
