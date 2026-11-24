import { Fragment } from 'react';
import Icon from '../common/Icon.jsx';

/**
 * Stepper — "① Organization —— ② Documents —— ③ Review".
 * Finished steps show a green check, the current step is white, later steps are grey.
 */
export default function Stepper({ steps, current }) {
  return (
    <ol className="stepper" aria-label="Progress">
      {steps.map((label, i) => {
        const state = i < current ? 'done' : i === current ? 'current' : 'todo';
        return (
          <Fragment key={label}>
            {i > 0 && <li className="stepper-line" aria-hidden="true" />}
            <li className={`stepper-step ${state}`} aria-current={state === 'current' ? 'step' : undefined}>
              <span className="stepper-dot">{state === 'done' ? <Icon name="check" size={13} strokeWidth={2.6} /> : i + 1}</span>
              <span className="stepper-label">{label}</span>
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}
