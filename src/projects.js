import { compareAsc, format } from "date-fns";

export class Projects {

  createDefaultProject(projName) {
    const defProject = this.getProject(0);
    if (defProject === null) {
      let newProj = {};
      newProj['p0'] = {projId: 0, title: projName, tasks: {}};
      localStorage.setItem(0, JSON.stringify(newProj));
    }
  }

  getProject(projID) {
    const allProjects = this.getAllProjects();
    if (Object.keys(allProjects).includes(projID.toString())) {
      return JSON.parse(allProjects[projID]);
    }
    return null;
  }

  createProject(projName) {
    let newID = 0;
    newID = Object.keys(this.getAllProjects()).length;
    newID = newID + 1;
    let newProj = {};
    newProj[`p${newID}`] = {projId: newID, title: projName, tasks: {}};
    localStorage.setItem(newID, JSON.stringify(newProj));
  }

  deleteProject(projName) {
    localStorage.removeItem(projName);
  }

  getAllProjects() { return { ...localStorage }; }

}