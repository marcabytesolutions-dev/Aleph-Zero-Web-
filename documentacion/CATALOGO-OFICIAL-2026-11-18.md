# Catálogo oficial incorporado · 18/11/2026

## Fuente

Los nombres, precios, fotografías y variantes se consultaron en la tienda pública `https://aleph-zero.odoo.com/`. Cada registro de `codigo/src/data/catalog.json` conserva su ficha `sourceUrl`, la imagen de origen y la fecha de observación.

## Selección de calzado

1. Reebok Cityride Black White
2. Puma Carch Black White
3. Nike Zoom Vomero Roam Black Light Silver Jade Horizon
4. Adidas Handball Spezial Core Black Carbon Gold Metallic
5. Nike Blazer Low 77 Jumbo
6. Nike Air Max 1 Blanco Alabastro
7. Puma Palermo White Black Gum
8. Puma Palermo LTH Prime Low Black
9. Puma Court Classic Lux Suede White Feather
10. Puma Softride Enzo 5 Black Pink Pixel

## Selección de perfumes

1. Xerjoff Naxos EDP 100 ml
2. Yves Saint Laurent MYSLF Le Parfum 100 ml
3. Valentino Uomo Born in Roma Extradose Parfum 100 ml
4. Valentino Uomo Born in Roma Purple Melancholia EDT 100 ml
5. Prada Paradoxe EDP 100 ml
6. Dior Homme Intense EDP 100 ml
7. Yves Saint Laurent Libre EDP 90 ml
8. Mancera Instant Crush EDP 120 ml
9. Mancera Cedrat Boise EDP 120 ml
10. Valentino Uomo Born in Roma Intense EDP 100 ml

## Criterio de disponibilidad

Se conserva `InStock` o `OutOfStock` cuando aparece en los datos estructurados de la ficha oficial. La web no presenta cantidades exactas porque Odoo no las publica. El carrito prepara una solicitud y no descuenta inventario ni confirma una reserva.

## Interacción

Al pulsar “Agregar al carrito”, el cliente elige la talla publicada en calzado o la presentación en mililitros en perfumería antes de incorporar la solicitud.

La tarjeta ofrece tres acciones con jerarquía clara: “Agregar al carrito”, “Más información” y “Consultar disponibilidad”. La ficha completa incorpora “Volver a resultados”, que restaura la colección, los filtros y la posición de desplazamiento anteriores.

El corazón guarda productos localmente en la sección “Me encanta”; no crea una cuenta ni envía datos. Los dos CTA de portada y los portales de categoría usan iconos locales de calzado y perfume descargados de Tabler Icons.

## Imágenes editoriales

Las páginas “Cómo comprar” y “Sobre nosotros” usan composiciones creadas a partir de fotografías oficiales del catálogo. Los recursos finales están en `codigo/public/assets/editorial/` y conservan como referencias visuales los productos Puma, Prada, Versace, Valentino y Xerjoff presentes en `codigo/public/assets/products/`.
