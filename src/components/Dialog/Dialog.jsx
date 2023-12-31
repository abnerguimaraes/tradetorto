import React from 'react';
import classes from './dialog.module.css';
import Button from '../Button/Button';
import Space from '../Space/Space';

function Dialog({ title, message, ...props}) {
  return (
    <dialog className={classes.dialog} {...props}>
      <div className={classes.dialogContent}>
        <h2>{title}</h2>
        <h3>{message}</h3>
        <Space />
        <Button onClick={props.onClose} label='ok'/>
      </div>
    </dialog>
  )
}

export default Dialog;