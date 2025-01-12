import ReactECharts from 'echarts-for-react'

export default function InvestmentPerformanceChart() {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    legend: {
      data: ['Stocks', 'Bonds', 'Real Estate', 'Crypto']
    },
    xAxis: [
      {
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: 'Value',
        min: 0,
        max: 10000,
        interval: 2000,
        axisLabel: {
          formatter: '${value}'
        }
      }
    ],
    series: [
      {
        name: 'Stocks',
        type: 'bar',
        data: [3200, 3300, 3400, 3500, 3700, 3900, 4100, 4300, 4500, 4700, 4900, 5100]
      },
      {
        name: 'Bonds',
        type: 'bar',
        data: [2000, 2050, 2100, 2150, 2200, 2250, 2300, 2350, 2400, 2450, 2500, 2550]
      },
      {
        name: 'Real Estate',
        type: 'bar',
        data: [1500, 1550, 1600, 1650, 1700, 1750, 1800, 1850, 1900, 1950, 2000, 2050]
      },
      {
        name: 'Crypto',
        type: 'bar',
        data: [500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600]
      }
    ]
  }

  return <ReactECharts option={option} style={{ height: '400px' }} />
}

