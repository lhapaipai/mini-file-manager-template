<?php

namespace App\Repository;

use App\Entity\UploadedFile;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method UploadedFile|null find($id, $lockMode = null, $lockVersion = null)
 * @method UploadedFile|null findOneBy(array $criteria, array $orderBy = null)
 * @method UploadedFile[]    findAll()
 * @method UploadedFile[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UploadedFileRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UploadedFile::class);
    }

    // /**
    //  * @return UploadedFile[] Returns an array of UploadedFile objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('u.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?UploadedFile
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
