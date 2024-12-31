import View from "./../view/mainView";
import Model from "./../model/model";

class App {
  constructor() {
    const model = new Model();
    model.init();
    const view = new View(model);
    view.init();
  }
}
const app = new App();
