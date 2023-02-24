<?php

namespace App\Controller;

use App\Entity\Task;
use App\Form\TaskType;
use App\Repository\TaskRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class TaskController extends AbstractController
{
    #[Route('/task', name: 'app_task')]
    public function index(
        Request $request,
        TaskRepository $taskRepository,
        FormFactoryInterface $formFactory,
        EntityManagerInterface $em
    ): Response
    {
        $task = $taskRepository->find(1);
        if (!$task) {
            $task = new Task();
        }

        $form = $this->createForm(TaskType::class, $task);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $task->setCoverPath('path/to/cover.png');
            $em->persist($task);
            $em->flush();
        }

        $formView = $form->createView();
        return $this->render('task/index.html.twig', [
            'form' => $formView,
        ]);
    }

    public function sandbox()
    {
        $task = new Task();
        $task->setTask('Write a blog post');
        $task->setDueDate(new \DateTime('tomorrow'));

        $form = $this->createFormBuilder($task)
            ->add('task', TextType::class)
            ->add('dueDate', DateType::class)
            ->add('save', SubmitType::class, [
                'label' => 'Create Task',
            ])
            ->getForm();
    }
}
