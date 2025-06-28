# Proyecto Barack

Este repositorio contiene un conjunto de páginas HTML diseñadas para gestionar documentación técnica.

## Estructura del sitio
- **home.html**: página de entrada principal. Desde aquí se accede a `login.html` e `register.html`.
- **login.html / register.html**: formularios de autenticación que redirigen nuevamente a `home.html` tras el inicio de sesión o registro.
- **listado-maestro.html**: panel central para el control de documentación. Requiere autenticación.
- **amfe.html**: herramienta de análisis AMFE. Requiere autenticación.
- **sinoptico-producto.html**: visualización jerárquica de componentes. Requiere autenticación.

Las páginas `about.html` y `contact.html` se eliminaron por no estar enlazadas en la navegación. Igualmente `index.html` se eliminó porque duplicaba el contenido de `listado-maestro.html`.

## Cómo ejecutar en local
1. Instala un servidor estático simple (por ejemplo, usando `npm install -g serve`).
2. Desde la raíz del repositorio ejecuta `serve public` o utiliza cualquier servidor que apunte a la carpeta `public`.
3. Abre `http://localhost:3000/home.html` en tu navegador.

Para despliegues en Firebase Hosting se incluye un `firebase.json` básico que define la carpeta `public` como directorio a servir.
