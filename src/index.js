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
  static #projUI = new ProjectsDisplay();
  static #taskUI = new TasksDisplay();
  start() {

    Main.#proj.createDefaultProject('default');
    // Main.#proj.createProject('custom Project');
    Main.#proj.updateProject(7, 'updated Project')
    Main.#proj.deleteProject(3);
    Main.#projUI.showAllProjects(Main.#proj.getAllProjects());
    Main.#projUI.showSingleProject(0, Main.#proj.getAllProjects());
    Main.#taskUI.showAllTasks(0);
    Main.#taskUI.showSingleTask(Main.#task.getTask(0, 0));
    
    Main.#task.deleteTask(7, 1);
    // Main.#task.createTask(7);
    Main.#task.getTask(0, 0);
    const updatedTask = {
      // taskId: 0,
      // projId: 0,
      title: 'Updated Task',
      description: '',
      dueDate: '',
      priority: ''
    };
    Main.#task.updateTask(0, 0, updatedTask);
  }
}

let obj = new Main();
console.log(obj.start());
