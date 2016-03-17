'use strict';

var parser = typeof window === 'undefined' ? global.HTMLParser : window.HTMLParser;

class HTML2IncDom {
	/**
	 * Should convert the given html string to a function with calls to
	 * incremental dom methods.
	 * @param {string} html
	 * @return {!function()} Function with incremental dom calls for building
	 *     the given html string.
	 */
	static buildFn(html) {
		return () => HTML2IncDom.run(html);
	}

	/**
	 * Should convert the given html string to calls to incremental dom methods.
	 * @param {string} html
	 */
	static run(html) {
		parser(html, {
			start: function(tag, attrs, unary) {
				var fn = unary ? IncrementalDOM.elementVoid : IncrementalDOM.elementOpen;
				var args = [
					tag,
					null,
					[]
				];
				for (var i = 0; i < attrs.length; i++) {
					args.push(attrs[i].name, attrs[i].value);
				}
				fn.apply(null, args);
			},

			end: function(tag) {
				IncrementalDOM.elementClose(tag);
			},

			chars: function(text) {
				IncrementalDOM.text(text);
			}
		});
	}

	/**
	 * Changes the function that will be used to parse html strings. By default
	 * this will use the `HTMLParser` function from
	 * https://github.com/blowsie/Pure-JavaScript-HTML5-Parser. This will accept
	 * any function that follows that same api, basically accepting the html
	 * string and an object with `start`, `end` and `chars` functions to be called
	 * during the parsing.
	 * @param {!function(string, !Object} newParser 
	 */
	static setParser(newParser) {
		parser = newParser;
	}
}

export default HTML2IncDom;
