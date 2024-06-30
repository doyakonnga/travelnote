import Chart from "@/components/chart"


const BalancesPage = () => {
  const data = [
    { name: 'Chang', amount: 2000 },
    { name: 'Shogeko', amount: -1000 },
    { name: 'Sakutan', amount: -1000 }
  ]

  return (
    <div>
      <Chart data={data} />
    </div>
  )
}

export default BalancesPage
