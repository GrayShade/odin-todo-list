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
    Main.#projUI.setNewProjModalUI();
    Main.#taskUI.setNewTaskModalUI();
    // Main.#taskUI.editTaskModalUI();

    // to create a new project:
    document.getElementById('new-project').addEventListener('click', (e) => {
      const newProjForm = document.getElementById('new-proj-form');
      this.#handleModal(newProjForm, e.target.id);
    });

    document.getElementById('new-proj-reset').addEventListener('click', (e) => {
      const modalFooterId = `${e.target.id.split('reset')[0]}footer`;
      Main.#validate.removeToast(modalFooterId);
      Main.#projUI.resetNewProjModalUI();
    });

    const allTasksArr = document.querySelectorAll('.new-task');
    for (let taskIdx = 0; taskIdx <= allTasksArr.length - 1; taskIdx++) {
      allTasksArr[taskIdx].addEventListener('click', (e) => {
        // To add a new Task:
        console.log('here');
        const newTaskForm = document.getElementById('new-task-form');
        this.#handleModal(newTaskForm, e.target.id);
      });
    }

    document.getElementById('new-task-reset').addEventListener('click', (e) => {
      const modalFooterId = `${e.target.id.split('reset')[0]}footer`;
      Main.#validate.removeToast(modalFooterId);
      Main.#taskUI.resetNewTaskModalUI();
    });
    
    // document.getElementById('new-project').addEventListener('click', (e) => {
    //   const newProjForm = document.getElementById('new-proj-form');
    //   this.#handleModal(newProjForm);
    // });

    // document.getElementById('reset-proj-btn').addEventListener('click', (e) => {
    //   debugger;
    //   Main.#projUI.resetNewProjModalUI();
    // });

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

  #handleModal(newForm, addBtnId) {
    // Main.#projUI.setNewProjModalUI();
    // const newProjForm = document.getElementById('new-proj-form');
    // remember that 'submit' event works only for form, not for buttons:
    const formId = document.getElementById(newForm.id).id;
    const inputs = document.querySelectorAll(`#${formId} .form-inputs`);

    for (let input of inputs) {
      input.addEventListener(('input'), e => {
        const ele_name = e.target.name;
        const ele_message = `${ele_name}-message`;
        Main.#validate.validateBeforeSubmit(e, ele_name, ele_message);
      });
    }
    newForm.addEventListener(('submit'), e => {
      // let req_fields_status = false;
      // let optional_fields_status = false;
      const req_inputs = document.querySelectorAll(`#${formId} input.required`);
      const req_msg_spans = document.querySelectorAll(`#${formId} span.required`);
      const optional_inputs = document.querySelectorAll(`#${formId} input.optional`);
      const optional_spans = document.querySelectorAll(`#${formId} span.optional`);

      const req_fields_status = this.getRequiredFieldsStatus(req_inputs, req_msg_spans, addBtnId);
      // const optional_fields_status = this.getOptionalFieldsStatus(optional_inputs, optional_spans);

      // if (req_fields_status == true && optional_fields_status == true) {
      // this.#processModal(e);
      const modalFooterId = `${e.target.id.split('form')[0]}footer`;
      if (req_fields_status == true) {
        switch (e.target.id) {
          case 'new-proj-form':
            Main.#proj.createProject(req_inputs[0].value);
            break;
          case 'new-task-form':
            const projId = addBtnId.split('-')[0][1];
            Main.#task.createTask(req_inputs[0].value, projId);
            break;
        }
        Main.#validate.removeToast(modalFooterId);
        Main.#validate.addToast(modalFooterId, 'success-toast', 'Modal Added Successfully!');

      }
      else {
        Main.#validate.removeToast(modalFooterId);
        Main.#validate.addToast(modalFooterId, 'error-toast', 'Some Error Occurred!');
      }
    });
  }

  getRequiredFieldsStatus(reqInputs, reqMsgSpans, addBtnId) {
    let reqFieldsStatus = false;
    const allProj = Main.#proj.getAllProjects();
    for (let i = 0; i < reqInputs.length; i++) {
      reqFieldsStatus = Main.#validate.validateReqAfterSubmit(reqInputs[i], reqMsgSpans[i], allProj, addBtnId);
      if (reqFieldsStatus == false) { return false };
    }
    return reqFieldsStatus;
  }

  getOptionalFieldsStatus(optionalInputs, optionalSpans) {
    let optFieldsStatus = false;
    for (let i = 0; i < optionalInputs.length; i++) {
      optFieldsStatus = this.validationObj.validateOptAfterSubmit(optionalInputs[i], optionalSpans[i]);
      if (optFieldsStatus == false) {
        break;
      }
    }
    return optFieldsStatus;
  }

}

let obj = new Main();
console.log(obj.start());
