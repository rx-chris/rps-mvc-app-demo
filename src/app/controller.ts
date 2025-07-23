import { App } from "./app";
import { Choice, Model } from "./model";
import { View } from "./view";
import { Action, Router } from "./router";

/**
 * Controller class
 *  - Intermediary between Model and View
 *  - Manipulates the model and renders data from the Model in the View
 */
export class Controller {
  private model: Model;
  private view: View;

  constructor() {
    this.model = new Model();
    this.view = new View();
  }
  // -------------------------------------------------------------
  // *PUBLIC METHODS*
  // -------------------------------------------------------------

  // -------------------------------------------------------------
  // Application controllers
  // -------------------------------------------------------------

  // start the application
  public startApplication(app: App): void {
    this.view.clear();
    this.view.display("\nStarting Application...\n\n\n");
    app.startRunning();
  }
  // closes the application
  public closeApplication(app: App): void {
    this.view.display("\nExiting Application...\n");
    this.view.display("\nThank you for playing! Goodbye!\n");
    app.stopRunning();
  }

  // -------------------------------------------------------------
  // User selects one of these actions (dispatched by Router)
  // -------------------------------------------------------------

  // player chooses rock
  public chooseRock(): void {
    this.model.setPlayerChoice(Choice.Rock);
    this.playMatchWithComputer();
  }

  // player chooses paper
  public choosePaper(): void {
    this.model.setPlayerChoice(Choice.Paper);
    this.playMatchWithComputer();
  }

  // player chooses scissors
  public chooseScissors(): void {
    this.model.setPlayerChoice(Choice.Scissors);
    this.playMatchWithComputer();
  }

  // player chooses randomly, rock, paper or scissors
  public chooseRandom(): void {
    this.model.setRandomPlayerChoice();
    this.playMatchWithComputer();
  }

  // player able to select rock, paper or scissors
  public choosePlayerMode(router: Router): void {
    router.setActionCategory("player");
    // update view
    this.displayScoreView();
  }

  // player lets computer select rock, paper or scissors
  public chooseComputerMode(router: Router): void {
    router.setActionCategory("computer");
    // update view
    this.displayScoreView();
  }

  // -------------------------------------------------------------
  // Used by Router
  // -------------------------------------------------------------

  // called by the router to prompt user for an action
  public async promptAction(actions: Action[], promptQuery: string) {
    // list actions
    this.displayActionsListView(actions);

    // function to validate user input matches action keys
    const actionKeys = new Set(actions.map((a) => a.key));
    const validatorFn = (input: string) => actionKeys.has(input);

    // prompt user to select action
    const actionKey = await this.view.prompt(promptQuery, validatorFn);

    // return action key
    return actionKey;
  }
  // -------------------------------------------------------------
  // *PRIVATE METHODS*
  // -------------------------------------------------------------
  private playMatchWithComputer(): void {
    // manipulate model
    this.model.playMatch();

    // update view with model data
    this.displayScoreView();
    this.displayMatchResultView();
  }

  // -------------------------------------------------------------
  // Create and display views
  // -------------------------------------------------------------

  private displayScoreView(): void {
    const scoreView = this.view.createScoreView(
      this.model.getPlayerScore(),
      this.model.getComputerScore(),
      this.model.getDrawCount()
    );
    this.view.clear();
    this.view.display(scoreView);
  }

  private displayMatchResultView() {
    const matchResultView = this.view.createMatchResultView(
      this.model.getPlayerChoice(),
      this.model.getComputerChoice(),
      this.model.getMatchResult()
    );
    this.view.display(matchResultView);
  }

  private displayActionsListView(actions: Action[]) {
    const actionsListsView = this.view.createActionsListView(actions);
    this.view.display(actionsListsView);
  }
}
