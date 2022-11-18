import React, { useState } from 'react'
import ReactConfetti from 'react-confetti'
import { useWindowSize } from 'react-use'
// import useWindowSize from 'react-use/lib/useWindowSize'

// import ReactConfetti from '../src/ReactConfetti'


type Props = {
    showerConfetti:boolean
}

function SizedConfetti(props:Props) {
    const { width, height } = useWindowSize()
    console.log("width:height:",width,height)
    const [partyMode,setPartyMode] = useState(props.showerConfetti);
    return (
      <ReactConfetti
        width={width}
        height={height}
        numberOfPieces={partyMode ? 500 : 0}
        recycle={false}
        onConfettiComplete={confetti => {
        //   confettiCompleteAction()
        //   setPartyMode(false);
        //   confetti?.reset()
            confetti?.reset()
        }}
      />
    )
  }
  
  SizedConfetti.defaultProps = {
    showerConfetti : false
  }
  export default SizedConfetti;


