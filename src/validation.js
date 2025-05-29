import { compareAsc, format } from "date-fns";

export class Validation {
  constructor() {
    this.#setEventListeners();
  }

  #setEventListeners() {
    // if tooltip is shown & user moves to next element, tooltip should hide:
    document.addEventListener('focusout', (e) => {
      // <<focusout is firing on every element of document, so returning if
      // focused out element is not input:
      if ((!e.target.classList.contains('form-inputs')) || (e.target.classList.contains('read-checkbox'))) {
        return;
      }
      const inputEle = e.target;
      // no need to run this on button:
      if (inputEle.type === 'submit') {
        return;
      }
      const toolTipSpan = inputEle.previousElementSibling.lastElementChild;

      toolTipSpan.style.display = 'none';

      if (inputEle.style.borderColor == 'blue') {
        inputEle.style.borderColor = '#E5E7EB';
      }

      // For hiding optional brackets:
      const form_info_brackets_span = document.getElementById(`${e.target.id}-info-brackets`);
      form_info_brackets_span.style.visibility = 'hidden';
    });

    // if user moves to next element which has error but no tooltip because of
    // listener on focusout event, tooltip should be shown again:
    document.addEventListener('focusin', (e) => {

      // this.removeToast(`${e.target.id.split('title')[0]}footer`);
      // <<focusin is firing on every element of document, so returning if
      // focused in element is not input:
      if ((!e.target.classList.contains('form-inputs')) || (e.target.classList.contains('read-checkbox'))) {
        return;
      }
      const inputEle = e.target;
      // return if it was a button:
      if (inputEle.type === 'submit') {
        return;
      }
      const toolTipSpan = inputEle.previousElementSibling.lastElementChild;

      if (inputEle.checkValidity() === false && toolTipSpan.style.display == 'none') {
        toolTipSpan.style.display = 'block';
      }
      else {
        toolTipSpan.style.display = 'none';
      }

      // For showing optional brackets:
      const form_info_brackets_span = document.getElementById(`${e.target.id}-info-brackets`);
      form_info_brackets_span.style.visibility = 'visible';

    });
  }


  validateBeforeSubmit(e, ele_name, ele_message) {
    const ele_val = document.getElementById(ele_name).value;
    const message = document.getElementById(ele_message);
    const ele = e.target;
    if (e.key === 'Tab') {
      return;
    }

    const toolTipSpan = ele.previousElementSibling.lastElementChild;
    if (ele.checkValidity() === false) {
      toolTipSpan.style.display = 'block';
    }
    else {
      toolTipSpan.style.display = 'none';
    }

    if (!ele.classList.contains('required') && ele_val == '') {
      ele.style.borderColor = 'blue';
      message.innerHTML = '';
    } else
      if (ele_val != '' && ele.checkValidity() === true) {
        ele.style.borderColor = 'blue';
        message.innerHTML = ''
      } else
        if (ele_val != '' && ele.checkValidity() === false) {
          ele.style.borderColor = 'red';
          message.innerHTML = ''
        }
        else {

          ele.style.borderColor = 'red';
          message.style.color = 'red';
          message.innerHTML = "*Field Required!"
        }

  }


  validateReqAfterSubmit(parameterObject, updatedProjId = '') {
    // destructuring object below. Note that the variable names should be
    // same as arguments passed:
    const { allProjects, allInputs, ele, msg_span, addBtnId } = parameterObject;
    // checking if same title exists for project:
    if (ele.id === 'new-proj-title') {
      for (let obj of (Object.entries(allProjects))) {
        const project = JSON.parse(obj[1])[`p${obj[0]}`];
        if (project.title === ele.value) {
          ele.style.borderColor = 'red';
          msg_span.style.color = 'red';
          msg_span.innerHTML = "*Title already exists!"
          return false;
        }
      }
    } else if (ele.id == 'task-title') {
      const projId = addBtnId.split('-')[0];
      const taskProjTitle = JSON.parse(allProjects[projId.split('p')[1]])[projId].title;
      const allTasksObj = JSON.parse(allProjects[projId.split('p')[1]])[projId].tasks;

      // for task update modal:
      if (document.getElementById('task-proj-input-div').style.display == 'block') {
        const updatedProjTitle = allInputs[0].value;
        // .....................Snippet Start................................
        // to check if specified project exists already or not:
        const projectAlreadyExists = this.CheckProjectExistence(allProjects, updatedProjTitle);
        // Specified project must either exist or field should be left blank: 
        if (projectAlreadyExists == false && updatedProjTitle != '') {
          allInputs[0].style.borderColor = 'red';
          const projMsgSpan = document.getElementById('task-project-message');
          projMsgSpan.style.color = 'red';
          projMsgSpan.innerHTML = "Project Does Not Exist!";
          return false;
        }
        // ......................Snippet End...............................

        // ......................Snippet Start................................
        // to check if task is duplicated for project we want to move it to:
        const checkTaskDupArgs = { projId, projectAlreadyExists, allProjects, updatedProjTitle, updatedProjId }
        // check if same task exists in other project:
        const isTaskDuplicated = this.checkTaskDuplication(checkTaskDupArgs);
        if (isTaskDuplicated == false) {
          allInputs[1].style.borderColor = 'red';
          const msg_span = document.getElementById('task-title-message');
          msg_span.style.color = 'red';
          msg_span.innerHTML = "Task Is Duplicated For Above Project!";
          return false;
        }
        // .......................Snippet End................................

        // if there is at least 1 task present:
      } else if (Object.keys(allTasksObj).length > 0) {
        for (const idx in Object.entries(allTasksObj)) {
          const taskTitle = Object.entries(allTasksObj)[idx][1].title;

          if (taskTitle == ele.value) {
            ele.style.borderColor = 'red';
            msg_span.style.color = 'red';
            msg_span.innerHTML = "*Title Already Exists!"
            return false;
          }
        }
      }
      // checking html pattern validation:
      if (ele.value != '' && ele.checkValidity() === true) {
        msg_span.innerHTML = '';
        return true;
      } else {
        ele.style.borderColor = 'red';
        msg_span.style.color = 'red';
        msg_span.innerHTML = "*Field Required!"
        return false;
      }
    }
    return true;
  }


  validateOptAfterSubmit(ele, msg_span) {

    // checking html pattern validation:
    if (ele.value != '' && ele.checkValidity() === true) {
      msg_span.innerHTML = '';
      return true;
    } else {
      ele.style.borderColor = 'red';
      msg_span.style.color = 'red';
      msg_span.innerHTML = "*Field Required!"
      return false;
    }
  }

  CheckProjectExistence(allProjects, updatedProjTitle) {
    for (const idx in Object.entries((allProjects))) {
      const loopProj = JSON.parse(allProjects[idx])[`p${idx}`];
      if (loopProj.title == updatedProjTitle) {
        return true;
      }
    }
    return false;
  }

  checkTaskDuplication(parameterObject) {
    const { projId, projectAlreadyExists, allProjects, updatedProjTitle, updatedProjId } = parameterObject;
    const formattedProjId = projId.split('-')[0].split('p')[1];
    const currProjTitle = JSON.parse(allProjects[formattedProjId])[`p${formattedProjId}`].title;
    if (updatedProjTitle == '' || (currProjTitle == updatedProjTitle)) { return true; }
    if (projectAlreadyExists != false && updatedProjTitle != '') {
      const updatedProjTasks = JSON.parse(allProjects[updatedProjId])[`p${updatedProjId}`].tasks;
      const taskTitleEle = document.getElementById('task-title');
      for (const key in updatedProjTasks) {
        const currLoopTask = updatedProjTasks[key];
        if (currLoopTask.title == taskTitleEle.value) {
          return false;
        }
      }
    }
    return true;
  }

  addToast(modalFooterId, toastType, toastText) {
    const toastContainer = document.createElement('div');
    con
    toastContainer.classList.add('toast', toastType, 'show');
    const toastBody = document.createElement('div');
    toastBody.classList.add('toast-body');
    toastBody.innerText = toastText;
    toastContainer.appendChild(toastBody);
    const modalFooterEle = document.getElementById(modalFooterId);
    modalFooterEle.appendChild(toastContainer);
  }

}