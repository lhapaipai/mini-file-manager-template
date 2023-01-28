<?php

namespace App\Form;

use App\Entity\Page;
use Pentatrion\UploadBundle\Form\EntitiesFilePickerType;
use Pentatrion\UploadBundle\Service\FileManagerHelperInterface;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

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
                        ],
                    ],
                    'themePrefix' => $options['themePrefix'],
                ]),
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Page::class,
            'themePrefix' => 'penta',
        ]);
    }
}
