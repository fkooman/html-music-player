$(document).ready(function () {

    // rootUri, this should be available through fragment or using Webfinger
    var rootUri = apiEndpoint + "/ffe359e390f5a0bca7c73e97352ae02cc5448ff3/";

    var apiScope = ["music:r"];

    var playingFileIndex;
    var playingDirectoryName;
    // the files in the directory from which the current song is being played
    var playingDirectoryEntries;

    var currentDirectoryName;
    var currentDirectoryEntries;

    jso_configure({
        "html-music-player": {
            client_id: apiClientId,
            authorization: authorizeEndpoint
        }
    });
    jso_ensureTokens({
        "html-music-player": apiScope
    });

    function renderFolderList(dirName) {
        var accessToken = jso_getToken("html-music-player", apiScope);
        var xhr = new XMLHttpRequest();
        xhr.open("GET", rootUri + "music" + dirName, true);
        xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
        xhr.onload = function(e) {
            var response = JSON.parse(xhr.responseText);

            currentDirectoryEntries = new Array();
            // convert the map to an array
            for (i in response) {
                currentDirectoryEntries.push({fileName: i, fileTime: response[i], isDirectory: i.lastIndexOf("/") === i.length - 1});          
            }
            currentDirectoryEntries.sort(sortDirectory);
            currentDirectoryName = dirName;
            $("#folderListTable").html($("#folderListTemplate").render({entry: currentDirectoryEntries}));
        }
        xhr.send();
    }

    function playSong() {
        var accessToken = jso_getToken("html-music-player", apiScope);
        var xhr = new XMLHttpRequest();
        xhr.open("GET", rootUri + "music" + playingDirectoryName + playingDirectoryEntries[playingFileIndex]['fileName'], true);
        xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
        xhr.responseType = "arraybuffer";
        xhr.onload = function(e) {
            var blob = new Blob([xhr.response]);
            document.getElementById("player").src = window.URL.createObjectURL(blob);
            document.getElementById("player").play();
        }
        xhr.send();
    }

    $(document).on('click', '#folderListTable a.file', function() {
        playingDirectoryEntries = currentDirectoryEntries;
        playingFileIndex = $(this).data("fileIndex");
        playingDirectoryName = currentDirectoryName;
        playSong();
    });

    $(document).on('click', '#folderListTable a.dir', function() {
        //alert($(this).data('fileIndex'));
        //alert(JSON.stringify(currentDirectoryEntries[$(this).data('fileIndex')]));

        renderFolderList(currentDirectoryName + currentDirectoryEntries[$(this).data('fileIndex')]['fileName']);
    });

    document.getElementById("player").addEventListener('ended', function(e) {
        playingFileIndex++;
        // as long as we find directories we move on...
        while(playingFileIndex < playingDirectoryEntries.length && playingDirectoryEntries[playingFileIndex]['isDirectory']) {
            playingFileIndex++;
        }
        if(playingFileIndex !== playingDirectoryEntries.length) {
            playSong();
        }
    });

    function sortDirectory(a, b) {
        if(a.isDirectory && b.isDirectory) {
            return (a.fileName === b.fileName) ? 0 : (a.fileName < b.fileName) ? -1 : 1;
        }
        if(a.isDirectory && !b.isDirectory) {
            return -1;
        }
        if(!a.isDirectory && b.isDirectory) {
            return 1;
        }
        return (a.fileName === b.fileName) ? 0 : (a.fileName < b.fileName) ? -1 : 1;
    }

    renderFolderList("/");
});
