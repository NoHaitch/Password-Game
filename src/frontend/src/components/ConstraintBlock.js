import React, { useState } from "react";
import { IoCheckmark, IoClose } from "react-icons/io5";
import FlagDisplay from "./FlagDisplay";
import CaptchaGenerator from "./CaptchaGenerator";
import CharPicker from "./CharPicker";

const ConstraintBlock = (props) => {
  const handleCaptchaGenerate = (captchaText) => {
    props.onCaptchaGenerate(captchaText);
  };

  const handleImageGenerate = (image) => {
    props.onCaptchaImageGenerate(image);
  };

  var content = "";
  switch (props.ruleNumber) {
    case "1":
      content = (
        <p className="bg-[#1E1F20] rounded-sm text-sm p-2">
          Your password must be at least {props.data.rule1Var} characters
        </p>
      );
      break;
    case "2":
      content = (
        <p className="bg-[#1E1F20] rounded-sm text-sm p-2">
          Your password must include a number
        </p>
      );
      break;
    case "3":
      content = (
        <p className="bg-[#1E1F20] rounded-sm text-sm p-2">
          Your password must include an uppercase letter
        </p>
      );
      break;
    case "4":
      content = (
        <p className="bg-[#1E1F20] rounded-sm text-sm p-2">
          Your password must include a special character
        </p>
      );
      break;
    case "5":
      content = (
        <div className="bg-[#1E1F20] rounded-sm text-sm p-2">
          <p className="">
            The digits in your password must add up to {props.data.rule5Var}
          </p>
          <p className="">Currently it adds up to: {props.data.rule5Progres}</p>
        </div>
      );
      break;
    case "6":
      content = (
        <p className="bg-[#1E1F20] rounded-sm text-sm p-2">
          Your password must include a month of the year
        </p>
      );
      break;
    case "7":
      content = (
        <p className="bg-[#1E1F20] rounded-sm text-sm p-2">
          Your password must include a Roman numeral (must be uppercase)
        </p>
      );
      break;
    case "8":
      content = (
        <div className="bg-[#1E1F20] rounded-sm text-sm p-2">
          Your password must include one of this country
          <FlagDisplay countryCodes={props.data.rule8Var} />
        </div>
      );
      break;
    case "9":
      content = (
        <div className="bg-[#1E1F20] rounded-sm text-sm p-2">
          <p className="">
            The Roman numerals in your password should multiply to{" "}
            {props.data.rule9Var}
          </p>
          <p className="">
            Currently it multiply up to: {props.data.rule9Progres}
          </p>
        </div>
      );
      break;
    case "10":
      content = (
        <p className="bg-[#1E1F20] rounded-sm text-sm p-2">
          Oh no! Your password is on fire 🔥. Quick, put it out!
        </p>
      );
      break;
    case "11":
      content = (
        <p className="bg-[#1E1F20] rounded-sm text-sm p-2">
          🥚 This is my chicken Paul. He hasn’t hatched yet. Please put him in
          your password and keep him safe
        </p>
      );
      break;
    case "12":
      content = (
        <div className="bg-[#1E1F20] rounded-sm text-sm p-2">
          <h1>Your password must include this CAPTCHA</h1>
          <CaptchaGenerator
            onCaptchaGenerate={handleCaptchaGenerate}
            onImageGenerate={handleImageGenerate}
            initialCaptchaText={props.initialCaptchaText}
            initialCaptchaImage={props.initialCaptchaImage}
          />
        </div>
      );
      break;
    case "13":
      content = (
        <p className="bg-[#1E1F20] rounded-sm text-sm p-2">
          Your password must include a leap year. The year must be above{" "}
          {props.data.rule13Var}.
        </p>
      );
      break;
    case "14":
      content = (
        <p className="bg-[#1E1F20] rounded-sm text-sm p-2">
          🐔 Paul has hatched ! Please don’t forget to feed him. He eats{" "}
          {props.data.rule14FeedCount} 🐛 every{" "}
          {props.data.rule14Timeout / 1000} second
        </p>
      );
      break;
    case "15":
      content = (
        <div className="bg-[#1E1F20] rounded-sm text-sm p-2">
          <h1>
            A sacrifice must be made. Pick {props.data.rule15Var} letters that
            you will no longer be able to use.
          </h1>

          <CharPicker
            charLimit={props.data.rule15Var}
            onPick={props.onLetterPick}
            initialSelection={props.initialSelection}
          />
        </div>
      );
      break;
    case "16":
      content = (
        <p className="bg-[#1E1F20] rounded-sm text-sm p-2">
          Your password must contain one of the following words: I want IRK | I
          need IRK | I love IRK
        </p>
      );
      break;
    case "17":
      content = (
        <div className="bg-[#1E1F20] rounded-sm text-sm p-2">
          <h1>
            At least {props.data.rule17Var * 100}% of your password must be in
            digits
          </h1>
          <h1>
            Currently the percentage is:{" "}
            {props.data.rule17Progres ? props.data.rule17Progres * 100 : 0}%
          </h1>
        </div>
      );
      break;
    case "18":
      content = (
        <p className="bg-[#1E1F20] rounded-sm text-sm p-2">
          Your password must include the length of your password
        </p>
      );
      break;
    case "19":
      content = (
        <p className="bg-[#1E1F20] rounded-sm text-sm p-2">
          The length of your password must be a prime number
        </p>
      );
      break;
    case "20":
      content = (
        <p className="bg-[#1E1F20] rounded-sm text-sm p-2">
          Your password must include the current time using the 24-hour format
          "hour:minute"
        </p>
      );
      break;
    case "21":
      content = "Your password must include the current time";
      break;
    case "22":
      content = "Your password must include the current time";
      break;
    case "23":
      content = "Your password must include the current time";
      break;
    case "24":
      content = "Your password must include the current time";
      break;
    case "25":
      content = "Your password must include the current time";
      break;
    case "26":
      content = "Your password must include the current time";
      break;
    case "27":
      content = "Your password must include the current time";
      break;
    default:
      break;
  }

  if (props.state === false) {
    return (
      <div className="text-gray-400 w-[500px] rounded-lg border-2 bg-red-400 border-red-600 m-2">
        <h1 className="flex flex-row  items-center text-black px-1 py-2 text-xl">
          <IoClose className="text-red-600 size-7" /> Rule {props.ruleNumber}
        </h1>
        {content}
      </div>
    );
  } else {
    return (
      <div className="text-gray-400 w-[500px] rounded-lg border-2 bg-green-400 border-green-600 m-2">
        <h1 className="flex flex-row  items-center text-black px-1 py-2 text-xl">
          <IoCheckmark className="text-green-600 size-7" /> Rule{" "}
          {props.ruleNumber}
        </h1>
        {content}
      </div>
    );
  }
};

export default ConstraintBlock;
