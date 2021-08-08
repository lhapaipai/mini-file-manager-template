<?php

namespace App\Form;

use App\Entity\Post;
use Pentatrion\UploadBundle\Form\FilePickerType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PostType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('title')
            ->add('description')
            ->add('poster', FilePickerType::class, [
                'required' => false,
                'uploadDirectory' => 'form',
                'uploadOrigin' => 'public_uploads',
                'previewType' => 'image',
                'fileValidation' => [
                    'mimeGroup' => 'image',
                    'imageOptions' => [
                        'ratio' => 1,
                        'minWidth' => 300
                    ]
                ]
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Post::class,
        ]);
    }
}