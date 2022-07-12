<?php

namespace App\Form;

use App\Entity\Page;
use App\Form\Type\FilesPickerType;
use App\Form\Type\UploadedFileType;
use App\Service\AppFileManagerHelper;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PageType extends AbstractType
{
    private $appFileManagerHelper;

    public function __construct(AppFileManagerHelper $appFileManagerHelper)
    {
        $this->appFileManagerHelper = $appFileManagerHelper;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('title')
            ->add('photos', FilesPickerType::class, [
                'entry_type' => UploadedFileType::class,
                'allow_add' => true,
                'allow_delete' => true,
                'fileManagerConfig' => $this->appFileManagerHelper->completeConfig([
                    'entryPoints' => [
                        [
                            'label' => 'Uploads',
                            'directory' => 'user',
                            'origin' => 'public_uploads',
                        ]
                    ],
                ]),
                'filePickerConfig' => [
                    'filter'        => 'small',
                    'type'          => 'image'
                ]
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Page::class,
        ]);
    }
}
