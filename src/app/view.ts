import { createInterface } from "readline/promises";
import { Action } from "./router";
import { Choice, MatchResult } from "./model";

/**
 * View class
 *  - Renders data to the user
 */
export class View {
  // -------------------------------------------------------------
  // *PUBLIC METHODS*
  // -------------------------------------------------------------

  // -------------------------------------------------------------
  // Read and write to console
  // -------------------------------------------------------------

  // display the content in the console
  public display(content: string) {
    console.log(content);
  }

  // clear the console
  public clear() {
    console.clear();
  }

  // prompt the user for input in the console
  // can pass an optional callback function for validation
  public async prompt(
    query: string,
    validatorFn: (userInput: string) => boolean = (input: string) => true
  ): Promise<string> {
    // create readline interface
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // keep prompting as long as validation fails
    let answer = "";
    do {
      answer = (await rl.question(query)).trim();
      console.log();
    } while (!validatorFn(answer));

    // stop reading user input
    rl.close();

    return answer;
  }

  // -------------------------------------------------------------
  // View templates
  // - data will be injected from the Model through the Controller
  // -------------------------------------------------------------
  public createScoreView(
    playerScore: number,
    computerScore: number,
    drawCount: number
  ): string {
    let content = "";
    content += `==============================================\n`;
    content += `Player Score    : ${playerScore}\n`;
    content += `Computer Score  : ${computerScore}\n`;
    content += `Draws           : ${drawCount}\n`;
    content += `==============================================\n`;
    content += "";

    return content;
  }

  public createActionsListView(actions: Action[]): string {
    const actionListStr = actions
      .map((a) => `${a.key} - ${a.displayName}`)
      .join("\n");

    let content = "";
    content += actionListStr + "\n";
    content += "";

    return content;
  }

  public createMatchResultView(
    playerChoice: Choice,
    computerChoice: Choice,
    rpsResult: MatchResult
  ) {
    let result = "";
    switch (rpsResult) {
      case MatchResult.Draw:
        result = "It's a Draw! 🤝";
        break;
      case MatchResult.PlayerWins:
        result = "You Win! 🎉";
        break;
      case MatchResult.ComputerWins:
        result = "You Lose! 😫";
        break;
    }

    let content = "";
    content += `You chose       : ${Choice[playerChoice]}\n`;
    content += `Computer chose  : ${Choice[computerChoice]}\n\n`;
    content += result + "\n";

    return content;
  }
}
