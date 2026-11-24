/*
 * QrCode — draws a QR-looking square from the ticket number.
 * It is only a picture for the demo (it cannot be scanned).
 * With a real backend you would show the QR image sent by the server.
 */
function QrCode({ value, size }) {
  const cells = 21;
  let seed = 0;
  for (let i = 0; i < value.length; i++) seed = (seed * 31 + value.charCodeAt(i)) % 2147483647;

  /* The 3 big corner squares of every QR code. */
  const isCorner = (x, y) => (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
  const cornerFilled = (x, y) => {
    const cx = x > 13 ? x - 14 : x;
    const cy = y > 13 ? y - 14 : y;
    return cx === 0 || cx === 6 || cy === 0 || cy === 6 || (cx >= 2 && cx <= 4 && cy >= 2 && cy <= 4);
  };

  const squares = [];
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      let filled;
      if (isCorner(x, y)) {
        filled = cornerFilled(x, y);
      } else {
        seed = (seed * 48271) % 2147483647;
        filled = seed % 2 === 0;
      }
      if (filled) squares.push(<rect key={x + "-" + y} x={x} y={y} width="1" height="1"></rect>);
    }
  }

  return (
    <svg
      className="qr-code"
      width={size || 140}
      height={size || 140}
      viewBox="-1 -1 23 23"
      aria-label={"QR code " + value}
    >
      <rect x="-1" y="-1" width="23" height="23" fill="#fff"></rect>
      <g fill="#111">{squares}</g>
    </svg>
  );
}

export default QrCode;
