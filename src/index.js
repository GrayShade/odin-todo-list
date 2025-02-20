import { compareAsc, format } from "date-fns";
import { styles } from "./styles/styles.css"
import { reset } from "./styles/reset.css"
import { icons } from "./../node_modules/@vectopus/atlas-icons/style.css";
import { Projects } from "./projects";
import { Tasks } from "./tasks";
import { UI } from "./ui";
import { ProjectsDisplay } from "./projectDisplay";
import { TasksDisplay } from "./taskDisplay";

class Main {
  static #proj = new Projects();
  static #task = new Tasks();
  static #ui = new UI();
  static #projDisplay = new ProjectsDisplay();
  static #taskDisplay = new TasksDisplay();
  start() {
    Main.#proj.createDefaultProject('proj1');
    Main.#projDisplay.showAllProjects(Main.#proj.getAllProjects());
    Main.#projDisplay.showSingleProject('proj1', Main.#proj.getAllProjects());
    Main.#taskDisplay.showAllTasks('p1');
    Main.#taskDisplay.showSingleTask(Main.#task.getTask('p1', 'p1t1'));
    Main.#task.getTask('p1', 'p1t1');
    Main.#task.createTask('p1');
    Main.#task.deleteTask('p1', 'p1t3');
    const updatedTask = {
      id: 'p1t2',
      projID: 'p1',
      title: 'Updated Task',
      description: '',
      dueDate: '',
      priority: ''
    };
    Main.#task.updateTask('p1', 'p1t2',updatedTask);
  }
}

let obj = new Main();
console.log(obj.start());
