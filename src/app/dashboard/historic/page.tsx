'use client'

import classes from './historic.module.css';
import { CredentialsContext } from '../../../store/Credentials';

import { useContext, useEffect, useState } from 'react';
import { ref, onValue, update } from "firebase/database";


function Historic() {
  const { database } = useContext(CredentialsContext);
  const [historicData, setHistoricData] = useState({});
  const [needFetch, setNeedToFetch] = useState(false);

  let histDocument = ref(database, 'history');

  let hoje = new Date();

  useEffect(() => {
    onValue(histDocument, (snapShot) => {
      let tmpData = snapShot.val();
      setHistoricData(tmpData);
      
    });
  }, []);

  for (let datas in historicData) {
    console.log(historicData[datas]);
  }

  return (
    <section className={classes.historicContainer}>
      {historicData && <p>{historicData.toString()}</p>}
    </section>
  );
}

export default Historic;