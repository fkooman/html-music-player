remoteStorage.onWidget('ready', function () {

    // rootUri, this should be available through fragment or using Webfinger
    var rootUri = remoteStorage.getStorageHref()+'/';

    var apiScope = ["music:r"];

    var playingFileIndex;
    var playingDirectoryName;
    // the files in the directory from which the current song is being played
    var playingDirectoryEntries;

    var currentDirectoryName;
    var currentDirectoryEntries;

    function renderFolderList(dirName) {
        var accessToken = remoteStorage.getBearerToken();
        var xhr = new XMLHttpRequest();
        xhr.open("GET", rootUri + "music" + dirName, true);
        xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
        xhr.onload = function(e) {
            var response = JSON.parse(xhr.responseText);

            currentDirectoryEntries = new Array();
            // convert the map to an array
            for (i in response) {
                if (i.lastIndexOf("/") === i.length - 1) {
                    // directory
                    currentDirectoryEntries.push({fileName: i.substring(0,i.length-1), fileTime: response[i], isDirectory: true});          
                } else {
                    // file
                    currentDirectoryEntries.push({fileName: i, fileTime: response[i], isDirectory: false});          
                }
            }
            currentDirectoryEntries.sort(sortDirectory);

            if (dirName !== "/") {
                currentDirectoryEntries.unshift({fileName: "..", fileTime: 0, isDirectory: true});
            }

            currentDirectoryName = dirName;
            $("#folderListTable").html($("#folderListTemplate").render({dirName: dirName, entry: currentDirectoryEntries}));
            if (currentDirectoryName === playingDirectoryName) {
                // if we watch the directory again we are playing 
                // from we mark the file playing
                $("tr#entry_" + playingFileIndex).addClass("success");
            }
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
            if (currentDirectoryName === playingDirectoryName) {
                // if we still watch the same directory as where we play 
                // from we mark the file playing
                $("tr#entry_" + playingFileIndex).addClass("success");
            }
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
        var dirName = currentDirectoryEntries[$(this).data('fileIndex')]['fileName'];
        var filePath;
        if (dirName === "..") {
            secondToLastSlash = currentDirectoryName.lastIndexOf("/", currentDirectoryName.length - 2);
            filePath = currentDirectoryName.substring(0, secondToLastSlash + 1);
        } else {
            filePath = currentDirectoryName + currentDirectoryEntries[$(this).data('fileIndex')]['fileName'] + "/";
        }
        renderFolderList(filePath);
    });

    document.getElementById("player").addEventListener('ended', playNextSong);

    document.getElementById("prev").addEventListener('click', function(e) {
        if (currentDirectoryName === playingDirectoryName) {
            // if we still watch the same directory as where we play 
            // from we mark the file as not playing anymore
                $("tr#entry_" + playingFileIndex).removeClass("success");
        }
        playingFileIndex--;
        // as long as we find directories we move on...
        while (playingFileIndex > 0 && playingDirectoryEntries[playingFileIndex]['isDirectory']) {
            playingFileIndex--;
        }
        if (!playingDirectoryEntries[playingFileIndex]['isDirectory']) {
            playSong();
        }
    });

    document.getElementById("prev").addEventListener('click', playPrevSong);
    document.getElementById("next").addEventListener('click', playNextSong);

//    document.getElementById("player").addEventListener('playing', function(e) {
//        $("span#duration").html(Math.floor(document.getElementById("player").duration));
//    });

//    document.getElementById("player").addEventListener('timeupdate', function(e) {
//        $("span#currentTime").html(Math.floor(document.getElementById("player").currentTime));
//    });

    function playPrevSong() {
        if (currentDirectoryName === playingDirectoryName) {
            // if we still watch the same directory as where we play 
            // from we mark the file as not playing anymore
                $("tr#entry_" + playingFileIndex).removeClass("success");
        }
        playingFileIndex--;
        // as long as we find directories we move on...
        while (playingFileIndex >= 0 && playingDirectoryEntries[playingFileIndex]['isDirectory']) {
            playingFileIndex--;
        }
        if (playingFileIndex > 0) {
            playSong();
        }
    }

    function playNextSong() {
        if (currentDirectoryName === playingDirectoryName) {
            // if we still watch the same directory as where we play 
            // from we mark the file as not playing anymore
                $("tr#entry_" + playingFileIndex).removeClass("success");
        }
        playingFileIndex++;
        // as long as we find directories we move on...
        while (playingFileIndex < playingDirectoryEntries.length && playingDirectoryEntries[playingFileIndex]['isDirectory']) {
            playingFileIndex++;
        }
        if (playingFileIndex !== playingDirectoryEntries.length) {
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

    renderFolderList("/");
});
