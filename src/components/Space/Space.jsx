import React from "react";

function Space({ attr }) {
  return (
    <div 
      style={{
        padding: !attr ? '8px' : attr,

      }}
    />
  )
}

export default Space;