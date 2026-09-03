# React + Vite

login page
signup page

home page
    sidebar
    chatwindow
profile page
add connection page


pending : 
    rtk interceptor,                done (needs to see)
    get all online users,           done
    scrollview of chat smooths,     done
    load 20 messages at once,       issues exist
    chat bubble UI,                 done
    message seen or not,
    use of double tick ,
    logout modularity ,             done
    group by date,                  done
    try mongodb grouping            
    message typing                  done
    last seen in sidebar            done
    delete account

    v2

    check editing
    check delete for all messages
    check clear all 
    on view, get all uploaded docs
    modify user proile
    clear front end unnneccary code
    perform code optimization techniques
    clear unused rtk query api's (creates confusion)


check notes :
    online users,
    functon in child (backend)
    map DS 
    socket io


for production, 
if(location.hostname == "localhost"){
    return io(BASE_URL)
}else{
    return io("/", {path: "/api/socket.io"})
}