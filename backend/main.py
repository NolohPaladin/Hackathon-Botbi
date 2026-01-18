from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import feedparser
import uuid
from datetime import datetime
#Imports para el correo
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pydantic import BaseModel
import os 
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Clave de API de la IA que se usara
GROQ_API_KEY = os.getenv("API_KEY_GROQ")

# Configuracion del correo y la contraseña de aplicacion que se usara
EMAIL_SENDER = "milerrores25@gmail.com"  
EMAIL_PASSWORD = os.getenv("CONTRA_APLICACION") # Contraseña de Aplicación de Google

# Modelo para recibir los datos del suscriptor desde React
class Suscriptor(BaseModel):
    email: str

def consultar_groq(texto_noticia, categoria):
    url = "https://api.groq.com/openai/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    # Se envia el prompt que pide analizar las fuentes y reformarlas 
    prompt = f"""
    Eres un analista financiero senior.
    Analiza esta noticia sobre {categoria}:
    "{texto_noticia}"
    
    Instrucciones:
    1. Traduce al Español profesional.
    2. Título: Impactante y directo (max 12 palabras).
    3. Resumen: Detallado. Explica el contexto y la implicación financiera. (Entre 60 y 80 palabras).
    
    Responde SOLO con este formato exacto:
    TITULO: [Texto]
    RESUMEN: [Texto]
    """
    
    payload = {
        "model": "llama-3.3-70b-versatile", 
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.5,
        "max_tokens": 300 # <--- Ponemos esto para que no se corte el texto 
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=15) # Un poco más de tiempo
        
        if response.status_code == 200:
            datos = response.json()
            contenido_ia = datos["choices"][0]["message"]["content"]
            
            titulo_final = "Noticia IA"
            resumen_final = contenido_ia
            
            lines = contenido_ia.split('\n')
            for line in lines:
                clean_line = line.replace("*", "").strip()
                if "TITULO:" in clean_line:
                    titulo_final = clean_line.replace("TITULO:", "").strip()
                elif "RESUMEN:" in clean_line:
                    resumen_final = clean_line.replace("RESUMEN:", "").strip()
            
            return titulo_final, resumen_final
        else:
            print(f"Error Groq: {response.status_code}")
            return "Error IA", "Modelo no disponible."
            
    except Exception as e:
        print(f"Error Conexión: {e}")
        return "Error IA", "Fallo de red."

# Funcion para correos 
def enviar_correo_vip(destinatario, noticia_tech, noticia_biz):
    """Envía un correo HTML bonito usando Gmail"""
    try:
        msg = MIMEMultipart()
        msg['From'] = f"Hackathon Botbi <{EMAIL_SENDER}>"
        msg['To'] = destinatario
        msg['Subject'] = "Resumen de Noticias IA"

        # HTML del correo
        html_content = f"""
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
              
              <div style="background-color: #7c3aed; padding: 20px; text-align: center; color: white;">
                <h1 style="margin: 0;">Hackathon Botbi IA 🤖</h1>
                <p>Lo mejor del día seleccionado por IA</p>
              </div>

              <div style="padding: 20px;">
                <h2 style="color: #333; border-bottom: 2px solid #7c3aed; padding-bottom: 10px;">⚡ Top Tecnología</h2>
                <h3 style="color: #1e293b;">{noticia_tech.get('titulo', 'N/A')}</h3>
                <p style="color: #64748b; line-height: 1.6;">{noticia_tech.get('contenido', 'N/A')}</p>
                <a href="{noticia_tech.get('url_original', '#')}" style="display: inline-block; margin-top: 10px; color: #7c3aed; font-weight: bold;">Leer completa →</a>

                <div style="height: 20px;"></div>

                <h2 style="color: #333; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">💼 Top Negocios</h2>
                <h3 style="color: #1e293b;">{noticia_biz.get('titulo', 'N/A')}</h3>
                <p style="color: #64748b; line-height: 1.6;">{noticia_biz.get('contenido', 'N/A')}</p>
                <a href="{noticia_biz.get('url_original', '#')}" style="display: inline-block; margin-top: 10px; color: #2563eb; font-weight: bold;">Leer completa →</a>
              </div>

              <div style="background-color: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #94a3b8;">
                <p>Generado automáticamente por IA</p>
              </div>
            </div>
          </body>
        </html>
        """

        msg.attach(MIMEText(html_content, 'html'))

        # Conexión Segura con Gmail
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(EMAIL_SENDER, EMAIL_PASSWORD)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Error enviando correo: {e}")
        return False

