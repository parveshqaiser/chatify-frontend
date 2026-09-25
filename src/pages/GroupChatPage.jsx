import { HomeIcon, MessageCirclePlus } from 'lucide-react'
import React, { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CameraAvatarSVG, PlusIconSVG, SearchIconSVG } from '../utils/svg-icons.jsx'

const ALL_USERS = [
    { id: 1, username: 'aarav_k' },
    { id: 2, username: 'meera.j' },
    { id: 3, username: 'rohan99' },
    { id: 4, username: 'priya_s' },
    { id: 5, username: 'devansh' },
    { id: 6, username: 'ishaan_r' },
    { id: 7, username: 'parveshq' },
    { id: 8, username: 'bidi123' },
]

// Deterministic gradient per username, so each badge/avatar has a stable identity
const PALETTES = [
    ['#7C5CFF', '#4C3BCF'],
    ['#FF6B9D', '#C13584'],
    ['#2DD4BF', '#0EA5A5'],
    ['#FFA45B', '#E8703A'],
    ['#5CC8FF', '#2E8FE0'],
    ['#B892FF', '#7B4FE0'],
]
const paletteFor = (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
    return PALETTES[Math.abs(hash) % PALETTES.length]
}

const Avatar = ({ username, size = 36 }) => {
    const [from, to] = paletteFor(username)
    return (
        <div
            className="rounded-full flex items-center justify-center font-semibold text-white shrink-0 select-none"
            style={{
                width: size,
                height: size,
                fontSize: size * 0.4,
                background: `linear-gradient(135deg, ${from}, ${to})`,
            }}
        >
            {username.charAt(0).toUpperCase()}
        </div>
    )
}

