# Cineteca - Segunda entrega

Migración de Cineteca a React con Vite, SCSS y una base de datos simulada con json-server. La descripción completa del proyecto está en el README de la raíz del repositorio.

## Tecnologías

- React 19, con los hooks `useState`, `useEffect` y `useNavigate`
- Vite
- React Router DOM (rutas anidadas con `Outlet`)
- Sass (SCSS)
- json-server (API simulada, datos en `src/data/db.json`)
- localStorage (filtros del catálogo y estado de sesión)

## Cómo ejecutarlo

Requisitos: Node.js (versión LTS) y npm.

1. Instalar las dependencias:

```bash
npm install
```

2. En una primera terminal, levantar la base de datos simulada y dejarla abierta:

```bash
npm run mock
```

La API queda disponible en http://localhost:3001/peliculas.

3. En una segunda terminal, levantar la aplicación:

```bash
npm run dev
```

4. Abrir http://localhost:5173 en el navegador.

Las dos terminales tienen que estar abiertas al mismo tiempo. Si el catálogo muestra "No se pudo conectar con el servidor", falta ejecutar `npm run mock`.

## Scripts

| Script | Descripción |
|---|---|
| `npm run dev` | Levanta la aplicación en modo desarrollo. |
| `npm run mock` | Levanta json-server con `src/data/db.json` en el puerto 3001. |
| `npm run build` | Genera la versión de producción. |
| `npm run preview` | Sirve localmente la versión de producción. |

## Inicio de sesión

El inicio de sesión es **simulado**: se valida en el navegador y el estado se guarda en `localStorage` (clave `cineteca-isLogged`). No es seguridad real.

Credenciales de prueba:

- Usuario: `jose` o `juli`
- Contraseña: `1234`

Comportamiento:

- - **Sin sesión:** se puede ver el catálogo y el detalle de cada película en modo lectura. El catálogo se muestra sin datos personales (todas las películas figuran como pendientes, sin favoritas, puntuaciones ni reseñas) y los botones de edición están deshabilitados. En Agregar se puede completar el formulario, pero el botón "Guardar" está deshabilitado. La navbar muestra "Login" en lugar de "Perfil", y entrar a `/perfil` redirige a `/login`.
- **Con sesión:** la aplicación funciona completa. En Perfil aparece el botón "Cerrar sesión", que devuelve al login.

## Estructura de `src`

`api`, `assets`, `components`, `data`, `hooks`, `layout`, `pages` y `styles`.

## Dependencias

`npm audit` no reporta vulnerabilidades (0 al 8 de noviembre de 2026). `json-server` se usa en su versión `1.0.0-beta`.