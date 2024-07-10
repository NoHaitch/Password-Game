import React, { useEffect, useRef, useState } from "react";
import Textarea from "react-expanding-textarea";

const PasswordField = () => {
  const textareaRef = useRef(null);

  const [count, setCount] = useState(0);

  useEffect(() => {
    textareaRef.current.focus();
  }, []);

  return (
    <div className="flex flex-row items-center justify-center">
      <div>
        <label
          htmlFor="textarea"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Choose a password!
        </label>
        <Textarea
          className="w-[500px] resize-none block p-2.5 text-lg rounded-lg border-2 bg-[#1E1F20] border-[#7188D9] placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
          id="textarea"
          name="pet[notes]"
          placeholder="Password..."
          ref={textareaRef}
          onChange={(e) => setCount(e.target.value.length)}
        />
      </div>
      <p className="text-white absolute mr-[-550px] mb-[-20px] text-left">
        {count}
      </p>
    </div>
  );
};

export default PasswordField;
