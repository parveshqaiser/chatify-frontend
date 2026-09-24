# React + Vite

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

    check editing of text & deleting of image                   done
    check delete for all messages                               done
    check clear all                                             done
    on view, get all uploaded docs                              done
    modify user proile                                          done
    clear front end unnneccary code                             done
    perform code optimization techniques
    clear unused rtk query api's (creates confusion)            
    add social links profile like github, linkedin              done
    added profile picture uploader                              done
    view modal (all shared files)                               issue exist

    
    group msg

    create group page                                           going on
    chat group page     

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