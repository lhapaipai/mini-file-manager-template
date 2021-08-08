<?php

namespace App\Controller;

use Pentatrion\UploadBundle\Service\FileManagerHelper;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ManagerController extends AbstractController
{
    #[Route('/', name: 'manager')]
    public function index(FileManagerHelper $fileManagerHelper): Response
    {
        $config = $fileManagerHelper->completeConfig([
            'isAdmin' => true,
            'entryPoints' => [
                [
                    'label' => 'Uploads',
                    'directory' => 'manager',
                    'origin' => 'public_uploads',
                    'readOnly' => false,
                    'icon' => 'fa-lock'
                ]
            ],
                
        ]);
        return $this->render('manager/index.html.twig', [
            'fileManagerConfig' => $config,
        ]);
    }
}
