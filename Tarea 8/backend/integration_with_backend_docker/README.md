# Integration del backend usando Docker

Proyecto que encapsula el servidor de express dentro de un contenedor de docker.

- Construir la imagen: `docker build -t docker.io/library/universidad:2021-semi-desix-express .`
- Ejecutar el contendor (Luego de construir la imagen): `docker run -it -p 4000:4000  docker.io/library/universidad:2021-semi-desix-express`
- Para detener todos los contenedores que se estén ejecutando: `docker stop $(docker ps -aq)`
    - Este comando solamente funciona en linux/mac.

## Referencias:
- Archivo de docker compose: https://docs.docker.com/compose/compose-file/
- Archivo de docker: https://docs.docker.com/engine/reference/builder/
- Instalación de docker: https://www.docker.com/products/docker-desktop
- Dockerhub de node: https://hub.docker.com/_/node?tab=description&page=1&ordering=last_updated