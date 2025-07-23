import { App } from "./app";
import { Controller } from "./controller";
import { Choice } from "./model";

// stores key mapping to controller action
export interface Action {
  key: string;
  perform: () => void | Promise<void>;
  displayName: string;
}

// keys used to categorise actions
export type ActionsCategory = "player" | "computer" | "gameMode";

// actions grouped by category
type GroupedActions = {
  [key in ActionsCategory]: {
    query: string;
    actions: Action[];
  };
};

/**
 * Router class
 *  - Maps user input from the View to correct Controller action
 */
export class Router {
  private app: App;
  private controller: Controller;
  public groupedActions: GroupedActions;
  public actionKey: string;
  public actionsCategory: ActionsCategory;

  constructor(app: App, controller: Controller) {
    this.app = app;
    this.controller = controller;
    this.groupedActions = this.initializeActions();
    this.actionsCategory = "gameMode";
    this.actionKey = "";
  }

  // -------------------------------------------------------------
  // *PUBLIC METHODS*
  // -------------------------------------------------------------

  // -------------------------------------------------------------
  // setters
  // -------------------------------------------------------------

  public setActionCategory(value: ActionsCategory) {
    this.actionsCategory = value;
  }

  // -------------------------------------------------------------
  // Select and dispatches user actions
  // -------------------------------------------------------------

  // select action key from user input
  public async selectAction(): Promise<void> {
    const actions = this.getActions();
    const query = this.getActionsQuery() + ":\n> ";
    this.actionKey = await this.controller.promptAction(actions, query);
  }

  // dispatch action from action key
  public async dispatchAction(): Promise<void> {
    const action = this.getActions().find((a) => a.key === this.actionKey);
    await action.perform();
  }
  // -------------------------------------------------------------
  // *PRIVATE METHODS*
  // -------------------------------------------------------------

  // -------------------------------------------------------------
  // getters
  // -------------------------------------------------------------
  private getActions(): Action[] {
    return this.groupedActions[this.actionsCategory]["actions"];
  }

  private getActionsQuery(): string {
    return this.groupedActions[this.actionsCategory]["query"];
  }

  // -------------------------------------------------------------
  // All application actions
  // -------------------------------------------------------------

  // centralised location to manage all actions that are grouped by category
  private initializeActions(): GroupedActions {
    const quitApp = {
      key: "q",
      perform: this.app.exit.bind(this.app),
      displayName: "Quit Application",
    };
    return {
      gameMode: {
        query: "Select a game mode",
        actions: [
          {
            key: "p",
            perform: this.controller.choosePlayerMode.bind(
              this.controller,
              this
            ),
            displayName: "Player(You) vs Computer",
          },
          {
            key: "c",
            perform: this.controller.chooseComputerMode.bind(
              this.controller,
              this
            ),
            displayName: "Computer(You) vs Player",
          },
        ],
      },
      player: {
        query: "Select an action",
        actions: [
          {
            key: "r",
            perform: this.controller.chooseRock.bind(this.controller),
            displayName: Choice[Choice.Rock],
          },
          {
            key: "p",
            perform: this.controller.choosePaper.bind(this.controller),
            displayName: Choice[Choice.Paper],
          },
          {
            key: "s",
            perform: this.controller.chooseScissors.bind(this.controller),
            displayName: Choice[Choice.Scissors],
          },
          quitApp,
        ],
      },
      computer: {
        query: "Please select a game mode",
        actions: [
          {
            key: "p",
            perform: this.controller.chooseRandom.bind(this.controller),
            displayName: "Play",
          },
          quitApp,
        ],
      },
    };
  }
}
