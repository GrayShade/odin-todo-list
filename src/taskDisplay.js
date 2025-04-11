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

  showLBarTasks(allProjects) {
    const allProjEls = document.querySelectorAll('.project');
    for (const key in allProjEls) {
      if (key === 'entries') { break };
      const projEle = allProjEls[key];
      const projId = allProjEls[key].id;
      const projTasks = JSON.parse(allProjects[projId.split('p')[1]])[projId].tasks;

      // for <div class="project-tasks hidden"></div>
      const taskMD = document.createElement('div');
      taskMD.setAttribute('class', 'project-tasks hidden');
      projEle.appendChild(taskMD);

      // for <p id="p0-new-task" class="new-task"><span class="left-bar-span at-document"></span>Add Task</p>
      const taskMDAddTaskP = document.createElement('p');
      taskMDAddTaskP.setAttribute('id', `${projId}-new-task`);
      taskMDAddTaskP.setAttribute('class', 'new-task');
      taskMD.appendChild(taskMDAddTaskP);
      taskMDAddTaskP.innerText = 'Add Task'

      const taskMDAddTaskSpan = document.createElement('span');
      taskMDAddTaskSpan.setAttribute('class', 'left-bar-span at-document');
      taskMDAddTaskP.prepend(taskMDAddTaskSpan);

      // for <p id="p0-tasks-smry"><span class="left-bar-span at-list-file"></span>Tasks Summary</p>
      const taskMDTaskSumP = document.createElement('p');
      taskMDTaskSumP.setAttribute('id', 'p0-tasks-summary');
      // taskMDTaskSumyP.setAttribute('class', 'new-task');
      taskMD.appendChild(taskMDTaskSumP);
      taskMDTaskSumP.innerText = 'Tasks Summary'

      const taskMDTaskSumSpan = document.createElement('span');
      // taskMDTaskSumSpan.setAttribute('id', 'p0-tasks-summary');
      taskMDTaskSumSpan.setAttribute('class', 'left-bar-span at-list-file');
      taskMDTaskSumP.prepend(taskMDTaskSumSpan);

      // <p><span id="p1-t1" class="left-bar-span-task at-arrow-right"></span>Task1</p>
      for (const key in projTasks) {
        if (key === 'entries') { break };
        // const proj
        const taskMDTaskP = document.createElement('p');
        taskMD.appendChild(taskMDTaskP);
        taskMDTaskP.innerText = projTasks[key].title;

        const taskMDTaskPSpan = document.createElement('span');
        // const taskId = projTasks[key]['taskId'];
        taskMDTaskPSpan.setAttribute('id', `${projId}-${key}`);
        taskMDTaskPSpan.setAttribute('class', 'left-bar-span-task at-arrow-right');
        taskMDTaskP.prepend(taskMDTaskPSpan);
      }
    }
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