import { Checker } from '../Checker.js';
import { Player } from '../Player.js';

export interface Position {
    row: number;
    col: number;
}

export interface Move extends Position {
    type: string;
    captured: Position | null;
}

export interface CheckerData {
    color: string;
    row: number;
    col: number;
    direction: number;
    isKing: boolean;
}

export interface SelectedChecker extends Position {
}

export interface MoveEntry {
    notation: string;
    from: Position;
    to: Position;
}

export interface PlayerTimes {
    1: number;
    2: number;
    [key: number]: number;
}

export interface ClonedState {
    board: (Checker | null)[][];
    currentPlayer: ReturnType<Player['toJSON']>;
    mustJumpPiece: Position | null;
    hasJumpsAvailable: boolean;
    moveHistory: MoveEntry[];
}

export interface LiveState extends ClonedState {
    playerTimes?: PlayerTimes;
}

export type OnMoveExecutedCallback = (moves: MoveEntry[]) => void;
export type OnTurnChangeCallback = (player: Player) => void;
export type OnWinCallback = (winner: Player) => void;
export type OnCursorActionCallback = () => void;
export type OnTimeoutCallback = (playerNum: number) => void;
export type OnTickCallback = (playerTimes: PlayerTimes) => void;
export type OnPlayAgainCallback = () => void;
export type IsBlackSquareCallback = (row: number, col: number) => boolean;
export type OnCheckerClickCallback = (row: number, col: number) => void;
export type OnCellClickCallback = (row: number, col: number) => void;
export type OnCompleteCallback = () => void;
export type GetSelectedCheckerInfoCallback = () => SelectedChecker | null;
