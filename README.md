# Mis Finanzas (`mis-horas`)

App web instalable (PWA) para llevar tus finanzas personales desde el celular: horas de trabajo y pagos, gastos, ahorros, otros ingresos y metas. Funciona sin conexión y no necesita servidor ni cuenta: tus datos se quedan en tu teléfono.

## Qué puedes hacer

- **⏱️ Horas y pagos:** registra horas por día (con entrada/salida opcional, notas y días de descanso), mira el total semanal y mensual, marca semanas como pagadas, registra pagos y comparte el resumen por WhatsApp.
- **💸 Gastos:** por fecha, monto, nota y categoría, con total mensual.
- **🐷 Ahorros** y **💵 Otros ingresos.**
- **📊 Resumen y metas:** gráfica de los últimos 6 meses, gastos por categoría y meta de ahorro con progreso.
- **🎨 Personalización:** estilos (Liquid glass, Nothing, One UI, HyperOS), tema claro/oscuro/AMOLED y paletas de color.
- **🛟 Copias de seguridad** en una carpeta que elijas (Chrome/Edge), por el menú de compartir (Drive, Archivos, WhatsApp…) o en texto.

## Instalación y uso

1. Publica el repositorio con **GitHub Pages** (Settings → Pages → rama `main`, carpeta raíz).
2. Abre la URL en el celular y usa **"Añadir a pantalla de inicio"** (Chrome/Android o Safari/iOS).
3. Para probarlo en tu computador necesitas servirlo por `http://localhost` o `https` (el service worker y el cifrado no funcionan abriendo el archivo directamente):

   ```bash
   python3 -m http.server 8080
   ```

## Dónde se guardan tus datos

Todo vive en el `localStorage` de tu navegador, solo en ese dispositivo. La app pide al navegador almacenamiento persistente, pero **borrar los datos del sitio o desinstalar el navegador los elimina**. Haz copias de seguridad con regularidad: la app te avisa cuando pasan 7 días sin una, y muestra una alerta roja si el guardado falla.

Si el almacenamiento llega a contener un JSON dañado, la app lo conserva aparte bajo la clave `horas_trabajo_v1_corrupto` en lugar de sobrescribirlo.

## Seguridad: qué protege y qué no

| Función | Qué hace | Límite |
|---|---|---|
| **Clave de 4 números** | Bloquea la pantalla al abrir la app (con espera creciente tras 3 intentos fallidos). | Es solo un bloqueo visual: 4 dígitos tienen 10.000 combinaciones y los datos siguen legibles en el almacenamiento del navegador. |
| **Huella** (WebAuthn) | Alternativa cómoda a la clave. | Igual que la clave: protege la pantalla, no los datos. |
| **Cifrado de datos** (Ajustes) | Cifra todo con AES-GCM de 256 bits; la clave se deriva con PBKDF2-SHA256 (310.000 iteraciones) a partir de una clave larga (mínimo 8 caracteres). Sin la clave, los datos son ilegibles. | **Si la olvidas, no hay recuperación.** Su fuerza depende de la longitud de tu clave. |

Notas:

- **Carpeta de copias:** en Chrome o Edge (incluido Chrome 132+ en Android) puedes elegir una carpeta en "Copia de seguridad → Elegir carpeta de copias". La app la recuerda y guarda ahí cada copia (`horas-AAAA-MM-DD.json`; si haces varias el mismo día se reemplaza). En Safari/iOS y Firefox no existe esta opción y se usa el menú de compartir.
- Las **copias de seguridad no van cifradas** y no incluyen la clave de 4 números ni la huella. Guárdalas en un lugar seguro.
- Al restaurar una copia, los datos se validan y se descarta lo que no tenga el formato esperado.
- La app no envía información a ningún servidor. El único contacto externo es el botón de WhatsApp, que abre un enlace con el texto del resumen.

## Estructura

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Toda la app (HTML, CSS y JavaScript sin dependencias). |
| `sw.js` | Service worker: funciona sin conexión (red primero, caché de respaldo). |
| `manifest.webmanifest` | Datos de instalación de la PWA. |
| `icon-192.png`, `icon-512.png` | Iconos. |

## Desarrollo

No hay compilación ni dependencias: edita los archivos y recarga. Al cambiar cualquier archivo de la app, **sube el número de versión de la caché** en `sw.js` (`const C = "horas-v7"`) para que los dispositivos descarguen la versión nueva.

Datos guardados en `localStorage` (clave `horas_trabajo_v1`): horas por día, pagos, gastos, ahorros, otros ingresos, semanas pagadas, meta y ajustes. Si el cifrado está activo, el valor es un JSON `{enc, salt, iv, ct}`.
