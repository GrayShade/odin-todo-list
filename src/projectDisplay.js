export class ProjectsDisplay {


  showAllProjects(allProjects) {

    for (const obj of Object.entries(allProjects)) {
      // console.log(obj[0]);
    }
  }

  showSingleProject(projId, allProjects) {
    for (const obj of Object.entries(allProjects)) {
      if (JSON.parse(obj[1])[`p${projId}`].projId == projId) {
        return;
      }
    }
  }

  showLBarProjects(allProjects) {
    this.removeAllLeftBarProjects();
    
    const prjContainer = document.getElementById('projects-container');

    // for <p id="new-project"><span class="left-bar-span at-folder-plus"></span>New Project</p>
    const newProjP = document.createElement('p');
    newProjP.setAttribute('id', 'new-project');
    newProjP.textContent = 'New Project';
    prjContainer.appendChild(newProjP);

    const newProjPSpan = document.createElement('span');
    newProjPSpan.setAttribute('class', 'left-bar-span at-folder-plus');
    newProjP.prepend(newProjPSpan);

    // <p id="projects-sumry"><span class="left-bar-span at-dots-clipboard"></span>Projects Summary</p>
    const projSummaryP = document.createElement('p');
    projSummaryP.setAttribute('id', 'projects-sumry');
    projSummaryP.textContent = 'Projects Summary';
    prjContainer.appendChild(projSummaryP);

    const projSummaryPSpan = document.createElement('p');
    projSummaryPSpan.setAttribute('class', 'left-bar-span at-dots-clipboard');
    projSummaryP.prepend(projSummaryPSpan);

    for (const obj of Object.entries(allProjects)) {
      const prjObKey = `p${obj[0]}`;
      const prjObVal = JSON.parse(obj[1])[`p${obj[0]}`];

      // for <div id="p0" class="project"></div>
      const prjMainD = document.createElement('div');
      prjMainD.setAttribute('id', prjObKey);
      prjMainD.setAttribute('class', 'project');
      prjContainer.appendChild(prjMainD);

      // for <div class="showHide">
      const prjShowHideSubD = document.createElement('div');
      prjShowHideSubD.setAttribute('class', 'showHide');
      prjMainD.appendChild(prjShowHideSubD);

      // for <p class="sub-showHide showHide-left-p"><span class="left-bar-span at-folder-text"></span>Default</p>
      const prjShowHideSubDP1 = document.createElement('p');
      prjShowHideSubDP1.setAttribute('class', 'sub-showHide showHide-left-p');
      const prjTitle = prjObVal.title;
      prjShowHideSubD.appendChild(prjShowHideSubDP1);
      prjShowHideSubDP1.innerText = prjTitle;

      const prjShowHideSubDP1Span = document.createElement('span');
      prjShowHideSubDP1Span.setAttribute('class', 'left-bar-span project-icon at-pin')
      prjShowHideSubDP1.prepend(prjShowHideSubDP1Span);

      // for <p class="showHide-right-p"><span id="arrow-p0" class="arrow arrow-collapse"></p>
      const prjShowHideSubDP2 = document.createElement('p');
      prjShowHideSubDP2.setAttribute('class', 'showHide-right-p');
      prjShowHideSubD.appendChild(prjShowHideSubDP2);

      const prjShowHideSubDP2Span = document.createElement('span');
      prjShowHideSubDP2Span.setAttribute('id', `arrow-${prjObKey}`);
      prjShowHideSubDP2Span.setAttribute('class', 'arrow arrow-collapse');
      prjShowHideSubDP2.appendChild(prjShowHideSubDP2Span);
    }
  }

  removeAllLeftBarProjects() {
    const prjContainer = document.getElementById('projects-container');
    prjContainer.textContent = '';
    console.log('here');
    
  }

  setNewProjModalUI(controller) {
    const modal = document.getElementById('new-proj-modal');
    const btn = document.getElementById('new-project');
    const span = document.getElementById('new-proj-close');

    // const newProjForm = document.getElementById('new-proj-form');
    
    btn.addEventListener('click', e => {
      modal.style.display = 'block';
      
    });

    span.addEventListener('click', e => {
      modal.style.display = 'none';
      // controller.abort();
    });

    // for closing modal if clicked anywhere on screen while model is 
    // opened:
    window.addEventListener('click', e => {
      if (e.target == modal) {
        this.resetNewProjModalUI();
        modal.style.display = 'none';
        // controller.abort();
      }
    });
  }

  resetNewProjModalUI() {
    const newProjTitle = document.getElementById('new-proj-title');
    newProjTitle.style.borderColor = '';
    let message = document.getElementById('new-proj-title-message');
    message.style.color = '';
    message.innerHTML = '';
  }
  
}