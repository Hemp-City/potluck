import { useWallet } from "@solana/wallet-adapter-react";
import { WalletConnectButton, WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useState,useEffect } from "react";
import toast from "react-hot-toast";

function Navbar() {
    const { connected } = useWallet()
    // const{x,y} = useWindowScroll();

    let classes = "navbar sticky top-0 z-50  w-full py-4 pr-3 md:pr-6"
    // classes = y>0?classes+"bg-white":classes;
    return (  
        <div className={classes}>
            <div className="navbar-start">
                <div className="flex-none lg:hidden">
                <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </label>
                </div>
                <a className="text-xl md:text-2xl drop-shadow-xl uppercase font-bungee-shade text-primary ">Potluck</a>
                
                <div className="flex-none hidden lg:block ml-4">
                    <ul className="menu menu-horizontal">
                        <li ><a className="" onClick={()=>{
                            toast("Coming soon!",{icon:"🔥"})
                        }}>Leaderboard 
                            <span className="badge badge-xs absolute badge-accent -top-1 right-0 px-1 py-1 text-yellow-200" style={{fontSize:"10px"}}>Soon!</span> 
                        </a></li>
                        <li><a>Claim Prize</a></li>
                        <li><a href="https://playhemp.city/discord.go">Get Updates</a></li>
                        <li className="rounded-box bg-none">
                            <a href="#referral-modal" className="underline underline-offset-8 decoration-wavy text-slate-900 font-semibold decoration-slate-600">
                                    Earn Free Tickets
                            </a>                          
                        </li>
                    </ul>
                </div>
            </div>
            <div className="navbar-end ">

                <div className="hidden lg:flex gap-2 flex-row mx-4">
                    <div className="btn btn-circle btn-sm btn-ghost">
                        <a href="http://discord.gg/weedheads" target="__blank">

                            <img className="p-1 grayscale hover:grayscale-0" alt="svgImg" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iOTYiIGhlaWdodD0iOTYiCnZpZXdCb3g9IjAgMCA0OCA0OCIKc3R5bGU9IiBmaWxsOiMwMDAwMDA7Ij48cGF0aCBmaWxsPSIjOGM5ZWZmIiBkPSJNNDAsMTJjMCwwLTQuNTg1LTMuNTg4LTEwLTRsLTAuNDg4LDAuOTc2QzM0LjQwOCwxMC4xNzQsMzYuNjU0LDExLjg5MSwzOSwxNGMtNC4wNDUtMi4wNjUtOC4wMzktNC0xNS00cy0xMC45NTUsMS45MzUtMTUsNGMyLjM0Ni0yLjEwOSw1LjAxOC00LjAxNSw5LjQ4OC01LjAyNEwxOCw4Yy01LjY4MSwwLjUzNy0xMCw0LTEwLDRzLTUuMTIxLDcuNDI1LTYsMjJjNS4xNjIsNS45NTMsMTMsNiwxMyw2bDEuNjM5LTIuMTg1QzEzLjg1NywzNi44NDgsMTAuNzE1LDM1LjEyMSw4LDMyYzMuMjM4LDIuNDUsOC4xMjUsNSwxNiw1czEyLjc2Mi0yLjU1LDE2LTVjLTIuNzE1LDMuMTIxLTUuODU3LDQuODQ4LTguNjM5LDUuODE1TDMzLDQwYzAsMCw3LjgzOC0wLjA0NywxMy02QzQ1LjEyMSwxOS40MjUsNDAsMTIsNDAsMTJ6IE0xNy41LDMwYy0xLjkzMywwLTMuNS0xLjc5MS0zLjUtNGMwLTIuMjA5LDEuNTY3LTQsMy41LTRzMy41LDEuNzkxLDMuNSw0QzIxLDI4LjIwOSwxOS40MzMsMzAsMTcuNSwzMHogTTMwLjUsMzBjLTEuOTMzLDAtMy41LTEuNzkxLTMuNS00YzAtMi4yMDksMS41NjctNCwzLjUtNHMzLjUsMS43OTEsMy41LDRDMzQsMjguMjA5LDMyLjQzMywzMCwzMC41LDMweiI+PC9wYXRoPjwvc3ZnPg=="/>
                        </a>
                    </div>
                    <div className="btn btn-circle btn-sm btn-ghost">
                        <a href="http://twitter.com/playhempcity" target="__blank">

                            <img className="p-1 grayscale hover:grayscale-0" src="data:image/png;base64,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"></img>
                        </a>
                    </div>
                </div>
                <div className="flex gap-2">

                    {/* <WalletConnectButton/> */}
                    <WalletMultiButton  className="btn btn-primary " children={
                        !connected &&
                        <div className="flex gap-2 items-center">

                            Connect
                      
                        </div>
                    } 
                        startIcon={
                            <img src="data:image/png;base64,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"></img>
                        }
                    />
                {/* <WalletDisconnectButton></WalletDisconnectButton> */}
                </div>
                {/* <a className="btn btn-primary btn-outline">
                    Connect Wallet
                </a> */}
            </div>
        </div>
    );
}

export default Navbar;


// npm install --save     @solana/wallet-adapter-base     @solana/wallet-adapter-react     @solana/wallet-adapter-react-ui     @solana/wallet-adapter-wallets  @solana/web3.js     @solana-mobile/wallet-adapter-mobile 