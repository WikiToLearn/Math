/*!
 * VisualEditor ContentEditable MWMathNode class.
 *
 * @copyright 2011-2015 VisualEditor Team and others; see AUTHORS.txt
 * @license The MIT License (MIT); see LICENSE.txt
 */

/*global MathJax, ve, OO */

/**
 * ContentEditable MediaWiki math node.
 *
 * @class
 * @extends ve.ce.MWInlineExtensionNode
 *
 * @constructor
 * @param {ve.dm.MWMathNode} model Model to observe
 * @param {Object} [config] Configuration options
 */
ve.ce.MWMathNode = function VeCeMWMathNode() {
	// Parent constructor
	ve.ce.MWMathNode.super.apply( this, arguments );
};

/* Inheritance */

OO.inheritClass( ve.ce.MWMathNode, ve.ce.MWInlineExtensionNode );

/* Static Properties */

ve.ce.MWMathNode.static.name = 'mwMath';

ve.ce.MWMathNode.static.primaryCommandName = 'math';

/* Methods */

/** */
ve.ce.MWMathNode.prototype.onSetup = function () {
	// Parent method
	ve.ce.MWMathNode.super.prototype.onSetup.call( this );

	// DOM changes
	this.$element.addClass( 've-ce-mwMathNode' );
};

/** */
ve.ce.MWMathNode.prototype.onParseSuccess = function ( deferred, response ) {
	var data = response.visualeditor, contentNodes = this.$( data.content ).get();
	if ( contentNodes[0] && contentNodes[0].childNodes ) {
		contentNodes = Array.prototype.slice.apply( contentNodes[0].childNodes );
	}
	deferred.resolve( contentNodes );
};

/** */
ve.ce.MWMathNode.prototype.afterRender = function () {
	var $img,
		node = this;

	if ( this.$element.is( 'span.tex' ) ) {
		// MathJax
		MathJax.Hub.Queue(
			[ 'Typeset', MathJax.Hub, this.$element[0] ],
			[ this, this.emit, 'rerender' ]
		);
	} else {
		$img = this.$element.filter( 'img.tex' );
		// Rerender after image load
		if ( $img.length ) {
			$img.on( 'load', function () {
				node.emit( 'rerender' );
			} );
		} else {
			// Passing an empty string returns no image, so rerender immediately
			this.emit( 'rerender' );
		}
	}
};

/* Registration */

ve.ce.nodeFactory.register( ve.ce.MWMathNode );
