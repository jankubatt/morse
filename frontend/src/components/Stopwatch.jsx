import React, { useState, useEffect } from 'react';

const Stopwatch = () => {
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval;

      setStartTime(performance.now() - elapsedTime);
      interval = setInterval(() => {
        setElapsedTime(performance.now() - startTime);
      }, 1);
    

    return () => clearInterval(interval);
  }, [startTime, elapsedTime]);

  const formatTime = (milliseconds) => {
    const totalMilliseconds = Math.floor(milliseconds);
    const minutes = Math.floor(totalMilliseconds / (60 * 1000));
    const seconds = Math.floor((totalMilliseconds % (60 * 1000)) / 1000);
    const millisecondsPart = totalMilliseconds % 1000;

    const pad = (value) => (value < 10 ? `0${value}` : value);

    return `${pad(minutes)}:${pad(seconds)}.${pad(millisecondsPart)}`;
  };

  return (
    <div>
      <div>{formatTime(elapsedTime)}</div>
    </div>
  );
};

export default Stopwatch;
