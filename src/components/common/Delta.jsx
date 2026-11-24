import Icon from "./Icon";

/* Delta — green (up) or red (down) line under a number. value: a percent or a text. */
function Delta({ value, suffix }) {
  const up = typeof value === "number" ? value >= 0 : true;
  let text = value;
  if (suffix) text = (up ? "+" : "") + value + "% " + suffix;
  return (
    <span className={up ? "delta delta-up" : "delta delta-down"}>
      <Icon name={up ? "trendUp" : "trendDown"} size={13}></Icon>
      {text}
    </span>
  );
}

export default Delta;
