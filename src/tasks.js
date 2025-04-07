import { compareAsc, format } from "date-fns";

export class Tasks {

  getTask(reqProjId, reqTaskID) {
    for (const obj of Object.entries({ ...localStorage })) {
      if (obj[0] != reqProjId) { continue; };
      if (JSON.parse(obj[1])[`p${reqProjId}`].projId == reqProjId) {
        const tasks = this.checkEmptyTasks(obj, reqProjId);
        if (this.checkEmptyTasks(obj, reqProjId) == null) { return };
        // if specific task exists & is same task:
        if (tasks[`t${reqTaskID}`] && tasks[`t${reqTaskID}`].taskId == reqTaskID) {
          return tasks[`t${reqTaskID}`];
        }
        return null;
      }
    }
    
  }

  createTask(allInputs, reqProjId) {
    for (let obj of Object.entries({ ...localStorage })) {
      const currProjectId = JSON.parse(obj[1])[`p${reqProjId}`]
      // Checking for undefined projects first as projects may not exist yet:
      if (currProjectId != undefined && currProjectId.projId == reqProjId) {
        const newObj = JSON.parse(obj[1]);
        let newId = 0;
        const lastTaskID = this.getLastTaskID(reqProjId);
        if (lastTaskID != null) { newId = lastTaskID + 1; }
        newObj[`p${reqProjId}`].tasks[`t${newId}`] =
        {
          taskId: newId,
          projId: reqProjId,
          title: allInputs[0].value,
          description: allInputs[1].value,
          dueDate: allInputs[2].value,
          priority: allInputs[3].value
        };

        localStorage.setItem(reqProjId, JSON.stringify(newObj));
        return;
      }
    }
  }

  getLastTaskID(projID) {
    const allTasks = this.getAllTasks(projID);
    if (allTasks == null) return null;
    let lastID = 0;
    for (let key in allTasks) {
      if (allTasks[key].taskId > lastID) {
        lastID = allTasks[key].taskId;
      }
    }
    return lastID;
  }

  deleteTask(reqProjId, reqTaskId) {
    for (const obj of Object.entries({ ...localStorage })) {
      if (obj[0] != reqProjId) { continue; };
      if (JSON.parse(obj[1])[`p${reqProjId}`].projId == reqProjId) {
        if (this.checkEmptyTasks(obj, reqProjId) == null) { return };
        const newObj = JSON.parse(obj[1]);
        newObj[`p${reqProjId}`].tasks = {}
        for (const tasksObj of Object.entries(JSON.parse(obj[1])[`p${reqProjId}`].tasks)) {
          // Enter tasks in << newObj >> except the one to be deleted:
          if (tasksObj[1].taskId != reqTaskId) {
            newObj[`p${reqProjId}`].tasks[`t${tasksObj[1].taskId}`] = tasksObj[1];
          }
        }
        localStorage.setItem(reqProjId, JSON.stringify(newObj));
        return;
      }
    }
  }

  checkEmptyTasks(obj, reqProjId) {
    const tasks = JSON.parse(obj[1])[`p${reqProjId}`].tasks;
    // return if object is empty (using performance efficient for...in loop):
    for (const i in tasks) { return tasks; }
    return null;
  }

  updateTask(reqProjId, reqTaskId, updatedTask) {
    for (const obj of Object.entries({ ...localStorage })) {
      if (obj[0] != reqProjId) { continue; };
      if (JSON.parse(obj[1])[`p${reqProjId}`].projId == reqProjId) {
        if (this.checkEmptyTasks(obj, reqProjId) == null) { return };
        const newObj = JSON.parse(obj[1]);
        for (const tasksObj of Object.entries(JSON.parse(obj[1])[`p${reqProjId}`].tasks)) {
          // if its required task, update it:
          if (tasksObj[1].taskId == reqTaskId) {
            newObj[`p${reqProjId}`].tasks[`t${tasksObj[1].taskId}`] = updatedTask;
            break;
          }
        }
        localStorage.setItem(reqProjId, JSON.stringify(newObj));
        return;
      }
    }
  }

  getAllTasks(reqProjId) {
    for (const obj of Object.entries({ ...localStorage })) {
      if (obj[0] != reqProjId) { continue; };
      if (JSON.parse(obj[1])[`p${reqProjId}`].projId == reqProjId) {
        const tasks = this.checkEmptyTasks(obj, reqProjId);
        if (tasks == null) { return null };
        return tasks;
      }
    }
  }

}