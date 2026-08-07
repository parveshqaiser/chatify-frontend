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
    get all online users, 
    scrollview of chat smooths, 
    load 10 messages at once,
    chat bubble,
    message seen or not,
    use of double tick 



for production, 

if(location.hostname == "localhost"){
    return io(BASE_URL)
}else{
    return io("/", {path: "/api/socket.io"})
}

sidenavbar

    3 dots must have 
        1. add/create groups
        2. User profile
        3. settings
        4. 