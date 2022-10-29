import type { NextPage } from 'next'
import Head from 'next/head'
import {  useRef } from 'react'
import toast from 'react-hot-toast'
import AboutComponent from '../components/about_component'
import MainCard from '../components/main_card'
import Navbar from '../components/navbar'
// import {useSta} from 'react';
const Home: NextPage = () => {

  // const [drawerIsOpen,setDrawerIsOpen] = useState(false);
  // const toggleDrawer = () => setDrawerIsOpen(val=>!val);

  const drawerRef = useRef<HTMLInputElement>(null);
  const toggleDrawer = () => {
    if(drawerRef.current?.checked){
      drawerRef.current.checked=false
    }
  }
 console.count("refreshing parent page");
  return (
    <div className='flex flex-col overflow-x-clip1 1overflow-y-scroll'>
      <Head>
        <title>Potluck</title>
        <meta name="description" content="Potluck - $1 lottery game on Solana. Play and own pot tickets to win the jackpot." />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" ></link>
        <link href="https://fonts.googleapis.com/css2?family=Bungee&family=Bungee+Shade&family=Bungee+Spice&display=swap" rel="stylesheet"></link>
      </Head>

        {/* <Navbar></Navbar> */}
      {/* <main className="w-screen h-screen container flex flex-col items-center py-10 drawer"> */}
      <main className='drawer'>
        <input ref={drawerRef} id="my-drawer" type="checkbox" className="drawer-toggle" /> 

        <div className="drawer-content flex flex-col">
      
      
          <Navbar></Navbar>

          {/* <!-- Page content here --> */}
          {/* Content */}
          <div  className='flex flex-col items-center md:py-10 py-8 ' >
            <div className="flex justify-between  w-11/12 md:w-9/12 px-2 md:px-10 md:mb-10 mb-8">
                  <div className='flex flex-col gap-2 md:mt-10 basis-1/2'>
                      <span className='text-2xl md:text-5xl leading-normal font-bold text-slate-800 font-bungee-shade'>$1 Game!</span>
                      <p className='text-slate-800 text-xs md:text-lg font-bungee '>by 
                      <a className='font-semibold italic ml-2 underline underline-offset-4' href="https://playhemp.city" target="__blank">Hemp City</a></p>
                      
                  </div>
                  <div className='inline-flex h-16 md:h-40 basis-1/2 justify-end'>
                      <img src="./gift-box-yellow.png" alt="" />
                  </div>
              </div>
              <MainCard></MainCard>
              <AboutComponent/>
          </div>
        </div> 
        <div className="drawer-side">
          <label htmlFor="my-drawer" className="drawer-overlay"></label> 
          <ul className="menu p-4 overflow-y-auto w-80 bg-base-100">
            {/* <!-- Sidebar content here --> */}
            {/* <ul className="menu menu-horizontal"> */}
              <li className='border my-1 border-slate-200 '><a className="" onClick={()=>{

                  toast("Coming soon!",{icon:"🔥"})
                  toggleDrawer()
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                </svg>

                Leaderboard 
                  <span className="badge badge-xs badge-accent px-1 py-1 text-yellow-200" style={{fontSize:"10px"}}>Soon!</span> 
              </a></li>
              <li className='border my-1 border-slate-200' onClick={toggleDrawer}>
             

                <a href="#">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                    Claim Prize
                </a>
              </li>
              <li className='border my-1 border-slate-200'>
                <a href='https://playhemp.city/discord.go'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>

                  Get Updates on Discord
                </a>
              </li>
              <li className='border my-1 border-slate-200' onClick={toggleDrawer}>
                  <a href="#referral-modal" className="underline underline-offset-8 decoration-wavy text-slate-900 font-semibold decoration-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                    </svg>

                    Earn Free Tickets
                  </a>                          
              </li>
              
              <div className="mt-4 flex gap-2 flex-row mx-4">
                    <div className="btn btn-circle btn-sm bg-slate-100">
                        <img className="p-1 " alt="svgImg" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iOTYiIGhlaWdodD0iOTYiCnZpZXdCb3g9IjAgMCA0OCA0OCIKc3R5bGU9IiBmaWxsOiMwMDAwMDA7Ij48cGF0aCBmaWxsPSIjOGM5ZWZmIiBkPSJNNDAsMTJjMCwwLTQuNTg1LTMuNTg4LTEwLTRsLTAuNDg4LDAuOTc2QzM0LjQwOCwxMC4xNzQsMzYuNjU0LDExLjg5MSwzOSwxNGMtNC4wNDUtMi4wNjUtOC4wMzktNC0xNS00cy0xMC45NTUsMS45MzUtMTUsNGMyLjM0Ni0yLjEwOSw1LjAxOC00LjAxNSw5LjQ4OC01LjAyNEwxOCw4Yy01LjY4MSwwLjUzNy0xMCw0LTEwLDRzLTUuMTIxLDcuNDI1LTYsMjJjNS4xNjIsNS45NTMsMTMsNiwxMyw2bDEuNjM5LTIuMTg1QzEzLjg1NywzNi44NDgsMTAuNzE1LDM1LjEyMSw4LDMyYzMuMjM4LDIuNDUsOC4xMjUsNSwxNiw1czEyLjc2Mi0yLjU1LDE2LTVjLTIuNzE1LDMuMTIxLTUuODU3LDQuODQ4LTguNjM5LDUuODE1TDMzLDQwYzAsMCw3LjgzOC0wLjA0NywxMy02QzQ1LjEyMSwxOS40MjUsNDAsMTIsNDAsMTJ6IE0xNy41LDMwYy0xLjkzMywwLTMuNS0xLjc5MS0zLjUtNGMwLTIuMjA5LDEuNTY3LTQsMy41LTRzMy41LDEuNzkxLDMuNSw0QzIxLDI4LjIwOSwxOS40MzMsMzAsMTcuNSwzMHogTTMwLjUsMzBjLTEuOTMzLDAtMy41LTEuNzkxLTMuNS00YzAtMi4yMDksMS41NjctNCwzLjUtNHMzLjUsMS43OTEsMy41LDRDMzQsMjguMjA5LDMyLjQzMywzMCwzMC41LDMweiI+PC9wYXRoPjwvc3ZnPg=="/>
                    </div>
                    <div className="btn btn-circle btn-sm bg-slate-100">
                        <img className="p-1 " src="data:image/png;base64,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"></img>
                    </div>
              </div>
                    {/* </ul> */}
            
          </ul>
          
        </div>
      </main>
          {/* <ReferralComponent/> */}
    </div>
  )
}

export default Home
