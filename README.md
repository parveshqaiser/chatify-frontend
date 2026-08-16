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
    scrollview of chat smooths,     done
    load 20 messages at once,
    chat bubble UI,                 done
    message seen or not,
    use of double tick ,
    logout modularity ,             done
    group by date,                  done (some bus is there)
    try mongodb grouping            



check notes :
    online users,
    functon in child (backend)
    map DS 


for production, 
if(location.hostname == "localhost"){
    return io(BASE_URL)
}else{
    return io("/", {path: "/api/socket.io"})
}