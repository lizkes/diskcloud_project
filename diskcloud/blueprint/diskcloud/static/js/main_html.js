var CURRENTPATH = null;
var JSONDATA = null;
var SEPARATORSYMBOL = ">";
var _PATHID = 0;

// init all
get_json('/');

document.querySelector("#logout_btn").addEventListener("click",function(){
    window.location.replace("/diskcloud/?logout=1");
});

function get_json(path){
    fetch("/api/v1/json/" + PARADICT["username"] + path, {credentials: "same-origin"}).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                CURRENTPATH = path;
                JSONDATA = data;
                createDirTable();
                createBreadCrumb();
            })
        } else {
            // pass
        }
    });
}

function createDirTable(path = CURRENTPATH, data = JSONDATA) {
    // If path != "/" and path ends with a slash, remove the slash
    var pathLength = path.length
    if ( path != "/" && path.charAt(pathLength - 1) == "/"){
        path = path.slice(0,pathLength - 1);
    }
    // if dir row or file row exist,remove
    var entryRow = $("#entry_container > .entry_row");
    if(entryRow){
        entryRow.remove();
    }

    var entryContainer = $("#entry_container");
    // create folder row
    for (var n = 0; n < data.directories.length; n++) {
        var folderRow = $("<div class='row folder_row entry_row' id='folder_row" + (n + 1) + "'></div>");
        var nameCol = $("<div class='col-7 media d-flex align-items-center'></div>");
        var iconContainer = $("<div class='icon_container d-flex align-items-center justify-content-center'></div>");
        var icon = $("<div class='folder_icon'></div>");
        var mediaBody = $("<div class='media-body'></div>").text(data.directories[n][0]);
        var sizeCol = $("<div class='col-2 d-flex align-items-center'></div>");
        var mtimeCol = $("<div class='col-3 d-flex align-items-center'></div>").text(data.directories[n][1]);
        iconContainer.append(icon);
        nameCol.append(iconContainer,mediaBody);
        folderRow.append(nameCol,sizeCol,mtimeCol);
        entryContainer.append(folderRow);
    }
    // create file row
    for (var n = 0; n < data.files.length; n++) {
        var fileName = data.files[n][0];
        var fileRow = $("<div class='row file_row entry_row' id='file_row" + (n + 1) + "'></div>");
        var nameCol = $("<div class='col-7 media d-flex align-items-center'></div>");
        var iconContainer = $("<div class='icon_container d-flex align-items-center justify-content-center'></div>");
        var icon = $("<div></div>");
        var mediaBody = $("<div class='media-body'></div>").text(fileName);
        var sizeCol = $("<div class='col-2 d-flex align-items-center'></div>").text(toStandardSize(data.files[n][2]));
        var mtimeCol = $("<div class='col-3 d-flex align-items-center'></div>").text(data.files[n][1]);
        // add icon by file name suffix
        var index = fileName.lastIndexOf(".");
        var suffix = fileName.slice(index + 1).toLowerCase();
        if (index == -1) {
            icon.addClass("unknow_icon");
        } else{
            if (suffix == "apk") {
                icon.addClass("apk_icon");
            } else if (suffix == "json" || suffix == "xml" || suffix == "py" || suffix == "java" || suffix == "bat" || suffix == "c" || suffix == "cpp" || suffix == "sh") {
                icon.addClass("code_icon");
            } else if (suffix == "doc" || suffix == "docx") {
                icon.addClass("doc_icon");
            } else if (suffix == "exe") {
                icon.addClass("exe_icon");
            } else if (suffix == "png" || suffix == "jpg" || suffix == "jpeg" || suffix == "git" || suffix == "ico" || suffix == "bmp") {
                icon.addClass("image_icon");
            } else if (suffix == "wav" || suffix == "ape" || suffix == "flac" || suffix == "wma" || suffix == "mp3" || suffix == "aac") {
                icon.addClass("music_icon");
            } else if (suffix == "pdf") {
                icon.addClass("pdf_icon");
            } else if (suffix == "tar" || suffix == "bz2" || suffix == "gz" || suffix == "xz" || suffix == "wim") {
                icon.addClass("tar_icon");
            } else if (suffix == "txt" || suffix == "log") {
                icon.addClass("txt_icon");
            } else if (suffix == "torrent") {
                icon.addClass("torrent_icon");
            } else if (suffix == "mp4" || suffix == "avi" || suffix == "mpeg" || suffix == "wmv" || suffix == "3gp" || suffix == "mkv" || suffix == "flv" || suffix == "rmvb" || suffix == "mpe" || suffix == "ogg") {
                icon.addClass("video_icon");
            } else if (suffix == "zip" || suffix == "7z") {
                icon.addClass("zip_icon");
            } else {
                icon.addClass("unknow_icon");
            }
        }
        iconContainer.append(icon);
        nameCol.append(iconContainer,mediaBody);
        fileRow.append(nameCol,sizeCol,mtimeCol);
        entryContainer.append(fileRow);
    }
    //bind event function to element
    $("#entry_container > .folder_row").on({
        dblclick: folderRowDblClickHandler
    });
    $(".mouse_menu").on({
        contextmenu: mouseMenuRightClickHandler
    })
    $("#entry_container").on({
        contextmenu: entryContainerRightClickHandler
    })
    $("#entry_container > .entry_row").on({
        click: entryRowClickHandler,
        contextmenu: entryContainerRightClickHandler
    });
}

