
import React from 'react'

const HighlightMessage = ({text, searchQuery}) => {

    if (!searchQuery?.trim()) {
        return <>{text}</>;
    }

    const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");

    const parts = text.split(new RegExp(`(${escapedQuery})`, "gi"));
    return (
    <>
    {parts.map((part, index) =>
        part.toLowerCase() === searchQuery.toLowerCase() ? (
        <span
            key={index}
                style={{
                backgroundColor: "yellow",
                color: "black",
            }}
        >
            {part}
        </span>
        ) : (part)
    )}
    </>
    );
}

export default HighlightMessage
