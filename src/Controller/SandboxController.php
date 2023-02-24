<?php

namespace App\Controller;

use App\Entity\Comment;
use App\Form\CommentType;
use App\Repository\CommentRepository;
use Doctrine\ORM\EntityManagerInterface;
use Pentatrion\UploadBundle\Service\FileHelper;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class SandboxController extends AbstractController
{
    #[Route('/sandbox', name: 'app_sandbox')]
    public function index(
        Request $request,
        CommentRepository $commentRepository,
        EntityManagerInterface $em,
        FileHelper $fileHelper
    ): Response
    {
        $comment = $commentRepository->find(1);
        if (!$comment) {
            $comment = new Comment();
        }
        $form = $this->createForm(CommentType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $image = $form['image']->getData();
            if ($image) {
                $uploadedFile = $fileHelper->uploadFile($image, 'sandbox', 'public_uploads');

                $comment->setImagePath($uploadedFile->getUploadRelativePath());
            }
            $em->persist($comment);
            $em->flush();
        }

        $formView = $form->createView();
        return $this->render('sandbox/index.html.twig', [
            'comment' => $comment,
            'form' => $formView
        ]);
    }
}
