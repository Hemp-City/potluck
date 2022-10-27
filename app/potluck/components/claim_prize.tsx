import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {potluckSDK} from './main_card';
function ClaimPrize() {
    const {publicKey}  = useWallet();
    const claim = async () =>{
        
        // console.log(potluckSDK)
        if(potluckSDK && publicKey){
            potluckSDK.getUserAccounts(
                publicKey
                );
        }
            
    }
    const checkIsWinner = async () =>{
        if(publicKey){

            await potluckSDK.checkIsWinner(publicKey)
        }
    } 
    return ( 
    <>
        <div className="flex flex-col my-8 p-4 gap-4 text-center items-center">

            {/* <div> */}
            <figure className='p-4 bg-blue-100 rounded-xl'>

                <img src="icons/prize.png" className='w-28 ' alt="" />
            </figure>
            {/* </div> */}
            {
                publicKey ?
                <div id='claim-area'>
                    <p>Find out if you won the Potluck by pressing the button below.</p>
                    <button className='btn btn-primary mt-8' onClick={checkIsWinner}>Am i the winner?</button>
                </div> :
                //  if wallet not connected, show connect
                 <div id='connect-wallet-cp'>
                    <p>Connect your wallet to check the winners.</p>
                    <WalletMultiButton  className="btn btn-primary mt-4 " children={"Connect Wallet"} />

                 </div>
            }
        </div>
        
        {/* <button className="btn" onClick={claim}>Claim</button> */}
    </> );
}

export default ClaimPrize;