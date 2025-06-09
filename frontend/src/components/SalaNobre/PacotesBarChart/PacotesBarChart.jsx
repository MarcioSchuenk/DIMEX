import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LabelList,
} from "recharts";
import styles from "./styles.module.scss";

export const PacotesBarChart = ({ dadosPorHora }) => (
  <div className={styles.container}>
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={dadosPorHora}
        margin={{ top: 30, right: 15, left: -15, bottom: 0 }}
        className={styles.chart}
      >
        <CartesianGrid stroke="none" />
        <XAxis
          dataKey="hora"
          interval={0}
          angle={-90}
          textAnchor="end"
          height={80}
          stroke="#ccc"
          tick={{ fill: "#ccc", fontSize: 18 }}
        />
        <YAxis
          domain={[0, "dataMax + 10"]}
          interval={0}
          tickCount={10}
          stroke="#ccc"
          tick={{ fill: "#ccc", fontSize: 18 }}
        />

        <Tooltip
          contentStyle={{
            backgroundColor: "#007a50",
            color: "#ffffff",
            border: "none",
          }}
          labelStyle={{ color: "#ffffff" }}
          itemStyle={{ color: "#ffffff" }}
          cursor={{ fill: "#7700FF25" }}
        />
        <Legend wrapperStyle={{ color: "#ffffff" }} />
        <Bar
          dataKey="pacotes"
          fill="#00c17c"
          name="Pacotes por hora"
          className={styles.bar}
        >
          <LabelList
            dataKey="pacotes"
            position="top"
            content={({ x, y, value, width }) =>
              value > 0 ? (
                <text
                  x={x + width / 2}
                  y={y - 5}
                  fill="#ffffff"
                  textAnchor="middle"
                  fontSize={17}
                >
                  {value}
                </text>
              ) : null
            }
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);
