import React, { useEffect } from "react";
import { IoCheckmark, IoClose } from "react-icons/io5";
import FlagDisplay from "./FlagDisplay";

const ConstraintBlock = (props) => {
  var content = "";
  switch (props.ruleNumber) {
    case "1":
      content = (
        <p className="rounded-sm text-sm p-2">
          Your password must be at least {props.data.rule1Var} characters
        </p>
      );
      break;
    case "2":
      content = (
        <p className="rounded-sm text-sm p-2">
          Your password must include a number
        </p>
      );
      break;
    case "3":
      content = (
        <p className="rounded-sm text-sm p-2">
          Your password must include an uppercase letter
        </p>
      );
      break;
    case "4":
      content = (
        <p className="rounded-sm text-sm p-2">
          Your password must include a special character
        </p>
      );
      break;
    case "5":
      content = (
        <div className="p-2">
          <p className="rounded-sm text-sm">
            The digits in your password must add up to {props.data.rule5Var}
          </p>
          <p className="rounded-sm text-sm">
            Currently it adds up to: {props.data.rule5Progres}
          </p>
        </div>
      );
      break;
    case "6":
      content = (
        <p className="rounded-sm text-sm p-2">
          Your password must include a month of the year
        </p>
      );
      break;
    case "7":
      content = (
        <p className="rounded-sm text-sm p-2">
          Your password must include a Roman numeral
        </p>
      );
      break;
    case "8":
      content = (
        <div className="p-2">
          Your password must include one of this country
          <FlagDisplay countryCodes={props.data.rule8Var}/>
        </div>
      );
      break;
    case "9":
      console.log(props.data.rule9Var);
      console.log(props.data.rule9Progres);
      
      content = (
        <div className="p-2">
          <p className="rounded-sm text-sm">
          The Roman numerals in your password should multiply to {props.data.rule9Var}
          </p>
          <p className="rounded-sm text-sm">
            Currently it adds up to: {props.data.rule9Progres}
          </p>
        </div>
      );
      break;
    case "10":
      content = "Oh no! Your password is on fire 🔥. Quick, put it out!";
      break;
    case "11":
      content =
        "🥚 This is my chicken Paul. He hasn’t hatched yet. Please put him in your password and keep him safe";
      break;
    case "12":
      content = "Your password must include this CAPTCHA";
      break;
    case "13":
      content = "Your password must include a leap year";
      break;
    case "14":
      content =
        "🐔 Paul has hatched ! Please don’t forget to feed him. He eats X 🐛 every Y second";
      break;
    case "15":
      content =
        "A sacrifice must be made. Pick X letters that you will no longer be able to use";
      break;
    case "16":
      content =
        "Your password must contain one of the following words: I want IRK | I need IRK | I love IRK";
      break;
    case "17":
      content = "At least X% of your password must be in digits";
      break;
    case "18":
      content = "Your password must include the length of your password";
      break;
    case "19":
      content = "The length of your password must be a prime number";
      break;
    case "20":
      content = "Your password must include the current time";
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
        <p className="bg-[#1E1F20] rounded-sm text-sm p-2">{content}</p>
      </div>
    );
  } else {
    return (
      <div className="text-gray-400 w-[500px] rounded-lg border-2 bg-green-400 border-green-600 m-2">
        <h1 className="flex flex-row  items-center text-black px-1 py-2 text-xl">
          <IoCheckmark className="text-green-600 size-7" /> Rule{" "}
          {props.ruleNumber}
        </h1>
        <p className="bg-[#1E1F20] rounded-sm text-sm p-2">{content}</p>
      </div>
    );
  }
};

export default ConstraintBlock;
