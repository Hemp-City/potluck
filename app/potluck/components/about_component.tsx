import { useState } from "react";

function AboutComponent() {
    const [activeStep,setActiveStep] = useState(0);
    const steps = ["Connect Wallet","Select Chances","Tap Play Now & Approve","Invite Friends","Claim Prize"];
    const onClickStepItem = (index:number) =>{
        setActiveStep(index);
    }
    return ( 
        <div id="about" className="card w-11/12 md:w-9/12 shadow-xl bg-white my-4">
            <div className="card-body flex flex-col gap-4 items-center">
                <h1 className="font-bold text-2xl font-bungee-shade text-center  text-primary">How to participate?</h1>
        
                <div className="flex flex-wrap px-10 justify-center my-4">

                    <Card 
                        index={1} 
                        icon={"icons/wallet.png"} 
                        title={"Connect Wallet"} 
                        description={"Tap connect button and select your favourite wallet. "} 
                        iconBg={"bg-sky-200"} 
                        />
                    <Card 
                        index={2} 
                        icon={"icons/dice.png"} 
                        title={"Choose Chances"} 
                        description={"1 Play = 1 Ticket. More tickets you own higher chance to win."} 
                        iconBg={"bg-slate-200"} 
                        />

                    <Card 
                        index={3} 
                        icon={"icons/rocket.png"} 
                        title={"Play & Approve"} 
                        description={"Tap Play button and approve the transaction."} 
                        iconBg={"bg-pink-200"} 
                        />
                        <Card 
                        index={4} 
                        icon={"icons/prize.png"} 
                        title={"Claim & Invite"} 
                        description={"Invite your friends to earn a free ticket. Claim Prize when timer stops."} 
                        iconBg={"bg-blue-200"} 
                        />

                </div>
                

            </div>
        </div>
     );
}

interface CardProps{
    index:number,
    icon:string,
    title:string,
    description:string,
    iconBg:string,
}
function Card(props:CardProps){
    const classes = "p-4 rounded-xl self-center indicator ".concat(props.iconBg);
    return (
        <div className="card md:card-side gap-0 md:w-96 w-80 overflow-visible ">
            
                    <figure className={classes}>
                        <span className="indicator-item badge badge-primary ">{props.index}</span> 

                        <img className="w-16 " src={props.icon} alt="" />

                    </figure>
                    <img src="" alt="" />
                    <div className="card-body text-center md:text-justify">

                        <div className="card-title ">
                            {/* <button className="btn btn-circle btn-xs">1</button> */}

                            <p className="about-title font-bungee text-lg text-secondary">
                            
                                {props.title}
                            </p> 
                        </div>
                        <p>{props.description}</p>

                    </div>
                </div>
    );
}
export default AboutComponent;