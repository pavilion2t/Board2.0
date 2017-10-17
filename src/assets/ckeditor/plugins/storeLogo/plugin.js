/**
 * Created by Alan on 4/27/2016.
 */

CKEDITOR.plugins.add( 'storeLogo', {
  icons: 'storeLogo',
  init: function( editor ) {
    editor.ui.addButton( 'storeLogo', {
      label: 'Insert Store Logo',
      command: 'insertStoreLogo',
      toolbar: 'insert',
      modes: { wysiwyg: true }
    });


    editor.addCommand( 'insertStoreLogo', {
      exec: function( editor ) {
        editor.insertHtml('<img src="'+CKEDITOR.config.storeLogo.url+'">', 'unfiltered_html');
      }
    });
  },
  afterInit: function(editor)
  {

  }
});
