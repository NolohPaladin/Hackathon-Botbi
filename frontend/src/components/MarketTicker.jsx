import { TrendingUp, Bitcoin } from 'lucide-react';

export default function MarketTicker({ mercados }) {
  const acciones = mercados.filter(item => item.tipo === "Accion");
  const criptos = mercados.filter(item => item.tipo === "Cripto");

  return (
    <div id="mercados" className="flex flex-col gap-1 pb-10">
      
      {/* CINTA 1: ACCIONES */}
      <div className="bg-slate-950/50 border-y border-slate-800 py-3 overflow-hidden flex relative">
         <div className="animate-marquee whitespace-nowrap flex gap-10 items-center min-w-full">
          <span className="text-blue-400 font-bold px-4 border-r border-slate-700 flex items-center gap-2">
            <TrendingUp size={18}/> ACCIONES
          </span>
          {[...acciones, ...acciones].map((item, index) => (
            <div key={`accion-${item.nombre}-${index}`} className="flex items-center gap-3">
               <span className="font-bold text-lg text-slate-200">{item.nombre}</span>
               <span className={`text-base font-mono ${item.cambio_24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                 ${item.precio.toLocaleString()}
               </span>
            </div>
          ))}
        </div>
      </div>

      {/* CINTA 2: CRIPTOS */}
      <div className="bg-black/40 border-b border-slate-800 py-3 overflow-hidden flex relative">
         <div className="animate-marquee whitespace-nowrap flex gap-10 items-center min-w-full" style={{ animationDuration: '30s' }}> 
          <span className="text-yellow-400 font-bold px-4 border-r border-slate-700 flex items-center gap-2">
            <Bitcoin size={18}/> CRYPTO
          </span>
          {[...criptos, ...criptos].map((item, index) => (
            <div key={`cripto-${item.nombre}-${index}`} className="flex items-center gap-3">
               {item.logo && <img src={item.logo} className="w-5 h-5 rounded-full" alt={item.nombre} />}
               <span className="font-bold text-lg text-slate-300">{item.nombre}</span>
               <span className={`text-base font-mono ${item.cambio_24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                 ${item.precio.toLocaleString()}
               </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
