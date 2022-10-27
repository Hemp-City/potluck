import { useEffect, useState } from "react";
import { useCountdown } from "../hooks/countdown-timer-hook";

interface CountdownProps{
    endInTimestamp:number,
    timerStarted?:Function,
    timeOver?:Function,
}

function CountdownTimer(props:CountdownProps) {

    let [days,hours,mins,secs,timerEnded] = useCountdown(props.endInTimestamp);
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
        
        <div className="flex items-center place-items-center gap-2">

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
        </div>
    
     );
}

export default CountdownTimer;