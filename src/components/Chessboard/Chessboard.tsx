import React, { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';


import './Chessboard.css';
import Tile from "../Tile/Tile"

// import "../../referee/referee";
import Referee from '../../referee/Referee'; 
import { relative } from 'path';
import { verticalAxis, horizontalAxis, Piece, PieceType, TeamType, initialBoardState } from '../../Constants';





for (let p = 0; p < 2; p++){
            const teamType = (p == 0) ? TeamType.OPPONENT : TeamType.OUR;
            const type = (teamType == TeamType.OPPONENT) ? "b" : "w";
            // const type = (p== 0) ? "b" : "w";
            const y = (teamType == TeamType.OPPONENT) ? 7 : 0;

            initialBoardState.push({image: `assets/images/rook_${type}.png`,x:0,y,type: PieceType.ROOK, team: teamType})
            initialBoardState.push({image: `assets/images/rook_${type}.png`,x:7,y,type: PieceType.ROOK, team: teamType})
            initialBoardState.push({image: `assets/images/knight_${type}.png`,x:1,y,type: PieceType.KNIGHT, team: teamType})
            initialBoardState.push({image: `assets/images/knight_${type}.png`,x:6,y,type: PieceType.KNIGHT, team: teamType})
            initialBoardState.push({image: `assets/images/bishop_${type}.png`,x:2,y,type: PieceType.BISHOP, team: teamType})
            initialBoardState.push({image: `assets/images/bishop_${type}.png`,x:5,y,type: PieceType.BISHOP, team: teamType})
            initialBoardState.push({image: `assets/images/queen_${type}.png`,x:3,y,type: PieceType.QUEEN, team: teamType})
            initialBoardState.push({image: `assets/images/king_${type}.png`,x:4,y,type: PieceType.KING, team: teamType})
}


        for(let i = 0; i < 8; i++){
             initialBoardState.push({image: "assets/images/pawn_b.png",x:i,y:6,type: PieceType.PAWN, team: TeamType.OPPONENT})
        }

        for(let i = 0; i < 8; i++){
            initialBoardState.push({image: "assets/images/pawn_w.png",x:i,y:1,type: PieceType.PAWN, team: TeamType.OUR})
        }


export default function Chessboard(){
    const [activePiece,setActivePiece] = useState<HTMLElement | null>(null);
    const [gridX,setGridX] = useState(0);
    const [gridY,setGridY] = useState(0);
    const [pieces,setPieces] = useState<Piece[]>(initialBoardState);
    const chessBoardRef = useRef<HTMLDivElement>(null);
    const referee = new Referee();
    // let activePiece: HTMLElement | null = null;

    function grabPiece(e: React.MouseEvent){
        const element = e.target as HTMLElement;
        const chessBoard = chessBoardRef.current;
        if(element.classList.contains("chess-piece") && chessBoard){
            // const gridX = Math.floor((e.clientX - chessBoard.offsetLeft) / 100);
            // const gridY = Math.abs(Math.ceil((e.clientY - chessBoard.offsetTop - 800) / 100));
            setGridX(Math.floor((e.clientX - chessBoard.offsetLeft) / 100));
            setGridY(Math.abs(Math.ceil((e.clientY - chessBoard.offsetTop - 800) / 100)));
            const x = e.clientX - 50;
            const y = e.clientY - 50;
            element.style.position = "absolute";
            element.style.left = `${x}px`;
            element.style.top =  `${y}px`;
            setActivePiece(element);
    
            // activePiece = element;
    
        }
    }
    
    function movePiece(e: React.MouseEvent){
        // console.log(element);
        const chessBoard = chessBoardRef.current;
        if(activePiece && chessBoard){
            const minX = chessBoard.offsetLeft - 25;
            const minY = chessBoard.offsetTop - 25;
            const maxX = chessBoard.offsetLeft + chessBoard.clientWidth - 75;
            const maxY = chessBoard.offsetTop + chessBoard.clientHeight - 75;
            const x = e.clientX - 50;
            const y = e.clientY - 50;
            activePiece.style.position = "absolute";
      
            
            if (x < minX) {
              activePiece.style.left = `${minX}px`;
            }
            
            else if (x > maxX) {
              activePiece.style.left = `${maxX}px`;
            }
            
            else {
              activePiece.style.left = `${x}px`;
            }
      
            
            if (y < minY) {
              activePiece.style.top = `${minY}px`;
            }
            
            else if (y > maxY) {
              activePiece.style.top = `${maxY}px`;
            }
            
            else {
              activePiece.style.top = `${y}px`;
            }
        }
    }
    
    function dropPiece(e: React.MouseEvent){
        const chessBoard = chessBoardRef.current;
        if(activePiece && chessBoard){
            const x = Math.floor((e.clientX - chessBoard.offsetLeft) / 100);
            const y = Math.abs(Math.ceil((e.clientY - chessBoard.offsetTop - 800) / 100));

            const currentPiece = pieces.find(p => p.x == gridX && p.y == gridY);
            const attackedPiece = pieces.find(p => p.x == x && p.y == y);

            if(currentPiece){
                const validMove = referee.isValidMove(gridX,gridY,x,y,currentPiece.type,currentPiece.team,pieces);
                const isEnPassantMove = referee.isEnPassantMove(gridX,gridY,x,y,currentPiece.type,currentPiece.team,pieces);

                const pawnDirection = currentPiece.team == TeamType.OUR ? 1 : -1;
                


                if(isEnPassantMove){
                    const updatedPieces = pieces.reduce((results,piece)=>{
                        if(piece.x == gridX && piece.y == gridY){
                            piece.enPassant = false;
                            piece.x = x;
                            piece.y = y;
                            results.push(piece);
                        }else if(!(piece.x == x && piece.y == y - pawnDirection)){
                            if(piece.type == PieceType.PAWN){
                                piece.enPassant = false;
                            }
                            results.push(piece);
                        }
                        return results;
                    },[] as Piece[])
                setPieces(updatedPieces);
                }else if(validMove){
                     const updatedPieces = pieces.reduce((results,piece) => {
                            if(piece.x == gridX && piece.y == gridY){
                                if(Math.abs(gridY - y) == 2 && piece.type == PieceType.PAWN){
                                    //SPECIAL MOVE
                                    console.log("En Passant True");
                                    piece.enPassant = true;
                                }else{
                                    piece.enPassant = false;
                                }
                                piece.x = x;
                                piece.y = y;
                                results.push(piece);
                            }else if(!(piece.x == x && piece.y == y)){
                                if(piece.type == PieceType.PAWN){
                                    piece.enPassant = false;
                                }
                                results.push(piece);
                            }
                            
                            return results;

                        }, [] as Piece[]);
                        setPieces(updatedPieces);
                        

                }else{
                    activePiece.style.position = 'relative';
                    activePiece.style.removeProperty('top');
                    activePiece.style.removeProperty('left');
                }
            }

            // referee.isValidMove(gridX,gridY,x,y,);

            // setPieces(value =>{
            //     value.map(p =>{
            //         const pieces = value.map((p)=>{
            //             if(p.x == gridX && p.y == gridY){
            //                 const validMove = referee.isValidMove(gridX,gridY,x,y,p.type,p.team,value);
            //                 if(validMove){
            //                     p.x =x;
            //                     p.y = y;
            //                 }else{
            //                     activePiece.style.position = 'relative';
            //                     activePiece.style.removeProperty('top');
            //                      activePiece.style.removeProperty('left');

            //                 }


                            
            //             }
            //             return p;
            //         });
            //     });
            //     return pieces;
            // })
            // // pieces[0].x = 5;
            setActivePiece(null);
            // activePiece = null;
        }
    }
    let board = [];

    for(let j = verticalAxis.length - 1; j >= 0; j--){
        for(let i = 0; i < horizontalAxis.length; i++){
            const number = j + i + 2;
            let image = undefined;
            pieces.forEach((p) =>{
                if(p.x == i && p.y == j){
                    image =p.image;
                }
            });
            board.push(<Tile key={`${j},${i}`} image={image} number ={number}/>)

            // board.push(<Tile image={image} number ={number}/>)
        }
    }
    return <div 
    ref={chessBoardRef}
    onMouseMove={(e) => movePiece(e)} 
    onMouseDown={e=>grabPiece(e)} 
    onMouseUp={(e)=>dropPiece(e)}
    id="chessboard">
        {board}
        </div>
}