import Icon from './Icon.jsx';

/** Green/red trend line under a KPI. value: number (percent) or plain text. */
export default function Delta({ value, suffix }) {
  const up = typeof value === 'number' ? value >= 0 : true;
  return (
    <span className={`delta ${up ? 'delta-up' : 'delta-down'}`}>
      <Icon name={up ? 'trendUp' : 'trendDown'} size={13} />
      {suffix === undefined ? value : `${up ? '+' : ''}${value}% ${suffix}`}
    </span>
  );
}
