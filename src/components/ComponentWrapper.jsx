import React from "react";

function ComponentWrapper({ width, height, padding, hide, margin, ...props }) {
  return (
    <div
      style={{
        display: hide ? 'none' : 'flex',
        height: height,
        margin: margin,
        padding: padding,
        width: width
      }}
    >
      { props.children }
    </div>
  )
}

export default ComponentWrapper;