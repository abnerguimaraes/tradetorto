import classes from './resulttable.module.scss';

import React, { useEffect, useState } from 'react';

function ResultTable ({ data }) {
  const [dataTable, setDataTable] = useState();

  useEffect(() => {
    setDataTable({
      ...JSON.parse(data)
    });
  },[data]);

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
      key: 'ttGain',
      header: 'Total Gain'
    }, {
      key: 'percGain',
      header: '% Gain'
    }, {
      key: 'ttLoss',
      header: 'Total Loss'
    }, {
      key: 'percLoss',
      header: '% Loss'
    }, {
      key: 'maxLoss',
      header: 'Perda Máxima'
    }, {
      key: 'maxGain',
      header: 'Ganho Máximo'
    }, {
      key: 'media',
      header: 'Resultado Médio'
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
          {dataTable && <tr>
            <td>
              <img src={dataTable.logo} alt='logo' ></img>
            </td>
            <td> { dataTable.ticker } </td>
            <td> { dataTable.nroTeste } </td>
            <td> { dataTable.ttGain } </td>
            <td> { dataTable.percGain } </td>
            <td> { dataTable.ttLoss } </td>
            <td> { dataTable.percLoss } </td>
            <td> { dataTable.maxLoss } </td>
            <td> { dataTable.maxGain } </td>
            <td> { dataTable.finalResult } </td>
          </tr>}
        </tbody>
      </table>
    </div>
  );
}

export default ResultTable;