import { TennisGame } from './TennisGame';
import { Option, some, none } from 'fp-ts/lib/Option'
import { GameState, playerFromString, parita, winner, advantage } from './tennis';

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
      parita,
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
