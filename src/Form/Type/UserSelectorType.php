<?php

namespace App\Form\Type;

use App\Form\DataTransformer\UserToNumberTransformer;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserSelectorType extends AbstractType
{
    public function __construct(
        private UserToNumberTransformer $userToNumberTransformer
    ) {

    }
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->addModelTransformer($this->userToNumberTransformer);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'invalid_message' => 'The selected user does not exist'
        ]);
    }

    public function getParent()
    {
        return TextType::class;
    }
}