import AnimatedButton from '@/components/AnimatedButton';
import AnimatedText from '@/components/AnimatedText';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react'
export default function Homepage() {

  // const [replay, setReplay] = useState(false);
  const placeholderText = [
    { type: "heading1", text: "TremorGuard" },
    {
      type: "heading2",
      text: "Protecting you from Parkinson's"
    }
  ];


  // const handleReplay = () => {
  //   setReplay(!replay);
  //   setTimeout(() => {
  //     setReplay(true);
  //   }, 600);
  // };

  return (
    <div>
      {/* <motion.h1 className='text-xl font-bold opacity-0 ' 
        animate={{
          opacity: '100%',
          y: -10,
        }}>
        TremorGuard
      </motion.h1> */}
      {/* <h1 className='text-6xl font-bold'>TremorGuard</h1> */}

      <div className="container">
        {placeholderText.map((item, index) => {
          return <AnimatedText {...item} key={index} replay={false} />;
        })}
      </div>
      
      {/* <Button>Start</Button> */}
      <AnimatedButton/>
      
    </div>
  )
}
