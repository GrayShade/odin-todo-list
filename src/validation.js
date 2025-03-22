import { compareAsc, format } from "date-fns";

export class Validation {
  constructor() {
    this.#setEventListeners();
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

  validateReqAfterSubmit(ele, msg_span, allProjects, addBtnId) {
    // checking if a book with same title exists:
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
    } else if (ele.id == 'new-task-title') {
      const projId = addBtnId.split('-')[0];
      const allTasksObj = JSON.parse(allProjects[projId[1]])[projId].tasks;
      // if there is at least 1 task present:
      if (Object.keys(allTasksObj).length > 0) { 
        for (const idx in Object.entries(allTasksObj)) {
          if (Object.entries(allTasksObj)[idx][1].title == ele.value) {
            ele.style.borderColor = 'red';
            msg_span.style.color = 'red';
            msg_span.innerHTML = "*Title already exists!"
            return false;
          }
        }
       };

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

  addToast(modalFooterId, toastType, toastText) {
    const toastContainer = document.createElement('div');
    toastContainer.classList.add('toast', toastType, 'show');

    // const toastHeader = document.createElement('div');
    // toastHeader.classList.add('toast-header');
    // toastHeader.innerText = 'Toast Header';

    const toastBody = document.createElement('div');
    toastBody.classList.add('toast-body');
    toastBody.innerText = toastText;

    // toastContainer.appendChild(toastHeader);
    toastContainer.appendChild(toastBody);

    // document.body.appendChild(toastContainer);
    const modalFooterEle = document.getElementById(modalFooterId);
    modalFooterEle.appendChild(toastContainer);
  }

  removeToast(modalFooterId) {
    const modalFooterEle = document.getElementById(modalFooterId);
    if (modalFooterEle.children.length == 0) { return; }
    const toastContainer = document.querySelector('.toast');
    modalFooterEle.removeChild(toastContainer);
  }

}