/**
 * Created by Alan Tang
 * 
 * jsPDF layout engine
 */


var jsPDFExtend = function( jsPdf, setting ){
	if ( !setting ){ setting = {}; }
	var API = {};
	function notNull(obj){
		return ( typeof obj !== 'undefined' && obj !== null );
	}
	
	API.layoutGrid = false;
	API.jsPdf = jsPdf;
	API.defaultWidth = setting.defaultWidth ? setting.defaultWidth : API.jsPdf.getPageSize().width;
	API.defaultHeight = setting.defaultHeight ? setting.defaultHeight : API.jsPdf.getPageSize().height;
	API.defaultPadding = setting.defaultPadding ? setting.defaultPadding : 0;

	API.pageFooter = 20;
	API.pageWidth = setting.pageWidth ? setting.pageWidth : API.defaultWidth;
	API.pageHeight = setting.pageHeight ? setting.pageHeight : API.defaultHeight - API.pageFooter;

	API.pageOffset = 0;
	
	API.setDefaultPadding = function( wholePadding ){
		API.defaultPadding = wholePadding;
	};
	API.fontMap = {};
	API.defineFont = function( fontName, fontSize, fontStyle, textColor ){
		API.fontMap[fontName] = {fontSize:fontSize, fontStyle:fontStyle, textColor:textColor};
	};
	
	API.init = function(){
		API.wholeComponent = new API.row( );
		API.wholeComponent.setPadding( API.defaultPadding );
		API.wholeComponent.setWidth( API.defaultWidth );
		API.wholeComponent.setPosition( 0, 0 );
	};
	
	// Extends Component Functions
	API.setWidth = function( wholeWidth ){
		API.wholeComponent.setWidth( wholeWidth );
	};
	API.setHeight = function( wholeHeight ){
		API.wholeComponent.setHeight( wholeHeight );
	};
	API.setPadding = function( wholePadding ){
		API.wholeComponent.setPadding( wholePadding );
	};
	API.add = function( component ){
		return API.wholeComponent.add( component );
	};
	
	API.getPageHeight = function(){
		return API.pageHeight;
	};
	API.getPageWidth = function(){
		return API.pageWidth;
	};
	
	API.addPage = function(y){
		API.pageOffset = y;
		API.jsPdf.addPage();
	};
	
	
	API.box = function( setting ){
		if ( !setting ){ setting = {}; }
		this.components = [];
		this.padding = notNull( setting.padding ) ? setting.padding : API.defaultPadding;
		this.width = notNull( setting.width ) ? setting.width : 0;
		this.height = notNull( setting.height ) ? setting.height : 0;
		this.type = notNull( setting.type ) ? setting.type : 'fixedCol';
		this.maxwidth = 0;
		this.autoHeight = !notNull( setting.height );
		this.autoWidth = !notNull( setting.width );
		this.x = notNull( setting.x ) ? setting.x : 0;
		this.y = notNull( setting.y ) ? setting.y : 0;
		this.margin = notNull( setting.margin ) ? setting.margin: 0;
		
		this.borderTop = notNull( setting.borderTop ) ? setting.borderTop : false;
		this.borderBottom = notNull( setting.borderBottom ) ? setting.borderBottom : false;
		this.borderLeft = notNull( setting.borderLeft ) ? setting.borderLeft : false;
		this.borderRight = notNull( setting.borderRight ) ? setting.borderRight : false;
		this.border = notNull( setting.border ) ? setting.border : API.layoutGrid;
		this.borderColor = notNull( setting.borderColor ) ? setting.borderColor : {r:0,g:0,b:0,a:1};
		
		
		this.hAlign = notNull( setting.hAlign ) ? setting.hAlign :'l';
		this.vAlign = notNull( setting.vAlign ) ? setting.vAlign :'t';
		
		this.widthWeight = notNull( setting.widthWeight ) ? setting.widthWeight :1;
		
		return this;
	}
		
	API.box.prototype.add = function( component ){
		this.components.push( component );
		return this;
	};
	
	API.box.prototype.setBorder = function( border ){
		this.border = border;
	};
	
	API.box.prototype.setHAlign = function( hAlign ){
		this.hAlign = hAlign;
	};

	API.box.prototype.setPadding = function( padding ){
		this.padding = padding;
	};

	API.box.prototype.getCol = function(){
		return this.components.length;
	};

	API.box.prototype.setPosition = function( x, y ){
		this.x = x;
		this.y = y;
	};
	
	API.box.prototype.getPosition = function(){
		var pos = {x:this.x,y:this.y};
		console.log(pos);
		return pos;
	};
	
	API.box.prototype.setWidth = function( width ){
		this.width = width;
		this.autoWidth = false;
	};
	
	API.box.prototype.setMaxWidth = function( maxwidth ){
		this.maxwidth = maxwidth;
	};
	

	API.box.prototype.setHeight = function( height ){
		this.height = height;
		this.autoHeight = false;
	};
	API.box.prototype.calculateSize = function(){
		
	};
	
	API.box.prototype.layout = function(){
		var len = this.components.length;
		
		if ( this.type === 'fixedCol' ){
			var totalWeight = 0;
			for ( var i = 0; i < len; i++ ){
				var component = this.components[i];
				totalWeight += component.widthWeight;
			}
			
			var weightWidth = (this.width - ( ( len + 1 ) * this.padding )) / totalWeight ;
			
			var maxHeight = 0;
			var currentWeight = 0;
			
			
			for ( var i = 0; i < len; i++ ){
				var component = this.components[i];
				var colWidth = component.widthWeight * weightWidth;
				component.width = colWidth;
				component.setMaxWidth( colWidth );
				var x = 0;
				
				if ( this.hAlign === 'l' ){
					x = this.padding * (i + 1) + weightWidth * currentWeight;
				}
				else if ( this.hAlign === 'r' ){
					x = this.width - this.padding * (i + 1) - weightWidth * currentWeight - component.width;
				}
				else if ( this.hAlign === 'm' ){
					x = this.width / 2 - component.width;
				}
				
				component.setPosition( x, this.padding );
				component.layout();
				if ( component.height > maxHeight ){
					maxHeight = component.height;
				}
				currentWeight += component.widthWeight;
			}
			
			
			if ( this.autoHeight ){
				this.height = maxHeight + this.padding * 2;
			}
		}
		else if ( this.type === 'col' ){
			var widthRemain = this.width - this.padding * 2;
			var maxHeight = 0;
			var rowHeight = 0;
			var singleLine = true;
			var currentX = 0;
			
			function resetX( self ){
				if ( self.hAlign === 'l' ){
					currentX = self.padding;
				}
				else if ( self.hAlign === 'r' ){
					currentX = self.width - self.padding;
				}
				else if ( self.hAlign === 'm' ){
					currentX = self.width / 2;
				}
			}
			
			function calX( self ){
				if ( self.hAlign === 'l' ){
					currentX += ( component.width + self.padding );
				}
				
				else if ( self.hAlign === 'r' ){
					currentX -= ( component.width + self.padding );
				}
			}
			
			resetX( this );
			
			
			var currentY = 0 + this.padding;
			for ( var i = 0; i < len; i++ ){
				var component = this.components[i];
				component.setMaxWidth( this.width - this.padding * 2 );
				component.layout();
				
				if ( component.width <= widthRemain ){
					
					if ( this.hAlign === 'l' ){
						component.setPosition( currentX, currentY );
					}
					else if ( this.hAlign === 'r' ){
						component.setPosition( currentX - component.width, currentY );
					}
					else if ( this.hAlign === 'm' ){
						component.setPosition( currentX - component.width/2, currentY );
					}
					
					widthRemain -= ( component.width + this.padding );
					calX( this );
				}
				else {
					resetX( this );
					
					currentY = currentY + rowHeight + this.padding;
					widthRemain = this.width - this.padding * 2;
					singleLine = false;
					maxHeight += rowHeight;
					rowHeight = 0;
					
					
					if ( this.hAlign === 'l' ){
						component.setPosition( currentX, currentY );
					}
					else if ( this.hAlign === 'r' ){
						component.setPosition( currentX - component.width, currentY );
					}
					else if ( this.hAlign === 'm' ){
						component.setPosition( currentX - component.width/2, currentY );
					}
					
					
					widthRemain -= ( component.width + this.padding );
					calX( this );
				}
				
				if ( component.height > rowHeight ){
					rowHeight = component.height;
				}
				
				component.layout();
			}
			
			maxHeight += rowHeight;
		
			
			if ( this.autoHeight ){
				this.height = maxHeight + this.padding * 2;
			}
		}
		
		
		else if ( this.type === 'row' ){
			
			var maxHeight = 0;
			var currentY = this.padding;
			
			
			
			for ( var i = 0; i < len; i++ ){
				var component = this.components[i];
				var currentX = 0;

				if ( this.hAlign === 'l' ){
					currentX = this.padding;
				}
				else if ( this.hAlign === 'r' ){
					currentX = this.width - this.padding;
				}
				else if ( this.hAlign === 'm' ){
					currentX = this.width / 2;
				}
				component.width = this.width - this.padding * 2;
				component.setMaxWidth( this.width - this.padding * 2 );
				component.layout();
				
				if ( this.hAlign === 'l' ){
					component.setPosition( currentX, currentY );
				}
				else if ( this.hAlign === 'r' ){
					component.setPosition( currentX - component.width, currentY );
				}
				else if ( this.hAlign === 'm' ){
					component.setPosition( currentX - component.width / 2, currentY );
				}
				
				currentY += component.height + this.padding;
				maxHeight += component.height + this.padding;
				
				
				
			}
			
			if ( this.autoHeight ){
				this.height = maxHeight + this.padding;
			}
		}
		else {
			
		}
	};
	
	API.box.prototype.report = function(){
		console.log(this);
		
	};
	
	API.box.prototype.getX = function(x){
		
		return x + this.x;
	};
	
	
	
	API.box.prototype.getY = function(y){
		if ( y + this.y + this.height - API.pageOffset > API.pageHeight ){
			API.addPage(y + this.y - 50);
		}
		return y + this.y - API.pageOffset;
	};

	API.box.prototype.draw = function(x, y){
		var thisx = x + this.x;
		var thisy = y + this.y;
		
		API.lineBox( x + this.x, y + this.y, this.width, this.height, 
				this.border||this.borderTop,
				this.border||this.borderBottom,
				this.border||this.borderLeft,
				this.border||this.borderRight, this.borderColor
				);
		var col = this.components.length;
		for ( var i = 0; i < col; i++ ){
			var component = this.components[i];
			component.draw( thisx, thisy );
		}
	};
	
	API.hSpace = function( width, setting ){
		if ( !setting ){ setting = {}; }
		API.box.call(this, setting);
		this.setPadding( 0 );
		this.setWidth( width );
	};
	
	API.hSpace.prototype = new API.box();
	
	API.vSpace = function( height, setting ){
		if ( !setting ){ setting = {}; }
		API.box.call(this, setting);
		this.setPadding( 0 );
		this.setHeight( height );
	};
	
	API.vSpace.prototype = new API.box();
	
	API.col = function( setting ){
		if ( !setting ){ setting = {}; }
		API.box.call(this, setting);
		this.type = 'col';
	};
	
	API.col.prototype = new API.box();
	
	API.row = function( setting ){
		if ( !setting ){ setting = {}; }
		API.box.call(this, setting);
		this.type = 'row';
	};
	
	API.row.prototype = new API.box();

	API.text = function( text,fontName,setting ){
		if ( !setting ){ setting = {}; }
		API.box.call(this,setting);
		
		if ( typeof text === 'number' ){
			text = text.toString();
		}
		this.text = text;
		this.type = 'text';
		this.fontSize = notNull( setting.fontSize ) ? setting.fontSize : 12;
		this.textColor = notNull( setting.textColor ) ? setting.textColor : {r:0,g:0,b:0};
		this.fontStyle = notNull( setting.fontStyle ) ? setting.fontStyle : 'normal';
		
		if ( fontName && API.fontMap[fontName] ){
			this.fontSize = API.fontMap[fontName].fontSize;
			this.textColor = API.fontMap[fontName].textColor;
			this.fontStyle = API.fontMap[fontName].fontStyle;
		}
		
	};
	API.text.prototype = new API.box();
	
	API.text.prototype.setFontSize = function( fontSize ){
		this.fontSize = fontSize;
		
	};
	
	API.text.prototype.setTextColor = function(r, g, b){
		this.textColor = {r:r,g:g,b:b};
	};
	
	API.text.prototype.layout = function(){
		
		if ( !notNull(this.text) || this.text === '' ){
			this.setHeight( 0 );
			this.width = 0;
			this.wrapped = false;
			return;
		}
		
		var originalFontSize = API.jsPdf.getFontSize();
		API.jsPdf.setFontSize( this.fontSize );
		if ( this.fontStyle ){
			API.jsPdf.setFontStyle(this.fontStyle);
		}
		var lineHeight = API.jsPdf.getLineHeight();
		this.wrapped = false;
		var widthWithoutWrap = API.jsPdf.getStringUnitWidth(this.text) * this.fontSize;
		
		
		if ( widthWithoutWrap < this.maxwidth ){
			this.width = widthWithoutWrap;
			this.setHeight( lineHeight * 1.2 );
		}
		else {
			
			this.width = this.maxwidth;
			var splitTitle = API.jsPdf.splitTextToSize(this.text, this.width);
			var lines = splitTitle.length;
			this.setHeight( lineHeight * ( lines + 0.2 ) );
			this.wrapped = true;
			
		}
		API.jsPdf.setFontSize( originalFontSize );
		
		

	};
	
	API.text.prototype.draw = function( x, y ){
		
		if ( !notNull(this.text) || this.text === '' ){
			return;
		}
		
		var maxHeight = 0;
		var originalFontSize = API.jsPdf.getFontSize();
		API.jsPdf.setFontSize( this.fontSize );
		var lineHeight = API.jsPdf.getLineHeight();
		
		var originalTextColor = API.jsPdf.getTextColor();
		var originalFontStyle = API.jsPdf.getFontStyle();
		if ( this.fontStyle ){
			API.jsPdf.setFontStyle(this.fontStyle);
		}
		if ( this.textColor ){
			API.jsPdf.setTextColor(this.textColor.r,this.textColor.g,this.textColor.b);
		}
		
		var newcolor = API.jsPdf.getTextColor();
		
		var splitTitle;
		if ( this.wrapped ){
			splitTitle = API.jsPdf.splitTextToSize(this.text, this.width);
		}
		else {
			splitTitle = this.text;
		}
		
		var thisx = this.getX(x);
		var thisy = this.getY(y + lineHeight);
		API.jsPdf.text(splitTitle, thisx, thisy );
		
		API.jsPdf.setFontSize( originalFontSize );
		API.jsPdf.setFontStyle( originalFontStyle );
		
		this.constructor.prototype.draw.call(this, x, y);
	};
	
	API.img = function( imgData, width, height, setting ){
		if ( !setting ){ setting = {}; }
		API.box.call(this,setting);
		this.imgData = imgData;
		this.type = 'img';
		this.imgWidth = width;
		this.imgHeight = height;
	};
	API.img.prototype = new API.box();
	
	API.img.prototype.layout = function(){
		this.width = this.imgWidth;
		this.height = this.imgHeight;
	};
	
	API.img.prototype.draw = function( x, y ){
		API.jsPdf.addImage(this.imgData, 'PNG', x + this.x, y + this.y - API.pageOffset, this.imgWidth, this.imgHeight);
	};
	
	
	API.lineBox = function( x, y, width, height, t, b, l, r, color ){
		
		if ( !color ){
			color = {};
			color.r = 0;
			color.b = 0;
			color.g = 0;
			color.a = 1;
		}
		
		API.jsPdf.setDrawColor(color.r,color.g,color.b,color.a);
		if ( t ){
			API.jsPdf.line(x, y - API.pageOffset, x + width, y - API.pageOffset);
		}
		if ( b ){
			API.jsPdf.line(x, y + height - API.pageOffset, x + width, y + height - API.pageOffset);
		}
		if ( l ){
			API.jsPdf.line(x, y - API.pageOffset, x, y + height - API.pageOffset);
		}
		if ( r ){
			API.jsPdf.line(x + width, y - API.pageOffset, x + width, y + height - API.pageOffset);
		}
	};
	
	
	API.pageBreak = function( setting ){
		if ( !setting ){ setting = {}; }
		API.box.call(this, setting);
		this.setPadding( 0 );
	};
	API.pageBreak.prototype = new API.box();
	
	API.pageBreak.prototype.draw = function( x, y ){
		API.addPage(y + this.y);
	};
	
	API.vSpace.prototype = new API.box();
	
	
	
	API.layout = function(){
		API.wholeComponent.layout();
		return API.wholeComponent;
	};
	
	API.draw = function(){
		API.wholeComponent.draw(0,0);
		
		
		return API.wholeComponent;
	};
	
	API.report = function(){
		API.wholeComponent.report();
	};
	
	
	API.init();
	return API;
};