import { compareAsc, format } from "date-fns";
import { styles } from "./styles/styles.css"
import { reset } from "./styles/reset.css"
import { replace } from 'feather-icons';
import { EventBus } from './eventBus.js';
import { Projects } from "./projects";
import { Tasks } from "./tasks";
import { UI } from "./ui";
import { ProjectsDisplay } from "./projectDisplay";
import { TasksDisplay } from "./taskDisplay";
import { Validation } from "./validation";

class Main {

  constructor() {
    // for feather icons loading:
    replace();
    this.rerun = false;
  }

  // .........................EventBus AKA pub/sub pattern.........................................
  setupEventBusListeners() {
    const newProjForm = document.getElementById('new-proj-form');
    // We need to call << handleModal() >> from << projDisplay.js >>, but want to at least maintain loose
    //  coupling, we use EventBus. EventBus uses pub/sub pattern. Also, we are setting up eventBus listeners
    //  only once using << eventBus.on() >> below. So, no need to destroy them afterwards to avoid duplication.
    //  << eventBus.emit >> can be used repeatedly without needing destroying.
    // When eventBus of << projDisplay.js >> emits << 'handleModal' >>, then:
    Main.eventBus.on('handleModalProj', (actionType, projId) => this.#handleModal(newProjForm, 'new-project', actionType, projId));
    const newTaskForm = document.getElementById('new-task-form');
    Main.eventBus.on('handleModalTask', (actionType, projId, taskId) => this.#handleModal(newTaskForm, `p${projId}-new-task`, actionType, taskId));
  }
  // Initialize the event bus
  static eventBus = new EventBus();
  // passing event bus object to #proj object
  static #proj = new Projects(this.eventBus);
  // passing event bus object to #task object
  static #task = new Tasks(this.eventBus);
  // passing event bus object to #ui object
  static #ui = new UI(this.eventBus);
  // passing event bus object to #projUI object
  static #projUI = new ProjectsDisplay(this.eventBus);
  // passing event bus object to #taskUI object
  static #taskUI = new TasksDisplay(this.eventBus);
  // .............................................................................................

  static #controller = new AbortController();
  static #validate = new Validation();

  start() {
    document.addEventListener('DOMContentLoaded', () => {
      replace();
    });

    // Give projects Container Orange Color As it is Open from the get go:
    const projContainerP = document.getElementById('proj-showHide-left-p');
    projContainerP.style.color = '#ffa500';
    projContainerP.style['font-weight'] = '600';

    Main.#proj.createDefaultProject('Default');
    this.#updateLBarProjectsAndTasks();
    Main.#projUI.showAllProjectsSummary(Main.#proj.getAllProjects());
    Main.#ui.showHideTaskTableControls('proj-sum-table', 4, 'proj-td5');
    this.setupEventBusListeners();
    Main.#taskUI.closeDetailDeleteModals();

    // to reset project modal:
    document.getElementById('new-proj-reset').addEventListener('click', (e) => {
      const modalFooterId = `${e.target.id.split('reset')[0]}footer`;
      Main.#ui.removeToast(modalFooterId, 'project');
      Main.#projUI.resetNewProjModalUI('new-proj-form');
    });
    // to reset task modal:
    document.getElementById('new-task-reset').addEventListener('click', (e) => {
      const modalFooterId = `${e.target.id.split('reset')[0]}footer`;
      Main.#ui.removeToast(modalFooterId, 'task');
      Main.#taskUI.resetNewTaskModalUI('new-task-form');
    });
  }

  #updateLBarProjectsAndTasks() {
    Main.#projUI.showLBarProjects(Main.#proj.getAllProjects());
    Main.#taskUI.showLBarTasks(Main.#proj.getAllProjects());
    // As all event listeners will be deleted upon updating nodes:
    this.#setEventListeners();
  }

  #setEventListeners() {
    this.#expandCollapseDivs(Main.#proj.getAllProjects(), 'new-project');
    Main.#projUI.setNewProjModalUI(Main.#proj.getAllProjects(), 'new-project');
    Main.#taskUI.setNewTaskModalUI();

    // to create a new project:
    document.getElementById('new-project').addEventListener('click', (e) => {
      const modalHeader = document.querySelector('.modal-header h3');
      modalHeader.textContent = 'New Project';
      // to show input div again if it was removed when showing delete project modal: 
      document.querySelector('.form-input-div').style.display = 'flex';
      document.getElementById('del-confirm-proj').style.display = 'none';
      document.getElementById('del-proj-btn').style.display = 'none';
      document.getElementById('del-proj-cancel').style.display = 'none';
      document.getElementById('add-proj-btn').style.display = 'block';
      document.getElementById('new-proj-reset').style.display = 'block';
      const addProjModalBtn = document.getElementById('add-proj-btn');
      addProjModalBtn.textContent = 'Add Project';

      Main.#ui.removeToast('new-proj-footer', 'project');
      const newProjForm = document.getElementById('new-proj-form');
      this.#handleModal(newProjForm, e.target.id, 'new-project');
    });


    // To add a new Task:
    const allTasksArr = document.querySelectorAll('.new-task');
    for (let taskIdx = 0; taskIdx <= allTasksArr.length - 1; taskIdx++) {
      allTasksArr[taskIdx].addEventListener('click', (e) => {
        document.getElementById('new-task-form').style.display = 'flex';
        document.getElementById('del-confirm-task').style.display = 'none';
        document.getElementById('complete-confirm-task').style.display = 'none';
        document.getElementById('complete-task-btn').style.display = 'none';
        document.getElementById('del-task-btn').style.display = 'none';
        document.getElementById('del-task-cancel').style.display = 'none';
        document.querySelector('#task-modal-header h3').textContent = 'New Task';

        // Show & reset form buttons & labels again if changed by task edit & task delete modals:
        const addTaskModalBtn = document.getElementById('add-task-btn');
        addTaskModalBtn.style.display = 'block';
        addTaskModalBtn.textContent = 'Create Task';
        const newTaskReset = document.getElementById('new-task-reset');
        newTaskReset.style.display = 'block';
        newTaskReset.textContent = 'Reset Form';

        // Hide task input for project if its a new task form & not for updating: 
        document.getElementById('task-proj-input-div').style.display = 'none';
        Main.#ui.removeToast('new-task-footer', 'task');
        Main.#taskUI.resetNewTaskModalUI('new-task-form');
        const newTaskForm = document.getElementById('new-task-form');
        this.#handleModal(newTaskForm, e.target.id, 'new-task');
      });
    }


    // to show all projects summary:
    document.getElementById('projects-sumry').addEventListener('click', (e) => {
      Main.#projUI.showAllProjectsSummary(Main.#proj.getAllProjects());
      Main.#ui.showHideTaskTableControls('proj-sum-table', 4, 'proj-td5');
    });
    // to show all tasks summary against a project:
    const allShowTasksSumArr = document.querySelectorAll('.tasks-sumry');
    for (let taskIdx = 0; taskIdx <= allShowTasksSumArr.length - 1; taskIdx++) {
      allShowTasksSumArr[taskIdx].addEventListener('click', (e) => {
        let projId = '';
        // if icon is clicked, then that << span >> is selected instead of << p >>. So:
        if (e.target.classList.contains('left-bar-span')) {
          projId = e.target.parentElement.id.split('-')[0].split('p')[1];
        } else {
          projId = e.target.id.split('-')[0].split('p')[1];
        }
        Main.#taskUI.showAllTasksSummary(Main.#proj.getAllProjects(), projId);
        Main.#ui.showHideTaskTableControls('task-sum-table', 4, 'task-td8');
      });
    }

    const allLeftBarProjTasks = document.querySelectorAll('.left-bar-p-task');
    for (let taskIdx = 0; taskIdx <= allLeftBarProjTasks.length - 1; taskIdx++) {
      allLeftBarProjTasks[taskIdx].addEventListener('click', (e) => {
        let projId = '';
        // if icon is clicked, then that << span >> is selected instead of << p >>. So:
        if (e.target.classList.contains('left-bar-span-task')) {
          projId = e.target.parentElement.id.split('-')[0].split('p')[1];
        } else {
          projId = e.target.id.split('-')[0].split('p')[1];
        }

        const allProjects = Main.#proj.getAllProjects();
        const projTitle = JSON.parse(allProjects[projId])[`p${projId}`].title;
        let taskId = '';
        if (e.target.classList.contains('left-bar-span-task')) {
          taskId = e.target.parentElement.id.split('-')[1].split('t')[1];
        } else {
          taskId = e.target.id.split('-')[1].split('t')[1];
        }
        const modal = document.getElementById('task-details-modal');
        modal.style.display = 'block';
        Main.#task.populateTaskDetailValues(projTitle, projId, taskId);
      });
    }

    // to show all completed tasks against a project:
    const allShowTasksComArr = document.querySelectorAll('.tasks-completed');
    for (let taskIdx = 0; taskIdx <= allShowTasksComArr.length - 1; taskIdx++) {
      allShowTasksComArr[taskIdx].addEventListener('click', (e) => {
        let projId = '';
        // if icon is clicked, then that << span >> is selected instead of << p >>. So:
        if (e.target.classList.contains('left-bar-span')) {
          projId = e.target.parentElement.id.split('-')[0].split('p')[1];
        } else {
          projId = e.target.id.split('-')[0].split('p')[1];
        }
        Main.#taskUI.showAllTasksCompleted(Main.#proj.getAllProjects(), projId);
        Main.#ui.showHideTaskTableControls('task-com-table', 4, 'task-td8');
      });
    }
  }

