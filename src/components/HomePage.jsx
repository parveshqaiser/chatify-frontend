import { useEffect, useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import ChatWindow from "./ChatWindow.jsx";
import Sidebar from "./Sidebar.jsx";
import bgImage from "../assets/chat-br.jpg";
import toast from "react-hot-toast";

import { useGetAllMessagesQuery, useGetAllUsersQuery, useGetUserDetailsQuery } from "../redux/api.js";
import { LoadingMessage } from "./Spinner.jsx";
import { socketConnection } from "../utils/socket-client.js";


function HomePage() {

    let {data : user , isLoading, isError,error} = useGetAllUsersQuery();  // all users
    let {data : currentUser} = useGetUserDetailsQuery(); // current user
  
    const [activeUser, setActiveUser] = useState(""); // selected user in left sidebar
    const [sidebarOpen, setSidebarOpen] = useState(false);

    let {data : msg,  isLoading : loadingMsg, error : msgError,refetch} = 
        useGetAllMessagesQuery(activeUser?._id, {skip : !activeUser}); // all messages

    const [allMessages, setAllMessages] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [onlineUserIds, setOnlineUserIds] = useState([]);

    useEffect(()=>{
        if(user?.data){
            setAllUsers(user?.data)
        }else {
            setAllUsers([])
        }
    },[user?.data]);

    useEffect(() => {
        if (!activeUser?._id) {
            return setAllMessages([]);
        }

        setAllMessages(msg?.data?.message || []);
    }, [activeUser?._id, msg]);

    useEffect(() => {
        let userId = currentUser?.data?._id;

        if (!userId) return;
        let socket = socketConnection();

        let handleOnlineUsers = (userIds) => {
            setOnlineUserIds(userIds);
        };

        socket.on("onlineUsers", handleOnlineUsers);

        socket.emit("register", userId);

        return () => {
            socket.off("onlineUsers", handleOnlineUsers);
            socket.disconnect();
        };
    }, [currentUser?.data?._id]);

    let usersWithStatus = useMemo(() => {
        const onlineSet = new Set(onlineUserIds);

        return allUsers.map((user) => ({
            ...user,
            status: onlineSet.has(user._id) ? "online" : "offline",
        }));
    }, [onlineUserIds, allUsers]);

    if(isLoading){
        return(
            <LoadingMessage />
        )
    }
    
    if(isError){
        return <div className="flex items-center justify-center min-h-screen">
            <h2 className='text-xl text-red-500'>Some Error Occured While Trying to Fetch Data.. Please Try again later</h2>
        </div>
    }

    const handleSelectUser = (person) => {
        setActiveUser(person);
        setSidebarOpen(false);
    };

   

    return (
    <main className="relative h-screen w-screen flex items-center justify-center overflow-hidden">
        <img
            src={bgImage}
            alt="background"
            className="absolute inset-0 w-full h-full object-cover -z-10"
        />
        <div className="relative z-10 flex w-[85vw] h-[85vh] rounded-xl overflow-hidden shadow-sm">
            
            {/* mobile menu button */}
            <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden absolute top-3 left-3 z-20 p-2 bg-white border border-slate-200 rounded-md"
            >
                <Menu className="w-5 h-5" />
            </button>
 
            {/* sidebar: 1/4 width on desktop, slide-over on mobile */}
            <div
                className={`fixed md:static inset-y-0 left-0 z-30 w-3/4 sm:w-1/2 md:w-1/4 transform transition-transform duration-200 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0`}
            >
                <div className="md:hidden flex justify-end p-2 bg-indigo-500">
                    <button onClick={() => setSidebarOpen(false)}>
                        <X className="w-5 h-5" />
                    </button>
                </div>
 
                <Sidebar
                    activeUser = {activeUser}
                    users={usersWithStatus}
                    onSelectUser={handleSelectUser}
                />
            </div>
 
            {/* backdrop on mobile when sidebar is open */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/30 z-20 md:hidden"
                />
            )}
 
            {/* chat: 3/4 width on desktop, full width on mobile */}
            <nav className="flex-1 md:w-3/4">
                <ChatWindow 
                    selectedUser={activeUser}  
                    allMessages={allMessages}
                    currentUser ={currentUser}
                    refetchAllMessages={refetch}
                />
            </nav>
        </div>
    </main>
    );
}

export default HomePage;