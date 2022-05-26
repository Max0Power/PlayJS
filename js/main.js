// created by Jussi Parviainen 2022
"use strict;"

let _PJS_CODE_MIRROR_EDITOR;
let _PJS_CONTAINER_L;
let _PJS_CONTAINER_R;
let _PJS_V_BAR;
let _PJS_CODEAREA;


window.onload = function() {
    // init dom elements:
    _PJS_CONTAINER_L = document.getElementById('pjs_id_container_l');
    _PJS_CONTAINER_R = document.getElementById('pjs_id_container_r');
    _PJS_V_BAR = document.getElementById('pjs_id_v_bar');
    _PJS_CODEAREA = document.getElementById('pjs_id_codearea');

    // init CodeMirror:
    _PJS_CODE_MIRROR_EDITOR = CodeMirror.fromTextArea(_PJS_CODEAREA, {
        lineNumbers: true,
        mode:  "javascript",
        theme: 'monokai'
    });

    // look if url contains parameter for codeinput:
    let url = new URL(window.location.href);
    let url_text = url.searchParams.get("code");
    if (url_text != null) {
        _PJS_CODE_MIRROR_EDITOR.setValue(url_text.toString());
    }
    
    // v-bar drag event by mouse:
    let drag_mouse = false;
    _PJS_V_BAR.addEventListener('mousedown', function(e) {
        drag_mouse = true;
        document.body.style.userSelect = "none";
    });
    window.addEventListener('mousemove', function(e) {
        if (drag_mouse === true) {
            _PJS_HandleDrag(e.clientX);
        }
    });
    window.addEventListener('mouseup', function(e) {drag_mouse = false; document.body.style.userSelect = "auto"; });

    // v-bar drag event by touch:
    let drag_touch = null;
    _PJS_V_BAR.addEventListener('touchstart', function(e) {
        drag_touch = e.changedTouches[e.changedTouches.length - 1].identifier;
        document.body.style.userSelect = "none";
    });
    window.addEventListener('touchmove', function(e) {
        if (drag_touch !== null) {
            let i = 0;
            while(i < e.changedTouches.length) {
                if (e.changedTouches[i].identifier === drag_touch) {
                    _PJS_HandleDrag(e.changedTouches[i].clientX);
                    return;
                }
                i++;
            }
        }
    });
    window.addEventListener('touchend', e => {
        if (drag_touch === null) return;
        let i = 0; 
        while(i < e.changedTouches.length) {
            if (e.changedTouches[i].identifier === drag_touch) { drag_touch = null; return; }
            i++;
        } 
    });

    // window resize:
    window.addEventListener('resize', function(e){
        // make sure that left and right container is sized correctly by calling v-bar drag func:
        _PJS_HandleDrag(_PJS_V_BAR.offsetLeft);
    });
}


function _PJS_HandleDrag(x) {
    if (x < 0) x = 0;
    if (x > window.innerWidth - _PJS_V_BAR.clientWidth) x = window.innerWidth - _PJS_V_BAR.clientWidth;
    let percent = x / window.innerWidth * 100;
    _PJS_V_BAR.style.left = percent + '%';
    _PJS_CONTAINER_L.style.width = percent + '%';
    _PJS_CONTAINER_R.style.width = (100 - percent) - ((_PJS_V_BAR.clientWidth / window.innerWidth) * 100) + '%';
    _PJS_CODE_MIRROR_EDITOR.refresh();
}


function _PJS_EditorRunCode() {
    window.eval(_PJS_CODE_MIRROR_EDITOR.getValue()); 
}


function _PJS_CopyToURL() {
    /*
    // commented will copy url link to clipboard, function changed to replace current window url...
    _PJS_CODEAREA.select();
    _PJS_CODEAREA.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(window.location.href.split('?')[0]+ '?text=' + encodeURIComponent(_PJS_CODE_MIRROR_EDITOR.getValue()));
    */
    history.replaceState({id: 'Play JS', source: 'web'}, 'Play JS', window.location.href.split('?')[0]+ '?code=' + encodeURIComponent(_PJS_CODE_MIRROR_EDITOR.getValue()));
}