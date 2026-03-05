interface StatCardProps {
  titulo: string;
  valor: string | number;
  cor?: string;
}
export function StatCard({ titulo, valor, cor = 'blue' }: StatCardProps) {
  const cores = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
  };
  return (
    <div className={`${ cores[cor as keyof typeof cores]} border-l-4 p-6 rounded-lg shadow`}>
      <p className="text-gray-600 text-sm">{titulo}</p>
      <p className="text-3xl font-bold mt-2">{valor}</p>
    </div>
  );
}
