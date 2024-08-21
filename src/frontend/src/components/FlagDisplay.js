import React from 'react';
import Flag from 'react-flagkit';

const FlagDisplay = ({ countryCodes }) => {
  return (
    <div className="flex flex-row space-x-2 m-2">
      {countryCodes.map((code) => (
        <Flag key={code} country={code} />
      ))}
    </div>
  );
};

export default FlagDisplay;
