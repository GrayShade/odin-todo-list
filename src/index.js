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
    Main.#proj.createDefaultProject('default');
    Main.#projDisplay.showAllProjects(Main.#proj.getAllProjects());
    Main.#projDisplay.showSingleProject(0, Main.#proj.getAllProjects());
    Main.#taskDisplay.showAllTasks(0);
    Main.#taskDisplay.showSingleTask(Main.#task.getTask(0, 0));
    Main.#task.createTask(0);
    Main.#task.getTask(0, 0);
    debugger;
    Main.#task.deleteTask(0, 2);
    const updatedTask = {
      taskId: 1,
      projId: 0,
      title: 'Updated Task',
      description: '',
      dueDate: '',
      priority: ''
    };
    Main.#task.updateTask(0, 1,updatedTask);
  }
}

let obj = new Main();
console.log(obj.start());
