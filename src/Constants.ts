export const verticalAxis = ["1","2","3","4","5","6","7","8"];
export const horizontalAxis=['a','b','c','d','e','f','g','h'];

export interface Piece{
    image: string;
    x: number;
    y: number;
    type: PieceType;
    team: TeamType;
    enPassant?: boolean;
}

export enum PieceType{
    PAWN,
    BISHOP,
    KNIGHT,
    ROOK,
    QUEEN,
    KING
}

export enum TeamType{
    OPPONENT,
    OUR
}

export const initialBoardState: Piece[] = [];