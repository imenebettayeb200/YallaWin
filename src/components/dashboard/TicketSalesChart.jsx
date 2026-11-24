import { useState } from "react";
import Panel from "../common/Panel";
import BarChart from "./BarChart";
import RangeToggle from "./RangeToggle";
import { dailyTotals, formatNumber, percentChange, sumValues } from "../../utils";

/* 7 or 30 days (the demo data has 60 days of sales). */
const RANGES = { "7D": 7, "30D": 30 };

function TicketSalesChart({ sales }) {
  const [range, setRange] = useState("30D");
  const days = RANGES[range];
  const series = dailyTotals(sales, days, 0);
  const total = sumValues(series);
  const change = percentChange(total, sumValues(dailyTotals(sales, days, days)));

  return (
    <Panel
      className="chart-panel"
      title={`Ticket sales · last ${days} days`}
      actions={<RangeToggle options={Object.keys(RANGES)} value={range} onChange={setRange} />}
    >
      <p className="chart-total">
        {formatNumber(total)}{" "}
        <span className={change >= 0 ? "text-green" : "text-red"}>
          tickets {change >= 0 ? "+" : ""}
          {change}%
        </span>
      </p>
      <BarChart series={series} highlight={Math.max(1, Math.round(days / 6))} />
    </Panel>
  );
}

export default TicketSalesChart;
