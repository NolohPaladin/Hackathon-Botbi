import { motion } from 'framer-motion';
import { Globe, ExternalLink } from 'lucide-react';

export default function NewsCard({ item }) {
  return (
    <motion.article 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl hover:border-blue-500/50 transition-all shadow-xl hover:shadow-blue-500/10 group flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${item.categoria === 'Negocios' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
          {item.categoria}
        </span>
        <span className="text-xs text-slate-500 flex items-center gap-1">
          <Globe size={12}/> {item.fuente}
        </span>
      </div>

      <h3 className="text-xl font-bold mb-3 text-slate-100 leading-tight group-hover:text-blue-300 transition-colors">
        {item.titulo}
      </h3>
      <p className="text-slate-400 text-sm mb-6 leading-relaxed flex-grow">
        {item.contenido}
      </p>

      <div className="pt-4 border-t border-slate-700/50 flex justify-between items-center mt-auto">
        <span className="text-xs text-slate-500">{item.fecha}</span>
        <a 
          href={item.url_original} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-white transition-colors bg-blue-600/10 hover:bg-blue-600 px-3 py-2 rounded-lg"
        >
          Leer Fuente <ExternalLink size={14} />
        </a>
      </div>
    </motion.article>
  );
}
