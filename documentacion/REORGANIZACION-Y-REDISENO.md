# Reorganización y rediseño · 18/11/2026

## Organización

La fuente activa quedó separada en aplicación, librerías, datos y estilos. Los recursos públicos se clasificaron en marca, portadas, iconos y productos. La implementación anterior pasó a `codigo/docs/legacy`; inspiración, recursos maestros y portadas reemplazadas se conservaron en `referencias`.

La salida de doble clic se regenera con `npm run build`. `web/` no debe editarse a mano.

## Portadas aprobadas

- Escritorio: `hero-editorial.jpg`, `hero-calzado.jpg` y `hero-perfumes.jpg`.
- Móvil: `hero-mobile.png`, `hero-calzado-mobile.png` y `hero-perfumes-mobile.png`.

Las imágenes se muestran completas con `object-fit: contain` y relaciones 3:2 en escritorio y 2:3 en móvil. El texto ocupa las áreas oscuras disponibles y el encabezado se integra mediante transparencia. El movimiento se limita a variaciones de luz y brillo; no hay botón de animación y se desactiva con la preferencia de movimiento reducido.

## Catálogo

El catálogo usa fondo negro, superficies grafito y acciones burdeos. Incluye navegación por Todo, Calzado y Perfumería; filtros contextuales; tarjetas redondeadas con sombra difuminada; selector de talla o presentación desde la propia tarjeta; consulta, sección “Me encanta”, enlace a ficha completa; regreso a los filtros y posición anteriores; y un diseño móvil de una columna para dar protagonismo a cada producto.

La tipografía principal pasó a Manrope en pesos 400, 500, 600 y 700. Los archivos se conservan localmente en `codigo/public/assets/fonts` para que la versión de doble clic funcione sin Internet.

## Alcance comercial

La muestra contiene 10 calzados y 10 perfumes consultados en `aleph-zero.odoo.com`. Los precios y estados se revisaron el 18/11/2026. Odoo no publica cantidades exactas de inventario; la disponibilidad, entrega, pago y garantía requieren confirmación con Aleph Zero.
