# Flores San Valentín 🌹

Una página web responsive para una floristería especializada en arreglos florales para San Valentín. Este proyecto fue desarrollado como parte de un trabajo universitario para demostrar habilidades en desarrollo web.

## 📝 Descripción

Flores San Valentín es una página web moderna y elegante diseñada para mostrar y comercializar arreglos florales. La página incluye diversas secciones como catálogo de productos, galería de imágenes, ubicación interactiva y un sistema de autenticación de usuarios.

### 🎯 Objetivos del Proyecto
- Crear una experiencia de usuario intuitiva y atractiva
- Implementar diseño responsive para todos los dispositivos
- Demostrar el uso de tecnologías web modernas
- Integrar mapas y servicios externos
- Proporcionar una plataforma de comercio electrónico básica

## ✨ Características

- Diseño responsive y moderno
- Catálogo de productos con precios
- Galería de imágenes interactiva
- Mapa interactivo con la ubicación de la tienda
- Sistema de autenticación de usuarios
- Soporte para múltiples idiomas (i18n) con node-polyglot
- Reproductor de música ambiental
- Integración con redes sociales
- Formulario de contacto
- Botón flotante de WhatsApp para contacto rápido
- Banner rotativo automático
- Diseño optimizado para SEO
- Cambio de tema (claro/oscuro)

## 🛠️ Tecnologías Utilizadas

### Frontend
- HTML5
- CSS3 con diseño responsive (PostCSS)
- JavaScript (ES6+)

