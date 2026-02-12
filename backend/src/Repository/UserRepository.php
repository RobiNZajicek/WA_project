<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;

class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function upgradePassword(\Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        $user->setPassword($newHashedPassword);
        $this->getEntityManager()->persist($user);
        $this->getEntityManager()->flush();
    }

    public function findByEmailOrUsername(string $identifier): ?User
    {
        return $this->createQueryBuilder('u')
            ->where('u.email = :identifier OR u.username = :identifier')
            ->setParameter('identifier', $identifier)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function getTopPlayers(int $limit = 50): array
    {
        return $this->createQueryBuilder('u')
            ->orderBy('u.score', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    public function getClassLeaderboard(): array
    {
        return $this->createQueryBuilder('u')
            ->select('u.class, SUM(u.score) as totalScore, COUNT(u.id) as players, AVG(u.score) as avgScore')
            ->where('u.class IS NOT NULL')
            ->groupBy('u.class')
            ->orderBy('avgScore', 'DESC')
            ->getQuery()
            ->getResult();
    }
}
