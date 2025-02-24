import { compareAsc, format } from "date-fns";

export class Tasks {

  getTask(projID, reqTaskID) {
    let tasks = this.getAllTasks(projID);
    if (tasks != null && tasks[`t${reqTaskID}`].taskId == reqTaskID) {
      return tasks[`t${reqTaskID}`];
    }
    return null;
  }

  createTask(projID) {
    for (let obj of Object.entries({ ...localStorage })) {
      if (JSON.parse(obj[1])[`p${projID}`].projId == projID) {
        const newObj = JSON.parse(obj[1]);
        let newID = 0;
        const lastTaskID = this.getLastTaskID(projID);
        if (lastTaskID != null) { newID = lastTaskID + 1; }
        // newID = Object.keys(this.getAllTasks(projID)).length + 1;
        // const taskID = `${projID}t${newID}`;
        // newObj['tasks'][`t${newID}`] =
        newObj[`p${projID}`].tasks[`t${newID}`] =
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

  getLastTaskID(projID) {
    const allTasks = this.getAllTasks(projID);
    if (allTasks == null) return null;

    let lastID = 0;
    for(let key in allTasks) {
      if (allTasks[key].taskId > lastID) {
        lastID = allTasks[key].taskId;
      }
      
    }
    return lastID;
  }

  deleteTask(projID, reqTaskId) {
    for (const obj of Object.entries({ ...localStorage })) {
      if (JSON.parse(obj[1])[`p${projID}`].projId == projID) {
        const newObj = JSON.parse(obj[1]);
        newObj[`p${projID}`].tasks = {}
        for (const tasksObj of Object.entries(JSON.parse(obj[1])[`p${projID}`].tasks)) {
          // Enter tasks in << newObj >> except the one to be deleted:
          if (tasksObj[1].taskId != reqTaskId) {
            newObj[`p${projID}`].tasks[`t${tasksObj[1].taskId}`] = tasksObj[1];
          }
        }
        localStorage.setItem(projID, JSON.stringify(newObj));
        return
      }
    }
  }

  updateTask(projID, reqTaskID, updatedTask) {
    for (const obj of Object.entries({ ...localStorage })) {
      if (JSON.parse(obj[1])[`p${projID}`].projId == projID) {
        const newObj = JSON.parse(obj[1]);
        for (const tasksObj of Object.entries(JSON.parse(obj[1])[`p${projID}`].tasks)) {
          // if its required task, update it:
          if (tasksObj[1].taskId == reqTaskID) {
            newObj[`p${projID}`].tasks[`t${tasksObj[1].taskId}`] = updatedTask;
          }
        }
        localStorage.setItem(projID, JSON.stringify(newObj));
        return
      }
    }
  }

  getAllTasks(projID) {
    for (const obj of Object.entries({ ...localStorage })) {
      if (JSON.parse(obj[1])[`p${projID}`].projId == projID) {
        const tasks = JSON.parse(obj[1])[`p${projID}`].tasks;
        // return if object is empty (using performance efficient for...in loop):
        for (const i in tasks) { return tasks; }
        return null;
      }
    }
  }

}