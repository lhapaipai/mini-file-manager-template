<?php

namespace App\Classes;

final class Color
{
    private $red;
    private $green;
    private $blue;

    public function __construct(int $red, int $green, int $blue)
    {
        $this->red = $red;
        $this->green = $green;
        $this->blue = $blue;
    }

    public function getRed(): int
    {
        return $this->red;
    }

    public function getGreen(): int
    {
        return $this->green;
    }

    public function getBlue(): int
    {
        return $this->blue;
    }
}