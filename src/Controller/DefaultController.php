<?php

namespace App\Controller;

use Pentatrion\UploadBundle\Service\FileManagerHelperInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{
    #[Route('/image', name: 'image', methods: ['GET'])]
    public function welcome(): Response
    {
        return $this->render('default/image.html.twig');
    }

    #[Route('/', name: 'basic_file_manager')]
    public function basicFileManager(): Response
    {
        return $this->render('default/basic-file-manager.html.twig');
    }

    #[Route('/manager/{theme}', name: 'file_manager', defaults: ['theme' => 'penta'])]
    public function manager(FileManagerHelperInterface $fileManagerHelper, $theme): Response
    {
        $config = $fileManagerHelper->completeConfig([
            'entryPoints' => [
                [
                    'label' => 'Uploads',
                    'directory' => 'manager',
                    'origin' => 'public_uploads',
                    'readOnly' => false,
                    'icon' => 'famfm-folder',
                ],
            ],
            'fileUpload' => [
                'maxFileSize' => 10 * 1024 * 1024,
            ],
        ]);
        if ('penta' !== $theme) {
            $config['themePrefix'] = $theme;
        }

        return $this->render('default/manager.html.twig', [
            'fileManagerConfig' => $config,
            'theme' => $theme,
        ]);
    }

    #[Route('/file-manager-modal/{theme}', name: 'file_manager_modal', defaults: ['theme' => 'penta'])]
    public function fileManagerModal(FileManagerHelperInterface $fileManagerHelper, $theme): Response
    {
        $config = $fileManagerHelper->completeConfig([
            'entryPoints' => [
                [
                    'label' => 'Uploads',
                    'directory' => 'manager',
                    'origin' => 'public_uploads',
                    'readOnly' => false,
                    'icon' => 'famfm-folder',
                ],
            ],
            'fileUpload' => [
                'maxFileSize' => 10 * 1024 * 1024,
            ],
            'fileValidation' => [
                'mimeGroup' => 'image',
                'imageOptions' => [
                    'ratio' => 1,
                ],
            ],
            'multiple' => true,
        ]);
        if ('penta' !== $theme) {
            $config['themePrefix'] = $theme;
            $config['showValidationString'] = false;
            $config['canEditImageSize'] = false;
        }

        return $this->render('default/manager-modal.html.twig', [
            'fileManagerConfig' => $config,
            'theme' => $theme,
        ]);
    }

    #[Route('/file-manager-preview/{theme}', name: 'file_manager_preview', defaults: ['theme' => 'penta'])]
    public function fileManagerPreview(FileManagerHelperInterface $fileManagerHelper, $theme): Response
    {
        $config = $fileManagerHelper->completeConfig([
            'entryPoints' => [
                [
                    'label' => 'Uploads',
                    'directory' => 'manager',
                    'origin' => 'public_uploads',
                    'readOnly' => false,
                    'icon' => 'famfm-folder',
                ],
            ],
            'fileUpload' => [
                'maxFileSize' => 10 * 1024 * 1024,
            ],
            'multiple' => false,
            'debug' => true,
        ]);
        if ('penta' !== $theme) {
            $config['themePrefix'] = $theme;
        }

        return $this->render('default/manager-preview.html.twig', [
            'fileManagerConfig' => $config,
            'theme' => $theme,
        ]);
    }
}
