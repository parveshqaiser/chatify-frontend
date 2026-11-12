import { CircleX, Crown, HomeIcon, MessageCirclePlus, UserRoundPen } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchIconSVG } from '../utils/svg-icons.jsx';
import { useDeleteGroupMutation, useFetchAllGroupDetailsQuery, useGetAllUsersQuery, useGetUserDetailsQuery } from '../redux/api.js';
import { LoadingMessage } from '../components/Spinner.jsx';
import CreateEditGroupModal from '../components/CreateEditGroupModal.jsx';
import DeleteGroupModal from '../components/DeleteGroupModal.jsx';
import toast from 'react-hot-toast';

const GroupAvatar = ({ group }) =>
    group.groupAvatar?.url ? (
        <div className="avatar shrink-0">
            <div className="w-12 sm:w-14 rounded-2xl">
                <img src={group?.groupAvatar?.url} alt={group?.groupName} />
            </div>
        </div>
    ) : (
        <div className="avatar avatar-placeholder shrink-0">
            <div className="bg-violet-300 text-neutral-content w-12 sm:w-14 rounded-2xl">
                <span className="text-lg sm:text-xl">
                    {group.groupName.charAt(0).toUpperCase()}
                </span>
            </div>
        </div>
    );

const MemberStack = ({ members }) => {
    const visible = members.slice(0, 4);
    const extra = members.length - visible.length;

    return (
        <div className="flex items-center gap-2 min-w-0">
            <div className="avatar-group -space-x-3 shrink-0">
                {visible.map((m) => (
                    <div key={m._id} className="avatar" title={m?.userId?.name}>
                        <div className="w-10 sm:w-10 rounded-2xl">
                            <img src={m?.userId?.avatar?.url} alt={m?.userId?.name} />
                        </div>
                    </div>
                ))}
                {extra > 0 && (
                    <div className="avatar avatar-placeholder">
                        <div className="bg-neutral text-neutral-content w-7 sm:w-8">
                            <span className="text-[10px] sm:text-xs">+{extra}</span>
                        </div>
                    </div>
                )}
            </div>
            <span className="text-xs text-base-content/50 truncate">
                {members?.length} {members?.length === 1 ? 'member' : 'members'}
            </span>
        </div>
    );
};

