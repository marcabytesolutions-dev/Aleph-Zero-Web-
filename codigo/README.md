# Código activo · Aleph Zero

## Estructura

```text
src/
  main.js              Entrada de Vite
  app.js               Interfaz, rutas y eventos
  data/catalog.json    Catálogo de muestra
  lib/                  Comercio, configuración y dominio
  styles/app.css       Sistema visual 60/30/10
public/
  assets/brand/         Logotipo
  assets/hero/          Portadas desktop y móvil aprobadas
  assets/icons/         Iconos optimizados de interfaz
  assets/products/      Fotografías del catálogo
scripts/                Preparación, optimización y empaquetado
tests/                  Pruebas unitarias y de navegador
docs/                   Evidencias técnicas y legado
```

## Comandos

```powershell
npm run dev
npm run check
npm test
npm run build
npm run test:e2e
```

La carpeta `web/` situada un nivel arriba es una salida generada. Las imágenes maestras y referencias no usadas en producción están fuera de `public`, dentro de `referencias/`.

