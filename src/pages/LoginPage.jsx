

import axios from "axios";
import { Eye, EyeOff, MessageCircleMore } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { allowedDomains } from "../utils/constants.js";
import Spinner from "../components/Spinner.jsx";

const LoginPage = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [loading, setLoading] = useState(false);

    let navigate = useNavigate();

    const handleSubmit = async()=>{

        if(!email.trim() || !pwd.trim()){
            return toast.error("Please fill in all required fields");            
        }

        if(!allowedDomains.some(domain => email.endsWith(domain)))
        {
            return toast.error("Please enter a valid Gmail, Hotmail, or Yahoo email address.");
        }
        
        let data = {
            email,
            password :pwd,
        };

        try {
            setLoading(true);
            let res = await axios.post(BASE_URL + "/auth/login",data);
            if(res.data.success){
                toast.success(res.data.message);
                localStorage.setItem("token", res.data.token)
                setLoading(false);
                setTimeout(()=>{
                    navigate("/home")
                },1500);
            }

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || error?.message, {duration:2000})
        }finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
            <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl backdrop-blur-md">
                <div className="mb-8 flex flex-col items-center">
                    <div className="mb-3 rounded-full bg-cyan-500/15 p-2">
                        <MessageCircleMore className="h-8 w-8 text-cyan-400" />
                    </div>

                    <h1 className="text-3xl font-bold text-white">Chatify</h1>

                    <p className="mt-2 text-sm text-slate-400">
                        Welcome back! Login to continue chatting.
                    </p>
                </div>

                <form className="space-y-4" onSubmit={(e)=> e.preventDefault()}>
                    <div>
                        <label className="mb-1 block text-sm text-slate-300">Email</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e)=> setEmail(e.target.value.trim())}
                            placeholder="Enter your email"
                            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-500"
                        />
                        {/* <span className="text-red-500 text-sm">some error</span> */}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm text-slate-300">Password</label>
                        <div className="relative">
                            <input
                                onChange={(e)=> setPwd(e.target.value)}
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 pr-12 text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-500"
                            />
                             {/* <span className="text-red-500 text-sm">some error</span> */}

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-cyan-400"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {loading ? 
                        <Spinner /> :
                        <button
                            onClick={handleSubmit}
                            className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 cursor-pointer"
                        >
                            Login
                        </button>
                    }
                </form>

                <p className="mt-6 text-center text-sm text-slate-400">
                    Don't have an account?
                    <span className="cursor-pointer font-medium text-cyan-400 hover:underline">
                        <Link to={"/signup"}> Sign Up </Link>
                    </span>
                </p>
            </section>
        </main>
    );
};

export default LoginPage;
