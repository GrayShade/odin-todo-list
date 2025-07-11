export class Projects {

  constructor(eventBus) {
    this.eventBus = eventBus;
    this.setupEventBusListener();
  }

  setupEventBusListener() {
    // We need to call << getProject() >> from << projDisplay.js >>, but want to at least maintain loose
    // coupling, we use EventBus. EventBus uses pub/sub pattern. Also, we are setting up eventBus listeners
    //  only once using << eventBus.on() >> below. So, no need to destroy them afterwards to avoid duplication.
    //  << eventBus.emit >> can be used repeatedly without needing destroying.
    // When eventBus of << projDisplay.js >> emits << 'getProject' >>, then:
    this.eventBus.on('populateProjTitle', (projId) => {
      const proj = this.getProject(projId);
      // As << proj >> can't be returned from here back to emit as far as I know, so updating input value here
      // instead of from where << eventBus.emit >> was called:
      document.getElementById('new-proj-title').value = proj[`p${projId}`].title;
    });

    // Subscriber
    this.eventBus.on('requestAllProjects', () => {
        // Process request and get data
        const allProjects = this.getAllProjects();
        this.eventBus.emit('returnAllProjects', allProjects);
    });
  }


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

  getProjectIdByTitle(title) {
    if (title.trim() == '') { return null }
    const allProjects = this.getAllProjects();
    for (let idx=0; idx <= Object.entries((allProjects)).length; idx++) {
      // If a specific project was deleted, Its key may not exist. So:
      if (Object.keys(allProjects).includes(idx.toString()) == false) { continue; }
      const loopProj = JSON.parse(allProjects[Object.keys(allProjects)[idx]])[`p${Object.keys(allProjects)[idx]}`];
      if (loopProj.title == title) {
        return loopProj.projId;
      }
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