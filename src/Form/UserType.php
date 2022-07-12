<?php

namespace App\Form;

use App\Entity\User;
use App\Form\Type\FilePickerType;
use App\Service\AppFileManagerHelper;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserType extends AbstractType
{
    private $appFileManagerHelper;

    public function __construct(AppFileManagerHelper $appFileManagerHelper)
    {
        $this->appFileManagerHelper = $appFileManagerHelper;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name')
            ->add('avatar', FilePickerType::class, [
                'required' => false,
                'fileManagerConfig' => $this->appFileManagerHelper->completeConfig([
                    'entryPoints' => [
                        [
                            'label' => 'Uploads',
                            'directory' => 'user',
                            'origin' => 'public_uploads',
                        ]
                    ],
                    'fileValidation' => [
                        'mimeGroup' => 'image',
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
            'data_class' => User::class,
        ]);
    }
}
