#!/bin/sh

rm -rf ext
mkdir -p ext/js
mkdir -p ext/bootstrap

# jQuery
curl -o ext/js/jquery.js http://code.jquery.com/jquery.min.js

# JSrender (JavaScript Template Rendering for jQuery)
curl -o ext/js/jsrender.js https://raw.github.com/BorisMoore/jsrender/master/jsrender.js

# JSO (JavaScript OAuth 2 client)
curl -o ext/js/jso.js https://raw.github.com/andreassolberg/jso/master/jso.js

# Bootstrap
curl -o ext/bootstrap.zip http://twitter.github.com/bootstrap/assets/bootstrap.zip
(cd ext/ && unzip bootstrap.zip && rm bootstrap.zip)


