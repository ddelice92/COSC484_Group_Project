import React, { useRef, useEffect } from 'react';

const Checkerboard = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        drawBoard();
    }, []); // Empty dependency array to run the effect only once

    const drawBoard = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        const squareSize = 62.5;
        const boardSize = 8;

        // Draws the checkerboard
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const x = col * squareSize;
                const y = row * squareSize;

                // Alternates the color of the squares
                const color = (row + col) % 2 === 0 ? '#FAF5DC' : '#966A5B';

                context.fillStyle = color;
                context.fillRect(x, y, squareSize, squareSize);
            }
        }

        const pieceRadius = squareSize / 2.2 - 5;

        // Draws the white pieces
        for (let row = 0; row < 3; row++) {
            for (let col = (row + 1) % 2; col < boardSize; col += 2) {
                const x = col * squareSize + squareSize / 2;
                const y = row * squareSize + squareSize / 2;

                // Draw the white piece
                context.fillStyle = '#FAF5DC';
                context.beginPath();
                context.arc(x, y, pieceRadius, 0, 2 * Math.PI);
                context.fill();
            }
        }

        // Draw the black pieces
        for (let row = boardSize - 3; row < boardSize; row++) {
            for (let col = (row + 1) % 2; col < boardSize; col += 2) {
                const x = col * squareSize + squareSize / 2;
                const y = row * squareSize + squareSize / 2;

                // Draw the black piece
                context.fillStyle = '#5D5360';
                context.beginPath();
                context.arc(x, y, pieceRadius, 0, 2 * Math.PI);
                context.fill();
            }
        }
    };

    return (
        <canvas ref={canvasRef} width={500} height={500} style={{ borderRadius: '8px' }} />
    );
};

export default Checkerboard;
