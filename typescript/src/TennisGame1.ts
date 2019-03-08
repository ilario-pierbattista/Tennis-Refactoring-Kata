import { TennisGame } from './TennisGame';
import { Option, some, none, None } from 'fp-ts/lib/Option'
import { GameState, playerFromString, parita, winner, advantage } from './tennis';
import { compose } from 'fp-ts/lib/function';

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
    compose(p => p.chain(w => some(`Win for ${w}`)), winner)

    const printers: ((g: GameState) => Option<string>)[] = [
      parita,
      compose(p => p.chain(w => some(`Win for ${w}`)), winner),
      compose(p => p.chain(a => some(`Advantage ${a}`)), advantage)
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
