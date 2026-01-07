import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { useAppDispatch, useAppSelector } from '../../store';
import { selectItemAmount, setItemAmount } from '../../store/inventory';
import { DragSource } from '../../typings';
import { onUse } from '../../dnd/onUse';
import { onGive } from '../../dnd/onGive';
import { fetchNui } from '../../utils/fetchNui';
import { Locale } from '../../store/locale';
import UsefulControls from './UsefulControls';
import { Logo } from '../../store/logo';

const InventoryControl: React.FC = () => {
  const itemAmount = useAppSelector(selectItemAmount);
  const dispatch = useAppDispatch();

  const [infoVisible, setInfoVisible] = useState(false);

    // 数量追加関数
  const addAmount = (amount: number) => {
    dispatch(setItemAmount(itemAmount + amount));
  };

  // 数量リセット関数
  const resetAmount = () => {
    dispatch(setItemAmount(0));
  };

  const AddButton: React.FC<{ amount: number }> = ({ amount }) => {
    const addAmount = () => {
      dispatch(setItemAmount(itemAmount + amount));
    };

    return (
      <button className="inventory-control-button" onClick={addAmount}>
        +
      </button>
    );
  };

    const RemoveButton: React.FC<{ amount: number }> = ({ amount }) => {
      const removeAmount = () => {
        if (itemAmount - amount < 0) {
          dispatch(setItemAmount(0));
        } else {
          dispatch(setItemAmount(itemAmount - amount));
        }
    };

    return (
      <button className="inventory-control-button" onClick={removeAmount}>
        -
      </button>
    );
  };

  

  
  const [, use] = useDrop<DragSource, void, any>(() => ({
    accept: 'SLOT',
    drop: (source) => {
      source.inventory === 'player' && onUse(source.item);
    },
  }));

  const [, give] = useDrop<DragSource, void, any>(() => ({
    accept: 'SLOT',
    drop: (source) => {
      source.inventory === 'player' && onGive(source.item);
    },
  }));

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.valueAsNumber =
      isNaN(event.target.valueAsNumber) || event.target.valueAsNumber < 0 ? 0 : Math.floor(event.target.valueAsNumber);
    dispatch(setItemAmount(event.target.valueAsNumber));
  };

  return (
    <>
      <UsefulControls infoVisible={infoVisible} setInfoVisible={setInfoVisible} />
      <div className="inventory-control">
        <div className="inventory-control-wrapper">
          <div className="inventory-control-input-wrapper">
            { Logo && (<div className="inventory-control-logo-wrapper">
              <img className="inventory-control-logo" src={Logo} />
            </div> )}
            <input
              className="inventory-control-input"
              type="number"
              value={itemAmount}
              onChange={inputHandler}
              min={0}
            />
            <div className="inventory-control-button-wrapper">
              <button className="inventory-control-button" onClick={() => dispatch(setItemAmount(0))}>
                {Locale.ui_reset || 'Reset'}
              </button>
            </div>
            <div className="inventory-control-button-wrapper">
              {[1, 10, 100].map((value, index) => (
                <AddButton key={index} amount={value} />
              ))}
            </div>
            <div className="inventory-control-button-wrapper">
              {[1, 10, 100].map((value, index) => (
                <button className="inventory-control-button">{value}</button>
              ))}
            </div>
            <div className="inventory-control-button-wrapper">
              {[1, 10, 100].map((value, index) => (
                <RemoveButton key={index} amount={value} />
              ))}
            </div>
          </div>
          <button className="inventory-control-button" ref={use}>
            {Locale.ui_use || 'Use'}
          </button>
          <button className="inventory-control-button" ref={give}>
            {Locale.ui_give || 'Give'}
          </button>
          <button className="inventory-control-button" onClick={() => fetchNui('exit')}>
            {Locale.ui_close || 'Close'}
          </button>
        </div>
      </div>

      <button className="useful-controls-button" onClick={() => setInfoVisible(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 524 524">
          <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
        </svg>
      </button>
    </>
  );
};

export default InventoryControl;
