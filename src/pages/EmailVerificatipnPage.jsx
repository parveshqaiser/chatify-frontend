
import React, { useEffect } from "react";
import {Check, TriangleAlert, Sparkle, MessageCircleMore, InfoIcon } from "lucide-react";
import bgImage from "../assets/email-verify.png";
import file from "../assets/file.svg";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

function EmailVerificatipnPage() 
{

   let email = useSelector(store => store?.email?.email);
   console.log(email);

    useEffect(()=>{
        toast.custom((t) => (
        <main
            className={`${
            t.visible ? 'animate-custom-enter' : 'animate-custom-leave'
            } lg:max-w-3xl sm:max-w-md w-full bg-blue-500 shadow-lg rounded-lg pointer-events-auto flex ring-opacity-5`}
        >
           <aside className="flex-1 flex items-start gap-3 p-4">
                <InfoIcon className="mt-1 shrink-0" />

                <p className="text-white text-sm leading-6">
                    A message with a confirmation link has been sent to <strong>{email || "NA"}</strong>.
                    Please follow the link to activate your account.
                </p>
            </aside>
            <aside className="flex border-l border-gray-200">
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-black focus:outline-none"
                >
                    Close
                </button>
            </aside>
        </main>
        ))
    },[])

    //  <style>
    //     {`
    //         @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
    //         .font-display { font-family: 'Sora', sans-serif; }
    //         .font-mono-tight { font-family: 'JetBrains Mono', monospace; }
    //         @keyframes float-slow {
    //         0%, 100% { transform: translateY(0px) rotate(-3deg); }
    //         50% { transform: translateY(-10px) rotate(-1deg); }
    //         }
    //         @keyframes float-slower {
    //         0%, 100% { transform: translateY(0px) rotate(4deg); }
    //         50% { transform: translateY(-14px) rotate(6deg); }
    //         }
    //         @keyframes pulse-ring {
    //         0% { box-shadow: 0 0 0 0 rgba(108,92,231,0.35); }
    //         70% { box-shadow: 0 0 0 12px rgba(108,92,231,0); }
    //         100% { box-shadow: 0 0 0 0 rgba(108,92,231,0); }
    //         }
    //         @keyframes bounce-dot {
    //         0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
    //         40% { transform: translateY(-4px); opacity: 1; }
    //         }
    //         .bubble-a { animation: float-slow 5s ease-in-out infinite; }
    //         .bubble-b { animation: float-slower 6s ease-in-out infinite; }
    //         .pulse-ring { animation: pulse-ring 2.4s ease-out infinite; }
    //         .dot-1 { animation: bounce-dot 1.2s ease-in-out infinite; animation-delay: 0s; }
    //         .dot-2 { animation: bounce-dot 1.2s ease-in-out infinite; animation-delay: 0.15s; }
    //         .dot-3 { animation: bounce-dot 1.2s ease-in-out infinite; animation-delay: 0.3s; }
    //         @media (prefers-reduced-motion: reduce) {
    //         .bubble-a, .bubble-b, .pulse-ring, .dot-1, .dot-2, .dot-3 { animation: none !important; }
    //         }
    //     `}</style>


    return (
    <main className="min-h-screen w-full bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 font-[Inter]">

        <header className="flex items-center justify-between px-6 sm:px-10 lg:px-16 py-5 max-w-7xl mx-auto">

            <nav className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl">
                    <MessageCircleMore className="w-5 h-5 text-cyan-400" strokeWidth={2.25} />
                </div>
                <span className="text-xl  tracking-tight text-white">
                    Chatify
                </span>
            </nav>

            <nav className="flex items-center gap-3">
                <button className="hidden sm:inline-flex px-4 py-2  font-medium text-cyan-400 rounded-full border border-[#E1DDF7] hover:border-[#C9C2F5] transition-colors">
                    <Link to={"/login"}>Log in</Link>
                </button>
                <button className="px-4 py-2 font-medium text-cyan-400 rounded-full bg-[#1B1A2E] hover:bg-[#2A2847] transition-colors">
                   <Link to={"/signup"}>Sign Up</Link>
                </button>
            </nav>
        </header>


        <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-6 sm:py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"> 

            <aside className="max-w-md">
                <div className="inline-flex items-center gap-1.5 mb-5 px-3 py-1 rounded-full bg-[#EDEAFC] text-[#191260] text-xs font-medium">
                    <Sparkle className="w-3.5 h-3.5" strokeWidth={2} />
                    Almost there
                </div>

                <h1 className="font-display text-4xl sm:text-[2.75rem] leading-[1.08] text-white mb-5">
                    Thanks for joining
                    <br />
                    Chatify
                </h1>

                <p className="text-white text-base leading-relaxed mb-1.5">
                    We have sent a confirmation message to
                </p>
                <p className="font-mono-tight text-[#27219b] bg-white rounded-lg px-3 py-2 inline-block mb-8 break-all">
                    {email || "NA"}
                </p>

                <div className="border-t border-[#E6E3F8] pt-6">
                    <p className="font-medium mb-3">Don't see it yet?</p>
                    <ul className="space-y-2.5">
                        <li className="flex items-start gap-2.5 text-[#afacc2]">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-[#9A93D6] shrink-0" />
                            Check your spam or promotions folder
                        </li>
                        <li className="flex items-start gap-2.5 text-[#afacc2]">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-[#9A93D6] shrink-0" />
                            Make sure your email address was typed correctly
                        </li>
                        <li className="flex items-start gap-2.5 text-[#afacc2]">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-[#9A93D6] shrink-0" />
                            Still stuck? Reach out to 
                            <a
                                href="mailto:support@chatify.io"
                                className="text-[#5B4FD6] hover:underline font-medium"
                            >
                            support@chatify.io
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>

            <aside className="relative flex items-center justify-center h-85 sm:h-105">
                {/* <div className="absolute w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] rounded-full bg-[#DCD6FA]" /> */}
                <img
                    src={file}
                    alt="Illustration of envelopes, one confirmed with a check mark"
                    className="relative w-[85%] sm:w-[80%] max-w-105 h-auto object-cover"
                />
            </aside>

        </section>
    </main>
    );
}

export default EmailVerificatipnPage;