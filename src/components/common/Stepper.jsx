import Icon from "./Icon";

/*
 * Stepper — "① Tickets —— ② Your details —— ③ Payment".
 * Finished steps show a check, the current step is white, the next ones are grey.
 */
function Stepper({ steps, current }) {
  const items = [];
  steps.forEach((label, i) => {
    let state = "todo";
    if (i < current) state = "done";
    if (i === current) state = "current";
    if (i > 0) items.push(<li key={"line-" + i} className="stepper-line"></li>);
    items.push(
      <li key={label} className={"stepper-step " + state}>
        <span className="stepper-dot">
          {state === "done" ? <Icon name="check" size={13} strokeWidth={2.6}></Icon> : i + 1}
        </span>
        <span className="stepper-label">{label}</span>
      </li>,
    );
  });
  return <ol className="stepper">{items}</ol>;
}

export default Stepper;
