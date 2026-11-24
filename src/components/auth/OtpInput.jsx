/*
 * OtpInput — 6 boxes for a code, one digit per box.
 * value is an array like ["4","8","2","","",""]. Typing jumps to the next box,
 * Backspace goes back, and pasting "482071" fills every box.
 */
function OtpInput({ value, onChange, hasError }) {
  const focusBox = (index) => {
    const box = document.getElementById("otp-" + Math.max(0, Math.min(value.length - 1, index)));
    if (box) box.focus();
  };

  /* Puts the digits of "text" in the boxes starting at "start". */
  const fill = (start, text) => {
    const digits = text
      .replace(/\D/g, "")
      .slice(0, value.length - start)
      .split("");
    if (digits.length === 0) return;
    const next = [...value];
    digits.forEach((digit, i) => {
      next[start + i] = digit;
    });
    onChange(next);
    focusBox(start + digits.length);
  };

  const handleChange = (index, text) => {
    if (text === "") {
      onChange(value.map((digit, i) => (i === index ? "" : digit)));
    } else {
      fill(index, text.slice(-value.length));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && value[index] === "" && index > 0) {
      onChange(value.map((digit, i) => (i === index - 1 ? "" : digit)));
      focusBox(index - 1);
    }
  };

  return (
    <div className="otp-row">
      {value.map((digit, index) => (
        <input
          key={index}
          id={"otp-" + index}
          className={hasError ? "otp-input input-error" : "otp-input"}
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          value={digit}
          aria-label={"Digit " + (index + 1)}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={(e) => {
            e.preventDefault();
            fill(index, e.clipboardData.getData("text"));
          }}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
}

export default OtpInput;
