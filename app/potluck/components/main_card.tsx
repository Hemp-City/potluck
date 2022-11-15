import {useEffect, useMemo, useRef, useState} from 'react';
import Image from 'next/image'
// import bannerImg from '../public/potluck-banner.png';
import bannerImg from '../public/poster.jpeg';

import { useCountdown } from '../hooks/countdown-timer-hook';
import CountdownTimer from './countdown_timer';
import { AnchorWallet, useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PotluckErrors, PotluckSDK } from '../utils/potluck-sdk';
import { AnchorError, ProgramError, Wallet } from '@project-serum/anchor';
import toast, { Toaster } from 'react-hot-toast';
import SimpleLoader from './simple_loader';
import nacl from 'tweetnacl';
import ReferralComponent from './referral_component';
import { useSearchParam, } from 'react-use';
import ClaimPrize from './claim_prize';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ReactConfetti from 'react-confetti';
import SizedConfetti from './sized_confetti';
import CountdownButton from './countdown_button';

const MySweetAlert = withReactContent(Swal);
// injectStyle()
export const potluckSDK = new PotluckSDK(parseInt(process.env.NEXT_PUBLIC_SESSION_ID!));
const enum Tabs  {
    Live,
    ClaimPrize,
    Leaderboard,
    Mysubscription
}

const enum FetchState{
    Idle,
    Pending
}
const SESSION_LOADER_TAG = "session_loader";
// const endTimestamp = new Date("30 Oct 2022 00:00:00").getTime()/1000
let sessionStaticInfo = {
    price:1,
    estimated_prize:'-',
    end_timestamp: new Date("10 Oct 1997 00:00:00").getTime()/1000,
    start_timestamp: new Date("16 November 2022 22:43:00 ").getTime()/1000,
    plays_left:0,
    max_paid_tickets:1,
    max_free_tickets:0,
}

const toggleSessionLoader = () =>{
    toast.remove(SESSION_LOADER_TAG);
    toast.success("Session updated!");
}

