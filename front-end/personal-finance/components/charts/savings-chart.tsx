import ReactECharts from 'echarts-for-react'

export default function SavingsChart() {
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: ${c}'
    },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '${value}'
      }
    },
    series: [{
      data: [1000, 2100, 3300, 4600, 6000, 7500, 9100, 10800, 12600, 14500, 16500, 18600],
      type: 'line',
      smooth: true,
      areaStyle: {}
    }]
  }

  return <ReactECharts option={option} style={{ height: '400px' }} />
}