function createBreadCrumb(addedDirName = "") {
    var col = $('#breadcrumb_row > .col-12');
    //only append
    if(addedDirName != ""){
        var separator = $("<span class='bc_separator'></span>").text(SEPARATORSYMBOL);
        var path = $("<span class='bc_path' id='bc_path" + ++_PATHID + "'></span>").text(addedDirName);
        col.append(separator,path);
    }
    //rewriting
    else{
        var breadCrumbElements = $("#breadcrumb_row span[class^='bc']");
        if(breadCrumbElements){
            breadCrumbElements.remove();
        }
        var rootPath = $("<span class='bc_path' id='bc_path0'></span>").text("Root");
        col.append(rootPath);
        if(CURRENTPATH != "/"){
            var pathArray = CURRENTPATH.slice(1, CURRENTPATH.length - 1).split("/");
            for (var i = 0; i < pathArray.length; i++) {
                var separator = $("<span class='bc_separator'></span>").text(SEPARATORSYMBOL);
                var path = $("<span class='bc_path' id='bc_path" + (i + 1) + "'></span>").text(pathArray[i]);
                col.append(separator,path);
            }
        }
    }
    //bind event function to bc_paths
    var bcPaths = document.querySelectorAll("#breadcrumb_row .bc_path");
    if (bcPaths.length == 1){
        bcPaths[0].addEventListener("click",breadCrumbClickHandler,{once:true});
    }else{
        for(var i = 0; i < bcPaths.length - 1; i++){
            bcPaths[i].addEventListener("click",breadCrumbClickHandler,{once:true});
        }
    }
}
// event handler function
function folderRowDblClickHandler(ev) {
    jumpToDir(ev);
}
function entryRowClickHandler(ev) {
    selected(ev);
}
function entryContainerRightClickHandler(ev){
    ev.stopPropagation();
    if (ev.currentTarget.id == "entry_container"){
        showBlankMenu(ev);
        $(document).off().one("mousedown",hideBlankMenu);
    } else {
        selected(ev);
        showEntryMenu(ev);
        $(document).off().one("mousedown",hideEntryMenu)
    }
}
function breadCrumbClickHandler(ev){
    jumpToBCPath(ev);
}
function openEntryHandler(ev){
    hideEntryMenu(ev,true);
    var dirName = document.querySelector("#" + ev.data.id + " .media-body").innerHTML;
    jumpToDir(ev,dirName);
}
function downloadEntryHandler(ev){
    hideEntryMenu(ev,true);
    var name = document.querySelector("#" + ev.data.id + " .media-body").innerHTML;
    var path = "/api/v1/file/" + PARADICT["username"] + CURRENTPATH + name;
    var modalBody = document.querySelector("#download_confirm_modal .modal-body");
    var modal = $("#download_confirm_modal");
    if(ev.data.id.includes("file_row")){
        modalBody.innerHTML = "确认下载该文件吗？";
    } else {
        modalBody.innerHTML = "确认下载该文件夹吗？";
    }
    $("#hiden_link").attr("href",path);
    $("#download_confirm_modal .btn-primary").off().one("click",function(){
        document.querySelector("#hiden_link").click();
        modal.modal('hide');
    });
    modal.modal('show');
}
function mouseMenuRightClickHandler(ev){
    ev.preventDefault();
    ev.stopPropagation();
}
// Reusable function
function jumpToDir(ev,dirName = "") {
    if(dirName === ""){
        var target = ev.currentTarget.querySelector(".media-body");
        var dirName = target.innerHTML;
    }
    path = CURRENTPATH + dirName + "/";
    get_json(path);
}
function toStandardSize(size) {
    if (size < 1024) {
        unit = "B";
    } else if (size < 1048576) {
        size = parseInt(size / 1024);
        unit = "KB";
    } else if (size < 1073741824) {
        size = parseInt(size / 1048576);
        unit = "MB";
    } else {
        size = parseInt(size / 1073741824);
        unit = "GB";
    }
    standard_size = size.toString() + " " + unit;
    return standard_size;
}
function jumpToBCPath(ev){
    // update CURRENTPATH
    var target = ev.target;
    _PATHID = parseInt(target.id.slice(7));
    if(_PATHID == 0){
        path = "/";
    }else{
        var index = 1;
        for(var i = 0; i < _PATHID; i++){
            index = CURRENTPATH.indexOf("/",index + 1);
        }
        path = CURRENTPATH.slice(0,index + 1);
    }
    get_json(path);
}
function selected(ev){
    var preSelected = document.querySelector("#entry_container > div[class~='selected']");
    if (preSelected) {
        preSelected.classList.remove("selected");
    }
    ev.currentTarget.classList.add("selected");
}
function showEntryMenu(ev){
    ev.preventDefault();
    var operatObjId = ev.currentTarget.id;
    // if it is file_row,don't display open function
    var entryMenuOpen = $("#entry_menu_open");
    if(operatObjId.includes("file_row")){
        if(entryMenuOpen.css("display") != "none"){
            entryMenuOpen.css("display","none");
        }
    } else {
        if(entryMenuOpen.css("display") == "none"){
            entryMenuOpen.css("display","block");
        }
        // bind openEntryHandler to open element
        $("#entry_menu_open").off().one("click",{id : operatObjId},openEntryHandler);
    }
    $("#entry_menu").css({
        "left": ev.pageX,
        "top": ev.pageY,
        "display": "flex"
    });
    // bind eventHandler to other entryMenuElement
    $("#entry_menu_download").off().one("click",{id : operatObjId},downloadEntryHandler);
}
function hideEntryMenu(ev,force){
    if(force == true){
        $("#entry_menu").css("display","none");
    }
    var notHideArea = $("#entry_menu");
    if(!notHideArea.is(ev.target) && notHideArea.has(ev.target).length === 0){
        $("#entry_menu").css("display","none");
    }
}
function showBlankMenu(ev){
    ev.preventDefault();
    $("#blank_menu").css({
        "left": ev.pageX,
        "top": ev.pageY,
        "display": "flex"
    });
}
function hideBlankMenu(ev,force){
    if(force == true){
        $("#blank_menu").css("display","none");
    }
    var notHideArea = $("#blank_menu");
    if(!notHideArea.is(ev.target) && notHideArea.has(ev.target).length === 0){
        $("#blank_menu").css("display","none");
    }
}