# React + Vite

login page
signup page

home page
    sidebar
    chatwindow
profile page
add connection page


pending : 
    rtk interceptor, 
    get all online users,           done
    scrollview of chat smooths, 
    load 10 messages at once,
    chat bubble UI,                 done
    message seen or not,
    use of double tick ,
    logout modularity ,             done



for production, 

if(location.hostname == "localhost"){
    return io(BASE_URL)
}else{
    return io("/", {path: "/api/socket.io"})
}