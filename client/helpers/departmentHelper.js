import cloneDeep from 'lodash/cloneDeep';
import sortBy from 'lodash/sortBy';
// copied from old dashboard and need to rewrite to known what it is doing

/**
 * Seems Verbose but there seems to be no other way to sort this data
 */
function TreeNode(data) {
    this.data     = data;
    this.parent   = null;
    this.children = [];
}

TreeNode.prototype.walk = function (f, recursive) {
    for (let i=0, l=this.children.length; i<l; i++) {
        let child = this.children[i];
        f.apply(child, Array.prototype.slice.call(arguments, 2));
        if (recursive) {
          child.walk.apply(child, arguments);
        }
    }
};

function toTree(data) {
    let parent = new TreeNode(), i = 0, l = data.length, node;
    let nodeById={};
    for (i=0; i<l; i++) {
        let newNode = new TreeNode(data[i]);
        nodeById[ data[i].id ] = newNode;
        if (data[i].parent_id === null){
            parent.children.push(newNode);
            newNode.parent = parent;
        }
    }
    for (i=0; i<l; i++) {
        node = nodeById[ data[i].id ];
        if (node.data.parent_id && nodeById[ node.data.parent_id ]){
            node.parent = nodeById[ node.data.parent_id ];
            node.parent.children.push(node);
        }
    }
    return parent;
}
let htmlDecode = function (input) {
    let e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes[0].nodeValue;
};

let sortAndTreeDepartment = function (departments){
    let departmentsSorted = cloneDeep(departments);

    // Sorting
    departmentsSorted = sortBy(departmentsSorted, 'name');

    // Treenoding the department array
    let departmentsTree = toTree (departmentsSorted);
    let departmentsTreeSort = [];

    // Formatting the Display Values
    departmentsTree.walk(function () {
        this.data.display = '';
        this.data.stackdisplay = null;
        let current = this;
        do {

            if (current) {
                if (!this.data.stackdisplay) {
                    this.data.stackdisplay = current.data.name;
                }
                else {
                    this.data.stackdisplay = current.data.name + '->' + this.data.stackdisplay;
                }
            }

            current = current.parent;
        } while (current.parent !== null);

        for (let i = 0; i < this.data.depth; i ++){
            this.data.display += '——';
        }
        this.data.display += this.data.name;
        this.data.display = htmlDecode(this.data.display);
        departmentsTreeSort.push(this.data);
    }, true);
    return departmentsTreeSort;
};

export { sortAndTreeDepartment };