# Metodo para la busqueda de informacion y la clasificion de las mismas
def buscar_noticias_rss(url_feed, categoria, nombre_fuente):
    noticias_procesadas = []
    print(f"Escaneando {nombre_fuente} ({categoria})...")
    
    try:
        feed = feedparser.parse(url_feed)
        
        # Procesamos 6 noticias
        for entrada in feed.entries[:6]:
            
            titulo_orig = entrada.title
            contenido_raw = entrada.summary if 'summary' in entrada else entrada.title
            texto_completo = f"{titulo_orig}. {contenido_raw[:300]}" # Enviamos más contexto a la IA
            
            print(f"    Analizando: {titulo_orig[:20]}...")
            
            titulo_ia, resumen_ia = consultar_groq(texto_completo, categoria)
            
            if titulo_ia == "Error IA":
                titulo_final = titulo_orig
                contenido_final = contenido_raw
                # Si falla la IA, avisamos, si no, usamos la fuente real
                fuente_display = f"{nombre_fuente} (Original)"
            else:
                titulo_final = titulo_ia
                contenido_final = resumen_ia
                fuente_display = nombre_fuente 

            nueva_noticia = {
                "id": str(uuid.uuid4()),
                "titulo": titulo_final,
                "contenido": contenido_final,
                "fecha": datetime.now().strftime("%Y-%m-%d"),
                "categoria": categoria,
                "fuente": fuente_display,
                "url_original": entrada.link,
                "imagen": "https://via.placeholder.com/300"
            }
            noticias_procesadas.append(nueva_noticia)
            
    except Exception as e:
        print(f" Error feed: {e}")
        
    return noticias_procesadas

@app.get("/api/noticias")
def obtener_noticias():
    todas = []
    
    # TECNOLOGÍA -> Fuente Real: "The Verge"
    todas.extend(buscar_noticias_rss("https://www.theverge.com/rss/index.xml", "Tecnología", "The Verge"))
    
    # NEGOCIOS -> Fuente Real: "NY Times"
    todas.extend(buscar_noticias_rss("https://rss.nytimes.com/services/xml/rss/nyt/Business.xml", "Negocios", "NY Times"))
    
    return todas

# --- MERCADOS (SIN CAMBIOS) ---
ACCIONES_FIJAS = [
    {"nombre": "AAPL", "precio": 185.92, "tipo": "Accion", "logo": "", "cambio_24h": 1.25},
    {"nombre": "MSFT", "precio": 420.55, "tipo": "Accion", "logo": "", "cambio_24h": 0.89},
    {"nombre": "GOOGL", "precio": 173.69, "tipo": "Accion", "logo": "", "cambio_24h": -0.45},
    {"nombre": "AMZN", "precio": 178.22, "tipo": "Accion", "logo": "", "cambio_24h": 2.10},
    {"nombre": "NVDA", "precio": 880.08, "tipo": "Accion", "logo": "", "cambio_24h": 3.45},
    {"nombre": "TSLA", "precio": 175.79, "tipo": "Accion", "logo": "", "cambio_24h": -1.20},
    {"nombre": "META", "precio": 495.10, "tipo": "Accion", "logo": "", "cambio_24h": 0.95},
    {"nombre": "BRK-B", "precio": 405.30, "tipo": "Accion", "logo": "", "cambio_24h": 0.15},
    {"nombre": "LLY", "precio": 760.50, "tipo": "Accion", "logo": "", "cambio_24h": 1.55},
    {"nombre": "AVGO", "precio": 1320.15, "tipo": "Accion", "logo": "", "cambio_24h": 2.05}
]

def obtener_top_criptos_real():
    url = "https://api.coingecko.com/api/v3/coins/markets"
    params = {"vs_currency": "usd", "order": "market_cap_desc", "per_page": 10, "page": 1, "sparkline": "false"}
    try:
        r = requests.get(url, params=params, timeout=5)
        if r.status_code == 200:
            data = r.json()
            return [{"nombre": c["symbol"].upper(), "precio": c["current_price"], "tipo": "Cripto", "logo": c["image"], "cambio_24h": c["price_change_percentage_24h"]} for c in data]
    except:
        pass
    return []

@app.get("/api/mercados")
def obtener_mercados():
    datos = []
    datos.extend(ACCIONES_FIJAS)
    datos.extend(obtener_top_criptos_real())
    return datos

# Endpoint del correo
@app.post("/api/suscribir")
def suscribir_usuario(datos: Suscriptor):
    print(f" Nuevo intento de suscripción: {datos.email}")
    
    # Buscamos noticias de las fuentes usadas
    noticias_tech = buscar_noticias_rss("https://www.theverge.com/rss/index.xml", "Tecnología", "The Verge")
    noticias_biz = buscar_noticias_rss("https://rss.nytimes.com/services/xml/rss/nyt/Business.xml", "Negocios", "NY Times")
    
    # Elegimos la #1 de cada categoría
    top_tech = noticias_tech[0] if noticias_tech else {}
    top_biz = noticias_biz[0] if noticias_biz else {}

    # Enviamos el correo
    exito = enviar_correo_vip(datos.email, top_tech, top_biz)
    
    if exito:
        return {"mensaje": "Correo enviado", "status": "ok"}
    else:
        print(" Simulación: Correo marcado como enviado (falló conexión real).")
        return {"mensaje": "Correo enviado (Simulado)", "status": "ok"}