function MainCard() {
    // const pot = new PotluckSDK(1);
    const wallet = useAnchorWallet()
    const {connected,publicKey,signMessage} = useWallet()
    const inviteCode = useSearchParam('invite_code');
    const [tab,setTab] = useState(Tabs.Live);
    const [sessionInfoFetched,setSessionInfoFetched] = useState<any>(null);
    const [ticketsLeft,setticketsLeft] = useState(0)
    const [isBuying,setIsBuying] = useState(false)
    const [lockSession,setLockSession] = useState(false)
    const [sessionStarted, setSessionStarted] = useState(false);
    
    const [ticketsOwned,setTicketsOwned] = useState(0);
    
    const quantityRef = useRef<HTMLSelectElement>(null);

    // const [fetchState,setFetchState] = useState(FetchState.Idle);

    const fetchStateMemo = useMemo(()=>{
        return { state:FetchState.Idle};
    },[    ]);

    const toggleFetchState = () =>{
        fetchStateMemo.state = fetchStateMemo.state == FetchState.Idle ? FetchState.Pending : FetchState.Idle;
    }
    // const [endTimestamp,setEndTimestamp] = useState()
    console.count("refresh component main")
    // console.log("program id x:",process.env.NEXT_PUBLIC_PROGRAM_ID);
    // const [endsInDate,setEndsInDate] = useState(new Date()) // day, hours, min, secs
    // console.table([endsInTime])

    
   useEffect(() => {

        console.log("UseEffect called");

        
        // TODO: Add free tickets count to total owned and total available
        // console.log("invite code:")
        const initSession = async ()=>{
                console.log("Fetching session!")

                // putting useraccoutn to window for global access in other component
                toggleFetchState();
                await potluckSDK.initSession(connected);
                
                // (window as any).userAccount = potluckSDK.userAccount;
                //
                 
                // toast.success("Session updated!",{id:SESSION_LOADER_TAG});
                toggleSessionLoader();
                
                // setSessionInfoFetched(true);
                sessionStaticInfo.price = potluckSDK.getPricePerTicket()
                sessionStaticInfo.estimated_prize = '$'+potluckSDK.getEstimatedPrize()
                sessionStaticInfo.max_paid_tickets = potluckSDK.sessionInfo.account.maxPaidTicketsPerEntrant;
                sessionStaticInfo.max_free_tickets = potluckSDK.sessionInfo.account.maxFreeTicketsPerEntrant;
                if(connected && potluckSDK.userAccount){

                    console.log("changing plays!")
                    
                    setTicketsOwned(
                        potluckSDK.userAccount.totalPaidTickets + potluckSDK.userAccount.totalFreeTickets
                    )

                    // sessionStaticInfo.plays_left = potluckSDK.userAccount.totalPaidTickets;
                }
                // potluckSDK.userAccoun
                sessionStaticInfo.end_timestamp = potluckSDK.sessionInfo.account.endTimestamp.toNumber();
                sessionStaticInfo.start_timestamp = potluckSDK.sessionInfo.account.startTimestamp.toNumber();
                if ( new Date(sessionStaticInfo.start_timestamp*1000) < new Date()){
                    setSessionStarted(true);
                }

                setticketsLeft(potluckSDK.entrantsData.max - potluckSDK.entrantsData.total);

                // 
                // setFetchState(FetchState.Idle);
                toggleFetchState()
        };
        // console.log("fetch state:",fetchStateMemo)
        if(isBuying == false && fetchStateMemo.state == FetchState.Idle) // only after processing
            initSession();
     
    }, [isBuying,wallet]); 

    useEffect(()=>{
        console.log("Wallet changed!")
        if(connected){

            potluckSDK.setWallet(wallet as AnchorWallet);
            
        }
    },[wallet]) 

    const buyTicket = async ()=>{


        console.log("Buyticket Quantity:",quantityRef.current?.value);
        // console.log(potluckSDK.sessionInfo)

        let loader = toast.loading("Processing...")
        setIsBuying(true)
        
        try{
            // calling the SDK
            await potluckSDK.buyTicket(parseInt(quantityRef.current?.value!),inviteCode || undefined);
            showFirstBuyToast()
        }
        catch(err:any){
            // Error().
            let errMessage = err.message;
            if(err instanceof AnchorError || err instanceof ProgramError){
                
                const parsedErr = AnchorError.parse(err.logs!)?.error;
                if(parsedErr?.errorCode.code == "PaidTicketLimitReached"){
                    errMessage = "You can't buy more tickets. Limit reached!"
                    setLockSession(true)
                }
                else{
                    errMessage = parsedErr?.errorMessage;
                }
            }
            console.log(err)
            toast.error(errMessage)
            if(errMessage == PotluckErrors.USDCAccountNotFound || errMessage == PotluckErrors.InsufficientBalance){
                // console.log("Fire alert!");
                let alert = MySweetAlert.fire(
                    {
                        title:"Insufficient USDC balance",
                        text:"To play, add USDC in your wallet. You can also swap SOL to USDC from the wallet itself.",
                        icon:"info",
                        confirmButtonText:"Alright!",
                        confirmButtonColor:"maroon",
                        iconColor:"maroon"
                    } 
                )
            }
            // "Insufficient USDC Balance",
            // "To play, add USDC to your wallet. You can also swap SOL to USDC from the wallet itself. ",
            // 'info'
        }
        finally{
            toast.dismiss(loader)
            setIsBuying(false)
        }
    }
    const sessionTimeOver = () => {
        setLockSession(true)
    }

    const signLoginMessage = async () =>{

        // let data = potluckSDK.

        // return

        const msg = ""
        const encodedMsg = new TextEncoder().encode(msg)
        let tx = await signMessage!(encodedMsg);
        let dtx = Buffer.from(tx).toString('base64')
        console.log(dtx)

        const signatureUint8 = new Uint8Array(atob(dtx).split('').map(c => c.charCodeAt(0)))
        const messageUint8 = new TextEncoder().encode("Hello there!")
        const pubKeyUint8 = publicKey!.toBytes() // base58.decode(publicKeyAsString)
        const result = nacl.sign.detached.verify(messageUint8, signatureUint8, pubKeyUint8) // true or false

        console.log(result)

    }
    // ShowFirstBuyToast()
    // console.count("MainCard")
    return ( 
        
        <div className="card bg-base-100 shadow-xl w-11/12 md:w-9/12  h-max flex flex-col p-2  ">
            <div><Toaster position='bottom-center'/></div>

            {/* TABS */}
            <div className='flex flex-col items-center '>

                <div className="tabs">
                    <a className={`tab !border-primary ${tab==Tabs.Live?"tab-bordered tab-active":""}`}
                        onClick={()=>{setTab(Tabs.Live)}}
                        >
                        Live
                    </a> 
                    <a className={`tab !border-primary ${tab==Tabs.ClaimPrize?"tab-bordered tab-active":""}`}
                        onClick={()=>{setTab(Tabs.ClaimPrize)}}
                        >
                        Claim Prize
                    </a> 
                    {/* <a className={`tab !border-primary ${tab==Tabs.Mysubscription?"tab-bordered tab-active":""}`} 
                        onClick={()=>setTab(Tabs.Mysubscription)}
                        >
                        My Subscription
                    </a>  */}
                </div>

                {/* Banner */}

            </div>
            {/* <Image src={bannerImg} className="rounded-md" layout='fixed' width="" height="400" /> */}

        {
            tab == Tabs.Live &&
        
            <div className="flex flex-col md:flex-row p-8">
                <img onClick={showFirstBuyToast} src={bannerImg.src} alt="Banner image" className="w-full md:w-2/5 md:mr-8 rounded-lg  md:basis-1/2 self-start"/>

               
                <div className="flex flex-col md:basis-2/3 md:px-8 md:py-4 mt-2 md:mt-0 md:border md:rounded-lg ">

                    <div className='flex justify-between my-4 '>
                        <h3 className='font-semibold  font-bungee text-primary'>Play &amp; Win The Pot</h3>
                        
                        <a className='text-xs text-primary flex items-center' href='#about'>Details
                        
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-primary text-xs">
                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                            </svg>
                        </a>

                    </div>
                    <div className='flex justify-between items-center text-center mb-2'>
                        <div className="inline-flex gap-2 items-center">

                            <p className='text-sm'>Price Now</p>
                            <div className="tooltip" data-tip="Payment accepted in USDC tokens">
                                <img className='w-4 ' src="./usdc-coin-icon.png"  />
                            </div>
                        </div>
                        <div className="flex items-center place-items-center gap-2">
                            <h3 className='text-2xl font-semibold font-bungee'>
                                {`$${sessionStaticInfo.price}`}
                            </h3>
                            <p className='text-slate-400 text-lg line-through font-light'>$500</p>
                        </div>
                    </div>
                    <div className='flex justify-between items-center text-center mb-2'>
                        <p className='text-sm'>Max Prize</p>
                        <div className="flex items-center place-items-center gap-2">
                            <p className='font-semibold text-lg font-bungee'>
                                {sessionStaticInfo.estimated_prize}
                            </p>
                        </div>
                    </div>
                    <div className='flex justify-between items-center text-center mb-2 '>
                        <p className='text-sm'>Winner Announcement</p>
                        <CountdownTimer 
                            endInTimestamp={sessionStaticInfo.end_timestamp} 
                            timerStarted={()=>{setLockSession(false)}}
                            timeOver={sessionTimeOver}
                            />
                    </div>

                    <div className="flex flex-col ">

                    {
                        connected && potluckSDK.userAccount &&

                        <div className='flex justify-between items-center text-center mb-2'>
                           <p className="text-sm">Tickets Owned</p>
                            <div className="flex items-center place-items-center gap-2">
                                
                                <p>{`${ticketsOwned}/${sessionStaticInfo.max_paid_tickets + sessionStaticInfo.max_free_tickets}`}</p>
                            </div>
                        </div>
                    }


                    <div className='flex justify-between items-center text-center mb-2'>
                        <p className='text-sm'>Tickets Left</p>
                        <div className="flex items-center place-items-center gap-2">
                            <p className=''>{`${ticketsLeft}/${potluckSDK.entrantsData?potluckSDK.entrantsData.max : 'N'}`}
                            </p>

                        </div>
                    </div>

                    
                    {
                        sessionStarted && 
                        <>

                        <div className='flex justify-between items-center text-center mb-2'>
                            <p className='text-sm'>Chances</p>
                            <div className="flex items-center place-items-center gap-2">
                                <select id="quantity-select" ref={quantityRef} className="select select-primary w-full max-w-xs" >
                                    {
                                        [...new Array((sessionStaticInfo.max_paid_tickets-ticketsOwned) || 1)].map((x,i)=>{

                                            return <option value={i+1} key={i+1}>{i+1}</option>
                                        })
                                    }
                                
                                </select>

                            </div>
                        </div>    
                        <progress className="progress progress-primary  mb-2 mt-4" 
                            value={ticketsLeft} 
                            max={potluckSDK.entrantsData? potluckSDK.entrantsData.max : 1} />

                        </>
                    }
                    {/* {
                        sessionInfoFetched &&
                    <p>Token: {potluckSDK.sessionInfo.startTimestamp}</p>
                    } */}
                </div>


                {
                    !sessionStarted?

                    <CountdownButton timestamp={sessionStaticInfo.start_timestamp} timeOver={()=>setSessionStarted(true)}></CountdownButton> 

                    :(
                        connected ? 
                            <button onClick={()=>{buyTicket()}} className="btn btn-block mt-4 btn-primary text-white " 
                                disabled={isBuying || lockSession || ticketsOwned == sessionStaticInfo.max_paid_tickets}>
                                Play Now
                            </button> 
                            :
                        <WalletMultiButton  className="btn btn-primary mt-4 " children={"Play Now"} />
                    )
                }

                {
                    wallet && ticketsOwned > 0 &&
                    <>
                        <a href='#referral-modal' className='btn btn-secondary btn-outline md:mt-4 mt-2'>Invite Friends</a>
                        <p className='text-center mt-2 md:text-sm font-thin text-xs'>Get 1 free ticket on each play using your invite link.</p>
                    </>    
                }

               


                {/* <button className='mt-4 btn' onClick={signLoginMessage}>Sign</button> */}
                    {/* {
                        inviteCode&&
                    <p>{inviteCode}</p>
                    } */}
                </div>
   
            </div> 
            
            }

            { tab == Tabs.ClaimPrize &&
            
                <ClaimPrize></ClaimPrize>
            }

          <ReferralComponent userAccount={potluckSDK.userAccount}/>
        </div>
     );

}

let showFirstBuyToast = ( function (){
    // memoized the function so the only works for once
    let hasTriggered = false;
    return ()=>{
        if (hasTriggered) return;
        
        hasTriggered = true;
        toast.remove("firstBuyToast")
        toast.custom((t) => (
            <div
            className={`${
                t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-green-100  shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
            <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                <div className="flex-shrink-0 pt-1">
                    <img
                    className="w-14"
                    src="icons/prize.png"
                    alt=""
                    />
                </div>
                <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-primary font-bungee">
                    Wohoo! Good play! 
                    </p>
                    <p className="mt-1 text-sm text-slate-800">
                    The winner announcement is made after the countdown timer stops. Play more to win.
                    </p>
                </div>
                </div>
            </div>
            <div className="flex border-l border-gray-200">
                <button
                onClick={() => toast.remove(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                Close
                </button>
            </div>
            </div>
        ),{
            id:"firstBuyToast",
            position:"bottom-center",
            duration:1/0
        })
    }
})();
export default MainCard;
