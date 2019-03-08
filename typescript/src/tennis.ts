import { Predicate } from 'fp-ts/lib/function';
import { none, some, Option } from 'fp-ts/lib/Option';

type player = 'player1' | 'player2';
type scoreType =
    | {
        name: 'Love',
        value: 0
    }
    | {
        name: 'Fifteen'
        value: 1
    }
    | {
        name: 'Thirty'
        value: 2
    }
    | {
        name: 'Forty',
        value: 3
    }
    | {
        name: 'Deuce',
        value: number
    }

type state = { [p in player]: scoreType }

function love(): scoreType {
    return {
        name: 'Love',
        value: 0
    }
}

function fifteen(): scoreType {
    return {
        name: 'Fifteen',
        value: 1
    }
}

function thirty(): scoreType {
    return {
        name: 'Thirty',
        value: 2
    }
}

function forty(): scoreType {
    return {
        name: 'Forty',
        value: 3
    }
}

function deuce(v: number): scoreType {
    return {
        name: 'Deuce',
        value: v >= 4 ? v : 4
    }
}

export class GameState {
    private constructor(readonly state: state) {
    }

    public static init(): GameState {
        return new GameState({
            player1: love(),
            player2: love()
        });
    }

    public point(player: player): GameState {
        switch (player) {
            case "player1":
                return new GameState({
                    player1: incrementScore(this.state.player1),
                    player2: this.state.player2
                })
            case 'player2':
                return new GameState({
                    player1: this.state.player1,
                    player2: incrementScore(this.state.player2)
                })
        }
    }
}

const isParita: Predicate<GameState> = (game: GameState) => game.state.player1.value === game.state.player2.value;
const isWinnable: Predicate<GameState> = (game: GameState) => game.state.player1.value >= 4 || game.state.player2.value >= 4;

function playerMaxScore(game: GameState): player {
    return game.state.player1.value > game.state.player2.value
        ? 'player1'
        : 'player2';
}

export function winner(game: GameState): Option<player> {
    if (isWinnable(game) && Math.abs(game.state.player1.value - game.state.player2.value) >= 2) {
        return some(playerMaxScore(game));
    }

    return none;
}

export function advantage(game: GameState): Option<player> {
    if (isWinnable(game) && Math.abs(game.state.player1.value - game.state.player2.value) === 1) {
        return some(playerMaxScore(game));
    }

    return none;
}

export function parita(game: GameState): Option<string> {
    if (isParita(game) && game.state.player1.value >= forty().value) {
        return some('Deuce');
    }

    if (isParita(game)) {
        return some(`${game.state.player1.name}-All`)
    }

    return none;
}

function incrementScore(score: scoreType): scoreType {
    switch (score.name) {
        case 'Love':
            return fifteen();
        case 'Fifteen':
            return thirty();
        case 'Thirty':
            return forty();
        case 'Forty':
            return deuce(4);
        case 'Deuce':
            return deuce(score.value + 1);
    }
}

export function playerFromString(name: string): Option<player> {
    switch (name) {
        case 'player1':
            return some<player>('player1');
        case 'player2':
            return some<player>('player2');
        default:
            return none;
    }
}
