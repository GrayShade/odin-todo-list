import { compareAsc, format } from "date-fns";

export class Projects {

  createDefaultProject(projName) {
    const defProject = this.getProject('p1');
    if (defProject === null) {
      localStorage.setItem('p1', JSON.stringify({ 'id': 'p1', title: projName, tasks: {} }));
    }
  }

  getProject(projID) {
    const allProjects = this.getAllProjects();
    if (Object.keys(allProjects).includes(projID)) {
      return JSON.parse(allProjects[projID]);
    }
    return null;
  }

  createProject(projName) {
    let newID = 0;
    newID = Object.keys(this.getAllProjects()).length;
    newID = `proj${newID + 1}`;
    localStorage.setItem(id, JSON.stringify({ id: newID, title: projName, tasks: {} }));
  }

  deleteProject(projName) {
    localStorage.removeItem(projName);
  }

  getAllProjects() { return { ...localStorage }; }









}