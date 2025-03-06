import { compareAsc, format } from "date-fns";
import { styles } from "./styles/styles.css"
import { reset } from "./styles/reset.css"
import { icons } from "./../node_modules/@vectopus/atlas-icons/style.css";

export class UI {
  showHideDivs(e) {
    let showHideDiv;
    let showHideParent;
    if (e.target.parentElement.classList.contains('showHide')) {
      showHideDiv = e.target.parentElement;
      showHideParent = showHideDiv.parentElement;
    } else if (e.target.parentElement.parentElement.classList.contains('showHide')) {
      showHideDiv = e.target.parentElement.parentElement;
      showHideParent = showHideDiv.parentElement;
    }
    this.showHideClicked(showHideParent);
    this.hideSiblings(showHideParent);
  }

  showHideClicked(showHideParent) {
    for (let ele of showHideParent.children) {

      if (ele.classList.contains('showHide')) {
        continue;
      } else {
          if (ele.classList.contains('hidden')) {
          // ele.style.display = 'block';
          ele.classList.toggle('hidden');
          this.changeArrowDirection(showHideParent, 'arrow-expand', 'arrow-collapse');
        } else {
          ele.classList.toggle('hidden');
          this.changeArrowDirection(showHideParent, 'arrow-collapse', 'arrow-expand');
        }
      }
    }
  }

  changeArrowDirection(showHideParent, requiredDirection, removeDirection) {
    const arrowsArr = document.querySelectorAll('.arrow');
    for (const idx in arrowsArr) {
      console.log(idx);
      const arrowId = arrowsArr[idx].id.split('arrow-p')[1];
      const projectId = showHideParent.id.split('p')[1];
      // to expand or collapse project tasks arrow:
      if (arrowId == projectId && arrowId != undefined) {
        document.querySelector(`#arrow-p${arrowId}`).classList.remove(removeDirection);
        document.querySelector(`#arrow-p${arrowId}`).classList.add(requiredDirection);
        return;
      // to expand or collapse all projects arrow:
      } else if (showHideParent.id == 'left-bar') {
        document.querySelector('#arrow-left-bar').classList.remove(removeDirection);
        document.querySelector('#arrow-left-bar').classList.add(requiredDirection);
        return;
      }
    }
  }

  hideSiblings(showHideParent) {
    // Don't collapse expanded sub elements if project container is collapsed:
    if (showHideParent.id == 'left-bar') {return};
    const showHideDivArr = document.querySelectorAll('.showHide');
    for (let showHideIdx = 0; showHideIdx <= showHideDivArr.length - 1; showHideIdx++) {
      const eleParent = showHideDivArr[showHideIdx].parentElement
      if (eleParent.id == 'left-bar' || eleParent.id == showHideParent.id) {
        continue;
      }
      else {
        eleParent.lastElementChild.classList.add('hidden');
        this.changeArrowDirection(eleParent, 'arrow-collapse', 'arrow-expand');
      }
    }
  }
}