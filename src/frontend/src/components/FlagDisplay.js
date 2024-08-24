import React from 'react';
import Flag from 'react-flagkit';

const FlagDisplay = ({ countryCodes }) => {
  return (
    <div className="flex flex-row gap-2 m-2 flex-wrap min-w-[100px] justify-center items-center">
      {countryCodes.map((code) => (
        <Flag key={code} country={code} />
      ))}
    </div>
  );
};

export default FlagDisplay;
