import React from "react";
import classes from "./input.module.css";

function Input({width, height, ...props}) {
  return (
    <input
      className={classes.input}
      style={{
        backgroundColor: '#EEEEEE',
        color: '#262626',
        width: width ? width : '200px',
        height: height ? height : '40px',
      }}
      {...props}
    />
  );
}

export default Input