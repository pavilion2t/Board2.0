/**
 * Created by Alan on 4/27/2016.
 */

CKEDITOR.plugins.add( 'liquidBlock', {
  icons: 'liquid',
  onLoad: function()
  {
    CKEDITOR.addCss('liquidVariable, liquidBlock' +
    '{' +
    'color: #000;' +
    'background-color: #ffa;' +
    'border: 1px solid #ccc;' +
    'padding: 2px;' +
    'white-space:nowrap;' +
    '}\n' +
    'liquidBlock' +
    '{' +
    'background-color: #cfc;' +
    '}');
  },
  init: function( editor ) {
    editor.ui.addButton( 'Liquid', {
      label: 'Insert Liquid',
      command: 'insertLiquid',
      toolbar: 'insert',
      modes: { wysiwyg: true, source: true }
    });

    CKEDITOR.dialog.add( 'liquidBlock', this.path + 'dialogs/liquidBlock.js' );


    editor.addCommand( 'insertLiquid', {
      exec: function( editor ) {
        editor.openDialog('liquidBlock');
      },
      modes: { wysiwyg: true, source: true }
    });
  },
  afterInit: function(editor)
  {

    var dataProcessor = editor.dataProcessor,
      dataFilter = dataProcessor && dataProcessor.dataFilter,
      htmlFilter = dataProcessor && dataProcessor.htmlFilter;

    // html to data conversion
    if (dataFilter) {
      dataFilter.addRules({
        text: function(text) {
          text = text.replace(/\{\{(.+?)\}\}/g, "<liquidVariable>{{$1}}</liquidVariable>");
          text = text.replace(/\{%(.+?)%\}/g, "<liquidBlock>{%$1%}</liquidBlock>");
          return text;
        }
      });
    }

    // data to html conversion
    if (htmlFilter) {
      htmlFilter.addRules({
        elements: {
          liquidvariable: function(element, b, c){
            // Drop the wrapper element.
            delete element.name;

            if (element.children.length > 0) {
              element.children[0].value = element.children[0].value;
            }
          },
          liquidblock: function(element, b, c){
            // Drop the wrapper element.
            delete element.name;

            if (element.children.length > 0) {
              element.children[0].value = element.children[0].value;
            }
          }
        }
      });
    }
  }
});
