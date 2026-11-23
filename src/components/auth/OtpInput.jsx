import { forwardRef, useImperativeHandle, useRef } from 'react';

/**
 * Row of single-digit boxes: auto-advance, backspace, arrows and paste.
 * value: array of digits ('' for empty), onChange(nextArray)
 * ref.focus(index) focuses a box.
 */
const OtpInput = forwardRef(function OtpInput({ value, onChange, hasError = false }, ref) {
  const inputs = useRef([]);
  const length = value.length;

  const focusAt = (i) => {
    const el = inputs.current[Math.max(0, Math.min(length - 1, i))];
    if (el) {
      el.focus();
      el.select();
    }
  };

  useImperativeHandle(ref, () => ({ focus: focusAt }));

  const fillFrom = (start, text) => {
    const clean = text.replace(/\D/g, '').slice(0, length - start);
    if (!clean) return;
    const next = [...value];
    clean.split('').forEach((ch, k) => {
      next[start + k] = ch;
    });
    onChange(next);
    focusAt(start + clean.length);
  };

  const handleChange = (i, text) => {
    if (text === '') onChange(value.map((d, k) => (k === i ? '' : d)));
    else fillFrom(i, text);
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) {
      e.preventDefault();
      onChange(value.map((d, k) => (k === i - 1 ? '' : d)));
      focusAt(i - 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focusAt(i - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      focusAt(i + 1);
    }
  };

  return (
    <div className="otp-row">
      {value.map((d, i) => (
        <input
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          ref={(el) => {
            inputs.current[i] = el;
          }}
          className={`otp-input ${hasError ? 'input-error' : ''}`}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={length}
          value={d}
          aria-label={`Digit ${i + 1}`}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => {
            e.preventDefault();
            fillFrom(i, e.clipboardData.getData('text'));
          }}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
});

export default OtpInput;
