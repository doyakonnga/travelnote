'use client'

import { useMemo } from "react";
import { BarChart, Bar, Cell, ResponsiveContainer, XAxis, YAxis, Text } from "recharts";

// let ctx: CanvasRenderingContext2D;
// const measureText14HelveticaNeue = (text: string) => {
//   if (!ctx) {
//     const ctx = document.createElement("canvas").getContext("2d");
//     if (ctx) ctx.font = "14px";
//   }
//   return ctx.measureText(text).width;
// };

const BAR_AXIS_SPACE = 10;

const YAxisLeftTick = ({ y, payload: { value } }: any) => {
  return (
    <Text x={0} y={y} textAnchor="start" verticalAnchor="middle" scaleToFit>
      {value}
    </Text>
  );
};

const Chart = ({ data }: { data: { name: string, amount: number }[] }) => {
  // const maxTextWidth = useMemo(() =>
  //   data.reduce((acc: number, cur): number => {
  //     const value = cur.amount;
  //     const width = measureText14HelveticaNeue(value.toLocaleString());
  //     return Math.max(width, acc)
  //   }, 0), [data]
  // );
  return (
    <ResponsiveContainer width={"100%"} height={50 * data.length} debounce={50}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 10, right: 50 + BAR_AXIS_SPACE }}
      >
        <XAxis axisLine={true} type="number" />
        <YAxis
          yAxisId={0}
          dataKey='name'
          type="category"
          axisLine={false}
          tickLine={false}
          tick={YAxisLeftTick}
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
            return <Cell key={d.name} fill={d.amount >= 0 ? 'green' : 'red'} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}


export default Chart
