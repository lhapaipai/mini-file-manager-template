<?php

namespace App\Form;

use App\Entity\User;
use Pentatrion\UploadBundle\Form\EntityFilePickerType;
use Pentatrion\UploadBundle\Service\FileManagerHelperInterface;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserType extends AbstractType
{
    private $fileManagerHelper;

    public function __construct(FileManagerHelperInterface $fileManagerHelper)
    {
        $this->fileManagerHelper = $fileManagerHelper;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name', null, [
                'required' => false,
            ])
            ->add('avatar', EntityFilePickerType::class, [
                'required' => false,
                'fileManagerConfig' => [
                    'entryPoints' => [
                        [
                            'label' => 'Uploads',
                            'directory' => 'user',
                            'origin' => 'public_uploads',
                        ],
                    ],
                    'themePrefix' => 'bric',
                    'injectCssVars' => false,
                ],
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}
