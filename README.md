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

## Installation
This application depends on the following components:

* jQuery
* JSrender (JavaScript Template Rendering for jQuery)
* JSO (JavaScript OAuth 2 client)
* Bootstrap CSS 

It can easily be installed by running the following script:

    $ sh docs/install_dependencies.sh

This will download the latest version of those components and everything will
immediately work.

## Configuration
You need to configure the application to point to your OAuth server. This can
be done by copying `config/config.js.default` to `config/config.js` and 
modifying the `config.js` file to suit your situation.

This is the default configuration:

    var apiClientId       = 'html-music-player';
    var authorizeEndpoint = 'http://localhost/php-oauth/authorize.php';
    var tokenInfoEndpoint = 'http://localhost/php-oauth/tokeninfo.php';
    var apiEndpoint       = 'http://localhost/php-remoteStorage/api.php';

For example, for your situation it may need to be this:

    var apiClientId       = 'html-music-player';
    var authorizeEndpoint = 'https://www.example.org/php-oauth/authorize.php';
    var tokenInfoEndpoint = 'https://www.example.org/php-oauth/tokeninfo.php';
    var apiEndpoint       = 'https://www.example.org/php-remoteStorage/api.php';

## Client Registration
Also, make sure that this client is registered in your OAuth server. The following
information will be relevant:

<table>
  <tr>
    <th>Identifier</th><td>html-music-player</td>
  </tr>
  <tr>
    <th>Name</th><td>Music Player</td>
  </tr>
  <tr>
    <th>Description</th><td>Play your music stored on a remoteStorage server.</td>
  </tr>
  <tr>
    <th>Required Scope</th><td>music:r</td>
  </tr>
  <tr>
    <th>Profile</th><td>User-agent-based Application</td>
  </tr>
  <tr>
    <th>Secret</th><td><em>NONE</em></td>
  </tr>
  <tr>
    <th>Redirect URI</th><td>https://www.example.org/html-music-player/index.html</td>
  </tr>
</table>

That should be all!
