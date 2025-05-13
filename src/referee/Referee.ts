import { Piece, PieceType, TeamType, Position } from '../Constants';

export default class Referee {
  tileIsOccupied(x: number, y: number, boardState: Piece[]): boolean {
    return boardState.some(p => p.position.x === x && p.position.y === y);
  }

  tileIsOccupiedByOpponent(x: number, y: number, boardState: Piece[], team: TeamType): boolean {
    return boardState.some(p => p.position.x === x && p.position.y === y && p.team !== team);
  }

  isEnPassantMove(
    px: number,
    py: number,
    x: number,
    y: number,
    type: PieceType,
    team: TeamType,
    boardState: Piece[]
  ): boolean {
    const pawnDirection = team === TeamType.OUR ? 1 : -1;
    if (type === PieceType.PAWN) {
      if ((x - px === -1 || x - px === 1) && y - py === pawnDirection) {
        return boardState.some(
          p =>
            p.position.x === x &&
            p.position.y === y - pawnDirection &&
            p.enPassant
        );
      }
    }
    return false;
  }

  getValidMoves(piece: Piece, boardState: Piece[]): Position[] {
    const moves: Position[] = [];
    const { x, y } = piece.position;

    for (let newX = 0; newX < 8; newX++) {
        for (let newY = 0; newY < 8; newY++) {
        const isLegal = this.isValidMove(x, y, newX, newY, piece.type, piece.team, boardState) ||
                        this.isEnPassantMove(x, y, newX, newY, piece.type, piece.team, boardState);

        if (isLegal) {
            moves.push({ x: newX, y: newY });
        }
        }
    }

    return moves;
    }


  isValidMove(
    px: number,
    py: number,
    x: number,
    y: number,
    type: PieceType,
    team: TeamType,
    boardState: Piece[]
  ): boolean {
    const pawnDirection = team === TeamType.OUR ? 1 : -1;
    const specialRow = team === TeamType.OUR ? 1 : 6;


    //PAWN MOVEMENT
    if (type === PieceType.PAWN) {
      if (px === x && py === specialRow && y - py === 2 * pawnDirection) {
        if (
          !this.tileIsOccupied(x, y, boardState) &&
          !this.tileIsOccupied(x, y - pawnDirection, boardState)
        ) {
          return true;
        }
      } else if (px === x && y - py === pawnDirection) {
        if (!this.tileIsOccupied(x, y, boardState)) {
          return true;
        }
      } else if (
        (x - px === -1 || x - px === 1) &&
        y - py === pawnDirection
      ) {
        if (this.tileIsOccupiedByOpponent(x, y, boardState, team)) {
          return true;
        }
      }
    }

    //KNIGHT MOVEMENT
    if (type === PieceType.KNIGHT) {
    const dx = Math.abs(x - px);
    const dy = Math.abs(y - py);

    const isLShape = (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
    if (!isLShape) return false;

    const destinationOccupied = this.tileIsOccupied(x, y, boardState);
    if (!destinationOccupied) {
        return true;
    }

    
    return this.tileIsOccupiedByOpponent(x, y, boardState, team);
    }

    //ROOK MOVEMENT
    if (type === PieceType.ROOK) {
    const isStraightLine = px === x || py === y;
    if (!isStraightLine) return false;

  
    const stepX = x === px ? 0 : x > px ? 1 : -1;
    const stepY = y === py ? 0 : y > py ? 1 : -1;


    let currX = px + stepX;
    let currY = py + stepY;

    while (currX !== x || currY !== y) {
        if (this.tileIsOccupied(currX, currY, boardState)) {
        return false;
        }
        currX += stepX;
        currY += stepY;
    }


    const destinationOccupied = this.tileIsOccupied(x, y, boardState);
    if (!destinationOccupied) return true;

    return this.tileIsOccupiedByOpponent(x, y, boardState, team);
    }

    //BISHOP MOVEMENT
    if (type === PieceType.BISHOP) {
    const dx = x - px;
    const dy = y - py;


    if (Math.abs(dx) !== Math.abs(dy)) return false;

    const stepX = dx > 0 ? 1 : -1;
    const stepY = dy > 0 ? 1 : -1;

    let currX = px + stepX;
    let currY = py + stepY;


    while (currX !== x && currY !== y) {
        if (this.tileIsOccupied(currX, currY, boardState)) {
        return false;
        }
        currX += stepX;
        currY += stepY;
    }


    const destinationOccupied = this.tileIsOccupied(x, y, boardState);
    if (!destinationOccupied) return true;

    return this.tileIsOccupiedByOpponent(x, y, boardState, team);
    }

    //QUEEN MOVEMENT
    if (type === PieceType.QUEEN) {
    const dx = x - px;
    const dy = y - py;

    const isDiagonal = Math.abs(dx) === Math.abs(dy);
    const isStraight = px === x || py === y;

    if (!isDiagonal && !isStraight) return false;

    const stepX = dx === 0 ? 0 : dx > 0 ? 1 : -1;
    const stepY = dy === 0 ? 0 : dy > 0 ? 1 : -1;

    let currX = px + stepX;
    let currY = py + stepY;

  
    while (currX !== x || currY !== y) {
        if (this.tileIsOccupied(currX, currY, boardState)) {
        return false;
        }
        currX += stepX;
        currY += stepY;
    }

    const destinationOccupied = this.tileIsOccupied(x, y, boardState);
    if (!destinationOccupied) return true;

    return this.tileIsOccupiedByOpponent(x, y, boardState, team);
    }

    //KING MOVEMENT
    if (type === PieceType.KING) {
    const dx = Math.abs(x - px);
    const dy = Math.abs(y - py);


    if (dx > 1 || dy > 1) return false;

    const destinationOccupied = this.tileIsOccupied(x, y, boardState);
    if (!destinationOccupied) return true;

    return this.tileIsOccupiedByOpponent(x, y, boardState, team);
    }



    return false;
  }
}


