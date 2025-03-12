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

  setNewProjModalUI() {
    const modal = document.getElementById('new-proj-modal');
    const btn = document.getElementById('new-project');
    const span = document.getElementsByClassName("close")[0];
    
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
        modal.style.display = 'none';
      }
    });
  }
  
}