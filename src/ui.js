import { compareAsc, format } from "date-fns";
import { styles } from "./styles/styles.css"
import { reset } from "./styles/reset.css"
import { icons } from "./../node_modules/@vectopus/atlas-icons/style.css";

export class UI {

  constructor(eventBus) {
    this.eventBus = eventBus;
    this.setupEventBusListener();
  }

  setupEventBusListener() {
    // We need to call << removeToast() >> from << projDisplay.js >>, but want to at least maintain loose
    // coupling, we use EventBus. EventBus uses pub/sub pattern. Also, we are setting up eventBus listeners
    //  only once using << eventBus.on() >> below. So, no need to destroy them afterwards to avoid duplication.
    //  << eventBus.emit >> can be used repeatedly without needing destroying.
    // When eventBus of << projDisplay.js >> emits << 'removeToast' >>, then:
    this.eventBus.on('removeProjToast', () => this.removeToast('new-proj-footer', 'project'));
    this.eventBus.on('removeTaskToast', () => this.removeToast('new-task-footer', 'task'));

    this.eventBus.on('callShowHideTaskTableControls', (tableId, controlTdIndex, controlTdId) => {
      this.showHideTaskTableControls(tableId, controlTdIndex, controlTdId);
    });
  }

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
    //  Uncomment below line if other expanded project siblings need to be collapsed
    //   on expanding current project.
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

          leftP.style.color = '#ffa500';
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
        currentEle.lastElementChild.classList.add('hidden');
        // Hide non active element color:
        showHideDivArr[showHideIdx].firstChild.style.color = '';
        this.changeArrowDirection(currentEle, 'arrow-collapse', 'arrow-expand');
      }
    }
  }
  // .................divs expand collapse related code ending here........................... 

  setUpShowHideTableControls() {
    const projSumTable = document.getElementById('proj-sum-table');
    // The childNodes property returns a live NodeList:
    const projSumTableRows = projSumTable.childNodes;
    for (let tr = 0; tr < projSumTableRows.length; tr++) {
      // if (i == 'entries' || i == 'keys' || i == 'values') { continue; };
      // debugger;
      projSumTableRows[tr].addEventListener('mouseenter', (e) => {
        console.log('here');
        // e.target.childNodes[4].style.visibility = 'visible';
        const rowTds = e.target.childNodes;
        for (let td = 0; td < rowTds.length; td++) {
          if (td == 4 && rowTds[td].id == 'proj-td5') {
            // e.target.childNodes[x].style.visibility = 'visible';
            const tdSpans = rowTds[td].childNodes;
            for (let span = 0; span < tdSpans.length; span++) {
              tdSpans[span].style.visibility = 'visible';
            }
          }
        }
      });
    }
  }

  showHideTaskTableControls(tableId, controlTdIndex, controlTdId) {
    const table = document.getElementById(tableId);
    // The childNodes property returns a live NodeList:
    const tableRows = table.childNodes;
    for (let tr = 0; tr < tableRows.length; tr++) {
      // if (i == 'entries' || i == 'keys' || i == 'values') { continue; };
      // debugger;
      // At 0 index, it will be table header row needing no controls: 
      if (tr == 0) { continue; };
      tableRows[tr].addEventListener('mouseenter', (e) => {
        // e.target.childNodes[4].style.visibility = 'visible';
        const rowTds = e.target.childNodes;
        for (let td = 0; td < rowTds.length; td++) {
          if (td == controlTdIndex && rowTds[td].id == controlTdId) {
            // e.target.childNodes[x].style.visibility = 'visible';
            const tdSpans = rowTds[td].childNodes;
            for (let span = 0; span < tdSpans.length; span++) {
              tdSpans[span].style.visibility = 'visible';
            }
          }
        }
      });
      tableRows[tr].addEventListener('mouseleave', (e) => {
        // e.target.childNodes[4].style.visibility = 'visible';
        const rowTds = e.target.childNodes;
        for (let td = 0; td < rowTds.length; td++) {
          if (td == controlTdIndex && rowTds[td].id == controlTdId) {
            // e.target.childNodes[x].style.visibility = 'visible';
            const tdSpans = rowTds[td].childNodes;
            for (let span = 0; span < tdSpans.length; span++) {
              tdSpans[span].style.visibility = 'hidden';
            }
          }
        }
      });
    }
  }

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
    // targetType = targetType.split('-')[0];
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

  // resetNewModalUI(newTitle, message) {
  //   newTitle.style.borderColor = '';
  //   message.style.color = '';
  //   message.innerHTML = '';
  //   this.removeToast(modalFooterId, targetType)
  // }
}