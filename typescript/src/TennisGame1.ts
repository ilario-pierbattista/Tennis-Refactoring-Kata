import { TennisGame } from './TennisGame';
import { Option } from 'fp-ts/lib/Option'

export namespace TennisGame1 {
  export type player = 'player1' | 'player2';

  export type PlayerScore = {
    player: player,
    score: scoreType,
  }

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
      player1: {
        name: 'Love',
        value: 0
      },
      player2: {
        name: 'Love',
        value: 0
      }
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

declare function winner(state: GameState): TennisGame1.player;
declare function incrementScore(score: TennisGame1.scoreType): TennisGame1.scoreType;
declare function playerFromString(name: string): TennisGame1.player;

export class TennisGame1 implements TennisGame {
  private m_score1: number = 0;
  private m_score2: number = 0;
  private state: GameState = GameState.init();

  constructor(readonly player1Name: string, readonly player2Name: string) {
  }

  wonPoint(playerName: string): void {
    if (playerName === 'player1') {
      this.m_score1 += 1;
    }
    else {
      this.m_score2 += 1;
    }
  }

  getScore(): string {
    let score: string = '';
    let tempScore: number = 0;
    if (this.m_score1 === this.m_score2) {
      switch (this.m_score1) {
        case 0:
          score = 'Love-All';
          break;
        case 1:
          score = 'Fifteen-All';
          break;
        case 2:
          score = 'Thirty-All';
          break;
        default:
          score = 'Deuce';
          break;
      }
    } else if (this.m_score1 >= 4 || this.m_score2 >= 4) {
      const minusResult: number = this.m_score1 - this.m_score2;
      if (minusResult === 1) score = 'Advantage player1';
      else if (minusResult === -1) score = 'Advantage player2';
      else if (minusResult >= 2) score = 'Win for player1';
      else score = 'Win for player2';
    } else {
      for (let i = 1; i < 3; i++) {
        if (i === 1) tempScore = this.m_score1;
        else { score += '-'; tempScore = this.m_score2; }
        switch (tempScore) {
          case 0:
            score += 'Love';
            break;
          case 1:
            score += 'Fifteen';
            break;
          case 2:
            score += 'Thirty';
            break;
          case 3:
            score += 'Forty';
            break;
        }
      }
    }

    return score;
  }
}
