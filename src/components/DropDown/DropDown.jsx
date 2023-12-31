import classes from './dropDown.module.css'

import { useState, useEffect, useRef } from 'react';

function DropDown({options, onSelect}) {
  const cntTickers = useRef();
  const [dropOpen, setDropOpen] = useState(false);
  const [selectedTicker, setSelectedTicker] = useState('');
  const tickers = [];

  useEffect(() => {
    function handleClickOutside(event) {
      if (cntTickers.current && !cntTickers.current.contains(event.target)) {
        setDropOpen(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [])
  
  for (let ticker in options) {
    tickers.push(ticker);
  }

  function handleSelect(ticker) {
    setSelectedTicker(ticker);
    setDropOpen(false);
    onSelect(ticker);
  }

  function handleClickInput() {
    setDropOpen(!dropOpen);
  }
  
  return (
    <div className={classes.dropDownContainer}>
      <div className={classes.fieldsContainer}>
        <span className={classes.dropDownLabel}> Ativo Selecionado </span>
        <div ref={cntTickers} className={classes.inputValue}>
          <div className={classes.selectedItem} onClick={handleClickInput}>
            {selectedTicker && (
              <>
                <img
                  src={options[selectedTicker].logo}
                  alt=''
                  width={20}
                  height={20}
                />
                <span
                  className={classes.tickerLabel}
                >{ selectedTicker }
                </span>
                <span className={classes.companyName}> { options[selectedTicker].name } </span>
              </>
            )}
          </div>
          <ul style={{ display: `${dropOpen ? 'flex' : 'none'}` }} className={classes.stockContainer}>
            {tickers.map(ticker => 
              <div 
                className={classes.imgTickerName}
                key={ticker}
                onClick={() => {handleSelect(ticker)} }
              >
                <li>
                  <img
                    src={options[ticker].logo}
                    alt=''
                    width={20}
                    height={20}
                  />
                  <span
                    className={classes.tickerLabel}
                  >{ ticker }
                  </span>
                  <span className={classes.companyName}> { options[ticker].name } </span>
                </li>
              </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DropDown;