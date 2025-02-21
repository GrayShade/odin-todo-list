import { compareAsc, format } from "date-fns";

export class Tasks {

  getTask(projID, taskID) {
    let task = this.getAllTasks(projID);
    if (task != null && task.taskId == taskID) {
      return task[taskID];
    }
    return null;
  }

  createTask(projID) {
    for (let obj of Object.entries({ ...localStorage })) {
      if (JSON.parse(obj[1]).projId == projID) {
        const newObj = JSON.parse(obj[1]);
        let newID = 0;
        newID = Object.keys(this.getAllTasks(projID)).length + 1;
        // const taskID = `${projID}t${newID}`;
        // newObj['tasks'][`t${newID}`] =
        newObj.tasks[`t${newID}`] = 
        {
          taskId: newID,
          projId: projID,
          title: '',
          description: '',
          dueDate: '',
          priority: ''
        };

        localStorage.setItem(projID, JSON.stringify(newObj));
        return;
      }
    }
  }

  deleteTask(projID, reqTaskId) {
    for (const obj of Object.entries({ ...localStorage })) {
      if (JSON.parse(obj[1]).projId == projID) {
        const newObj = JSON.parse(obj[1]);
        newObj.tasks = {}
        for (const tasksObj of Object.entries(JSON.parse(obj[1]).tasks)) {
          // Enter tasks in << newObj >> except the one to be deleted:
          if (tasksObj[1].taskId != reqTaskId) {
            newObj.tasks[`t${tasksObj[1].taskId}`] = tasksObj[1];
          }
        }
        localStorage.setItem(projID, JSON.stringify(newObj));
        return
      }
    }
  }

  updateTask(projID, reqTaskID, updatedTask) {
    for (const obj of Object.entries({ ...localStorage })) {
      if (JSON.parse(obj[1]).projId == projID) {
        const newObj = JSON.parse(obj[1]);
        for (const tasksObj of Object.entries(JSON.parse(obj[1]).tasks)) {
          // if its required task, update it:
          if (tasksObj[1].taskId == reqTaskID) {
            newObj.tasks[`t${tasksObj[1].taskId}`] = updatedTask;
          }
        }
        localStorage.setItem(projID, JSON.stringify(newObj));
        return
      }
    }
  }

  getAllTasks(projID) {
    for (const obj of Object.entries({ ...localStorage })) {
      if (JSON.parse(obj[1]).projId == projID) {
        let tasks = JSON.parse(obj[1]).tasks;
        return tasks;
      }
    }
    return null;
  }

}