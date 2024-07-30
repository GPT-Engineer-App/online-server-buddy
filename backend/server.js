const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let gameState = {
  number: Math.floor(Math.random() * 100) + 1,
  attempts: 0,
  gameOver: false
};

app.get('/game', (req, res) => {
  res.json({ attempts: gameState.attempts, gameOver: gameState.gameOver });
});

app.post('/guess', (req, res) => {
  const { guess } = req.body;
  
  if (gameState.gameOver) {
    return res.json({ message: 'The game is over. Start a new game.' });
  }

  gameState.attempts++;

  if (guess === gameState.number) {
    gameState.gameOver = true;
    res.json({ message: `Congratulations! You guessed the number in ${gameState.attempts} attempts.` });
  } else if (guess < gameState.number) {
    res.json({ message: 'Too low! Try a higher number.' });
  } else {
    res.json({ message: 'Too high! Try a lower number.' });
  }
});

app.post('/newgame', (req, res) => {
  gameState = {
    number: Math.floor(Math.random() * 100) + 1,
    attempts: 0,
    gameOver: false
  };
  res.json({ message: 'New game started.' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
