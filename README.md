# Music Player

## Introduction
This application makes it possible to play music stored in a remoteStorage
server.

## Screenshots
![html-music-player](https://github.com/fkooman/html-music-player/raw/master/docs/html-music-player-screenshot.png)

![html-music-player](https://github.com/fkooman/html-music-player/raw/master/docs/html-music-player-playlist-screenshot.png)

## Features
* Browse through "music" remoteStorage folder
* Automatically play the next song in the folder from which the playing 
  was started, even when browsing other folders
* Previous and Next buttons to change songs
* Key bindings (arrow keys) for previous and next song
* Playlist support

# Installation
You can use [Bower](http://bower.io) to install the dependencies.

    $ bower install

## Configuration
You need to configure the application to point to your OAuth server. This can
be done by copying `config/config.js.default` to `config/config.js` and 
modifying the `config.js` file to suit your situation.

This is the default configuration:

    var apiClientId           = 'html-music-player';
    var authorizeEndpoint     = 'http://localhost/php-oauth/authorize.php';
    var introspectionEndpoint = 'http://localhost/php-oauth/introspect.php';
    var apiEndpoint           = 'http://localhost/php-remoteStorage/api.php';

For example, for your situation it may need to be this:

    var apiClientId           = 'html-music-player';
    var authorizeEndpoint     = 'https://www.example.org/php-oauth/authorize.php';
    var introspectionEndpoint = 'https://www.example.org/php-oauth/introspect.php';
    var apiEndpoint           = 'https://www.example.org/php-remoteStorage/api.php';

# Client Registration
Also, make sure that this client is registered in your OAuth server. The 
following information could be relevant:

* **Identifier**: html-music-player
* **Name**: Music Player
* **Description**: Play your music stored on a remoteStorage server.
* **Profile**: User-agent-based Application
* **Secret**: _NONE_
* **Redirect URI**: https://www.example.org/html-music-player/index.html
