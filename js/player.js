$(document).ready(function () {
    var apiScope = ["music:r"];

    var userId;

    // what is being played
    var playingFileIndex;
    var playingEntries;

    // what is being viewed
    var directoryEntries;

    // the current playlist
    var playListEntries = [];

    jso_configure({
        "html-music-player": {
            client_id: apiClientId,
            authorization: authorizeEndpoint
        }
    });
    jso_ensureTokens({
        "html-music-player": apiScope
    });

    function getRootUri() {
        return apiEndpoint + "/" + userId + "/";
    }

    function verifyAccessToken(callback) {
        var accessToken = jso_getToken("html-music-player", apiScope);
        var xhr = new XMLHttpRequest();
        xhr.open("GET", tokenInfoEndpoint + "?access_token=" + accessToken, true);
        xhr.onload = function (e) {
            var response = JSON.parse(xhr.responseText);
            userId = response.user_id;
            callback();
        }
        xhr.send();
    }

    function renderFolderList(dirName) {
        var accessToken = jso_getToken("html-music-player", apiScope);
        var xhr = new XMLHttpRequest();
        xhr.open("GET", getRootUri() + "music" + dirName, true);
        xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
        xhr.onload = function (e) {
            var response = JSON.parse(xhr.responseText);

            directoryEntries = [];
            // convert the map to an array
            for (i in response) {
                if (i.lastIndexOf("/") === i.length - 1) {
                    // directory
                    directoryEntries.push({
                        parentDirectory: dirName,
                        fileName: i.substring(0, i.length - 1),
                        fileTime: response[i],
                        isDirectory: true
                    });
                } else {
                    // file
                    directoryEntries.push({
                        parentDirectory: dirName,
                        fileName: i,
                        fileTime: response[i],
                        isDirectory: false
                    });
                }
            }
            directoryEntries.sort(sortDirectory);

            if (dirName !== "/") {
                directoryEntries.unshift({
                    parentDirectory: dirName,
                    fileName: "..",
                    fileTime: 0,
                    isDirectory: true
                });
            }

            $("#folderListTable").html($("#folderListTemplate").render({
                dirName: dirName,
                entry: directoryEntries
            }));
        }
        xhr.send();
    }

    function playSong() {
        var fileName = playingEntries[playingFileIndex]['fileName'];
        var parentDirectory = playingEntries[playingFileIndex]['parentDirectory'];

        console.log("[html-music-player] playing " + parentDirectory + fileName);
        var accessToken = jso_getToken("html-music-player", apiScope);
        // FIXME: case when rootUri already contains a "?", use "&" instead
        var songUrl = getRootUri() + "music" + parentDirectory + fileName + "?access_token=" + accessToken;
        document.getElementById("player").src = songUrl;
        document.getElementById("player").play();
    }

    $(document).on('click', '#folderListTable a.file', function () {
        playingEntries = directoryEntries;
        playingFileIndex = $(this).data("fileIndex");
        playSong();
    });

    $(document).on('click', '#folderListTable a.playList', function () {
        playListEntries.push(directoryEntries[$(this).data("fileIndex")]);
        console.log("Playlist: " + JSON.stringify(playListEntries));
    });

    $(document).on('click', '#folderListTable a.dir', function () {
        var fileName = directoryEntries[$(this).data("fileIndex")]['fileName'];
        var parentDirectory = directoryEntries[$(this).data("fileIndex")]['parentDirectory'];

        if (".." === fileName) {
            // go one directory up...
            secondToLastSlash = parentDirectory.lastIndexOf("/", parentDirectory.length - 2);
            dirName = parentDirectory.substring(0, secondToLastSlash + 1);
        } else {
            // enter the directory...
            dirName = parentDirectory + fileName + "/";
        }
        renderFolderList(dirName);
    });

    document.getElementById("player").addEventListener('ended', playNextSong);
    document.getElementById("player").addEventListener('error', playNextSong);

    document.getElementById("prev").addEventListener('click', playPrevSong);
    document.getElementById("next").addEventListener('click', playNextSong);

    $(document).keydown(function (e) {
        switch (e.which) {
            case 37:
                // left arrow
                playPrevSong();
                break;

            case 39:
                // right arrow
                playNextSong();
                break;

            default:
                return;
        }
        e.preventDefault();
    });

    function playPrevSong() {
        currentlyPlayingFileIndex = playingFileIndex;

        if (playingFileIndex > 0 && playingEntries[playingFileIndex - 1]['fileName'] !== "..") {
            do {
                playingFileIndex--;
            } while (playingFileIndex > 0 && playingEntries[playingFileIndex]['isDirectory'] && playingEntries[playingFileIndex - 1]['fileName'] !== "..");
        }

        if (playingEntries[playingFileIndex]['isDirectory']) {
            playingFileIndex = currentlyPlayingFileIndex;
        }
        playSong();
    }

    function playNextSong() {
        // FIXME: make it similar to playPrevSong, handle more edge cases...
        playingFileIndex++;
        // as long as we find directories we move on...
        while (playingFileIndex < playingEntries.length && playingEntries[playingFileIndex]['isDirectory']) {
            playingFileIndex++;
        }
        if (playingFileIndex !== playingEntries.length) {
            playSong();
        }
    }

    function sortDirectory(a, b) {
        if (a.isDirectory && b.isDirectory) {
            return (a.fileName === b.fileName) ? 0 : (a.fileName < b.fileName) ? -1 : 1;
        }
        if (a.isDirectory && !b.isDirectory) {
            return -1;
        }
        if (!a.isDirectory && b.isDirectory) {
            return 1;
        }
        return (a.fileName === b.fileName) ? 0 : (a.fileName < b.fileName) ? -1 : 1;
    }

    verifyAccessToken(function () {
        renderFolderList("/");
    });

});
