import React, { useEffect, useState, useRef } from "react"
import Header from "../components/header"
import useWebSocket from 'react-use-websocket';
import AuthUser from '../components/authUser'
import s from "../CSS/connectfour.module.css"
import { useAuth } from '../context/user.context';
import { Select } from "@mui/material";

export default function ConnectFour() {
    const { token } = useAuth();
    var [gameName, setGameName] = useState('');
    const { sendJsonMessage, lastJsonMessage } = useWebSocket('ws://localhost:8080', {
        shouldReconnect: (closeEvent) => true,
        reconnectInterval: 1,
        reconnectAttempts: 5,
    });
    const [gameData, setGameData] = useState([]); // The current board for the game
    const [selectedColumn, setSelectedColumn] = useState([]); // Changed from selectedBoxes
    const [side, setSide] = useState('');
    const [turn, setTurn] = useState('');
    const [winner, setWinner] = useState('');

    const canvasRef = useRef(null);

    useEffect(() => {
        console.log(JSON.stringify(lastJsonMessage));
        if (lastJsonMessage !== null) {
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
            setGameData(Array.from({ length: 7 }, () => Array(6).fill('e')));
        }
    }, [lastJsonMessage]);

    useEffect(() => {
        if (winner) {
            alert(winner + " has won the game.");
        }
    }, [winner]);

    useEffect(() => {
        if (gameData != null) {
            drawBoard();
        }
    }, [gameData, selectedColumn]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const message = {
            type: 'connectGame',
            gameName: gameName,
            session_id: token,
            gameType: "connectFour"
        };

        sendJsonMessage(message);
    };

    const handleMove = (e) => {
        e.preventDefault();
        console.log(turn + " : " + side);
        if (selectedColumn === null) {
            alert("Choose a move first.");
        } else if (winner === 'x' || winner === 'o') {
            alert("Game already complete, " + winner + " has won.");
        } else if (turn === side) {
            const message = {
                type: 'makeMove',
                message: [selectedColumn, side],
                gameName: gameName,
                gameType: "connectFour"
            };
            console.log(message);
            sendJsonMessage(message);
        } else {
            alert("Not your turn.");
        }
    };

    const drawBoard = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the board lines
        for (let i = 0; i <= 7; i++) {
            context.beginPath();
            context.moveTo(i * 100, 0);
            context.lineTo(i * 100, 600);
            context.stroke();
        }

        for (let i = 0; i <= 6; i++) {
            context.beginPath();
            context.moveTo(0, i * 100);
            context.lineTo(700, i * 100);
            context.stroke();
        }

        if (selectedColumn !== null) {
            context.lineWidth = 5;
            const rectX = selectedColumn * 100;
            context.strokeRect(rectX, 0, 100, 600);
            context.lineWidth = 1;
        }

        // Draw discs
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 6; j++) {
                const disc = gameData[i]?.[j];
                if (disc === 'x') {
                    drawCross(context, i * 100 + 50, j * 100 + 50);
                } else if (disc === 'o') {
                    drawCircle(context, i * 100 + 50, j * 100 + 50);
                }
            }
        }
    };

    const drawCross = (context, x, y) => {
        context.beginPath();
        context.moveTo(x - 40, y - 40);
        context.lineTo(x + 40, y + 40);
        context.stroke();

        context.beginPath();
        context.moveTo(x + 40, y - 40);
        context.lineTo(x - 40, y + 40);
        context.stroke();
    };

    const drawCircle = (context, x, y) => {
        context.beginPath();
        context.arc(x, y, 40, 0, 2 * Math.PI);
        context.stroke();
    };

    const handleClick = (event) => {
        const canvas = canvasRef.current;
        const canvasRect = canvas.getBoundingClientRect();
        const x = Math.trunc(event.clientX - canvasRect.left);
        const y = Math.trunc(event.clientY - canvasRect.top);

        const column = Math.trunc(x / 100);
        setSelectedColumn(column);
        console.log(column);
    };

    return (
        <div>
            <AuthUser />
            <Header />
            <div className={s.container}>
                <form className={s.gameForm} onSubmit={handleSubmit}>
                    <label htmlFor="text">Game name</label>
                    <input value={gameName} onChange={(e) => setGameName(e.target.value)} type="text" id="gamename" name="gamename" />
                    <button type="submit" id="button">Get game data</button>
                </form>
                <form className={s.gameForm} onSubmit={handleMove}>
                    <div>{side}</div>
                    <button type="submit" id="button">Submit move</button>
                </form>
                <div className={s.canvasContainer}>
                    <canvas ref={canvasRef} onClick={handleClick} id="connect-four-canvas" width="700" height="600">
                    </canvas>
                </div>
            </div>
        </div>
    );
}