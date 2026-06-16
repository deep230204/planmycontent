import { useRef } from "react";

function OTPInput({ otp, setOtp }) {
  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value.slice(-1);
    setOtp(updatedOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain").trim();
    if (!/^\d+$/.test(pasteData)) return;

    const digits = pasteData.slice(0, 6).split("");
    const newOtp = [...otp];
    
    digits.forEach((digit, i) => {
      if (i < 6) newOtp[i] = digit;
    });
    
    setOtp(newOtp);

    const nextIndex = Math.min(digits.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-4 mb-8">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={index === 0 ? handlePaste : undefined}
          className="h-14 w-12 sm:h-16 sm:w-14 rounded-2xl border border-slate-200 bg-white text-center text-xl sm:text-2xl font-bold text-slate-800 shadow-sm outline-none transition-all duration-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:#1e293b]"
        />
      ))}
    </div>
  );
}

export default OTPInput;
