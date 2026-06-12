import { Activity } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity className="text-blue-500 w-8 h-8" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
            Botbi Finance 
          </span>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-slate-300">
          <a href="#hero" className="hover:text-blue-400 transition">Inicio</a>
          <a href="#mercados" className="hover:text-blue-400 transition">Mercados</a>
          <a href="#noticias" className="hover:text-blue-400 transition">Noticias</a>
        </div>
      </div>
    </nav>
  );
}
