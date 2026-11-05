
import React, { useRef } from 'react'

const ExitGroupModal = ({ isOpen, onClose, onConfirm }) => {
   
    return (
    <dialog
        open={isOpen}
        className="modal modal-bottom sm:modal-middle bg-black/60 backdrop-blur-xs transition-opacity duration-200"
        onClose={onClose}
    >
        <main className="modal-box max-w-md">
            <header className="text-lg font-semibold mb-2">
                Leave "Meme Factory" ?
            </header>

            <p className="text-sm text-white mb-6">
                Are you sure you want to leave the group? You will no longer receive messages from this chat.
            </p>

            <footer className="flex justify-end gap-2">
                <button
                    onClick={onClose}
                    className="px-3 py-1 text-sm rounded border border-gray-300 cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                >
                    Leave
                </button>
            </footer>
        </main>      
    </dialog>
    )
}

export default ExitGroupModal;