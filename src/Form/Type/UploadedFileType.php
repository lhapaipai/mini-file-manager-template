<?php

namespace App\Form\Type;

use App\Entity\UploadedFile;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UploadedFileType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('mimeType', HiddenType::class)
            ->add('width', HiddenType::class)
            ->add('height', HiddenType::class)
            ->add('filename', HiddenType::class)
            ->add('directory', HiddenType::class)
            ->add('origin', HiddenType::class);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => UploadedFile::class
        ]);
    }
}
