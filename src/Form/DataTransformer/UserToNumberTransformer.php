<?php

namespace App\Form\DataTransformer;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Form\DataTransformerInterface;
use Symfony\Component\Form\Exception\TransformationFailedException;

class UserToNumberTransformer implements DataTransformerInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {

    }

    public function transform($user): string
    {
        if (!is_null($user)&& $user instanceof User) {
            return $user->getId();
        }

        return '';
    }

    public function reverseTransform($userId): ?User
    {
        if (!$userId) {
            return null;
        }

        $user = $this->entityManager
            ->getRepository(User::class)
            ->find($userId);

        if (null === $user) {
            throw new TransformationFailedException('an user with number '.$userId.' does not exist!');
        }

        return $user;
    }
}