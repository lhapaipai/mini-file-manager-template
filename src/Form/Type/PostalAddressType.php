<?php

namespace App\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\OptionsResolver\Options;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PostalAddressType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('addressLine1', TextType::class, [
                'help' => 'Street address, P.O. box, company name',
            ])
            ->add('addressLine2', TextType::class, [
                'help' => 'Apartment, suite, unit, building, floor',
            ])
            ->add('city', TextType::class)
            ->add('zipCode', TextType::class, [
                'label' => 'ZIP Code',
            ])
        ;

        if (true === $options['is_extended_address']) {
            $builder->add('addressLine3', TextType::class, [
                'help' => 'Extended address info',
            ]);
        }

        if (null !== $options['allowed_states']) {
            $builder
                ->add('state', ChoiceType::class, [
                    'label' => 'State',
                    'choices' => $options['allowed_states']
                ]);
        } else {
            $builder
                ->add('state', TextType::class, [
                    'label' => 'State/Province/Region',
                ]);
        }
    }

    public function buildView(FormView $view, FormInterface $form, array $options): void
    {
        $view->vars['isExtendedAddress'] = $options['is_extended_address'];
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'allowed_states' => null,
            'is_extended_address' => false
        ]);

        $resolver->setAllowedTypes('allowed_states', ['null', 'string', 'array']);
        $resolver->setAllowedTypes('is_extended_address', 'bool');

        $resolver->setNormalizer('allowed_states', static function (Options $options, $states) {
            if (null === $states) {
                return $states;
            }

            if (is_string($states)) {
                $states = (array) $states;
            }

            return array_combine(array_values($states), array_values($states));
        });
    }
}