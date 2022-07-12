<?php

namespace App\Manager\Upload;

use App\Entity\Training;

class AppFileManagerHelper
{
    public static function completeConfigOgoxe($baseConfig = [], $locale = 'fr'): array
    {
        $entryPoints = $baseConfig['entryPoints'];

        $completeEntryPoints = [];
        foreach ($entryPoints as $entryPoint) {
            $completeEntryPoints[] = array_merge([
                'directory' => '',
                'origin' => 'public_uploads',
                'readOnly' => false,
                'icon' => 'fa-link-1',
                'label' => 'Default directory'
            ], $entryPoint);
        }
        $fileUpload = isset($baseConfig['fileUpload']) && is_array($baseConfig['fileUpload'])
            ? $baseConfig['fileUpload']
            : [];
        $fileUpload = array_merge([
            'maxFileSize' => 10 * 1024 * 1024,
            'fileType' => [
                "text/*",
                "image/*", // image/vnd.adobe.photoshop  image/x-xcf
                "video/*",
                "audio/*"
            ]
        ], $fileUpload);

        unset($baseConfig['entryPoints']);
        unset($baseConfig['fileUpload']);

        return array_merge([
            'endPoint' => "/media-manager",
            'fileValidation' => null,
            'entryPoints' => $completeEntryPoints,
            'fileUpload' => $fileUpload,
            'locale' => $locale,
            'theme' => "mini-file-manager-custom-theme",
            'themePrefix' => "ogoxe",
            'multiple' => false

        ], $baseConfig);
    }
}
