import classes from './tradetable.module.scss';

import React, { useEffect, useState } from 'react';
import { Toggle, Button } from 'carbon-components-react';
import tickers from '../../helpers/tickers';

function TradesTable ({ data, onAddTrade, onTurnLine }) {
  const [dataTable, setDataTable] = useState([]);

  useEffect(() => {
    if (data) {
      setDataTable(() => {
        let tmpArr = [];

        for (let stock in data) {
          let tmpObj = {
            ...data[stock],
            ticker: stock,
          }

          tmpArr.push(tmpObj);
        }
        return tmpArr
      });
    }

  },[data]);

  function handleOnOff(idx, event) {
    onTurnLine(dataTable[idx].ticker, event);
  }

  function handleAddTrade(idx) {
    onAddTrade(dataTable[idx]);
  }

  const titles = [
    {
      key: 'icon',
      header: 'icon'
    }, {
      key: 'ticker',
      header: 'ticker'
    }, {
      key: 'nroTrade',
      header: 'Número Trades'
    }, {
      key: 'percGain',
      header: '% Gain'
    }, {
      key: 'percLoss',
      header: '% Loss'
    }, {
      key: 'media',
      header: 'Resultado Médio'
    }, {
      key: 'addTrade',
      header: 'Add Trade'
    }, {
      key: 'onOff',
      header: 'Liga/Desliga'
    }
  ]
  
  return (
    <div className={classes.tableContainer}>
      <table>
        <tbody>
          <tr>
            {titles.map((title) =>
              <th key={`table-${title.key}`}> { title.header } </th>
            )}
          </tr>
          {dataTable && dataTable.length > 0 && dataTable.map((item, idx) =>
            <tr key={`table-line-${item.ticker}`}>
              <td>
                <img src={tickers[item.ticker].logo} alt='logo' ></img>
              </td>
              <td> { item.ticker } </td>
              <td> { item.nroTrades } </td>
              <td> { item.gain } </td>
              <td> { item.loss } </td>
              <td> { item.media } </td>
              <td>
                <Button
                  hasIconOnly={true}
                  iconDescription="add"
                  size={'small'}
                  onClick={() => handleAddTrade(idx)}
                >
                  +
                </Button>
              </td>
              <td>                 
                <Toggle
                  aria-label="toggle button"
                  id={`toggle-${item.ticker}`}
                  onToggle={(event) => handleOnOff(idx, event)}
                  defaultToggled={item.isOn}
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TradesTable;