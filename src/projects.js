import { compareAsc, format } from "date-fns";

export class Projects {

  createDefaultProject(projName) {
    const defProject = this.getProject(0);
    if (defProject === null) {
      let newProj = {};
      newProj['p0'] = { projId: 0, title: projName, tasks: {} };
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
    let newProj = {};
    const lastProjId = this.getLastProjectID();
    if (lastProjId != null) { newID = lastProjId + 1; }
    newProj[`p${newID}`] = { projId: newID, title: projName, tasks: {} };
    localStorage.setItem(newID, JSON.stringify(newProj));
  }

  getLastProjectID() {
    const allProjects = this.getAllProjects();
    if (allProjects == null) return null;
    let lastID = 0;
    for (const key in allProjects) {
      const currProjId = JSON.parse(allProjects[key])[`p${key}`].projId
      if (currProjId > lastID) {
        lastID = currProjId;
      }
    }
    return lastID;
  }

  deleteProject(lStorageName) {
    localStorage.removeItem(lStorageName);
  }

  updateProject(reqProjId, newTitle) {
    const proj = localStorage.getItem(reqProjId);
    if (proj == null || reqProjId == 0 || newTitle == 'default') { return; }
    const newProj = JSON.parse(proj);
    newProj[`p${reqProjId}`].title = newTitle;
    localStorage.setItem(reqProjId, JSON.stringify(newProj));
  }

  getAllProjects() {
    return { ...localStorage };
  }
}