# Cineteca - Segunda entrega

Migración de Cineteca a React con Vite, SCSS y una base de datos simulada con json-server. La descripción completa del proyecto está en el README de la raíz del repositorio.

## Tecnologías
React, Vite, React Router, Sass (SCSS), json-server y localStorage.

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

Las dos terminales tienen que estar abiertas al mismo tiempo.