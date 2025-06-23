import { isAfter, isEqual, format } from "date-fns";

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
    let validityCheck;
    if (ele.type == 'text') {
      validityCheck = ele.checkValidity();
    } else if (ele.type == 'textarea') {
      validityCheck = this.checkTextAreaValidity(ele);
    }
    else if (ele.type == 'date') {
      validityCheck = this.checkDateValidity(ele);
    }
    if (validityCheck === false) {
      toolTipSpan.style.display = 'block';
    }
    else {
      toolTipSpan.style.display = 'none';
    }

    if (!ele.classList.contains('required') && ele_val == '') {
      ele.style.borderColor = 'blue';
      message.innerHTML = '';
    } else
      if (ele_val != '' && validityCheck === true) {
        ele.style.borderColor = 'blue';
        message.innerHTML = ''
      } else
        if (ele_val != '' && validityCheck === false) {
          ele.style.borderColor = 'red';
          message.innerHTML = ''
        }
        else {
          this.showErrorMessage(ele, message, '*Field Required!');
          // ele.style.borderColor = 'red';
          // message.style.color = 'red';
          // message.innerHTML = "*Field Required!"
        }
  }

  showErrorMessage(ele, messageSpan, messageText) {
    ele.style.borderColor = 'red';
    messageSpan.style.color = 'red';
    messageSpan.innerHTML = messageText;
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
          this.showErrorMessage(ele, msg_span, '*Title already exists!');
          // ele.style.borderColor = 'red';
          // msg_span.style.color = 'red';
          // msg_span.innerHTML = "*Title already exists!"
          return false;
        } else if (ele.value.split('').every((ele) => { ele == '' })) {
          this.showErrorMessage(ele, msg_span, "*Title Can't be Null!");
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
          // allInputs[0].style.borderColor = 'red';
          // const projMsgSpan = document.getElementById('task-project-message');
          // projMsgSpan.style.color = 'red';
          // projMsgSpan.innerHTML = "Project Does Not Exist!";
          this.showErrorMessage(allInputs[0], projMsgSpan, 'Project Does Not Exist!');
          return false;
        }
        // ......................Snippet End...............................

        // ......................Snippet Start................................
        // to check if task is duplicated for project we want to move it to:
        const checkTaskDupArgs = { projId, projectAlreadyExists, allProjects, updatedProjTitle, updatedProjId }
        // check if same task exists in other project:
        const isTaskDuplicated = this.checkTaskDuplication(checkTaskDupArgs);
        if (isTaskDuplicated == false) {
          // allInputs[1].style.borderColor = 'red';
          // const msg_span = document.getElementById('task-title-message');
          // msg_span.style.color = 'red';
          // msg_span.innerHTML = "Task Is Duplicated For Above Project!";
          this.showErrorMessage(allInputs[1], msg_span, 'Task Is Duplicated For Above Project!');
          return false;
        }
        // .......................Snippet End................................

        // if there is at least 1 task present:
      } else if (Object.keys(allTasksObj).length > 0) {
        for (const idx in Object.entries(allTasksObj)) {
          const taskTitle = Object.entries(allTasksObj)[idx][1].title;

          if (taskTitle == ele.value) {
            // ele.style.borderColor = 'red';
            // msg_span.style.color = 'red';
            // msg_span.innerHTML = "*Title Already Exists!"
            this.showErrorMessage(ele, msg_span, '*Title Already Exists!');
            return false;
          }
        }
      }

    }
    // checking html pattern validation:
    if (ele.value != '' && ele.checkValidity() === true) {
      msg_span.innerHTML = '';
      return true;
    } else if (ele.value == '') {
      this.showErrorMessage(ele, msg_span, '*Field Required!');
      return false;
    } else {
      // ele.style.borderColor = 'red';
      // msg_span.style.color = 'red';
      // msg_span.innerHTML = "*Field Required!"
      this.showErrorMessage(ele, msg_span, '*Title Already Exists !');
      return false;
    }
    // return true;
  }


  validateOptAfterSubmit(ele, msg_span, actionType) {

    // checking html pattern validation:
    // if (ele.type == 'textarea') {
    if (ele.type == 'text' && ele.checkValidity()) {
      msg_span.innerHTML = '';
      return true;
    }
    // As HTML pattern attribute is not supported by textarea:
    // else if (ele.type == 'textarea') {
    else if (ele.type == 'textarea' && this.checkTextAreaValidity(ele)) {
      msg_span.innerHTML = '';
      return true;
      // }
    }
    else if (ele.type == 'date' && this.checkDateValidity(ele, actionType)) {
      msg_span.innerHTML = '';
      return true;
    }
    else {
      // ele.style.borderColor = 'red';
      // msg_span.style.color = 'red';
      // msg_span.innerHTML = "Some Error Occurred!";
      if (ele.type == 'date') {
        this.showErrorMessage(ele, msg_span, 'Previous Date Not Allowed!');
      } else {
        this.showErrorMessage(ele, msg_span, 'Some Error Occurred!');
        return false;
      }
    }
  }

  checkTextAreaValidity(ele) {
    const eleValue = ele.value;
    const eleArr = eleValue.split('');
    if (eleArr[0] == ' ') { return false };
    for (let i = 0; i < eleArr.length - 1; i++) {
      if (eleArr[i] == ' ' && eleArr[i + 1] == ' ') { return false };
    }
    return true;
  }

  checkDateValidity(ele, actionType) {
    if (ele.value.length == 0) { return true };
    const inputValArr = ele.value.split('-');
    const inputY = inputValArr[0];
    // JavaScript's Date constructor treats months as 0-indexed (January = 0, February = 1, etc.), 
    // while date-fns displays them as normal 1-indexed months. So removing 1 month from input:
    const inputM = inputValArr[1] - 1;
    const inputD = inputValArr[2];
    const inputDate = format(new Date(inputY, inputM, inputD), 'dd-MMM-yy');
    const todayDate = format(new Date(), 'dd-MMM-yy')
    // return false on previous date:
    if (isAfter(todayDate, inputDate) && actionType != 'update-task') { 
      return false;
    };
    return true;
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