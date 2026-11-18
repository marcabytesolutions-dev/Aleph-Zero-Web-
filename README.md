# ALEPH ZERO · Rediseño premium local

Entrega del 18/11/2026. Abre `ABRIR WEB.html` desde la carpeta `Pagina Web` con doble clic. Mantén junto a este archivo la carpeta `web`; no necesita instalación ni servidor. Los accesos a WhatsApp y redes sí requieren internet.

Incluye portada principal y categorías, diez productos con filtros y fichas, carrito persistente, checkout y solicitud preparada para WhatsApp. Existencias simuladas y precios de muestra del 14/11/2026. No confirma pedidos ni realiza pagos.

## Desarrollo

Desde `Pagina Web/codigo`:

```powershell
npm install
npm run dev
```

Con las dependencias locales existentes basta `npm run dev`. Abre http://localhost:4188 .

```powershell
npm run check
npm test
npm run build
npm run test:e2e
```

El build actualiza `codigo/dist`, `web`, `ABRIR WEB.html` e `index.html`. La suite de navegador usa Microsoft Edge local y el puerto 4188 (debe estar libre).

## Archivos

- Código activo: `codigo/src/premium.js`, `premium.css`, `commerce.js`, `domain.js` y `catalog.json`.
- Recursos nuevos: `codigo/public/images/hero-*`. JPEG optimizados utilizados, PNG maestros conservados.
- Documentación vigente: `docs/AUDITORIA.md`, `DISENO.md`, `ARQUITECTURA.md`, `PENDIENTES.md`, `PRUEBAS.md`.
- Evidencias: `codigo/docs/checks/premium-results.json` y `screenshots/premium-*.png`.
- Implementación anterior: `codigo/docs/main-anterior.js`. Documentos y ZIP anteriores se conservan como históricos y no describen esta entrega.

Los datos de contacto se obtuvieron de la web oficial. Precios y stock deben confirmarse con el negocio. No se publicó la web ni se enviaron mensajes de prueba.

