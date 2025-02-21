import { compareAsc, format } from "date-fns";

export class Projects {

  createDefaultProject(projName) {
    const defProject = this.getProject(0);
    if (defProject === null) {
      localStorage.setItem(0, JSON.stringify({ projId: 0, title: projName, tasks: {} }));
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
    localStorage.setItem(newID, JSON.stringify({ projId: newID, title: projName, tasks: {} }));
  }

  deleteProject(projName) {
    localStorage.removeItem(projName);
  }

  getAllProjects() { return { ...localStorage }; }









}