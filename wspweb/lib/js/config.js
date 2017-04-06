CKEDITOR.addStylesSet('wsp',[
	{ name : '1倍行高', element : 'p', styles : { 'line-height' : '1' }},
	{ name : '1.5倍行高', element : 'p', styles : { 'line-height' : '1.5' }},
	{ name : '2倍行高', element : 'p', styles : { 'line-height' : '2' }},
	{ name : '3倍行高', element : 'p', styles : { 'line-height' : '3' }}
])
CKEDITOR.editorConfig = function( config ) {
	config.toolbarGroups = [
		{ name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
		{ name: 'forms', groups: [ 'forms' ] },
		{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
		{ name: 'links', groups: [ 'links' ] },
		{ name: 'insert', groups: [ 'insert' ] },
		'/',
		'/',
		{ name: 'styles', groups: [ 'styles' ] },
		{ name: 'colors', groups: [ 'colors' ] },
		{ name: 'tools', groups: [ 'tools' ] },
		{ name: 'about', groups: [ 'about' ] },
		{ name: 'others', groups: [ 'others' ] }
	];
	config.font_names
		= '宋体/宋体;黑体/黑体;仿宋/仿宋_GB2312;楷体/楷体_GB2312;隶书/隶书;幼圆/幼圆;雅黑/雅黑;'+
		config.font_names ;
	config.extraPlugins = 'uploadimage';
	//config.filebrowserUploadUrl = '/bam/api/tempfile/'
	config.filebrowserImageUploadUrl = '/FileUpload/UploadImgSpecial';
	config.filebrowserUploadUrl = '/FileUpload/UploadDocSpecial';
	config.stylesCombo_stylesSet = 'wsp';
	config.removeButtons = 'Save,Print,Templates,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,CreateDiv,Blockquote,Flash,Iframe,About';
};


