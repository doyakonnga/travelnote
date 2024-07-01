'use client'

import { useMemo, useState } from "react";
import { BarChart, Bar, Cell, ResponsiveContainer, XAxis, YAxis, Text } from "recharts";
import { Props } from "recharts/types/component/Text";
import { ArrowUpDown } from "./svg";
import { randomBytes } from "crypto";
import Alert from "./alert";


const BAR_AXIS_SPACE = 10;

// const YAxisLeftTick = ({ y, payload: { value } }: any) => {
// return (
//   <Text x={0} y={y} textAnchor="start" verticalAnchor="middle" scaleToFit>
//     {value}
//   </Text>
// );
// };

type Data = { name: string, amount: number }[]
type BalanceArrays = {
  domestic: Data,
  foreign: Data
}

const Chart = ({ data }: { data: Data }) => {
  return (
    <ResponsiveContainer width={"90%"} height={50 * data.length} debounce={50}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 30, right: 50 + BAR_AXIS_SPACE }}
      >
        <XAxis axisLine={true} type="number" />
        <YAxis
          yAxisId={0}
          dataKey='name'
          type="category"
          axisLine={false}
          tickLine={false}
        // tick={YAxisLeftTick}
        />
        <YAxis
          orientation="right"
          yAxisId={1}
          dataKey='amount'
          type="category"
          axisLine={false}
          tickLine={false}
          tickFormatter={value => value.toLocaleString()}
          mirror
          tick={{
            transform: `translate(${50 + BAR_AXIS_SPACE}, 0)`
          }}
        />
        <Bar dataKey='amount' minPointSize={2} barSize={32}>
          {data.map((d) => {
            return <Cell key={d.name} fill={d.amount < 0 ? 'palevioletred' : 'mediumseagreen'} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}


const Charts = ({ balanceArrays, defaultRate }: {
  balanceArrays: BalanceArrays;
  defaultRate: number
}) => {
  const [exchangeRate, setExchangeRate] = useState(defaultRate || 0)
  // 0: original | 1: to domestic | 2: to foreign
  const [convertOption, setConvertOption] = useState<0 | 1 | 2>(0)
  const [err, setErr] = useState<{ id: string, msg: string } | null>(null)

  let domestic: Data = balanceArrays.domestic
  let foreign: Data = balanceArrays.foreign
  if (convertOption === 1) {
    domestic = balanceArrays.domestic.map((b, i) => ({
      name: b.name,
      amount: b.amount + balanceArrays.foreign[i].amount * exchangeRate
    }))
    foreign = balanceArrays.foreign.map(b => ({ ...b, amount: 0 }))
  } else if (convertOption === 2) {
    domestic = balanceArrays.domestic.map(b => ({ ...b, amount: 0 }))
    foreign = balanceArrays.foreign.map((b, i) => ({
      name: b.name,
      amount: b.amount + balanceArrays.domestic[i].amount / exchangeRate
    }))
  }

  return (
    <div className="flex flex-col items-center w-full p-2 gap-2">
      <div className="w-full">
        <h1>Domestic: </h1>
        <Chart data={domestic} />
      </div>
      <div>
        <label htmlFor="exchane-rate">Default exchange rate: </label>
        <input type="text" id="exchane-rate" value={exchangeRate || ''}
          onChange={e => {
            setConvertOption(0)
            setExchangeRate(Number(e.target.value) || 0)
          }} />
        <ArrowUpDown className="inline" onClick={() => {
          if (convertOption !== 2 && exchangeRate === 0) {
            setErr({
              id: randomBytes(4).toString(),
              msg: 'Please input default exchange rate'
            })
            setConvertOption(0)
          }
          setConvertOption(p => (p + 1) % 3 as (0 | 1 | 2))
        }} />
      </div>
      {err && <Alert color="red" id={err.id}>{err.msg}</Alert>}
      <div className="w-full">
        <h1>Foreign: </h1>
        <Chart data={foreign} />
      </div>
    </div>
  )
}

export default Charts
