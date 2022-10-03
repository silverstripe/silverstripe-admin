# Entwine - Support for Concrete UI style programming in jQuery

By Hamish Friedlander, with thanks to [Silverstripe](https://www.silverstripe.com/)

**IMPORTANT:** This copy of entwine has departed from the copy [available on github](https://github.com/hafriedlander/jquery.entwine). It has modifications made to make it compatible with jQuery 3.x for Silverstripe specifically.

Entwine tries to provide a new model of code organisation - a replacement for Object Oriented programming that is
focused on adding functions to groups of DOM elements based on the structure and contents of those DOM elements. It's a
merging of the model and view layer that initially seems weird, but can give very powerful results.

We're standing on the shoulders of giants here - combining ideas from Prototype's behaviour & lowpro and jQuery's effen
& livequery (who themselves stole ideals from Self's Morphic UI and others), but extending & combining the concepts
presented in those tools to provide a complete alternative to traditional OO concepts - self-aware methods, inheritance,
polymorphisim and namespacing without a single class definition.

## Requirements

Currently Entwine layers itself on top of jQuery. Any patch level of jQuery from 1.7 through 1.10 or 2.0 should work.
Because we patch some internal jQuery APIs there can be a delay between a new version of jQuery being released
and Entwine providing support.

## Getting Started

* Walk through the [Tutorial](https://hafriedlander.github.com/jquery.entwine/tutorial/)
* Watch the [Screencast](https://www.vimeo.com/6353390) (shot during a introductory developer meeting at SilverStripe)
* Join the [Google Group](https://groups.google.com/group/jquery-entwine) and let us know what you think, or what other features you'd like to see

## Name change

jQuery Entwine used to be called jQuery Concrete. The name was changed to avoid confusion with another product. The concrete function remains as an alias, but all new code should use entwine

## Basic use

### First intro

To attach methods to DOM nodes, call the `entwine` function on a jQuery selector object, passing a hash listing the method names and bodys

```js
$('div').entwine({
  foo: function(..){..},
  bar: function(..){..}
});
```

You can then call those methods on any jQuery object.

```js
$('#a').foo();
```

Any elements in the jQuery selection that match the selector used during definition ('div' in this example) will have foo called with that element
set as this. Any other objects are skipped. The return value will be the return value of foo() for the last matched DOM object in the set

### A proper example

Given this DOM structure:

```html
<body>
  <div class="internal_text">Internal text</div>
  <div class="attribute_text" rel="Attribute text"></div>
  <div>Nonsense</div>
</body>
```

And this entwine definition

```js
$('.internal_text').entwine({
  foo: function(){ console.log(this.text()); }
});
$('.attribute_text').entwine({
  foo: function(){ console.log(this.attr('rel')); }
});
```
  
Then this call

```js
$('div').foo();
```

Will log this to the console

```
Internal text
Attribute text  
```

### Limitations

When defining methods, the jQuery object that entwine is called on must be a plain selector, without context. These examples will not work

```js
$('div', el).entwine(...)
$([ela, elb, elc]).entwine(...)
$('<div id="a"></div>').entwine(...)
```

## Live

The definitions you provide are not bound to the elements that match at definition time. You can declare behaviour prior to the DOM existing in any
form (i.e. prior to DOMReady) and later calls will function correctly.

## Selector specifity

When there are two definitions for a particular method on a particular DOM node, the function with the most _specific_ selector is used. 
_Specifity_ is calculated as defined by the CSS 2/3 spec. This can be seen as _subclassing_ applied to behaviour.

Another example. Given this DOM structure

```html
<body>
  <div>Internal text</div>
  <div class="attribute_text" rel="Attribute text"></div>
  <div>Nonsense</div>
</body>
```

And this entwine definition

```js
$('div').entwine({
  foo: function(){ console.log(this.text()); }
});
$('.attribute_text').entwine({
  foo: function(){ console.log(this.attr('rel')); }
});
```

Then this call

```js
$('div').foo();
```

Will log this to the console

```
Internal text
Attribute text
Nonsense
```

## Events
 
If you declare a function with a name starting with 'on', then instead of defining that function, it will be bound to an event of that
name. Just like other functions this binding will be live, and only the most specific definition will be used

```html
<head>
  <script type='text/javascript'>
    /* No need for onready wrapper. Events are bound as needed */
    $('div').entwine({
      onclick: function(){ this.css({backgroundColor: 'blue'}); }
    });
    $('.green').entwine({
      onclick: function(){ this.css({color: 'green'}); }
    });
  </script>
<body>
  <div>Background will turn blue when clicked on</div>
  <div>Will also have blue background when clicked on</div>
  <div class='green'>Will have green text when clicked on. Background color will not change</div>
</body>
```
  
## Constructors / Destructors

Declaring a function with the name `onmatch` will create a behavior that is called on each object when it matches. Likewise, `onunmatch` will
be called when an object that did match this selector stops matching it (because it is removed, or because you've changed its properties).

Note that an onunmatch block must be paired with an onmatch block - an onunmatch without an onmatch _in the same entwine definition block_ is illegal

Like other functions, only the most specific definition will be used. However, because property changes are not atomic, this may not work as you
expect.

## Namespaces

To avoid name clashes, to allow multiple bindings to the same event, and to generally seperate a set of functions from other code you can use namespaces

```js
$.entwine('foo.bar', function($){
  $('div').entwine({
    baz: function(){}
  });
});
```

You can then call these functions like this:

```js
$('div').entwine('foo.bar').baz()
```
  
Namespaced functions work just like regular functions (`this` is still set to a matching DOM Node). However, specifity is calculated per namespace.
This is particularly useful for events, because given this:

```js
$('div').entwine({
  onclick: function(){ this.css({backgroundColor: 'blue'}); }
});

$.entwine('foo', function($){
  $('div').entwine({
    onclick: function(){ this.css({color: 'green'}); }
  });
});
```
  
Clicking on a div will change the background **and** foreground color.

This is particularly important when writing reusable code, since otherwise you can't know before hand whether your event handler will be called or not

Although a namespace can be any string, best practise is to name them with dotted-identifier notation.

### Namespaces and scope (or What the hell's up with that ugly function closure)

Inside a namespace definition, functions remember the namespace they are in, and calls to other functions will be looked up inside that namespace first. 
Where they don't exist, they will be looked up in the base namespace

```js
$.entwine('foo', function($){
  $('div').entwine({
    bar: function() { this.baz(); this.qux(); }
    baz: function() { console.log('baz'); }
  })
})

$('div').entwine({
  qux: function() { console.log('qux'); }
})
```
  
Will print baz, qux to the console

Note that 'exists' means that a function is declared in this namespace for _any_ selector, not just a matching one. Given the dom

```html
<div>Internal text</div>
```

And the entwine definitions

```js
$.entwine('foo', function($){
  $('div').entwine({
    bar: function() { this.baz(); }
  });
  $('span').entwine({
    baz: function() { console.log('a'); }
  });
})


$('div').entwine({
  baz: function() { console.log('b'); }
})
```

Then doing `$('div').bar();` will _not_ display b. Even though the span rule could never match a div, because baz is defined for some rule in the foo namespace, the base namespace will never be checked

### Nesting namespace blocks

You can also nest declarations. In this next example, we're defining the functions $().entwine('zap').bar() and $().entwine('zap.pow').baz()

```js
$.entwine('zap', function($){
  $('div').entwine({
    bar: function() { .. }
  })
  $.entwine('pow', function($){
    $('div').entwine({
      baz: function() { .. }
    })
  })
})
```

### Calling to another namespace (and forcing base)

Inside a namespace, namespace lookups are by default relative to the current namespace.

In some situations (such as the last example) you may want to force using the base namespace. In this case you can call entwine with the first argument being the base namespace code '.'. For example, if the first definition in the previous example was

```js
$.entwine('foo', function($){
  $('div').entwine({
    bar: function() { this.entwine('.').baz(); }
  })
})
```

Then b _would_ be output to the console.

### Using

Sometimes a block outside of a namespace will need to refer to that namespace repeatedly. By passing a function to the entwine function, you can change the looked-up namespace

```js
$.entwine('foo', function($){
  $('div').entwine({
    bar: function() { console.log('a'); }
  })
})

$('div').entwine('foo', function(){
  this.bar();
  this.bar();
  this.bar();
});
```
  
This equivalent to /with/ in javascript, and just like /with/, care should be taken to only use this construct in situations that merit it.

## Tests

Specs are written using the awesome [JSpec](http://github.com/visionmedia/jspec) library.  You can run them in two ways

### Ad-hoc

Open the file `spec/spec.html` in any modern browser

### Continuous testing

JSpec has a command line client which can be used for continuous testing. Make sure ruby is installed and enabled the [Gemcutter](http://gemcutter.org/) gem hosting service, like so: 

```shell
sudo gem install gemcutter
sudo gem tumble
```

Then install the jspec binary:

```shell
sudo gem install jspec
```

The JSpec command line tool should now be installed. This command will re-run the specs whenever you edit a file:

```shell
jspec spec/spec.html -p src,spec
```

## License

Copyright (C) 2009 Hamish Friedlander (hamish@silverstripe.com) and Silverstripe Limited (www.silverstripe.com). All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Hamish Friedlander nor Silverstripe nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
