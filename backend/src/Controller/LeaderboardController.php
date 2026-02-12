<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
class LeaderboardController extends AbstractController
{
    public function __construct(
        private UserRepository $userRepository,
    ) {
    }

    #[Route('/leaderboard', methods: ['GET'])]
    public function index(Request $request): JsonResponse
    {
        $type = $request->query->get('type', 'players');

        if ($type === 'players') {
            $players = $this->userRepository->getTopPlayers(50);
            
            $leaderboard = [];
            foreach ($players as $index => $player) {
                $leaderboard[] = [
                    'rank' => $index + 1,
                    'username' => $player->getUsername(),
                    'class' => $player->getClass(),
                    'score' => $player->getScore(),
                    'wins' => $player->getWins(),
                    'streak' => $player->getStreak(),
                ];
            }

            return $this->json($leaderboard);
        }

        // Class leaderboard
        $classes = $this->userRepository->getClassLeaderboard();
        
        $leaderboard = [];
        foreach ($classes as $index => $classData) {
            $leaderboard[] = [
                'rank' => $index + 1,
                'class' => $classData['class'],
                'totalScore' => (int) $classData['totalScore'],
                'avgScore' => (int) $classData['avgScore'],
                'players' => (int) $classData['players'],
            ];
        }

        return $this->json($leaderboard);
    }
}
