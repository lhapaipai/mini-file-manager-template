<?php

namespace App\Form\EasyAdminField;

use App\Form\Type\FilesPickerType;
use App\Form\Type\UploadedFileType;
use EasyCorp\Bundle\EasyAdminBundle\Contracts\Field\FieldInterface;
use EasyCorp\Bundle\EasyAdminBundle\Field\CollectionField;
use EasyCorp\Bundle\EasyAdminBundle\Field\FieldTrait;
use Pentatrion\UploadBundle\Entity\UploadedFile;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;

final class FilesPickerField implements FieldInterface
{
    use FieldTrait;

    public static function new(string $propertyName, $label = null): self
    {
        return (new self())
            ->setProperty($propertyName)
            ->setLabel($label)
            ->setTemplateName('crud/field/collection')
            // ->setTemplatePath('admin/field/uploaded_files.html.twig')
            ->setFormType(FilesPickerType::class)
            // ->addWebpackEncoreEntries('form_file_picker')
            ->setCustomOption(CollectionField::OPTION_ALLOW_ADD, true)
            ->setCustomOption(CollectionField::OPTION_ALLOW_DELETE, true)
            ->setCustomOption(CollectionField::OPTION_ENTRY_IS_COMPLEX, true)
            ->setCustomOption(CollectionField::OPTION_ENTRY_TYPE, UploadedFile::class)
            ->setCustomOption(CollectionField::OPTION_RENDER_EXPANDED, true);
    }
}
