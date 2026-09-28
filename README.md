# Cuentas Claras 💰

App para controlar tus gastos personales del mes, en **guaraníes (₲)** 🇵🇾.
Anotás lo que gastás, ves cuánto te queda del presupuesto y llevás el control de tus deudas, todo en un solo lugar.

👉 **Probala acá:** https://cuentas-claras-py.expo.app

> En el celular: abrí el link, tocá **Compartir → "Agregar a pantalla de inicio"** y queda instalada como una app.

---

## ✨ Qué hace

**Gastos y presupuesto**
- Presupuesto mensual: la app calcula sola cuánto te queda.
- Registrar, editar y borrar gastos con categoría, fecha y descripción.
- Gráfico de barras por categoría y "¿dónde más gastaste?".
- Ver los meses anteriores con su propio presupuesto.
- Categorías propias (Salud, Mascotas, lo que necesites).

**Deudas**
- Lo que **debés** y lo que **te deben**.
- En cuotas mensuales o con una fecha límite.
- Registrar pagos y cobros, con historial.
- Avisos de color para las deudas vencidas 🔴 o por vencer 🟠.

**Diseño**
- Modo oscuro automático 🌙.
- Funciona en el celular (iPhone y Android) y en la compu.
- Los datos se guardan en tu dispositivo.

---

## 🛠️ Hecha con

- [React Native](https://reactnative.dev) y [Expo](https://expo.dev) (SDK 57)
- [Expo Router](https://docs.expo.dev/router/introduction/) para la navegación
- AsyncStorage para guardar los datos en el dispositivo
- JavaScript
- Publicada en la web con EAS Hosting

---

## 🚀 Cómo correrla en tu compu

Necesitás [Node.js](https://nodejs.org) (versión LTS).

```bash
git clone https://github.com/katjacaner/cuentas-claras.git
cd cuentas-claras
npm install
npx expo start
```

Después escaneá el código QR con la app **Expo Go** en tu celular, o apretá `w` para abrirla en el navegador.

---

## 📁 Cómo está organizado

```
src/
├── app/          → pantallas (cada archivo es una pantalla)
├── components/   → piezas reutilizables (tarjetas, selectores, botones)
├── context/      → datos compartidos por toda la app
├── data/         → guardar y leer del dispositivo
├── logic/        → cálculos (presupuesto, deudas, totales)
├── constants/    → colores, categorías y tipografías
└── utils/        → formato de plata y fechas
```

---

## 🗺️ Próximamente

- [ ] Copia de seguridad (exportar e importar tus datos)
- [ ] Exportar gastos a Excel
- [ ] Gastos recurrentes
- [ ] Notificaciones de vencimientos
- [ ] Versión en Play Store y App Store

---

Hecho por **[@katjacaner](https://github.com/katjacaner)** mientras aprendía a programar 💚