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
  setNewTaskModalUI(controller) {
    const modal = document.getElementById('new-task-modal');
    // const btn = document.getElementById('p0-new-task');
    const newTaskBtns = document.querySelectorAll('.new-task');
    for (let key in newTaskBtns) {
      // last index of this array is entries. Maybe a side effect
      //  of using for...in loop. So:
      if (key === 'entries') { break };
      const btnEle = newTaskBtns[key]
      btnEle.addEventListener('click', e => {
        modal.style.display = 'block';
      });
    }
    const span = document.getElementById('new-task-close');



    span.addEventListener('click', e => {
      modal.style.display = 'none';
      // controller.abort();
    });

    // for closing modal if clicked anywhere on screen while model is 
    // opened:
    window.addEventListener('click', e => {
      if (e.target == modal) {
        this.resetNewTaskModalUI();
        modal.style.display = 'none';
        // controller.abort();
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