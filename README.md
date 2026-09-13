# KAKU

Aplicación mobile-first para aprender japonés mediante reconocimiento, memoria y escritura. Construida con Next.js, React, TypeScript, Tailwind CSS y App Router.

## Desarrollo

```bash
pnpm install
pnpm dev
```

Abre `http://localhost:3000`.

## Comprobaciones

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Estructura

- `src/app`: rutas, layout y estilos globales.
- `src/components`: shell, navegación y piezas reutilizables de interfaz.
- `src/lib`: tipos y datos de dominio.
- `src/hooks`: persistencia de progreso preparada con `localStorage`.

## PWA e iconos

El manifest se genera desde `src/app/manifest.ts` y el Service Worker está en
`public/sw.js`. El registro solo se activa en producción para no interferir con
el desarrollo local.

Cuando cambie el contenido precacheado, incrementa `CACHE_VERSION` en
`public/sw.js` para que las instalaciones existentes renueven el shell offline.

Los iconos provisionales muestran `あ` sobre el color morado de KAKU. Para
sustituirlos por el diseño definitivo, conserva los nombres y tamaños de estos
archivos:

- `src/app/favicon.ico`: favicon de 32 × 32 px.
- `src/app/icon.png`: icono general de 192 × 192 px.
- `src/app/apple-icon.png`: Apple Touch Icon de 180 × 180 px.
- `public/icons/kana-192.png`: icono PWA de 192 × 192 px.
- `public/icons/kana-512.png`: icono PWA de 512 × 512 px.
- `public/icons/kana-maskable-512.png`: icono maskable de 512 × 512 px.

## Deploy del MVP

1. Crea un repositorio en GitHub y sube este proyecto.
2. Entra en Vercel, selecciona **Add New Project** e importa el repositorio.
3. Mantén la configuración detectada para Next.js y pulsa **Deploy**.
4. Abre la URL publicada desde Safari en el iPhone.
5. Pulsa **Compartir**, elige **Añadir a pantalla de inicio** y confirma con
   **Añadir**. Kana se abrirá después en una ventana independiente.

El progreso continúa guardándose localmente en el dispositivo mediante
`localStorage`. No se sincroniza entre navegadores o dispositivos y puede
perderse si se borran los datos de Safari.
# Kaku
