import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Activity, CheckCircle, Send } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [estadoSuscripcion, setEstadoSuscripcion] = useState("idle"); // idle, enviando, exito, error

  const manejarSuscripcion = async (e) => {
    e.preventDefault();
    setEstadoSuscripcion("enviando");

    try {
      const resp = await fetch('http://127.0.0.1:8000/api/suscribir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (resp.ok) {
        setEstadoSuscripcion("exito");
        setEmail(""); // Limpiar campo
        setTimeout(() => setEstadoSuscripcion("idle"), 5000); // Resetear mensaje a los 5 seg
      } else {
        setEstadoSuscripcion("error");
      }
    } catch (error) {
      console.error(error);
      setEstadoSuscripcion("error");
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-blue-900/20">
      <div className="max-w-4xl mx-auto text-center bg-slate-800/80 backdrop-blur-md border border-slate-700 p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Brillo decorativo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-300 rounded-full text-sm font-bold mb-6 border border-blue-500/20">
          <Mail size={16} /> Newsletter Botbi
        </div>

        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          Recibe el Resumen Inteligente
        </h2>
        <p className="text-slate-400 mb-8 text-lg max-w-2xl mx-auto">
          La IA selecciona automáticamente las 2 noticias más críticas del día (Tecnología y Negocios) y te las envía listas para leer en la bandeja de entrada.
        </p>
        
        <form onSubmit={manejarSuscripcion} className="flex flex-col md:flex-row gap-4 justify-center max-w-lg mx-auto">
          <div className="flex-1 relative">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com" 
              required
              disabled={estadoSuscripcion === "enviando" || estadoSuscripcion === "exito"}
              className="w-full px-6 py-4 rounded-xl bg-slate-900 border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition text-white placeholder-slate-500"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={estadoSuscripcion === "enviando" || estadoSuscripcion === "exito"}
            className={`px-8 py-4 rounded-xl font-bold shadow-lg transition flex items-center justify-center gap-2 min-w-[180px]
              ${estadoSuscripcion === "exito" 
                ? "bg-green-600 hover:bg-green-700 text-white shadow-green-500/25" 
                : "bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 text-white shadow-blue-500/25"}
            `}
          >
            {estadoSuscripcion === "enviando" ? (
              <Activity className="animate-spin" />
            ) : estadoSuscripcion === "exito" ? (
              <>Enviado <CheckCircle size={20}/></>
            ) : (
              <>Suscribirme <Send size={20}/></>
            )}
          </button>
        </form>

        {estadoSuscripcion === "exito" && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-green-400 mt-4 font-medium"
          >
            ¡Listo! Revisa tu correo (incluso Spam) para ver tu resumen. 
          </motion.p>
        )}

        {estadoSuscripcion === "error" && (
          <p className="text-red-400 mt-4 text-sm">
            Hubo un problema al enviar. Asegúrate de que el backend esté corriendo.
          </p>
        )}

        <p className="text-xs text-slate-500 mt-6">
          El correo se usa solo para el demo de este Hackathon.
        </p>
      </div>
    </section>
  );
}
