// 支付方式圓餅圖
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const PaymentPieChart = ({ data, loading = false }) => {
  const colors = ['#6FA9BB', '#94B38A', '#c7916d'];

  return (
    <div className='card adm__report-card h-100'>
      <div className='card-body'>
        <h5 className='card-title mb-4'>支付方式分布</h5>
        {loading ? (
          <>
            <div className='list-group list-group-flush'>
              <div className='d-flex flex-column justify-content-center align-items-center'>
                <div
                  className='spinner-border spinner-border-sm text-primary'
                  role='status'
                >
                  <span className='visually-hidden'>載入中...</span>
                </div>
                <p className='fs-sm text-brown-300 mt-2'>正在載入資料...</p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* 圓餅圖區 */}
            <ResponsiveContainer width='100%' height={350}>
              <PieChart>
                <Pie
                  data={data}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={70}
                  fill='#C54F2D'
                  dataKey='value'
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `NT$ ${value.toLocaleString()}`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentPieChart;
