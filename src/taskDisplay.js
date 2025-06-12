// Calling replace() in constructor afterwards:
import { replace } from 'feather-icons';
export class TasksDisplay {

  constructor(eventBus) {
    this.eventBus = eventBus;
    // for feather icons loading:
    replace();
  }

  getAllTasks(projID) {
    for (const obj of Object.entries({ ...localStorage })) {
      if (projID != obj[0]) { continue; }
      if (JSON.parse(obj[1])[`p${projID}`].projId == projID) {
        return JSON.parse(obj[1])[`p${projID}`].tasks;
      }
    }
  }
  // showSingleTask(task) {
  //   console.log(task);
  // }

  showLBarTasks(allProjects) {
    const allProjEls = document.querySelectorAll('.project');
    for (const key in allProjEls) {
      if (key === 'entries') { break };
      const projEle = allProjEls[key];
      const projId = allProjEls[key].id;
      const projTasks = JSON.parse(allProjects[projId.split('p')[1]])[projId].tasks;

      // Showing Only Non Completed Tasks In Left Bar Tasks:
      let nonCompletedTasks = this.getRequiredTasks(projTasks, 0);
      for (const taskKey in projTasks) {
        if (projTasks[taskKey].completed == 0) {
          nonCompletedTasks[taskKey] = projTasks[taskKey];
        }
      }

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
      taskMDTaskSumP.innerText = 'Tasks Summary';

      const taskMDTaskSumSpan = document.createElement('span');
      // taskMDTaskSumSpan.setAttribute('id', 'p0-tasks-summary');
      taskMDTaskSumSpan.setAttribute('class', 'left-bar-span at-list-file');
      taskMDTaskSumP.prepend(taskMDTaskSumSpan);

      const taskMDTaskComP = document.createElement('p');
      taskMDTaskComP.setAttribute('id', `${projId}-tasks-completed`);
      taskMDTaskComP.setAttribute('class', `tasks-completed`);
      taskMDTaskComP.innerText = 'Completed Tasks';
      taskMD.appendChild(taskMDTaskComP);

      const taskMDTaskComSpan = document.createElement('span');
      // taskMDTaskSumSpan.setAttribute('id', 'p0-tasks-summary');
      taskMDTaskComSpan.setAttribute('class', 'left-bar-span at-check-file');
      taskMDTaskComP.prepend(taskMDTaskComSpan);



      // <p><span id="p1-t1" class="left-bar-span-task at-arrow-right"></span>Task1</p>
      for (const key in nonCompletedTasks) {
        if (key === 'entries') { break };
        // const proj
        const taskMDTaskP = document.createElement('p');
        taskMD.appendChild(taskMDTaskP);

        const taskMDTaskPSpan1 = document.createElement('span');
        taskMDTaskPSpan1.setAttribute('id', `${projId}-${key}`);
        taskMDTaskPSpan1.setAttribute('class', 'left-bar-span-task at-pin');

        const taskMDTaskPSpan2 = document.createElement('span');
        taskMDTaskPSpan2.setAttribute('class', 'left-bar-span-task task-title');
        taskMDTaskPSpan2.innerText = nonCompletedTasks[key].title;
        taskMDTaskP.prepend(taskMDTaskPSpan2);
        taskMDTaskP.prepend(taskMDTaskPSpan1);

      }
    }
  }

