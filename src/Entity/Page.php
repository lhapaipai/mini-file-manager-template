<?php

namespace App\Entity;

use App\Repository\PageRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=PageRepository::class)
 */
class Page
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $title;

    /**
     * @ORM\ManyToMany(targetEntity=UploadedFile::class)
     */
    private $photos;

    public function __construct()
    {
        $this->photos = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @return Collection|UploadedFile[]
     */
    public function getPhotos(): Collection
    {
        return $this->photos;
    }

    public function addPhoto(UploadedFile $photo): self
    {
        if (!$this->photos->contains($photo)) {
            $this->photos[] = $photo;
        }

        return $this;
    }

    public function removePhoto(UploadedFile $photo): self
    {
        $this->photos->removeElement($photo);

        return $this;
    }
}
