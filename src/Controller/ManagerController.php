<?php

namespace App\Controller;

use Pentatrion\UploadBundle\Service\FileManagerHelper;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ManagerController extends AbstractController
{
    #[Route('/', name: 'file_manager')]
    public function index(FileManagerHelper $fileManagerHelper): Response
    {
        $config = $fileManagerHelper->completeConfig([
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
        ]);
        return $this->render('default/manager.html.twig', [
            'fileManagerConfig' => $config,
        ]);
    }

    #[Route('/file-picker', name: 'file_picker')]
    public function filePicker(FileManagerHelper $fileManagerHelper): Response
    {
        $config = $fileManagerHelper->completeConfig([
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
            'multiSelection' => true
                
        ]);
        return $this->render('default/picker.html.twig', [
            'fileManagerConfig' => $config,
        ]);
    }

}
