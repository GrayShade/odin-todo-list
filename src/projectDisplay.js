export class ProjectsDisplay {

  constructor(eventBus) {
    this.eventBus = eventBus;
    this.#setEventListeners();
  }

  #setEventListeners() {

    const modal = document.getElementById('new-proj-modal');
    const span = document.getElementById('new-proj-close');
    const deleteCancelBtn = document.getElementById('del-proj-cancel');

    let allProjects;
    // Set up the listener(Subscriber) once, outside the click handler so it does not
    // get duplicated. Emitter can be used inside handler though: 
    this.eventBus.on('returnAllProjects', (response) => {
      allProjects = response;
    });
    // if clicked on close button of modal:
    span.addEventListener('click', () => {
      if (modal.style.display == 'block') {
        // Emitter
        this.eventBus.emit('requestAllProjects');

        this.resetNewProjModalUI('new-proj-form');
        modal.style.display = 'none';
        this.showAllProjectsSummary(allProjects);
        this.eventBus.emit('callShowHideTaskTableControls', 'proj-sum-table', 4, 'proj-td5');
      }
    });

    // for closing modal if clicked anywhere on screen while model is 
    // opened:
    window.addEventListener('click', e => {

      if (e.target == modal) {
        // Emitter
        this.eventBus.emit('requestAllProjects');
        this.resetNewProjModalUI('new-proj-form');
        modal.style.display = 'none';
        this.showAllProjectsSummary(allProjects);
        this.eventBus.emit('callShowHideTaskTableControls', 'proj-sum-table', 4, 'proj-td5');
      }
    });
    // if clicked on cancel button of delete project modal:
    deleteCancelBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  showLBarProjects(allProjects) {
    this.#removeAllLeftBarProjects();
    const prjContainer = document.getElementById('projects-container');
    this.#createNewProjAndSumNodes(prjContainer);
    this.#createIndividualProjectNodes(prjContainer, allProjects);
  }

  #removeAllLeftBarProjects() {
    const prjContainer = document.getElementById('projects-container');
    prjContainer.textContent = '';
  }

  #createNewProjAndSumNodes(prjContainer) {
    const newProjP = document.createElement('p');
    newProjP.setAttribute('id', 'new-project');
    newProjP.textContent = 'New Project';
    prjContainer.appendChild(newProjP);

    const newProjPSpan = document.createElement('span');
    newProjPSpan.setAttribute('class', 'left-bar-span at-folder-plus');
    newProjP.prepend(newProjPSpan);

    const projSummaryP = document.createElement('p');
    projSummaryP.setAttribute('id', 'projects-sumry');
    projSummaryP.textContent = 'Projects Summary';
    prjContainer.appendChild(projSummaryP);

    const projSummaryPSpan = document.createElement('p');
    projSummaryPSpan.setAttribute('class', 'left-bar-span at-dots-clipboard');
    projSummaryP.prepend(projSummaryPSpan);
  }

  #createIndividualProjectNodes(prjContainer, allProjects) {

    const revKeys = Object.keys(allProjects).reverse();
    // Show Default project on top & rest in descending order. So:
    revKeys.pop();
    revKeys.unshift('0');
    for (let i = 0; i <= revKeys.length - 1; i++) {
      const projObVal = JSON.parse(allProjects[revKeys[i]])[`p${revKeys[i]}`];
      const projObKey = `p${projObVal.projId}`;

      const prjMainD = document.createElement('div');
      prjMainD.setAttribute('id', projObKey);
      prjMainD.setAttribute('class', 'project');
      prjContainer.appendChild(prjMainD);

      const prjShowHideSubD = document.createElement('div');
      prjShowHideSubD.setAttribute('class', 'showHide');
      prjMainD.appendChild(prjShowHideSubD);

      const prjShowHideSubDP1 = document.createElement('p');
      prjShowHideSubDP1.setAttribute('class', 'sub-showHide showHide-left-p');
      const prjTitle = projObVal.title;
      prjShowHideSubD.appendChild(prjShowHideSubDP1);
      prjShowHideSubDP1.innerText = prjTitle;

      const prjShowHideSubDP1Span = document.createElement('span');
      prjShowHideSubDP1Span.setAttribute('class', 'left-bar-span project-icon at-arrow-right')
      prjShowHideSubDP1.prepend(prjShowHideSubDP1Span);

      const prjShowHideSubDP2 = document.createElement('p');
      prjShowHideSubDP2.setAttribute('class', 'showHide-right-p');
      prjShowHideSubD.appendChild(prjShowHideSubDP2);

      const prjShowHideSubDP2Span = document.createElement('span');
      prjShowHideSubDP2Span.setAttribute('id', `arrow-${projObKey}`);
      prjShowHideSubDP2Span.setAttribute('class', 'arrow arrow-collapse');
      prjShowHideSubDP2.appendChild(prjShowHideSubDP2Span);
    }
  }

  setNewProjModalUI(allProjects, buttonId) {
    const modal = document.getElementById('new-proj-modal');
    const btn = document.getElementById(buttonId);

    btn.addEventListener('click', () => {
      modal.style.display = 'block';
    });
  }

  resetNewProjModalUI(formId) {
    const newProjTitle = document.getElementById('new-proj-title');
    newProjTitle.style.borderColor = '';
    let allInputs = document.querySelectorAll(`#${formId} input,#${formId} select, #${formId} textarea`);
    for (let i = 0; i < allInputs.length; i++) {
      allInputs[i].value = '';
    }
    let message = document.getElementById('new-proj-title-message');
    message.style.color = '';
    message.innerHTML = '';
  }

  showAllProjectsSummary(allProjects) {
    const rightDiv = document.getElementById('right-div');
    rightDiv.innerHTML = '';
    const heading = document.createElement('h2');
    heading.textContent = 'Projects Summary';
    rightDiv.appendChild(heading);

    const table = document.createElement('table');
    table.setAttribute('id', 'proj-sum-table');

    this.#createTableHeaders(table, rightDiv);
    this.#createTableRows(table, allProjects);

    // to update project:
    this.#modifyProjectModal('Update Project', 'Update Title', '.proj-edit-icon', 'update-project');
    // to delete project:
    this.#modifyProjectModal('Delete Project', 'Remove It', '.proj-remove-icon', 'delete-project');
  }

  #modifyProjectModal(h3Title, btnTitle, allProjControlElsClass, actionType) {
    const allProjControlEls = document.querySelectorAll(allProjControlElsClass);
    for (const idx in allProjControlEls) {
      if (allProjControlEls.hasOwnProperty(idx) == false) { break; };
      allProjControlEls[idx].addEventListener('click', (e) => {
        let modalHeader = document.querySelector('#proj-modal-header h3');
        modalHeader.textContent = h3Title;
        const addProjModalBtn = document.getElementById('add-proj-btn');
        const formInputDiv = document.querySelector('.form-input-div');
        const projId = e.target.id.split('-')[0].split('p')[1];

        if (actionType == 'delete-project') {
          formInputDiv.style.display = 'none';
          document.getElementById('del-confirm-proj').style.display = 'block';
          document.getElementById('add-proj-btn').style.display = 'none';
          document.getElementById('new-proj-reset').style.display = 'none';
          document.getElementById('del-proj-btn').style.display = 'block';
          document.getElementById('del-proj-cancel').style.display = 'block';
        } else {
          formInputDiv.style.display = 'flex';
          document.getElementById('del-confirm-proj').style.display = 'none';
          // Hide buttons added by delete project modal in case they are displaying:
          document.getElementById('del-proj-btn').style.display = 'none';
          document.getElementById('del-proj-cancel').style.display = 'none';
          document.getElementById('add-proj-btn').style.display = 'block';
          document.getElementById('new-proj-reset').style.display = 'block';
        }
        addProjModalBtn.textContent = btnTitle;
        document.getElementById('new-proj-modal').style.display = 'block';
        this.eventBus.emit('populateProjTitle', projId); // notify projects.js to get project
        this.eventBus.emit('removeProjToast'); // Notify UI to remove toast
        this.eventBus.emit('handleModalProj', actionType, projId); // Notify index.js to handle Modal
      });
    }
  }

  #createTableHeaders(table, rightDiv) {
    const headerTr = document.createElement('tr');
    const headerTd1 = document.createElement('th');
    const headerTd2 = document.createElement('th');
    const headerTd3 = document.createElement('th');
    const headerTd4 = document.createElement('th');
    const headerTd5 = document.createElement('th');

    const headerNumText = document.createTextNode('#');
    const headerTitleText = document.createTextNode('Title');
    const headerIdText = document.createTextNode('ID');
    const headerTotalTasksText = document.createTextNode('Total Tasks');
    const headerControlsText = document.createTextNode('Controls');

    headerTd1.appendChild(headerNumText);
    headerTd2.appendChild(headerTitleText);
    headerTd3.appendChild(headerIdText);

    headerTd4.appendChild(headerTotalTasksText);
    headerTd5.appendChild(headerControlsText);

    headerTr.appendChild(headerTd1);
    headerTr.appendChild(headerTd2);
    headerTr.appendChild(headerTd3);
    headerTr.appendChild(headerTd4);
    headerTr.appendChild(headerTd5);

    table.appendChild(headerTr);
    rightDiv.appendChild(table);
  }

  #createTableRows(table, allProjects) {
    let num = 1;

    const revKeys = Object.keys(allProjects).reverse();
    // Show Default project on top & rest in descending order. So:
    revKeys.pop();
    revKeys.unshift('0');
    for (let i = 0; i <= revKeys.length - 1; i++) {
      const projObVal = JSON.parse(allProjects[revKeys[i]])[`p${revKeys[i]}`];
      const projObKey = `p${projObVal.projId}`;

      const projTr = document.createElement('tr');

      const projTd1 = document.createElement('td');
      const projTd2 = document.createElement('td');
      const projTd3 = document.createElement('td');
      const projTd4 = document.createElement('td');
      const projTd5 = document.createElement('td');

      projTd5.setAttribute('id', 'proj-td5');

      const projTd1Text = document.createTextNode(num);
      const projTd2Text = document.createTextNode(projObVal.title);
      const projTd3Text = document.createTextNode(projObVal.projId);
      const projTd4Text = document.createTextNode(Object.keys(projObVal.tasks).length);

      const projTd5DetailsSpan = document.createElement('span');
      const projTd5EditSpan = document.createElement('span');
      const projTd5RemoveSpan = document.createElement('span');
      projTd5DetailsSpan.setAttribute('id', `${projObKey}-proj-details`);
      projTd5EditSpan.setAttribute('id', `${projObKey}-proj-edit`);
      projTd5EditSpan.setAttribute('class', 'proj-edit-icon at-pencil-edit');
      projTd5RemoveSpan.setAttribute('id', `${projObKey}-proj-remove`)
      projTd5RemoveSpan.setAttribute('class', 'proj-remove-icon at-xmark-clipboard');

      projTd1.appendChild(projTd1Text);
      projTd2.appendChild(projTd2Text);
      projTd3.appendChild(projTd3Text);
      projTd4.appendChild(projTd4Text);
      projTd5.appendChild(projTd5DetailsSpan)
      projTd5.appendChild(projTd5EditSpan);
      projTd5.appendChild(projTd5RemoveSpan);

      projTr.appendChild(projTd1);
      projTr.appendChild(projTd2);
      projTr.appendChild(projTd3);
      projTr.appendChild(projTd4);
      projTr.appendChild(projTd5);

      table.appendChild(projTr);

      num++;
    }
  }
}