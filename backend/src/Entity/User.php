<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50, unique: true)]
    private ?string $username = null;

    #[ORM\Column(length: 180, unique: true)]
    private ?string $email = null;

    #[ORM\Column]
    private ?string $password = null;

    #[ORM\Column(length: 10, nullable: true)]
    private ?string $class = null;

    #[ORM\Column]
    private int $totalGames = 0;

    #[ORM\Column]
    private int $wins = 0;

    #[ORM\Column]
    private int $streak = 0;

    #[ORM\Column]
    private int $bestStreak = 0;

    #[ORM\Column]
    private int $score = 0;

    #[ORM\Column]
    private \DateTimeImmutable $createdAt;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Score::class)]
    private Collection $scores;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->scores = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;
        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;
        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;
        return $this;
    }

    public function getClass(): ?string
    {
        return $this->class;
    }

    public function setClass(?string $class): static
    {
        $this->class = $class;
        return $this;
    }

    public function getTotalGames(): int
    {
        return $this->totalGames;
    }

    public function setTotalGames(int $totalGames): static
    {
        $this->totalGames = $totalGames;
        return $this;
    }

    public function getWins(): int
    {
        return $this->wins;
    }

    public function setWins(int $wins): static
    {
        $this->wins = $wins;
        return $this;
    }

    public function getStreak(): int
    {
        return $this->streak;
    }

    public function setStreak(int $streak): static
    {
        $this->streak = $streak;
        return $this;
    }

    public function getBestStreak(): int
    {
        return $this->bestStreak;
    }

    public function setBestStreak(int $bestStreak): static
    {
        $this->bestStreak = $bestStreak;
        return $this;
    }

    public function getScore(): int
    {
        return $this->score;
    }

    public function setScore(int $score): static
    {
        $this->score = $score;
        return $this;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getScores(): Collection
    {
        return $this->scores;
    }

    // UserInterface methods
    public function getRoles(): array
    {
        return ['ROLE_USER'];
    }

    public function eraseCredentials(): void
    {
    }

    public function getUserIdentifier(): string
    {
        return $this->email;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'email' => $this->email,
            'class' => $this->class,
            'stats' => [
                'totalGames' => $this->totalGames,
                'wins' => $this->wins,
                'streak' => $this->streak,
                'bestStreak' => $this->bestStreak,
                'score' => $this->score,
            ],
            'createdAt' => $this->createdAt->format('Y-m-d H:i:s'),
        ];
    }
}
