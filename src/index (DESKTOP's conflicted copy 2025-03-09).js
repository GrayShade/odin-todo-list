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

    this.setEventListeners();

    Main.#proj.createDefaultProject('default');
    // Main.#proj.createProject('custom Project');
    Main.#proj.updateProject(7, 'updated Project')
    Main.#proj.deleteProject(3);
    Main.#projUI.showAllProjects(Main.#proj.getAllProjects());
    Main.#projUI.showSingleProject(0, Main.#proj.getAllProjects());
    Main.#taskUI.showAllTasks(0);
    Main.#taskUI.showSingleTask(Main.#task.getTask(0, 0));
    
    Main.#task.deleteTask(0, 1);
    // Main.#task.createTask(0);
    
    const date = format(new Date(2025, 1, 26), 'dd-MMM-yy');
    
    const updatedTask = {
      taskId: 0,
      projId: 0,
      title: 'updated Task',
      description: '',
      dueDate: date,
      priority: ''
    };
    Main.#task.updateTask(0, 0, updatedTask);
    Main.#task.getTask(0, 0);
  }

  setEventListeners() {
    const exCollDiv = document.querySelectorAll('.expand');
    for (let exCollEle = 0; exCollEle <= exCollDiv.length - 1; exCollEle++) {
      exCollDiv[exCollEle].addEventListener('click', (e) => {
        // debugger;
        let ele = document.getElementById('proj-expand-left-p');
        console.log(e.target.parentElement);
        
        // alert(e.target)
      });
    }
  }
}

let obj = new Main();
console.log(obj.start());
