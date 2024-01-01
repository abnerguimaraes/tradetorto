import React, { useState } from 'react';
import { NumberInput, Button } from 'carbon-components-react';

import classes from './addmodal.module.scss';
import ComponentWrapper from '../ComponentWrapper';

function AddModal({ onClose, onCancel }) {
  const [txtValue, setTxtValue] = useState(0);

  function handleSetValue(event) {
    setTxtValue(event.target.value);
  }

  function handleCloseWithValue() {
    if (txtValue) {
      onClose(txtValue);
    }
  }

  function handleCancel() {
    onCancel();
  }

  return (
    <section className={classes.container}>
      <div className={classes.modalArea}>
        <div className={classes.title}>Adicione o trade e resultado com sinal</div>
        <ComponentWrapper padding={'16px'}>
          <NumberInput
            id='txt-taxa'
            label='Variação em %'
            helperText='Informe a taxa'
            min={-100}
            max={100}
            type='text'
            disabled={false}
            value={txtValue}
            onChange={handleSetValue}
            onBlur={handleSetValue}
            invalidText='Taxa inválida'
          />
        </ComponentWrapper>
        <ComponentWrapper padding={'16px 16px 16px 112px'} width={'100%'}>
          <Button kind="tertiary" onClick={handleCancel}>Cancelar</Button>
          <div style={{padding: '0 8px'}}></div>
          <Button onClick={handleCloseWithValue}>Adicionar</Button>
        </ComponentWrapper>
      </div>
    </section>
  );
}

export default AddModal;