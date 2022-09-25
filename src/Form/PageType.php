<?php

namespace App\Form;

use App\Entity\Page;
use App\Form\Type\UploadedFileType;
use Pentatrion\UploadBundle\Form\EntitiesFilePickerType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Pentatrion\UploadBundle\Service\FileManagerHelperInterface;

class PageType extends AbstractType
{
    private $fileManagerHelper;

    public function __construct(FileManagerHelperInterface $fileManagerHelper)
    {
        $this->fileManagerHelper = $fileManagerHelper;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('title')
            ->add('photos', EntitiesFilePickerType::class, [
                'fileManagerConfig' => $this->fileManagerHelper->completeConfig([
                    'entryPoints' => [
                        [
                            'label' => 'Uploads',
                            'directory' => 'user',
                            'origin' => 'public_uploads',
                        ]
                    ],
                ])
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Page::class,
        ]);
    }
}
