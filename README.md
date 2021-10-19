# Mini File Manager Starter Template

This repository presents a complete example of the integration of the [mini-file-manager](https://github.com/lhapaipai/mini-file-manager) package with the [pentatrion/upload-bundle](https://github.com/lhapaipai/upload-bundle) bundle in a Symfony backend.

## Installation

```bash
chmod -R 777 var/{cache,log} public/{uploads,media}

composer install
# configure DATABASE_URL from .env (form example)
symfony console doctrine:database:create
symfony console doctrine:migrations:migrate -n

npm install
npm run build
```

## Dependancies

<p align="center">
  <img width="100" src="https://raw.githubusercontent.com/lhapaipai/mini-file-manager/main/docs/symfony.svg" alt="Symfony logo">
  <img width="100" src="https://raw.githubusercontent.com/lhapaipai/mini-file-manager/main/docs/vue.svg" alt="Vue logo">
  <img width="100" src="https://raw.githubusercontent.com/lhapaipai/vite-bundle/main/docs/vitejs.svg" alt="Vite logo">

</p>
