import React, { useEffect, useState } from "react";
import { useCountdown } from "../hooks/countdown-timer-hook";

interface CountdownProps{
    timestamp:number,
    timerStarted?:Function,
    timeOver?:Function,
}

function CountdownButton(props:CountdownProps) {

    console.log("timer button:",props.timestamp)
    let [days,hours,mins,secs,timerEnded] = useCountdown(props.timestamp);
    // const [timeEnded,setTimeEnded] = useState(false)
    // console.count("Timer")

    useEffect(() => {
        if(!timerEnded){
            if(props.timerStarted)
                props.timerStarted()
        }
        else{
            if(props.timeOver){
                props.timeOver()
            }
        }
    }, [timerEnded]);
    

    // if((days+hours+mins+secs) <= 0){

    //     setTimeEnded(true)
    // }
    return ( 

        <button className="btn btn-primary flex gap-2 normal-case mt-8">

            <p>
                Unlocking in
            </p>
            <div className="flex gap-1">
                <div>
                    <span className="countdown font-mono text-lg">
                        <span style={{"--value":days} as React.CSSProperties}></span>
                    </span>
                    d
                </div> 
                <div>
                    <span className="countdown font-mono text-lg">
                        <span style={{"--value":hours}as React.CSSProperties}></span>
                    </span>
                    h
                </div> 
                <div>
                    <span className="countdown font-mono text-lg">
                    <span style={{"--value":mins}as React.CSSProperties}></span>
                    </span>
                    m
                </div> 
                <div>
                    <span className="countdown font-mono text-lg">
                    <span style={{"--value":secs}as React.CSSProperties}></span>
                    </span>
                    s
                </div>
            </div>      
        </button>
    
     );
}

export default CountdownButton;

 {/* <div className="flex items-center place-items-center gap-2">

            {
                !!timerEnded?
                 <div className="text-lg text-green-500 font-bold">TODAY</div>
                :
             <div className="grid grid-flow-col gap-1 text-center auto-cols-max">
                    <div className="flex flex-col p-1 bg-slate-900 rounded text-white mr-1 self-center">
                        <span className="countdown font-mono text-xs">
                        <span style={{"--value":days} as React.CSSProperties}></span>
                        </span>
                        
                    </div> 
                    <div className="flex flex-col p-1 bg-slate-900 rounded text-white self-center">
                        <span className="countdown font-mono text-xs">
                        <span style={{"--value":hours} as React.CSSProperties}></span>
                        </span>
                    </div> :
                    <div className="flex flex-col p-1 bg-slate-900 rounded text-white self-center">
                        <span className="countdown font-mono text-xs">
                        <span style={{"--value":mins} as React.CSSProperties}></span>
                        </span>
                        
                    </div> :
                    <div className="flex flex-col p-1 bg-slate-900 rounded text-white self-center">
                        <span className="countdown font-mono text-xs">
                        <span style={{"--value":secs} as React.CSSProperties}></span>
                        </span>
                        
                    </div>
                </div>
            }
        </div> */}