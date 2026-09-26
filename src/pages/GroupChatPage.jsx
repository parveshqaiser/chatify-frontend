import { HomeIcon, MessageCirclePlus } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CameraAvatarSVG, PlusIconSVG, SearchIconSVG } from '../utils/svg-icons.jsx'
import { useCreateGroupMutation, useGetAllUsersQuery, useGetUserDetailsQuery } from '../redux/api.js'
import toast from 'react-hot-toast'
import { LoadingMessage } from '../components/Spinner.jsx'

const GroupChatPage = () => {

    const dialogRef = useRef(null);
    const fileInputRef = useRef(null);

    let {data: { data: allUsers } = {}, isLoading: isAllUsersLoading, isError, error} = useGetAllUsersQuery();  // all users
    let {data : {data : currentUser} = {}, isLoading : currentUserLoading} = useGetUserDetailsQuery(); // current user
    const [createGroup] = useCreateGroupMutation();

    const [groupName, setGroupName] = useState('');  // grorp name
    const [groupImage, setGroupImage] = useState(''); // image of group
    const [searchUsername, setSearchUsername] = useState("");  // search people by usernme
    const [description,setDescription] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]); 
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const openModal = () => dialogRef.current?.showModal()
    const closeModal = () => {
        dialogRef.current?.close();
        setGroupName("");
        setGroupImage("");
        setDescription("");
        setSearchUsername("");
        setSelectedUsers([])
    }

    const handleImageChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setGroupImage(URL.createObjectURL(file))
    }

    const filteredUsers = useMemo(() => {
        if (!searchUsername.trim()) return []
        const q = searchUsername.toLowerCase();
        return allUsers.filter(
            (u) => u.username.toLowerCase().includes(q) && !selectedUsers.some((s) => s._id === u._id)
        )
    }, [searchUsername, selectedUsers]);

    if(isAllUsersLoading){
        return(
            <LoadingMessage />
        )
    }

    const addUser = (user) => {
        setSelectedUsers((prev) => [...prev, user]);
        // setSelectedUsers([...selectedUsers , user])
        setSearchUsername("");
        setIsDropdownOpen(false)
    }

    const removeUser = (userId) => {
        let del = selectedUsers.filter(user => user._id !== userId);
        setSelectedUsers(del);
    }

    let handleCreateGroup = async()=>{
        try {
            let {_id: userId, username} = currentUser;

            const selectedMembers = [{ userId, username },
                ...selectedUsers.map(({ _id, username }) => ({
                    userId: _id,
                    username,
                })),
            ];

            if(!groupName || groupName.trim()==""){
                return toast.error("Group Name Required")
            }

            if(selectedMembers.length <=1){
                return toast.error("Please Add Members");
            }

            let data = {
                groupName,
                description : description || "",
                members : selectedMembers
            };

            let res = await createGroup(data).unwrap();
            if(res.success){
                toast.success(res.message);
                closeModal();
            }
        } catch (error) {
            console.log(error);
			toast.error(error?.data?.message || "Failed to Create Group");
        }
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

                <section className="px-7 pb-5">
                    <article className="flex justify-center my-2">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="group relative"
                        >
                            <div
                                className="w-22 h-22  rounded-full flex items-center justify-center overflow-hidden transition-all duration-200 ring-2 ring-blue-600 hover:ring-purple-500"
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

                    <input
                        type="text"
                        placeholder="Brief Description.."
                        value={description}
                        onChange={(e) => {
                            let val = e.target.value;
                            setDescription(val.charAt(0).toUpperCase() + val.slice(1))
                        }}
                        className="w-full text-sm mt-2 placeholder:font-light text-center transition-colors border-b-2 border-base-content/10 focus:border-warning outline-none py-2"
                    />

                    <div className="relative mt-6">
                        <label className="text-xs font-medium uppercase tracking-wide text-base-content/40">
                            Add Members
                        </label>

                        {selectedUsers.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2.5 mb-2.5">
                                {selectedUsers.map((user) => (
                                    <span
                                        key={user?._id}
                                        className="inline-flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full bg-base-200 border border-base-content/5"
                                    >
                                        <img src={user?.avatar?.url} className="w-6 h-6 rounded-full"  />
                                        <span className="text-sm font-medium">{user.username}</span>
                                        <button                                           
                                            aria-label={`Remove ${user.username}`}
                                            onClick={() => removeUser(user?._id)}
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
                                        // const initials = user.name.slice(0, 2).toUpperCase();
                                        <li key={user._id}>
                                            <button                                            
                                                onClick={() => addUser(user)}
                                                className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-base-200 transition-colors text-left"
                                            >
                                                <img src={user?.avatar?.url} className="w-6 h-6 rounded-full"  />
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

                <footer className="flex gap-2 px-3 py-3 border-t border-base-content/10 bg-base-200/40 rounded-b-3xl">
                    <button className="btn btn-ghost flex-1 rounded-xl" onClick={closeModal}>
                        Cancel
                    </button>
                    <button onClick={handleCreateGroup} className='btn btn-success btn-outline'>Create</button>
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