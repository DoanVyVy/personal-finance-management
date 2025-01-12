import ReactECharts from 'echarts-for-react'

export default function IncomeExpenseChart() {
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
    toolbox: {
      feature: {
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    legend: {
      data: ['Income', 'Expenses', 'Net']
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
        name: 'Amount',
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
        name: 'Income',
        type: 'bar',
        data: [5000, 5200, 5500, 5700, 6000, 6200, 6500, 6700, 7000, 7200, 7500, 7700]
      },
      {
        name: 'Expenses',
        type: 'bar',
        data: [4000, 4100, 4300, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100]
      },
      {
        name: 'Net',
        type: 'line',
        data: [1000, 1100, 1200, 1200, 1300, 1300, 1400, 1400, 1500, 1500, 1600, 1600]
      }
    ]
  }

  return <ReactECharts option={option} style={{ height: '400px' }} />
}

