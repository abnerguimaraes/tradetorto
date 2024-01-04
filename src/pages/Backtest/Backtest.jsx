import React, { useState, useContext } from 'react';
import { Select, SelectItem, RadioButtonGroup, RadioButton, NumberInput, Button, DatePicker, DatePickerInput, FormGroup } from 'carbon-components-react';
import { ref, onValue, update } from "firebase/database";

import classes from './index.module.scss'
import tickers from '../../helpers/tickers';
import ComponentWrapper from '../../components/ComponentWrapper';
import ResultTable from '../../components/ResultTable/ResultTable';
import { AppContext } from '../../store/AppContext';

function Backtest() {
  const [ticker, setTicker] = useState('AALR3');
  const [operacao, setOperacao] = useState('compra');
  const [oldDate, setOldDate] = useState(new Date())
  const [txtTaxa, setTxtTaxa] = useState(0);
  const [strIn, setStrIn] = useState('in1');
  const [strOut, setStrOut] = useState('out1');
  const [hideTx, setHideTx] = useState(false);
  const [ready, setReady] = useState(false);
  const [result, setResult] = useState();
  const { userId, database } = useContext(AppContext);

  function handleSelect(event) {
    setTicker(event.target.value);
  }

  function handleOperacao(val) {
    setOperacao(val);
  }

  function handleSelectIn(event) {
    if (event.target.value === 'in1' || event.target.value === 'in2' || event.target.value === 'in3') {
      setHideTx(false);

    } else {
      setHideTx(true);
    }
    setStrIn(event.target.value);
    checkReady();
  }

  function handleSelectOut(event) {
    setStrOut(event.target.value);
    checkReady();

  }

  function handleSetTaxa (event) {
    setTxtTaxa(event.target.value);
    checkReady();
  }

  function checkReady() {
    // eslint-disable-next-line
    if (!hideTx && txtTaxa != '0') {
      setReady(true);
    
    } else if (hideTx ) {
      setReady(true);
      
    } else {
      setReady(false);

    }
  }

  function handleData(event) {
    let selectedData = new Date(event);
    setOldDate(selectedData);

  }

  async function handleCalc() {
    let hoje = new Date();
    hoje.setMonth(hoje.getMonth() - 3);
    
    if (hoje > oldDate) {
     callAlpha();
      
    } else {
      callBrapi();

    }
  }

  async function callAlpha() {
    let response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}.SAO&outputsize=full&apikey=P8B3A8FGRZ7ZNA6Y`);
    let data = await response.json();

    // end mock
    let evolution = [];

    let day = oldDate.getDate().toString();
    if (day.length < 2) {
      day = '0' + day;
    }

    let mes = (oldDate.getMonth() + 1).toString();
    if (mes.length < 2) {
      mes = '0' + mes;
    }

    let target = oldDate.getFullYear().toString() + mes + day;    
    
    for (let movimento in data["Time Series (Daily)"]) {
      if (movimento.replaceAll('-', '') >= target) {
        let tmpObj = {
          dia: movimento,
          ...data["Time Series (Daily)"][movimento]
        }
        evolution.push(tmpObj);
      }
    }

    let valIn = 0;
    let valOut = 0;
    let nroTeste = 0;
    let ttGain = 0;
    let percGain = 0;
    let ttLoss = 0;
    let percLoss = 0;
    let maxLoss = 0;
    let maxGain = 0;
    let finalResult = 0;

    let resultArray = [];

    evolution.forEach((item, index) => {
      let entrou = false;
      // ignore last day cause it doesn't have a day before to compare.. (length == index)
      // ignore current day cause it doesn't have a next day to compare.. (index 0)
      if ((evolution.length > index + 1) && index > 0) {
        
        //entrada:
        if (strIn === 'in1') {
          valIn = (parseFloat(evolution[index + 1]['4. close']) + parseFloat((evolution[index + 1]['4. close'] * txtTaxa) / 100)).toFixed(2);
          if ((valIn < evolution[index + 1]['4. close'] && valIn >= evolution[index]['3. low']) ||
              (valIn > evolution[index + 1]['4. close'] && valIn <= evolution[index]['2. high'])) {
                entrou = true;
                nroTeste++;
          } 

        } else if (strIn === 'in2') {
          valIn = (parseFloat(evolution[index + 1]['1. open']) + parseFloat((evolution[index + 1]['1. open'] * txtTaxa) / 100)).toFixed(2);
          if ((valIn < evolution[index + 1]['1. open'] && valIn >= evolution[index]['3. low']) || 
              (valIn > evolution[index + 1]['1. open'] && valIn <= evolution[index]['2. high'])) {
                entrou = true;
                nroTeste++;
          } 
          
        } else if (strIn === 'in3') {
          valIn = (parseFloat(evolution[index]['1. open']) + parseFloat((evolution[index]['1. open'] * txtTaxa) / 100)).toFixed(2);
          if ((valIn < evolution[index]['1. open'] &&  valIn >= evolution[index]['3. low']) ||
              (valIn > evolution[index]['1. open'] && valIn <= evolution[index]['2. high'])) {
                entrou = true;
                nroTeste++;
          } 

        } else if (strIn === 'in4') {
          valIn = (parseFloat(evolution[index]['1. open'])).toFixed(2);
          entrou = true;
          nroTeste++;

        } else if (strIn === 'in5') {
          valIn = (parseFloat(evolution[index]['4. close'])).toFixed(2);  
          entrou = true;
          nroTeste++;

        }

        //saida
        if (strOut === 'out1') {
          valOut = (parseFloat(evolution[index]['4. close'])).toFixed(2);

        } else if (strOut === 'out2') {
          valOut = (parseFloat(evolution[index - 1]['1. open'])).toFixed(2);

        }  else if (strOut === 'out3') {
          valOut = (parseFloat(evolution[index - 1]['4. close'])).toFixed(2);

        }

        // calculos...
        if (entrou) {
          if (valIn <= valOut) {
            ttGain++;
            let dif = (valOut - valIn).toFixed(2);
            let tmpMax = (parseFloat(dif * 100) / valIn).toFixed(2);
            
            if (tmpMax > maxGain) {
              maxGain = tmpMax;
            }
            resultArray.push(tmpMax);

          } else {
            ttLoss++;
            let dif = (valOut - valIn).toFixed(2);
            let tmpMin = (parseFloat(dif * 100) / valIn).toFixed(2);
            
            if (parseFloat(tmpMin) < parseFloat(maxLoss)) {
              maxLoss = tmpMin;
            }
            resultArray.push(tmpMin);

          }
        }

      }
    });

    percGain = (ttGain * 100) / resultArray.length;
    percLoss = (ttLoss * 100) / resultArray.length;

    resultArray.forEach((item) => {
      finalResult += parseFloat(item);
    });

    finalResult = (finalResult / resultArray.length).toFixed(2);
    
    setResult(JSON.stringify({
      logo: tickers[ticker].logo,
      ticker: ticker,
      nroTeste: nroTeste,
      ttGain: operacao === 'compra' ? ttGain : ttLoss,
      percGain: operacao === 'compra' ? percGain : percLoss,
      ttLoss: operacao === 'compra' ? ttLoss : ttGain,
      percLoss: operacao === 'compra' ? percLoss : percGain,
      maxLoss: operacao === 'compra' ? maxLoss : maxGain,
      maxGain: operacao === 'compra' ? maxGain : maxLoss,
      finalResult: operacao === 'compra' ? finalResult : finalResult * -1,
    }));
  }

  async function callBrapi() {
    let response = await fetch(`https://brapi.dev/api/quote/${ticker}?range=3mo&interval=1d&fundamental=true&token=3L3zG1cU1C5QSsgdwnK4TN`);
    let data = await response.json();

    let evolution = [];

    let day = oldDate.getDate().toString();
    if (day.length < 2) {
      day = '0' + day;
    }

    let mes = (oldDate.getMonth() + 1).toString();
    if (mes.length < 2) {
      mes = '0' + mes;
    }

    let target = oldDate.getFullYear().toString() + mes + day;
    
    if (data && data.results && data.results[0].historicalDataPrice){
      for (let movimento of data.results[0].historicalDataPrice) {

        let diaMov = new Date(movimento.date * 1000);

        day = diaMov.getDate().toString();
        if (day.length < 2) {
          day = '0' + day;
        }

        mes = (diaMov.getMonth() + 1).toString();
        if (mes.length < 2) {
          mes = '0' + mes;
        }   

        
        let dataFormatada = diaMov.getFullYear() + mes + day;
        
        if (dataFormatada >= target) {
          let tmpObj = {
            dia: dataFormatada,
            "1. open": movimento.open,
            "2. high": movimento.high,
            "3. low": movimento.low,
            "4. close": movimento.close,
            "5. volume": movimento.volume,
            "adjust": movimento.adjustedClose,
          }
          evolution.push(tmpObj);

        }
      }
    }

    let valIn = 0;
    let valOut = 0;

    let nroTeste = 0;
    let ttGain = 0;
    let percGain = 0;
    let ttLoss = 0;
    let percLoss = 0;
    let maxLoss = 0;
    let maxGain = 0;
    let finalResult = 0;

    let resultArray = [];

    evolution.forEach((item, index) => {
      let adjustInd = item['4. close'] - item.adjust;
      item['1. open'] = item['1. open'] - adjustInd
      item['2. high'] = item['2. high'] - adjustInd
      item['3. low'] = item['3. low'] - adjustInd
      item['4. close'] = item['4. close'] - adjustInd
      item['5. volume'] = item['5. volume'] - adjustInd

      let entrou = false;
      // ignore last day cause it doesn't have a day before to compare.. (length == index)
      // ignore current day cause it doesn't have a next day to compare.. (index 0)
      if ((evolution.length > index + 1) && index > 0) {
        
        //entrada:
        if (strIn === 'in1') {
          valIn = (parseFloat(evolution[index - 1]['4. close']) + parseFloat((evolution[index - 1]['4. close'] * txtTaxa) / 100)).toFixed(2);
          if ((valIn < evolution[index - 1]['4. close'] && valIn >= evolution[index]['3. low']) ||
              (valIn > evolution[index - 1]['4. close'] && valIn <= evolution[index]['2. high'])) {
                entrou = true;
                nroTeste++;
          } 

        } else if (strIn === 'in2') {
          valIn = (parseFloat(evolution[index - 1]['1. open']) + parseFloat((evolution[index - 1]['1. open'] * txtTaxa) / 100)).toFixed(2);
          if ((valIn < evolution[index - 1]['1. open'] && valIn >= evolution[index]['3. low']) || 
              (valIn > evolution[index - 1]['1. open'] && valIn <= evolution[index]['2. high'])) {
                entrou = true;
                nroTeste++;
          } 
          
        } else if (strIn === 'in3') {
          valIn = (parseFloat(evolution[index]['1. open']) + parseFloat((evolution[index]['1. open'] * txtTaxa) / 100)).toFixed(2);
          if ((valIn < evolution[index]['1. open'] &&  valIn >= evolution[index]['3. low']) ||
              (valIn > evolution[index]['1. open'] && valIn <= evolution[index]['2. high'])) {
                entrou = true;
                nroTeste++;
          } 

        } else if (strIn === 'in4') {
          valIn = (parseFloat(evolution[index]['1. open'])).toFixed(2);
          entrou = true;
          nroTeste++;

        } else if (strIn === 'in5') {
          valIn = (parseFloat(evolution[index]['4. close'])).toFixed(2);  
          entrou = true;
          nroTeste++;

        }

        //saida
        if (strOut === 'out1') {
          valOut = (parseFloat(evolution[index]['4. close'])).toFixed(2);

        } else if (strOut === 'out2') {
          valOut = (parseFloat(evolution[index + 1]['1. open'])).toFixed(2);

        }  else if (strOut === 'out3') {
          valOut = (parseFloat(evolution[index + 1]['4. close'])).toFixed(2);

        }

        // calculos...
        if (entrou) {
          if (valIn <= valOut) {
            ttGain++;
            let dif = (valOut - valIn).toFixed(2);
            let tmpMax = (parseFloat(dif * 100) / valIn).toFixed(2);
            
            resultArray.push(tmpMax);

            if (tmpMax > maxGain) {
              maxGain = tmpMax;
            }

          } else if (valIn > valOut) {
            ttLoss++;
            let dif = (valOut - valIn).toFixed(2);
            let tmpMin = (parseFloat(dif * 100) / valIn).toFixed(2);

            resultArray.push(tmpMin);

            if (parseFloat(tmpMin) < parseFloat(maxLoss)) {
              maxLoss = tmpMin;
            }

          }
        }

      }
    });

    percGain = ((ttGain * 100) / resultArray.length).toFixed(2);
    percLoss = ((ttLoss * 100) / resultArray.length).toFixed(2);

    resultArray.forEach((item) => {
      finalResult = finalResult + parseFloat(item);
    });

    finalResult = (finalResult / resultArray.length).toFixed(2);
    
    setResult(JSON.stringify({
      logo: tickers[ticker].logo,
      ticker: ticker,
      nroTeste: nroTeste,
      ttGain: operacao === 'compra' ? ttGain : ttLoss,
      percGain: operacao === 'compra' ? percGain : percLoss,
      ttLoss: operacao === 'compra' ? ttLoss : ttGain,
      percLoss: operacao === 'compra' ? percLoss : percGain,
      maxLoss: operacao === 'compra' ? maxLoss : maxGain,
      maxGain: operacao === 'compra' ? maxGain : maxLoss,
      finalResult: operacao === 'compra' ? finalResult : finalResult * -1,
    }));
  }

  function handleSave() {
    const useFullResult = JSON.parse(result);
    const userRef = ref(database, userId);
    let found = false;

    onValue(userRef, (snapShot) => {
      let data = snapShot.val();
      
      for (let key in data.trades) {
        if (key === useFullResult.ticker) {
          found = true;
        }
      }
    });

    if (!found) {
      for (let key in useFullResult) {
        if (key === 'ticker') {
          update(ref(database, `${userId}/trades/`), { 
            [useFullResult[key]]: {
              "nroTrades": useFullResult['nroTeste'],
              "gain": useFullResult['percGain'],
              "loss": useFullResult['percLoss'],
              "nroGain": useFullResult['ttGain'],
              "nroLoss": useFullResult['ttLoss'],
              "media": useFullResult['finalResult'],
              "entrada": txtTaxa,
              "isOn": true,
            }
          });
        }
      }
    }
  }

  return (
    <section className={classes.container}>
      <span className={classes.title}> Back Test B3 - Diário </span>
      <span className={classes.subTitle}> Operações de DayTrade e SwingTrade Curto </span>
      <ComponentWrapper padding='0 0 32px 0'>
        <Select
          id='select-ativos'
          labelText='Ativos'
          helperText='Selecione um ativo'
          onChange={handleSelect}
        >
          { Object.keys(tickers).map((key) => 
            <SelectItem 
              key={key}
              text={`${key} - ${tickers[key].name}`}
              value={key}
            />  
          )}
        </Select>
      </ComponentWrapper>
      <div className={classes.estrategiaContainer}>
        <div
          className={classes.title}
          style={{
            padding: '16px 8px 8px 16px',
          }}
        >
          Estratégia
        </div>
        <div className={classes.line}>
          <ComponentWrapper padding='16px 0 0 16px'>
            <FormGroup legendText='Operação de entrada'>
              <RadioButtonGroup
                onChange={handleOperacao}
                defaultSelected="radio-1"
                valueSelected="compra"
                name="radio-button-group"
              >
                <RadioButton labelText="compra" value="compra" id="radio-1" />
                <RadioButton labelText="venda" value="venda" id="radio-2"/>
              </RadioButtonGroup>
            </FormGroup>
          </ComponentWrapper>
          <ComponentWrapper 
            padding='0 0 0 20px'
            width='50%'
          >
            <DatePicker
              id='datePicker-01'
              locate='pt'
              datePickerType="single"
              dateFormat="d/m/Y"
              maxDate={new Date()}
              onChange={handleData}
              value={oldDate}
              allowInput={false}
            >
              <DatePickerInput id='datePickerInput-01' labelText="Data Início" placeholder='dd/mm/yyyy'/>
            </DatePicker>
          </ComponentWrapper>
        </div>
        <div className={classes.operacoesContainer}>
          <div className={classes.operacaoItemContainer}>
            <div className={classes.title}> Entrada: {operacao} de {ticker} </div>
            <ComponentWrapper padding='8px 32px 24px 0'>
              <Select
                id='sel-strat-in'
                labelText='Entrada'
                helperText='Selecione o valor para teste'
                onChange={handleSelectIn}
              >
                <SelectItem
                  key='in1'
                  text='% do Fechamento dia Anterior'
                  value='in1'
                />
                <SelectItem
                  key='in2'
                  text='% do Abertura dia Anterior'
                  value='in2'
                />
                <SelectItem
                  key='in3'
                  text='% Abertuda dia Atual'
                  value='in3'
                />
                <SelectItem
                  key='in4'
                  text='Abertura do Dia'
                  value='in4'
                />
                <SelectItem
                  key='in5'
                  text='Fechamento Dia'
                  value='in5'
                />
              </Select>
            </ComponentWrapper>
            <ComponentWrapper
              padding='0 32px 0 0'
            >
              <NumberInput
                  id='txt-taxa'
                  label='Variação em %'
                  helperText='Informe a taxa'
                  min={-100}
                  max={100}
                  type='text'
                  disabled={hideTx}
                  value={txtTaxa}
                  onChange={handleSetTaxa}
                  onBlur={handleSetTaxa}
                  invalidText='Taxa inválida'
                />
            </ComponentWrapper>
          </div>
          <div className={classes.operacaoItemContainer}>
            <div className={classes.title}> Saída: {operacao === 'compra' ? 'venda' : 'compra'} de {ticker} </div>
            <ComponentWrapper padding='8px 16px 24px 0'>
              <Select
                  id='sel-strat-out'
                  labelText='Saída'
                  helperText='Selecione o valor para teste'
                  onChange={handleSelectOut}
                >
                  <SelectItem
                    key='out1'
                    text='Fechamento do Dia'
                    value='out1'
                  />
                  <SelectItem
                    key='out2'
                    text='Abertura Dia Seguinte'
                    value='out2'
                  />
                  <SelectItem
                    key='out3'
                    text='Fechamento Dia Seguinte'
                    value='out3'
                  />
              </Select>
            </ComponentWrapper>
            <ComponentWrapper height='84px' padding='8px 16px 0px 0'>
              <div 
                style={
                  { display: 'flex',
                    alignItems: 'end',
                    justifyContent: 'end',
                    width: '100%'
                  }
                }
              >
                <Button onClick={handleCalc} disabled={!ready}> calcular </Button>
              </div>
            </ComponentWrapper>
          </div>
        </div>
      </div>
      {result && <ResultTable data={result}/>}
      <ComponentWrapper height='84px' padding='8px 32px 0px 0'>
        <div 
          style={
            { display: 'flex',
              alignItems: 'end',
              justifyContent: 'end',
              width: '100%'
            }
          }
        >
          <Button 
            style={{width: "132px"}}
            disable={!result}
            onClick={handleSave}
          >
            salvar
          </Button>
        </div>
      </ComponentWrapper>
    </section>
  );
}

export default Backtest;