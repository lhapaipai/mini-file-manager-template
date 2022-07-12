<?php

namespace App\Form;

use App\Entity\Post;
use Pentatrion\UploadBundle\Form\FilePickerLegacyType;
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
            ->add('poster', FilePickerLegacyType::class, [
                'fileManagerConfig' => [
                    'entryPoints' => [
                        [
                            'label' => 'Uploads',
                            'directory' => 'form',
                            'origin' => 'public_uploads',
                        ]
                    ],
                    'fileUpload' => [
                        'maxFileSize' => 512 * 1024 *  1024,
                    ],
                    'fileValidation' => [
                        'imageOptions' => [
                            'ratio' => 1
                        ]
                    ]
                ],
                'formPreviewConfig' => [
                    'multiple' => true,
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
