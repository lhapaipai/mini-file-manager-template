<?php

namespace App\Form\EasyAdminField;

use App\Form\Type\LonLatType;
use EasyCorp\Bundle\EasyAdminBundle\Contracts\Field\FieldInterface;
use EasyCorp\Bundle\EasyAdminBundle\Field\FieldTrait;

final class MapField implements FieldInterface
{
    use FieldTrait;

    public static function new(string $propertyName, $label = null): self
    {
        return (new self())
            ->setProperty($propertyName)
            ->setLabel($label)

            ->setTemplatePath('admin/field/map.html.twig')
            ->setFormType(LonLatType::class)
            ->addCssClass('field-map')
            ->addWebpackEncoreEntries('admin-field-map')
            ->addCssFiles('https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/leaflet.css')
            ->addJsFiles('https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/leaflet.js');
    }
}
