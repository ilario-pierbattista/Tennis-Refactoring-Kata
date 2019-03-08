import { TennisGame } from './TennisGame';
import { Option, some, none } from 'fp-ts/lib/Option'
import { Predicate, identity } from 'fp-ts/lib/function';
import { max } from 'fp-ts/lib/Foldable2v';

export namespace TennisGame1 {
  export type player = 'player1' | 'player2';

  export type scoreType =
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

  export type state = { [p in player]: scoreType }
}

class GameState {
  private constructor(readonly state: TennisGame1.state) {
  }

  public static init(): GameState {
    return new GameState({
      player1: love(),
      player2: love()
    });
  }

  public point(player: TennisGame1.player): GameState {
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

function love(): TennisGame1.scoreType {
  return {
    name: 'Love',
    value: 0
  }
}
function fifteen(): TennisGame1.scoreType {
  return {
    name: 'Fifteen',
    value: 1
  }
}
function thirty(): TennisGame1.scoreType {
  return {
    name: 'Thirty',
    value: 2
  }
}
function forty(): TennisGame1.scoreType {
  return {
    name: 'Forty',
    value: 3
  }
}

function deuce(v: number): TennisGame1.scoreType {
  return {
    name: 'Deuce',
    value: v >= 4 ? v : 4
  }
}

const parita: Predicate<GameState> = (game: GameState) => game.state.player1.value === game.state.player2.value;
const isWinnable: Predicate<GameState> = (game: GameState) => game.state.player1.value >= 4 || game.state.player2.value >= 4;

function playerMaxScore(game: GameState): TennisGame1.player {
  return game.state.player1.value > game.state.player2.value
    ? 'player1'
    : 'player2';
}

function winner(game: GameState): Option<TennisGame1.player> {
  if (isWinnable(game) && Math.abs(game.state.player1.value - game.state.player2.value) >= 2) {
    return some(playerMaxScore(game));
  }

  return none;
}

function advantage(game: GameState): Option<TennisGame1.player> {
  if (isWinnable(game) && Math.abs(game.state.player1.value - game.state.player2.value) === 1) {
    return some(playerMaxScore(game));
  }

  return none;
}

function scoreParita(game: GameState): Option<string> {
  if (parita(game) && game.state.player1.value >= forty().value) {
    return some('Deuce');
  }

  if (parita(game)) {
    return some(`${game.state.player1.name}-All`)
  }

  return none;
}

function incrementScore(score: TennisGame1.scoreType): TennisGame1.scoreType {
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

function playerFromString(name: string): Option<TennisGame1.player> {
  switch (name) {
    case 'player1':
      return some<TennisGame1.player>('player1');
    case 'player2':
      return some<TennisGame1.player>('player2');
    default:
      return none;
  }
}

export class TennisGame1 implements TennisGame {
  private game: GameState = GameState.init();

  constructor(readonly player1Name: string, readonly player2Name: string) {
  }

  wonPoint(playerName: string): void {
    this.game = playerFromString(playerName)
      .fold(
        this.game,
        p => this.game.point(p)
      )
  }

  getScore(): string {
    const printers: ((g: GameState) => Option<string>)[] = [
      scoreParita,
      g => winner(g).chain(w => some(`Win for ${w}`)),
      g => advantage(g).chain(a => some(`Advantage ${a}`))
    ];

    return printers
      .reduce(
        (carry, printer) => {
          return carry.alt(printer(this.game))
        },
        none as Option<string>
      )
      .getOrElse(`${this.game.state.player1.name}-${this.game.state.player2.name}`)
  }
}
