# Cineteca - Segunda entrega

Migración de Cineteca a React con Vite, SCSS y una base de datos simulada con json-server. La descripción completa del proyecto está en el README de la raíz del repositorio.

## Tecnologías

- React 19, con los hooks `useState`, `useEffect` y `useNavigate`
- Vite
- React Router DOM (rutas anidadas con `Outlet`)
- Sass (SCSS)
- json-server (API simulada, datos en `src/data/db.json`: colecciones `peliculas` y `accounts`)
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

## Servicios del mock

| Recurso | Acciones | Dónde se usa |
|---|---|---|
| `/peliculas` | GET, POST, PATCH y DELETE | Catálogo, detalle, Agregar y Perfil |
| `/accounts` | GET y POST | Login y Crear cuenta |

Las funciones que consumen el mock están en `src/api` y usan `fetch` con `async/await`.

## Inicio de sesión y creación de cuentas

El inicio de sesión es **simulado**: las cuentas se guardan en la colección `accounts` de `src/data/db.json` y el estado de sesión se guarda en `localStorage` (clave `cineteca-isLogged`). No es seguridad real: las contraseñas se guardan sin cifrar.

Credenciales de prueba:

- Usuario: `jose` o `juli`
- Contraseña: `1234`

Cómo funciona:

- **Iniciar sesión:** el formulario consulta las cuentas con un `GET` a `/accounts` y, si el usuario existe y la contraseña coincide, guarda la sesión.
- **Crear cuenta:** la página `/registro` valida los datos mientras se escribe, comprueba que el usuario no exista y guarda la cuenta nueva con un `POST` a `/accounts`. Después lleva al login.

Comportamiento según la sesión:

- **Sin sesión:** se puede ver el catálogo y el detalle de cada película en modo lectura. El catálogo se muestra sin datos personales (todas las películas figuran como pendientes, sin favoritas, puntuaciones ni reseñas) y los botones de edición están deshabilitados. En Agregar se puede completar el formulario, pero el botón "Guardar" está deshabilitado. La navbar muestra "Login" en lugar de "Perfil", y entrar a `/perfil` redirige a `/login`.
- **Con sesión:** la aplicación funciona completa. En Perfil aparece el botón "Cerrar sesión", que devuelve al login.
