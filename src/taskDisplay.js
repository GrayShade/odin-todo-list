export class TasksDisplay {
  showAllTasks(projID) {
    for (const obj of Object.entries({ ...localStorage })) {
      if (JSON.parse(obj[1]).projId == projID) {
        // console.log(JSON.parse(obj[1])[`p${projID}`].tasks);
        return;
      }
    }
  }
  showSingleTask(task) {
    // console.log(task);
  }
}