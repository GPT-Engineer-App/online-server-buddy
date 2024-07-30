import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const Index = () => {
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');

  const { data: gameState, refetch } = useQuery({
    queryKey: ['gameState'],
    queryFn: async () => {
      const response = await fetch('https://number-guessing-game-backend.onrender.com/game');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });

  const guessMutation = useMutation({
    mutationFn: async (guessNumber) => {
      const response = await fetch('https://number-guessing-game-backend.onrender.com/guess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guess: guessNumber }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    onSuccess: (data) => {
      setMessage(data.message);
      refetch();
    },
  });

  const handleGuess = () => {
    guessMutation.mutate(parseInt(guess));
    setGuess('');
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">Number Guessing Game</h1>
        <p className="mb-4">Guess a number between 1 and 100</p>
        <div className="flex mb-4">
          <Input
            type="number"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Enter your guess"
            className="mr-2"
          />
          <Button onClick={handleGuess}>Guess</Button>
        </div>
        {message && (
          <Alert className="mb-4">
            <AlertTitle>Result</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        {gameState && (
          <div>
            <p>Attempts: {gameState.attempts}</p>
            {gameState.gameOver && (
              <Button onClick={() => refetch()} className="mt-4">New Game</Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
