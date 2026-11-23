

import React from 'react'

const ClearUserChatModal = ({isOpen, onClose, onSuccess}) => {

    if (!isOpen) return null;

    return (
    <dialog open={isOpen} className="modal modal-open">
        <main className="modal-box max-w-md">
            <header className="text-lg font-semibold mb-2">
                Clear Your Messages ?
            </header>
            <p className="text-sm text-base-content/70 mb-6">
                Are you sure you want to clear all your messages in this group? 
            </p>

            <footer className="flex justify-end gap-2">
                <button                       
                    onClick={onClose}
                    // disabled={isLoading}
                    className="px-3 py-1.5 text-sm rounded border border-base-content/20 hover:bg-base-200 cursor-pointer transition-colors"
                >
                    Cancel
                </button>
                <button                       
                    onClick={onSuccess}
                    // disabled={isLoading}
                    className="px-3 py-1.5 text-sm rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer transition-colors font-medium"
                >
                    Clear
                </button>
            </footer>
        </main>

        <div
            className="modal-backdrop bg-black/40 backdrop-blur-sm"
            onClick={onClose}
        />
    </dialog>
    )
}

export default ClearUserChatModal;
