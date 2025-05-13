import React, { useRef, useState } from 'react';
import './Chessboard.css';
import Tile from '../Tile/Tile';
import Referee from '../../referee/Referee';
import {
  verticalAxis,
  horizontalAxis,
  Piece,
  PieceType,
  TeamType,
  initialBoardState,
  Position,
} from '../../Constants';

export default function Chessboard() {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [grabPosition, setGrabPosition] = useState<Position | null>(null);
  const [gridPosition, setGridPosition] = useState<Position>({ x: 0, y: 0 });
  const [pieces, setPieces] = useState<Piece[]>(initializeBoard());
  const [previewMoves, setPreviewMoves] = useState<Position[]>([]);
  const chessBoardRef = useRef<HTMLDivElement>(null);
  const referee = new Referee();

  function initializeBoard(): Piece[] {
    const board: Piece[] = [];

    for (let p = 0; p < 2; p++) {
      const teamType = p === 0 ? TeamType.OPPONENT : TeamType.OUR;
      const type = teamType === TeamType.OPPONENT ? 'b' : 'w';
      const y = teamType === TeamType.OPPONENT ? 7 : 0;

      board.push({ image: `assets/images/rook_${type}.png`, position: { x: 0, y }, type: PieceType.ROOK, team: teamType });
      board.push({ image: `assets/images/rook_${type}.png`, position: { x: 7, y }, type: PieceType.ROOK, team: teamType });
      board.push({ image: `assets/images/knight_${type}.png`, position: { x: 1, y }, type: PieceType.KNIGHT, team: teamType });
      board.push({ image: `assets/images/knight_${type}.png`, position: { x: 6, y }, type: PieceType.KNIGHT, team: teamType });
      board.push({ image: `assets/images/bishop_${type}.png`, position: { x: 2, y }, type: PieceType.BISHOP, team: teamType });
      board.push({ image: `assets/images/bishop_${type}.png`, position: { x: 5, y }, type: PieceType.BISHOP, team: teamType });
      board.push({ image: `assets/images/queen_${type}.png`, position: { x: 3, y }, type: PieceType.QUEEN, team: teamType });
      board.push({ image: `assets/images/king_${type}.png`, position: { x: 4, y }, type: PieceType.KING, team: teamType });
    }

    for (let i = 0; i < 8; i++) {
      board.push({ image: 'assets/images/pawn_b.png', position: { x: i, y: 6 }, type: PieceType.PAWN, team: TeamType.OPPONENT });
      board.push({ image: 'assets/images/pawn_w.png', position: { x: i, y: 1 }, type: PieceType.PAWN, team: TeamType.OUR });
    }

    return board;
  }

  function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    const chessBoard = chessBoardRef.current;
    if (element.classList.contains('chess-piece') && chessBoard) {
        const gridX = Math.floor((e.clientX - chessBoard.offsetLeft) / 100);
        const gridY = Math.abs(Math.ceil((e.clientY - chessBoard.offsetTop - 800) / 100));
        setGridPosition({ x: gridX, y: gridY });

        // 🧠 Find the selected piece
        const selectedPiece = pieces.find(p => p.position.x === gridX && p.position.y === gridY);
        if (selectedPiece) {
        const moves = referee.getValidMoves(selectedPiece, pieces); 
        setPreviewMoves(moves); 
        }

        element.style.position = 'absolute';
        element.style.left = `${e.clientX - 50}px`;
        element.style.top = `${e.clientY - 50}px`;
        setActivePiece(element);
    }
    }


  function movePiece(e: React.MouseEvent) {
    const chessBoard = chessBoardRef.current;
    if (activePiece && chessBoard) {
      const minX = chessBoard.offsetLeft - 25;
      const minY = chessBoard.offsetTop - 25;
      const maxX = chessBoard.offsetLeft + chessBoard.clientWidth - 75;
      const maxY = chessBoard.offsetTop + chessBoard.clientHeight - 75;
      const x = e.clientX - 50;
      const y = e.clientY - 50;

      activePiece.style.position = 'absolute';
      activePiece.style.left = `${Math.min(Math.max(x, minX), maxX)}px`;
      activePiece.style.top = `${Math.min(Math.max(y, minY), maxY)}px`;
    }
  }

  function dropPiece(e: React.MouseEvent) {
    const chessBoard = chessBoardRef.current;
    if (activePiece && chessBoard) {
      const x = Math.floor((e.clientX - chessBoard.offsetLeft) / 100);
      const y = Math.abs(Math.ceil((e.clientY - chessBoard.offsetTop - 800) / 100));

      const currentPiece = pieces.find(p => p.position.x === gridPosition.x && p.position.y === gridPosition.y);
      if (!currentPiece) return;

      const validMove = referee.isValidMove(gridPosition.x, gridPosition.y, x, y, currentPiece.type, currentPiece.team, pieces);
      const isEnPassant = referee.isEnPassantMove(gridPosition.x, gridPosition.y, x, y, currentPiece.type, currentPiece.team, pieces);
      const pawnDirection = currentPiece.team === TeamType.OUR ? 1 : -1;

      if (isEnPassant) {
        const updated = pieces.reduce((results, p) => {
          if (p === currentPiece) {
            p.position = { x, y };
            p.enPassant = false;
            results.push(p);
          } else if (!(p.position.x === x && p.position.y === y - pawnDirection)) {
            if (p.type === PieceType.PAWN) p.enPassant = false;
            results.push(p);
          }
          return results;
        }, [] as Piece[]);
        setPieces(updated);
      } else if (validMove) {
        const updated = pieces.reduce((results, p) => {
          if (p === currentPiece) {
            if (Math.abs(gridPosition.y - y) === 2 && p.type === PieceType.PAWN) {
              p.enPassant = true;
            } else {
              p.enPassant = false;
            }
            p.position = { x, y };
            results.push(p);
          } else if (!(p.position.x === x && p.position.y === y)) {
            if (p.type === PieceType.PAWN) p.enPassant = false;
            results.push(p);
          }
          return results;
        }, [] as Piece[]);
        setPieces(updated);
      } else {
        activePiece.style.position = 'relative';
        activePiece.style.removeProperty('top');
        activePiece.style.removeProperty('left');
      }

      setActivePiece(null);
      setPreviewMoves([]);

    }
  }

  const board = [];
  for (let j = verticalAxis.length - 1; j >= 0; j--) {
    for (let i = 0; i < horizontalAxis.length; i++) {
      const number = j + i + 2;
      const piece = pieces.find(p => p.position.x === i && p.position.y === j);
      board.push(
        <Tile
            key={`${j},${i}`}
            image={piece?.image}
            number={number}
            highlight={previewMoves.some(pos => pos.x === i && pos.y === j)}
        />
        );

    }
  }

  return (
    <div
      ref={chessBoardRef}
      onMouseMove={movePiece}
      onMouseDown={grabPiece}
      onMouseUp={dropPiece}
      id="chessboard"
    >
      {board}
    </div>
  );
}
