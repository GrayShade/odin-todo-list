import { compareAsc, format } from "date-fns";
import { styles } from "./styles/styles.css"
import { reset } from "./styles/reset.css"
import { icons } from "./../node_modules/@vectopus/atlas-icons/style.css";

export class UI {
  // .................divs expand collapse related code starting here........................... 

  

  showHideDivs(e) {
    let showHideDiv;
    let showHideDivParent;
    if (e.target.parentElement.classList.contains('showHide')) {
      showHideDiv = e.target.parentElement;
      showHideDivParent = showHideDiv.parentElement;
    } else if (e.target.parentElement.parentElement.classList.contains('showHide')) {
      showHideDiv = e.target.parentElement.parentElement;
      showHideDivParent = showHideDiv.parentElement;
    }
    this.showHideClicked(showHideDivParent);
    this.hideSiblings(showHideDivParent);
  }

  showHideClicked(showHideDivParent) {
    for (let ele of showHideDivParent.children) {
      if (ele.classList.contains('showHide')) {
        continue;
      } else {
        if (ele.classList.contains('hidden')) {
          ele.classList.remove('hidden');
          this.changeArrowDirection(showHideDivParent, 'arrow-expand', 'arrow-collapse');
          const leftP = document.querySelector(`#${showHideDivParent.id} .showHide-left-p`);

          leftP.style.color = '#f08080';
        } else {
          ele.classList.add('hidden');
          this.changeArrowDirection(showHideDivParent, 'arrow-collapse', 'arrow-expand');
          const leftP = document.querySelector(`#${showHideDivParent.id} .showHide-left-p`);
          leftP.style.color = '';
        }
      }
    }
  }

  changeArrowDirection(showHideDivParent, requiredDirection, removeDirection) {
    const arrowsArr = document.querySelectorAll('.arrow');
    for (const idx in arrowsArr) {
      if (idx === 'entries') { break; };
      const arrowId = arrowsArr[idx].id.split('arrow-p')[1];
      const projectId = showHideDivParent.id.split('p')[1];
      // to expand or collapse project tasks arrow:
      if (arrowId == projectId && arrowId != undefined) {
        document.querySelector(`#arrow-p${arrowId}`).classList.remove(removeDirection);
        document.querySelector(`#arrow-p${arrowId}`).classList.add(requiredDirection);
        return;
        // to expand or collapse all projects arrow:
      } else if (showHideDivParent.id == 'left-bar') {
        document.querySelector('#arrow-left-bar').classList.remove(removeDirection);
        document.querySelector('#arrow-left-bar').classList.add(requiredDirection);
        return;
      }
    }
  }

  hideSiblings(showHideDivParent) {
    // Don't collapse expanded sub elements if project container is collapsed:
    if (showHideDivParent.id == 'left-bar') { return };
    const showHideDivArr = document.querySelectorAll('.showHide');
    for (let showHideIdx = 0; showHideIdx <= showHideDivArr.length - 1; showHideIdx++) {
      const currentEle = showHideDivArr[showHideIdx].parentElement
      // Skip iteration if its left-bar's or current element's parent 
      if (currentEle.id == 'left-bar' || currentEle.id == showHideDivParent.id) {
        continue;
      }
      else {
        // Uncomment below 2 lines if other expanded project siblings need to
        //  remain expanded on expanding current project.
        // currentEle.lastElementChild.classList.add('hidden');
        // this.changeArrowDirection(currentEle, 'arrow-collapse', 'arrow-expand');
      }
    }
  }
  // .................divs expand collapse related code ending here........................... 

  // for adding & removing toasts appearing beneath modals....................................

  addToast(modalFooterId, toastType, toastText, targetType) {
    const toastContainer = document.createElement('div');
    toastContainer.setAttribute('id', `${targetType}-toast-div`);
    toastContainer.classList.add('toast', toastType, 'show');
    const toastBody = document.createElement('div');
    toastBody.classList.add('toast-body');
    toastBody.innerText = toastText;
    toastContainer.appendChild(toastBody);
    const modalFooterEle = document.getElementById(modalFooterId);
    modalFooterEle.appendChild(toastContainer);
  }

  removeToast(modalFooterId, targetType) {
    const modalFooterEle = document.getElementById(modalFooterId);
    if (modalFooterEle.children.length == 0) { return; }
    const toastContainer = document.getElementById(`${targetType}-toast-div`);
    modalFooterEle.removeChild(toastContainer);
  }

  // ........................................................................................
  setNewModalUI() {
    btn.addEventListener('click', e => {
      modal.style.display = 'block';
    });

    span.addEventListener('click', e => {
      modal.style.display = 'none';
    });

    // for closing modal if clicked anywhere on screen while model is 
    // opened:
    window.addEventListener('click', e => {
      if (e.target == modal) {
        this.resetNewModalUI();
        modal.style.display = 'none';
      }
    });
  }
  resetNewModalUI(newTitle, message) {
    // const newProjTitle = document.getElementById('new-proj-title');
    newTitle.style.borderColor = '';
    // let message = document.getElementById('new-proj-title-message');
    message.style.color = '';
    message.innerHTML = '';
    this.removeToast(modalFooterId, targetType)
  }
}