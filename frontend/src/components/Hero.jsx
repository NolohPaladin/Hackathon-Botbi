import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section id="hero" className="relative pt-40 pb-10 px-4 text-center overflow-hidden">
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -z-10"></div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight"
      >
        Aplicacion de <br />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-500">
          Finanzas Inteligentes
        </span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-lg text-slate-400 max-w-2xl mx-auto mb-10"
      >
        La Inteligencia Artificial lee miles de noticias globales, las traduce y te resume lo vital para el interes de hoy.
      </motion.p>
    </section>
  );
}
