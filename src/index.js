import { compareAsc, format } from "date-fns";
import { styles } from "./styles/styles.css"
import { reset } from "./styles/reset.css"
import { icons } from "./../node_modules/@vectopus/atlas-icons/style.css";
import { EventBus } from './eventBus.js';
import { Projects } from "./projects";
import { Tasks } from "./tasks";
import { UI } from "./ui";
import { ProjectsDisplay } from "./projectDisplay";
import { TasksDisplay } from "./taskDisplay";
import { Validation } from "./validation";

class Main {

  // .........................EventBus AKA pub/sub pattern.........................................
  setupEventBusListeners() {
    const newProjForm = document.getElementById('new-proj-form');
    // We need to call << handleModal() >> from << projDisplay.js >>, but want to at least maintain loose
    //  coupling, we use EventBus. EventBus uses pub/sub pattern. Also, we are setting up eventBus listeners
    //  only once using << eventBus.on() >> below. So, no need to destroy them afterwards to avoid duplication.
    //  << eventBus.emit >> can be used repeatedly without needing destroying.
    // When eventBus of << projDisplay.js >> emits << 'handleModal' >>, then:
    Main.eventBus.on('handleModal', (projId) => this.#handleModal(newProjForm, 'add-proj-btn', 'update-project', projId));
  }
  // Initialize the event bus
  static eventBus = new EventBus();
  // passing event bus object to #proj object
  static #proj = new Projects(this.eventBus);
  // passing event bus object to #ui object
  static #ui = new UI(this.eventBus);
  // passing event bus object to #projUI object
  static #projUI = new ProjectsDisplay(this.eventBus);
  // .............................................................................................

  static #controller = new AbortController();

  // static #proj = new Projects();
  static #task = new Tasks();
  static #taskUI = new TasksDisplay();
  static #validate = new Validation();

  start() {
    Main.#proj.createDefaultProject('default');
    this.#updateLBarProjectsAndTasks();

    this.setupEventBusListeners();

    Main.#proj.updateProject(7, 'updated Project')
    Main.#proj.deleteProject(3);
    Main.#projUI.showAllProjects(Main.#proj.getAllProjects());
    Main.#projUI.showSingleProject(0, Main.#proj.getAllProjects());
    // Main.#taskUI.showAllTasks(0);
    Main.#taskUI.showSingleTask(Main.#task.getTask(0, 0));

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

  #updateLBarProjectsAndTasks() {
    Main.#projUI.showLBarProjects(Main.#proj.getAllProjects());
    Main.#taskUI.showLBarTasks(Main.#proj.getAllProjects());
    // As all event listeners will be deleted upon updating nodes:
    this.#setEventListeners();
  }

  #setEventListeners() {
    this.#expandCollapseDivs();
    Main.#projUI.setNewProjModalUI(Main.#proj.getAllProjects(), 'new-project');
    Main.#taskUI.setNewTaskModalUI();

    // to create a new project:
    document.getElementById('new-project').addEventListener('click', (e) => {
      const modalHeader = document.querySelector('.modal-header h3');
      modalHeader.textContent = 'New Project';
      const addProjModalBtn = document.getElementById('add-proj-btn');
      addProjModalBtn.textContent = 'Add Project';

      Main.#ui.removeToast('new-proj-footer', 'project');
      const newProjForm = document.getElementById('new-proj-form');
      this.#handleModal(newProjForm, e.target.id, 'new-project');
    });

    // to reset project modal:
    document.getElementById('new-proj-reset').addEventListener('click', (e) => {
      const modalFooterId = `${e.target.id.split('reset')[0]}footer`;
      Main.#ui.removeToast(modalFooterId, 'project');
      Main.#projUI.resetNewProjModalUI();
    });
    // To add a new Task:
    const allTasksArr = document.querySelectorAll('.new-task');
    for (let taskIdx = 0; taskIdx <= allTasksArr.length - 1; taskIdx++) {
      allTasksArr[taskIdx].addEventListener('click', (e) => {
        Main.#ui.removeToast('new-task-footer', 'task');
        const newTaskForm = document.getElementById('new-task-form');
        this.#handleModal(newTaskForm, e.target.id, 'new-task');
      });
    }
    // to reset task modal:
    document.getElementById('new-task-reset').addEventListener('click', (e) => {
      const modalFooterId = `${e.target.id.split('reset')[0]}footer`;
      Main.#ui.removeToast(modalFooterId, 'task');
      Main.#taskUI.resetNewTaskModalUI();
    });

    // to show all projects summary:
    document.getElementById('projects-sumry').addEventListener('click', (e) => {
      Main.#projUI.showAllProjectsSummary(Main.#proj.getAllProjects());

    });
    // to show all tasks summary:
    const allShowTasksSumArr = document.querySelectorAll('.tasks-sumry');
    for (let taskIdx = 0; taskIdx <= allShowTasksSumArr.length - 1; taskIdx++) {
      allShowTasksSumArr[taskIdx].addEventListener('click', (e) => {
        const projId = e.target.id.split('-')[0].split('p')[1];
        Main.#taskUI.showAllTasksSummary(projId);
      });
    }
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

  #handleModal(newForm, addBtnId, actionType, projId = '') {
    const targetType = actionType.split('-')[1];
    // remember that 'submit' event works only for form, not for buttons:
    const formId = document.getElementById(newForm.id).id;
    const inputs = document.querySelectorAll(`#${formId} .form-inputs`);
    for (let input of inputs) {
      input.addEventListener(('input'), e => {
        const eleName = e.target.name;
        const eleMessage = `${eleName}-message`;
        Main.#validate.validateBeforeSubmit(e, eleName, eleMessage);
      });
    }

    // Abort previous listener before creating a new one:
    Main.#controller.abort();
    // We have declared << controller >> above as static variables too. Using static variables lets us
    //  keep record as function data would have lost otherwise & first time created listener could not be aborted
    //  as non static variables in function won't remember the previous listener as they are created just now. 
    //  After aborting previous one using << Main.controller.abort() >>, or for a first time listener,
    //  now again attach << signal >> to abort it when this function body gets executed next time.
    Main.#controller = new AbortController();
    // As signal to be attached to a listener << { signal } >> can't be static variable, Storing it as a normal variable:
    let signal = Main.#controller.signal;

    newForm.addEventListener(('submit'), (e) => {
      const reqInputs = document.querySelectorAll(`#${formId} input.required`);
      const reqMsgSpans = document.querySelectorAll(`#${formId} span.required`);
      const optInputs = document.querySelectorAll(`#${formId} input.optional`);
      const optMsgSpans = document.querySelectorAll(`#${formId} span.optional`);
      const allInputs = document.querySelectorAll(`#${formId} input,select`);

      let toastMessage = '';

      const reqFieldsStatus = this.getRequiredFieldsStatus(reqInputs, reqMsgSpans, addBtnId);
      const modalFooterId = `${e.target.id.split('form')[0]}footer`;
      if (reqFieldsStatus == true) {
        switch (actionType) {
          case 'new-project':
            Main.#proj.createProject(reqInputs[0].value);
            this.#updateLBarProjectsAndTasks();
            toastMessage = 'Project Added Successfully';
            break;
          case 'new-task':
            const taskProjId = addBtnId.split('-')[0].split('p')[1];
            Main.#task.createTask(allInputs, taskProjId);
            this.#updateLBarProjectsAndTasks();
            toastMessage = 'Task Added Successfully';
            break;
          case 'update-project':
            const newTitle = document.getElementById('new-proj-title').value;
            Main.#proj.updateProject(projId, newTitle);
            this.#updateLBarProjectsAndTasks();
            toastMessage = 'Project Updated Successfully';
            break;
          case 'delete-project':

          break;
        }
        Main.#ui.removeToast(modalFooterId, targetType);
        Main.#ui.addToast(modalFooterId, 'success-toast', toastMessage, targetType);
      }
      else {
        Main.#ui.removeToast(modalFooterId, targetType);
        toastMessage = 'Some Error Occurred!';
        Main.#ui.addToast(modalFooterId, 'error-toast', toastMessage, targetType);
      }
      Main.#projUI.showAllProjectsSummary(Main.#proj.getAllProjects());
    }, { signal });
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
      optFieldsStatus = Main.#validate.validateOptAfterSubmit(optionalInputs[i], optionalSpans[i]);
      if (optFieldsStatus == false) {
        break;
      }
    }
    return optFieldsStatus;
  }
}

let obj = new Main();
console.log(obj.start());
