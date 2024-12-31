import mealJson from "../../database/meals.json";
import dishJson from "../../database/dishes.json";
import menuJson from "../../database/menus.json";
class Model {
  constructor() {
    this.dishData = null;
    this.menuData = null;
    this.mealData = null;
  }

  readDataFiles() {
    this.dishData = dishJson;
    this.mealData = mealJson;
    this.menuData = menuJson;
  }
  shuffleArray(array) {
    let createdArr = array;
    for (var i = createdArr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = createdArr[i];
      createdArr[i] = createdArr[j];
      createdArr[j] = temp;
    }
    return createdArr;
  }
  chunkifyDishData() {
    const chunkSize = Math.round(this.dishData.length / 2);
    this.chunks = [];
    for (let i = 0; i < this.dishData.length; i += chunkSize) {
      this.chunks.push(this.dishData.slice(i, i + chunkSize));
    }
  }

  init() {
    this.readDataFiles();
    this.chunkifyDishData();
  }
}
export default Model;
