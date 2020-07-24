// ==UserScript==
// @name         WME NOR DOT Cameras
// @namespace    https://greasyfork.org/en/users/668704-phuz
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @version      1.03
// @description  Overlay NOR DOT Cameras on the WME Map Object
// @author       phuz
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_fetch
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/hls.js@latest
// @require      https://unpkg.com/video.js/dist/video.js
// @require      https://unpkg.com/@videojs/http-streaming/dist/videojs-http-streaming.js
// @connect      jsdelivr.net
// @connect      511pa.com
// @connect      deldot.gov
// @connect      511ny.org
// @connect      511nj.org
/* global OpenLayers */
/* global W */
/* global WazeWrap */
/* global $ */
/* global I18n */
/* global _ */
// ==/UserScript==

let PALayer;
let DELayer;
let NYLayer;
let NJLayer;
var settings;
var video;
var player;
var hls;
const camIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAAGXcA1uAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpBRDNGNTkwRTYzQThFMzExQTc4MDhDNjAwODdEMzdEQSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2OUI0RUEyN0IwRjcxMUUzOERFM0E1OTJCRUY3NTFBOCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2OUI0RUEyNkIwRjcxMUUzOERFM0E1OTJCRUY3NTFBOCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1LjEgV2luZG93cyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZGOEJBMzExNkZCMEUzMTFCOEY5QTU3QUQxM0M2MjI5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkFEM0Y1OTBFNjNBOEUzMTFBNzgwOEM2MDA4N0QzN0RBIi8+IDwvcmRmOkRlc2NyaXB0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';
const warning = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA/ppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ1dWlkOjVEMjA4OTI0OTNCRkRCMTE5MTRBODU5MEQzMTUwOEM4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjk4MDFDMjUwNzIzRDExRTNBQTczRjkyOTZEQ0IyOTY0IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjk4MDFDMjRGNzIzRDExRTNBQTczRjkyOTZEQ0IyOTY0IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIElsbHVzdHJhdG9yIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ1dWlkOmFiMzczNzVkLWIwYTYtNDRjNC04OTE4LWU4M2ZiOTRhOGY4NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpjMjUyYWZlMC1mMjU0LWY5NDMtOGZiZi0wMTc3Mzc1ZWEzYzYiLz4gPGRjOnRpdGxlPiA8cmRmOkFsdD4gPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5JbmNpZGVudHNfb3V0bGluZWQ8L3JkZjpsaT4gPC9yZGY6QWx0PiA8L2RjOnRpdGxlPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pmcc3z4AAASdSURBVHja7FdLaFxVGP7OPfc1M5lMJ5M0Gk0nNdE+sogPLNG2KNaFUksqlkAjSGtcCBJUWgouhErAUOhCwb2uXJQupCtF0I102SrEUsFNkRaxJJ3MTGbu+/j/J2lnKp04HdNkY+AnZ875/u9853/ce65QSmEz/wxs8t//AjZdgDkytL1j5whIaRKgvuERCIH9UDjHpsedRqATJwE8Yimcn5LuVv79deztEQJPU0Nf35AILCZq7lXX3jqds8DGY5574Cmgk6OS4PCoJaamcvSjO9HGY57jtQcqwFPot1V85lhByPHptzBw7jttz9H4eK8hnSQ+4xPmfjhlz5YtbQHprChH6vRrTuXQqddfgP3+HGSuANnVDYw9ix3XL+G3X68UfgkduFJ8L9Y7AvUYL+7MipMndig4eQdKNOqXx07exomdCoxh7LqmIFRwbYHP3t1uYHevgXq9CgRNre/X9ByvMYax7LN+EVA4/XKfMTbRJ3GzYiKs+lCh31gOA4Tlul5jDGPZZ10ERAp7C7aYmX7YgvIl6p4Fv+IjCcJGfZAAvxroNcYwln3Y978KkLVEfXK0z0yPmAbKNYEglAjKAZ06bIpAhKASIvBXMIxlH/Zljo4EcBUvRsl7e7vkgYMZC/Ua554E0An98j8iEFAEyh6CwNQYxrIP+zKH6ERATanhHtP46M2sgxydurRMdeeRAM+Ed8tD4gcNAV6g53zf1BjGsg/7Mgdz3ZcAeqbTo158fiRtP/SMsPAnEYYU3sAz6L+EV/IQeY0ijFnAko+I1lYwhvZhX+ZgLuZsW0BVqalRUx6ckA7lVMH3WMCqhSSEU+A3UhBTOgIWEBp3cOzDvszBXMzZlgCiHcwL8ekbho1UYIAKHoqinfirFlIaKAJJEDfVQKTnYlq7jWMf9mUO5mJO5l5TgNKXDDW3H/bAk7GFcqD0hnGTJTGFWatqdiRRVIS8dheWjDmYizmZW60lgACHt0EemVAOkdFJknubYbtY+nn+jl+ZxobltsQzF3MyN+9xV7cNF4f0YahVBkKlLp6UmeI+Kp4qvX5afjEkCjLloO/QK/rnXxe+pU6gqBiiZUt30Vl/UiHOxsvXLCGeJ+4b4nYEeHBLqVMHLKu4zzWROAmodmC2MEP4SA32Izu6W1u62K/nWuGZizmZm/fgvUTzlWw5US8Nm3JmMuMgQzOlVj2jn3pUSl0mRmY/RveecT2X2TWMq++8Te0QQtj39uSSzdKuk5aD+Uoy80cUX8gY4geTaiRPX2ezk92WMZaTWIiTNV9jyo8gM1m4xcZt2t1WRLrgIi6XIdzW10x6gGNMSkwKyzi7EM/S3pdlKpv7YCJvHf/wURvKVrApXKm1LC1h+SU4jgV7eBddk+qof/Mloks/IpNPI+W29nU5fY7CU90GbgRq8Eo9LplpQ4w/QZeaJBVhgaIr2rnKOGlUzn8BZ/7iynXg6mUYhfRqoP/lzU7p7aUs8Z7pJTEuHisOHe1z8FUPvUljhfY+lVkl9VdSXVrp5QyxUWjR5pe2FBCLVC43fRwTj1Mb0kVypBbrLtqQb3XqYkGZhCPw+98CDACt/EZVMWT0ogAAAABJRU5ErkJggg==';
const PAURL = 'https://www.511pa.com/wsvc/gmap.asmx/buildCamerasJSONjs';
const DEURL = 'https://tmc.deldot.gov/json/videocamera.json';
const NYURL = 'https://511ny.org/api/getcameras?key=da7c6d70f1f84a2eba9aa80fa166b6e8&format=json';
const NJURL = 'https://511nj.org/api/client/camera/GetCameraDataByTourId?tourid=&rnd=202007201015';

