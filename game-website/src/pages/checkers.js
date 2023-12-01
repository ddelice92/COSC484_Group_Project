import React, { useEffect, useState, useRef } from "react"
import Header from "../components/header"
import Checkerboard from "../components/checkerboard.js"
import AuthUser from '../components/authUser'
import s from "../CSS/checkers.module.css"
import useWebSocket from 'react-use-websocket';
import s from "../CSS/checkers.module.css"

//both pieces can be moved but black pieces turn red when moved so that needs to be fixed which should be easy
//if i pick one piece then a different piece of the same color then try to move second piece bad things happen
//need to implement king pieces
//implement win condition
export default function Checkers() {
    const { sendJsonMessage, lastJsonMessage } = useWebSocket('ws://localhost:8080', {
        shouldReconnect: (closeEvent) => true,
        reconnectInterval: 1,
        reconnectAttempts: 5
    });
    const [gameName, setGameName] = useState('');
    const [gameData, setGameData] = useState([]);//The current board for the game
    const [selectedBoxes, setSelectedBoxes] = useState([]);

    const canvasRef = useRef(null);
    //0=empty, 1=red, 2=black
    //const squares = [0,1,0,1,0,1,0,1,
                    //1,0,1,0,1,0,1,0,
                    //0,1,0,1,0,1,0,1,
                    //0,0,0,0,0,0,0,0,
                    //0,0,0,0,0,0,0,0,
                    //2,0,2,0,2,0,2,0,
                    //0,2,0,2,0,2,0,2,
                    //2,0,2,0,2,0,2,0];
    
    //fill squares array
    function SelectedPiece(color, king, square) {
        this.color = color;
        this.king = king;
        this.square = square;
    };
    const squares = [];
    for(let i = 0; i < 64; i++) {
        if(i < 24 && (((Math.floor(i/8) == 0 || Math.floor(i/8) == 2) && (i%8)%2 == 1) || ((Math.floor(i/8) == 1) && (i%8)%2 == 0))) {
            var redPiece = new SelectedPiece(1, false, i);
            squares.push(redPiece);
        }
        else if(i > 39 && (((Math.floor(i/8) == 5 || Math.floor(i/8) == 7) && (i%8)%2 == 0) || ((Math.floor(i/8) == 6) && (i%8)%2 == 1))) {
            var blackPiece = new SelectedPiece(2, false, i);
            squares.push(blackPiece);
        }
        else {
            squares.push(null);
        }
    }

    var currentPlayer = 1;
    var selectMove = false;
    console.log("I will be mad if this works");



    useEffect(() => {

        if (lastJsonMessage !== null) {//Whenever a json message is received, refresh gameData 
            setGameData(lastJsonMessage.currentBoard);
            console.log(gameData);
        }
    }, [lastJsonMessage]);

    useEffect(() => {
        console.log(selectedBoxes)
    },[selectedBoxes])

    useEffect(() => {
        if (gameData != null) {
            drawBoard();
        }
    },[gameData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const message = {
            type: 'getGame',
            message: gameName
        }
        sendJsonMessage(message);//Sends a json message to the node server to request data for gameName


    }

    function drawPiece(x, y, color, context) {
        //x and y parameter should be center of square

        context.beginPath();
        context.arc(x, y, 40, 0, 2 * Math.PI);
        context.stroke();
        if(color == 1) {
            context.fillStyle = "red";
        }
        else {
            context.fillStyle = "black";
        }
        context.fill();
    }

    function deletePiece(x, y, context) {
        //context.strokeStyle = "lightgrey";
        context.fillStyle = "lightgrey";
        context.fillRect(x, y, 90, 90);

    }

    const drawBoard = () => {

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        //Draws the horizontal board lines
        context.beginPath();
        context.moveTo(0, 100);
        context.lineTo(800, 100);
        context.stroke();

        context.beginPath();
        context.moveTo(0, 200);
        context.lineTo(800, 200);
        context.stroke();

        context.beginPath();
        context.moveTo(0, 300);
        context.lineTo(800, 300);
        context.stroke();

        context.beginPath();
        context.moveTo(0, 400);
        context.lineTo(800, 400);
        context.stroke();

        context.beginPath();
        context.moveTo(0, 500);
        context.lineTo(800, 500);
        context.stroke();

        context.beginPath();
        context.moveTo(0, 600);
        context.lineTo(800, 600);
        context.stroke();

        context.beginPath();
        context.moveTo(0, 700);
        context.lineTo(800, 700);
        context.stroke();

        //Draws the vertical board lines
        context.beginPath();
        context.moveTo(100, 0);
        context.lineTo(100, 800);
        context.stroke();

        context.beginPath();
        context.moveTo(200, 0);
        context.lineTo(200, 800);
        context.stroke();

        context.beginPath();
        context.moveTo(300, 0);
        context.lineTo(300, 800);
        context.stroke();

        context.beginPath();
        context.moveTo(400, 0);
        context.lineTo(400, 800);
        context.stroke();

        context.beginPath();
        context.moveTo(500, 0);
        context.lineTo(500, 800);
        context.stroke();

        context.beginPath();
        context.moveTo(600, 0);
        context.lineTo(600, 800);
        context.stroke();

        context.beginPath();
        context.moveTo(700, 0);
        context.lineTo(700, 800);
        context.stroke();



        //draw all pieces
        for(let i = 0; i < 900; i += 100) {
            for(let j = 0; j < 900; j += 100) {
                if(j < 300) {
                    if((j/100)%2 === 0 && (i/100)%2 === 1) {
                        drawPiece(i+50, j+50, 1, context);
                    }
                    else if((j/100)%2 === 1 && (i/100)%2 === 0) {
                        drawPiece(i+50, j+50, 1, context);
                    }
                }
                else if(j > 400) {
                    if((j/100)%2 === 1 && (i/100)%2 === 0) {
                        drawPiece(i+50, j+50, 2, context);
                    }
                    else if((j/100)%2 === 0 && (i/100)%2 === 1) {
                        drawPiece(i+50, j+50, 2, context);
                    }
                }
            }
        }

        //context.beginPath();
        //context.arc(50, 50, 40, 0, 2 * Math.PI);
        //context.stroke();
        //context.fillStyle = "red";
        //context.fill();
    }

    //look for possible moves if a piece were captured
    function possibleCapture() {
        console.log("seeking possible capture");
        var possibleSquares = [];

        //define function to find first possible moves for clicked piece
        function loadPossibleSquares(color, square) {
            //if color is red
            if(color == 1) {
                //if square of clicked piece is not leftmost, rightmost, or on bottom row
                if((square%8 > 0) && (square%8 < 7) && (square <= 55)) {
                    if(!possibleSquares.includes(square + 7)){possibleSquares.push(square + 7)};
                    if(!possibleSquares.includes(square + 9)){possibleSquares.push(square + 9)};
                }
                //if square is leftmost
                else if((square%8 == 0) && (square <= 55)) {
                    if(!possibleSquares.includes(square + 9)){possibleSquares.push(square + 9)};
                }
                //if square is rightmost
                else if((square%8 == 7) && (square <= 55)) {
                    if(!possibleSquares.includes(square + 7)){possibleSquares.push(square + 7)};
                }
            }
            //basically do the same things in reverse for black pieces
            else if(color == 2) {
                if((square%8 > 0) && (square%8 < 7) && (square >= 8)) {
                    if(!possibleSquares.includes(square - 7)){possibleSquares.push(square - 7)};
                    if(!possibleSquares.includes(square - 9)){possibleSquares.push(square - 9)};
                }
                else if((square%8 == 0) && (square >= 8)) {
                    if(!possibleSquares.includes(square - 7)){possibleSquares.push(square - 7)};
                }
                else if((square%8 == 7) && (square >= 8)) {
                    if(!possibleSquares.includes(square - 9)){possibleSquares.push(square - 9)};
                }
            }
        }

        //get initial possible moves for clicked piece
        loadPossibleSquares(clickedPiece.color, clickedPiece.square);
        
        //next state that if possible square is occupied with enemy piece, check that next diagonal piece, beyond enemy, is empty and add to possible squares
        for(let i = 0; i < possibleSquares.length; i++) {
            //if clicked piece is red
            if(clickedPiece.color == 1) {
                //if the square being tested is not empty or the same color as the clicked piece
                if((squares[possibleSquares[i]] != null) && (squares[possibleSquares[i]].color != clickedPiece.color)) {
                    //if square being tested is in column to the right of clicked piece but not rightmost on board
                    if((possibleSquares[i]%8 > clickedPiece.square%8) && (possibleSquares[i]%8 < 7)) {
                        //if next square over and down is still on board and is empty
                        if(((possibleSquares[i] + 9) <= 63) && (squares[possibleSquares[i] + 9] == null)) {
                            possibleSquares.push(possibleSquares[i] + 9);
                        }
                    }
                    //if square being tested is in column to the left of clicked piece but not leftmost on board
                    else if((possibleSquares[i]%8 < clickedPiece.square%8) && (possibleSquares[i]%8 > 0)) {
                        //if next square over and down is still on board and is empty
                        if(((possibleSquares[i] + 7) <= 63) && (squares[possibleSquares[i] + 7] == null)) {
                            possibleSquares.push(possibleSquares[i] + 7);
                        }
                    }
                }
            }
            //if clicked piece is black, do everything mirrored
            else {
                if((squares[possibleSquares[i]] != null) && (squares[possibleSquares[i]].color != clickedPiece.color)) {
                    if((possibleSquares[i]%8 > clickedPiece.square%8) && (possibleSquares[i]%8 < 7)) {
                        if(((possibleSquares[i] - 7) >= 0) && (squares[possibleSquares[i] - 7] == null)) {
                            possibleSquares.push(possibleSquares[i] - 7);
                        }
                    }
                    else if((possibleSquares[i]%8 < clickedPiece.square%8) && (possibleSquares[i]%8 > 0)) {
                        if(((possibleSquares[i] - 9) >= 0) && (squares[possibleSquares[i] - 9] == null)) {
                            possibleSquares.push(possibleSquares[i] - 9);
                        }
                    }
                }
            }

        }

        //remove all possibilities that are already occupied or are not capture spots
        console.log("possible squares before trimming: " + possibleSquares);
        var tempArr = [];
        possibleSquares.forEach(function(value) {
            tempArr.push(value);
        });
        possibleSquares.forEach(function(value) {
            console.log("evaluating " + value);
            if(squares[value] != null || (Math.floor(value/8) - Math.floor(clickedPiece.square/8) == 1) || (Math.floor(value/8) - Math.floor(clickedPiece.square/8) == -1)) {
                console.log("removing from possible squares: " + value);
                tempArr.splice(tempArr.indexOf(value), 1);
            }
        });
        possibleSquares = tempArr;

        console.log("possible capture squares: " + possibleSquares);
        return possibleSquares;
    }

    function selectable(selectedSquare) {
        console.log("evaluating selectable()");
        console.log("selectMove: " + selectMove);
        console.log("current player color: " + currentPlayer);
        console.log("moveMade value: " + moveMade);
        //check if square selected has piece that matches current player
        if((moveMade == 0) && (squares[selectedSquare] != null) && (currentPlayer == squares[selectedSquare].color) && (selectedSquare != clickedPiece.square)) {
            console.log("selectable option 0");
            return 0;
        }
        //0 means selected square is a capture move
        else if(selectMove && (moveMade < 2) && (validMove(selectedSquare) == 0)) {
            console.log("selectable option 1");
            return 1;
        }
        //1 means selected square is a regular move
        else if((moveMade == 0) && (selectMove) && (validMove(selectedSquare) == 1)){
            console.log("selectable option 2");
            return 2;
        }
        //
        else if((moveMade != 0) && (selectedSquare == clickedPiece.square)) {
            console.log("selectable option 3");
            return 3;
        }
        else {
            console.log("selectable option 3");
            return 3;
        }
    }

    function validMove(selectedSquare) {
        console.log("is this a valid move?");
        var captureMoves = possibleCapture();
        if(captureMoves.includes(selectedSquare)) {
            console.log("valid capture move");
            return 0;
        }
        //if piece is red
        else if(clickedPiece.color == 1) {
            //if selected row is under clicked piece
            if(Math.floor(selectedSquare/8) == (Math.floor(clickedPiece.square/8) + 1)) {
                //console.log("is forward move");
                //if selected column is one to the right or left of clicked piece
                if((selectedSquare%8 == (clickedPiece.square%8 + 1)) || (selectedSquare%8 == (clickedPiece.square%8 - 1))) {
                    //if square is empty
                    if(squares[selectedSquare] == null) {
                        console.log("valid simple move");
                        return 1;
                    }
                }
            }
        }
        //same thing for black
        else if(clickedPiece.color == 2) {
            if(Math.floor(selectedSquare/8) == (Math.floor(clickedPiece.square/8) - 1)) {
                if((selectedSquare%8 == (clickedPiece.square%8 + 1)) || (selectedSquare%8 == (clickedPiece.square%8 - 1))) {
                    if(squares[selectedSquare] == null) {
                        console.log("valid simple move");
                        return 1;
                    }
                }
            }
        }
        else {
            console.log("not a valid move");
            return 2;
        }
    }

    var clickedPiece = new SelectedPiece(0, false, 0);
    var moveMade = 0;
    //for moveMade: 0 = no move has been made; 1 = capture move has been made; 2 = simple move has been made

    //note that mouse position is offset x by 216 and y by 232 due to border positions
    const handleClick = (event) => {
        console.log("**********NEW CLICK**********");
        const canvas = canvasRef.current;
        const canvasRect = canvas.getBoundingClientRect();
        const context = canvas.getContext('2d');
        
        var selectedSquare = (Math.floor((event.clientY - canvasRect.top)/100) * 8) + Math.floor((event.clientX - canvasRect.left)/100);

        console.log("select Move value before calling selectable(): " + selectMove);
        var selection = selectable(selectedSquare);
        if(selection < 3) {
            //if piece has been selected
            if(selection == 0) {
                clickedPiece.color = squares[selectedSquare].color;
                clickedPiece.king = squares[selectedSquare].king;
                clickedPiece.square = squares[selectedSquare].square;
                selectMove = !selectMove;
                console.log("time to select move: " + selectMove);
                console.log("current piece: " + clickedPiece.square);
            }
            //if move has been made
            else if((selection == 1) || (selection == 2)) {
                console.log("selction is 1 or 2");
                if(selection == 1) {
                    moveMade = 1;
                }
                else {
                    moveMade = 2;
                }
                
                squares[selectedSquare] = new SelectedPiece(clickedPiece.color, clickedPiece.king, selectedSquare);
                var tempPiece =  clickedPiece;
                squares[clickedPiece.square] = null;

                deletePiece(((clickedPiece.square % 8) * 100) + 9, (Math.floor(clickedPiece.square/8) * 100) + 9, context);
                drawPiece(((selectedSquare % 8) * 100) + 50, (Math.floor(selectedSquare/8) * 100) + 50, squares[selectedSquare].color, context);

                //delete captured piece
                if(((Math.floor(selectedSquare/8) - Math.floor(tempPiece.square/8)) == 2)) {
                    var captured = ((((selectedSquare%8) - (tempPiece.square%8))/2) + (tempPiece.square + 8));
                    squares[captured] = null;
                    deletePiece(((captured%8) * 100) + 9, (Math.floor(captured/8) * 100) + 9, context);

                }
                else if((Math.floor(selectedSquare/8) - Math.floor(tempPiece.square/8)) == -2) {
                    var captured = ((((selectedSquare%8) - (tempPiece.square%8))/2) + (tempPiece.square - 8));
                    squares[captured] = null;
                    deletePiece(((captured%8) * 100) + 9, (Math.floor(captured/8) * 100) + 9, context);
                }

                clickedPiece.color = squares[selectedSquare].color;
                clickedPiece.king = squares[selectedSquare].king;
                clickedPiece.square = squares[selectedSquare].square;

                var boardState = "";
                squares.forEach(function(value, index) {
                    if(value != null ) {
                        boardState += index + ": " + value.color + ", ";
                    }
                    else {
                        boardState += index + ": " + "null, ";
                    }
                })
                console.log("current board state: " + boardState);
            }
        }
        else if((selectedSquare == clickedPiece.square)) {
            if(currentPlayer == 1) {
                console.log("currentPlayer changed to black");
                currentPlayer++;
                moveMade = 0;
                selectMove = !selectMove;
            }
            else {
                console.log("current player changed to red");
                currentPlayer --;
                moveMade = 0;
                selectMove = !selectMove;
            }
            //console.log("not selectable");
        }
    }

    return (
        <div>
            <AuthUser />
            <Header />
            <div id={s.container}>
                <div id={s.canvasContainer}>
                    <Checkerboard />
                </div>
            </div>
            <div className={s.container}>
                <form className={s.gameForm} onSubmit={handleSubmit}>
                    <label for="text">Game name</label>
                    <input value={gameName} onChange={(e) => setGameName(e.target.value)} type="text" id="gamename" name="gamename"></input>
                    <button type="submit" id="button">Get game data</button>
                </form>
                <div className={s.canvasContainer}>
                    <canvas ref={canvasRef}  onClick={handleClick} id="tic-tac-toe-canvas" width="800" height="800">
                    </canvas>
                </div>
            </div>
        </div>
    )
}