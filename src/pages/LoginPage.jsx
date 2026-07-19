

import { Eye, EyeOff, MessageCircleMore } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

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
                            type="email"
                            placeholder="Enter your email"
                            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm text-slate-300">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 pr-12 text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-500"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-cyan-400"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 cursor-pointer"
                    >
                        Login
                    </button>
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
