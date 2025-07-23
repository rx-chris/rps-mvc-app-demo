export enum Choice {
  Rock, // wins Scissors
  Paper, // wins Rocks
  Scissors, // wins Paper
}

export enum MatchResult {
  PlayerWins,
  ComputerWins,
  Draw,
}

/**
 * Model class
 * - Contains data and domain logic of the application
 */
export class Model {
  private playerScore: number = 0;
  private computerScore: number = 0;
  private drawCount: number = 0;
  private playerChoice: Choice | null = null;
  private computerChoice: Choice | null = null;
  private matchResult: MatchResult | null = null;
  private choices: Choice[] = [Choice.Rock, Choice.Paper, Choice.Scissors];
  private winningChoices: { [key in Choice]: Choice } = {
    [Choice.Rock]: Choice.Scissors,
    [Choice.Paper]: Choice.Rock,
    [Choice.Scissors]: Choice.Paper,
  };

  // -------------------------------------------------------------
  // *PUBLIC METHODS*
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // getters and setters
  // -------------------------------------------------------------

  public getPlayerScore(): number {
    return this.playerScore;
  }

  public getComputerScore(): number {
    return this.computerScore;
  }

  public getDrawCount(): number {
    return this.drawCount;
  }

  public getComputerChoice(): Choice {
    return this.computerChoice;
  }

  public getPlayerChoice(): Choice {
    return this.playerChoice;
  }

  public setPlayerChoice(value: Choice): void {
    this.playerChoice = value;
  }

  public setRandomPlayerChoice(): void {
    this.playerChoice = this.getRandomChoice();
  }

  public getMatchResult() {
    return this.matchResult;
  }

  // -------------------------------------------------------------
  // *PUBLIC METHODS*
  // -------------------------------------------------------------

  public playMatch(): void {
    if (this.playerChoice === null) {
      throw new Error("Player must be set first.");
    }
    // assign random choice to computer
    this.setComputerChoice();
    // evaluate and update the results of the match
    this.updateMatchResult();
    // update scores based on  the match result
    this.updateScores();
  }

  // -------------------------------------------------------------
  // *PRIVATE METHODS*
  // -------------------------------------------------------------

  // -------------------------------------------------------------
  // getters and setters
  // -------------------------------------------------------------
  private getRandomChoice(): Choice {
    return Math.floor(Math.random() * this.choices.length);
  }

  private setComputerChoice(): void {
    this.computerChoice = this.getRandomChoice();
  }

  private updateMatchResult(): void {
    if (this.playerChoice === this.computerChoice) {
      this.matchResult = MatchResult.Draw;
      return;
    }
    this.matchResult =
      this.computerChoice === this.winningChoices[this.playerChoice]
        ? MatchResult.PlayerWins
        : MatchResult.ComputerWins;
  }

  private updateScores(): void {
    switch (this.matchResult) {
      case MatchResult.PlayerWins:
        this.playerScore++;
        break;
      case MatchResult.ComputerWins:
        this.computerScore++;
        break;
      case MatchResult.Draw:
        this.drawCount++;
        break;
    }
  }
}
