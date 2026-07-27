import { TriangleAlert } from "lucide-react";

const DeleteConversationModal = ({ deleteModal, setDeleteModal, onDelete }) => {
    return (
        <dialog
            className={`modal ${deleteModal ? "modal-open" : ""}`}
        >
            <main className="modal-box max-w-md">

                <div className="flex justify-center">
                    <div className="bg-red-300 text-red-600 rounded-full p-3">
                        <TriangleAlert size={40} />
                    </div>
                </div>

                <h3 className="mt-2 text-lg font-bold text-center">Delete Conversation?</h3>

                <p className="py-2 text-center text-gray-500">
                    This will permanently delete <strong>all messages</strong> between
                    you and this person.
                </p>

                <div className="alert alert-error mt-2">
                    <span>
                        This action is permanent and <strong>cannot be undone.</strong>
                    </span>
                </div>

                <div className="modal-action">
                    <button
                        onClick={() => setDeleteModal(false)}
                        className="btn btn-outline"
                    >
                        Cancel
                    </button>

                <button
                    onClick={onDelete}
                    className="btn btn-error"
                >
                    Confirm
                </button>
                </div>
            </main>

            <div
                className="modal-backdrop"
                onClick={() => setDeleteModal(false)}
            />
        </dialog>
    );
};

export default DeleteConversationModal;
