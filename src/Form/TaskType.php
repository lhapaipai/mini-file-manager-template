<?php

namespace App\Form;

use App\Entity\Task;
use App\Form\Type\AppColorType;
use App\Form\Type\PostalAddressType;
use App\Form\Type\ShippingType;
use App\Form\Type\UserSelectorType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\CallbackTransformer;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class TaskType extends AbstractType
{

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('task', TextType::class)
            ->add('dueDate', DateType::class, [
                'required' => $options['require_due_date'],
            ])
            ->add('shipping', ShippingType::class, [
                'mapped' => false
            ])
            ->add('address', PostalAddressType::class, [
                'mapped' => false,
                'allowed_states' => ['CA', 'FL', 'TX']
            ])
            ->add('tags', TextType::class, [
            ])
            ->add('user', UserSelectorType::class)
            ->add('color', AppColorType::class, [
                'mapped' => false
            ])
            ->add('cover', FileType::class, [
                'mapped' => false,
                'image_property' => 'webPath'
            ])
            ->add('save', SubmitType::class, [
                'label' => 'Create Task',
            ]);

        $builder->get('tags')
            ->addModelTransformer(new CallbackTransformer(
                function ($tagsAsArray) {
                    return implode(', ', $tagsAsArray);
                },
                function ($tagsAsString) {
                    return explode(', ', $tagsAsString);
                }
            ));
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Task::class,
            'attr' => [
                'novalidate' => 'novalidate',
            ],
            'require_due_date' => false,
            'csrf_token_id' => 'paipai'
        ]);

        $resolver->setAllowedTypes('require_due_date', 'bool');
    }

    public function getBlockPrefix(): string
    {
        return 'contact';
    }
}
