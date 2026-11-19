# Pruebas · 18/11/2026

## Verificación

- Compilación Vite y empaquetado para doble clic: correctos.
- Pruebas heredadas de búsqueda, filtros, precios y sanitización: 5 correctas.
- Pruebas nuevas de comercio: 2 correctas; entradas corruptas, variantes agotadas, límite acumulado, tarifa configurable y mensaje sin mutación. Total: 7 pruebas de lógica correctas.
- Suite `tests/premium.spec.js`: 4 recorridos de navegador correctos en Edge headless. Informe: `codigo/docs/checks/premium-results.json`.
- Rutas principales y fichas comprobadas en 360, 390, 768 y 1440 px; imágenes cargadas, sin errores JS ni overflow horizontal.
- Filtros, búsqueda sin resultados, ordenación, navegación móvil y búsqueda global.
- Variante agotada deshabilitada; talla obligatoria; incremento máximo 5; persistencia tras recarga; eliminación; formulario obligatorio; dirección condicional; subtotal y mensaje con variante/datos correctos.
- WhatsApp interceptado en la prueba: no se abrió un servicio externo ni se envió un mensaje. Verificado destino 5353755872, importe y texto sin confirmación falsa.
- Versión `ABRIR WEB.html` probada directamente con protocolo file, sin servidor.
- Capturas desktop/móvil revisadas visualmente: `codigo/docs/checks/screenshots/premium-*.png`.

## Ejecución

En `codigo`: `npm run check`, `npm test`, `npm run build`, `npm run test:e2e`.

La prueba inicial tuvo dos expectativas de conteo incorrectas (Reebok=2, perfumes=6); se corrigieron tras contrastar catálogo. El puerto antiguo 4174 no respondía; QA usa localhost:4188. Las suites anteriores journey/hero/portable describen la interfaz anterior y se conservan como históricas, no son el criterio de aceptación de esta revisión.

No se ejecutó Lighthouse ni se certificó WCAG completa. No hay TypeScript ni linter instalado: la comprobación de sintaxis utiliza node --check. La revisión visual y funcional no sustituye una prueba con usuarios ni validación comercial.

