interface StatCardProps {
  titulo: string;
  valor: number | string;
  subtitulo?: string;
  cor?: 'blue' | 'green' | 'purple' | 'orange';
  icon?: React.ReactNode;
}

export function StatCard({ titulo, valor, subtitulo, cor = 'blue', icon }: StatCardProps) {
  const cores = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    orange: 'bg-orange-50 border-orange-200 text-orange-600',
  };

  return (
    <div className={`${cores[cor]} border-2 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 animate-in`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-gray-700 font-semibold text-sm">{titulo}</h3>
        {icon && <div className={`${cor}`}>{icon}</div>}
      </div>
      <p className="text-3xl font-bold text-gray-900">{valor}</p>
      {subtitulo && <p className="text-xs text-gray-500 mt-2">{subtitulo}</p>}
    </div>
  );
}
