export class TasksDisplay {
  showAllTasks(projID) {
    for (const obj of Object.entries({ ...localStorage })) {
      if (JSON.parse(obj[1]).projId == projID) {
        console.log(JSON.parse(obj[1])[`p${projID}`].tasks);
        return;
      }
    }
  }
  showSingleTask(task) {
    console.log(task);
  }
  setNewTaskModalUI() {
    const modal = document.getElementById('new-task-modal');
    const btn = document.getElementById('p0-new-task');
    const span = document.getElementById('new-task-close');
    
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
  resetNewTaskModalUI() {
    const newProjTitle = document.getElementById('task-title');
    newProjTitle.style.borderColor = '';
    let message = document.getElementById('task-title-message');
    message.style.color = '';
    message.innerHTML = ''
  }
}