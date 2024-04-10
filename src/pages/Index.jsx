import React, { useState } from "react";
import { Box, Button, Grid, Heading, Text } from "@chakra-ui/react";

const BOARD_SIZE = 8;
const EMPTY = null;
const BLACK = "black";
const WHITE = "white";

const Index = () => {
  const [board, setBoard] = useState(createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState(BLACK);
  const [gameOver, setGameOver] = useState(false);

  function createInitialBoard() {
    const board = Array(BOARD_SIZE)
      .fill()
      .map(() => Array(BOARD_SIZE).fill(EMPTY));
    board[3][3] = WHITE;
    board[3][4] = BLACK;
    board[4][3] = BLACK;
    board[4][4] = WHITE;
    return board;
  }

  function placePiece(row, col) {
    if (gameOver || board[row][col] !== EMPTY) return;

    const newBoard = board.map((row) => [...row]);
    newBoard[row][col] = currentPlayer;
    flipPieces(newBoard, row, col);

    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === BLACK ? WHITE : BLACK);
    checkGameOver(newBoard);
  }

  function flipPieces(board, row, col) {
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];
    const opponent = currentPlayer === BLACK ? WHITE : BLACK;

    directions.forEach(([dx, dy]) => {
      let x = row + dx;
      let y = col + dy;
      let piecesToFlip = [];

      while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE && board[x][y] === opponent) {
        piecesToFlip.push([x, y]);
        x += dx;
        y += dy;
      }

      if (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE && board[x][y] === currentPlayer) {
        piecesToFlip.forEach(([px, py]) => {
          board[px][py] = currentPlayer;
        });
      }
    });
  }

  function checkGameOver(board) {
    if (board.every((row) => row.every((cell) => cell !== EMPTY))) {
      setGameOver(true);
    }
  }

  function getWinner() {
    const blackCount = board.flat().filter((cell) => cell === BLACK).length;
    const whiteCount = board.flat().filter((cell) => cell === WHITE).length;
    if (blackCount > whiteCount) return BLACK;
    if (whiteCount > blackCount) return WHITE;
    return null;
  }

  return (
    <Box maxWidth="400px" mx="auto" mt={8}>
      <Heading mb={4}>Othello</Heading>
      <Grid templateColumns={`repeat(${BOARD_SIZE}, 1fr)`} gap={1}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Box key={`${rowIndex}-${colIndex}`} bg="green.500" borderRadius="md" h="50px" display="flex" justifyContent="center" alignItems="center" onClick={() => placePiece(rowIndex, colIndex)} cursor="pointer">
              {cell && <Box bg={cell} borderRadius="50%" w="80%" h="80%" />}
            </Box>
          )),
        )}
      </Grid>
      <Text mt={4}>Current Player: {currentPlayer}</Text>
      {gameOver && (
        <Box mt={4}>
          <Text>Game Over!</Text>
          <Text>Winner: {getWinner() || "It's a tie!"}</Text>
          <Button mt={2} onClick={() => window.location.reload()}>
            Play Again
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Index;
