# ALEPH ZERO · Web local organizada

Entrega actualizada el 18/11/2026. Para ver la web sin instalar nada, abre `ABRIR WEB.html` y conserva a su lado la carpeta `web`.

## Mapa rápido

- `ABRIR WEB.html`: entrada recomendada para doble clic.
- `web/`: versión portable generada. No se edita manualmente.
- `codigo/`: fuente activa, pruebas y scripts.
- `codigo/public/assets/`: recursos web clasificados en `brand`, `hero`, `icons` y `products`.
- `documentacion/`: decisiones, auditoría y comprobaciones.
- `referencias/`: inspiración, recursos maestros y versiones visuales anteriores.
- `versiones/`: entregas históricas.

## Diseño vigente

La identidad sigue la regla 60/30/10: negro como base, blanco cálido para superficies de lectura y burdeos como acento. Las seis portadas aprobadas se usan de forma específica: horizontales en escritorio y verticales en móvil. La animación es ambiental, sin controles visibles, y respeta `prefers-reduced-motion`.

El catálogo contiene 10 calzados y 10 perfumes tomados de la tienda oficial de Aleph Zero. Incorpora filtros, tarjetas flotantes, compra directa con selector de talla o presentación, consulta, fichas completas con regreso contextual y una sección local “Me encanta”. Los precios y el estado publicado se revisaron el 18/11/2026; Odoo no expone un conteo numérico de unidades, por lo que las existencias finales requieren confirmación.

La interfaz utiliza Manrope, alojada localmente, para conseguir una lectura más limpia y contemporánea sin depender de conexión a Google Fonts.

## Desarrollo

Desde `codigo/`:

```powershell
npm run dev
npm run check
npm test
npm run build
npm run test:e2e
```

`npm run build` actualiza `codigo/dist`, `web`, `ABRIR WEB.html` e `index.html`.

No se publicó la web ni se enviaron mensajes reales.

