
import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { api, useLogoutMutation } from '../redux/api';
import toast from 'react-hot-toast';

const useLogout = () => {
  
    let navigate = useNavigate();
    let dispatch = useDispatch();
    let [logout] = useLogoutMutation();

    let logoutHandler = async()=>{
       try {
			let res = await logout().unwrap();

			if(res.success){
				toast.success(res.message);
				localStorage.removeItem("token");	
                navigate("/login")		
				setTimeout(()=>{
					dispatch(api.util.resetApiState());
				},1200)
               
			}
		} catch (error) {
			console.log(error);
			toast.error(error.data?.message || "Logout failed");
		}
    }
    return logoutHandler;
}

export default useLogout;
