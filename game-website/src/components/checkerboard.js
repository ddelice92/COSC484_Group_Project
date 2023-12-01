import React, { useEffect, useState, useRef } from "react"
import useWebSocket from 'react-use-websocket';

const Checkerboard = () => {
    const canvasRef = useRef(null);
    const { sendJsonMessage, lastJsonMessage } = useWebSocket('ws://localhost:8080', {
        shouldReconnect: (closeEvent) => true,
        reconnectInterval: 1,
        reconnectAttempts: 5,
    });
    const [side, setSide] = useState('');
    const [turn, setTurn] = useState('');
    const [winner, setWinner] = useState('');
    const [gameData, setGameData] = useState([
        "e", "w", "e", "w", "e", "w", "e", "w",
        "w", "e", "w", "e", "w", "e", "w", "e",
        "e", "w", "e", "w", "e", "w", "e", "w",
        "e", "e", "e", "e", "e", "e", "e", "e",
        "e", "e", "e", "e", "e", "e", "e", "e",
        "b", "e", "b", "e", "b", "e", "b", "e",
        "e", "b", "e", "b", "e", "b", "e", "b",
        "b", "e", "b", "e", "b", "e", "b", "e"]);

    useEffect(() => {
        drawBoard();
    }, []); // Empty dependency array to run the effect only once


    useEffect(() => {
        console.log(JSON.stringify(lastJsonMessage));
        if (lastJsonMessage !== null) {//Whenever a json message is received, refresh gameData 
            if (lastJsonMessage.type === "success") {
                setSide(lastJsonMessage.side);
            } else if (lastJsonMessage.error) {
                if (lastJsonMessage.error === "GAME_FULL") {
                    alert("Tried to join a full game");
                }
            } else if (lastJsonMessage.type === "update") {
                setGameData(lastJsonMessage.game.currentBoard);
                setTurn(lastJsonMessage.game.nextToMove);
            } else if (lastJsonMessage.type === "winner") {
                setWinner(lastJsonMessage.winner);
                console.log("winner is " + lastJsonMessage.winner);
            }
        } else {
            setGameData([
                "e", "w", "e", "w", "e", "w", "e", "w",
                "w", "e", "w", "e", "w", "e", "w", "e",
                "e", "w", "e", "w", "e", "w", "e", "w",
                "e", "e", "e", "e", "e", "e", "e", "e",
                "e", "e", "e", "e", "e", "e", "e", "e",
                "b", "e", "b", "e", "b", "e", "b", "e",
                "e", "b", "e", "b", "e", "b", "e", "b",
                "b", "e", "b", "e", "b", "e", "b", "e"]);
        }
    }, [lastJsonMessage]);

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

        for (let cell = 0; cell < 64; cell++) {
            const col = cell % 8;
            const row = Math.trunc(cell /8) ;
            if (gameData[cell] === 'w') {
                const x = col * squareSize + squareSize / 2;
                const y = row * squareSize + squareSize / 2;

                // Draw the white piece
                context.fillStyle = '#FAF5DC';
                context.beginPath();
                context.arc(x, y, pieceRadius, 0, 2 * Math.PI);
                context.fill();
            } else if (gameData[cell] === 'b') {
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
