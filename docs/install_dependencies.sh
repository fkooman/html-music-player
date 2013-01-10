#!/bin/sh

rm -rf ext
mkdir -p ext/js
mkdir -p ext/bootstrap

# remoteStorage
curl -o ext/js/remoteStorage.js http://remotestoragejs.com/build/0.7.0-head/remoteStorage.min.js

# jQuery
curl -o ext/js/jquery.js http://code.jquery.com/jquery.min.js

# JSrender (JavaScript Template Rendering for jQuery)
curl -o ext/js/jsrender.js https://raw.github.com/BorisMoore/jsrender/master/jsrender.js

# Bootstrap
curl -o ext/bootstrap.zip http://twitter.github.com/bootstrap/assets/bootstrap.zip
(cd ext/ && unzip bootstrap.zip && rm bootstrap.zip)


