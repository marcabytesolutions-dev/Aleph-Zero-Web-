# Verificación de la copia completa

Fecha: 14/11/2026. Destino solicitado:

```text
C:\Users\HP\OneDrive\Desktop\FREELANCE JOBS\alephzero\Pagina Web
```

Se recuperó la demostración en este destino porque la raíz anterior ya no contenía sus archivos. La entrega conserva las diez fichas de muestra, sus fotografías y el logo público, el recorrido de consulta y el código editable. No se modificó ni publicó la web original.

## Resultados ejecutados sobre esta copia

- `npm test`: **5 pruebas aprobadas**, sin fallos.
- `npm run build`: compilaciones estándar y portátil correctas; generación de `ABRIR WEB.html`, `index.html` y `web/index.html`.
- `npm run test:e2e`: **9 pruebas aprobadas**, sin fallos ni pruebas omitidas; ejecución de 25,7 segundos en Microsoft Edge.
- El recorrido completo se comprobó tanto por HTTP local como abriendo los HTML directamente mediante `file://`.
- Se verificó que la versión portátil no solicita recursos HTTP externos, que todas sus imágenes cargan y que permite filtrar, elegir talla, añadir, recargar conservando la selección y preparar la consulta.
- Se comprobó la existencia de los archivos enlazados y que el HTML portátil usa un script clásico independiente, sin módulos que requieran servidor.
- Se mantuvieron las verificaciones de teclado, foco, contraste de colores principales, precios desconocidos, monedas diferentes, cantidades inválidas, fallos de almacenamiento e imágenes.
- Se comprobaron anchos de 360, 390, 768 y 1440 píxeles sin desbordamiento horizontal en las vistas revisadas.

El informe automático está en `checks/browser-results.json` y las capturas en `checks/screenshots/`. Las comprobaciones de apertura directa se encuentran en `../tests/portable.spec.js`.

## Estructura de entrega

- `../../index.html` y `../../ABRIR WEB.html`: apertura directa.
- `../../web/`: recursos compilados completos para la apertura directa.
- `../`: raíz del proyecto editable, con dependencias locales y archivo de versiones.
- `../../Aleph-Zero-web-completa.zip`: paquete de la entrega con fuentes, recursos, documentación y versiones compiladas; excluye `node_modules` y archivos temporales de pruebas.
- `../../VERIFICACION-ZIP.txt`: informe de integridad del archivo comprimido. El script comprueba todas las entradas mediante SHA-256 y verifica los archivos esenciales.

Tras extraer el ZIP, la versión portátil sigue funcionando sin instalar dependencias. Para editar o recompilar, ejecutar `npm ci` dentro de `codigo` y después los comandos del README.

## Límites

Las pruebas se ejecutaron en Edge sobre Windows, no en todos los navegadores ni dispositivos. No constituyen una garantía de ausencia de errores en cualquier entorno. La copia del mensaje puede requerir permisos del navegador; existe selección manual como alternativa. Los enlaces a redes y fichas originales requieren Internet. Los datos comerciales continúan siendo una muestra fechada y no sincronizada, y el envío permanece deshabilitado.

Servidor de desarrollo de esta copia: **http://127.0.0.1:4174/**. Se cambió el puerto para no interferir con el servidor anterior.
