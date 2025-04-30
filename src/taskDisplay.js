export class TasksDisplay {

  constructor(eventBus) {
    this.eventBus = eventBus;
  }

  getAllTasks(projID) {
    for (const obj of Object.entries({ ...localStorage })) {
      if (projID != obj[0]) { continue; }
      if (JSON.parse(obj[1])[`p${projID}`].projId == projID) {
        return JSON.parse(obj[1])[`p${projID}`].tasks;
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
      taskMDTaskSumP.setAttribute('id', `${projId}-tasks-summary`);
      taskMDTaskSumP.setAttribute('class', `tasks-sumry`);
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
        taskMDTaskPSpan.setAttribute('class', 'left-bar-span-task at-pin');
        taskMDTaskP.prepend(taskMDTaskPSpan);
      }
    }
  }

  setNewTaskModalUI() {
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
      this.resetNewTaskModalUI();
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

  showAllTasksSummary(projId) {
    const rightDiv = document.getElementById('right-div');
    rightDiv.innerHTML = '';
    const heading = document.createElement('h2');
    heading.textContent = 'Tasks Summary';
    rightDiv.appendChild(heading);

    const table = document.createElement('table');
    table.setAttribute('id', 'task-sum-table');

    this.createTableHeaders(table, rightDiv);
    this.createTableRows(table, projId);

    // to update task:
    this.modifyTaskModal(projId, 'Update Task', 'Update Title', '.task-edit-icon', 'update-task');
    // to delete task:
    this.modifyTaskModal('Delete Task', 'Remove It', '.task-remove-icon', 'delete-task');

  }

  modifyTaskModal(projId, h3Title, btnTitle, allTaskControlElsClass, actionType) {
    const allTaskControlEls = document.querySelectorAll(allTaskControlElsClass);
    for (const idx in allTaskControlEls) {
      if (idx === 'entries') { break; };
      allTaskControlEls[idx].addEventListener('click', (e) => {
        let modalHeader = document.querySelector('#task-modal-header h3');
        modalHeader.textContent = h3Title;
        const addTaskModalBtn = document.getElementById('add-task-btn');
        const formInputDiv = document.querySelector('.form-input-div');
        const taskId = e.target.id.split('-')[0];

        if (actionType == 'update-task') {
          document.getElementById('task-proj-input-div').style.display = 'block';

        } else
          if (actionType == 'delete-task') {
            formInputDiv.style.display = 'none';
            document.getElementById('del-confirm-task').style.display = 'block';
            document.getElementById('task-proj-input-div').style.display = 'none';
            // const delConfirmP = document.createElement('p');
            // delConfirmP.setAttribute('id', 'del-confirm-task');
            // delConfirmP.textContent = 'Are You Sure?';
            // document.getElementById('new-proj-form').appendChild(delConfirmP);
          } else {
            formInputDiv.style.display = 'flex';
            document.getElementById('del-confirm-task').style.display = 'none';
            document.getElementById('task-proj-input-div').style.display = 'none';
          }
        addTaskModalBtn.textContent = btnTitle;
        document.getElementById('new-task-modal').style.display = 'block';

        this.eventBus.emit('populateTaskValues', projId, taskId); // notify projects.js to get project
        this.eventBus.emit('removeTaskToast'); // Notify UI to remove toast
        this.eventBus.emit('handleModalTask', actionType, projId, taskId); // Notify index.js to handle Modal
      });
    }
  }

  createTableHeaders(table, rightDiv) {
    const headerTr = document.createElement('tr');
    const headerTd1 = document.createElement('th');
    const headerTd2 = document.createElement('th');
    const headerTd3 = document.createElement('th');
    const headerTd4 = document.createElement('th');
    const headerTd5 = document.createElement('th');
    const headerTd6 = document.createElement('th');
    const headerTd7 = document.createElement('th');
    const headerTd8 = document.createElement('th');

    const headerNumText = document.createTextNode('#');
    const headerTitleText = document.createTextNode('Title');
    const headerTaskIdText = document.createTextNode('ID');
    const headerProjIdText = document.createTextNode('Project');
    const headerDescText = document.createTextNode('Description');
    const headerDueDateText = document.createTextNode('Due Date');
    const headerPriorityText = document.createTextNode('Priority');
    const headerControlsText = document.createTextNode('Controls');

    headerTd1.appendChild(headerNumText);
    headerTd2.appendChild(headerTitleText);
    headerTd3.appendChild(headerTaskIdText);
    headerTd4.appendChild(headerProjIdText);
    headerTd5.appendChild(headerDescText);
    headerTd6.appendChild(headerDueDateText);
    headerTd7.appendChild(headerPriorityText);
    headerTd8.appendChild(headerControlsText);

    headerTr.appendChild(headerTd1);
    headerTr.appendChild(headerTd2);
    headerTr.appendChild(headerTd3);
    headerTr.appendChild(headerTd4);
    headerTr.appendChild(headerTd5);
    headerTr.appendChild(headerTd6);
    headerTr.appendChild(headerTd7);
    headerTr.appendChild(headerTd8);

    table.appendChild(headerTr);
    rightDiv.appendChild(table);

  }

  createTableRows(table, projId) {
    let num = 1;

    const allTasks = this.getAllTasks(projId);

    for (const obj of Object.entries(allTasks)) {

      const taskId = obj[1].taskId;

      const taskTr = document.createElement('tr');
      const taskTd1 = document.createElement('td');
      const taskTd2 = document.createElement('td');
      const taskTd3 = document.createElement('td');
      const taskTd4 = document.createElement('td');
      const taskTd5 = document.createElement('td');
      const taskTd6 = document.createElement('td');
      const taskTd7 = document.createElement('td');
      const taskTd8 = document.createElement('td');


      const taskTd1Text = document.createTextNode(num);
      const taskTd2Text = document.createTextNode(obj[1].title);
      const taskTd3Text = document.createTextNode(obj[1].taskId);
      // const taskIdText = document.createTextNode('projTitle');
      const taskTd4Text = document.createTextNode(obj[1].projId);
      const taskTd5Text = document.createTextNode(obj[1].description);
      const taskTd6Text = document.createTextNode(obj[1].dueDate);
      const taskTd7Text = document.createTextNode(obj[1].priority);
      // const taskTd8Text = document.createTextNode('Controls');

      const taskTd8EditSpan = document.createElement('span');
      const taskTd8RemoveSpan = document.createElement('span');
      taskTd8EditSpan.setAttribute('id', `${taskId}-task-edit`);
      taskTd8EditSpan.setAttribute('class', 'task-edit-icon at-pencil-edit');
      taskTd8RemoveSpan.setAttribute('id', `${taskId}-task-remove`)
      taskTd8RemoveSpan.setAttribute('class', 'task-remove-icon at-xmark-folder');

      taskTd1.appendChild(taskTd1Text);
      taskTd2.appendChild(taskTd2Text);
      taskTd3.appendChild(taskTd3Text);
      taskTd4.appendChild(taskTd4Text);
      taskTd5.appendChild(taskTd5Text);
      taskTd6.appendChild(taskTd6Text);
      taskTd7.appendChild(taskTd7Text);
      // taskTd8.appendChild(taskTd8Text);
      taskTd8.appendChild(taskTd8EditSpan);
      taskTd8.appendChild(taskTd8RemoveSpan);

      taskTr.appendChild(taskTd1);
      taskTr.appendChild(taskTd2);
      taskTr.appendChild(taskTd3);
      taskTr.appendChild(taskTd4);
      taskTr.appendChild(taskTd5);
      taskTr.appendChild(taskTd6);
      taskTr.appendChild(taskTd7);
      taskTr.appendChild(taskTd8);


      table.appendChild(taskTr);

      num++;
    }
  }
}