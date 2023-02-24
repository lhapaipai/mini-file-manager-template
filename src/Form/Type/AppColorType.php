<?php

namespace App\Form\Type;

use App\Classes\Color;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\DataMapperInterface;
use Symfony\Component\Form\Exception\UnexpectedTypeException;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Traversable;

class AppColorType extends AbstractType implements DataMapperInterface
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('red', IntegerType::class, [
                // enforce the strictness of the type to ensure the constructor
                // of the Color class doesn't break
                'empty_data' => '0',
            ])
            ->add('green', IntegerType::class, [
                'empty_data' => '0',
            ])
            ->add('blue', IntegerType::class, [
                'empty_data' => '0',
            ])
            // configure the data mapper for this FormType
            ->setDataMapper($this)
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefault('empty_data', null);
    }

    // $this->createForm(TaskType::class, $task)
    public function mapDataToForms($viewData, Traversable $forms): void
    {
        // there is no data yet, so nothing to prepopulate
        if (null === $viewData) {
            return;
        }

        if (!$viewData instanceof Color) {
            throw new UnexpectedTypeException($viewData, Color::class);
        }

        $forms['red']->setData($viewData->getRed());
        $forms['green']->setData($viewData->getGreen());
        $forms['blue']->setData($viewData->getBlue());
    }

    // $form->handleRequest($request)
    // lors de l'appel à handleRequest $forms['red'] est remplit
    // mapFormsToData permet de faire le mapping.
    public function mapFormsToData(Traversable $forms, &$viewData): void
    {
        $forms = iterator_to_array($forms);

        $viewData = new Color(
            $forms['red']->getData(),
            $forms['green']->getData(),
            $forms['blue']->getData()
        );
    }
}