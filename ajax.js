/*
 * ajax.js
 * Simple ajax module that supports GET, POST, PUT, DELETE, custom headers, CORS,
 * and callback functions.
 *
 * Syntax:
 * ajax(url)
 * ajax(settings)
 *
 * url: string, url to get.
 * settings: object
 *  method:   default GET
 *  url:      string, required
 *  headers:  object, optional, custom headers
 *  cors:     boolean, optional
 *  always:   function, optional, run on success or error
 *  done:     function, optional, run on success
 *  fail:     function, optional, run on error
 *
 * methods:
 *  always(fn)  Runs passed function on success or error, passes the XMLHttpRequest
 *              or custom error object to your function.
 *  done(fn)    Runs passed function on success, passes the text and XMLHttpRequest
 *              object to your function.
 *  fail(fn)    Runs passed function on error, passes the XMLHttpRequest object or
 *              custom error object to your function.
 *  then(fn,fn) Calls done with the first function, then fail with the second function.
 *
 * returns undefined
 *
 * Notes:
 *  At minimum you must pass an url and call the always method with a function.
 *
 * This started with 16 lines from http://youmightnotneedjquery.com/, now look at it.
 *
 * Modification Log:
 * 2014-12-16 TKO Created by Tanny O'Haley
 * 2014-12-17 TKO Added then promise.
 */

/*jslint browser: true, plusplus: true, indent: 2 */
/*global XDomainRequest */
var ajax = (function () {
  'use strict';

  // Modified slightly for style and JSLint from http://youmightnotneedjquery.com/
  function extend(out) {
    var i, key;
    out = out || {};

    for (i = 1; i < arguments.length; i++) {
      if (arguments[i]) {
        for (key in arguments[i]) {
          if (arguments[i].hasOwnProperty(key)) {
            out[key] = arguments[i][key];
          }
        }
      }
    }

    return out;
  }

  function ajax_request(settings) {
    var header,
      pub_methods,
      request = extend({method: "GET"}, typeof settings === "string" ? {url: settings} : settings),
      response,
      xhr = new XMLHttpRequest();

    // Set always function.
    function always(fn) {
      if (typeof fn === "function") {
        request.always = fn;
        if (xhr.status) {
          request.always(response);
        }
      }
      return pub_methods;
    }

    // Set done function.
    function done(fn) {
      if (typeof fn === "function") {
        request.done = fn;
        if (xhr.status >= 200 && xhr.status < 400) {
          fn(response.response, response);
        }
      }
      return pub_methods;
    }

    // Set failure function.
    function fail(fn) {
      if (typeof fn === "function") {
        request.fail = fn;
        // If status is not 0 and not success.
        if (response.status && !(xhr.status >= 200 && xhr.status < 400)) {
          request.fail(response);
        }
      }
      return pub_methods;
    }

    // Set then functions. Combination of done and fail.
    function then(fn_done, fn_fail) {
      done(fn_done);
      fail(fn_fail);
    }

    // Run always, on success or error.
    function run_always() {
      if (typeof request.always === "function") {
        request.always(response);
      }
    }

    // Run on success.
    function success() {
      if (request.dataType === "json") {
        response = extend({}, xhr, {response: JSON.parse(xhr.response)});
      } else if (request.dataType === "xml") {
        response = extend({}, xhr, {response: xhr.responseXML});
      } else {
        response = xhr;
      }

      run_always();
      if (typeof request.done === "function") {
        request.done(response.response, response);
      }
    }

    // Run on error.
    function error() {
      response = xhr;
      run_always();
      if (typeof request.fail === "function") {
        request.fail(xhr);
      }
    }

    // Is there a request object and does it contain an url?
    if (request.url) {
      // Initialize type variable.
      request.method = (request.method || "GET").toUpperCase();

      // Support CORS for IE8 and IE9.
      if (request.cors && window.XDomainRequest) {
        xhr = new XDomainRequest();
      }

      // Open a connection.
      xhr.open(request.method, request.url, true, request.user, request.password);

      if (request.headers) {
        // Add custom headers.
        for (header in request.headers) {
          if (request.headers.hasOwnProperty(header)) {
            xhr.setRequestHeader(header, request.headers[header]);
          }
        }
      } else if (request.method === "POST" || request.method === "PUT") {
        // Add header for POST and PUT
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      }

      // Add status handler.
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 400) {
          success();
        } else {
          // We reached our target server, but it returned an error
          error();
        }
      };

      // Add error handler for instances when a server connection could not be made.
      xhr.onerror = function () {
        error();
      };

      // Send the request.
      xhr.send(request.data);
    } else {
      // Either a request object was not passed or request.url does not exist.
      // Replace xhr object with custom error object.
      response = {status: 900, statusText: "Invalid request object.", request: request};
      error();
    }

    // Set public methods.
    pub_methods = {always: always, done: done, fail: fail, then: then};
    return pub_methods;
  }

  return ajax_request;
}());
