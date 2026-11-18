# Propuesta para Aleph Zero

Consulta de fuentes: **14 de noviembre de 2026**. Trabajo independiente, exclusivamente local. No se ha accedido a la administración del negocio ni realizado pedidos o envíos.

## Diagnóstico breve con evidencias

| Observación verificada | Evidencia pública y límite |
| --- | --- |
| El negocio presenta calzado y dos recorridos de perfumería, y anuncia atención por WhatsApp y entrega en La Habana. | [Inicio oficial](https://aleph-zero.odoo.com/). Copia en `sources/home.html`. Son declaraciones del comercio, no una verificación independiente de sus condiciones. |
| El catálogo permite buscar, ordenar, filtrar y añadir artículos a un carrito. | [Calzado](https://aleph-zero.odoo.com/shop/category/calzado-1), [diseñador y nicho](https://aleph-zero.odoo.com/shop/category/perfumes-disenador-nicho-7) y [árabes](https://aleph-zero.odoo.com/shop/category/perfumes-arabes-6). HTML guardado en `sources/`. |
| En las páginas de perfumería aparecen etiquetas de combinaciones de colores y filtros comunes a otros productos. | HTML de `sources/arabes.html` y `sources/disenador.html`. Hipótesis: filtros específicos por categoría pueden facilitar la exploración. No se ha medido su impacto. |
| Los enlaces genéricos de información del pie usan destinos sin una página informativa concreta. El pie conserva textos de plantilla. | `sources/home.html`. Se propone sustituirlos por destinos útiles y contenido aprobado. |
| El destino de contacto enlazado `/contactus` devuelve HTTP 404 en la consulta directa. | [Destino de contacto](https://aleph-zero.odoo.com/contactus). No se ha alterado. Esto no demuestra un fallo en la atención por otros canales. |
| El carrito público vacío es accesible. | [Carrito](https://aleph-zero.odoo.com/shop/cart), copia en `sources/carrito.html`. Solo se revisó el estado vacío; no se hizo checkout ni se enviaron formularios. |
| Las fichas ofrecen moneda y variantes con más detalle que el símbolo monetario del listado. | `sources/product-*.html`: datos JSON-LD con USD, SKU y tallas en varios modelos. El listado visual por sí solo muestra un símbolo ambiguo. |
| No todas las variantes publicadas aparecen con el mismo estado de existencias. | Por ejemplo, la [ficha Cityride](https://aleph-zero.odoo.com/shop/calzado-1/reebok-cityride-black-white-6511) distingue las dos tallas en datos estructurados. Es una observación fechada; la demo no anuncia disponibilidad actual. |
| Se recuperaron el logo, fotografías y estilos de la web. | Logo en `public/images/logo-original.png`; estilos originales archivados en `sources/original.css`. Se observó el símbolo burdeos del logo y una paleta de tema Odoo con morado, beige y fondos claros. |

Instagram y Facebook no se pudieron revisar: las herramientas devolvieron errores de acceso. Los extractos del buscador y las descargas directas de algunas categorías muestran ordenaciones distintas. Para la muestra se priorizaron las fichas descargadas directamente y se conservaron sus fuentes. No se presentan inferencias sobre las publicaciones de redes, identidad social o rendimiento comercial.

## Decisiones de diseño y producto

Se conserva el logo original, sin redibujarlo. El burdeos se toma del símbolo y se acompaña con blanco cálido, rosa suave y verde grisáceo. Es una dirección provisional, pendiente de aprobación. La tipografía serif de titulares y la tipografía de sistema para lectura evitan descargar fuentes externas. Las fotografías originales representan los productos de la muestra; no se generaron envases, etiquetas ni supuestos clientes.

La portada responde qué se vende, dónde se atiende y qué hacer después. Los accesos a calzado y perfumería comparten la identidad; diseñador y nicho y perfumería árabe tienen entradas diferenciadas. La selección destacada se denomina “Selección del catálogo”: no presupone novedades, descuentos o popularidad.

Las fichas separan talla EU, color documentado, presentación y concentración. Si un color no está documentado, se indica que debe confirmarse. No se infieren familias olfativas, notas, duración, equivalencias ni garantía. Se indica claramente que una talla listada no prueba disponibilidad.

La selección conserva variantes separadas, permite ajustar cantidades y eliminar productos y prepara un mensaje con las referencias y enlaces públicos. La copia está activa; el envío se mantiene deshabilitado y la configuración no contiene número de WhatsApp. No se solicitan datos personales distintos del municipio opcional, ni datos de pago.

## Cambios que facilitan la elección y la consulta

- Búsqueda por nombre y marca, filtros específicos y combinables, cantidad de resultados, ordenación y recuperación de búsquedas vacías.
- Precio con moneda explícita y fecha de muestra; disponibilidad por confirmar en todas las fichas.
- Variantes diferenciadas y campos de información coherentes por categoría.
- Selección local recuperable al recargar, con cantidades y referencias válidas.
- Consulta completa, copiable y revisable antes de cualquier interacción con el negocio.
- Subtotales independientes por moneda; precios faltantes señalados como pendientes, sin aparentar un total completo.
- Navegación compacta, rutas enlazables, menús móviles, controles con etiquetas y foco visible.
- Recursos locales ligeros, fotografías WebP, carga diferida fuera de portada y ausencia de scripts de terceros.

## Recomendación sobre Odoo

**Primera opción: conservar Odoo y mejorar la experiencia sobre su catálogo.** La documentación oficial describe configuración de productos, variantes, categorías y precios, y opciones de presentación del catálogo. Eso permite evaluar primero la limpieza de contenidos, categorías, atributos, navegación, portada y fichas dentro del sistema actual. Debe confirmarse qué edición, permisos, módulos y opciones tiene el negocio. [Productos y configuración](https://www.odoo.com/documentation/19.0/applications/websites/ecommerce/configuration/products.html), [catálogo](https://www.odoo.com/documentation/19.0/applications/websites/ecommerce/ecommerce_design/catalog.html).

La composición exacta de esta demostración, los filtros contextuales y la selección persistente que genera una consulta pueden requerir adaptar el tema y desarrollar JavaScript o un módulo. Debe validarse primero qué personalización admite el alojamiento contratado. Esta recomendación es una evaluación técnica de alcance; no presupone acceso al servidor ni a funcionalidades privadas.

Una web independiente daría control de la interfaz, pero añadiría alojamiento, despliegues, seguridad y un mecanismo fiable para leer productos, precios, moneda, variantes y existencias. No basta con copiar este JSON. Debe mantenerse Odoo como única fuente o acordarse otra fuente única y un flujo automatizado de publicación. El acceso por API, exportaciones, autenticación y frecuencia de actualización deben comprobarse con el propietario. No se ha construido una API ficticia ni un segundo inventario manual.

Antes de presupuestar una alternativa: revisar plan de Odoo, viabilidad de personalización y acceso autorizado a datos, comparar el coste de un tema con el de un frontal independiente y definir qué ocurre ante fallos de sincronización. No hay base suficiente para recomendar ahora sustituir Odoo.

## Pendientes de validar con los propietarios

| Dato o decisión | Motivo |
| --- | --- |
| Identidad visual, textos y autorización de recursos | La propuesta conserva recursos públicos, pero el uso comercial y el rediseño requieren aprobación. |
| Precios y moneda comerciales | USD observado en fichas no garantiza vigencia futura ni condiciones de cobro. |
| Disponibilidad por variante, referencia, color y tallaje | Las páginas públicas no son una fuente sincronizada para esta demo. |
| Presentaciones y concentraciones | Confirmar que cada referencia corresponde exactamente a la fotografía, precio y variante. |
| Número de WhatsApp y activación del canal | Debe verificarse su titularidad y autorizarse el envío antes de habilitarlo. |
| Municipios, cobertura, coste y tiempos de entrega | La afirmación de mensajería gratuita del comercio no establece condiciones suficientes. |
| Pagos, garantías y devoluciones | No se han inventado políticas ni modalidades. |
| Fuente de catálogo e inventario | Definir actualización de una sola fuente, permisos, responsabilidades y manejo de errores. |
| Dominio, analítica y criterios de aceptación | Esta fase no despliega, no mide ventas ni recoge analítica de clientes. |
| Indexación | Mantener `noindex` y bloqueo de rastreo durante la demo; revisar solo ante lanzamiento aprobado. |

## Argumento comercial sugerido

“La propuesta muestra cómo ayudar a una persona a pasar de explorar productos a preparar una consulta con la talla o presentación, la cantidad y la referencia correctas. Así, el negocio recibe una conversación con más contexto y el cliente sabe qué falta por confirmar. Podemos trasladar este recorrido a Odoo o evaluar una integración que mantenga un solo catálogo. Su utilidad y su impacto se validarían con pruebas de uso y mediciones acordadas, sin prometer un aumento de ventas.”
