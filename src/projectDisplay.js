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