# Comprobaciones de la demostración

Última revisión de interfaz: **17/11/2026**. Datos de catálogo: **14/11/2026**. Plataforma: Windows, Node.js 26.13.0, npm 11.20.0 y Microsoft Edge en modo sin interfaz mediante Playwright. Se ejecutaron en la raíz indicada por el solicitante.

## Resultado final

| Comprobación ejecutada | Resultado |
| --- | --- |
| `npm test` | **5 pruebas de lógica aprobadas**, sin fallos. |
| `npm run test:e2e` | **10 pruebas de navegador aprobadas**, 0 fallos, 0 omitidas, 0 inestables. Última ejecución: 33,8 segundos. |
| `npm run build` | Compilación de producción correcta con Vite 7.3.8. |
| `node --check src/main.js` | Sintaxis JavaScript válida. |
| Respuesta HTTP del servidor | HTTP **200** en `http://127.0.0.1:4174/`. |
| Instalación local de dependencias | 18 paquetes auditados por npm al instalar; 0 vulnerabilidades informadas en ese momento. No es una auditoría de seguridad exhaustiva. |

El informe automático completo está en `checks/browser-results.json`. Las pruebas están en `../tests/domain.test.js` y `../tests/journey.spec.js`.

## Cobertura funcional comprobada

- Inicio → categoría → filtros → ficha → talla → selección → vista previa → copia real al portapapeles.
- Búsqueda por nombre y marca, combinación de marca, talla, presentación, concentración y rango de precio; orden por precio y nombre en lógica, orden por precio en navegador.
- Filtros activos, eliminación individual, limpieza completa y recuperación desde cero resultados.
- Dos tallas del mismo producto como líneas distintas, aumento de cantidades, eliminación y recarga con persistencia.
- Selección vacía, ruta de producto inexistente, imagen con carga fallida, almacenamiento corrupto y rechazo de escritura de `localStorage`.
- Cantidades fuera de rango rechazadas, límite máximo de 99 y validación de referencias de productos y variantes.
- Subtotales con precisión de céntimos, importes por moneda y precios pendientes sin convertirlos en cero ni mostrar un total completo. Casos de moneda mixta y precio desconocido comprobados en pruebas de lógica con datos sintéticos, sin modificar la muestra comercial.
- Mensaje con nombre, referencia, talla/color o presentación, cantidad, precio, subtotal, enlace público y municipio opcional.
- Botón de envío a WhatsApp efectivamente deshabilitado. Sin solicitud de datos de pago y sin integración de envío.

## Adaptación y accesibilidad comprobadas

Se revisaron **360, 390, 768 y 1440 píxeles** de ancho con ventana de 1000 píxeles de alto. Se comprobó mediante el DOM que no existe desbordamiento horizontal en inicio, catálogo, producto, selección vacía y propuesta; también en selección poblada y consulta poblada.

Se probaron menú móvil, filtros móviles combinados, búsqueda con nombre accesible, enlace para saltar al contenido, selección de radio mediante teclado, activación de botones con Enter, conservación del foco tras cambiar cantidades y cierre del buscador con Escape y devolución del foco al botón. Los controles tienen etiquetas o nombres accesibles y estilo de foco visible.

La preferencia de movimiento reducido elimina las transiciones comprobadas. Se midieron por luminancia las combinaciones principales de texto:

| Combinación | Relación calculada |
| --- | --- |
| Burdeos sobre fondo claro | 10,23:1 |
| Texto secundario sobre fondo claro | 5,54:1 |
| Texto secundario sobre crema | 4,91:1 |
| Blanco sobre burdeos | 10,58:1 |

Todas superan 4,5:1. Valores en `checks/contrast.json`. Esta verificación cubre esos colores principales y **no equivale a una certificación integral WCAG** ni a pruebas con tecnologías de asistencia.

Las pruebas no detectaron errores JavaScript ni errores de consola en los recorridos normales. En el caso de imagen rota se abortó intencionadamente una petición y se verificó el estado neutro de sustitución; no se trató ese fallo provocado de red como error inesperado de la aplicación.

## Revisión visual y recursos

Se inspeccionaron capturas de inicio en escritorio, tableta y móvil, además de catálogo, producto, selección y consulta. Se corrigieron el solapamiento de fotografía y texto en las categorías móviles, el tamaño de textos de producto y la persistencia de apertura del panel de filtros. Se recorrió la página antes de las capturas finales para activar la carga diferida de fotografías.

Capturas conservadas:

- `checks/screenshots/inicio-360.png`
- `checks/screenshots/inicio-390.png`
- `checks/screenshots/inicio-768.png`
- `checks/screenshots/inicio-1440.png`
- `checks/screenshots/catalogo-1440.png`
- `checks/screenshots/producto-390.png`
- `checks/screenshots/seleccion-390.png` y `seleccion-1440.png`
- `checks/screenshots/consulta-390.png` y `consulta-1440.png`

El logo y las diez fotografías suman **396.238 bytes**; cada imagen pesa menos de 64 KB. La compilación final informa aproximadamente 51,14 KB de CSS y 44,70 KB de JavaScript, 10,28 KB y 14,08 KB comprimidos con gzip respectivamente. Son tamaños de archivos medidos por herramientas, **no resultados de rendimiento ni de experiencia de usuario**.

No hay vídeos automáticos, fuentes remotas, analítica ni scripts de terceros. La portada prioriza sus imágenes; las demás se cargan de forma diferida. Los recursos de producto usan `object-fit: contain` para conservar el objeto completo; la portada utiliza una fotografía editorial del catálogo en su composición.

## Límites y pendientes

- No se han ejecutado Lighthouse, mediciones de Core Web Vitals, pruebas bajo conexión móvil limitada ni pruebas en dispositivos físicos.
- No se ha probado en Safari/iOS, Firefox, un lector de pantalla o diferentes escalados del sistema. Edge con ventanas adaptadas es la cobertura ejecutada.
- No se han autenticado redes sociales, API o administración Odoo. La página pública de contacto devolvió 404 y las redes no fueron accesibles con las herramientas de consulta.
- No se ha probado el checkout real, métodos de pago, envío de mensajes ni gestión de pedidos; quedan fuera de esta fase.
- No se ha realizado una auditoría de seguridad o accesibilidad completa ni medido resultados comerciales.
- Los datos y recursos comerciales requieren revisión de los propietarios. Ninguna prueba funcional valida originalidad, stock, condiciones de garantía, envío gratuito o vigencia de precios.
- No se ha desplegado ni modificado el sitio existente. `noindex`, `nofollow`, `noarchive` y `robots.txt` se conservan para la demostración. El bloqueo de rastreo no es un control de acceso para una futura publicación.

El servidor de desarrollo se deja iniciado por solicitud expresa para la demostración local. Se puede volver a ejecutar con `npm run dev` desde la raíz del proyecto y detener con Ctrl+C.
