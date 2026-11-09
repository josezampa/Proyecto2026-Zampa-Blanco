# 🎬 CINETECA
> Un registro personal de películas para organizar, puntuar, y guardar las pelis que mas te gusten :)

## 📌 Índice
1. [Descripción del Proyecto](#-descripción-del-proyecto)
2. [Contenido de la Página](#-contenido-de-la-página)
3. [Tecnologías Utilizadas](#-tecnologías-utilizadas)
4. [Cómo ejecutar el proyecto](#-cómo-ejecutar-el-proyecto)
5. [Demostración y Despliegue](#-demostración-y-despliegue)
6. [Autoras](#-autoras)

---

## 📝 Descripción del Proyecto

**CINETECA** es una aplicación web desarrollada para la materia **Taller de Desarrollo Web**. Funciona como un **registro personal de películas**, similar a una bitácora digital donde el usuario puede llevar el control de lo que vio, guardar lo que quiere ver y asignar puntuaciones o notas personales, sin el componente de red social.

### 🎯 Objetivo Principal
Proporcionar una interfaz limpia, accesible e intuitiva que le permita a cada usuario **gestionar su propia biblioteca audiovisual** de manera local o personalizada.

---

## 🗂️ Contenido de la Página

La plataforma incluye las siguientes **secciones y funcionalidades principales**:

* **Catálogo Principal:** Listado de películas con buscador por título y filtro por género. Acá aparecen todas las películas registradas por el usuario.
* **Registro y Valoración:** Formulario para agregar una película al catálogo, ingresando información principal de la peli y una valoración personal en el caso que se haya visto.
* **Perfil:** Sección dedicada a guardar la info más importante del usuario: películas pendientes, pelis favoritas, estadísticas personales y el botón para cerrar sesión.
* **Inicio de sesión:** Pantalla de login simulada. Sin sesión, la aplicación funciona en modo lectura; con sesión se habilitan las acciones de edición.
* **Crear cuenta** Pantalla de crear cuenta simulada. Permite crear pares de usuario-clave para ingresar a la página.

---

## 🛠️ Tecnologías Utilizadas

A continuación se detallan las herramientas y lenguajes empleados para el desarrollo de la aplicación web:

| Tecnología | Categoría | Uso que le dimos |
| :--- | :--- | :--- |
| **React** | Librería de interfaz | Componentes reutilizables y estado con hooks (`useState`, `useEffect`, `useRef`, `useNavigate`). |
| **Vite** | Herramienta de desarrollo | Servidor de desarrollo, empaquetado y alias de importación. |
| **Sass (SCSS)** | Estilos | Variables, mixins, anidamiento y estilos organizados por módulos. |
| **JavaScript** | Lógica | `fetch` con `async/await`, hooks propios y validaciones en tiempo real. |
| **Git y GitHub** | Control de versiones | Repositorio y trabajo en equipo. |
| **Canva** | Diseño | Hacer el wireframe. |
| **React Router** | Enrutamiento | Navegación entre Catálogo, Agregar, Perfil y Login con un layout común (`Outlet`), y redirección a `/login` si no hay sesión. |
| **json-server** | Base de datos simulada | API REST local sobre `src/data/db.json`: consultar, agregar, modificar y eliminar películas. |
| **localStorage** | Almacenamiento del navegador | Recordar el orden y los filtros del catálogo y el estado de sesión. |

### 🔧 Recursos Adicionales
* **Google GEMINI:** Organizar ideas, consultas de sintaxis, correcciones.

---

## ▶️ Cómo ejecutar el proyecto (SEGUNDA ENTREGA)

### Requisitos previos
* **Node.js** (versión LTS) y **npm**.
* **Git**.

### Pasos
1. Clonar el repositorio y entrar a la carpeta de la segunda entrega:

```bash
git clone https://github.com/josezampa/Proyecto2026-Zampa-Blanco.git
cd Proyecto2026-Zampa-Blanco/segunda-entrega
```

2. Instalar las dependencias:

```bash
npm install
```

3. En una primera terminal, levantar la base de datos simulada y dejarla abierta:

```bash
npm run mock
```

La API queda disponible en http://localhost:3001/peliculas.

4. En una segunda terminal, dentro de la misma carpeta, levantar la aplicación:

```bash
npm run dev
```

5. Abrir http://localhost:5173 en el navegador.

> **Importante:** las dos terminales tienen que estar abiertas al mismo tiempo. Si el mock está apagado, la aplicación muestra un mensaje de error de conexión.

### Inicio de sesión
El login es simulado y el estado se guarda en `localStorage`. Credenciales de prueba:
* Usuario: `jose` o `juli`
* Contraseña: `1234`

### Scripts disponibles
| Script | Qué hace |
| :--- | :--- |
| `npm run dev` | Servidor de desarrollo de Vite (puerto 5173). |
| `npm run mock` | json-server sobre `src/data/db.json` (puerto 3001). |
| `npm run build` | Genera la versión de producción. |
| `npm run preview` | Sirve localmente la versión de producción. |

### Estructura de carpetas
```
segunda-entrega/
├── public/          imágenes servidas tal cual
└── src/
    ├── api/         acceso al mock con fetch
    ├── assets/      imágenes importadas
    ├── components/  componentes reutilizables
    ├── data/        db.json: base de datos simulada
    ├── hooks/       hooks propios
    ├── layout/      estructura común de las páginas
    ├── pages/       páginas (una por ruta)
    └── styles/      archivos SCSS
```

---

## 🚀 Demostración y Despliegue (PRIMERA ENTREGA)

El proyecto se encuentra desplegado y se puede navegar en línea a través del siguiente enlace:
👉 **[C L I C K](https://josezampa.github.io/Proyecto2026-Zampa-Blanco/primera-entrega/index.html)**

---

## 👥 Autoras

Proyecto realizado por las alumnas:
* **Julieta Blanco** - 2522810 - (https://github.com/Julieta-B)
* **María Josefina Zampa** - 2521085 - (https://github.com/josezampa)
