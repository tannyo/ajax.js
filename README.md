# ajax.js

A simple [AJAX](http://en.wikipedia.org/wiki/Ajax_%28programming%29) module written in native javascript.

The [server-includes.js](https://github.com/tannyo/server-includes.js) module was written in native javascript with simple AJAX needs. One a simple GET call in one place, so I used the AJAX code from [You might not need jQuery](http://youmightnotneedjquery.com/) as a basis for the code to make AJAX calls. The code has worked beautifully without any problems. Usually I use the AJAX code in whatever framework/library that is being used for the project, but didn't want to bring in the overhead of a framework and wanted code that anyone could use no matter what framework or lack of framework they are using.

I've been getting a lot of calls lately from companies looking for programmers who can program in native javascript. I thought what an opportunity to write an AJAX module with more capabilities using native javascript. The last time I wrote a fully featured AJAX module was in 2007 when AJAX was expected to return XML (the X in AJAX).

Starting out with the non-working outline of 16 lines of code from [You might not need jQuery](http://youmightnotneedjquery.com/) I've ended up with over a 150 lines of code and 42 lines of comments at the top of the ajax.js file. The module supports GET, POST, PUT, DELETE, custom headers, CORS, and promises for callback functions.

## Usage

    <script src="path/to/ajax.js"></script>

## Syntax

### ajax([url | settings])

**url**

String. URL to which the request is sent.

**settings**

Object
```
{
  method: "GET",
  url: "path/to/url",
  headers: {header_name: "header value"},
  data: "form data",
  cors: false,
  done: function,
  always: function,
  fail: function
}
```

#### method

String. Optional. Defaults to "GET",

#### url

String. URL to which the request is sent,

#### data

String. Name/value pairs of form data. If you set headers, it can be any type of data the header defines.

#### headers

Object. Optional. Custom headers,

#### cors

Boolean. Optional,

#### always

Function. Optional. Run on success or error,

#### done

Function. Optional. Run on success

#### fail

Function. Optional. Run on error,

## Promise Methods

### always(fn)

**fn**

Function. Optional. Sets a function that runs on success or error.

### done(fn)

**fn**

Function. Optional. Sets a function that runs on success.

### fail(fn)

**fn**

Function. Optional. Sets a function that runs on error.

### then(fn_done, fn_fail)

**fn_done**

Function. Optional. Sets a function that runs on success.

**fn_fail**

Function. Optional. Sets a function that runs on error.

## Notes

At minimum you must pass an url and call the always or done methods with a function.

## Examples

### Call with simple url and success and fail promises

    ajax("/getStatistics/email")
      .done(processData)
      .fail(processError);

### Call using settings object for url, done, and fail promises

    ajax({
      url: "/getStatistics/email",
      done: processData,
      fail: processError
    });

### Call using settings object and done and fail promise methods

    ajax({
      url: "/getStatistics/email",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
      })
      .done(processData)
      .fail(processError);

### Call using settings object and always promise

      ajax({
        url: "/getStatistics/email",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        })
        .always(function (request) {
          if (request.status === 200) {
            processData(request.response);
          } else {
            processError(request);
          }
        });

### Call using settings object to post with done and fail promises

    ajax({
      type: "POST",
      url: "/email/contactUs",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(req)
    })
    .done(done)
    .fail(error);

## Issues

Have a bug? Please create an [issue](https://github.com/tannyo/ajax.js/issues) here on GitHub!

## Contributing

Want to contribute? Great! Just fork the project, make your changes and open a [pull request](https://github.com/tannyo/ajax/pulls).

## Changelog
* v0.10 2014-12-16 TKO Created by Tanny O'Haley.
* v0.11 2014-12-17 TKO Added then promise.

## License

The MIT License (MIT)

Copyright (c) 2014 [Tanny O'Haley](http://tanny.ica.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
