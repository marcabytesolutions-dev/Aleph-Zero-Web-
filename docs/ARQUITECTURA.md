# Arquitectura

Se conserva JavaScript modular + Vite: no se migró a React ni se añadieron dependencias. `codigo/src/main.js` carga `premium.js`; `premium.css` contiene el sistema visual. `domain.js` conserva búsqueda, filtros, moneda y etiquetas. `commerce.js` adapta el catálogo y centraliza carrito, stock de demostración, contacto y mensaje de solicitud.

Rutas mediante hash para abrir sin servidor: `#/`, `#/calzado`, `#/perfumes`, `#/catalogo`, `#/producto/:id`, `#/como-comprar`, `#/sobre-nosotros`, `#/contacto`, `#/redes-sociales`, `#/checkout`. Compatibilidad con `#/seleccion` y `#/consulta`. IDs estables se emplean como slug. Título y descripción cambian por página; demo con noindex.

`catalog.json` conserva los datos observados, sin stock inventado. `commerce.js` añade explícitamente stockMode=demo: cero para variantes documentadas agotadas y cinco para las demás. No es inventario sincronizado. `cleanCart` elimina entradas inválidas y limita cantidades; almacenamiento local `aleph-premium-cart-v2`. Datos personales solo en memoria de la pestaña, no en localStorage.

Checkout genera una URL de WhatsApp con mensaje codificado; no envía ni confirma automáticamente, no cobra y no descuenta stock. Pago a coordinar. Entrega en La Habana anunciada gratuita; otras modalidades pendientes de coordinación.

Futura integración: sustituir el adaptador de catálogo/inventario por API autorizada de Odoo; validar precios, variantes y stock en servidor antes de crear pedidos. No guardar secretos en frontend.

Build produce `codigo/dist` y `web/`; el empaquetador actualiza las entradas de doble clic. Los documentos antiguos dentro de `codigo/docs` son históricos; prevalecen los documentos en `docs/` de la entrega premium.

