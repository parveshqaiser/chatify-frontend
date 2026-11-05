import React, { useEffect } from "react";

const DeleteGroupModal = ({ isOpen, group, onClose, onConfirm, isLoading = false }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <dialog className="modal modal-open">
            <main className="modal-box max-w-md">
                <header className="text-lg font-semibold mb-2">
                    Delete &ldquo;{group?.groupName || "this group"}&rdquo;?
                </header>
                <p className="text-sm text-base-content/70 mb-6">
                    Are you sure you want to delete this group? Deleting will clear all chats and remove all members. This action cannot be undone.
                </p>

                <footer className="flex justify-end gap-2">
                    <button                       
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-3 py-1.5 text-sm rounded border border-base-content/20 hover:bg-base-200 cursor-pointer transition-colors"
                    >
                        Cancel
                    </button>
                    <button                       
                        onClick={() => onConfirm(group)}
                        disabled={isLoading}
                        className="px-3 py-1.5 text-sm rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer transition-colors font-medium"
                    >
                        {isLoading ? "Deleting..." : "Delete"}
                    </button>
                </footer>
            </main>

            <div
                className="modal-backdrop bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />
        </dialog>
    );
};

export default DeleteGroupModal;

