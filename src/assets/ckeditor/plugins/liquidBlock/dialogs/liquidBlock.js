/**
 * Created by Alan on 4/28/2016.
 */

CKEDITOR.dialog.add( 'liquidBlock', function( editor ) {

  var currentValue = 'test';
  var contents = [];

  function submit(){
    var insert = currentValue;
    var inserttotal = '<span>'+insert+'</span> ';
    if (editor.mode === 'source'){
      var input = document.getElementsByClassName('cke_source cke_enable_context_menu')[0];
      input.focus();
      if(typeof input.selectionStart != 'undefined') {
        var start = input.selectionStart;
        var end = input.selectionEnd;
        input.value = input.value.substr(0, start) + inserttotal + input.value.substr(end);
        var pos;
        pos = start + inserttotal.length;
        input.selectionStart = pos;
        input.selectionEnd = pos;
      }
    }
    else {
      editor.insertHtml(inserttotal, 'unfiltered_html');
    }
  }

  for ( var tabkey in CKEDITOR.config.liquidBlock.tabs ){
    var current = CKEDITOR.config.liquidBlock.tabs[tabkey];

    var list = [];
    list[0]=[];
    list[1]=[];
    var children = [];
    for ( var i = 0; i < list.length; i++){
      children.push({type:'vbox',children:list[i]});
    }


    var tab = {
      id: tabkey,
      type: 'html',
      label: current.name,
      html: 'This dialog window lets you create simple links for your website.',
      elements: [
        {
          type: 'hbox',
          widths: ['200px', '200px'],
          align: 'right',
          children: children
        }]
    };




    if ( current.children ) {
      var j = 0;
      for (var i = 0; i < current.children.length; i++) {
        var child = current.children[i];
        list[j].push({
            type: 'button',
            id: child.name,
            label: child.name+' - '+child.value,
            hashValue: child.value,
            onClick: function (type, element) {
              currentValue = this.hashValue;
              submit();
              editor.closeDialog();
            }
          }
        )
        j++;
        if ( j===2){
          j = 0;
        }
      }
    }
    contents.push(tab);
  }



  return {
    title : 'Liquid Properties',
    minWidth : 800,
    minHeight : 400,
    contents : contents
  };
} );
