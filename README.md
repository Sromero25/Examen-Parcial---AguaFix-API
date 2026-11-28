<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Configuración local

Copie `.env.example` a `.env` y reemplace sus marcadores por valores locales. Todas las variables sin el comentario **Opcional** son obligatorias. No versionar `.env` ni usar valores de producción en el entorno local.

`AWS_REGION` y `AWS_S3_BUCKET` son obligatorias. `AWS_ACCESS_KEY_ID` y `AWS_SECRET_ACCESS_KEY` son opcionales y deben configurarse juntas solo fuera de AWS cuando sean necesarias. En EC2 se deben omitir ambas: el SDK obtiene credenciales mediante el IAM Role de la instancia.

`compose.yaml` es exclusivamente para desarrollo local: crea PostgreSQL 15 con volumen persistente, no publica el puerto de la base de datos y expone la API solo en `127.0.0.1:3000`. La API espera a que PostgreSQL esté saludable y ejecuta las migraciones pendientes al iniciar.

### Producción administrada

El Compose de producción es administrado por Terraform y no se sustituye con el archivo local de este repositorio. Su ubicación es `/opt/aguafix/compose.yaml`, propiedad de `root:root`, utiliza `/etc/aguafix/runtime.env` con permisos `root:root` y `0600`, y publica `80:3000`. PostgreSQL permanece en la red interna.

HTTP y las fotografías S3 con lectura pública solo se permiten para la demostración con datos ficticios. Para un entorno real se debe usar HTTPS y una política de acceso privada apropiada.

Una contraseña estuvo previamente versionada en un Compose histórico. Si fue utilizada, debe rotarse; no se debe reescribir el historial Git ni reproducirla.

### CI/CD y despliegue

Los Pull Requests hacia `main` solo ejecutan instalación, compilación y pruebas. Un `push` a `main` que supere esas validaciones publica `sromero25/aguafix-api:latest` y la etiqueta inmutable `sromero25/aguafix-api:sha-<SHA-del-commit>`. El despliegue usa la referencia inmutable `sromero25/aguafix-api@sha256:<digest>` emitida por el job de publicación, por lo que no depende de la etiqueta mutable `latest`. La concurrencia del workflow serializa publicaciones y despliegues para la misma referencia Git.

Secrets de GitHub requeridos:

| Secret | Responsable | Propósito |
| --- | --- | --- |
| `DOCKER_USER` | API | Usuario de Docker Hub autorizado para `sromero25/aguafix-api`. |
| `DOCKER_PASSWORD` | API | Token o contraseña de Docker Hub para publicar imágenes. |
| `EC2_HOST` | Infraestructura | Host DNS o IP de la EC2 de producción. |
| `EC2_SSH_KEY` | Infraestructura | Clave privada exclusiva del usuario de despliegue `aguafix-deploy`. |
| `EC2_KNOWN_HOSTS` | Infraestructura | Línea `known_hosts` previamente validada para la EC2. |

La infraestructura autoriza el acceso SSH del runner mediante un mecanismo restringido; no se debe abrir indiscriminadamente el puerto 22. El workflow se conecta como `aguafix-deploy`, no como `ubuntu`. Ese usuario no recibe acceso general a Docker ni a `sudo`, y SSH le aplica un comando forzado.

El workflow usa `StrictHostKeyChecking=yes`, valida el `known_hosts` y envía únicamente el comando forzado `sudo -n /usr/local/sbin/aguafix-deploy <digest>`. No abre una sesión remota ni ejecuta comandos adicionales. Después, el runner consulta `GET /` en `http://aguafix-eq1.ddns.net/` hasta 12 veces. Esta comprobación valida únicamente la disponibilidad HTTP básica de la ruta raíz; no sustituye las verificaciones del wrapper sobre PostgreSQL ni pruebas de S3 o SMTP.

#### Contrato obligatorio de `aguafix-deploy` (AguaFix-Infra)

**AguaFix-Infra** instala `/usr/local/sbin/aguafix-deploy` como `root:root` y no escribible por `aguafix-deploy`. El wrapper recibe exactamente un argumento que debe coincidir con `sromero25/aguafix-api@sha256:<64 caracteres hexadecimales en minúscula>`; debe rechazar cualquier otra entrada sin interpretarla mediante shell. El comando forzado SSH acepta exclusivamente `sudo -n /usr/local/sbin/aguafix-deploy <referencia>`.

El wrapper valida que `/etc/aguafix/runtime.env` sea `root:root` con modo `0600`, usa `/opt/aguafix/compose.yaml` root-owned y persiste el digest confirmado en `/etc/aguafix/deployed-image.env`. Establece la imagen API al argumento validado, ejecuta solo `docker compose pull api` y `docker compose up -d --no-deps api`, aplica bloqueo de concurrencia y realiza rollback al digest anterior si falla su healthcheck interno. No ejecuta `down`, elimina volúmenes ni recrea PostgreSQL.

Para comprobar manualmente el servicio, consulte `http://aguafix-eq1.ddns.net/`. Para recuperar una versión anterior, el responsable de infraestructura debe invocar el wrapper con una referencia digest previamente publicada. Solo realizar rollback si las migraciones aplicadas son compatibles hacia atrás: las migraciones no se revierten automáticamente.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
#Hola
