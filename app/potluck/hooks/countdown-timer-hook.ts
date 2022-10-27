import { useEffect, useState } from 'react';

const useCountdown = (targetDate: number) => {
  const countDownDate = new Date(targetDate * 1000).getTime(); // 

  const [countDown, setCountDown] = useState(
    countDownDate - new Date().getTime()
  );

  useEffect(() => {
    const interval = setInterval(() => {

      let ctd = countDownDate - new Date().getTime()
      if(ctd>0){

        setCountDown(ctd);
      }
      // console.log("ctd:",countDownDate - new Date().getTime(),'trg:',targetDate)
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  return getReturnValues(countDown);
};

const getReturnValues = (countDown: number) => {
  // calculate time left
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);


  const timerEnded = (days + hours + minutes + seconds ) <=0
  return [days, hours, minutes, seconds,timerEnded ? 1:0];
};

export { useCountdown };
