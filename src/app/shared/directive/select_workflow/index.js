export default angular
  .module('select_workflow', [])
  .controller('WorkflowSelectController', function (messageFactory, WorkflowFactory, $scope) {
    'ngInject';
    $scope.selected = null;
    $scope.workflows = [];
    WorkflowFactory.getList().then((response)=> {
      if (response.data && response.data.workflows && Array.isArray(response.data.workflows)) {
        let workflows = response.data.workflows;
        workflows.forEach(workflow => {
          workflow.checked = workflow.id === $scope.ngDialogData.selected;
          if (workflow.checked) $scope.selected = workflow;
          if (Array.isArray(workflow.workflow_statuses)) {
            let steps = linksToList(workflow.workflow_statuses);
            workflow.label = steps.map(s => s.status).join(' > ');
          }
        });
        $scope.workflows = workflows.slice();
      }
    });

    $scope.select = function (workflow) {
      $scope.workflows.forEach(w => w.checked = workflow.id === w.id);
      $scope.selected = workflow;
    };

    $scope.updateWorkflow = function () {
      $scope.closeThisDialog($scope.selected);
    };

  })


function linksToList(actions) {
  let links = {};
  let all = {};
  let froms = {};
  let tos = {};
  actions.forEach(({ from_status, to_status }) => {
    links[from_status.id] = to_status.id;
    all[from_status.id] = from_status;
    all[to_status.id] = to_status;
    froms[from_status.id] = from_status;
    tos[to_status.id] = to_status;
  });
  let start = Object.keys(all).filter(i => tos[i] === undefined);
  if (start.length) {
    let from = start[0];
    let list = [];
    list.push(all[start[0]]);
    let to = links[from];
    while (to !== undefined) {
      list.push(all[to]);
      to = links[to];
    }
    return list;
  } else {
    return [];
  }
}
