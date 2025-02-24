export class ProjectsDisplay {


  showAllProjects(allProjects) {

    for (const obj of Object.entries(allProjects)) {
      console.log(obj[0]);
      // console.log(obj[1]);
      // const ele
    }
  }

  showSingleProject(projId, allProjects) {
    for (const obj of Object.entries(allProjects)) {
      if (JSON.parse(obj[1])[`p${projId}`].projId == projId) {
        // console.log(JSON.parse(obj[1])['p0']);
        return;
      }
    }
  }
  
}