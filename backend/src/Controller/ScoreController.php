<?php

namespace App\Controller;

use App\Entity\Score;
use App\Entity\User;
use App\Repository\ScoreRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
class ScoreController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private ScoreRepository $scoreRepository,
    ) {
    }

    #[Route('/scores', methods: ['POST'])]
    public function submit(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = $this->getUser();

        $score = new Score();
        $score->setGame($data['game'] ?? '');
        $score->setWon($data['won'] ?? false);
        $score->setScore($data['score'] ?? 0);
        $score->setDetails($data['details'] ?? null);

        if ($user instanceof User) {
            $score->setUser($user);

            // Update user stats
            $user->setTotalGames($user->getTotalGames() + 1);
            $user->setScore($user->getScore() + ($data['score'] ?? 0));

            if ($data['won'] ?? false) {
                $user->setWins($user->getWins() + 1);
                $user->setStreak($user->getStreak() + 1);
                if ($user->getStreak() > $user->getBestStreak()) {
                    $user->setBestStreak($user->getStreak());
                }
            } else {
                $user->setStreak(0);
            }
        }

        $this->em->persist($score);
        $this->em->flush();

        return $this->json($score->toArray(), 201);
    }

    #[Route('/scores', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        $scores = $this->scoreRepository->findByUser($user);

        return $this->json(array_map(fn($s) => $s->toArray(), $scores));
    }

    #[Route('/daily', methods: ['GET'])]
    public function dailyStatus(): JsonResponse
    {
        $user = $this->getUser();
        $games = ['wordJecna', 'connections', 'fixCode', 'crossRoute'];
        
        $status = [];
        foreach ($games as $game) {
            $played = false;
            if ($user instanceof User) {
                $played = $this->scoreRepository->hasPlayedToday($user, $game);
            }
            $status[$game] = ['played' => $played];
        }

        return $this->json($status);
    }
}
