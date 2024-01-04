import React, { useEffect, useState, useContext } from 'react';
import { ref, onValue, update } from "firebase/database";

import classes from './trades.module.scss';
import TradesTable from '../../components/TradesTable/TradesTable';
import { AppContext } from '../../store/AppContext';

import AddModal from '../../components/AddModal/AddModal';

function Trades() {
  const { userId, database } = useContext(AppContext);
  const [sheetData, setSheetData] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [stockData, setStockData] = useState({});
  const userRef = ref(database, userId);

  useEffect(() => {
    onValue(userRef, (snapShot) => {
      let data = snapShot.val();

      for (let stock in data) {
        if (stock === 'trades') {
          setSheetData(() => {
            let tmpArray = [];

            let tmpStock = {
              ...data[stock]
            };
  
            tmpArray.push(tmpStock);
            return tmpStock
          });
        }
      }
      
    });
  });

  function turnLine(ticker, value) {
    let updatedValue; 
    
    for (let stock in sheetData) {
      if (stock === ticker) {
        updatedValue = sheetData[stock];
        updatedValue.isOn = value
      }
    }

    update(ref(database, `${userId}/trades/${ticker}`), {
      ...updatedValue
    });
  }

  function addTrade(ticker) {
    setIsAdding(true);
    setStockData(ticker);
  }

  function handleClose(value) {
    let dataToBase = {
      gain: stockData.gain,
      isOn: true,
      loss: stockData.loss,
      media: stockData.media,
      nroGain: stockData.nroGain,
      nroLoss: stockData.nroLoss,
      nroTrades: stockData.nroTrades,
      entrada: stockData.entrada,
    }

    dataToBase.media = (((dataToBase.nroTrades * parseFloat(dataToBase.media)) + parseFloat(value)) / (dataToBase.nroTrades + 1)).toFixed(2);
    dataToBase.nroTrades++;

    if (value >= 0) {
      dataToBase.nroGain++;

    } else {
      dataToBase.nroLoss++;

    }

    dataToBase.loss = ((parseFloat(dataToBase.nroLoss) * 100) / dataToBase.nroTrades).toFixed(2);
    dataToBase.gain = ((parseFloat(dataToBase.nroGain) * 100) / dataToBase.nroTrades).toFixed(2);

    update(ref(database, `${userId}/trades/${stockData.ticker}`), {
      ...dataToBase
    });

    setStockData({});
    setIsAdding(false);
  }

  function handleCancel(){
    setStockData({});
    setIsAdding(false);
  }

  return (
    <section className={classes.container}>
      <span className={classes.title}> Meus Trades </span>
      <span className={classes.subTitle}> Operações encontradas </span>
      <TradesTable data={sheetData} onTurnLine={turnLine} onAddTrade={addTrade}/>
      {isAdding && <AddModal onClose={handleClose} onCancel={handleCancel} />}
    </section>
  );
}

export default Trades;