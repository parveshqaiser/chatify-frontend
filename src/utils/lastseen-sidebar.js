
let lastSeenFormat = (lastLogin)=>{

    let now = new Date();
    let loginTime = new Date(lastLogin);

    let minutesDiff = now - loginTime;
    let hourDiff = Math.floor(minutesDiff / (1000 * 60 * 60));

    if (hourDiff < 1) {
        return "Just now";
    }

    if (hourDiff <= 12) {
        return `${hourDiff} hour${hourDiff > 1 ? "s" : ""} ago`;
    }

    if (hourDiff <= 24) {
        return "1 day ago";
    }

    if (hourDiff <= 48) {
        return "2 days ago";
    }

    if (hourDiff <= 72) {
        return "3 days ago";
    }

    if (hourDiff <= 168) {
        return "A week ago";
    }

    return "A long ago";
   }

export default lastSeenFormat;