  getRequiredTasks(projTasks, taskCompleted) {
    let requiredTasks = {};
    for (const taskKey in projTasks) {
      if (projTasks[taskKey].completed == taskCompleted) {
        requiredTasks[taskKey] = projTasks[taskKey];
      }
    }
    return requiredTasks;
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
        // this.resetNewTaskModalUI();
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
      }
    });
  }
  closeDetailDeleteModals() {
    const taskDetailModal = document.getElementById('task-details-modal');
    const taskDeleteModal = document.getElementById('new-task-modal');
    // // const btn = document.getElementById('p0-new-task');
    // const newTaskBtns = document.querySelectorAll('.task-details-svg');
    // for (let key in newTaskBtns) {
    //   // last index of this array is entries. Maybe a side effect
    //   //  of using for...in loop. So:
    //   if (key === 'entries') { break };
    //   const btnEle = newTaskBtns[key]
    //   btnEle.addEventListener('click', e => {
    //     modal.style.display = 'block';
    //   });
    // }
    const detailsSpan = document.getElementById('task-details-close');
    const detailsCloseBtn = document.getElementById('task-details-btn');
    const deleteCancelBtn = document.getElementById('del-task-cancel');

    [detailsSpan, detailsCloseBtn, deleteCancelBtn].forEach((ele) => {
      ele.addEventListener('click', e => {
        if (ele == detailsSpan || ele == detailsCloseBtn) {
          this.resetNewTaskModalUI();
          taskDetailModal.style.display = 'none';
        } else
          if (ele == deleteCancelBtn) {
            taskDeleteModal.style.display = 'none';
          }
        // controller.abort();
      });
    });



    // for closing modal if clicked anywhere on screen while model is 
    // opened:
    window.addEventListener('click', e => {
      if (e.target == taskDetailModal || e.target == taskDeleteModal) {
        this.resetNewTaskModalUI();
        taskDetailModal.style.display = 'none';
        taskDeleteModal.style.display = 'none';
      }
    });
  }

  setTaskUpdateDeleteModalUI() {

  }

  resetNewTaskModalUI() {
    const newProjTitle = document.getElementById('task-title');
    newProjTitle.style.borderColor = '';
    let message = document.getElementById('task-title-message');
    message.style.color = '';
    message.innerHTML = ''
  }

  showAllTasksSummary(allProjects, projId) {
    const projTitle = JSON.parse(allProjects[projId])[`p${projId}`].title;
    const rightDiv = document.getElementById('right-div');
    rightDiv.innerHTML = '';
    const heading = document.createElement('h2');
    heading.textContent = 'Tasks Summary';
    rightDiv.appendChild(heading);

    const table = document.createElement('table');
    table.setAttribute('id', 'task-sum-table');

    this.createTableHeaders(table, rightDiv);
    this.createTableRows(table, projTitle, projId);
    
    // to show task details:
    this.handleShowDetails(projTitle, projId, '.task-details-icon', 'task-details');
    // to update task:
    this.handleModifyAndDelete(projId, '.task-edit-icon', 'update-task', allProjects);
    // to delete task:
    this.handleModifyAndDelete(projId, '.task-remove-icon', 'delete-task');
    // to show completed tasks:
    this.handleModifyAndDelete(projId, '.task-complete-icon', 'complete-task');
  }

  // handleCheckCompleted(projId, allTaskControlElsClass, actionType) {
  //   alert('here');
  //   const allTaskControlEls = document.querySelectorAll(allTaskControlElsClass);
  //   for (const idx in allTaskControlEls) {
  //     if (idx === 'entries') { break; };
  //     allTaskControlEls[idx].addEventListener('click', (e) => {
  //       const taskId = e.target.id.split('-')[0];
  //       alert('here');
  //       // this.eventBus.emit('populateTaskDetailValues', projId, taskId); // notify projects.js to get project
  //       this.eventBus.emit('handleComptedTask', actionType, projId, taskId); // Notify index.js to handle Modal
  //     });
  //   }
  // }

  handleShowDetails(projTitle, projId, allTaskControlElsClass, actionType) {
    const allTaskControlEls = document.querySelectorAll(allTaskControlElsClass);
    for (const idx in allTaskControlEls) {
      if (idx === 'entries') { break; };
      allTaskControlEls[idx].addEventListener('click', (e) => {
        let modalHeader = document.querySelector('#task-modal-header h3');
        // if (actionType == 'update-task') {

        // }
        // modalHeader.textContent = h3Title;
        const addTaskModalBtn = document.getElementById('add-task-btn');
        // const formInputDiv = document.querySelector('.form-input-div');
        const taskForm = document.getElementById('new-task-form');
        let taskId = '';
        // eye icon SVG is composed of multiple elements & user can click on any of them. So 
        // handling all of them:
        if (e.target.classList.contains('feather')) {
          // as eye icon for details is an SVG & not a class on << span >>, So getting Id of its
          //  parent << span >> :
          taskId = e.target.parentElement.id.split('-')[0];
        } else if (e.target.classList.contains('task-details-icon')) {
          taskId = e.target.id.split('-')[0];
        } else {
          taskId = e.target.parentElement.parentElement.id.split('-')[0];
        }

        // if (actionType == 'task-details') {
        // this.setTaskDetailsModalUI();
        const modal = document.getElementById('task-details-modal');
        // const btn = document.getElementById('p0-new-task');
        const newTaskLinks = document.querySelectorAll('.task-details-icon');
        // for (let key in newTaskLinks) {
        //   // last index of this array is entries. Maybe a side effect
        //   //  of using for...in loop. So:
        //   if (key === 'entries') { break };
        //   const btnEle = newTaskLinks[key]
        //   btnEle.addEventListener('click', e => {
        //     modal.style.display = 'block';
        //   });
        // }
        modal.style.display = 'block';
        // notify projects.js to get project & populate values
        this.eventBus.emit('populateTaskDetailValues', projTitle, projId, taskId);

        // this.eventBus.emit('handleModalTask', actionType, projId, taskId); // Notify index.js to handle Modal
      });
    }
  }

  handleModifyAndDelete(projId, allTaskControlElsClass, actionType, allProjects = undefined) {
    const allTaskControlEls = document.querySelectorAll(allTaskControlElsClass);
    for (const idx in allTaskControlEls) {
      if (idx === 'entries') { break; };
      allTaskControlEls[idx].addEventListener('click', (e) => {
        let modalHeader = document.querySelector('#task-modal-header h3');
        // if (actionType == 'update-task') {

        // }
        // modalHeader.textContent = h3Title;
        const addTaskModalBtn = document.getElementById('add-task-btn');
        // const formInputDiv = document.querySelector('.form-input-div');
        const taskForm = document.getElementById('new-task-form');



        const taskId = e.target.id.split('-')[0];

        // for updating & deleting tasks, We are not adding a new modal but modifying the previous one 
        if (actionType == 'update-task') {

          modalHeader.textContent = 'Update Task';
          addTaskModalBtn.style.display = 'block';
          document.getElementById('new-task-reset').style.display = 'block';
          addTaskModalBtn.textContent = 'Update Task';

          document.getElementById('new-task-form').style.display = 'flex';
          document.getElementById('del-confirm-task').style.display = 'none';
          document.getElementById('complete-confirm-task').style.display = 'none';
          document.getElementById('task-proj-input-div').style.display = 'block';

          // Hide buttons added by delete task modal in case they are displaying:
          document.getElementById('del-task-btn').style.display = 'none';
          document.getElementById('complete-task-btn').style.display = 'none';
          document.getElementById('del-task-cancel').style.display = 'none';

          document.getElementById('new-task-reset').textContent = 'Reset Form';


          const currProjTitle = JSON.parse(allProjects[projId])[`p${projId}`].title;
          const dataListEle = document.getElementById('task-list-projects');
          // to prevent duplication of datalist options in form:
          dataListEle.textContent = '';
          for (const key in allProjects) {
            const projTitle = JSON.parse(allProjects[key])[`p${key}`].title;
            // Don't show current project:
            if (projTitle == currProjTitle) { continue };
            const optionEle = document.createElement('option');
            optionEle.setAttribute('value', projTitle);
            dataListEle.appendChild(optionEle);
          }

        } else
          if (actionType == 'delete-task') {
            taskForm.style.display = 'none';
            modalHeader.textContent = 'Delete Task';
            // document.getElementById('new-task-form').style.display = 'flex';
            addTaskModalBtn.style.display = 'none';
            document.getElementById('new-task-reset').style.display = 'none';
            document.getElementById('del-confirm-task').style.display = 'block';
            document.getElementById('complete-confirm-task').style.display = 'none';
            document.getElementById('task-proj-input-div').style.display = 'none';


            // document.getElementById('del-confirm-task').style.display = 'none';
            document.getElementById('complete-task-btn').style.display = 'none';
            document.getElementById('del-task-btn').style.display = 'block';
            document.getElementById('del-task-cancel').style.display = 'block';
            // const btnDiv = document.querySelectorAll('.btn-div');
            // btnDiv[1].classList.add(".center-buttons");
            // const delConfirmP = document.createElement('p');
            // delConfirmP.setAttribute('id', 'del-confirm-task');
            // delConfirmP.textContent = 'Are You Sure?';
            // document.getElementById('new-proj-form').appendChild(delConfirmP);

          } else
            if (actionType == 'complete-task') {
              taskForm.style.display = 'none';
              modalHeader.textContent = 'Complete Task';
              // document.getElementById('new-task-form').style.display = 'flex';
              addTaskModalBtn.style.display = 'none';
              document.getElementById('new-task-reset').style.display = 'none';
              document.getElementById('del-confirm-task').style.display = 'none';
              document.getElementById('complete-confirm-task').style.display = 'block';
              document.getElementById('task-proj-input-div').style.display = 'none';


              // document.getElementById('del-confirm-task').style.display = 'none';
              document.getElementById('del-task-btn').style.display = 'none';
              document.getElementById('complete-task-btn').style.display = 'block';
              document.getElementById('del-task-cancel').style.display = 'block';
            }

            else {
              taskForm.style.display = 'flex';
              document.getElementById('del-confirm-task').style.display = 'none';
              document.getElementById('complete-confirm-task').style.display = 'none';
              document.getElementById('task-proj-input-div').style.display = 'none';
            }

        document.getElementById('new-task-modal').style.display = 'block';

        this.eventBus.emit('populateTaskValues', projId, taskId); // notify projects.js to get project
        this.eventBus.emit('removeTaskToast'); // Notify UI to remove toast
        this.eventBus.emit('handleModalTask', actionType, projId, taskId); // Notify index.js to handle Modal
      });
    }
  }

  showAllTasksCompleted(allProjects, projId) {
    const projTitle = JSON.parse(allProjects[projId])[`p${projId}`].title;
    const rightDiv = document.getElementById('right-div');
    rightDiv.innerHTML = '';
    const heading = document.createElement('h2');
    heading.textContent = 'Completed Tasks';
    rightDiv.appendChild(heading);

    const table = document.createElement('table');
    table.setAttribute('id', 'task-com-table');

    this.createTableHeaders(table, rightDiv);
    this.createTableRows(table, projTitle, projId);

    // to show task details:
    // this.handleShowDetails(projId, '.task-details-icon', 'task-details');
    // to update task:
    // this.handleModifyAndDelete(projId, '.task-edit-icon', 'update-task', allProjects);
    // to delete task:
    // this.handleModifyAndDelete(projId, '.task-remove-icon', 'delete-task');
    // to show completed tasks:
    // this.handleShowCompleted(projId, '.task-details-icon', 'task-details');
    // to show task details:
    this.handleShowDetails(projTitle, projId, '.task-details-icon', 'task-details');
  }

  // handleShowCompleted(projId, allTaskControlElsClass, actionType) {

  // }

  createTableHeaders(table, rightDiv) {
    const headerTr = document.createElement('tr');
    const headerTd1 = document.createElement('th');
    const headerTd2 = document.createElement('th');
    // const headerTd3 = document.createElement('th');
    const headerTd4 = document.createElement('th');
    // const headerTd5 = document.createElement('th');
    const headerTd6 = document.createElement('th');
    const headerTd7 = document.createElement('th');
    const headerTd8 = document.createElement('th');

    const headerNumText = document.createTextNode('#');
    const headerTitleText = document.createTextNode('Title');
    // const headerTaskIdText = document.createTextNode('ID');
    // const headerProjIdText = document.createTextNode('Project');
    // const headerDescText = document.createTextNode('Description');
    const headerDueDateText = document.createTextNode('Due Date');
    const headerPriorityText = document.createTextNode('Priority');
    const headerControlsText = document.createTextNode('Controls');

    headerTd1.appendChild(headerNumText);
    headerTd2.appendChild(headerTitleText);
    // headerTd3.appendChild(headerTaskIdText);
    // headerTd4.appendChild(headerProjIdText);
    // headerTd5.appendChild(headerDescText);
    headerTd6.appendChild(headerDueDateText);
    headerTd7.appendChild(headerPriorityText);
    headerTd8.appendChild(headerControlsText);

    headerTr.appendChild(headerTd1);
    headerTr.appendChild(headerTd2);
    // headerTr.appendChild(headerTd3);
    // headerTr.appendChild(headerTd4);
    // headerTr.appendChild(headerTd5);
    headerTr.appendChild(headerTd6);
    headerTr.appendChild(headerTd7);
    headerTr.appendChild(headerTd8);

    table.appendChild(headerTr);
    rightDiv.appendChild(table);

  }

  createTableRows(table, projTitle, projId) {
    let num = 1;

    const allTasks = this.getAllTasks(projId);
    // Showing Only Non Completed Tasks For Tasks Summary Option:
    const nonCompletedTasks = this.getRequiredTasks(allTasks, 0);
    // Showing Only Completed Tasks For Completed Tasks Option:
    const completedTasks = this.getRequiredTasks(allTasks, 1);

    let requiredTasks;
    if (table.id == 'task-com-table') {
      requiredTasks = completedTasks;
    } else {
      requiredTasks = nonCompletedTasks;
    }

    for (const obj of Object.entries(requiredTasks)) {

      const taskId = obj[1].taskId;

      const taskTr = document.createElement('tr');
      const taskTd1 = document.createElement('td');
      const taskTd2 = document.createElement('td');
      // const taskTd3 = document.createElement('td');
      // const taskTd4 = document.createElement('td');
      // const taskTd5 = document.createElement('td');
      const taskTd6 = document.createElement('td');
      const taskTd7 = document.createElement('td');
      const taskTd8 = document.createElement('td');

      taskTd8.setAttribute('id', 'task-td8');

      const taskTd1Text = document.createTextNode(num);
      const taskTd2Text = document.createTextNode(obj[1].title);
      // const taskTd3Text = document.createTextNode(obj[1].taskId);
      // const taskIdText = document.createTextNode('projTitle');
      // const taskTd4Text = document.createTextNode(projTitle);
      // const taskTd5Text = document.createTextNode(obj[1].description);
      const taskTd6Text = document.createTextNode(obj[1].dueDate);
      const taskTd7Text = document.createTextNode(obj[1].priority);
      // const taskTd8Text = document.createTextNode('Controls');

      const taskTd8DetailsSpan = document.createElement('span');
      const taskTd8EditSpan = document.createElement('span');
      const taskTd8RemoveSpan = document.createElement('span');
      const taskTd8CompleteSpan = document.createElement('span');

      taskTd8DetailsSpan.setAttribute('id', `${taskId}-task-details`);
      taskTd8DetailsSpan.setAttribute('class', 'task-details-icon');
      const eyeIcon = document.createElement('i');
      eyeIcon.setAttribute('data-feather', 'eye');
      eyeIcon.setAttribute('class', 'task-details-svg');
      taskTd8DetailsSpan.appendChild(eyeIcon);



      taskTd1.appendChild(taskTd1Text);
      taskTd2.appendChild(taskTd2Text);
      // taskTd3.appendChild(taskTd3Text);
      // taskTd4.appendChild(taskTd4Text);
      // taskTd5.appendChild(taskTd5Text);
      taskTd6.appendChild(taskTd6Text);
      taskTd7.appendChild(taskTd7Text);

      this.setPriorityTextColor(taskTd7, taskTd7Text);

      taskTd8.appendChild(taskTd8DetailsSpan);

      // No Need To Show Unnecessary Controls For Completed Tasks Screen:
      if (table.id != 'task-com-table') {
        taskTd8EditSpan.setAttribute('id', `${taskId}-task-edit`);
        taskTd8EditSpan.setAttribute('class', 'task-edit-icon at-pencil-edit');
        taskTd8RemoveSpan.setAttribute('id', `${taskId}-task-remove`)
        taskTd8RemoveSpan.setAttribute('class', 'task-remove-icon at-xmark-clipboard');
        taskTd8CompleteSpan.setAttribute('id', `${taskId}-task-complete`);
        taskTd8CompleteSpan.setAttribute('class', 'task-complete-icon at-check-circle');
        taskTd8.appendChild(taskTd8EditSpan);
        taskTd8.appendChild(taskTd8RemoveSpan);
        taskTd8.appendChild(taskTd8CompleteSpan);
      }

      taskTr.appendChild(taskTd1);
      taskTr.appendChild(taskTd2);
      // taskTr.appendChild(taskTd3);
      // taskTr.appendChild(taskTd4);
      // taskTr.appendChild(taskTd5);
      taskTr.appendChild(taskTd6);
      taskTr.appendChild(taskTd7);
      taskTr.appendChild(taskTd8);


      table.appendChild(taskTr);
      replace();
      num++;
    }
  }
  setPriorityTextColor(taskTd7, taskTd7Text) {
    
    switch (taskTd7Text.textContent) {
      case 'high':
        taskTd7.style.color = '#f08080';
        break;
      case 'normal':
        taskTd7.style.color = '#2e8b57';
        break;
      case 'low':
        taskTd7.style.color = '#1e90ff';
        break;
    }
  }
}