import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
interface ProgressChartProps {
  data: Array<{ data: string; carga: number; repeticoes: number }>;
  exercicio: string;
}
export function ProgressChart({ data, exercicio }: ProgressChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4">Progresso: {exercicio}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="data" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="carga" fill="#3b82f6" name="Carga (kg)" />
          <Bar dataKey="repeticoes" fill="#10b981" name="Repetições" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
