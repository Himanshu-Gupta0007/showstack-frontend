import React, { useState } from "react";


const availableDates = [
  { day: 17, month: "Sep" },
  { day: 17, month: "May" },
  { day: 18, month: "Sep" },
  { day: 19, month: "Sep" },
];

const recommendations = [
  "Avengers Endgame",
  "Batman",
  "Joker",
  "Interstellar",
];

const DateSelector = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="date-selector-container">
      
      {/* DATE PICKER */}
      <h2>Choose Date</h2>
      <div className="date-buttons">
        {availableDates.map((date, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedDate(date)}
            className={`date-button ${selectedDate === date ? "selected" : ""}`}
          >
            <div>{date.day}</div>
            <div>{date.month}</div>
          </button>
        ))}
      </div>

      {/* BOOK NOW BUTTON */}
      <button className="book-btn" disabled={!selectedDate}>
        Book Now
      </button>

      {/* RECOMMENDATIONS */}
      <div className="recommendations">
        <h3>You May Also Like</h3>
        <div className="recommendations-grid">
          {recommendations.map((movie, idx) => (
            <div key={idx} className="recommendation-card">
              {movie}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DateSelector;
