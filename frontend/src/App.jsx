import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, TrendingUp, ExternalLink, Activity, Globe, Bitcoin, Mail, CheckCircle, Send } from 'lucide-react';

function App() {
  const [noticias, setNoticias] = useState([]);
  const [mercados, setMercados] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // Estados para el formulario de suscripción
  const [email, setEmail] = useState("");
  const [estadoSuscripcion, setEstadoSuscripcion] = useState("idle"); // idle, enviando, exito, error

  // Conexion con el backend
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar Noticias
        const respNoticias = await fetch('http://127.0.0.1:8000/api/noticias');
        const dataNoticias = await respNoticias.json();
        setNoticias(dataNoticias);

        // Cargar Mercados
        const respMercados = await fetch('http://127.0.0.1:8000/api/mercados');
        const dataMercados = await respMercados.json();
        setMercados(dataMercados);
        
        setCargando(false);
      } catch (error) {
        console.error("Error cargando datos:", error);
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  // Manejo de suscripcion de correo
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

  // Filtros de mercados
  const acciones = mercados.filter(item => item.tipo === "Accion");
  const criptos = mercados.filter(item => item.tipo === "Cripto");

  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-purple-500 selection:text-white font-sans">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity className="text-purple-400 w-8 h-8" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Botbi Finance 
            </span>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-300">
            <a href="#hero" className="hover:text-purple-400 transition">Inicio</a>
            <a href="#mercados" className="hover:text-purple-400 transition">Mercados</a>
            <a href="#noticias" className="hover:text-purple-400 transition">Noticias</a>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section id="hero" className="relative pt-40 pb-10 px-4 text-center overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] -z-10"></div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight"
        >
          Aplicacion de <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
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

      {/* --- ZONA DE MERCADOS (DOBLE TICKER) --- */}
      <div id="mercados" className="flex flex-col gap-1 pb-10">
        
        {/* CINTA 1: ACCIONES */}
        <div className="bg-slate-950/50 border-y border-slate-800 py-3 overflow-hidden flex relative">
           <div className="animate-marquee whitespace-nowrap flex gap-10 items-center min-w-full">
            <span className="text-blue-400 font-bold px-4 border-r border-slate-700 flex items-center gap-2">
              <TrendingUp size={18}/> ACCIONES
            </span>
            {[...acciones, ...acciones].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
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
              <div key={index} className="flex items-center gap-3">
                 {item.logo && <img src={item.logo} className="w-5 h-5 rounded-full" />}
                 <span className="font-bold text-lg text-slate-300">{item.nombre}</span>
                 <span className={`text-base font-mono ${item.cambio_24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                   ${item.precio.toLocaleString()}
                 </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- SECCIÓN DE NOTICIAS --- */}
      <section id="noticias" className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-12">
          <Newspaper className="text-purple-400 w-8 h-8" />
          <h2 className="text-3xl font-bold">Top 10 Noticias Relevantes (IA Selection)</h2>
        </div>

        {cargando ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 animate-pulse">
            <Activity className="w-12 h-12 mb-4 text-purple-500 animate-spin"/>
            <p className="text-xl">Consultando fuentes globales...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {noticias.map((item) => (
              <motion.article 
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl hover:border-purple-500/50 transition-all shadow-xl hover:shadow-purple-500/10 group flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full border ${item.categoria === 'Negocios' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'}`}>
                    {item.categoria}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Globe size={12}/> {item.fuente}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-3 text-slate-100 leading-tight group-hover:text-purple-300 transition-colors">
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
                    className="flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-white transition-colors bg-purple-500/10 hover:bg-purple-500 px-3 py-2 rounded-lg"
                  >
                    Leer Fuente <ExternalLink size={14} />
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      {/* --- SECCIÓN DE SUSCRIPCIÓN (NEWSLETTER) --- */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center bg-slate-800/80 backdrop-blur-md border border-slate-700 p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
          {/* Brillo decorativo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-300 rounded-full text-sm font-bold mb-6 border border-purple-500/20">
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
                className="w-full px-6 py-4 rounded-xl bg-slate-900 border border-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition text-white placeholder-slate-500"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={estadoSuscripcion === "enviando" || estadoSuscripcion === "exito"}
              className={`px-8 py-4 rounded-xl font-bold shadow-lg transition flex items-center justify-center gap-2 min-w-[180px]
                ${estadoSuscripcion === "exito" 
                  ? "bg-green-600 hover:bg-green-700 text-white shadow-green-500/25" 
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-purple-500/25"}
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

      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 py-10 text-center text-slate-600 text-sm border-t border-slate-800">
        <p>© 2026 Hackathon Botbi. Manuel Mijares Lara.</p>
      </footer>
    </div>
  );
}

export default App;