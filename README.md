# Proyecto Barack

Este repositorio contiene un conjunto de páginas HTML diseñadas para gestionar documentación técnica.

## Estructura del sitio
- **index.html**: redirecciona inmediatamente a `home.html` para cumplir con el requisito de Firebase Hosting de contar con un archivo principal.
- **home.html**: página de entrada principal. Desde aquí se accede a `login.html` e `register.html`.
- **login.html**: formulario de acceso para usuarios existentes. Utiliza `login.js` para autenticar con Firebase y luego redirige a `home.html`.
- **register.html**: permite crear una cuenta nueva. Incluye un script interno que inicializa Firebase y gestiona el registro.
- **listado-maestro.html**: panel central para el control de documentación. Requiere autenticación.
- **amfe.html**: herramienta de análisis AMFE. Requiere autenticación.
- **sinoptico-producto.html**: visualización jerárquica de componentes. Requiere autenticación.
- **app.js**: se incluye en las páginas protegidas (`home.html`, `listado-maestro.html`, `amfe.html`, etc.) para comprobar que el usuario esté autenticado y para construir dinámicamente el encabezado de navegación.

Las páginas `about.html` y `contact.html` se eliminaron por no estar enlazadas en la navegación. El dominio raíz incluye ahora un `index.html` que redirige a `home.html`, por lo que cualquier visita a la raíz carga automáticamente la página principal.

## Cómo ejecutar en local
1. Instala un servidor estático simple (por ejemplo, usando `npm install -g serve`).
2. Desde la raíz del repositorio ejecuta `serve public` o utiliza cualquier servidor que apunte a la carpeta `public`.
3. Abre `http://localhost:3000/home.html` en tu navegador.

Para despliegues en Firebase Hosting se incluye un `firebase.json` básico que define la carpeta `public` como directorio a servir.
