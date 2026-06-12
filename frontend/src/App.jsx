import { useState, useEffect } from 'react';
import { Activity, Newspaper } from 'lucide-react';

// Importar componentes modulares
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MarketTicker from './components/MarketTicker';
import NewsCard from './components/NewsCard';
import Newsletter from './components/Newsletter';
import ErrorMessage from './components/ErrorMessage';

function App() {
  const [noticias, setNoticias] = useState([]);
  const [mercados, setMercados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos del backend de forma concurrente
  const cargarDatos = async () => {
    setCargando(true);
    setError(null);
    try {
      const [respNoticias, respMercados] = await Promise.all([
        fetch('http://127.0.0.1:8000/api/noticias'),
        fetch('http://127.0.0.1:8000/api/mercados')
      ]);

      if (!respNoticias.ok || !respMercados.ok) {
        throw new Error("El servidor respondió con un código de error.");
      }

      const dataNoticias = await respNoticias.json();
      const dataMercados = await respMercados.json();

      setNoticias(dataNoticias);
      setMercados(dataMercados);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError("No se pudieron cargar los datos financieros de las fuentes globales. Por favor, asegúrate de que el backend esté ejecutándose en http://127.0.0.1:8000.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-blue-600 selection:text-white font-sans">
      
      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <Hero />

      {/* ZONA DE MERCADOS (DOUBLE TICKER) */}
      {!cargando && !error && <MarketTicker mercados={mercados} />}

      {/* SECCIÓN DE NOTICIAS */}
      <section id="noticias" className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-12">
          <Newspaper className="text-blue-500 w-8 h-8" />
          <h2 className="text-3xl font-bold">Top 10 Noticias Relevantes (IA Selection)</h2>
        </div>

        {cargando ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 animate-pulse">
            <Activity className="w-12 h-12 mb-4 text-blue-500 animate-spin"/>
            <p className="text-xl">Consultando fuentes globales...</p>
          </div>
        ) : error ? (
          <ErrorMessage mensaje={error} alReintentar={cargarDatos} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {noticias.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* SECCIÓN DE SUSCRIPCIÓN (NEWSLETTER) */}
      <Newsletter />

      {/* FOOTER */}
      <footer className="bg-slate-950 py-10 text-center text-slate-600 text-sm border-t border-slate-800">
        <p>© 2026 Hackathon Botbi. Manuel Mijares Lara.</p>
      </footer>
    </div>
  );
}

export default App;