(function() {
    'use strict';
    //Check to see if WME Toolbox is running, and if it is, disable this script (hopefully temporary!)
    setTimeout(function() {
        var i=0;
        while(i<document.getElementsByTagName('script').length) {
            if(document.getElementsByTagName('script')[i].src == "chrome-extension://ihebciailciabdiknfomleeccodkdejn/scripts/WME_Toolbox.prod.min.js") {
                alert("WME NOR DOT Cameras cannot run if Toolbox is enabled, due to current issues with the Toolbox extension.  Please disable the Toolbox extension in order to use this script until the issue is resolved.");
                $('#chkEnables').empty();
                document.getElementById('chkEnables').innerHTML = 'Click <a href="https://www.waze.com/forum/viewtopic.php?f=819&t=145570&start=2270#p2078310">here</a> to see the forum post regarding the conflict with the current version of WME Toolbox';
                PALayer.destroy(); DELayer.destroy(); NYLayer.destroy(); NJLayer.destroy();
            }
            i++;
        }
    },5000);
    //Bootstrap
    function bootstrap(tries = 1) {
        if (W && W.loginManager && W.map && W.loginManager.user && W.model
            && W.model.states && W.model.states.getObjectArray().length && WazeWrap && WazeWrap.Ready) {
            console.log("WME NOR DOT Loaded!");
            init();
            installIcon();
        } else if (tries < 1000) {
            setTimeout(function () {bootstrap(++tries);}, 200);
        }
    }
    //Build the Tab and Settings Division
    function init()
    {
        var $section = $("<div>");
        $section.html([
            '<div id="chkEnables">',
            '<table border=1 style="text-align:center;width:100%;padding:10px;">',
            '<tr><td width=50 valign=middle><img src="' + warning + '" height=16 width=16></td><td style="text-align:center">Warning: WME Toolbox has caused interference with methods this script uses to play video feeds.  Until the Toolbox issues are resolved, it needs to remain disabled in order to run this script.</td><td width=50><img src="' + warning + '" height=16 width=16></td></tr>',
            '<tr><td colspan=2 style="text-align:center"><b>Enable</b></td><td style="text-align"><b>State</b></td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkPACamEnabled" class="wmenordotSettingsCheckbox"></td><td align=center>PA</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkDECamEnabled" class="wmenordotSettingsCheckbox"></td><td align=center>DE</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkNYCamEnabled" class="wmenordotSettingsCheckbox"></td><td align=center>NY</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkNJCamEnabled" class="wmenordotSettingsCheckbox"></td><td align=center>NJ</td></tr>',
            '</table>',
            '</div></div>'
        ].join(' '));
        new WazeWrap.Interface.Tab('NORDOTCAM', $section.html(), initializeSettings);
    }
    //Build the State Layers
    function buildDOTCamLayers(state) {
        switch(state) {
            case "PA":
                PALayer = new OpenLayers.Layer.Markers("PALayer");
                W.map.addLayer(PALayer);
                break;
            case "DE":
                DELayer = new OpenLayers.Layer.Markers("DELayer");
                W.map.addLayer(DELayer);
                break;
            case "NY":
                NYLayer = new OpenLayers.Layer.Markers("NYLayer");
                W.map.addLayer(NYLayer);
                break;
            case "NJ":
                NJLayer = new OpenLayers.Layer.Markers("NJLayer");
                W.map.addLayer(NJLayer);
        }
     }
    function getCamFeed(url,type,callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                var result = response.responseText;
                callback(result);
            }
        });
    }
    //Get the PA Camera JSON Feed (We can't used the canned getCamFeed function because of the extra legwork we have to do with the PA feed)
    function getPA() {
        $.ajax ({
            type:       'GET',
            url:        PAURL,
            dataType:   'text',
            success:    function (results) {
                let result = results.toString().match(/camera_data = ([\s\S]*)/);
                var resultObj = JSON.parse(result[1]).cams;
                var i=0;
                while (i<resultObj.length) {
                    drawCameras("PA",resultObj[i].md5,resultObj[i].start_lng,resultObj[i].start_lat,resultObj[i].md5,resultObj[i].title);
                    i++;
                }
            }
        });
    }
    //Get the DE Camera JSON Feed
    function getDE() {
        getCamFeed(DEURL,"json", function(result) {
            var resultObj = JSON.parse(result).videoCameras;
            var i=0;
            while (i<resultObj.length) {
                drawCameras("DE",resultObj[i].id,resultObj[i].lon,resultObj[i].lat,resultObj[i].urls.m3u8s,resultObj[i].title + " (" + resultObj[i].county + ")",550,300);
                i++;
            }
        })
    }
    //Get the NY Camera JSON Feed
    function getNY() {
        getCamFeed(NYURL,"json", function(result) {
            var resultObj = JSON.parse(result);
            var i=0;
            while (i<resultObj.length) {
                if (resultObj[i].VideoUrl != null) {
                    drawCameras("NY",resultObj[i].ID,resultObj[i].Longitude,resultObj[i].Latitude,resultObj[i].VideoUrl,resultObj[i].Name,550,300);
                }
                i++;
            }
        })
    }
    //Get the NJ Camera JSON Feed
    function getNJ() {
        getCamFeed(NJURL,"json", function(result) {
            var resultObj = JSON.parse(result).Data.CameraData;
            var i=0;
            while (i<resultObj.length) {
                drawCameras("NJ",resultObj[i].id,resultObj[i].longitude,resultObj[i].latitude,resultObj[i].CameraMainDetail[0].URL,resultObj[i].name,480,360);
                i++;
            }
        })
    }
    //Generate the Camera markers
    function drawCameras(state,id,x,y,url,title,width,height) {
        var size = new OpenLayers.Size(20,20);
        var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
        var icon = new OpenLayers.Icon(camIcon,size);
        var epsg4326 = new OpenLayers.Projection("EPSG:4326"); //WGS 1984 projection
        var projectTo = W.map.getProjectionObject(); //The map projection (Spherical Mercator)
        var lonLat = new OpenLayers.LonLat(x,y).transform(epsg4326,projectTo);
        var newMarker = new OpenLayers.Marker(lonLat,icon);
        newMarker.title = title;
        newMarker.url = url;
        newMarker.id = id;
        newMarker.width = width;
        newMarker.height = height;
        newMarker.state = state;
        newMarker.events.register('click',newMarker,popupCam);
        switch(state) {
            case "PA":
                PALayer.addMarker(newMarker);
                break;
            case "DE":
                DELayer.addMarker(newMarker);
                break;
            case "NY":
                NYLayer.addMarker(newMarker);
                break;
            case "NJ":
                NJLayer.addMarker(newMarker);
                break;
        }
    }
    //Generate the Camera Popup
    function popupCam(evt) {
        $("#gmPopupContainer").remove ();
        $("#gmPopupContainer").hide ();
        var popupHTMLPA = (['<div id="gmPopupContainer">' +
                            '<center><h3>' + this.title + '</h3><br>' +
                            '<iframe class="video" id="fp_embed_player" src="https://www.511pa.com/flowplayeri.aspx?' + this.url + '"&autoplay=1 style="background: #FFFFFF;margin: 5px 20px;" frameborder=0 width=320 height=240 scrolling=no allowfullscreen=allowfullscreen></iframe>' +
                            '<br><form><button id="gmCloseDlgBtn" type="button">Close</button>' +
                            '</form></div>'
                           ]);
        var popupHTMLDefault = (['<div id="gmPopupContainer">' +
                                 '<center><h3>' + this.title + '</h3>' +
                                 '<div id="videoDiv">' +
                                 '<video id="hlsVideo" width=' + this.width + ' height=' + this.height + ' controls autoplay></video>' +
                                 '</div>' +
                                 '<form><button id="gmCloseDlgBtn" type="button">Close</button></form>' +
                                 '</div>'
                                ]);
        switch(this.state) {
            case PA:
                $("body").append(popupHTMLPA);
                break;
            default:
                var currentCamURL = this.url;
                $("body").append(popupHTMLDefault);
                setTimeout(function () {
                    video = document.getElementById('hlsVideo');
                    var videoSrc = currentCamURL;
                    if (Hls.isSupported()) {
                        hls = new Hls();
                        hls.loadSource(videoSrc);
                        hls.attachMedia(video);
                        hls.on(Hls.Events.MANIFEST_PARSED, function() {
                            video.play();
                        });
                    }
                },1000);
        }
        //Add listener for popup's "Close" button
        $("#gmCloseDlgBtn").click ( function () {
            if (hls) {
                hls.destroy();
            }
            $("#gmPopupContainer").remove ();
            $("#gmPopupContainer").hide ();
        });
        fetch(this.url)
            .then(response => {
            if (!response.ok) {
                //Good feed
                    $('#videoDiv').empty();
                    document.getElementById('videoDiv').innerHTML = "<br>Sorry, this feed is currently offline.";
            } else {
                //Bad Feed
            }
        })
    }
    function initializeSettings()
    {
        loadSettings();
        setChecked('chkPACamEnabled', settings.PACamEnabled);
        setChecked('chkDECamEnabled', settings.DECamEnabled);
        setChecked('chkNYCamEnabled', settings.NYCamEnabled);
        setChecked('chkNJCamEnabled', settings.NJCamEnabled);

        //Add Handler for Checkbox Setting Changes
        $('.wmenordotSettingsCheckbox').change(function() {
            var settingName = $(this)[0].id.substr(3);
            settings[settingName] = this.checked;
            saveSettings();
            if(this.checked) {
                switch(settingName.substring(0,2)) {
                    case "PA":
                        buildDOTCamLayers("PA"); getPA();
                        break;
                    case "DE":
                        buildDOTCamLayers("DE"); getDE();
                        break;
                    case "NY":
                        buildDOTCamLayers("NY"); getNY();
                        break;
                    case "NJ":
                        buildDOTCamLayers("NJ"); getNJ();
                }
            }
            else
            {
                switch(settingName.substring(0,2)) {
                    case "PA":
                        PALayer.destroy();
                        break;
                    case "DE":
                        DELayer.destroy();
                        break;
                    case "NY":
                        NYLayer.destroy();
                        break;
                    case "NJ":
                        NJLayer.destroy();
                }
            }
        });
        if (document.getElementById('chkPACamEnabled').checked) { buildDOTCamLayers("PA"); getPA(); }
        if (document.getElementById('chkDECamEnabled').checked) { buildDOTCamLayers("DE"); getDE(); }
        if (document.getElementById('chkNYCamEnabled').checked) { buildDOTCamLayers("NY"); getNY(); }
        if (document.getElementById('chkNJCamEnabled').checked) { buildDOTCamLayers("NJ"); getNJ(); }
    }
    //Set Checkbox from Settings
    function setChecked(checkboxId, checked) {
        $('#' + checkboxId).prop('checked', checked);
    }
    //Load Saved Settings
    function loadSettings() {
        var loadedSettings = $.parseJSON(localStorage.getItem("Camera_Settings"));
        var defaultSettings = {
            Enabled: false,
        };
        settings = loadedSettings ? loadedSettings : defaultSettings;
        for (var prop in defaultSettings) {
            if (!settings.hasOwnProperty(prop)) {
                settings[prop] = defaultSettings[prop];
            }
        }
    }
    //Save Tab Settings
    function saveSettings() {
        if (localStorage) {
            var localsettings = {
                PACamEnabled: settings.PACamEnabled,
                DECamEnabled: settings.DECamEnabled,
                NYCamEnabled: settings.NYCamEnabled,
                NJCamEnabled: settings.NJCamEnabled,
            };
            localStorage.setItem("Camera_Settings", JSON.stringify(localsettings));
        }
    }
    //Add the Icon Class to OpenLayers
    function installIcon() {
        console.log('Installing OpenLayers.Icon');
        OpenLayers.Icon = OpenLayers.Class({
            url: null,
            size: null,
            offset: null,
            calculateOffset: null,
            imageDiv: null,
            px: null,
            initialize: function(a,b,c,d){
                this.url=a;
                this.size=b||{w: 20,h: 20};
                this.offset=c||{x: -(this.size.w/2),y: -(this.size.h/2)};
                this.calculateOffset=d;
                a=OpenLayers.Util.createUniqueID("OL_Icon_");
                let div = this.imageDiv=OpenLayers.Util.createAlphaImageDiv(a);
                $(div.firstChild).removeClass('olAlphaImg'); // LEAVE THIS LINE TO PREVENT WME-HARDHATS SCRIPT FROM TURNING ALL ICONS INTO HARDHAT WAZERS --MAPOMATIC
            },
            destroy: function(){ this.erase();OpenLayers.Event.stopObservingElement(this.imageDiv.firstChild);this.imageDiv.innerHTML="";this.imageDiv=null; },
            clone: function(){ return new OpenLayers.Icon(this.url,this.size,this.offset,this.calculateOffset); },
            setSize: function(a){ null!==a&&(this.size=a); this.draw(); },
            setUrl: function(a){ null!==a&&(this.url=a); this.draw(); },
            draw: function(a){
                OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv,null,null,this.size,this.url,"absolute");
                this.moveTo(a);
                return this.imageDiv;
            },
            erase: function(){ null!==this.imageDiv&&null!==this.imageDiv.parentNode&&OpenLayers.Element.remove(this.imageDiv); },
            setOpacity: function(a){ OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv,null,null,null,null,null,null,null,a); },
            moveTo: function(a){
                null!==a&&(this.px=a);
                null!==this.imageDiv&&(null===this.px?this.display(!1): (
                    this.calculateOffset&&(this.offset=this.calculateOffset(this.size)),
                    OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv,null,{x: this.px.x+this.offset.x,y: this.px.y+this.offset.y})
                ));
            },
            display: function(a){ this.imageDiv.style.display=a?"": "none"; },
            isDrawn: function(){ return this.imageDiv&&this.imageDiv.parentNode&&11!=this.imageDiv.parentNode.nodeType; },
            CLASS_NAME: "OpenLayers.Icon"
        });
    }
    //--- CSS styles make it work...
    GM_addStyle ("                                      \
#gmPopupContainer {                                     \
position:               fixed;                          \
top:                    10%;                            \
left:                   20%;                            \
padding:                1em;                            \
background:             lightgray;                      \
border:                 3px double black;               \
border-radius:          1ex;                            \
z-index:                777;                            \
display:                flex;                           \
}                                                       \
#gmPopupContainer button{                               \
cursor:                 pointer;                        \
margin:                 1em 1em 0;                      \
border:                 1px outset buttonface;          \
}                                                       \
");
    bootstrap();
})();