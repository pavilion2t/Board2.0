export function CommonFactory($rootScope, $filter, uiGridConstants,ExportFactory) {
  'ngInject';
  var getDiff = function(newObj, oldObj) {
    var diff = {};
    for(var key in newObj) {
      // is array or object
      // if(newObj[key] === null || typeof newObj[key] !== 'object') {
      if(newObj[key] !== oldObj[key]) {
        diff[key] = newObj[key];
      }
      // }
    }
    return diff;
  };
  var getCurrentTime = function() {
    var time = new Date();
    var yyyy = time.getFullYear().toString();
    var mm = (time.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd  = time.getDate().toString();
    var hr = time.getHours().toString();
    var mn = time.getMinutes().toString();
    var sc = time.getSeconds().toString();
    return yyyy + '-' +
      (mm[1] ? mm : '0' + mm[0])
      + (dd[1] ? dd : '0' + dd[0]) + '-'
      + (hr[1] ? hr : '0' + hr[0])
      + (mn[1] ? mn : '0' + mn[0])
      + (sc[1] ? sc : '0' + sc[0]);
  };

  var getFieldVar = function(entry, fieldName){
    if ( fieldName && typeof fieldName === 'string' ){
      var index = fieldName.indexOf('.');
      if( index !== -1 ) {
        var fieldParent = fieldName.substring(0,index);
        var fieldChild = fieldName.substring(index+1);
        if ( entry[fieldParent] ) {
          return getFieldVar(entry[fieldParent], fieldChild);
        }
        else {
          return getFieldVar(entry[fieldName]);
        }
      }
      else {
        return entry[fieldName];
      }
    }
    else{
      return null;
    }
  };




  var parseCsv = function(columns, csv) {
    // a pile of ugly code
    var targetColumnNames = _.map(columns, function(column) { return column.name; });
    var csvColumnNames = csv.split('\n')[0].split(',');
    var csvEntries = _.map(csv.split('\n').slice(1), function(str) {
      return str.split(',');
    });
    var csvTargetColumns = [];

    _.each(csvColumnNames, function(name, i) {
      for(var j = 0; j < targetColumnNames.length; j++) {
        if(name === targetColumnNames[j]) {
          csvTargetColumns[i] = columns[j];
        }
      }
    });
    var output = _.map(csvEntries, function(entry) {
      var item = {};
      _.each(csvTargetColumns, function(column, i) {
        if(column.compulsory && !entry[i]) {
          return null;
        }
        if(entry[i]) {
          item[column.field] = column.formatter ? column.formatter(entry[i]) : entry[i];
        }
      });
      return item;
    });

    return _.filter(output, function(item) { return item });
  };

  var download = function(blob, fileName) {
    var link = document.createElement('a');
    if (link.download !== undefined) {
      // browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  /**
   * Seems Verbose but there seems to be no other way to sort this data
   */
  function TreeNode(data) {
    this.data     = data;
    this.parent   = null;
    this.children = [];
  }
  TreeNode.prototype.walk = function(f, recursive) {
    for (var i=0, l=this.children.length; i<l; i++) {
      var child = this.children[i];
      f.apply(child, Array.prototype.slice.call(arguments, 2));
      if (recursive) {
        child.walk.apply(child, arguments);
      }
    }
  }

  function toTree(data) {
    var parent = new TreeNode(), i = 0, l = data.length, node;
    var nodeById={};
    for (i=0; i<l; i++) {
      var newNode = new TreeNode( data[i] );
      nodeById[ data[i].id ] = newNode;
      if ( data[i].parent_id === null ){
        parent.children.push( newNode );
        newNode.parent = parent;
      }
    }
    for (i=0; i<l; i++) {
      node = nodeById[ data[i].id ];
      if ( node.data.parent_id && nodeById[ node.data.parent_id ] ){
        node.parent = nodeById[ node.data.parent_id ];
        node.parent.children.push(node);
      }
    }
    return parent;
  }
  var htmlDecode = function(input) {
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes[0].nodeValue;
  };

  var sortAndTreeDepartment = function( departments ){
    var departmentsSorted = _.cloneDeep( departments );

    // Sorting
    departmentsSorted = _.sortBy(departmentsSorted, 'name');

    // Treenoding the department array
    var departmentsTree = toTree ( departmentsSorted );
    var departmentsTreeSort = [];

    // Formatting the Display Values
    departmentsTree.walk( function () {
      this.data.display = '';
      this.data.stackdisplay = null;
      var current = this;
      do{

        if ( current ) {
          if ( !this.data.stackdisplay ) {
            this.data.stackdisplay = current.data.name;
          }
          else {
            this.data.stackdisplay = current.data.name + '->' + this.data.stackdisplay;
          }
        }

        current = current.parent;
      }while (current.parent !== null)

      for ( var i = 0; i < this.data.depth; i ++ ){
        this.data.display += '——'
      }
      this.data.display += this.data.name;
      this.data.display = htmlDecode(this.data.display);
      departmentsTreeSort.push( this.data );
    }, true);
    return departmentsTreeSort;
  };

  return {
    getDiff: getDiff,
    parseCsv: parseCsv,
    download: download,
    sortAndTreeDepartment: sortAndTreeDepartment,
    getFieldVar: getFieldVar
  };

}
