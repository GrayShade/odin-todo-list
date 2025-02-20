export class ProjectsDisplay {


  showAllProjects(allProjects) {
    for (const obj of Object.entries(allProjects)) {
      // console.log(obj[0]);
      // console.log(obj[1]);
    }
  }

  showSingleProject(name, allProjects) {
    for (const obj of Object.entries(allProjects)) {
      if (JSON.parse(obj[1]).title == name) {
        // console.log(JSON.parse(obj[1]));
        return;
      }
    }
  }
  
}