### Build y Desarrollo
- [Vite](https://vitejs.dev/) v6.1.1 - Bundler y herramienta de desarrollo
- [PostCSS](https://postcss.org/) v8.5.3 - Procesador de CSS
  - postcss-import - Para importar archivos CSS
  - postcss-nested - Para usar sintaxis anidada en CSS
  - postcss-custom-properties - Para variables CSS
  - autoprefixer - Para añadir prefijos de navegadores
  - cssnano - Para minificar CSS
- [vite-plugin-imagemin](https://github.com/vbenjs/vite-plugin-imagemin) - Optimización de imágenes
- [gh-pages](https://github.com/tschaub/gh-pages) - Despliegue a GitHub Pages

### Librerías
- [node-polyglot](https://github.com/airbnb/polyglot.js) v2.6.0 - Internacionalización

## 🎨 Paleta de Colores

- Principal: `#ff4d6d` - Usado para elementos principales y CTA
- Secundario: `#ff758c` - Complementa al color principal
- Fondo: `#fff5f7` - Proporciona contraste suave
- Texto: `#333333` - Asegura buena legibilidad

## 📂 Estructura del Proyecto

```
/dist                 # Archivos compilados listos para producción
  /assets             # Recursos empaquetados por Vite
  /audios             # Archivos de audio para producción
  /images             # Imágenes para producción
  - index.html        # Página principal compilada
  - login.html        # Página de login compilada

/public               # Recursos estáticos que no requieren procesamiento
  /audios             # Archivos de audio originales
  /images             # Imágenes originales

/src                  # Código fuente
  /scripts            # Archivos JavaScript
    - i18n.js         # Configuración y funciones de internacionalización
    - language.js     # Gestión de idiomas
    - login.js        # Lógica de autenticación
    - main.js         # Punto de entrada principal
    - map.js          # Funcionalidad de mapas
    - music.js        # Gestión de reproducción de música
    - theme.js        # Gestión de temas visuales
  /styles             # Archivos de estilos
    - login.pcss      # Estilos para la página de login (PostCSS)
    - main.pcss       # Estilos para la página principal (PostCSS)
  - index.html        # Plantilla HTML principal
  - login.html        # Plantilla HTML de login
  - .gitignore        # Archivos ignorados por Git
  - LICENSE           # Licencia del proyecto
  - package.json      # Dependencias y scripts
  - package-lock.json # Versiones exactas de dependencias
  - postcss.config.js # Configuración de PostCSS
  - vite.config.js    # Configuración de Vite
  - README.md         # Este archivo
```

## 🚀 Instalación y Uso

### Prerrequisitos
- [Node.js](https://nodejs.org/) (versión recomendada: 14.x o superior)
- npm (normalmente viene con Node.js)

### Pasos para instalar
1. Clona este repositorio:
   ```bash
   git clone https://github.com/Johnson1255/Plataformas-Taller1.git
   cd Plataformas-Taller1
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

## Configuración del entorno

1. Copia el archivo `.env.example` y renómbralo a `.env`
2. Completa las variables de entorno con tus propias credenciales de Supabase

### Desarrollo
Para iniciar el servidor de desarrollo:
```bash
npm run dev
```
Esto iniciará un servidor local, generalmente en http://localhost:5173 (Puede tener variaciones)

### Compilación para producción
Para compilar el proyecto para producción:
```bash
npm run build
```
Los archivos compilados se encontrarán en el directorio `/dist`.

### Previsualizar la versión de producción
Para previsualizar la versión compilada:
```bash
npm run preview
```

### Despliegue a GitHub Pages
Para desplegar la aplicación a GitHub Pages:
```bash
npm run deploy
```
Esto publicará automáticamente el contenido de la carpeta `/dist` en la rama gh-pages.

## ⚙️ Configuración

### Configuración de Vite
El proyecto utiliza Vite como bundler, cuya configuración se encuentra en `vite.config.js`. La configuración incluye el plugin de optimización de imágenes:

```javascript
import { defineConfig } from 'vite'
import viteImagemin from 'vite-plugin-imagemin'

export default defineConfig({
    base: '/Plataformas-Taller1/',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        rollupOptions: {
            input: {
                main: './index.html',
                login: './login.html'
            }
        }
    },
    plugins: [
        viteImagemin({
            gifsicle: {
                optimizationLevel: 7,
                interlaced: false,
            },
            optipng: {
                optimizationLevel: 7,
            },
            mozjpeg: {
                quality: 20,
            },
            pngquant: {
                quality: [0.8, 0.9],
                speed: 4,
            },
            svgo: {
                plugins: [
                    {
                        name: 'removeViewBox',
                    },
                    {
                        name: 'removeEmptyAttrs',
                        active: false,
                    },
                ],
            },
        }),
    ],
})
```

### PostCSS
Se utiliza PostCSS para procesar los archivos CSS, con la configuración en `postcss.config.js`:

```javascript
module.exports = {
  plugins: {
    'postcss-nested': {},
    autoprefixer: {},
    'postcss-import': {},
    'postcss-custom-properties': {
      preserve: true // Cambia a true para preservar las variables CSS
    },
    'cssnano': process.env.NODE_ENV === 'production' ? {} : false
  }
}
```

## 📱 Funcionalidades principales

### Sistema de temas
El archivo `theme.js` gestiona los temas visuales de la aplicación

### Internacionalización (i18n)
La aplicación soporta múltiples idiomas mediante los archivos `i18n.js` y `language.js`, utilizando la biblioteca node-polyglot

### Reproducción de música
El archivo `music.js` maneja la reproducción de audio

### Mapas
El archivo `map.js` gestiona la funcionalidad de mapas interactivos

### Sistema de Login
El archivo `login.js` maneja la autenticación de usuarios

## 🔍 Optimización

El proyecto implementa diversas técnicas de optimización:

- **Imágenes**: Optimización automática con vite-plugin-imagemin
- **CSS**: Minificación con cssnano y organización con postcss
- **Carga diferida**: Implementación de lazy loading para imágenes y recursos no críticos
- **Prefijos de navegador**: Añadidos automáticamente con autoprefixer


## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🔗 Enlaces

- [Repositorio en GitHub](https://github.com/Johnson1255/Plataformas-Taller1)
- [Página del proyecto](https://johnson1255.github.io/Plataformas-Taller1/)

---
Desarrollado con ❤️ para el curso de Plataformas de Programación Empresarial.