const GroupChatPage = () => {

    const dialogRef = useRef(null);
    const fileInputRef = useRef(null);

    const [groupName, setGroupName] = useState('');  // grorp name
    const [groupImage, setGroupImage] = useState(''); // image of group
    const [searchUsername, setSearchUsername] = useState("");  // search people by usernme
    const [selectedUsers, setSelectedUsers] = useState([]); 
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const openModal = () => dialogRef.current?.showModal()
    const closeModal = () => {
        dialogRef.current?.close();
        setGroupName("");
        setGroupImage("");
        setSearchUsername("");
    }

    const handleImageChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setGroupImage(URL.createObjectURL(file))
    }

    const filteredUsers = useMemo(() => {
        if (!searchUsername.trim()) return []
        const q = searchUsername.toLowerCase();
        return ALL_USERS.filter(
            (u) => u.username.toLowerCase().includes(q) && !selectedUsers.some((s) => s.id === u.id)
        )
    }, [searchUsername, selectedUsers])

    const addUser = (user) => {
        setSelectedUsers((prev) => [...prev, user]);
        // setSelectedUsers([...selectedUsers , user])
        setSearchUsername("");
        setIsDropdownOpen(false)
    }

    const removeUser = (userId) => {
        let del = selectedUsers.filter(user => user.id !== userId);
        setSelectedUsers(del);
    }

    return (
    <main className='min-h-screen bg-base-200 p-2 md:p-6'>
        <header className="flex flex-col gap-6 lg:flex-row lg:justify-between lg:items-center">
            <div>
                <h1 className="text-xl font-bold">Create Group Chat</h1>
                <button className="btn btn-success btn-sm mt-2" onClick={openModal}>
                    <MessageCirclePlus size={16} /> New Group
                </button>
            </div> 
            <div>
                <Link to={"/home"} className="btn btn-error btn-outline w-full lg:w-auto">
                    <HomeIcon size={16} />
                    Home
                </Link>
            </div>				
        </header>

        <dialog ref={dialogRef} className="modal">
            <main className="modal-box max-w-md p-0 overflow-visible rounded-3xl border border-base-content/10 bg-base-100 shadow-2xl">
               
                <header className="px-5 py-3 mb-2">
                    <h3 className="text-xl font-semibold tracking-tight">New group</h3>
                    <p className="text-sm text-base-content/50 mt-0.5">
                        Give it a name and add who you want to talk to.
                    </p>
                </header>

                <section className="px-7 pb-7">

                    <article className="flex justify-center my-2">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="group relative"
                        >
                            <div
                                className="w-20 h-20  rounded-full flex items-center justify-center overflow-hidden transition-all duration-200 ring-2 ring-dashed ring-base-content/20 group-hover:ring-primary group-hover:ring-offset-2 group-hover:ring-offset-base-100"
                                style={!groupImage ? { background: 'linear-gradient(135deg, rgba(124,92,255,0.12), rgba(45,212,191,0.12))'} : undefined}
                            >
                                {groupImage ? (
                                    <img src={groupImage} alt="Group" className="w-full h-full object-cover" />
                                ) : (
                                   <PlusIconSVG   className="w-7 h-7 text-base-content/30 group-hover:text-primary transition-colors" />
                                )}
                            </div>
                            <CameraAvatarSVG className='absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-content flex items-center justify-center shadow-md' />
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </article>

                    <input
                        type="text"
                        placeholder="Group name"
                        value={groupName}
                        onChange={(e) => {
                            let val = e.target.value;
                            setGroupName(val.charAt(0).toUpperCase() + val.slice(1))
                        }}
                        className="w-full text-center font-medium bg-transparent border-b-2 border-base-content/10 focus:border-primary outline-none py-2 placeholder:text-base-content/30 placeholder:font-normal transition-colors"
                    />

                    <div className="relative mt-6">
                        <label className="text-xs font-medium uppercase tracking-wide text-base-content/40">
                            Add Members
                        </label>

                        {selectedUsers.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2.5 mb-2.5 border">
                                {selectedUsers.map((user) => (
                                    <span
                                        key={user.id}
                                        className="inline-flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full bg-base-200 border border-base-content/5"
                                    >
                                        <Avatar username={user.username} size={20} />
                                        <span className="text-sm font-medium">{user.username}</span>
                                        <button                                           
                                            aria-label={`Remove ${user.username}`}
                                            onClick={() => removeUser(user.id)}
                                            className="w-4 h-4 rounded-full flex items-center justify-center text-base-content/40 hover:text-base-content hover:bg-base-content/10 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="relative mt-2">
                            <SearchIconSVG className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/30" />
                            <input
                                type="text"
                                placeholder="Search by username"
                                value={searchUsername}
                                onChange={(e) => {
                                    setSearchUsername(e.target.value)
                                    setIsDropdownOpen(true)
                                }}
                                onFocus={() => setIsDropdownOpen(true)}
                                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-base-200 border border-transparent focus:border-primary/40 focus:bg-base-100 outline-none text-sm transition-colors"
                            />
                        </div>

                        {isDropdownOpen && searchUsername && (
                            <ul className="absolute z-20 mt-1.5 w-full max-h-48 overflow-y-auto rounded-xl border border-base-content/10 bg-base-100 shadow-xl py-1.5">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <li key={user.id}>
                                            <button                                            
                                                onClick={() => addUser(user)}
                                                className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-base-200 transition-colors text-left"
                                            >
                                                <Avatar username={user.username} size={26} />
                                                <span className="text-sm font-medium">{user.username}</span>
                                            </button>
                                        </li>
                                    ))
                                ) : (
                                    <li className="px-3.5 py-2 text-sm text-base-content/40">No users found</li>
                                )}
                            </ul>
                        )}
                    </div>
                </section>

                <footer className="flex gap-2 px-7 py-5 border-t border-base-content/10 bg-base-200/40 rounded-b-3xl">
                    <button className="btn btn-ghost flex-1 rounded-xl" onClick={closeModal}>
                        Cancel
                    </button>
                    <button className='btn btn-success btn-outline'>Create</button>
                </footer>
            </main>

            <form method='dialog' className="modal-backdrop bg-black/40 backdrop-blur-sm">
                <button>close</button>
            </form>
        </dialog>
    </main>
    )
}

export default GroupChatPage;