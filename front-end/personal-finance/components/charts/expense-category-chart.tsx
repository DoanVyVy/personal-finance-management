import ReactECharts from 'echarts-for-react'

export default function ExpenseCategoryChart() {
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: ${c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 10,
      data: ['Housing', 'Transportation', 'Food', 'Utilities', 'Healthcare', 'Entertainment', 'Other']
    },
    series: [
      {
        name: 'Expense Categories',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '30',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1500, name: 'Housing' },
          { value: 500, name: 'Transportation' },
          { value: 800, name: 'Food' },
          { value: 300, name: 'Utilities' },
          { value: 400, name: 'Healthcare' },
          { value: 300, name: 'Entertainment' },
          { value: 200, name: 'Other' }
        ]
      }
    ]
  }

  return <ReactECharts option={option} style={{ height: '400px' }} />
}

