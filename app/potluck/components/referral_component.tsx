import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookMessengerIcon, FacebookMessengerShareButton, FacebookShareButton, RedditIcon, RedditShareButton, TelegramIcon, TelegramShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from "react-share";


interface Props{
    userAccount:any
}
function ReferralComponent(props:Props) {

    const {publicKey} = useWallet()
    const socialShareTitle="Hey, I'm inviting you to play the Potluck lotto. Use my invite link and get a chance to win the jackpot."
    const {visible,setVisible} = useWalletModal()

    const refLinkInput = useRef<HTMLInputElement>(null);
    // let userAccount=undefined;
    console.count("Rebuild referral comp..");
    const refLink = props.userAccount? 
        `${window.location.protocol}//${window.location.host}?invite_code=${props.userAccount.inviteCode}` :undefined;

    const copyLink = async () =>{
        refLinkInput.current?.select()
        navigator.clipboard.writeText(refLink!).then(()=>toast.success('Link Copied!'))
        
    }
    
    return ( 
            <div className="modal" id="referral-modal">
            <div className="modal-box relative md:w-2/6 md:max-w-5xl transition-opacity duration-75">
                <a href="#" className="btn btn-sm btn-circle absolute right-2 top-2">✕</a>
                <div className="flex flex-col gap-2 justify-center items-center py-4">
                    <img src="referral.png" alt="" className="w-1/3"/>
                    <p className="leading font-bold text-2xl ">Invite &amp; Win Free Tickets</p>
                    <p className="text-center px-4"> 
                    Invite your friends to play the game and get 1 Free ticket entry on each successful invite.
                    </p>

                    {
                        (publicKey && props.userAccount) ?
                        <>
                            <div className="flex flex-col gap-4 w-full md:px-4 my-2">
                                <p className="text-lg font-bold uppercase text-center">
                                    Referral Link
                                </p>
                                {/* <div className="flex bg-slate-200 md:h-12 py-2 rounded items-center px-4 shadow-sm gap-2 justify-between">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                            <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
                                            <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
                                        </svg>
                                        <p onClick={copyLink} className="text-slate-900 inline-block w-48 md:w-3/4 text-xs md:text-sm  font-semibold hover:underline overflow-hidden text-ellipsis cursor-pointer whitespace-nowrap">
                                            {refLink}
                                        </p>

                                        <button className="btn btn-xs md:btn-sm btn-primary justify-end" onClick={copyLink}>
                                            Copy
                                        </button>
                                        
                                </div> */}
                                <div className="input-group ">
                                    <span className="bg-primary text-white  hidden md:flex">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                            <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
                                            <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
                                        </svg>
                                    </span>
                                    <input ref={refLinkInput} type="text" className="input w-full input-bordered font-semibold " value={refLink}  readOnly/>
                                    <span className="btn btn-primary " onClick={copyLink}>Copy</span>
                                </div>

                                <div className="flex  md:mt-4 flex-wrap gap-2 items-center justify-center" >
                                    <TwitterShareButton url={refLink??window.location.href} title={socialShareTitle}>
                                        <TwitterIcon className="rounded-full w-8 md:w-12" round={true} ></TwitterIcon>
                                    </TwitterShareButton>
                                    <FacebookMessengerShareButton url={refLink??window.location.href} title={socialShareTitle} appId={""} >
                                        <FacebookMessengerIcon className="rounded-full w-8 md:w-12" round={true} ></FacebookMessengerIcon>
                                    </FacebookMessengerShareButton>
                                    <WhatsappShareButton  url={refLink??window.location.href} title={socialShareTitle}>
                                        <WhatsappIcon className="rounded-full w-8 md:w-12" round={true} ></WhatsappIcon>
                                    </WhatsappShareButton>
                                    <TelegramShareButton  url={refLink??window.location.href} title={socialShareTitle}>
                                        <TelegramIcon className="rounded-full w-8 md:w-12" round={true} ></TelegramIcon>
                                    </TelegramShareButton>
                                    <FacebookShareButton url={refLink??window.location.href} title={socialShareTitle} >
                                        <FacebookIcon className="rounded-full w-8 md:w-12" round={true} ></FacebookIcon>
                                    </FacebookShareButton>
                                    <RedditShareButton  url={refLink??window.location.href} title={socialShareTitle}>
                                        <RedditIcon className="rounded-full w-8 md:w-12" round={true} ></RedditIcon>
                                    </RedditShareButton>
                                    <EmailShareButton  url={refLink??window.location.href} title={socialShareTitle}>
                                        <EmailIcon className="rounded-full w-8 md:w-12" round={true} ></EmailIcon>
                                    </EmailShareButton>
                                    
                                </div>
                            </div>
                        </>
                        :
                        <>
                            <div className="alert alert-error shadow-lg mt-4">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <span className="text-justify">Referral link not activated!</span>
                                </div>
                            </div>

                            <a href="#" className="btn btn-primary btn-outline mt-4" onClick={()=>{ setVisible(true) }}>
                                Play &amp; Activate
                            </a>
                        </>
                    }

                </div>
                {/* <h3 className="text-lg font-bold">Congratulations random Internet user!</h3> */}
                {/* <p className="py-4">You've been selected for a chance to get one year of subscription to use Wikipedia for free!</p> */}
            </div>
            </div>
     );

}

export default ReferralComponent;