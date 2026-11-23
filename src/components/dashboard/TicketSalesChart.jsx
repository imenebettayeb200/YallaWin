import { useMemo, useState } from 'react';
import Panel from '../common/Panel.jsx';
import BarChart from './BarChart.jsx';
import RangeToggle from './RangeToggle.jsx';
import { formatNumber, percentChange } from '../../utils/format.js';
import { dailyTotals, sumValues } from '../../utils/stats.js';

const RANGES = { '7D': 7, '30D': 30, '90D': 90 };

export default function TicketSalesChart({ sales }) {
  const [range, setRange] = useState('30D');
  const days = RANGES[range];
  const series = useMemo(() => dailyTotals(sales, days), [sales, days]);
  const total = sumValues(series);
  const change = percentChange(total, sumValues(dailyTotals(sales, days, days)));

  return (
    <Panel
      className="chart-panel"
      title={`Ticket sales · last ${days} days`}
      actions={<RangeToggle options={Object.keys(RANGES)} value={range} onChange={setRange} />}
    >
      <p className="chart-total">
        {formatNumber(total)}{' '}
        <span className={change >= 0 ? 'text-green' : 'text-red'}>
          tickets {change >= 0 ? '+' : ''}
          {change}%
        </span>
      </p>
      <BarChart series={series} highlight={Math.max(1, Math.round(days / 6))} />
    </Panel>
  );
}
