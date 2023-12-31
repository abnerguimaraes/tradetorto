import React from "react";
import classes from './button.mudule.css';

function Button({label, width, height, theme, ...props}) {

  return (
    <>
      <button
        { ...props }
        className={`button ${theme ? theme : 'primary'}`}
        style={{
          width: width ? width : '200px',
          height: height ? height : '48px',
        }}
      >
        {label}
      </button>
    </>
  );
}

export default Button;