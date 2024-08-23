import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

const Timer = forwardRef(
  (
    { isActive, initialTime = 0, onTimeUpdate = null, onTimeChange = null },
    ref
  ) => {
    const [time, setTime] = useState(initialTime);
    const intervalRef = useRef(null);

    useEffect(() => {
      setTime(initialTime);
    }, [initialTime]);

    useEffect(() => {
      if (isActive) {
        intervalRef.current = setInterval(() => {
          setTime((prevTime) => {
            const newTime = prevTime + 20;
            if (onTimeUpdate) {
              onTimeUpdate(newTime);
            }
            return newTime;
          });
        }, 20);
      } else {
        clearInterval(intervalRef.current);
      }

      return () => clearInterval(intervalRef.current);
    }, [isActive, onTimeUpdate]);

    useEffect(() => {
      if (onTimeChange) {
        onTimeChange(time);
      }
    }, [time, onTimeChange]);

    useImperativeHandle(ref, () => ({
      setTimerTime: (newTime) => {
        setTime(newTime);
      },
    }));

    const formatTime = (time) => {
      const totalMilliseconds = time;
      const totalSeconds = Math.floor(totalMilliseconds / 1000);
      const milliseconds = Math.floor((totalMilliseconds % 1000) / 20);

      const totalMinutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      const pad = (num, size) => {
        let s = "0" + num;
        return s.substr(s.length - size);
      };

      return (
        <div className="timer flex items-center space-x-1 bg-[#e2bd56] p-2 rounded-xl">
          <h1 className="m-2 font-bold">Time</h1>
          <span className="hours text-2xl font-mono bg-white rounded-lg p-1">
            {pad(hours, 2)}
          </span>
          <span className="separator">:</span>
          <span className="minutes text-2xl font-mono bg-white rounded-lg p-1">
            {pad(minutes, 2)}
          </span>
          <span className="separator">:</span>
          <span className="seconds text-2xl font-mono bg-white rounded-lg p-1">
            {pad(seconds, 2)}
          </span>
          <span className="separator">.</span>
          <span className="milliseconds text-lg font-mono w-16">
            {pad(milliseconds, 2)} ms
          </span>
        </div>
      );
    };
    return <div className="timer">{formatTime(time)}</div>;
  }
);

export default Timer;