const GroupPage = () => {
    const { data: { data: allUsers } = [], isLoading: isAllUsersLoading } = useGetAllUsersQuery();
    const { data: { data: currentUser } = {} } = useGetUserDetailsQuery();
    const { data: { data: groupDetails } = [], isLoading: isGroupLoading, refetch } = useFetchAllGroupDetailsQuery();

    const [deleteGroup] = useDeleteGroupMutation();

    const [searchGroupName, setSearchGroupName] = useState('');
    const [groupModal, setGroupModal] = useState({ isOpen: false, group: null });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, group: null });

    const filteredGroups = useMemo(() => {
        let q = searchGroupName.trim().toLowerCase();
        if (!q) return groupDetails;
        return groupDetails.filter((g) => g.groupName.toLowerCase().includes(q));
    }, [searchGroupName, groupDetails]);

    if (isAllUsersLoading || isGroupLoading) {
        return <LoadingMessage />;
    }

    const handleOpenCreate = () => {
        setGroupModal({ isOpen: true, group: null });
    };

    const handleOpenEdit = (group) => {
        setGroupModal({ isOpen: true, group : group });
    };

    // const handle =(action, value)=>{
    //     setGroupModal({ isOpen: true, group : action == "create" ? null : value});
    // }

    const handleOpenDelete = (group) => {
        setDeleteModal({ isOpen: true, group });
    };

    const handleConfirmDelete = async (group) => {
        try {
        
            let res = await deleteGroup(group?._id).unwrap();

            if(res?.success){
                toast.success(`Group "${group?.groupName}" deleted`);
                setDeleteModal({ isOpen: false, group: null });
                refetch();
            }          
        } catch (error) {
            console.error(error);
            toast.error(error?.data?.message || 'Failed to Delete Group');
        }
    };

    return (
    <main className="min-h-screen bg-base-200 p-2 md:p-6">
        <header className="flex flex-col gap-6 lg:flex-row lg:justify-between lg:items-center">
            <div>
                <h1 className="text-xl font-bold">Create Group Chat</h1>
                <button className="btn btn-success btn-sm mt-2" onClick={handleOpenCreate}>
                    <MessageCirclePlus size={16} /> New Group
                </button>
            </div>
            <div>
                <Link to="/home" className="btn btn-error btn-outline w-full lg:w-auto">
                    <HomeIcon size={16} />
                    Home
                </Link>
            </div>
        </header>

        {/* Group layout */}
        <section className="max-w-4xl mx-auto mt-10 px-4 sm:px-6">
            <header className="flex items-end justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold tracking-tight">Your groups</h2>
                    <p className="text-sm text-base-content/50 mt-0.5">
                        {groupDetails?.length} {groupDetails?.length === 1 ? 'group' : 'groups'}
                    </p>
                </div>
            </header>

            {/* Search groups */}
            <nav className="relative mb-5">
                <SearchIconSVG className="w-4.5 h-4.5 absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" />
                <input
                    type="text"
                    value={searchGroupName}
                    onChange={(e) => setSearchGroupName(e.target.value)}
                    placeholder="Search groups"
                    className="w-full pl-11 pr-10 py-3 rounded-2xl bg-base-100 border border-base-content/10 shadow-sm focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none text-sm transition"
                />
                {searchGroupName && (
                    <button                           
                        aria-label="Clear search"
                        onClick={() => setSearchGroupName('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-base-content/40 hover:bg-base-content/10 hover:text-base-content transition-colors cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </nav>

            {filteredGroups?.length > 0 ? (
                <ul className="space-y-3">
                    {filteredGroups.map((group) => {

                    let isAdmin = group.members?.some(
                        (member) =>
                            member.userId._id === currentUser?._id &&
                            member.role === "admin"
                    );                
                    return (
                    <li
                        key={group._id}
                        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-base-100 border border-base-content/5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200"
                    >
                        <GroupAvatar group={group} />

                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate flex items-center gap-1">
                                <span className="truncate">{group.groupName}</span>
                                {group.createdBy === currentUser?._id && (
                                    <Crown size={14} className="shrink-0 text-warning" />
                                )}
                            </h3>
                            <p className="text-sm text-base-content/50 truncate mb-1.5">
                                {group.description || 'No description'}
                            </p>
                            <MemberStack members={group?.members || []} />
                        </div>

                        <div className="flex items-center gap-1 w-full sm:w-auto">
                            <Link
                                to={`/group/${group._id}`}
                                className="flex-1 sm:flex-none text-center sm:text-left shrink-0 px-4 py-2 rounded-xl text-sm font-medium text-primary bg-primary/10 hover:bg-primary hover:text-primary-content transition-colors"
                            >
                                Start Chat
                            </Link>

                            {isAdmin && 
                                <button                                           
                                    onClick={() => handleOpenEdit(group)}
                                    className="rounded-xl p-2 cursor-pointer hover:bg-base-200 transition-colors"
                                    title="Edit"
                                >
                                    <UserRoundPen size={14} className="text-warning" />
                                </button>
                            }

                            {isAdmin && <button                                       
                                onClick={() => handleOpenDelete(group)}
                                className="rounded-xl p-2 cursor-pointer hover:bg-base-200 transition-colors"
                                title="Delete"
                            >
                                <CircleX size={14} className="text-red-600" />
                            </button>}
                        </div>
                    </li>
                    )                       
                })}
                </ul>
            ) : (
                <div className="flex flex-col items-center text-center py-8 rounded-2xl bg-base-100 border border-dashed border-base-content/15">
                    <div className="w-14 h-14 rounded-full bg-base-200 flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <circle cx="11" cy="11" r="7" />
                            <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
                        </svg>
                    </div>
                    <p className="font-medium">No groups found</p>
                    <p className="text-sm text-base-content/50 mt-0.5">
                        {searchGroupName ? (
                            <>Nothing matches &ldquo;<strong>{searchGroupName}</strong>&rdquo;. Try a different name.</>
                        ) : (
                            <>You don&apos;t have any groups yet. Click &ldquo;New Group&rdquo; to create one.</>
                        )}
                    </p>
                </div>
            )}
        </section>

        {/* Create / Edit Group Modal */}
        <CreateEditGroupModal
            isOpen={groupModal.isOpen}
            group={groupModal.group}
            onClose={() => setGroupModal({ isOpen: false, group: null })}
            allUsers={allUsers}
            currentUser={currentUser}
            onSuccess={refetch}
        />

        {/* Delete Group Modal */}
        <DeleteGroupModal
            isOpen={deleteModal.isOpen}
            group={deleteModal.group}
            onClose={() => setDeleteModal({ isOpen: false, group: null })}
            onConfirm={handleConfirmDelete}
        />
    </main>
    );
};

export default GroupPage;
