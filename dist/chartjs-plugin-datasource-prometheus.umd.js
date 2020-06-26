(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('chart.js')) :
	typeof define === 'function' && define.amd ? define(['chart.js'], factory) :
	(global = global || self, global.ChartDatasourcePrometheusPlugin = factory(global.Chart));
}(this, (function (chart_js) { 'use strict';

	chart_js = chart_js && chart_js.hasOwnProperty('default') ? chart_js['default'] : chart_js;

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var prometheusQuery_umd = createCommonjsModule(function (module, exports) {
	(function (global, factory) {
	   module.exports = factory() ;
	}(commonjsGlobal, (function () {
	  var bind = function bind(fn, thisArg) {
	    return function wrap() {
	      var args = new Array(arguments.length);
	      for (var i = 0; i < args.length; i++) {
	        args[i] = arguments[i];
	      }
	      return fn.apply(thisArg, args);
	    };
	  };

	  /*global toString:true*/

	  // utils is a library of generic helper functions non-specific to axios

	  var toString = Object.prototype.toString;

	  /**
	   * Determine if a value is an Array
	   *
	   * @param {Object} val The value to test
	   * @returns {boolean} True if value is an Array, otherwise false
	   */
	  function isArray(val) {
	    return toString.call(val) === '[object Array]';
	  }

	  /**
	   * Determine if a value is undefined
	   *
	   * @param {Object} val The value to test
	   * @returns {boolean} True if the value is undefined, otherwise false
	   */
	  function isUndefined(val) {
	    return typeof val === 'undefined';
	  }

	  /**
	   * Determine if a value is a Buffer
	   *
	   * @param {Object} val The value to test
	   * @returns {boolean} True if value is a Buffer, otherwise false
	   */
	  function isBuffer(val) {
	    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
	      && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
	  }

	  /**
	   * Determine if a value is an ArrayBuffer
	   *
	   * @param {Object} val The value to test
	   * @returns {boolean} True if value is an ArrayBuffer, otherwise false
	   */
	  function isArrayBuffer(val) {
	    return toString.call(val) === '[object ArrayBuffer]';
	  }

	  /**
	   * Determine if a value is a FormData
	   *
	   * @param {Object} val The value to test
	   * @returns {boolean} True if value is an FormData, otherwise false
	   */
	  function isFormData(val) {
	    return (typeof FormData !== 'undefined') && (val instanceof FormData);
	  }

	  /**
	   * Determine if a value is a view on an ArrayBuffer
	   *
	   * @param {Object} val The value to test
	   * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
	   */
	  function isArrayBufferView(val) {
	    var result;
	    if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
	      result = ArrayBuffer.isView(val);
	    } else {
	      result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
	    }
	    return result;
	  }

	  /**
	   * Determine if a value is a String
	   *
	   * @param {Object} val The value to test
	   * @returns {boolean} True if value is a String, otherwise false
	   */
	  function isString(val) {
	    return typeof val === 'string';
	  }

	  /**
	   * Determine if a value is a Number
	   *
	   * @param {Object} val The value to test
	   * @returns {boolean} True if value is a Number, otherwise false
	   */
	  function isNumber(val) {
	    return typeof val === 'number';
	  }

	  /**
	   * Determine if a value is an Object
	   *
	   * @param {Object} val The value to test
	   * @returns {boolean} True if value is an Object, otherwise false
	   */
	  function isObject(val) {
	    return val !== null && typeof val === 'object';
	  }

	  /**
	   * Determine if a value is a Date
	   *
	   * @param {Object} val The value to test
	   * @returns {boolean} True if value is a Date, otherwise false
	   */
	  function isDate(val) {
	    return toString.call(val) === '[object Date]';
	  }

	  /**
	   * Determine if a value is a File
	   *
	   * @param {Object} val The value to test
	   * @returns {boolean} True if value is a File, otherwise false
	   */
	  function isFile(val) {
	    return toString.call(val) === '[object File]';
	  }

	  /**
	   * Determine if a value is a Blob
	   *
	   * @param {Object} val The value to test
	   * @returns {boolean} True if value is a Blob, otherwise false
	   */
	  function isBlob(val) {
	    return toString.call(val) === '[object Blob]';
	  }

	  /**
	   * Determine if a value is a Function
	   *
	   * @param {Object} val The value to test
	   * @returns {boolean} True if value is a Function, otherwise false
	   */
	  function isFunction(val) {
	    return toString.call(val) === '[object Function]';
	  }

	  /**
	   * Determine if a value is a Stream
	   *
	   * @param {Object} val The value to test
	   * @returns {boolean} True if value is a Stream, otherwise false
	   */
	  function isStream(val) {
	    return isObject(val) && isFunction(val.pipe);
	  }

	  /**
	   * Determine if a value is a URLSearchParams object
	   *
	   * @param {Object} val The value to test
	   * @returns {boolean} True if value is a URLSearchParams object, otherwise false
	   */
	  function isURLSearchParams(val) {
	    return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
	  }

	  /**
	   * Trim excess whitespace off the beginning and end of a string
	   *
	   * @param {String} str The String to trim
	   * @returns {String} The String freed of excess whitespace
	   */
	  function trim(str) {
	    return str.replace(/^\s*/, '').replace(/\s*$/, '');
	  }

	  /**
	   * Determine if we're running in a standard browser environment
	   *
	   * This allows axios to run in a web worker, and react-native.
	   * Both environments support XMLHttpRequest, but not fully standard globals.
	   *
	   * web workers:
	   *  typeof window -> undefined
	   *  typeof document -> undefined
	   *
	   * react-native:
	   *  navigator.product -> 'ReactNative'
	   * nativescript
	   *  navigator.product -> 'NativeScript' or 'NS'
	   */
	  function isStandardBrowserEnv() {
	    if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
	                                             navigator.product === 'NativeScript' ||
	                                             navigator.product === 'NS')) {
	      return false;
	    }
	    return (
	      typeof window !== 'undefined' &&
	      typeof document !== 'undefined'
	    );
	  }

	  /**
	   * Iterate over an Array or an Object invoking a function for each item.
	   *
	   * If `obj` is an Array callback will be called passing
	   * the value, index, and complete array for each item.
	   *
	   * If 'obj' is an Object callback will be called passing
	   * the value, key, and complete object for each property.
	   *
	   * @param {Object|Array} obj The object to iterate
	   * @param {Function} fn The callback to invoke for each item
	   */
	  function forEach(obj, fn) {
	    // Don't bother if no value provided
	    if (obj === null || typeof obj === 'undefined') {
	      return;
	    }

	    // Force an array if not already something iterable
	    if (typeof obj !== 'object') {
	      /*eslint no-param-reassign:0*/
	      obj = [obj];
	    }

	    if (isArray(obj)) {
	      // Iterate over array values
	      for (var i = 0, l = obj.length; i < l; i++) {
	        fn.call(null, obj[i], i, obj);
	      }
	    } else {
	      // Iterate over object keys
	      for (var key in obj) {
	        if (Object.prototype.hasOwnProperty.call(obj, key)) {
	          fn.call(null, obj[key], key, obj);
	        }
	      }
	    }
	  }

	  /**
	   * Accepts varargs expecting each argument to be an object, then
	   * immutably merges the properties of each object and returns result.
	   *
	   * When multiple objects contain the same key the later object in
	   * the arguments list will take precedence.
	   *
	   * Example:
	   *
	   * ```js
	   * var result = merge({foo: 123}, {foo: 456});
	   * console.log(result.foo); // outputs 456
	   * ```
	   *
	   * @param {Object} obj1 Object to merge
	   * @returns {Object} Result of all merge properties
	   */
	  function merge(/* obj1, obj2, obj3, ... */) {
	    var result = {};
	    function assignValue(val, key) {
	      if (typeof result[key] === 'object' && typeof val === 'object') {
	        result[key] = merge(result[key], val);
	      } else {
	        result[key] = val;
	      }
	    }

	    for (var i = 0, l = arguments.length; i < l; i++) {
	      forEach(arguments[i], assignValue);
	    }
	    return result;
	  }

	  /**
	   * Function equal to merge with the difference being that no reference
	   * to original objects is kept.
	   *
	   * @see merge
	   * @param {Object} obj1 Object to merge
	   * @returns {Object} Result of all merge properties
	   */
	  function deepMerge(/* obj1, obj2, obj3, ... */) {
	    var result = {};
	    function assignValue(val, key) {
	      if (typeof result[key] === 'object' && typeof val === 'object') {
	        result[key] = deepMerge(result[key], val);
	      } else if (typeof val === 'object') {
	        result[key] = deepMerge({}, val);
	      } else {
	        result[key] = val;
	      }
	    }

	    for (var i = 0, l = arguments.length; i < l; i++) {
	      forEach(arguments[i], assignValue);
	    }
	    return result;
	  }

	  /**
	   * Extends object a by mutably adding to it the properties of object b.
	   *
	   * @param {Object} a The object to be extended
	   * @param {Object} b The object to copy properties from
	   * @param {Object} thisArg The object to bind function to
	   * @return {Object} The resulting value of object a
	   */
	  function extend(a, b, thisArg) {
	    forEach(b, function assignValue(val, key) {
	      if (thisArg && typeof val === 'function') {
	        a[key] = bind(val, thisArg);
	      } else {
	        a[key] = val;
	      }
	    });
	    return a;
	  }

	  var utils = {
	    isArray: isArray,
	    isArrayBuffer: isArrayBuffer,
	    isBuffer: isBuffer,
	    isFormData: isFormData,
	    isArrayBufferView: isArrayBufferView,
	    isString: isString,
	    isNumber: isNumber,
	    isObject: isObject,
	    isUndefined: isUndefined,
	    isDate: isDate,
	    isFile: isFile,
	    isBlob: isBlob,
	    isFunction: isFunction,
	    isStream: isStream,
	    isURLSearchParams: isURLSearchParams,
	    isStandardBrowserEnv: isStandardBrowserEnv,
	    forEach: forEach,
	    merge: merge,
	    deepMerge: deepMerge,
	    extend: extend,
	    trim: trim
	  };

	  function encode(val) {
	    return encodeURIComponent(val).
	      replace(/%40/gi, '@').
	      replace(/%3A/gi, ':').
	      replace(/%24/g, '$').
	      replace(/%2C/gi, ',').
	      replace(/%20/g, '+').
	      replace(/%5B/gi, '[').
	      replace(/%5D/gi, ']');
	  }

	  /**
	   * Build a URL by appending params to the end
	   *
	   * @param {string} url The base of the url (e.g., http://www.google.com)
	   * @param {object} [params] The params to be appended
	   * @returns {string} The formatted url
	   */
	  var buildURL = function buildURL(url, params, paramsSerializer) {
	    /*eslint no-param-reassign:0*/
	    if (!params) {
	      return url;
	    }

	    var serializedParams;
	    if (paramsSerializer) {
	      serializedParams = paramsSerializer(params);
	    } else if (utils.isURLSearchParams(params)) {
	      serializedParams = params.toString();
	    } else {
	      var parts = [];

	      utils.forEach(params, function serialize(val, key) {
	        if (val === null || typeof val === 'undefined') {
	          return;
	        }

	        if (utils.isArray(val)) {
	          key = key + '[]';
	        } else {
	          val = [val];
	        }

	        utils.forEach(val, function parseValue(v) {
	          if (utils.isDate(v)) {
	            v = v.toISOString();
	          } else if (utils.isObject(v)) {
	            v = JSON.stringify(v);
	          }
	          parts.push(encode(key) + '=' + encode(v));
	        });
	      });

	      serializedParams = parts.join('&');
	    }

	    if (serializedParams) {
	      var hashmarkIndex = url.indexOf('#');
	      if (hashmarkIndex !== -1) {
	        url = url.slice(0, hashmarkIndex);
	      }

	      url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
	    }

	    return url;
	  };

	  function InterceptorManager() {
	    this.handlers = [];
	  }

	  /**
	   * Add a new interceptor to the stack
	   *
	   * @param {Function} fulfilled The function to handle `then` for a `Promise`
	   * @param {Function} rejected The function to handle `reject` for a `Promise`
	   *
	   * @return {Number} An ID used to remove interceptor later
	   */
	  InterceptorManager.prototype.use = function use(fulfilled, rejected) {
	    this.handlers.push({
	      fulfilled: fulfilled,
	      rejected: rejected
	    });
	    return this.handlers.length - 1;
	  };

	  /**
	   * Remove an interceptor from the stack
	   *
	   * @param {Number} id The ID that was returned by `use`
	   */
	  InterceptorManager.prototype.eject = function eject(id) {
	    if (this.handlers[id]) {
	      this.handlers[id] = null;
	    }
	  };

	  /**
	   * Iterate over all the registered interceptors
	   *
	   * This method is particularly useful for skipping over any
	   * interceptors that may have become `null` calling `eject`.
	   *
	   * @param {Function} fn The function to call for each interceptor
	   */
	  InterceptorManager.prototype.forEach = function forEach(fn) {
	    utils.forEach(this.handlers, function forEachHandler(h) {
	      if (h !== null) {
	        fn(h);
	      }
	    });
	  };

	  var InterceptorManager_1 = InterceptorManager;

	  /**
	   * Transform the data for a request or a response
	   *
	   * @param {Object|String} data The data to be transformed
	   * @param {Array} headers The headers for the request or response
	   * @param {Array|Function} fns A single function or Array of functions
	   * @returns {*} The resulting transformed data
	   */
	  var transformData = function transformData(data, headers, fns) {
	    /*eslint no-param-reassign:0*/
	    utils.forEach(fns, function transform(fn) {
	      data = fn(data, headers);
	    });

	    return data;
	  };

	  var isCancel = function isCancel(value) {
	    return !!(value && value.__CANCEL__);
	  };

	  var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
	    utils.forEach(headers, function processHeader(value, name) {
	      if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
	        headers[normalizedName] = value;
	        delete headers[name];
	      }
	    });
	  };

	  /**
	   * Update an Error with the specified config, error code, and response.
	   *
	   * @param {Error} error The error to update.
	   * @param {Object} config The config.
	   * @param {string} [code] The error code (for example, 'ECONNABORTED').
	   * @param {Object} [request] The request.
	   * @param {Object} [response] The response.
	   * @returns {Error} The error.
	   */
	  var enhanceError = function enhanceError(error, config, code, request, response) {
	    error.config = config;
	    if (code) {
	      error.code = code;
	    }

	    error.request = request;
	    error.response = response;
	    error.isAxiosError = true;

	    error.toJSON = function() {
	      return {
	        // Standard
	        message: this.message,
	        name: this.name,
	        // Microsoft
	        description: this.description,
	        number: this.number,
	        // Mozilla
	        fileName: this.fileName,
	        lineNumber: this.lineNumber,
	        columnNumber: this.columnNumber,
	        stack: this.stack,
	        // Axios
	        config: this.config,
	        code: this.code
	      };
	    };
	    return error;
	  };

	  /**
	   * Create an Error with the specified message, config, error code, request and response.
	   *
	   * @param {string} message The error message.
	   * @param {Object} config The config.
	   * @param {string} [code] The error code (for example, 'ECONNABORTED').
	   * @param {Object} [request] The request.
	   * @param {Object} [response] The response.
	   * @returns {Error} The created error.
	   */
	  var createError = function createError(message, config, code, request, response) {
	    var error = new Error(message);
	    return enhanceError(error, config, code, request, response);
	  };

	  /**
	   * Resolve or reject a Promise based on response status.
	   *
	   * @param {Function} resolve A function that resolves the promise.
	   * @param {Function} reject A function that rejects the promise.
	   * @param {object} response The response.
	   */
	  var settle = function settle(resolve, reject, response) {
	    var validateStatus = response.config.validateStatus;
	    if (!validateStatus || validateStatus(response.status)) {
	      resolve(response);
	    } else {
	      reject(createError(
	        'Request failed with status code ' + response.status,
	        response.config,
	        null,
	        response.request,
	        response
	      ));
	    }
	  };

	  /**
	   * Determines whether the specified URL is absolute
	   *
	   * @param {string} url The URL to test
	   * @returns {boolean} True if the specified URL is absolute, otherwise false
	   */
	  var isAbsoluteURL = function isAbsoluteURL(url) {
	    // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
	    // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
	    // by any combination of letters, digits, plus, period, or hyphen.
	    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
	  };

	  /**
	   * Creates a new URL by combining the specified URLs
	   *
	   * @param {string} baseURL The base URL
	   * @param {string} relativeURL The relative URL
	   * @returns {string} The combined URL
	   */
	  var combineURLs = function combineURLs(baseURL, relativeURL) {
	    return relativeURL
	      ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
	      : baseURL;
	  };

	  /**
	   * Creates a new URL by combining the baseURL with the requestedURL,
	   * only when the requestedURL is not already an absolute URL.
	   * If the requestURL is absolute, this function returns the requestedURL untouched.
	   *
	   * @param {string} baseURL The base URL
	   * @param {string} requestedURL Absolute or relative URL to combine
	   * @returns {string} The combined full path
	   */
	  var buildFullPath = function buildFullPath(baseURL, requestedURL) {
	    if (baseURL && !isAbsoluteURL(requestedURL)) {
	      return combineURLs(baseURL, requestedURL);
	    }
	    return requestedURL;
	  };

	  // Headers whose duplicates are ignored by node
	  // c.f. https://nodejs.org/api/http.html#http_message_headers
	  var ignoreDuplicateOf = [
	    'age', 'authorization', 'content-length', 'content-type', 'etag',
	    'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
	    'last-modified', 'location', 'max-forwards', 'proxy-authorization',
	    'referer', 'retry-after', 'user-agent'
	  ];

	  /**
	   * Parse headers into an object
	   *
	   * ```
	   * Date: Wed, 27 Aug 2014 08:58:49 GMT
	   * Content-Type: application/json
	   * Connection: keep-alive
	   * Transfer-Encoding: chunked
	   * ```
	   *
	   * @param {String} headers Headers needing to be parsed
	   * @returns {Object} Headers parsed into an object
	   */
	  var parseHeaders = function parseHeaders(headers) {
	    var parsed = {};
	    var key;
	    var val;
	    var i;

	    if (!headers) { return parsed; }

	    utils.forEach(headers.split('\n'), function parser(line) {
	      i = line.indexOf(':');
	      key = utils.trim(line.substr(0, i)).toLowerCase();
	      val = utils.trim(line.substr(i + 1));

	      if (key) {
	        if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
	          return;
	        }
	        if (key === 'set-cookie') {
	          parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
	        } else {
	          parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
	        }
	      }
	    });

	    return parsed;
	  };

	  var isURLSameOrigin = (
	    utils.isStandardBrowserEnv() ?

	    // Standard browser envs have full support of the APIs needed to test
	    // whether the request URL is of the same origin as current location.
	      (function standardBrowserEnv() {
	        var msie = /(msie|trident)/i.test(navigator.userAgent);
	        var urlParsingNode = document.createElement('a');
	        var originURL;

	        /**
	      * Parse a URL to discover it's components
	      *
	      * @param {String} url The URL to be parsed
	      * @returns {Object}
	      */
	        function resolveURL(url) {
	          var href = url;

	          if (msie) {
	          // IE needs attribute set twice to normalize properties
	            urlParsingNode.setAttribute('href', href);
	            href = urlParsingNode.href;
	          }

	          urlParsingNode.setAttribute('href', href);

	          // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
	          return {
	            href: urlParsingNode.href,
	            protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
	            host: urlParsingNode.host,
	            search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
	            hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
	            hostname: urlParsingNode.hostname,
	            port: urlParsingNode.port,
	            pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
	              urlParsingNode.pathname :
	              '/' + urlParsingNode.pathname
	          };
	        }

	        originURL = resolveURL(window.location.href);

	        /**
	      * Determine if a URL shares the same origin as the current location
	      *
	      * @param {String} requestURL The URL to test
	      * @returns {boolean} True if URL shares the same origin, otherwise false
	      */
	        return function isURLSameOrigin(requestURL) {
	          var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
	          return (parsed.protocol === originURL.protocol &&
	              parsed.host === originURL.host);
	        };
	      })() :

	    // Non standard browser envs (web workers, react-native) lack needed support.
	      (function nonStandardBrowserEnv() {
	        return function isURLSameOrigin() {
	          return true;
	        };
	      })()
	  );

	  var cookies = (
	    utils.isStandardBrowserEnv() ?

	    // Standard browser envs support document.cookie
	      (function standardBrowserEnv() {
	        return {
	          write: function write(name, value, expires, path, domain, secure) {
	            var cookie = [];
	            cookie.push(name + '=' + encodeURIComponent(value));

	            if (utils.isNumber(expires)) {
	              cookie.push('expires=' + new Date(expires).toGMTString());
	            }

	            if (utils.isString(path)) {
	              cookie.push('path=' + path);
	            }

	            if (utils.isString(domain)) {
	              cookie.push('domain=' + domain);
	            }

	            if (secure === true) {
	              cookie.push('secure');
	            }

	            document.cookie = cookie.join('; ');
	          },

	          read: function read(name) {
	            var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
	            return (match ? decodeURIComponent(match[3]) : null);
	          },

	          remove: function remove(name) {
	            this.write(name, '', Date.now() - 86400000);
	          }
	        };
	      })() :

	    // Non standard browser env (web workers, react-native) lack needed support.
	      (function nonStandardBrowserEnv() {
	        return {
	          write: function write() {},
	          read: function read() { return null; },
	          remove: function remove() {}
	        };
	      })()
	  );

	  var xhr = function xhrAdapter(config) {
	    return new Promise(function dispatchXhrRequest(resolve, reject) {
	      var requestData = config.data;
	      var requestHeaders = config.headers;

	      if (utils.isFormData(requestData)) {
	        delete requestHeaders['Content-Type']; // Let the browser set it
	      }

	      var request = new XMLHttpRequest();

	      // HTTP basic authentication
	      if (config.auth) {
	        var username = config.auth.username || '';
	        var password = config.auth.password || '';
	        requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
	      }

	      var fullPath = buildFullPath(config.baseURL, config.url);
	      request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

	      // Set the request timeout in MS
	      request.timeout = config.timeout;

	      // Listen for ready state
	      request.onreadystatechange = function handleLoad() {
	        if (!request || request.readyState !== 4) {
	          return;
	        }

	        // The request errored out and we didn't get a response, this will be
	        // handled by onerror instead
	        // With one exception: request that using file: protocol, most browsers
	        // will return status as 0 even though it's a successful request
	        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
	          return;
	        }

	        // Prepare the response
	        var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
	        var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
	        var response = {
	          data: responseData,
	          status: request.status,
	          statusText: request.statusText,
	          headers: responseHeaders,
	          config: config,
	          request: request
	        };

	        settle(resolve, reject, response);

	        // Clean up request
	        request = null;
	      };

	      // Handle browser request cancellation (as opposed to a manual cancellation)
	      request.onabort = function handleAbort() {
	        if (!request) {
	          return;
	        }

	        reject(createError('Request aborted', config, 'ECONNABORTED', request));

	        // Clean up request
	        request = null;
	      };

	      // Handle low level network errors
	      request.onerror = function handleError() {
	        // Real errors are hidden from us by the browser
	        // onerror should only fire if it's a network error
	        reject(createError('Network Error', config, null, request));

	        // Clean up request
	        request = null;
	      };

	      // Handle timeout
	      request.ontimeout = function handleTimeout() {
	        var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
	        if (config.timeoutErrorMessage) {
	          timeoutErrorMessage = config.timeoutErrorMessage;
	        }
	        reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
	          request));

	        // Clean up request
	        request = null;
	      };

	      // Add xsrf header
	      // This is only done if running in a standard browser environment.
	      // Specifically not if we're in a web worker, or react-native.
	      if (utils.isStandardBrowserEnv()) {
	        var cookies$1 = cookies;

	        // Add xsrf header
	        var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
	          cookies$1.read(config.xsrfCookieName) :
	          undefined;

	        if (xsrfValue) {
	          requestHeaders[config.xsrfHeaderName] = xsrfValue;
	        }
	      }

	      // Add headers to the request
	      if ('setRequestHeader' in request) {
	        utils.forEach(requestHeaders, function setRequestHeader(val, key) {
	          if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
	            // Remove Content-Type if data is undefined
	            delete requestHeaders[key];
	          } else {
	            // Otherwise add header to the request
	            request.setRequestHeader(key, val);
	          }
	        });
	      }

	      // Add withCredentials to request if needed
	      if (!utils.isUndefined(config.withCredentials)) {
	        request.withCredentials = !!config.withCredentials;
	      }

	      // Add responseType to request if needed
	      if (config.responseType) {
	        try {
	          request.responseType = config.responseType;
	        } catch (e) {
	          // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
	          // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
	          if (config.responseType !== 'json') {
	            throw e;
	          }
	        }
	      }

	      // Handle progress if needed
	      if (typeof config.onDownloadProgress === 'function') {
	        request.addEventListener('progress', config.onDownloadProgress);
	      }

	      // Not all browsers support upload events
	      if (typeof config.onUploadProgress === 'function' && request.upload) {
	        request.upload.addEventListener('progress', config.onUploadProgress);
	      }

	      if (config.cancelToken) {
	        // Handle cancellation
	        config.cancelToken.promise.then(function onCanceled(cancel) {
	          if (!request) {
	            return;
	          }

	          request.abort();
	          reject(cancel);
	          // Clean up request
	          request = null;
	        });
	      }

	      if (requestData === undefined) {
	        requestData = null;
	      }

	      // Send the request
	      request.send(requestData);
	    });
	  };

	  var DEFAULT_CONTENT_TYPE = {
	    'Content-Type': 'application/x-www-form-urlencoded'
	  };

	  function setContentTypeIfUnset(headers, value) {
	    if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
	      headers['Content-Type'] = value;
	    }
	  }

	  function getDefaultAdapter() {
	    var adapter;
	    if (typeof XMLHttpRequest !== 'undefined') {
	      // For browsers use XHR adapter
	      adapter = xhr;
	    } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
	      // For node use HTTP adapter
	      adapter = xhr;
	    }
	    return adapter;
	  }

	  var defaults = {
	    adapter: getDefaultAdapter(),

	    transformRequest: [function transformRequest(data, headers) {
	      normalizeHeaderName(headers, 'Accept');
	      normalizeHeaderName(headers, 'Content-Type');
	      if (utils.isFormData(data) ||
	        utils.isArrayBuffer(data) ||
	        utils.isBuffer(data) ||
	        utils.isStream(data) ||
	        utils.isFile(data) ||
	        utils.isBlob(data)
	      ) {
	        return data;
	      }
	      if (utils.isArrayBufferView(data)) {
	        return data.buffer;
	      }
	      if (utils.isURLSearchParams(data)) {
	        setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
	        return data.toString();
	      }
	      if (utils.isObject(data)) {
	        setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
	        return JSON.stringify(data);
	      }
	      return data;
	    }],

	    transformResponse: [function transformResponse(data) {
	      /*eslint no-param-reassign:0*/
	      if (typeof data === 'string') {
	        try {
	          data = JSON.parse(data);
	        } catch (e) { /* Ignore */ }
	      }
	      return data;
	    }],

	    /**
	     * A timeout in milliseconds to abort a request. If set to 0 (default) a
	     * timeout is not created.
	     */
	    timeout: 0,

	    xsrfCookieName: 'XSRF-TOKEN',
	    xsrfHeaderName: 'X-XSRF-TOKEN',

	    maxContentLength: -1,

	    validateStatus: function validateStatus(status) {
	      return status >= 200 && status < 300;
	    }
	  };

	  defaults.headers = {
	    common: {
	      'Accept': 'application/json, text/plain, */*'
	    }
	  };

	  utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
	    defaults.headers[method] = {};
	  });

	  utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	    defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
	  });

	  var defaults_1 = defaults;

	  /**
	   * Throws a `Cancel` if cancellation has been requested.
	   */
	  function throwIfCancellationRequested(config) {
	    if (config.cancelToken) {
	      config.cancelToken.throwIfRequested();
	    }
	  }

	  /**
	   * Dispatch a request to the server using the configured adapter.
	   *
	   * @param {object} config The config that is to be used for the request
	   * @returns {Promise} The Promise to be fulfilled
	   */
	  var dispatchRequest = function dispatchRequest(config) {
	    throwIfCancellationRequested(config);

	    // Ensure headers exist
	    config.headers = config.headers || {};

	    // Transform request data
	    config.data = transformData(
	      config.data,
	      config.headers,
	      config.transformRequest
	    );

	    // Flatten headers
	    config.headers = utils.merge(
	      config.headers.common || {},
	      config.headers[config.method] || {},
	      config.headers
	    );

	    utils.forEach(
	      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
	      function cleanHeaderConfig(method) {
	        delete config.headers[method];
	      }
	    );

	    var adapter = config.adapter || defaults_1.adapter;

	    return adapter(config).then(function onAdapterResolution(response) {
	      throwIfCancellationRequested(config);

	      // Transform response data
	      response.data = transformData(
	        response.data,
	        response.headers,
	        config.transformResponse
	      );

	      return response;
	    }, function onAdapterRejection(reason) {
	      if (!isCancel(reason)) {
	        throwIfCancellationRequested(config);

	        // Transform response data
	        if (reason && reason.response) {
	          reason.response.data = transformData(
	            reason.response.data,
	            reason.response.headers,
	            config.transformResponse
	          );
	        }
	      }

	      return Promise.reject(reason);
	    });
	  };

	  /**
	   * Config-specific merge-function which creates a new config-object
	   * by merging two configuration objects together.
	   *
	   * @param {Object} config1
	   * @param {Object} config2
	   * @returns {Object} New object resulting from merging config2 to config1
	   */
	  var mergeConfig = function mergeConfig(config1, config2) {
	    // eslint-disable-next-line no-param-reassign
	    config2 = config2 || {};
	    var config = {};

	    var valueFromConfig2Keys = ['url', 'method', 'params', 'data'];
	    var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy'];
	    var defaultToConfig2Keys = [
	      'baseURL', 'url', 'transformRequest', 'transformResponse', 'paramsSerializer',
	      'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
	      'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress',
	      'maxContentLength', 'validateStatus', 'maxRedirects', 'httpAgent',
	      'httpsAgent', 'cancelToken', 'socketPath'
	    ];

	    utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
	      if (typeof config2[prop] !== 'undefined') {
	        config[prop] = config2[prop];
	      }
	    });

	    utils.forEach(mergeDeepPropertiesKeys, function mergeDeepProperties(prop) {
	      if (utils.isObject(config2[prop])) {
	        config[prop] = utils.deepMerge(config1[prop], config2[prop]);
	      } else if (typeof config2[prop] !== 'undefined') {
	        config[prop] = config2[prop];
	      } else if (utils.isObject(config1[prop])) {
	        config[prop] = utils.deepMerge(config1[prop]);
	      } else if (typeof config1[prop] !== 'undefined') {
	        config[prop] = config1[prop];
	      }
	    });

	    utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
	      if (typeof config2[prop] !== 'undefined') {
	        config[prop] = config2[prop];
	      } else if (typeof config1[prop] !== 'undefined') {
	        config[prop] = config1[prop];
	      }
	    });

	    var axiosKeys = valueFromConfig2Keys
	      .concat(mergeDeepPropertiesKeys)
	      .concat(defaultToConfig2Keys);

	    var otherKeys = Object
	      .keys(config2)
	      .filter(function filterAxiosKeys(key) {
	        return axiosKeys.indexOf(key) === -1;
	      });

	    utils.forEach(otherKeys, function otherKeysDefaultToConfig2(prop) {
	      if (typeof config2[prop] !== 'undefined') {
	        config[prop] = config2[prop];
	      } else if (typeof config1[prop] !== 'undefined') {
	        config[prop] = config1[prop];
	      }
	    });

	    return config;
	  };

	  /**
	   * Create a new instance of Axios
	   *
	   * @param {Object} instanceConfig The default config for the instance
	   */
	  function Axios(instanceConfig) {
	    this.defaults = instanceConfig;
	    this.interceptors = {
	      request: new InterceptorManager_1(),
	      response: new InterceptorManager_1()
	    };
	  }

	  /**
	   * Dispatch a request
	   *
	   * @param {Object} config The config specific for this request (merged with this.defaults)
	   */
	  Axios.prototype.request = function request(config) {
	    /*eslint no-param-reassign:0*/
	    // Allow for axios('example/url'[, config]) a la fetch API
	    if (typeof config === 'string') {
	      config = arguments[1] || {};
	      config.url = arguments[0];
	    } else {
	      config = config || {};
	    }

	    config = mergeConfig(this.defaults, config);

	    // Set config.method
	    if (config.method) {
	      config.method = config.method.toLowerCase();
	    } else if (this.defaults.method) {
	      config.method = this.defaults.method.toLowerCase();
	    } else {
	      config.method = 'get';
	    }

	    // Hook up interceptors middleware
	    var chain = [dispatchRequest, undefined];
	    var promise = Promise.resolve(config);

	    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
	      chain.unshift(interceptor.fulfilled, interceptor.rejected);
	    });

	    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
	      chain.push(interceptor.fulfilled, interceptor.rejected);
	    });

	    while (chain.length) {
	      promise = promise.then(chain.shift(), chain.shift());
	    }

	    return promise;
	  };

	  Axios.prototype.getUri = function getUri(config) {
	    config = mergeConfig(this.defaults, config);
	    return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
	  };

	  // Provide aliases for supported request methods
	  utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
	    /*eslint func-names:0*/
	    Axios.prototype[method] = function(url, config) {
	      return this.request(utils.merge(config || {}, {
	        method: method,
	        url: url
	      }));
	    };
	  });

	  utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	    /*eslint func-names:0*/
	    Axios.prototype[method] = function(url, data, config) {
	      return this.request(utils.merge(config || {}, {
	        method: method,
	        url: url,
	        data: data
	      }));
	    };
	  });

	  var Axios_1 = Axios;

	  /**
	   * A `Cancel` is an object that is thrown when an operation is canceled.
	   *
	   * @class
	   * @param {string=} message The message.
	   */
	  function Cancel(message) {
	    this.message = message;
	  }

	  Cancel.prototype.toString = function toString() {
	    return 'Cancel' + (this.message ? ': ' + this.message : '');
	  };

	  Cancel.prototype.__CANCEL__ = true;

	  var Cancel_1 = Cancel;

	  /**
	   * A `CancelToken` is an object that can be used to request cancellation of an operation.
	   *
	   * @class
	   * @param {Function} executor The executor function.
	   */
	  function CancelToken(executor) {
	    if (typeof executor !== 'function') {
	      throw new TypeError('executor must be a function.');
	    }

	    var resolvePromise;
	    this.promise = new Promise(function promiseExecutor(resolve) {
	      resolvePromise = resolve;
	    });

	    var token = this;
	    executor(function cancel(message) {
	      if (token.reason) {
	        // Cancellation has already been requested
	        return;
	      }

	      token.reason = new Cancel_1(message);
	      resolvePromise(token.reason);
	    });
	  }

	  /**
	   * Throws a `Cancel` if cancellation has been requested.
	   */
	  CancelToken.prototype.throwIfRequested = function throwIfRequested() {
	    if (this.reason) {
	      throw this.reason;
	    }
	  };

	  /**
	   * Returns an object that contains a new `CancelToken` and a function that, when called,
	   * cancels the `CancelToken`.
	   */
	  CancelToken.source = function source() {
	    var cancel;
	    var token = new CancelToken(function executor(c) {
	      cancel = c;
	    });
	    return {
	      token: token,
	      cancel: cancel
	    };
	  };

	  var CancelToken_1 = CancelToken;

	  /**
	   * Syntactic sugar for invoking a function and expanding an array for arguments.
	   *
	   * Common use case would be to use `Function.prototype.apply`.
	   *
	   *  ```js
	   *  function f(x, y, z) {}
	   *  var args = [1, 2, 3];
	   *  f.apply(null, args);
	   *  ```
	   *
	   * With `spread` this example can be re-written.
	   *
	   *  ```js
	   *  spread(function(x, y, z) {})([1, 2, 3]);
	   *  ```
	   *
	   * @param {Function} callback
	   * @returns {Function}
	   */
	  var spread = function spread(callback) {
	    return function wrap(arr) {
	      return callback.apply(null, arr);
	    };
	  };

	  /**
	   * Create an instance of Axios
	   *
	   * @param {Object} defaultConfig The default config for the instance
	   * @return {Axios} A new instance of Axios
	   */
	  function createInstance(defaultConfig) {
	    var context = new Axios_1(defaultConfig);
	    var instance = bind(Axios_1.prototype.request, context);

	    // Copy axios.prototype to instance
	    utils.extend(instance, Axios_1.prototype, context);

	    // Copy context to instance
	    utils.extend(instance, context);

	    return instance;
	  }

	  // Create the default instance to be exported
	  var axios = createInstance(defaults_1);

	  // Expose Axios class to allow class inheritance
	  axios.Axios = Axios_1;

	  // Factory for creating new instances
	  axios.create = function create(instanceConfig) {
	    return createInstance(mergeConfig(axios.defaults, instanceConfig));
	  };

	  // Expose Cancel & CancelToken
	  axios.Cancel = Cancel_1;
	  axios.CancelToken = CancelToken_1;
	  axios.isCancel = isCancel;

	  // Expose all/spread
	  axios.all = function all(promises) {
	    return Promise.all(promises);
	  };
	  axios.spread = spread;

	  var axios_1 = axios;

	  // Allow use of default import syntax in TypeScript
	  var default_1 = axios;
	  axios_1.default = default_1;

	  var axios$1 = axios_1;

	  // https://prometheus.io/docs/prometheus/latest/querying/api/#expression-query-result-formats

	  class ResponseType {
	      static get MATRIX() {
	          return "matrix";
	      }

	      static get VECTOR() {
	          return "vector";
	      }

	      static get SCALAR() {
	          return "scalar";
	      }

	      static get STRING() {
	          return "string";
	      }
	  }

	  class Metric {

	      constructor(name, labels) {
	          if (!!name && typeof (name) != 'string')
	              throw new Error("Wrong name format. Expected string.");
	          if (!!labels && typeof (labels) != 'object')
	              throw new Error("Wrong labels format. Expected object.");

	          this.name = name;
	          this.labels = labels;
	      }

	      static fromJSON(obj) {
	          const name = obj['__name__'];
	          const labels = Object.assign({}, obj);
	          delete labels['__name__'];

	          return new Metric(name, labels);
	      }

	      toString() {
	          const strName = !!this.name ? this.name : '';
	          const strLabels = Object.keys(this.labels).map((curr) => curr + '="' + this.labels[curr] + '"');
	          return strName + '{' + strLabels.join(', ') + '}';
	      }

	  }

	  class SampleValue {

	      constructor(unixTime, sampleValue) {
	          if (typeof (unixTime) != 'object' || unixTime.constructor.name != 'Date')
	              throw new Error("Wrong time format. Expected Date.");
	          if (typeof (sampleValue) != 'number')
	              throw new Error("Wrong value format. Expected float.");

	          this.time = unixTime;
	          this.value = sampleValue;
	      }

	      static fromJSON(arr) {
	          const unixTime = new Date(arr[0] * 1000);
	          const sampleValue = parseFloat(arr[1]);

	          return new SampleValue(unixTime, sampleValue);
	      }

	      toString() {
	          return this.time + ': ' + this.value;
	      }

	  }

	  class RangeVector {

	      constructor(metric, values) {
	          this.metric = metric;
	          this.values = values;
	      }

	      static fromJSON(obj) {
	          const metric = !!obj['metric'] ? Metric.fromJSON(obj['metric']) : null;
	          const values = obj['values'].map(SampleValue.fromJSON);
	          return new RangeVector(metric, values);
	      }

	  }
	  class InstantVector {

	      constructor(metric, value) {
	          this.metric = metric;
	          this.value = value;
	      }

	      static fromJSON(obj) {
	          const metric = !!obj['metric'] ? Metric.fromJSON(obj['metric']) : null;
	          const value = SampleValue.fromJSON(obj['value']);
	          return new InstantVector(metric, value);
	      }

	  }
	  class QueryResult {

	      constructor(resultType, result) {
	          this.resultType = resultType;
	          this.result = result;
	      }

	      static fromJSON(data) {
	          const resultType = data['resultType'];
	          let result = null;

	          switch (resultType) {
	              case ResponseType.MATRIX:
	                  result = data['result'].map(RangeVector.fromJSON);
	                  break;

	              case ResponseType.VECTOR:
	                  result = data['result'].map(InstantVector.fromJSON);
	                  break;

	              case ResponseType.SCALAR:
	              case ResponseType.STRING:
	                  result = data['result'];
	                  break;

	              default:
	                  throw new Error("Unexpected resultType:", resultType);
	          }

	          return new QueryResult(resultType, result);
	      }

	  }
	  class Target {

	      constructor(discoveredLabels, labels, scrapePool, scrapeUrl, lastError, lastScrape, lastScrapeDuration, health) {
	          if (!!discoveredLabels && typeof (discoveredLabels) != 'object')
	              throw new Error(`Unexpected format for discoveredLabels. Got ${typeof(discoveredLabels)} instead of object`);
	          if (!!labels && typeof (labels) != 'object')
	              throw new Error(`Unexpected format for labels. Got ${typeof(labels)} instead of object`);
	          if (!!scrapePool && typeof (scrapePool) != 'string')
	              throw new Error(`Unexpected format for scrapePool. Got ${typeof(scrapePool)} instead of string`);
	          if (!!scrapeUrl && typeof (scrapeUrl) != 'string')
	              throw new Error(`Unexpected format for scrapeUrl. Got ${typeof(scrapeUrl)} instead of string`);
	          if (!!lastError && typeof (lastError) != 'string')
	              throw new Error(`Unexpected format for lastError. Got ${typeof(lastError)} instead of string`);
	          if (!!lastScrape && (typeof (lastScrape) != 'object' || lastScrape.constructor.name != 'Date'))
	              throw new Error(`Unexpected format for lastScrape. Got ${typeof(lastScrape)} instead of object`);
	          if (!!lastScrapeDuration && typeof (lastScrapeDuration) != 'number')
	              throw new Error(`Unexpected format for lastScrapeDuration. Got ${typeof(lastScrapeDuration)} instead of number`);
	          if (!!health && typeof (health) != 'string')
	              throw new Error(`Unexpected format for health. Got ${typeof(health)} instead of string`);

	          this.discoveredLabels = discoveredLabels;
	          this.labels = labels;
	          this.scrapePool = scrapePool;
	          this.scrapeUrl = scrapeUrl;
	          this.lastError = lastError;
	          this.lastScrape = lastScrape;
	          this.lastScrapeDuration = lastScrapeDuration;
	          this.health = health;
	      }

	      static fromJSON(obj) {
	          return new Target(
	              obj['discoveredLabels'],
	              obj['labels'],
	              obj['scrapePool'],
	              obj['scrapeUrl'],
	              obj['lastError'],
	              !!obj['lastScrape'] ? new Date(obj['lastScrape']) : null,
	              !!obj['lastScrapeDuration'] ? parseFloat(obj['lastScrapeDuration']) : null,
	              obj['health'],
	          );
	      }

	  }

	  class Alert {

	      constructor(activeAt, annotations, labels, state, value) {
	          if (!!activeAt && (typeof (activeAt) != 'object' || activeAt.constructor.name != 'Date'))
	              throw new Error(`Unexpected format for activeAt. Got ${typeof(activeAt)} instead of object`);
	          if (!!annotations && typeof (annotations) != 'object')
	              throw new Error(`Unexpected format for annotations. Got ${typeof(annotations)} instead of object`);
	          if (!!labels && typeof (labels) != 'object')
	              throw new Error(`Unexpected format for labels. Got ${typeof(labels)} instead of object`);
	          if (!!state && typeof (state) != 'string')
	              throw new Error(`Unexpected format for state. Got ${typeof(state)} instead of string`);
	          if (!!value && typeof (value) != 'number')
	              throw new Error(`Unexpected format for value. Got ${typeof(value)} instead of number`);

	          this.activeAt = activeAt;
	          this.annotations = annotations;
	          this.labels = labels;
	          this.state = state;
	          this.value = value;
	      }

	      static fromJSON(obj) {
	          return new Alert(
	              !!obj['activeAt'] ? new Date(obj['activeAt']) : null,
	              obj['annotations'],
	              obj['labels'],
	              obj['state'],
	              !!obj['value'] ? parseFloat(obj['value']) : null,
	          );
	      }

	  }
	  class Rule {

	      constructor(alerts, annotations, duration, health, labels, name, query, type) {
	          this.alerts = alerts;
	          this.annotations = annotations;
	          this.duration = duration;
	          this.health = health;
	          this.labels = labels;
	          this.name = name;
	          this.query = query;
	          this.type = type;
	      }

	      static fromJSON(obj) {
	          return new Rule(
	              !!obj['alerts'] ? obj['alerts'].map(Alert.fromJSON) : [],
	              obj['annotations'],
	              obj['duration'],
	              obj['health'],
	              obj['labels'],
	              obj['name'],
	              obj['query'],
	              obj['type'],
	          );
	      }

	  }
	  class RuleGroup {

	      constructor(rules, file, interval, name) {
	          this.rules = rules;
	          this.file = file;
	          this.interval = interval;
	          this.name = name;
	      }

	      static fromJSON(obj) {
	          return new RuleGroup(
	              !!obj['rules'] ? obj['rules'].map(Rule.fromJSON) : [],
	              obj['file'],
	              obj['interval'],
	              obj['name'],
	          );
	      }

	  }

	  class PrometheusQuery {

	      /**
	       * Creates a PrometheusQuery client
	       * `options` has the following fields:
	       *      - endpoint: address of Prometheus instance
	       *      - baseURL: base path of Prometheus API (default: /api/v1)
	       *      - headers: headers to be sent (k/v format)
	       *      - auth: {username: 'foo', password: 'bar'}: basic auth
	       *      - proxy: {host: '127.0.0.1', port: 9000}: hostname and port of a proxy server
	       *      - withCredentials: indicates whether or not cross-site Access-Control requests
	       *      - timeout: number of milliseconds before the request times out
	       *      - warningHook: a hook for handling warning messages
	       * @param {*} options
	       */
	      constructor(options) {
	          options = options || {};
	          if (!options.endpoint)
	              throw "Endpoint is required";

	          this.endpoint = options.endpoint.replace(/\/$/, "");
	          this.baseURL = options.baseURL || "/api/v1/";
	          this.headers = options.headers || {};
	          this.auth = options.auth || {};
	          this.proxy = options.proxy || {};
	          this.withCredentials = options.withCredentials || false;
	          this.timeout = options.timeout || 10000;

	          this.warningHook = options.warningHook;
	      }

	      request(method, uri, params, body) {
	          const req = axios$1.request({
	              baseURL: this.endpoint + this.baseURL,
	              url: uri,
	              method: method,
	              params: params,
	              data: body,
	              headers: this.headers,
	              auth: {
	                  username: this.proxy.username,
	                  password: this.proxy.password
	              },
	              proxy: (!!this.proxy.host && !!this.proxy.port) ? {
	                  host: this.proxy.host,
	                  port: this.proxy.port
	              } : null,
	              withCredentials: this.withCredentials,
	              timeout: this.timeout,
	          });
	          return req
	              .then((res) => this.handleResponse(res))
	              .catch((res) => this.handleResponse(res));
	      }

	      handleResponse(response) {
	          const err = response.isAxiosError;
	          if (err)
	              response = response['response'];

	          if (!response)
	              throw {
	                  status: 'error',
	                  errorType: 'unexpected_error',
	                  error: 'unexpected http error',
	              };

	          if (!!this.warningHook && !!response['warnings'] && response['warnings'].length > 0)
	              this.warningHook(response['warnings']);

	          const data = response.data;
	          if (!data || data.status == null)
	              throw {
	                  status: 'error',
	                  errorType: 'client_error',
	                  error: 'unexpected client error',
	              };

	          if (err)
	              throw response;

	          // deserialize to QueryResult when necessary
	          // if (typeof (data) == 'object' && !!data['data'] && !!data['data']['resultType'])
	          //     return QueryResult.fromJSON(data['data']);
	          return data['data'];
	      }

	      formatTimeToPrometheus(input, dEfault) {
	          if (!input)
	              input = dEfault;

	          if (typeof (input) == 'number')
	              return input / 1000;
	          else if (typeof (input) == 'object' && input.constructor.name == 'Date')
	              return input.getTime() / 1000;
	          throw new Error("Wrong time format. Expected number or Date.");
	      }

	      // @DEPRECATED
	      // static metricToReadable(metric) {
	      //     const name = !!metric['__name__'] ? metric['__name__'] : '';
	      //     const labels = Object.assign({}, metric);

	      //     // renders readable serie name and labels
	      //     delete labels['__name__'];
	      //     const strLabels = Object.keys(labels).map((curr) => curr + '="' + labels[curr] + '"');
	      //     return name + '{' + strLabels.join(', ') + '}';
	      // }

	      /***********************  EXPRESSION QUERIES  ***********************/

	      /**
	       * Evaluates an instant query at a single point in time
	       * @param {*} query Prometheus expression query string.
	       * @param {*} time Evaluation Date object or number in milliseconds. Optional.
	       */
	      instantQuery(query, time) {
	          const params = {
	              query: query,
	              time: this.formatTimeToPrometheus(time, new Date()),
	          };
	          return this.request("GET", "query", params, null)
	              .then((data) => QueryResult.fromJSON(data));
	      }

	      /**
	       * Evaluates an expression query over a range of time
	       * @param {*} query Prometheus expression query string.
	       * @param {*} start Start Date object or number in milliseconds.
	       * @param {*} end End Date object or number in milliseconds.
	       * @param {*} step Query resolution step width in number of seconds.
	       */
	      rangeQuery(query, start, end, step) {
	          const params = {
	              query: query,
	              start: this.formatTimeToPrometheus(start),
	              end: this.formatTimeToPrometheus(end),
	              step: step,
	          };
	          return this.request("GET", "query_range", params, null)
	              .then((data) => QueryResult.fromJSON(data));
	      }

	      /***********************  METADATA API  ***********************/

	      /**
	       * Finding series by label matchers
	       * @param {*} matchs Repeated series selector argument that selects the series to return.
	       * @param {*} start Start Date object or number in milliseconds.
	       * @param {*} end End Date object or number in milliseconds.
	       */
	      series(matchs, start, end) {
	          const params = {
	              'match[]': matchs,
	              start: this.formatTimeToPrometheus(start),
	              end: this.formatTimeToPrometheus(end),
	          };
	          return this.request("GET", "series", params, null)
	              .then((data) => data.map(Metric.fromJSON));
	      }

	      /**
	       * Getting label names
	       */
	      labelNames() {
	          return this.request("GET", "labels", null, null);
	      }

	      /**
	       * Querying label values
	       * @param {*} labelName This argument is not explicit ?
	       */
	      labelValues(labelName) {
	          return this.request("GET", `label/${labelName}/values`, null, null);
	      }

	      /**
	       * Overview of the current state of the Prometheus target discovery:
	       * @param {*} state Filter by target state. Can be 'active', 'dropped' or 'any'. Optional.
	       */
	      targets(state) {
	          const params = {
	              query: state || 'any',
	          };
	          return this.request("GET", "targets", params, null)
	              .then((data) => {
	                  return {
	                      'activeTargets': !!data['activeTargets'] ? data['activeTargets'].map(Target.fromJSON) : [],
	                      'droppedTargets': !!data['droppedTargets'] ? data['droppedTargets'].map(Target.fromJSON) : [],
	                  };
	              });
	      }

	      /**
	       * Returns metadata about metrics currently scraped from targets.
	       * @param {*} matchTarget Label selectors that match targets by their label sets. Optional.
	       * @param {*} metric Metric name to retrieve metadata for. Optional.
	       * @param {*} limit Maximum number of targets to match. Optional.
	       */
	      targetsMetadata(matchTarget, metric, limit) {
	          const params = {
	              match_target: matchTarget,
	              metric: metric,
	              limit: limit,
	          };
	          return this.request("GET", "targets/metadata", params, null);
	      }

	      /**
	       * Metadata about metrics currently scrapped from targets
	       * @param {*} metric Metric name to retrieve metadata for. Optional.
	       * @param {*} limit Maximum number of targets to match. Optional.
	       */
	      metadata(metric, limit) {
	          const params = {
	              metric: metric,
	              limit: limit,
	          };
	          return this.request("GET", "metadata", params, null);
	      }

	      /***********************  SERIES API  ***********************/

	      /**
	       * Getting a list of alerting and recording rules
	       */
	      rules() {
	          return this.request("GET", "rules", null, null)
	              .then((data) => (!!data['groups'] ? data['groups'] : []).map(RuleGroup.fromJSON));
	      }

	      /**
	       * Returns a list of all active alerts.
	       */
	      alerts() {
	          return this.request("GET", "alerts", null, null)
	              .then((data) => (!!data['alerts'] ? data['alerts'] : []).map(Alert.fromJSON));
	      }

	      /**
	       * Returns an overview of the current state of the Prometheus alertmanager discovery.
	       */
	      alertmanagers() {
	          return this.request("GET", "alertmanagers", null, null);
	      }

	      /***********************  STATUS API  ***********************/

	      /**
	       * Following status endpoints expose current Prometheus configuration.
	       */
	      status() {
	          return this.request("GET", "status/config", null, null);
	      }

	      /**
	       * Returns flag values that Prometheus was configured with.
	       * New in v2.2
	       */
	      statusFlags() {
	          return this.request("GET", "status/flags", null, null);
	      }

	      /**
	       * Returns runtime information properties that Prometheus was configured with.
	       * New in v2.14
	       */
	      statusRuntimeInfo() {
	          return this.request("GET", "status/runtimeinfo", null, null);
	      }

	      /**
	       * Returns various build information properties about Prometheus Server.
	       */
	      statusBuildinfo() {
	          return this.request("GET", "status/buildinfo", null, null);
	      }

	      /**
	       * Returns various cardinality statistics about the Prometheus TSDB.
	       * New in v2.14
	       */
	      statusTSDB() {
	          return this.request("GET", "status/tsdb", null, null);
	      }


	      /***********************  ADMIN API  ***********************/

	      /**
	       * Creates a snapshot of all current data
	       * New in v2.1
	       * @param {*} skipHead Skip data present in the head block. Boolean. Optional.
	       */
	      adminSnapshot(skipHead) {
	          const params = {
	              skip_head: skipHead,
	          };
	          return this.request("POST", "admin/tsdb/snapshot", params, null);
	      }

	      /**
	       * Deletes data for a selection of series in a time range
	       * New in v2.1
	       * @param {*} matchs Repeated series selector argument that selects the series to return.
	       * @param {*} start Start Date object or number in milliseconds.
	       * @param {*} end End Date object or number in milliseconds.
	       */
	      adminDeleteSeries(matchs, start, end) {
	          const params = {
	              'match[]': matchs,
	              start: this.formatTimeToPrometheus(start),
	              end: this.formatTimeToPrometheus(end),
	          };
	          return this.request("POST", "admin/tsdb/delete_series", params, null);
	      }

	      /**
	       * Removes the deleted data from disk and cleans up
	       * New in v2.1
	       */
	      adminCleanTombstones() {
	          return this.request("POST", "admin/tsdb/clean_tombstones", null, null);
	      }

	  }

	  return PrometheusQuery;

	})));
	});

	// Min step is 1s
	const PROMETHEUS_QUERY_RANGE_MIN_STEP = 1;

	var datasource = {

	    /**
	     * Compute a step for range_query (interval between 2 points in second)
	     * Min step: 1s
	     * Default: 1 step every 25px
	     * @param {Date} start 
	     * @param {Date} end
	     * @param {number} chartWidth: width in pixel 
	     */
	    getPrometheusStepAuto: (start, end, chartWidth) => {
	        const secondDuration = (end.getTime() - start.getTime()) / 1000;
	        const step = Math.floor(secondDuration / chartWidth) * 25;
	        return step < PROMETHEUS_QUERY_RANGE_MIN_STEP ? PROMETHEUS_QUERY_RANGE_MIN_STEP : step;
	    },

	    /**
	     * Return Date objects containing the start and end date of interval.
	     * Relative dates are computed to absolute
	     * @param {object} timeRange 
	     */
	    getStartAndEndDates(timeRange) {
	        // default to "absolute"
	        timeRange['type'] = !!timeRange['type'] ? timeRange['type'] : 'absolute';

	        if (timeRange['type'] === 'absolute') {
	            return {
	                start: timeRange['start'],
	                end: timeRange['end']
	            };
	        } else if (timeRange['type'] === 'relative') {
	            return {
	                start: new Date(new Date().getTime() + timeRange['start']),
	                end: new Date(new Date().getTime() + timeRange['end']),
	            };
	        }
	        throw new Error('Unexpected options.timeRange value.');
	    }

	};

	// Min step is 1s

	var opt = {

	    /**
	     * Compute a step for range_query (interval between 2 points in second)
	     */
	    assertPluginOptions: (options) => {
	        if (!options)
	            throw 'ChartDatasourcePrometheusPlugin.options is undefined';

	        if (!options['query'])
	            throw new Error('options.query is undefined');
	        if (!options['timeRange'])
	            throw new Error('options.timeRange is undefined');
	        if (options['timeRange']['start'] == null)
	            throw new Error('options.timeRange.start is undefined');
	        if (options['timeRange']['end'] == null)
	            throw new Error('options.timeRange.end is undefined');

	        if (typeof (options['query']) != 'string')
	            throw new Error('options.query must be a string');

	        if (typeof (options['timeRange']) != 'object')
	            throw new Error('options.timeRange must be a object');
	        if (typeof (options['timeRange']['type']) != 'string')
	            throw new Error('options.timeRange.type must be a string');
	        if (!(typeof (options['timeRange']['start']) == 'number' || (typeof (options['timeRange']['start']) == 'object' && options['timeRange']['start'].constructor.name == 'Date')))
	            throw new Error('options.timeRange.start must be a Date object (absolute) or integer (relative)');
	        if (!(typeof (options['timeRange']['end']) == 'number' || (typeof (options['timeRange']['end']) == 'object' && options['timeRange']['end'].constructor.name == 'Date')))
	            throw new Error('options.timeRange.end must be a Date object (absolute) or integer (relative)');
	        if (typeof (options['timeRange']['msUpdateInterval']) != 'number')
	            throw new Error('options.timeRange.msUpdateInterval must be a integer');
	        if (options['timeRange']['msUpdateInterval'] < 1000)
	            throw new Error('options.timeRange.msUpdateInterval must be greater than 1s.');
	    },

	    defaultOptionsValues: (options) => {
	        const dEfault = {
	            // https://learnui.design/tools/data-color-picker.html#palette
	            'backgroundColor': [
	                'transparent',
	                'transparent',
	                'transparent',
	                'transparent',
	                'transparent',
	                'transparent',
	                'transparent',
	                'transparent',

	                // 'rgba(0, 63, 92, 0.2)',
	                // 'rgba(47, 75, 124, 0.2)',
	                // 'rgba(102, 81, 145, 0.2)',
	                // 'rgba(160, 81, 149, 0.2)',
	                // 'rgba(212, 80, 135, 0.2)',
	                // 'rgba(249, 93, 106, 0.2)',
	                // 'rgba(255, 124, 67, 0.2)',
	                // 'rgba(255, 166, 0, 0.2)',

	                // 'rgba(255, 99, 132, 0.2)',
	                // 'rgba(54, 162, 235, 0.2)',
	                // 'rgba(255, 206, 86, 0.2)',
	                // 'rgba(75, 192, 192, 0.2)',
	                // 'rgba(153, 102, 255, 0.2)',
	                // 'rgba(255, 159, 64, 0.2)'
	            ],
	            'borderColor': [
	                // 'rgba(0, 63, 92, 1)',
	                // 'rgba(47, 75, 124, 1)',
	                // 'rgba(102, 81, 145, 1)',
	                // 'rgba(160, 81, 149, 1)',
	                // 'rgba(212, 80, 135, 1)',
	                // 'rgba(249, 93, 106, 1)',
	                // 'rgba(255, 124, 67, 1)',
	                // 'rgba(255, 166, 0, 1)',

	                'rgba(255, 99, 132, 1)',
	                'rgba(54, 162, 235, 1)',
	                'rgba(255, 206, 86, 1)',
	                'rgba(75, 192, 192, 1)',
	                'rgba(153, 102, 255, 1)',
	                'rgba(255, 159, 64, 1)'
	            ],
							'borderWidth': 3,
	        };

	        return Object.assign(dEfault, options);
	    }

	};

	// const AXES_UNIT_AND_STEP = [{

	// enforce xAxes data type to 'time'
	const setTimeAxesOptions = (chart, start, end) => {
	    chart.config.options = !!chart.config.options ? chart.config.options : {};
	    chart.config.options.scales = !!chart.config.options.scales ? chart.config.options.scales : {};
	    chart.config.options.scales.xAxes = !!chart.config.options.scales.xAxes && chart.config.options.scales.xAxes.length > 0 ? chart.config.options.scales.xAxes : [{}];
	    chart.config.options.scales.xAxes[0].time = !!chart.config.options.scales.xAxes[0].time ? chart.config.options.scales.xAxes[0].time : {};
	    chart.config.options.scales.xAxes[0].time.displayFormats = !!chart.config.options.scales.xAxes[0].time.displayFormats ? chart.config.options.scales.xAxes[0].time.displayFormats : {};

	    // const w = chart.width;
	    // const msInterval = (end.getTime() - start.getTime());
	    // const msPerPixel = msInterval / w;

	    // for (let i = 0; i < AXES_UNIT_AND_STEP.length && AXES_UNIT_AND_STEP[i]['minMsPerPixel'] * AXES_UNIT_AND_STEP[i]['stepSize'] < msPerPixel; i++) {
	    //     chart.config.options.scales.xAxes[0].time.unit = AXES_UNIT_AND_STEP[i]['unit'];
	    //     chart.config.options.scales.xAxes[0].time.stepSize = AXES_UNIT_AND_STEP[i]['stepSize'];
	    // }

	    chart.config.options.scales.xAxes[0].type = 'time';
	    chart.config.options.scales.xAxes[0].distribution = 'linear';
	    // chart.config.options.scales.xAxes[0].time.stepSize = PIXEL_STEP_SIZE; // pixels between 2 vertical grid lines
	    chart.config.options.scales.xAxes[0].time.minUnit = 'millisecond';
	    chart.config.options.scales.xAxes[0].time.displayFormats.hour = 'MMM D, hA'; // override default momentjs format for 'hour' time unit
	};

	const spanGaps = (chart, start, end, step) => {
		chart.data.datasets.forEach((dataSet, index) => {
			if (Math.abs(start - dataSet.data[0].t) > (1100 * step)) {
				for (var i = Math.abs(start - dataSet.data[0].t) / (step * 1000); i > 1; i--) {
					chart.data.datasets[index].data.unshift({ t: new Date(dataSet.data[0].t.getTime() - step * 1000), v: Number.NaN });
				}
			}

			if (Math.abs(end - dataSet.data[dataSet.data.length - 1].t) > (1100 * step)) {
				for (var i = Math.abs(end - dataSet.data[dataSet.data.length - 1].t) / (step * 1000); i > 1; i--) {
					chart.data.datasets[index].data.push({ t: new Date(dataSet.data[chart.data.datasets[index].data.length - 1].t.getTime() + step * 1000), v: Number.NaN });
				}
			}
		});
	}

	var ChartDatasourcePrometheusPlugin = {
	    id: 'datasource-prometheus',

	    beforeInit: (chart) => {
	        chart['datasource-prometheus'] = {
	            'loading': false,
	        };
	    },

	    afterInit: (chart, options) => {
	        opt.assertPluginOptions(options); // triggers exceptions

	        // auto update
	        if (!!options && !!options['timeRange'] && !!options['timeRange']['msUpdateInterval'])
	            chart['datasource-prometheus']['updateInterval'] = setInterval(() => {
	                chart.update();
	            }, options['timeRange']['msUpdateInterval']);
	    },

	    beforeUpdate: (chart, options) => {
	        const _options = opt.defaultOptionsValues(options);

	        if (!!chart['datasource-prometheus'] && chart['datasource-prometheus']['loading'] == true)
	            return true;

	        const prometheus = _options['prometheus'];
	        const query = _options['query'];
	        const {
	            start,
	            end
	        } = datasource.getStartAndEndDates(_options['timeRange']);
	        const step = _options['timeRange']['step'] || datasource.getPrometheusStepAuto(start, end, chart.width);

	        const pq = new prometheusQuery_umd(prometheus);

	        pq.rangeQuery(query, start, end, step)
	            .then((res) => {
                	if (res.result.length > 0) {
	                    chart.data.datasets = res.result.map((serie, i) => {
	                        return {
	                            label: serie.metric.toString(),
	                            data: serie.values.map((v, j) => {
	                                return {
	                                    t: v.time,
	                                    y: v.value,
	                                };
	                            }),
	                            backgroundColor: _options.backgroundColor[i % _options.backgroundColor.length],
	                            borderColor: _options.borderColor[i % _options.borderColor.length],
	                            borderWidth: _options.borderWidth,
	                        };
											});
											
										if (chart.options.spanGaps) {
											spanGaps(chart, start, end, step);
										}
	                }

	                setTimeAxesOptions(chart);

	                chart['datasource-prometheus']['loading'] = true;
	                chart.update();
	                chart['datasource-prometheus']['loading'] = false;
	            });

	        return false;
	    },

	    destroy: (chart, options) => {
	        // auto update
	        if (!!chart['datasource-prometheus']['updateInterval'])
	            clearInterval(chart['datasource-prometheus']['updateInterval']);
	    },

	    constructors: {},
	    extensions: {},

	    register: (type, constructor, extensions) => {},

	    getType: (url) => {},

	    getConstructor: (type) => {}
	};

	return ChartDatasourcePrometheusPlugin;

})));
