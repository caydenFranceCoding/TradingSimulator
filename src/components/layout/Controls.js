import React, { useContext } from "react";
import { MarketContext } from "../../context/MarketContext";

const Controls = () => {
    const { day, advanceDay } = useContext(MarketContext);

    return (
    <div className="controls">
      <div className="day-control">
        <span className="day-label">Market Day:</span>
        <span className="day-number">{day}</span>
      </div>
      <button className="next-day-btn" onClick={advanceDay}>
        Next Day
      </button>
    </div>
  );
};


export default Controls