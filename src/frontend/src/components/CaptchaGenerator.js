import React, { useState, useEffect } from "react";

function CaptchaGenerator({ 
  onCaptchaGenerate, 
  onImageGenerate,
  initialCaptchaText = "", 
  initialCaptchaImage = ""
}) {
  const [captcha, setCaptcha] = useState(initialCaptchaText);
  const [captchaImage, setCaptchaImage] = useState(initialCaptchaImage);

  const generateCaptcha = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let captchaText = "";
    for (let i = 0; i < 6; i++) {
      captchaText += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setCaptcha(captchaText);
    onCaptchaGenerate(captchaText);
  };

  const generateCaptchaImage = (text) => {
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 100;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '40px "Comic Sans MS", cursive, sans-serif';
    ctx.textBaseline = "middle";

    for (let i = 0; i < text.length; i++) {
      const x = 20 + i * 30;
      const y = 50 + Math.random() * 10;
      const angle = Math.random() * 0.2 - 0.1;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      ctx.fillStyle = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;

      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }

    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = "#000";
      ctx.beginPath();
      ctx.moveTo(Math.random() * 200, Math.random() * 100);
      ctx.lineTo(Math.random() * 200, Math.random() * 100);
      ctx.stroke();
    }

    return canvas.toDataURL("image/png");
  };

  useEffect(() => {
    if (captcha) {
      const img = generateCaptchaImage(captcha);
      setCaptchaImage(img);
      onImageGenerate(img);
    } else if (!initialCaptchaText) {
      handleGenerate();
    }
  }, [captcha, initialCaptchaText]);

  const handleGenerate = () => {
    generateCaptcha();
  };

  return (
    <div className="captcha-generator flex justify-center items-center text-center m-2">
      <div>
        <img src={captchaImage} alt="Captcha" />
        <button onClick={handleGenerate}>Refresh</button>
      </div>
    </div>
  );
}

export default CaptchaGenerator;
