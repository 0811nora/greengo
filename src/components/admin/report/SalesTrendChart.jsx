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
  const lineSettings = [
    {
      id: "cash",
      name: "現金",
      color: "#94B38A",
      index: 0,
      isTotal: false,
    },
    {
      id: "creditCard",
      name: "信用卡",
      color: "#6FA9BB",
      index: 1,
      isTotal: false,
    },
    {
      id: "ePayment",
      name: "電子支付",
      color: "#E8A87C",
      index: 2,
      isTotal: false,
    },
  ];

  const sortedLines = lineSettings.sort((a, b) => a.index - b.index);
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

            {/* 滑鼠移過去時提示 */}
            <Tooltip formatter={(value) => `NT$ ${value.toLocaleString()}`} />

            {/* 顯示圖例區----- */}
            <Legend />
            {/* 折線區 */}
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#C54F2D"
              strokeWidth={3}
              name="總營業額"
              dot={{ r: 5 }}
            />
            {/* 區隔總營業額跟付款方式 */}
            {sortedLines.map((setting) => (
              <Line
                key={setting.id}
                type="monotone"
                dataKey={setting.id}
                name={setting.name}
                stroke={setting.color}
                strokeWidth={setting.isTotal ? 3 : 2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesTrendChart;
