'use client'

import React from "react";
import { motion } from "framer-motion";

// Word wrapper
type WrapperProps = {
  [x:string]: any;
}

const Wrapper = (props: WrapperProps) => {
  // We'll do this to prevent wrapping of words using CSS
  return <span className="word-wrapper">{props.children}</span>;
};

// Map API "type" vaules to JSX tag names
const tagMap = {
  paragraph: "p",
  heading1: "h1",
  heading2: "h2",
};


type AnimatedCharactersProps = {
  [x:string]: any
}
// AnimatedCharacters
// Handles the deconstruction of each word and character to setup for the
// individual character animations
const AnimatedCharacters = (props: AnimatedCharactersProps) => {
  // Framer Motion variant object, for controlling animation
  const item = {
    hidden: {
      y: "200%",
      transition: { ease: [0.455, 0.03, 0.515, 0.955], duration: 0.85 }
    },
    visible: {
      y: 0,
      // color: "#03CFCC",
      transition: { ease: [0.455, 0.03, 0.515, 0.955], duration: 1 }
    }
  };

  //  Split each word of props.text into an array
  const splitWords = props.text.split(" ");

  // Create storage array
  const words: string[][] = [];

  // Push each word into words array
  for (const [, item] of splitWords.entries()) {
    words.push(item.split(""));
  }

  // Add a space ("\u00A0") to the end of each word
  words.map((word) => {
    return word.push("\u00A0");
  });

  const container = {
    visible: {
      transition: {
        staggerChildren: 0.025
      }
    }
  };

  // Get the tag name from tagMap
  const Tag = tagMap[props.type];

  return (

    <motion.div
      className="App text-center"
      initial="hidden"
      // animate="visible"
      animate={"visible"}
      variants={container}
    >
    <Tag>
      {words.map((word, index) => {
        return (
          // Wrap each word in the Wrapper component
          <Wrapper key={index}>
            {words[index].flat().map((element, index) => {
              return (
                <span
                  style={{
                    overflow: "hidden",
                    display: "inline-block"
                  }}
                  key={index}
                >
                  <motion.span
                    style={{ display: "inline-block" }}
                    variants={item}
                    className={props.type == 'heading1' ? 'text-[#03CFCC]' : 'text-[#ff9972]'}
                  >
                    {element}
                  </motion.span>
                </span>
              );
            })}
          </Wrapper>
        );
      })}
      {/* {} */}
    </Tag>
    </motion.div>
  );
};

export default AnimatedCharacters;
