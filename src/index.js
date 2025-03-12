import { compareAsc, format } from "date-fns";
import { styles } from "./styles/styles.css"
import { reset } from "./styles/reset.css"
import { icons } from "./../node_modules/@vectopus/atlas-icons/style.css";
import { Projects } from "./projects";
import { Tasks } from "./tasks";
import { UI } from "./ui";
import { ProjectsDisplay } from "./projectDisplay";
import { TasksDisplay } from "./taskDisplay";
import { Validation } from "./validation";

class Main {
  static #proj = new Projects();
  static #task = new Tasks();
  static #ui = new UI();
  static #projUI = new ProjectsDisplay();
  static #taskUI = new TasksDisplay();
  static #validate = new Validation();
  start() {

    this.setEventListeners();

    Main.#proj.createDefaultProject('default');

    // Main.#proj.createProject('sss');
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

    this.#expandCollapseDivs();
    // this.#setModal();
    Main.#projUI.setNewProjModalUI();

    // to create a new project:
    document.getElementById('new-project').addEventListener('click', (e) => {
      this.#setModal();
      // Main.#projUI.createProjectModel();
      // Main.#proj.createProject('custom Project');
      // alert('here');

    });

  }

  #expandCollapseDivs() {
    // to expand or collapse divs:
    const showHideDivArr = document.querySelectorAll('.showHide');
    for (let showHideIdx = 0; showHideIdx <= showHideDivArr.length - 1; showHideIdx++) {
      showHideDivArr[showHideIdx].addEventListener('click', (e) => {
        Main.#ui.showHideDivs(e);
      });
    }
  }

  #setModal() {
    // Main.#projUI.setNewProjModalUI();
    const form = document.getElementById('new-proj-form');
    // remember that 'submit' event works only for form, not for buttons:

    const inputs = document.querySelectorAll('.form-inputs');
    for (let input of inputs) {
      input.addEventListener(('input'), e => {
        const ele_name = e.target.name;
        const ele_message = `${ele_name}-message`;
        Main.#validate.validateBeforeSubmit(e, ele_name, ele_message);
      });
    }
    form.addEventListener(('submit'), e => {
      
      const req_inputs = document.querySelectorAll('input.required');
      const req_msg_spans = document.querySelectorAll('span.required');
      let req_fields_status = false;
      let optional_fields_status = false;
      const allProjects = Main.#proj.getAllProjects();
      for (let i = 0; i < req_inputs.length; i++) {
        req_fields_status = Main.#validate.validateRequiredAfterSubmit(req_inputs[i], req_msg_spans[i], allProjects);
      }
      // const optional_inputs = document.querySelectorAll('input.optional');
      // const optional_spans = document.querySelectorAll('span.optional');
      // for (let i = 0; i < optional_inputs.length; i++) {
      //   optional_fields_status = this.validationObj.validateOptionalAfterSubmit(optional_inputs[i], optional_spans[i]);
      //   if (optional_fields_status == false) {
      //     break;
      //   }
      // }

      // if (req_fields_status == true && optional_fields_status == true) {
      // this.#processModal(e);
      if (req_fields_status == true) {
        Main.#proj.createProject(req_inputs[0].value);
        Main.#validate.removeToast();
        Main.#validate.addToast('success-toast', 'Modal Added Successfully!');

      }
      else {
        Main.#validate.removeToast();
        Main.#validate.addToast('error-toast', 'Some Error Occurred!');
      }
    });
  }

}

let obj = new Main();
console.log(obj.start());
