import HighlightMessage from "./HighlightMessage";


const MessageContent = ({ message, findText }) => {
    switch (message.type) {
        case "text":
            return (
                <HighlightMessage
                    text={message.text || ""}
                    searchQuery={findText}
                />
            );

        case "media":
            if (message.file?.mimeType?.startsWith("image/")) {
                return (
                    <img
                        src={message.file.url}
                        alt={message.file.fileName || "Image"}
                        className="max-w-62.5 max-h-72 rounded-lg object-cover"
                        onClick={() => window.open(message.file.url, "_blank")}
                    />
                );
            }

            if (message.file?.mimeType?.startsWith("video/")) {
                return (
                    <video
                        src={message.file.url}
                        controls
                        className="max-w-75 max-h-72 rounded-lg"
                    />
                );
            }

            return null;

        case "document":
            return (
                <a
                    href={message.file?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 min-w-50"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/20">
                        📄
                    </div>

                    <div className="flex flex-col min-w-0">
                        <span className="truncate font-medium">
                            {message.file?.fileName || "Document"}
                        </span>

                        <span className="text-xs opacity-60">
                            {message.file?.mimeType}
                        </span>
                    </div>
                </a>
            );

        default:
            return null;
    }
};

export default MessageContent;

