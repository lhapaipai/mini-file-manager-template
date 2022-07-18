<?php

namespace App\Service;

use Pentatrion\UploadBundle\Service\FileManagerHelper;
use Pentatrion\UploadBundle\Service\FileManagerHelperInterface;

class AppFileManagerHelper extends FileManagerHelper
{
    public function completeConfig($baseConfig = [], $locale = 'fr'): array
    {
        $config = parent::completeConfig($baseConfig, $locale);
        $config['themePrefix'] = 'penta';
        $config['injectCssVars'] = true;

        return $config;
    }
}