  #expandCollapseDivs(allProjects) {
    // to expand or collapse divs:
    const showHideDivArr = document.querySelectorAll('.showHide');
    for (let showHideIdx = 0; showHideIdx <= showHideDivArr.length - 1; showHideIdx++) {

      // On updating projects & tasks, left bar elements are removed & constructed again. On
      //  them, listeners need to be redefined. .showHide before Projects container is not
      //  removed, So skipping it to prevent multiple event listeners calling:
      if (this.rerun && showHideDivArr[showHideIdx].classList.contains('skip-rerun')) {
        continue;
      }
      this.rerun = true;
      showHideDivArr[showHideIdx].addEventListener('click', (e) => {
        const showHideDivsStatus = Main.#ui.showHideDivs(e);
        let projDiv = '';
        if (e.target.parentElement.parentElement.classList.contains('project')) {
          projDiv = e.target.parentElement.parentElement;
        } else if (e.target.parentElement.parentElement.parentElement.classList.contains('project')) {
          projDiv = e.target.parentElement.parentElement.parentElement;
        }
        if (showHideDivsStatus == 'hidden') {
          Main.#projUI.showAllProjectsSummary(allProjects);
          Main.#ui.showHideTaskTableControls('proj-sum-table', 4, 'proj-td5');
          // To show tasks summary on expanding a project:
        } else if (showHideDivsStatus == 'shown' && projDiv !== '') {
          const projId = e.target.parentElement.parentElement.id.split('-')[0].split('p')[1];
          Main.#taskUI.showAllTasksSummary(Main.#proj.getAllProjects(), projId);
          Main.#ui.showHideTaskTableControls('task-sum-table', 4, 'task-td8');
        }
      });
    }
  }

  // Below default parameter << taskOrProjId >> is for updating tasks or projects: 
  #handleModal(newForm, LBarBtnId, actionType, taskOrProjId = '') {

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

    const targetType = actionType.split('-')[1];
    // remember that 'submit' event works only for form, not for buttons:
    const formId = document.getElementById(newForm.id).id;
    const inputs = document.querySelectorAll(`#${formId} .form-inputs, #${formId} .form-inputs`);

    for (let input of inputs) {
      input.addEventListener(('input'), e => {
        const eleName = e.target.name;
        const eleMessage = `${eleName}-message`;
        Main.#validate.validateBeforeSubmit(e, eleName, eleMessage, actionType);
      }, { signal });

      input.addEventListener('click', (e) => {
        const modalFooterId = e.target.parentElement.parentElement.id.split('-form')[0].concat('-footer');
        Main.#ui.removeToast(modalFooterId, targetType)
      }, { signal });
    }

    newForm.addEventListener(('submit'), (e) => {
      const reqInputs = document.querySelectorAll(`#${formId} input.required`);
      const reqMsgSpans = document.querySelectorAll(`#${formId} span.required`);
      const optInputs = document.querySelectorAll(`#${formId} input.optional, #${formId} textarea.optional`);
      const optMsgSpans = document.querySelectorAll(`#${formId} span.optional`);
      let allInputs = document.querySelectorAll(`#${formId} input,#${formId} select, #${formId} textarea`);

      let projIdOfTask;
      projIdOfTask = LBarBtnId.split('-')[0].split('p')[1];
      let reqFieldsStatus;
      let optFieldsStatus;
      let toastMessage;
      // for deletion, we don't need validation:
      const statusCheckSkipped = ['delete-project', 'delete-task', 'task-details', 'complete-task'];
      if (statusCheckSkipped.includes(actionType)) {
        reqFieldsStatus = true;
      } else {
        const elementsParameter = { allInputs, reqInputs, reqMsgSpans };
        reqFieldsStatus = this.getRequiredFieldsStatus(taskOrProjId, elementsParameter, LBarBtnId, actionType);
        optFieldsStatus = this.getOptionalFieldsStatus(optInputs, optMsgSpans, actionType);
      }
      const modalFooterId = `${e.target.id.split('form')[0]}footer`;
      if ((reqFieldsStatus == true && optFieldsStatus == true) || statusCheckSkipped.includes(actionType)) {
        // to trim trailing spaces allowed by HTML pattern attribute:
        for (let i = 0; i < allInputs.length; i++) { allInputs[i].value = allInputs[i].value.trim(); }
        switch (actionType) {
          case 'new-project':
            Main.#proj.createProject(reqInputs[0].value);
            toastMessage = 'Project Added Successfully';
            this.#postProcessModal(modalFooterId, actionType, toastMessage, projIdOfTask);
            break;
          case 'update-project':
            if (taskOrProjId == 0) {
              toastMessage = 'Cannot Update Default Project'
              this.handleErrorToast(modalFooterId, targetType, toastMessage);
              break;
            }
            const newTitle = document.getElementById('new-proj-title').value;
            Main.#proj.updateProject(taskOrProjId, newTitle);
            toastMessage = 'Project Updated Successfully';
            this.#postProcessModal(modalFooterId, actionType, toastMessage);
            break;
          case 'delete-project':
            if (taskOrProjId == 0) {
              toastMessage = 'Cannot Delete Default Project'
              this.handleErrorToast(modalFooterId, targetType, toastMessage);
              break;
            }
            Main.#proj.deleteProject(taskOrProjId);
            toastMessage = 'Project Deleted Successfully';
            this.#postProcessModal(modalFooterId, actionType, toastMessage);
            Main.#ui.hideBtnsAfterShowingToast('del-proj-btn', 'del-proj-cancel');
            break;
          case 'new-task':
            projIdOfTask = LBarBtnId.split('-')[0].split('p')[1];
            Main.#task.createTask(allInputs, projIdOfTask);
            toastMessage = 'Task Added Successfully';
            this.#postProcessModal(modalFooterId, actionType, toastMessage, projIdOfTask);
            break;
          case 'update-task':
            projIdOfTask = LBarBtnId.split('-')[0].split('p')[1];
            let updatedProjId = document.getElementById('task-project').value;
            // if project is not chosen to be updated, assign task same project:
            if (updatedProjId == '') {
              updatedProjId = projIdOfTask;
            } else {
              updatedProjId = Main.#proj.getProjectIdByTitle(updatedProjId);
            }
            const updatedTask = {
              completed: 0,
              taskId: Number(taskOrProjId),
              projId: Number(updatedProjId),
              title: document.getElementById('task-title').value,
              description: document.getElementById('task-desc').value,
              dueDate: document.getElementById('task-dueDate').value,
              priority: document.getElementById('task-priority').value
            };
            // if task is chosen to be modified for same project:
            if (projIdOfTask == updatedTask.projId) {
              Main.#task.updateTask(projIdOfTask, taskOrProjId, updatedTask);
            }
            else {
              // if task is chosen to be moved to a different project:
              Main.#task.createTask(allInputs, updatedTask.projId);
              // delete task from previous project:
              Main.#task.deleteTask(projIdOfTask, taskOrProjId);
              toastMessage = 'Task Moved Successfully';
              this.#postProcessModal(modalFooterId, actionType, toastMessage, projIdOfTask);
              Main.#taskUI.resetNewTaskModalUI('new-task-form');
              const modal = document.getElementById('new-task-modal');
              modal.style.display = 'none';
            }
            toastMessage = 'Task Updated Successfully';
            this.#postProcessModal(modalFooterId, actionType, toastMessage, projIdOfTask);
            break;

          case 'delete-task':
            projIdOfTask = LBarBtnId.split('-')[0].split('p')[1];
            Main.#task.deleteTask(projIdOfTask, taskOrProjId);
            toastMessage = 'Task Deleted Successfully';
            this.#postProcessModal(modalFooterId, actionType, toastMessage, projIdOfTask);
            Main.#ui.hideBtnsAfterShowingToast('del-task-btn', 'del-task-cancel');
            break;
          case 'complete-task':
            projIdOfTask = LBarBtnId.split('-')[0].split('p')[1];
            let task = Main.#task.getTask(projIdOfTask, taskOrProjId);
            task.completed = 1;
            Main.#task.updateTask(projIdOfTask, taskOrProjId, task);
            toastMessage = 'Task Mark As Completed!';
            this.#postProcessModal(modalFooterId, actionType, toastMessage, projIdOfTask);
            Main.#ui.hideBtnsAfterShowingToast('complete-task-btn', 'del-task-cancel');
            break;
        }
      }
      else {
        this.handleErrorToast(modalFooterId, targetType, toastMessage);
      }
    }, { signal });
  }

  getRequiredFieldsStatus(taskOrProjId, elementsParameter, addBtnId, actionType) {
    const { allInputs, reqInputs, reqMsgSpans } = elementsParameter;
    let reqFieldsStatus = false;
    const allProjects = Main.#proj.getAllProjects();
    let updatedProjId = '';
    if (allInputs[0].id == 'task-project') {
      updatedProjId = Main.#proj.getProjectIdByTitle(allInputs[0].value);
    }
    for (let i = 0; i < reqInputs.length; i++) {
      const ele = reqInputs[i];
      const msgSpan = reqMsgSpans[i];
      const parameters = { allProjects, allInputs, ele, msgSpan, addBtnId };
      reqFieldsStatus = Main.#validate.validateReqAfterSubmit(parameters, actionType, taskOrProjId, updatedProjId);
      if (reqFieldsStatus == false) { return false };
    }
    return reqFieldsStatus;
  }

  getOptionalFieldsStatus(optionalInputs, optionalSpans, actionType) {
    if (optionalInputs.length == 0) { return true };
    let optFieldsStatus = false;
    for (let i = 0; i < optionalInputs.length; i++) {
      optFieldsStatus = Main.#validate.validateOptAfterSubmit(optionalInputs[i], optionalSpans[i], actionType);
      if (optFieldsStatus == false) {
        break;
      }
    }
    return optFieldsStatus;
  }

  #postProcessModal(modalFooterId, actionType, toastMessage, projIdOfTask = '') {
    this.#updateLBarProjectsAndTasks();

    // if its a project modal:
    if (projIdOfTask == '') {
      Main.#projUI.showAllProjectsSummary(Main.#proj.getAllProjects());
      Main.#ui.showHideTaskTableControls('proj-sum-table', 4, 'proj-td5');
    }
    // if its a task modal:
    else {
      this.expandProjectOnLBar(projIdOfTask);
      Main.#taskUI.showAllTasksSummary(Main.#proj.getAllProjects(), projIdOfTask);
      Main.#ui.showHideTaskTableControls('task-sum-table', 4, 'task-td8');

    }
    this.handleSuccessToast(modalFooterId, actionType, toastMessage);
  }

  expandProjectOnLBar(projIdOfTask) {
    const allReqEle = document.querySelectorAll('.sub-showHide');
    // if its default project:
    if (projIdOfTask == 0) {
      Main.#ui.showHideDivs(allReqEle[projIdOfTask]);
      return;
    } // else:
    for (let idx = 0; idx <= allReqEle.length - 1; idx++) {
      const projDiv = allReqEle[idx].parentElement.parentElement
      if (projDiv.id == `p${projIdOfTask}`) {
        Main.#ui.showHideDivs(allReqEle[idx]);
        return;
      }
    }
  }

  handleSuccessToast(modalFooterId, actionType, toastMessage) {
    const targetType = actionType.split('-')[1];
    Main.#ui.removeToast(modalFooterId, targetType);
    Main.#ui.addToast(modalFooterId, 'success-toast', toastMessage, targetType);
  }

  handleErrorToast(modalFooterId, targetType, toastMessage = 'Some Error Occurred!') {
    Main.#ui.removeToast(modalFooterId, targetType);
    Main.#ui.addToast(modalFooterId, 'error-toast', toastMessage, targetType);
  }
}

let obj = new Main();
console.log(obj.start());
