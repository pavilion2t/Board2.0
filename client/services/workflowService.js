import BindoService from './base/bindoService';

class WorkflowService extends BindoService {
  createWorkflow(workflow, storeId) {
    let path = `v2/stores/${storeId}/workflows`;

    return super.post(path, { workflow });
  }

  getWorkflows(storeId) {
    let path = `v2/stores/${storeId}/workflows`;

    return super.get(path);
  }

  getWorkflow(id, storeId) {
    let path = `v2/stores/${storeId}/workflows/${id}`;

    return super.get(path);
  }

  updateWorkflow(id, workflow, storeId) {
    let path = `v2/stores/${storeId}/workflows/${id}`;

    return super.put(path, { workflow });
  }

  removeWorkflow(id, storeId) {
    let path = `v2/stores/${storeId}/workflows/${id}`;

    return super.delete(path);
  }
}

export default new WorkflowService();
