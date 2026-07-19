import {MessageCircleMore } from "lucide-react";
import { Link } from "react-router-dom";


const RegistrationPage = () => {
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
                    <label className="mb-1 block text-sm text-slate-300">Username</label>
                    <input
                        type="text"
                        placeholder="Enter your username"
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm text-slate-300">Full Name</label>
                    <input
                        type="text"
                        placeholder="Enter your full name"
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-500"
                    />
                </div>

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
                    <input
                        type="password"
                        placeholder="Create a password"
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full cursor-pointer rounded-xl bg-cyan-500 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
                >
                    Create Account
                </button>
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

