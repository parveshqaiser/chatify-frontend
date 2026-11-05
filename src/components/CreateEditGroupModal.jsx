import React, { useState, useEffect, useRef, useMemo } from 'react';
import toast from 'react-hot-toast';
import { CameraAvatarSVG, CloseIconSvg, PlusIconSVG, SearchIconSVG } from '../utils/svg-icons.jsx';
import { useCreateGroupMutation, useUpdateGroupMutation } from '../redux/api.js';

const CreateEditGroupModal = ({
    isOpen,
    onClose,
    group = null,
    allUsers = [],
    currentUser = {},
    onSuccess,
}) => {
    const isEdit = Boolean(group);

    const [createGroup] = useCreateGroupMutation();
    const [updateGroup] = useUpdateGroupMutation();

    const fileInputRef = useRef(null);

    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');
    const [groupImage, setGroupImage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const [searchUsername, setSearchUsername] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isBtnLoading, setIsBtnLoading] = useState(false);

    // Sync form state when modal opens or group changes
    useEffect(() => {
        if (!isOpen) return;

        if (group) {
            setGroupName(group.groupName || '');
            setDescription(group.description || '');
            setGroupImage(group.groupAvatar?.url || '');
            setSelectedUsers([]);
            setSelectedFile(null);
            setSearchUsername('');
            setIsDropdownOpen(false);
        } else {
            setGroupName('');
            setDescription('');
            setGroupImage('');
            setSelectedUsers([]);
            setSelectedFile(null);
            setSearchUsername('');
            setIsDropdownOpen(false);
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [isOpen, group]);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    const handleClose = () => {
       
        if (selectedFile && groupImage?.startsWith('blob:')) {
            URL.revokeObjectURL(groupImage);
        }
        onClose();
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (selectedFile && groupImage?.startsWith('blob:')) {
            URL.revokeObjectURL(groupImage);
        }

        setSelectedFile(file);
        setGroupImage(URL.createObjectURL(file));
    };

    const filteredUsers = useMemo(() => {
        if (!searchUsername.trim()) return [];
        const q = searchUsername.toLowerCase();
        return allUsers.filter(
            (u) =>
                u._id !== currentUser?._id &&
                u.username?.toLowerCase().includes(q) &&
                !selectedUsers.some((s) => s._id === u._id)
        );
    }, [searchUsername, allUsers, selectedUsers, currentUser]);

    const addUser = (user) => {
        setSelectedUsers((prev) => [...prev, user]);
        setSearchUsername('');
        setIsDropdownOpen(false);
    };

    const removeUser = (userId) => {
        setSelectedUsers((prev) => prev.filter((u) => u._id !== userId));
    };

    const handleCreateGroup = async () => {
        try {
            if (!groupName || groupName.trim() === '') {
                return toast.error('Group Name Required');
            }

            const { _id: userId, username } = currentUser || {};
            const selectedMembers = [
                { userId, username },
                ...selectedUsers.map(({ _id, username: uName }) => ({
                    userId: _id,
                    username: uName,
                })),
            ];

            if (selectedMembers.length <= 1) {
                return toast.error('Please Add Members');
            }

            const formData = new FormData();

            if (selectedFile) formData.append('image', selectedFile);
            formData.append('groupName', groupName.trim());
            formData.append('description', description.trim());
            formData.append('members', JSON.stringify(selectedMembers));

            setIsBtnLoading(true);
            const res = await createGroup(formData).unwrap();
            if (res.success) {
                toast.success(res.message);
                setIsBtnLoading(false);
                onSuccess?.();
                handleClose();
            }
        } catch (error) {
            console.error(error);
            setIsBtnLoading(false);
            toast.error(error?.data?.message || 'Failed to Create Group');
        }
    };

    const handleUpdateGroup = async () => {
        try {
            if (!groupName || groupName.trim() === '') {
                return toast.error('Group Name Required');
            }

            const updateFormData = new FormData();
            if (selectedFile) updateFormData.append('image', selectedFile);
            updateFormData.append('groupName', groupName.trim());
            updateFormData.append('description', description.trim());

            setIsBtnLoading(true);
            const res = await updateGroup({
                id: group._id,
                data: updateFormData,
            }).unwrap();

            if (res.success) {
                toast.success(res.message);
                setIsBtnLoading(false);
                onSuccess?.();
                handleClose();
            }
        } catch (error) {
            console.error(error);
            setIsBtnLoading(false);
            toast.error(error?.data?.message || 'Failed to Update Group');
        }
    };

    if (!isOpen) return null;

    return (
    <dialog className="modal modal-open">
        <main className="modal-box max-w-md p-0 overflow-visible rounded-3xl border border-base-content/10 bg-base-100 shadow-2xl">
            <header className="px-5 py-3 mb-2">
                <h3 className="text-xl font-semibold tracking-tight">
                    {isEdit ? 'Edit Group' : 'New group'}
                </h3>
                {!isEdit && (
                    <p className="text-sm text-base-content/50 mt-0.5">
                        Give it a name and add who you want to talk to.
                    </p>
                )}
            </header>

            <section className="px-7 pb-5">
                {/* Avatar selection */}
                <article className="flex justify-center my-2">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="group relative cursor-pointer"
                    >
                        <div
                            className="w-22 h-22 rounded-full flex items-center justify-center overflow-hidden transition-all duration-200 ring-2 ring-blue-600 hover:ring-purple-500"
                            style={
                                !groupImage
                                    ? {
                                            background:
                                                'linear-gradient(135deg, rgba(124,92,255,0.12), rgba(45,212,191,0.12))',
                                        }
                                    : undefined
                            }
                        >
                            {groupImage ? (
                                <img
                                    src={groupImage}
                                    alt="Group"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <PlusIconSVG className="w-7 h-7 text-base-content/30 group-hover:text-primary transition-colors" />
                            )}
                        </div>
                        <CameraAvatarSVG className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-content flex items-center justify-center shadow-md" />
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                </article>

                {/* Group Name */}
                <input
                    type="text"
                    placeholder="Group name"
                    value={groupName}
                    onChange={(e) => {
                        const val = e.target.value;
                        setGroupName(val ? val.charAt(0).toUpperCase() + val.slice(1) : '');
                    }}
                    className="w-full text-center font-medium bg-transparent border-b-2 border-base-content/10 focus:border-primary outline-none py-2 placeholder:text-base-content/30 placeholder:font-normal transition-colors"
                />

                {/* Group Description */}
                <input
                    type="text"
                    placeholder="Brief Description.."
                    value={description}
                    onChange={(e) => {
                        const val = e.target.value;
                        setDescription(val ? val.charAt(0).toUpperCase() + val.slice(1) : '');
                    }}
                    className="w-full text-sm mt-2 placeholder:font-light text-center transition-colors border-b-2 border-base-content/10 focus:border-warning outline-none py-2"
                />

                {/* Add members (only on creation) */}
                {!isEdit && (
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
                                        <img
                                            src={user?.avatar?.url}
                                            alt={user.username}
                                            className="w-6 h-6 rounded-full object-cover"
                                        />
                                        <span className="text-sm font-medium">{user.username}</span>
                                        <button                                               
                                            aria-label={`Remove ${user.username}`}
                                            onClick={() => removeUser(user?._id)}
                                            className="w-4 h-4 rounded-full flex items-center justify-center text-base-content/40 hover:text-base-content hover:bg-base-content/10 transition-colors"
                                        >
                                            <CloseIconSvg />
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
                                    setSearchUsername(e.target.value);
                                    setIsDropdownOpen(true);
                                }}
                                onFocus={() => setIsDropdownOpen(true)}
                                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-base-200 border border-transparent focus:border-primary/40 focus:bg-base-100 outline-none text-sm transition-colors"
                            />
                        </div>

                        {isDropdownOpen && searchUsername && (
                            <ul className="absolute z-20 mt-1.5 w-full max-h-48 overflow-y-auto rounded-xl border border-base-content/10 bg-base-100 shadow-xl py-1.5">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <li key={user._id}>
                                            <button                                                  
                                                onClick={() => addUser(user)}
                                                className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-base-200 transition-colors text-left cursor-pointer"
                                            >
                                                <img
                                                    src={user?.avatar?.url}
                                                    alt={user.username}
                                                    className="w-6 h-6 rounded-full object-cover"
                                                />
                                                <span className="text-sm font-medium">
                                                    {user.username}
                                                </span>
                                            </button>
                                        </li>
                                    ))
                                ) : (
                                    <li className="px-3.5 py-2 text-sm text-base-content/40">
                                        No users found
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>
                )}
            </section>

            <footer className="flex gap-2 px-3 py-3 border-t border-base-content/10 bg-base-200/40 rounded-b-3xl">
                <button
                    className="btn btn-ghost flex-1 rounded-xl"
                    onClick={handleClose}
                >
                    Cancel
                </button>
                {!isEdit ? (
                    <button
                        disabled={isBtnLoading}
                        onClick={handleCreateGroup}
                        className="btn btn-success btn-outline"
                    >
                        {isBtnLoading ? '⏳ Saving...' : 'Create'}
                    </button>
                ) : (
                    <button
                        disabled={isBtnLoading}
                        onClick={handleUpdateGroup}
                        className="btn btn-warning btn-outline"
                    >
                        {isBtnLoading ? '⏳ Saving...' : 'Update'}
                    </button>
                )}
            </footer>
        </main>

        <div
            className="modal-backdrop bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
        />
    </dialog>
    );
};

export default CreateEditGroupModal;

