# SalesIQ UCSC — Evaluador de Ventas con IA

Simulador de compradores con Inteligencia Artificial para evaluar habilidades de venta de estudiantes.

## 🚀 Cómo publicar en Vercel (paso a paso)

### Requisitos previos
- Cuenta en [GitHub](https://github.com) (gratis)
- Cuenta en [Vercel](https://vercel.com) (gratis)

---

### Paso 1 — Sube el proyecto a GitHub

1. Ve a [github.com](https://github.com) → haz clic en **"New repository"**
2. Nombre: `salesiq-ucsc` → clic en **"Create repository"**
3. En tu computador, abre la carpeta `salesiq-ucsc` que descargaste
4. Abre una terminal en esa carpeta y ejecuta:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/salesiq-ucsc.git
git push -u origin main
```

> ⚠️ Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub.

---

### Paso 2 — Despliega en Vercel

1. Ve a [vercel.com](https://vercel.com) → inicia sesión con GitHub
2. Haz clic en **"Add New Project"**
3. Selecciona el repositorio `salesiq-ucsc`
4. Vercel detecta automáticamente que es un proyecto Vite/React
5. Haz clic en **"Deploy"** → espera ~1 minuto

¡Listo! Vercel te dará una URL como:
```
https://salesiq-ucsc.vercel.app
```

---

### Paso 3 — Comparte con estudiantes

Comparte esa URL directamente. Funciona en cualquier navegador, sin instalar nada.

---

## ⚙️ Personalización

| Qué cambiar | Dónde |
|-------------|-------|
| Logo | Reemplaza `src/assets/logo-ucsc.png` |
| Perfiles de compradores | `src/App.jsx` → función `PROFILES()` |
| Color institucional | Panel de ajustes dentro de la app |
| Textos / traducciones | `src/App.jsx` → objeto `T` |

---

## 📋 Características

- ✅ 7 perfiles de compradores con personalidades distintas
- ✅ Evaluación en tiempo real con probabilidad de compra
- ✅ Feedback por fortalezas, debilidades y recomendaciones
- ✅ Gráfico de evolución de la evaluación
- ✅ Calificación final A/B/C/D
- ✅ Bilingüe: Español / English
- ✅ Color de acento personalizable
- ✅ Logo institucional UCSC
- ✅ Diseño responsive (funciona en móvil)

---

## 🛠 Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173)
