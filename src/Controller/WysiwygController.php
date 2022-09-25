<?php

namespace App\Controller;

use Pentatrion\UploadBundle\Service\FileManagerHelper;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/wysiwyg')]
class WysiwygController extends AbstractController
{
    #[Route('/tinymce', name: 'tinymce')]
    public function tinymce(FileManagerHelper $fileManagerHelper): Response
    {
        return $this->render('wysiwyg/tinymce.html.twig');
    }

    #[Route('/ckeditor', name: 'ckeditor')]
    public function ckeditor(): Response
    {
        return $this->render('wysiwyg/ckeditor.html.twig');
    }
}
