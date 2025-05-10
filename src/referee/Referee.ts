import { verticalAxis, horizontalAxis, Piece, PieceType, TeamType } from '../Constants';

export default class Referee{

    tileIsOccupied(x: number,y: number,boardState:Piece[]): boolean{
        const piece = boardState.find(p => p.x == x && p.y == y)
        if(piece){
            return true;
        }else{
            return false;
        }
    }

    TileIsOccupiedByOpponent(x: number, y: number, boardState:Piece[], team: TeamType) : boolean{
        const piece = boardState.find((p) => p.x == x && p.y == y && p.team != team);
        if(piece){
            return true;
        }else{
            return false;
        }
    }

    isEnPassantMove(px: number,py: number,x: number,y: number,type: PieceType, team: TeamType, boardState: Piece[]){//PASS
        const pawnDirection = team == TeamType.OUR ? 1 : -1;
        //WHITE = + 1
        if(type == PieceType.PAWN){
             if((x - px == -1 || x -px == 1) && y -py == pawnDirection){
                const piece = boardState.find((p) => p.x == x && p.y == y - pawnDirection && p.enPassant);
                console.log(piece);
                if(piece){
                    return true;
                }
                // console.log("upper / bottom left");
                // if(this.TileIsOccupiedByOpponent(x,y,boardState,team)){
                //     return true;
                // }
            }
            // else if(x -px == 1 && y - py == pawnDirection){
            //     // console.log("upper / bottom right");
            //     // if(this.TileIsOccupiedByOpponent(x,y,boardState,team)){
            //     //     return true;
            //     // }
            // }
        }

        //if attacking piece is pawn DONE
        //upper left / upper right || bottom left / bottom right
        //if a piece is under / above the attacked tile
        //if the attacked piece has made an en passant move in the previous turn
        // const piece = boardState.find((p) => p.x == x && p.y == y + pawnDirection);

        //Put piece in correct pos, remove en pessanted piece
        return false;


        // const pawnDirection = team == TeamType.OUR ?  1 : -1;
        // if(type == PieceType.PAWN){
        //     if((x - px == -1 || x -px == 1) && y -py == pawnDirection){
        //         const piece = boardState.find((p)=> p.x == x && p.y == y - pawnDirection && p.enPassant);
        //         if(piece){
        //             return true;
        //         }
        //     }
        // }
        
        // return false;
    }

    isValidMove(px: number,py: number,x: number,y: number,type: PieceType, team: TeamType, boardState: Piece[]){
        // console.log("Referee is checking the move...");
        // console.log(`Previous location: (${px},${py})`);
        // console.log(`Current location: (${x},${y})`);
        // console.log(`Piece type: ${type}`);
        // console.log(`Team type: ${team}`);
        

        if(type == PieceType.PAWN){
            const specialRow = (team == TeamType.OUR) ? 1 : 6;
            const pawnDirection = (team == TeamType.OUR) ? 1 : -1;

            if(px == x && py == specialRow && y - py == 2*pawnDirection){
                if(!this.tileIsOccupied(x,y,boardState) && !this.tileIsOccupied(x,y-pawnDirection,boardState)){
                    return true;
                }
            }else if(px == x && y - py == pawnDirection){
                if(!this.tileIsOccupied(x,y,boardState)){
                    return true;
                }
            }
            else if(x - px == -1 && y -py == pawnDirection){
                console.log("upper / bottom left");
                if(this.TileIsOccupiedByOpponent(x,y,boardState,team)){
                    return true;
                }
            }else if(x -px == 1 && y - py == pawnDirection){
                console.log("upper / bottom right");
                if(this.TileIsOccupiedByOpponent(x,y,boardState,team)){
                    return true;
                }
            }

            

            // if(py == specialRow){
            //     if(px == x && y -py == 1* pawnDirection){
            //         if(!this.tileIsOccupied(x,y,boardState)){
            //             return true;
            //         }
            //     }else if(px == x && y - py == 2 * pawnDirection){
            //         if(!this.tileIsOccupied(x,y,boardState) && !this.tileIsOccupied(x,y-pawnDirection,boardState)){
            //             return true;
            //         }
            //     }
            // }else{
            //     if(px == x && y-py == pawnDirection){
            //         if(!this.tileIsOccupied(x,y,boardState)){
            //             return true;
            //         }
            //     }
            // }
        }

        // if(type == PieceType.PAWN){
        //     if(team == TeamType.OUR){
        //         if(py == 1){
        //             if(px == x && y - py == 1){
        //                 if(!this.tileIsOccupied(x,y,boardState)){
        //                     return true;
        //                 }
        //             }else if(px == x && y - py == 2){
        //                 if(!this.tileIsOccupied(x,y,boardState) && !this.tileIsOccupied(x,y-1,boardState)){
        //                     return true;
        //                 }
        //             }

        //         }else{
        //                 if(px == x && y - py == 1){
        //                     if(!this.tileIsOccupied(x,y,boardState)){
        //                         return true;
        //                     }
        //                 }
        //             }
        //     }else{
        //         if(py == 6){
        //             if(px == x && y - py == -1){
        //                 if(!this.tileIsOccupied(x,y,boardState)){
        //                     return true;
        //                 }
        //             }else if(px == x && y -py == -2){
        //                 if(!this.tileIsOccupied(x,y,boardState) && !this.tileIsOccupied(x,y+1,boardState)){
        //                     return true;
        //                 }
        //             }
        //         }else{
        //             if(px == x && y - py == -1){
        //                 if(!this.tileIsOccupied(x,y,boardState)){
        //                     return true;
        //                 }
        //             }
        //         }
        //     }
        // }

        return false;
    }
}