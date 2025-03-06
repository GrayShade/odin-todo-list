import { compareAsc, format } from "date-fns";
import { styles } from "./styles/styles.css"
import { reset } from "./styles/reset.css"
import { icons } from "./../node_modules/@vectopus/atlas-icons/style.css";

export class UI {
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
          ele.classList.toggle('hidden');
          this.changeArrowDirection(showHideDivParent, 'arrow-expand', 'arrow-collapse');
        } else {
          ele.classList.toggle('hidden');
          this.changeArrowDirection(showHideDivParent, 'arrow-collapse', 'arrow-expand');
        }
      }
    }
  }

  changeArrowDirection(showHideDivParent, requiredDirection, removeDirection) {
    const arrowsArr = document.querySelectorAll('.arrow');
    for (const idx in arrowsArr) {
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
    if (showHideDivParent.id == 'left-bar') {return};
    const showHideDivArr = document.querySelectorAll('.showHide');
    for (let showHideIdx = 0; showHideIdx <= showHideDivArr.length - 1; showHideIdx++) {
      const currentEle = showHideDivArr[showHideIdx].parentElement
      // Skip iteration if its left-bar's or current element's parent 
      if (currentEle.id == 'left-bar' || currentEle.id == showHideDivParent.id) {
        continue;
      }
      else {
        currentEle.lastElementChild.classList.add('hidden');
        this.changeArrowDirection(currentEle, 'arrow-collapse', 'arrow-expand');
      }
    }
  }
}