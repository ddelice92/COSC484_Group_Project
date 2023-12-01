import React, { useEffect, useState } from "react"
import Header from "../components/header"
import useWebSocket from 'react-use-websocket';


export default function TicTacToe() {
    const { sendJsonMessage, lastJsonMessage } = useWebSocket('ws://localhost:8080', {
        shouldReconnect: (closeEvent) => true,
        reconnectInterval: 1,
        reconnectAttempts: 5
    });
    const [gameName, setGameName] = useState('');
    const [gameData, setGameData] = useState([]);//The current board for the game

    useEffect(() => {

        if (lastJsonMessage !== null) {//Whenever a json message is received, refresh gameData 
            setGameData(lastJsonMessage.currentBoard);
            console.log(gameData);
        }
    }, [lastJsonMessage, setGameData, gameData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const message = {
            type: 'getGame',
            message: gameName
        }
        sendJsonMessage(message);//Sends a json message to the node server to request data for gameName
    }

    const renderGameData = (gameData) => {//Renders the game data as a list
        return (
            <ul>
                {gameData.map((element, index) => (
                    <li key={index}>{element}</li>
                ))}
            </ul>
        );
    };


    return (
        <div>
            <Header />
            <h1>Tic-Tac-Toe</h1>
            <form onSubmit={handleSubmit}>
                <label for="text">Game name</label>
                <input value={gameName} onChange={(e) => setGameName(e.target.value)} type="text" id="gamename" name="gamename"></input>
                <button type="submit" id="button">Get game data</button>
            </form>
            <div>
                {renderGameData(gameData)}
            </div>

        </div>
    )
}