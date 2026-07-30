import {MessageCircleMore } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { allowedDomains, BASE_URL, initialFormData } from "../utils/constants.js";
import toast from "react-hot-toast";
import axios from "axios";
import Spinner from "../components/Spinner.jsx";
import { useDispatch } from "react-redux";
import { addTemporaryEmail } from "../redux/emailSlice.js";


const RegistrationPage = () => {

    const navigate = useNavigate();

    let dispatch = useDispatch();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        username : "",
        name : "",
        email : "",
        password : ""
    });

    function handleChange(e){
        let {name, value} = e.target;

        if (name == "name"){
            value = value.charAt(0).toUpperCase() + value.slice(1);
            setFormData({
                ...formData, [name] : value
            });
        }else {
            setFormData({
            ...formData, [name] : value
            });
        }       
    }

    const handleSubmit = async()=>{
        let {username, name,email, password} = formData;

        if(!username.trim() || !name.trim() || !email.trim() || !password.trim()){
            return toast.error("Please fill in all required fields");  
        }

        if(!allowedDomains.some(domain => email.endsWith(domain))){
            return toast.error("Please enter a valid Gmail, Hotmail, or Yahoo email address.");
        }

        setLoading(true);

        try {
            let res = await axios.post(BASE_URL + "/auth/register", formData);

             if(res.data.success){
                toast.success(res.data.message);
                dispatch(addTemporaryEmail(formData.email))
                setFormData(initialFormData);
                setLoading(false);
                setTimeout(()=>{
                    navigate("/register/success")
                },2000);
            }

        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error(error?.response?.data?.message || error?.message, {duration:2000})
        }finally {
            setLoading(false);
        }
    }


    return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8">
        <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl backdrop-blur-md">
            <div className="mb-8 flex flex-col items-center">
                <div className="mb-3 rounded-full bg-cyan-500/15 p-2">
                    <MessageCircleMore className="h-8 w-8 text-cyan-400" />
                </div>

                <h1 className="text-3xl font-bold text-white">Chatify</h1>

                <p className="mt-2 text-center text-sm text-slate-400">
                    Create your account and start chatting with friends.
                </p>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                    <label className="mb-1 inline-block text-sm text-slate-300">Username</label> <span className="text-red-500">*</span>
                    <input
                        type="text"
                        name="username"
                        onChange={handleChange}
                        placeholder="Enter your username"
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-500"
                    />
                </div>

                <div>
                    <label className="mb-1 inline-block text-sm text-slate-300">Full Name</label> <span className="text-red-500">*</span>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-500"
                    />
                </div>

                <div>
                   <label className="mb-1 inline-block text-sm text-slate-300">Email</label> <span className="text-red-500">*</span>
                    <input
                        type="text"
                        name="email"
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-500"
                    />
                </div>

                <div>
                    <label className="mb-1 inline-block text-sm text-slate-300">Password</label> <span className="text-red-500">*</span>
                    <input
                        type="password"
                        name="password"
                        onChange={handleChange}
                        placeholder="Create a password"
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-500"
                    />
                </div>

                {loading ? 
                    <Spinner /> : 
                    <button
                        onClick={handleSubmit}
                        className="w-full cursor-pointer rounded-xl bg-cyan-500 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
                    >
                        Create Account
                    </button>
                }
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?
            <span className="font-medium text-cyan-400 hover:underline">
                <Link to="/login"> Login </Link>
            </span>
            </p>
        </section>
    </main>
    );
};

export default RegistrationPage;

