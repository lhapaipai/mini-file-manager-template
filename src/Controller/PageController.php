<?php

namespace App\Controller;

use App\Entity\Page;
use App\Form\PageType;
use App\Repository\PageRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/page')]
class PageController extends AbstractController
{


    #[Route('/', name: 'page_index', methods: ['GET'])]
    public function index(PageRepository $pageRepository): Response
    {
        return $this->render('page/index.html.twig', [
            'pages' => $pageRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'page_new', methods: ['GET', 'POST'])]
    public function new(Request $request): Response
    {
        $page = new Page();
        $form = $this->createForm(PageType::class, $page);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($page);
            $entityManager->flush();

            return $this->redirectToRoute('page_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('page/edit.html.twig', [
            'page' => $page,
            'form' => $form,
        ]);
    }


    #[Route('/{id}/edit', name: 'page_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Page $page): Response
    {
        $form = $this->createForm(PageType::class, $page);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('page_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('page/edit.html.twig', [
            'page' => $page,
            'form' => $form,
        ]);
    }
}
