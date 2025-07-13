import { isAfter, format } from "date-fns";

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


  validateBeforeSubmit(e, ele_name, ele_message, actionType) {
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
      validityCheck = this.checkDateValidity(ele, actionType);
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
        }
  }

  showErrorMessage(ele, messageSpan, messageText) {
    ele.style.borderColor = 'red';
    messageSpan.style.color = 'red';
    messageSpan.innerHTML = messageText;
  }

  validateReqAfterSubmit(parameterObject, actionType, taskOrProjId, updatedProjId = '') {
    // destructuring object below. Note that the variable names should be
    // same as arguments passed:
    const { allProjects, allInputs, ele, msgSpan, addBtnId } = parameterObject;
    for (let i = 0; i < allInputs.length; i++) { allInputs[i].value = allInputs[i].value.trim(); }
    let currentTask;
    const projMsgSpan = document.getElementById('task-project-message');
    // checking if same title exists for project:
    if (ele.id === 'new-proj-title') {
      for (let obj of (Object.entries(allProjects))) {
        const loopProj = JSON.parse(obj[1])[`p${obj[0]}`];
        if (actionType == 'new-project' && loopProj.title === ele.value) {
          this.showErrorMessage(ele, msgSpan, '*Title already exists!');
          return false;
        } else
          if (actionType == 'update-project') {
            const currentProj = JSON.parse(allProjects[taskOrProjId])[`p${taskOrProjId}`];
            if (actionType == 'update-project' && currentProj.title != ele.value && loopProj.title == ele.value) {
              this.showErrorMessage(ele, msgSpan, '*Title already exists!');
              return false;
            }
          }
          else
            if (ele.value.split('').every((ele) => { ele == '' })) {
              this.showErrorMessage(ele, msgSpan, "*Title Can't be Null!");
            }
      }
    } else if (ele.id == 'task-title') {
      const projId = addBtnId.split('-')[0];
      if (projId == '') { this.showErrorMessage(allInputs[0], projMsgSpan, 'Null Project Not Allowed!'); }

      // checking whether specified title already exists or not:
      const allTasksObj = JSON.parse(allProjects[projId.split('p')[1]])[projId].tasks;
      currentTask = allTasksObj[`t${taskOrProjId}`];
      // if there is at least 1 task present, Checking if title already exists in same project:
      if (Object.keys(allTasksObj).length > 0) {
        for (const idx in Object.entries(allTasksObj)) {
          const loopTaskTitle = Object.entries(allTasksObj)[idx][1].title;

          if (actionType == 'new-task' && loopTaskTitle == ele.value) {
            this.showErrorMessage(ele, msgSpan, '*Title Already Exists!');
            return false;
          } else
            if (actionType == 'update-task' && currentTask.title != ele.value && loopTaskTitle == ele.value) {
              this.showErrorMessage(ele, msgSpan, '*Title Already Exists!');
              return false;
            }
        }
      }

      // for task update modal:
      if (actionType == 'update-task') {
        const updatedProjTitle = allInputs[0].value;
        // .....................Snippet Start................................
        // to check if specified project exists already or not:
        const projectAlreadyExists = this.CheckProjectExistence(allProjects, updatedProjTitle);
        // Specified project must either exist or field should be left blank: 
        if (projectAlreadyExists == false && updatedProjTitle != '') {
          this.showErrorMessage(allInputs[0], projMsgSpan, 'Project Does Not Exist!');
          if (msgSpan.textContent == 'Task Is Duplicated For Above Project!') { 
            msgSpan.textContent = '';
            document.getElementById('task-title').style.borderColor = '#E5E7EB';
          };
          return false;
        }
        // ......................Snippet End...............................

        // ......................Snippet Start................................
        // to check if task is duplicated for project we want to move it to:
        const checkTaskDupArgs = { projId, projectAlreadyExists, allProjects, updatedProjTitle, updatedProjId }
        // check if same task exists in other project:
        const isTaskDuplicated = this.checkTaskDuplication(checkTaskDupArgs);
        if (isTaskDuplicated == false) {
          this.showErrorMessage(allInputs[1], msgSpan, 'Task Is Duplicated For Above Project!');
          return false;
        }
        // .......................Snippet End................................

      }
    }
    // checking html pattern validation:
    if (ele.value != '' && ele.checkValidity() === true) {
      msgSpan.innerHTML = '';
      return true;
    } else if (ele.value == '') {
      this.showErrorMessage(ele, msgSpan, '*Field Required!');
      return false;
    }
  }

  validateOptAfterSubmit(ele, msgSpan, actionType) {

    if (ele.type == 'text' && ele.checkValidity()) {
      // task project in update task modal is already being checked
      //  in << validateReqAfterSubmit >>:
      if (ele.id == 'task-project') {
        return true;
      } else {
        msgSpan.innerHTML = '';
        return true;
      }
    }
    // As HTML pattern attribute is not supported by textarea:
    else if (ele.type == 'textarea' && this.checkTextAreaValidity(ele)) {
      msgSpan.innerHTML = '';
      return true;
    }
    else if (ele.type == 'date' && this.checkDateValidity(ele, actionType)) {
      msgSpan.innerHTML = '';
      return true;
    }
    else {
      if (ele.type == 'date') {
        this.showErrorMessage(ele, msgSpan, 'Previous Date Not Allowed!');
      } else {
        this.showErrorMessage(ele, msgSpan, 'Some Error Occurred!');
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
    if (updatedProjTitle == '') { return false; }
    for (let idx=0; idx <= Object.entries((allProjects)).length; idx++) {
      const loopProj = JSON.parse(allProjects[Object.keys(allProjects)[idx]])[`p${Object.keys(allProjects)[idx]}`];
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