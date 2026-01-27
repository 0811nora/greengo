// 銷售趨勢折線圖
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SalesTrendChart = ({ data }) => {
  return (
    <div className="card adm__report-card h-100">
      <div className="card-body">
        <h5 className="card-title mb-4">銷售趨勢圖</h5>

        {/* 圖表區 */}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            {/* 網格 */}
            <CartesianGrid strokeDasharray="3 3" />
            {/* X 軸（時間） */}
            <XAxis
              dataKey="time"
              label={{ value: "時", position: "insideBottomRight", offset: -5 }}
            />
            {/* Y 軸（金額） */}
            <YAxis
              label={{ value: "金額", angle: -90, position: "insideLeft" }}
            />

            {/* 滑鼠提示 */}
            <Tooltip formatter={(value) => `NT$ ${value.toLocaleString()}`} />

            {/* 顯示圖例區----- */}
            <Legend />

            {/* 折線區 */}
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#C54F2D"
              strokeWidth={2}
              name="營業額"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="cash"
              stroke="#94B38A"
              strokeWidth={2}
              name="現金"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="creditCard"
              stroke="#6FA9BB"
              strokeWidth={2}
              name="信用卡"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesTrendChart;
