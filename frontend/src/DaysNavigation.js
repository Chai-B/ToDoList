// DaysNavigation.js
import React from 'react';
import './DaysNavigation.css';

const DaysNavigation = ({ selectedDay, setSelectedDay }) => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  const last7Days = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    last7Days.push(date);
  }

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  return (
    <div className="days-navigation">
      {last7Days.map((date, index) => {
        const dayName = daysOfWeek[date.getDay()];
        const isToday = date.toDateString() === today.toDateString();
        return (
          <div
            key={index}
            className={`day ${isToday ? 'highlight' : ''} ${selectedDay === date.toDateString() ? 'selected' : ''}`}
            onClick={() => handleDayClick(date.toDateString())}
          >
            {dayName}
          </div>
        );
      })}
    </div>
  );
};

export default DaysNavigation;
