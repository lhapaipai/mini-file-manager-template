<?php

namespace App\Controller;

use App\Service\AppFileManagerHelper;
use Pentatrion\UploadBundle\Service\FileManagerHelper;
use Pentatrion\UploadBundle\Service\FileManagerHelperInterface;
use Pentatrion\ViteBundle\Asset\EntrypointRenderer;
use Pentatrion\ViteBundle\Asset\EntrypointsLookup;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ManagerController extends AbstractController
{
    const DEFAULT_MANAGER_CONFIG = [
        'entryPoints' => [
            [
                'label' => 'Uploads',
                'directory' => 'manager',
                'origin' => 'public_uploads',
                'readOnly' => false,
                'icon' => 'fa-lock'
            ]
        ],
        'fileUpload' => [
            'maxFileSize' => 512 * 1024,
        ],
        'theme' => "app-custom-theme"
    ];
    const MULTIPLE_MANAGER_CONFIG = [
        'entryPoints' => [
            [
                'label' => 'Uploads',
                'directory' => 'manager',
                'origin' => 'public_uploads',
                'readOnly' => false,
                'icon' => 'fa-lock'
            ]
        ],
        'fileUpload' => [
            'maxFileSize' => 512 * 1024,
        ],
        'theme' => "app-custom-theme",
        'multiple' => true
    ];

    #[Route('/welcome', name: 'welcome', methods: ['GET'])]
    public function welcome(): Response
    {
        return $this->render('default/welcome.html.twig');
    }

    #[Route('/', name: 'file_manager_default')]
    public function manager(FileManagerHelperInterface $fileManagerHelper): Response
    {
        $config = $fileManagerHelper->completeConfig(self::DEFAULT_MANAGER_CONFIG);
        return $this->render('default/manager.html.twig', [
            'fileManagerConfig' => $config,
            'provider' => 'default'
        ]);
    }

    #[Route('/manager/bric', name: 'file_manager_bric')]
    public function managerBric(FileManagerHelperInterface $fileManagerHelper): Response
    {
        $config = $fileManagerHelper->completeConfig(self::DEFAULT_MANAGER_CONFIG);
        return $this->render('default/manager.html.twig', [
            'fileManagerConfig' => $config,
            'provider' => 'bric'
        ]);
    }

    #[Route('/manager/ogoxe', name: 'file_manager_ogoxe')]
    public function managerOgoxe(FileManagerHelperInterface $fileManagerHelper): Response
    {
        $config = $fileManagerHelper->completeConfig(self::DEFAULT_MANAGER_CONFIG);
        return $this->render('default/manager.html.twig', [
            'fileManagerConfig' => $config,
            'provider' => 'ogoxe'
        ]);
    }

    #[Route('/file-manager-modal', name: 'file_manager_modal_default')]
    public function fileManagerModal(FileManagerHelperInterface $fileManagerHelper): Response
    {
        $config = $fileManagerHelper->completeConfig(self::MULTIPLE_MANAGER_CONFIG);
        return $this->render('default/manager-modal.html.twig', [
            'fileManagerConfig' => $config,
            'provider' => 'default'
        ]);
    }

    #[Route('/file-manager-modal/ogoxe', name: 'file_manager_modal_ogoxe')]
    public function fileManagerModalOgoxe(FileManagerHelperInterface $fileManagerHelper): Response
    {
        $config = $fileManagerHelper->completeConfig(self::MULTIPLE_MANAGER_CONFIG);
        return $this->render('default/manager-modal.html.twig', [
            'fileManagerConfig' => $config,
            'provider' => 'ogoxe'
        ]);
    }
}
