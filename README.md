# Mini File Manager Starter Template

This repository presents a complete example of the integration of the [mini-file-manager](https://github.com/lhapaipai/mini-file-manager) package with the [pentatrion/upload-bundle](https://github.com/lhapaipai/upload-bundle) bundle in a Symfony backend.

## Installation

```bash
git clone https://github.com/lhapaipai/mini-file-manager-template.git

git submodule update --init

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

## pentatrion/upload-bundle configuration for MiniFileManager

If you use this bundle with MiniFileManager and liipImagineBundle, you need to add additional filters.

```yaml
# config/packages/pentatrion_upload.yaml
# default configuration
pentatrion_upload:
  file_infos_helper: 'Pentatrion\UploadBundle\Service\FileInfosHelper'
  origins:
    public_uploads:
      # if directory is inside %kernel.project_dir%/public, files
      # will be directly accessible.
      path: "%kernel.project_dir%/public/uploads"
      # prefix to add in order to be found by a liip_imagine loader
      liip_path: "/uploads"

    # # if you want private upload directory
    # private_uploads:
    #   path: "%kernel.project_dir%/var/uploads"
    #   liip_path: ""
  liip_filters: ["small", "large"]
```

```yaml
# config/packages/liip_imagine.yaml
liip_imagine:
  driver: "gd"

  # define filters defined in pentatrion_upload.liip_filters
  # (at least small filter)
  filter_sets:
    small:
      filters:
        thumbnail: { size: [250, 250], mode: inset, allow_upscale: true }

    large:
      filters:
        thumbnail: { size: [1500, 1500], mode: inset, allow_upscale: false }

  loaders:
    default:
      filesystem:
        data_root:
          # must be linked with pentatrion_upload -> origin.[origin-name].liip_path
          - "%kernel.project_dir%/public"

          # if you want private upload directory
          # - "%kernel.project_dir%/var/uploads"
```

