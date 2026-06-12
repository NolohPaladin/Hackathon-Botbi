import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({ mensaje, alReintentar }) {
  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-red-500/10 border border-red-500/30 rounded-2xl text-center shadow-xl backdrop-blur-sm">
      <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4 animate-bounce" />
      <h3 className="text-xl font-bold text-red-200 mb-2">Conexión Incompleta</h3>
      <p className="text-slate-400 text-sm mb-6 leading-relaxed">
        {mensaje}
      </p>
      <button
        onClick={alReintentar}
        className="px-6 py-3 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 mx-auto"
      >
        <RefreshCw size={18} />
        Reintentar conexión
      </button>
    </div>
  );
}
