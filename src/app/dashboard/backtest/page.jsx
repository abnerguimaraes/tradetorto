'use client'

import classes from './backtest.module.css';
import { CredentialsContext } from '../../../store/Credentials';
import DropDown from '../../../components/DropDown/DropDown';
import tickers from '../../../helpers/tickers';

import { useContext, useEffect, useState } from 'react';
import { ref, onValue, update } from "firebase/database";

function  Backtest() {
  const { database } = useContext(CredentialsContext);
  const [action, setAction] = useState('compra')
  const [historicData, setHistoricData] = useState({});

  let hoje = new Date();

  for (let datas in historicData) {
    console.log(historicData[datas]);
  }

  function handleSelect(opt) {
    console.log(opt);
  }

  return (
    <section className={classes.container}>
      <div className={classes.title}> Ativo / Operação </div>
      <div className={classes.stockActionContainer}>
        <DropDown options={tickers} onSelect={handleSelect} />
        <div className={classes.actionContainer}>
          <button 
            className={`${classes.actionButton} ${action == 'compra' ? classes.actionCompra : classes.actionCompraDeact}`}
            onClick={() => {setAction('compra')}}
          >
            compra
          </button>
          <button
            className={`${classes.actionButton} ${action == 'venda' ? classes.actionVenda : classes.actionVendaDeact}`}
            onClick={() => {setAction('venda')}}
          >
            venda
          </button>
        </div>
      </div>
      <hr className={classes.separator}/>
      <div className={classes.title}> Estratégia </div>
      <div className={classes.stratContainer}>
        <div className={classes.operacaoContainer}>
          <div className={`${classes.operacaoTitle} ${action == 'compra' ? classes.titleCompra : classes.titleVenda}`}> entrada </div>
          <div className={classes.operacaoBody}>
            <label className={classes.optLabel}> Inicia </label>
            <select className={classes.optSelect}>
              <option value='1'>% do Fechamento dia Anterior</option>
              <option value='2'>% do Abertura dia Anterior</option>
              <option value='3'>% Abertuda dia Atual</option>
              <option value='4'>Abertura do Dia</option>
              <option value='5'>Fechamento Dia</option>
            </select>
          </div>
        </div>
        <div className={classes.operacaoContainer}>
          <div className={`${classes.operacaoTitle} ${action == 'compra' ? classes.titleVenda : classes.titleCompra}`}> saída </div>
          <div className={classes.operacaoBody}>
            <label className={classes.optLabel}> Termina </label>
            <select className={classes.optSelect}>
              <option value='1'>Fechamento do Dia</option>
              <option value='2'>Abertura Dia Seguinte</option>
              <option value='3'>Fechamento Dia Seguinte</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );

}

export default Backtest;