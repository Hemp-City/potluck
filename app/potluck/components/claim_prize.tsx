import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { type } from 'os';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {potluckSDK} from './main_card';

let winningSessions:any = []
function ClaimPrize() {
    const {publicKey}  = useWallet();
    const [isLoading,setIsLoading] = useState(false);
    const [notAWinner,setNotAWinner] = useState(false);
    
    // const [winningSession,]
    // const [isAWinner,isAWinner] = useState(false);
    
    const claim = async (index:number) =>{
        
        // console.log(potluckSDK)
        if(potluckSDK && publicKey){
            setIsLoading(true);
            toast.loading("Processing...",{id:"loader"})
            try{

                let tx = await potluckSDK.claimPrize(winningSessions[index])
            }
            catch(e:any){
                toast.error(e?.message);
            }
            // reloading
            await checkIsWinner();
            // remove loader
            toast.remove("loader");
            // console.log(tx)
        }
            
    }
    const checkIsWinner = async () =>{
        if(!publicKey){return 0;}
        setIsLoading(true);
        winningSessions = await potluckSDK.checkIsWinner(publicKey);

        // latest entries on the top
        winningSessions.reverse();

        console.log(winningSessions)
        if(winningSessions?.length === 0){
            toast.error("No winning sessions found!")
            setNotAWinner(true);
        }
        // console.log("Loading")
        setIsLoading(false);
    } 
    const btnClass = ' btn btn-primary mt-8 ';
    return ( 

    <>
    {
        winningSessions.length<=0 &&
    
        <div className="flex flex-col my-8 p-4 gap-4 text-center items-center">

            {/* <div> */}
            <figure className='p-4 bg-blue-100 rounded-xl'>

                <img src="icons/prize.png" className='w-28 ' alt="" />
            </figure>
            {/* </div> */}
            {
                publicKey ?
                ( 
                    !notAWinner?
                    <div id='claim-area'>
                        <p>By pressing the button below, you can find out if you won the potluck.</p>
                        <button className={isLoading?btnClass+'loading':btnClass} onClick={checkIsWinner}>Am i the winner?</button>
                    </div> : <></>
                ) :
                //  if wallet not connected, show connect
                 <div id='connect-wallet-cp'>
                    <p>Connect your wallet to check the winners.</p>
                    <WalletMultiButton  className="btn btn-primary mt-4 " children={"Connect Wallet"} />

                 </div>
            }

            { notAWinner &&        
            <div className="alert alert- shadow-lg animate-fadeIn w-2/3">
                <div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>


                    <span>Not a winner yet. Better luck next time!</span>
                </div>
                <div className="flex-none">
                    <a className="btn btn-sm btn-primary" href="/">Play More</a>
                </div>
            </div>
            }

        </div>
    
    }

    {/* Section if the account is a winner */}

    {
        winningSessions.length>0&&

        <div className="flex flex-col text-center items-center  py-8">
            <img src="congrats.png" className='w-1/2 my-8 animate-shortBounce' alt="" />
            {/* <span className='font-bungee drop-shadow-lg text-3xl my-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>Congratulations!</span> */}
            <p className='mb-8'>Claim &amp; post on Twitter and Discord for the shout out and other prizes.</p>
            {
                winningSessions.map((session:any,index: number) => {
                    // console.log("Session:",session)
                    const id = session.account.sessionId;
                    const claimed = session.account.potClaimed;
                    // console.log("Sessions:",id)
                    return <ClaimPrizeItem isLoading={isLoading} index={index} key={id} claimed={claimed} sessionId={id} onClaim={claim}></ClaimPrizeItem>
                })
            }
        </div>
    }
        
        {/* <button className="btn" onClick={claim}>Claim</button> */}
    </> );
}

type ClaimItemProps = {
    index:number,
    claimed:boolean,
    sessionId:any,
    onClaim:Function,
    isLoading:boolean
}
function ClaimPrizeItem(props:ClaimItemProps) {
    
    return ( <>
        <div  className="alert shadow-lg animate-fadeIn md:w-2/3 w-full my-2">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                    <span>You've won the Pot with Session ID {props.sessionId} </span>
                </div>
                <div className="flex-none">
                    {
                        props.claimed?
                        <a className="btn btn-sm btn-primary btn-disabled" href="/">Claimed</a>:
                        <button className="btn btn-sm btn-primary" onClick={()=>props.onClaim(props.index)} disabled={props.isLoading} >Claim</button>
                    }
                </div>
            </div>
    </> );
}


export default ClaimPrize;