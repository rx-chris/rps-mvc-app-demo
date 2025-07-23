import { Controller } from "./controller";
import { Router } from "./router";

/**
 * App class
 */
export class App {
  private router: Router;
  private controller: Controller;
  private isRunning: boolean;

  constructor() {
    this.controller = new Controller();
    this.router = new Router(this, this.controller);
    this.isRunning = false;
  }
  // -------------------------------------------------------------
  // *PUBLIC METHODS*
  // -------------------------------------------------------------

  // run the application
  public async run(): Promise<void> {
    this.controller.startApplication(this);

    while (this.isRunning) {
      await this.router.selectAction();
      await this.router.dispatchAction();
    }
  }

  // get the controller to close the application
  public exit(): void {
    this.controller.closeApplication(this);
  }
  // -------------------------------------------------------------
  // setters to be activated from controller
  // -------------------------------------------------------------

  // stop running application
  public stopRunning(): void {
    this.isRunning = false;
  }

  // start running application
  public startRunning(): void {
    this.isRunning = true;
  }
}
