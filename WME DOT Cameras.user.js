// ==UserScript==
// @name         WME DOT Cameras
// @namespace    https://greasyfork.org/en/users/668704-phuz
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @version      1.14
// @description  Overlay DOT Cameras on the WME Map Object
// @author       phuz, doctorblah
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_fetch
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/hls.js@latest
// @require      https://unpkg.com/video.js/dist/video.js
// @require      https://unpkg.com/@videojs/http-streaming/dist/videojs-http-streaming.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/x2js/1.2.0/xml2json.min.js
// @connect      jsdelivr.net
// @connect      511pa.com
// @connect      deldot.gov
// @connect      511ny.org
// @connect      511nj.org
// @connect      maryland.gov
// @connect      511virginia.org
// @connect      newengland511.org
// @connect      algotraffic.com
// @connect      nvroads.com
// @connect      tn.gov
// @connect      511ga.org
// @connect      iteriscdn.com
// @connect      skyvdn.com
// @connect      idrivearkansas.com
// @connect      akamaihd.net
// @connect      goakamai.org
// @connect      trafficwise.org
// @connect      ga.gov
// @connect      google.com
// @connect      fl511.com
// @connect      511ia.org
// @connect      idaho.gov
// @connect      arcgis.com
// @connect      kandrive.org
// @connect      mass511.com
// @connect      mi.us
// @connect      511mn.org
// @connect      modot.org
// @connect      mt.gov
// @connect      azureedge.net
// @connect      nebraska.gov
// @connect      nmroads.com
// @connect      ohgo.com
// @connect      tripcheck.com
// @connect      ri.gov
// @connect      utah.gov
// @connect      ca.gov
// @connect      txdot.gov
// @connect      modttraffic.om
// @connect      cttravelsmart.org
// @connect      vaisala.com
// @connect      skyvdn.com
// @connect      cotrip.org
// @connect      austintexas.gov
// @connect      wyoroad.info
/* global OpenLayers */
/* global W */
/* global WazeWrap */
/* global $ */
/* global I18n */
/* global _ */
// ==/UserScript==

let ALLayer, AKLayer, AZLayer, ARLayer, CALayer, COLayer, CTLayer, DELayer, DCLayer, FLLayer, GALayer, HILayer, IDLayer, ILLayer, INLayer, IALayer, KSLayer, KYLayer, LALayer, MELayer, MDLayer, MALayer, MILayer, MNLayer, MSLayer, MOLayer, MTLayer, NELayer, NVLayer, NHLayer, NJLayer, NMLayer, NYLayer, NWLayer, NCLayer, NDLayer, OHLayer, OKLayer, ORLayer, PALayer, RILayer, SCLayer, SDLayer, TNLayer, TXLayer, UTLayer, VTLayer, VALayer, WALayer, WVLayer, WILayer, WYLayer;
var settings, video, player, hls, staticUpdateID,newZIndex;
const x2js = new X2JS();
const camIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAAGXcA1uAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpBRDNGNTkwRTYzQThFMzExQTc4MDhDNjAwODdEMzdEQSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2OUI0RUEyN0IwRjcxMUUzOERFM0E1OTJCRUY3NTFBOCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2OUI0RUEyNkIwRjcxMUUzOERFM0E1OTJCRUY3NTFBOCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1LjEgV2luZG93cyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZGOEJBMzExNkZCMEUzMTFCOEY5QTU3QUQxM0M2MjI5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkFEM0Y1OTBFNjNBOEUzMTFBNzgwOEM2MDA4N0QzN0RBIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+TV0cjwAABbhJREFUeNpiYIAAXiZGCIMPiP//f8DwnwnI+PT/HZD8y8AAEEBQVQzTwOSfuwz/u6qAyh4y/Gf8f4/hPwMnUJSZgQEggMCyzpZAmbsILMTHcAokPhPEWT8dqJoBgvetAtMMDBIiDCf/P4bqeMXwf+t8BiOAAGJAAqVA7A1iPH/+goFBT4OB8f9LJDueAzFQgOHGLoTZYEGgpJgww0+G/68ZQArAEsryEHpRN5BuK4FIcHMhjJORVTvBYG3MwPD2CkKwKAVI/3nBABBAYOcY6zKAjGSQEmP4cGkXxMlgK4BeaCll+B/lzzDh/yegmr8vIO4HGv/l/0eG/w4WDP9fnUM4Dhl/uMzwf/6CFQ4g9RUgE3ctRvgGGSvJMfw/tw3i7sY8hv8sQMGrQE8yuFoBZe8CeRwMDIKaDAyWRgwM2xYD+exA/AuIvwAV3kaE6sSPQCuBHv2vqczwf0YL0MR7SE4CsgsTGP5///aSCZQSGDRVGPJfv2dgNDNkcP30heHbB6BpyzYyMCRVMjCwqDIcOX+LgTEtioGRhfn/P4AAbJTfK0NhGMe/Z+ecpVkrScnIlCiWkoulpFyhxgXKXCGK3XGBG/4BJcoNN665tqsxo6XshiKtyQybn82vMZPF63nPOXKYi+fieU7P8z59P9/n6NlBVNrRRDFPMUlRIGhmM0gWzk5NSCFMuDE2MqAaUJGUhDgOgNmKkXmLwMRudA11diynI9lSKhEHG+oBu9q1mHkDf9AWWkM0dgHEb4H+PqqkKD51uxpJuSoDHpIfAowyohyUveJH+9pqUjigav/9UnIfzO/frkRvBxUuwcpK/gc3PkzfzynuwRoanYuStZDKaeAkwA8QEPJ/CYfpBUCmqxp1E7uXJ6u0tUNVQbvIR+DIBzgHgQMvrZ5LZWIiSuowh6N+nQ9ZYgnNcLTzdRBsz5Ot1socWCr1KipYulrJVDIQjqjwgqsESvcPQB5QWmP2nsWem5X80IeizhaadPfHQwTxnXJTDk5ZQgeOOCC0ScY0wtPdRrc4AzY7BVZuQ8bVDhcXJLyhNnwJUFj5hTQVhmH8mQ7H5nYYkRxJw8hqBWYsLIr+gisKYobdjKguClOKLiQvgrrwqogiIr1wECHdRCCjIopNiCKZIGkthysrrWSklg36M6O5fT3fzmk7C8kDL4zt2/neP8/ze01/b6XuceWsVmAJJR56gurObjSn0/DWrEY152SmIyFBNk1sxZhBZAQTyVmEDjeiy9eAQdm4FK1gLlHg8Y3CYlXzZW12A1+GYd1Yi1u1LogXQSYgmxdnjM8jsTFNZvLMxADE3h0QS8vxNNqLJWKa2ZMXBRXwaaNmL/XdoUct+hhtjF+MFBZ+zJq5Gw6ywoRyI/xs/JjJtCj38+XWo3rGdM6pI3nlqYshmmiGx7fJpLE8rAqGZQy+49o5CNeauoeplJZZPbWfztqSWurvmV/ixrCXQjRSFQE/xI8R/dK44VJae99OorWt/Xh2tZxp0Q+903zynX/q6YLwevgy28IXyiBYxCY3cXYeIvGGRL0Isc697Z5k0NRMQj8Grd92zuDALuAuIRm8CVSohe1uYZ+T74FwADjdBFBh6GgH+mm3ZuLDSb9Ocg9YLNYZOeSyUitevupFeWWVTlzjQ0dNfQJW1fOybulPWlmyZ85wpshQC43/m+9YsR2ZTn9wg5z955+z2FO3H0PRIIqcHHzgPpAgNukwOJzAwCB3NiFQxsyyjJ37J4lMXklpfnaRyidaO3xe7+6h3JmVy2CjkcInD3EO3/T1xsFn3mobX0z+RzkfNAxcpXrIjo+RkFKp0VLkk1hfwwqJr69RODxbcH05gem/wIEN62TV13XuMxNIvqYYqCT6R6x14UHsEarkwhBxJbtnC4wmS9fXDuT2stFkxIDsp4tfbZU5MCr0jnMbIMLoKy7Gc8WunU3rxHMoCmKxUaiqij/5alOWhMPoGAAAAABJRU5ErkJggg==';
const staticIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABDBJREFUeNrEV21sU1UYfu7t7W67tmPrWOYmyYCVTFEhqOlYxBA0sh8CMTgI/sAYRI2gQaMJ/CP+IDFRI/xAA/xSxC8+YhRENNmCQWUThs648LFiR8w2WNttXfdx14/j+561w2W92rq2nmTJes4953nOeZ/zvOdVhBBNAN6MxeK1Z87+hou//oHem4NQFAW5bISDqspSPLB0ARpX3gdNs/ioe5dCA9ev+HoX7H7rBNoudSEyYiAajSEfzWrV4HTo8N7vwRuvrUedp6pbGRufEE+9uB/nL1yjgVo0Pe5FxdySvBDoD4Rx7FQbbdSH+mUefPL+duDLb9pFzYOviPVb9opAcFjkuwVCw+LJrfsk5henLwj1fDsd++g4mtZ4Ue52It+tvMyJDYTFmK3tPqihwQhIgAUBT7WyUgfihBkaGoHKame9JxKiYARSWAQO7b8sMEG3RPydL/1vsSh8tbJeK2sCJ7+7hOOnfoaVwZJewXc8EU/g6Y0rsLLh7twRiIyMY++hM5hTYsf2Zx6Dz9+H3W+fQCAYhmaxIHUIzCMajeOa/yY+3r8N86rdsyMQJYG0nOtE8w+dOHL8R7icNoTDY/jl924MhUfpt33GHLsN6OkbwM49n+LRh++Z6o/TydQtrMKK5XUy5hkR+LMnhF17PsMt2mnZHIcUzcEjLdDJyew2q4y/YURJC3G5+yLqLyqaHGOTOfvT5dt6mYhi6eIafPTeNlSmMbi0BHhSglB45xxfBnE5bMkdCRqP4d675sGzsJJiL3C5qwdXfX3QdQ16kVX+TZ0mCZbXMrP3tAT4aqrqzOPi42Sl73iuEZueaEBFuUv2c/L68Og5fPD595KwqqrT5vFaZslNyyabxYjA85tX4eVnV08b4yy386U1GKewHCYiuq4i02SqZkqAd8873rhuuek3G9Z6J10ukcj4FmRMgONY4rLjzjvKTL/xzK+U6VYIkXsCHEPDiMEggZq1AfL2yZuh5J6AhYTVHxhCM/mDWeOxYCiSVsCzJsCLGrS7feSMV6/3zRjv6LyBA4ebKVSJtIaTk1ygk9n4um9hy6sHsWldAx7yLpKpnI3n6Mk2mV5t9E0WEkhPgBcwExKTCAQjePfQabxz4Oup8FitFumU6ab9EyHN9LjJ7cLDYzLp/Ht+j8v8YeaqLNysjKiartqOrY3w3+iHZs0+x09LbKSbxYuq5VMsYwKOYh0vbH6kIK8jFf9zU1Niy+buzho0icXuqrpLnbBQhgsNRApGYGBwRGK66a2hepfVwllsk++8YAFIMAZ7BmPWUyWmjI4asjRrpbqwnsg0ra3HXLcrL+BUFeHYV62Edbs04+LUf6Wrt4Yfm22ySjLkszvXimCl8dPNWZwsTl9PFqep8pyyWO23LR242OFHb/9gVn6eaTqvqqDyfMl8rF61hMhMlud/CTAAgS0zvPJ72lwAAAAASUVORK5CYII=';
const warning = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA/ppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ1dWlkOjVEMjA4OTI0OTNCRkRCMTE5MTRBODU5MEQzMTUwOEM4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjk4MDFDMjUwNzIzRDExRTNBQTczRjkyOTZEQ0IyOTY0IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjk4MDFDMjRGNzIzRDExRTNBQTczRjkyOTZEQ0IyOTY0IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIElsbHVzdHJhdG9yIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ1dWlkOmFiMzczNzVkLWIwYTYtNDRjNC04OTE4LWU4M2ZiOTRhOGY4NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpjMjUyYWZlMC1mMjU0LWY5NDMtOGZiZi0wMTc3Mzc1ZWEzYzYiLz4gPGRjOnRpdGxlPiA8cmRmOkFsdD4gPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5JbmNpZGVudHNfb3V0bGluZWQ8L3JkZjpsaT4gPC9yZGY6QWx0PiA8L2RjOnRpdGxlPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pmcc3z4AAASdSURBVHja7FdLaFxVGP7OPfc1M5lMJ5M0Gk0nNdE+sogPLNG2KNaFUksqlkAjSGtcCBJUWgouhErAUOhCwb2uXJQupCtF0I102SrEUsFNkRaxJJ3MTGbu+/j/J2lnKp04HdNkY+AnZ875/u9853/ce65QSmEz/wxs8t//AjZdgDkytL1j5whIaRKgvuERCIH9UDjHpsedRqATJwE8Yimcn5LuVv79deztEQJPU0Nf35AILCZq7lXX3jqds8DGY5574Cmgk6OS4PCoJaamcvSjO9HGY57jtQcqwFPot1V85lhByPHptzBw7jttz9H4eK8hnSQ+4xPmfjhlz5YtbQHprChH6vRrTuXQqddfgP3+HGSuANnVDYw9ix3XL+G3X68UfgkduFJ8L9Y7AvUYL+7MipMndig4eQdKNOqXx07exomdCoxh7LqmIFRwbYHP3t1uYHevgXq9CgRNre/X9ByvMYax7LN+EVA4/XKfMTbRJ3GzYiKs+lCh31gOA4Tlul5jDGPZZ10ERAp7C7aYmX7YgvIl6p4Fv+IjCcJGfZAAvxroNcYwln3Y978KkLVEfXK0z0yPmAbKNYEglAjKAZ06bIpAhKASIvBXMIxlH/Zljo4EcBUvRsl7e7vkgYMZC/Ua554E0An98j8iEFAEyh6CwNQYxrIP+zKH6ERATanhHtP46M2sgxydurRMdeeRAM+Ed8tD4gcNAV6g53zf1BjGsg/7Mgdz3ZcAeqbTo158fiRtP/SMsPAnEYYU3sAz6L+EV/IQeY0ijFnAko+I1lYwhvZhX+ZgLuZsW0BVqalRUx6ckA7lVMH3WMCqhSSEU+A3UhBTOgIWEBp3cOzDvszBXMzZlgCiHcwL8ekbho1UYIAKHoqinfirFlIaKAJJEDfVQKTnYlq7jWMf9mUO5mJO5l5TgNKXDDW3H/bAk7GFcqD0hnGTJTGFWatqdiRRVIS8dheWjDmYizmZW60lgACHt0EemVAOkdFJknubYbtY+nn+jl+ZxobltsQzF3MyN+9xV7cNF4f0YahVBkKlLp6UmeI+Kp4qvX5afjEkCjLloO/QK/rnXxe+pU6gqBiiZUt30Vl/UiHOxsvXLCGeJ+4b4nYEeHBLqVMHLKu4zzWROAmodmC2MEP4SA32Izu6W1u62K/nWuGZizmZm/fgvUTzlWw5US8Nm3JmMuMgQzOlVj2jn3pUSl0mRmY/RveecT2X2TWMq++8Te0QQtj39uSSzdKuk5aD+Uoy80cUX8gY4geTaiRPX2ezk92WMZaTWIiTNV9jyo8gM1m4xcZt2t1WRLrgIi6XIdzW10x6gGNMSkwKyzi7EM/S3pdlKpv7YCJvHf/wURvKVrApXKm1LC1h+SU4jgV7eBddk+qof/Mloks/IpNPI+W29nU5fY7CU90GbgRq8Eo9LplpQ4w/QZeaJBVhgaIr2rnKOGlUzn8BZ/7iynXg6mUYhfRqoP/lzU7p7aUs8Z7pJTEuHisOHe1z8FUPvUljhfY+lVkl9VdSXVrp5QyxUWjR5pe2FBCLVC43fRwTj1Mb0kVypBbrLtqQb3XqYkGZhCPw+98CDACt/EZVMWT0ogAAAABJRU5ErkJggg==';
const config = {
    AK: {
        data(res) {
            return res.feed.entry;
        },
        scheme(obj) {
            let cam = obj.gs$cell.inputValue.split("|");
            return {
                state: "AK",
                camType: 1,
                lon: cam[2],
                lat: cam[3],
                src: cam[4],
                desc: cam[5]
            };
        },
        URL: ['https://spreadsheets.google.com/feeds/cells/1TUXtPnGHtcXsHw8Y3nxwqWGH_Waj9dcMlmwTcb2nW2k/4/public/full?alt=json']
    },
    AL: {
        data(res) {
            let cams = [];
            let i = 0;
            while (i < res.length) {
                cams.push(res[i].entries);
                i++;
            }
            return cams.flat();
        },
        scheme(obj) {
            return {
                state: "AL",
                camType: 0,
                lon: obj.longitude,
                lat: obj.latitude,
                src: obj.streamUrl,
                desc: `${obj.primaryRoad} @ ${obj.crossStreet}`,
                width: 480,
                height: 360
            };
        },
        URL: ['https://algotraffic.com/api/v1/layers/cameras']
    },
    AR: {
        data(res) {
            return res.feed.entry;
        },
        scheme(obj) {
            let cam = obj.gs$cell.inputValue.split("|");
            return {
                state: "AR",
                camType: 0,
                lon: cam[2],
                lat: cam[3],
                src: cam[4],
                desc: cam[5],
                width: 480,
                height: 360
            };
        },
        URL: ['https://spreadsheets.google.com/feeds/cells/1TUXtPnGHtcXsHw8Y3nxwqWGH_Waj9dcMlmwTcb2nW2k/12/public/full?alt=json']
    },
    AZ: {
        data(res) {
            return res.feed.entry;
        },
        scheme(obj) {
            let cam = obj.gs$cell.inputValue.split("|");
            return {
                state: "AZ",
                camType: 1,
                lon: cam[2],
                lat: cam[3],
                src: cam[4],
                desc: cam[5]
            };
        },
        URL: ['https://spreadsheets.google.com/feeds/cells/1TUXtPnGHtcXsHw8Y3nxwqWGH_Waj9dcMlmwTcb2nW2k/18/public/full?alt=json']
    },
    CA: {
        data(res) {
            return res.data;
        },
        scheme(obj) {
            return {
                state: "CA",
                camType: 1,
                lon: obj.cctv.location.longitude,
                lat: obj.cctv.location.latitude,
                src: obj.cctv.imageData.static.currentImageURL,
                desc: obj.cctv.location.locationName
            };
        },
        URL: ['http://cwwp2.dot.ca.gov/data/d1/cctv/cctvStatusD01.json', 'http://cwwp2.dot.ca.gov/data/d2/cctv/cctvStatusD02.json', 'http://cwwp2.dot.ca.gov/data/d3/cctv/cctvStatusD03.json', 'http://cwwp2.dot.ca.gov/data/d4/cctv/cctvStatusD04.json', 'http://cwwp2.dot.ca.gov/data/d5/cctv/cctvStatusD05.json', 'http://cwwp2.dot.ca.gov/data/d6/cctv/cctvStatusD06.json', 'http://cwwp2.dot.ca.gov/data/d7/cctv/cctvStatusD07.json', 'http://cwwp2.dot.ca.gov/data/d8/cctv/cctvStatusD08.json', 'http://cwwp2.dot.ca.gov/data/d9/cctv/cctvStatusD09.json', 'http://cwwp2.dot.ca.gov/data/d10/cctv/cctvStatusD10.json', 'http://cwwp2.dot.ca.gov/data/d11/cctv/cctvStatusD11.json', 'http://cwwp2.dot.ca.gov/data/d12/cctv/cctvStatusD12.json']
    },
    CO: { // CO has a streaming camera feed as well, but will require a GET request to get the token and undetermined if it will play even after receiving (didn't work with VLC)
        data(res) {
            return res.CameraDetails.Camera;
        },
        scheme(obj) {
            return {
                state: "CO",
                camType: 1,
                lon: obj.Location.Longitude,
                lat: obj.Location.Latitude,
                src: `https://i.cotrip.org/${obj.CameraView[0].ImageLocation}`,
                desc: obj.Description
            };
        },
        URL: ['https://www.cotrip.org/camera/getStillCameras.do']
    },
    CT: { data(res) {
            return res.feed.entry;
        },
        scheme(obj) {
            let cam = obj.gs$cell.inputValue.split("|");
            return {
                state: "CT",
                camType: 1,
                lon: cam[2],
                lat: cam[3],
                src: cam[4],
                desc: cam[5]
            };
        },
        URL: ["https://spreadsheets.google.com/feeds/cells/1TUXtPnGHtcXsHw8Y3nxwqWGH_Waj9dcMlmwTcb2nW2k/14/public/full?alt=json"]
    },    
    DC: {data(res) {
            return res.feed.entry;
        },
        scheme(obj) {
            let cam = obj.gs$cell.inputValue.split("|");
            return {
                state: "DC",
                camType: 0,
                lon: cam[2],
                lat: cam[3],
                src: cam[4],
                desc: cam[5],
                width: 480,
                height: 360
            };
        },
        URL: ["https://spreadsheets.google.com/feeds/cells/1TUXtPnGHtcXsHw8Y3nxwqWGH_Waj9dcMlmwTcb2nW2k/23/public/full?alt=json"]},
    DE: {
        data(res) {
            return res.videoCameras;
        },
        scheme(obj) {
            return {
                state: "DE",
                camType: 0,
                lon: obj.lon,
                lat: obj.lat,
                src: obj.urls.m3u8s,
                desc: `${obj.title} (${obj.county})`,
                width: 550,
                height: 300
            };
        },
        URL: ['https://tmc.deldot.gov/json/videocamera.json']
    },
    FL: {
        data(res) {
            return res.item2;
        },
        scheme(obj) {
            return {
                state: "FL",
                camType: 1,
                lon: obj.location[1],
                lat: obj.location[0],
                src: `https://fl511.com/map/Cctv/${obj.itemId}`,
                desc: ""
            };
        },
        URL: ['https://fl511.com/map/mapIcons/Cameras']
    },
    GA: {
        data(res) {
            return res.features;
        },
        scheme(obj) {
            /*if (obj.properties.HLS) {return {state: "GA",camType:0,lon:obj.geometry.coordinates[0],lat:obj.geometry.coordinates[1],src:obj.properties.HLS,desc:obj.properties.location_description,width:480,height:360}}
                               else {}*/
            return {
                state: "GA",
                camType: 1,
                lon: obj.geometry.coordinates[0],
                lat: obj.geometry.coordinates[1],
                src: obj.properties.url,
                desc: obj.properties.location_description
            };
        },
        URL: ['http://www.511ga.org/data/geopath/icons.cctv.geojson']
    },
    HI: {
        x(res) {
            return res.ArrayOfCamera.Camera;
        },
        scheme(obj) {
            return {
                state: "HI",
                camType: 1,
                lon: obj.Lon,
                lat: obj.Lat,
                src: obj.CameraImageURL.__text,
                desc: obj.Description
            };
        },
        URL: ['http://goakamai.org/services/MapServiceProxy.asmx/GetFullCameraList']
    },
    IA: {
        data(res) {
            return res;
        },
        scheme(obj) {
            if (obj.views[0].type == "FLASH") { // IA only has RTMP streams currently
                return {
                    state: "IA",
                    camType: 1,
                    lon: obj.location.longitude,
                    lat: obj.location.latitude,
                    src: obj.views[0].videoPreviewUrl,
                    desc: obj.name
                };
            } else {
                return {
                    state: "IA",
                    camType: 1,
                    lon: obj.location.longitude,
                    lat: obj.location.latitude,
                    src: obj.views[0].url,
                    desc: obj.name
                };
            }
        },
        URL: ['https://hb.511ia.org/tgcameras/api/cameras']
    },
    ID: {
        data(res) {
            return res;
        },
        scheme(obj) {
            return {
                state: "ID",
                camType: 1,
                lon: obj.location.longitude,
                lat: obj.location.latitude,
                src: obj.views[0].url,
                desc: `${obj.name} ${obj.location.cityReference}`
            };
        },
        URL: ['https://hb.511.idaho.gov/tgcameras/api/cameras']
    },
    IL: {
        data(res) {
            return res.features;
        },
        scheme(obj) {
            return {
                state: "IL",
                camType: 1,
                lon: obj.attributes.x,
                lat: obj.attributes.y,
                src: obj.attributes.SnapShot,
                desc: obj.attributes.CameraLocation
            };
        },
        URL: ['https://services2.arcgis.com/aIrBD8yn1TDTEXoz/arcgis/rest/services/TrafficCamerasTM_Public/FeatureServer/0//query?where=y+%3E+0&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=']
    },
    IN: {
        data(res) {
            return res.features;
        },
        scheme(obj) {
            return {
                state: "IN",
                camType: 1,
                lon: obj.geometry.coordinates[0],
                lat: obj.geometry.coordinates[1],
                src: `http://pws.trafficwise.org/${obj.properties.image}`,
                desc: obj.properties.description
            };
        },
        URL: ['http://pws.trafficwise.org/aries/cctv.json']
    }, //non-HTTPS will flag mixed media erro},
    KS: {
        data(res) {
            return res.features;
        },
        scheme(obj) {
            return {
                state: "KS",
                camType: 1,
                lon: obj.attributes.lon,
                lat: obj.attributes.lat,
                src: `http://www.kandrive.org/cameras/${obj.attributes.url}`,
                desc: obj.attributes.location
            };
        },
        URL: ['https://www.kandrive.org/arcgis/rest/services/kandrive/Devices/MapServer/0/query?where=lat+%3E+0&text=camera&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&having=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&f=pjson']
    },
    KY: {
        data(res) {
            return res.features;
        },
        scheme(obj) {
            return {
                state: "KY",
                camType: 1,
                lon: obj.attributes.longitude,
                lat: obj.attributes.latitude,
                src: obj.attributes.snapshot,
                desc: obj.attributes.description
            };
        },
        URL: ['https://services2.arcgis.com/CcI36Pduqd0OR4W9/arcgis/rest/services/trafficCamerasCur_Prd/FeatureServer/0/query?where=id+%3E+0&objectIds=&time=&geometry=&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=']
    },
    LA: {
        data(res) {
            return res.feed.entry;
        },
        scheme(obj) {
            let cam = obj.gs$cell.inputValue.split("|");
            if (cam[6] == "0") {
                return {
                    state: "LA",
                    camType: 0,
                    lon: cam[2],
                    lat: cam[3],
                    src: cam[4],
                    desc: cam[5],
                    width: 480,
                    height: 360
                };
            } else {
                return {
                    state: "LA",
                    camType: 1,
                    lon: cam[2],
                    lat: cam[3],
                    src: cam[4],
                    desc: cam[5]
                };
            }
        },
        URL: ['https://spreadsheets.google.com/feeds/cells/1TUXtPnGHtcXsHw8Y3nxwqWGH_Waj9dcMlmwTcb2nW2k/20/public/full?alt=json']
    },
    MA: {
        data(res) {
            return res;
        },
        scheme(obj) {
            return {
                state: "MA",
                camType: 1,
                lon: obj.location[1],
                lat: obj.location[0],
                src: `https://mass511.com/map/Cctv/${obj.itemId}`,
                desc: ""
            };
        },
        URL: ['https://mass511.com/map/mapIcons/Cameras']
    },
    MD: {
        data(res) {
            return res.data;
        },
        scheme(obj) {
            return {
                state: "MD",
                camType: 0,
                lon: obj.lon,
                lat: obj.lat,
                src: `https://${obj.cctvIp}/rtplive/${obj.id}/playlist.m3u8`,
                desc: obj.description,
                width: 480,
                height: 360
            };
        },
        URL: ['https://chartexp1.sha.maryland.gov//CHARTExportClientService/getCameraMapDataJSON.do']
    },
    MI: {
        data(res) {
            return res;
        },
        scheme(obj) {
            return {
                state: "MI",
                camType: 1,
                lon: obj.county.match(/(?<=lon=)[\s\S]*(?=&zoom)/)[0],
                lat: obj.county.match(/(?<=lat=)[\s\S]*(?=&lon)/)[0],
                src: obj.image.match(/(?<=src=")[\s\S]*(?=" height=)/)[0],
                desc: `${obj.route} ${obj.location}`
            };
        },
        URL: ['https://mdotjboss.state.mi.us/MiDrive//camera/list']
    },
    MN: {
        data(res) {
            return res;
        },
        scheme(obj) {
            if (obj.views[0].type == "WMP") {
                return {
                    state: "MN",
                    camType: 0,
                    lon: obj.location.longitude,
                    lat: obj.location.latitude,
                    src: obj.views[0].url,
                    desc: `${obj.location.routeId} - ${obj.location.cityReference}`,
                    width: 480,
                    height: 360
                };
            } else {
                return {
                    state: "MN",
                    camType: 1,
                    lon: obj.location.longitude,
                    lat: obj.location.latitude,
                    src: obj.views[0].url,
                    desc: `${obj.location.routeId} - ${obj.location.cityReference}`
                };
            }
        },
        URL: ['https://hb.511mn.org/tgcameras/api/cameras']
    },
    MO: {
        data(res) {
            return res.CameraArray;
        },
        scheme(obj) {
            return {
                state: "MO",
                camType: 1,
                lon: obj.VERTICES.VERTEX_TYPE.X,
                lat: obj.VERTICES.VERTEX_TYPE.Y,
                src: obj.ImageName,
                desc: obj.Description
            };
        },
        URL: ['http://traveler.modot.org/timconfig/feed/desktop/cameras.json'] // This is disabled until they serve over HTTPS https://traveler.modot.org/timconfig/feed/desktop/StreamingCams2.json
    },
    MS: {data(res) {
            return res.feed.entry;
        },
        scheme(obj) {
            let cam = obj.gs$cell.inputValue.split("|");
            return {
                state: "MS",
                camType: 0,
                lon: cam[2],
                lat: cam[3],
                src: cam[4],
                desc: cam[5],
                width: 480,
                height: 360
            };
        },
        URL: ['https://spreadsheets.google.com/feeds/cells/1TUXtPnGHtcXsHw8Y3nxwqWGH_Waj9dcMlmwTcb2nW2k/16/public/full?alt=json']
    },
    MT: {
        URL: ['http://roadreport.mdt.mt.gov/map/getRWISMarkers.php']
    },
    NC: {
        data(res) {
            return res.features;
        },
        scheme(obj) {
            return {
                state: "NC",
                camType: 1,
                lon: obj.attributes.Longitude,
                lat: obj.attributes.Latitude,
                src: obj.attributes.Link,
                desc: obj.attributes.Location
            };
        },
        URL: ['https://services.arcgis.com/NuWFvHYDMVmmxMeM/ArcGIS/rest/services/NCDOT_TIMSCameras/FeatureServer/0/query?where=Latitude+%3E+0&objectIds=&time=&geometry=&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=']
    },
    ND: {
        data(res) {
            return res.features;
        },
        scheme(obj) {
            return {
                state: "ND",
                camType: 1,
                lon: obj.geometry.coordinates[0],
                lat: obj.geometry.coordinates[1],
                src: obj.properties.Cameras[0].LinkPath,
                desc: obj.properties.Cameras[0].Description
            };
        },
        URL: ['https://dotfiles.azureedge.net/geojson/cameras/1595519913757/cameras.json']
    },
    NE: {
        data(res) {
            return res;
        },
        scheme(obj) {
            return {
                state: "NE",
                camType: 1,
                lon: obj.location.longitude,
                lat: obj.location.latitude,
                src: obj.views[0].url,
                description: obj.name
            };
        },
        URL: ['https://hb.511.nebraska.gov/tgcameras/api/cameras']
    },
    NJ: {
        data(res) {
            return res.Data.CameraData;
        },
        scheme(obj) {
            return {
                state: "NJ",
                camType: 0,
                lon: obj.longitude,
                lat: obj.latitude,
                src: obj.CameraMainDetail[0].URL,
                desc: obj.name,
                width: 480,
                height: 360
            };
        },
        URL: ['https://511nj.org/api/client/camera/GetCameraDataByTourId?tourid=&rnd=202007201015']
    },
    NM: {
        data(res) {
            return res.cameraInfo;
        },
        scheme(obj) {
            return {
                state: "NM",
                camType: 1,
                lon: obj.lon,
                lat: obj.lat,
                src: obj.snapshotFile,
                desc: obj.title
            };
        },
        URL: ['https://servicev4.nmroads.com/RealMapWAR//GetCameraInfo']
    },
    NV: {
        x(res) {
            return res.ArrayOfCamera.Camera;
        },
        scheme(obj) {
            return {
                state: "NV",
                camType: 0,
                lon: obj.Lon,
                lat: obj.Lat,
                src: obj.StreamingURL.__text,
                desc: obj.Description,
                width: 480,
                height: 360
            };
        },
        URL: ['https://nvroads.com/services/MapServiceProxy.asmx/GetFullCameraList']
    },
    NW: {
        data(res) {
            return res;
        },
        scheme(obj) {
            return {
                state: "NW",
                camType: 1,
                lon: obj.Longitude,
                lat: obj.Latitude,
                src: obj.ImageUrl,
                desc: obj.Name
            };
        },
        URL: ['http://newengland511.org/Traffic/GetCameras']
    },
    NY: {
        data(res) {
            return res.feed.entry;
        },
        scheme(obj) {
            let cam = obj.gs$cell.inputValue.split("|");
            if (cam[6] == "0") {
                return {
                    state: "NY",
                    camType: 0,
                    lon: cam[2],
                    lat: cam[3],
                    src: cam[4],
                    desc: cam[5],
                    width: 480,
                    height: 360
                };
            } else {
                return {
                    state: "NY",
                    camType: 1,
                    lon: cam[2],
                    lat: cam[3],
                    src: cam[4],
                    desc: cam[5]
                };
            }
        },
        URL: ['https://spreadsheets.google.com/feeds/cells/1TUXtPnGHtcXsHw8Y3nxwqWGH_Waj9dcMlmwTcb2nW2k/6/public/full?alt=json']
    },
    OH: {
        data(res) {
            return res;
        },
        scheme(obj) {
            return {
                state: "OH",
                camType: 1,
                lon: obj.Longitude,
                lat: obj.Latitude,
                src: obj.Cameras[0].LargeURL,
                desc: obj.Location
            };
        },
        URL: ['https://api.ohgo.com/roadmarkers/cameras']
    },
    OR: {
        data(res) {
            return res.features;
        },
        scheme(obj) {
            return {
                state: "OR",
                camType: 1,
                lon: obj.attributes.longitude,
                lat: obj.attributes.latitude,
                src: `https://tripcheck.com/RoadCams/cams/${obj.attributes.filename}`,
                desc: obj.attributes.title
            };
        },
        URL: ['https://www.tripcheck.com/Scripts/map/data/cctvinventory.js']
    },
    PA: {
        y(res) {
            return res.cams;
        },
        scheme(obj) {
            return {
                state: "PA",
                camType: 2,
                lon: obj.start_lng,
                lat: obj.start_lat,
                src: obj.md5,
                desc: obj.title
            };
        },
        URL: ['https://www.511pa.com/wsvc/gmap.asmx/buildCamerasJSONjs']
    },
    RI: {
        data(res) {
            return res.features;
        },
        scheme(obj) {
            return {
                state: "RI",
                camType: 1,
                lon: obj.attributes.Longitude,
                lat: obj.attributes.Latitude,
                src: obj.attributes.CCVEWebURL,
                desc: obj.attributes.Description
            };
        },
        URL: ['https://vueworks.dot.ri.gov/arcgis/rest/services/VUEWorks_V10_2/MapServer/24/query?where=OBJECTID+%3E+0&text=&objectIds=&time=&geometry=&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson']
    },
    SC: {
        data(res) {
            return res.features;
        },
        scheme(obj) {
            return {
                state: "SC",
                camType: 0,
                lon: obj.geometry.coordinates[0],
                lat: obj.geometry.coordinates[1],
                src: obj.properties.https_url,
                desc: obj.properties.title,
                width: 480,
                height: 360
            };
        },
        URL: ['https://files0.beta.iteriscdn.com/WebApps/SC/SafeTravel4/data/geojson/icons/metadata/icons.cctv.geojson']
    },
    TN: {
        data(res) {
            return res.actions;
        },
        scheme(obj) {
            return {
                state: "TN",
                camType: 0,
                lon: obj.dataItem.coordinates.lng,
                lat: obj.dataItem.coordinates.lat,
                src: obj.dataItem.httpsVideoUrl,
                desc: obj.dataItem.title,
                width: 480,
                height: 360
            };
        },
        URL: ['https://smartway.tn.gov/Traffic/api/Cameras/0']
    },
    TX: {data(res) {return res},scheme(obj) {return {state:"TX",camType:1,lon:obj.location.longitude,lat:obj.location.latitude,src:obj.screenshot_address,desc:obj.location_name}},
        URL: ['https://data.austintexas.gov/resource/b4k4-adkb.json']
    }, // TX isn't working until we figure out POST/response
    UT: {
        x(res) {
            return res.kml.Document.Placemark;
        },
        scheme(obj) {
            let coordinates = obj.Point.coordinates.split(",");
            return {
                state: "UT",
                camType: 1,
                lon: coordinates[0],
                lat: coordinates[1],
                src: obj.ExtendedData.SchemaData.SimpleData[6].__text,
                desc: obj.name
            };
        },
        URL: ['https://www.udottraffic.utah.gov/KmlFile.aspx?kmlFileType=Camera']
    },
    VA: {
        data(res) {
            return res.features;
        },
        scheme(obj) {
            return {
                state: "VA",
                camType: 0,
                lon: obj.geometry.coordinates[0],
                lat: obj.geometry.coordinates[1],
                src: obj.properties.https_url,
                desc: obj.properties.description
            };
        },
        URL: ["https://www.511virginia.org/data/geojson/icons.cameras.geojson"]
    },
    WA: {
        data(res) {
            return res.feed.entry;
        },
        scheme(obj) {
            let cam = obj.gs$cell.inputValue.split("|");
            return {
                state: "WA",
                camType: 1,
                lon: cam[2],
                lat: cam[3],
                src: cam[4],
                desc: cam[5]
            };
        },
        URL: ['https://spreadsheets.google.com/feeds/cells/1TUXtPnGHtcXsHw8Y3nxwqWGH_Waj9dcMlmwTcb2nW2k/10/public/full?alt=json']
    },
    WI: {
        data(res) {
            return res.feed.entry;
        },
        scheme(obj) {
            let cam = obj.gs$cell.inputValue.split("|");
            return {
                state: "WI",
                camType: 1,
                lon: cam[2],
                lat: cam[3],
                src: cam[4],
                desc: cam[5]
            };
        },
        URL: ['https://spreadsheets.google.com/feeds/cells/1TUXtPnGHtcXsHw8Y3nxwqWGH_Waj9dcMlmwTcb2nW2k/8/public/full?alt=json']
    },
    WY: {data(res) {
        return res.features},
         scheme(obj) {
             let LonLat = new OpenLayers.LonLat([obj.geometry.x,obj.geometry.y]).transform('EPSG:3857','EPSG:4326')
             console.log(obj.attributes.IMAGEMARKUP.match(/(?=https:\/\/webcams)[\s\S]*?(?<=\.jpg)/)[0])
             return {state:"WY",camType:1,lon:LonLat.lon,lat:LonLat.lat,src:obj.attributes.IMAGEMARKUP.match(/(?=https:\/\/webcams)[\s\S]*?(?<=\.jpg)/)[0],desc:obj.attributes.IMAGEMARKUP.match(/(?<=<p><i>)[\s\S]*?(?=<\/i><br\/><a href)/)[0]}
         },
    URL: ['https://map.wyoroad.info/wtimap/data/wtimap-webcameras.json']
        }
};


(function () {
    'use strict';
    //Bootstrap
    function bootstrap(tries = 1) {
        if (W && W.loginManager && W.map && W.loginManager.user && W.model && W.model.states && W.model.states.getObjectArray().length && WazeWrap && WazeWrap.Ready) {
            console.log("WME DOT Cameras Loaded!");
            init();
            if (!OpenLayers.Icon) {
                installIcon();
            }
        } else if (tries < 1000) {
            setTimeout(function () {
                bootstrap(++tries);
            }, 200);
        }
    }
    //Build the Tab and Settings Division
    function init() {
        var $section = $("<div>");
        $section.html([
            '<div id="chkEnables">',
            '<table border=1 style="text-align:center;width:100%;padding:10px;">',
            '<tr><td width=50 valign=middle><img src="' + warning + '" height=16 width=16></td><td style="text-align:center">Warning: WME Toolbox has caused interference with methods this script uses to play video feeds.  Until the Toolbox issues are resolved, it needs to remain disabled in order to run this script.</td><td width=50><img src="' + warning + '" height=16 width=16></td></tr>',
            '<tr><td colspan=2 style="text-align:center"><b>Enable</b></td><td style="text-align"><b>State</b></td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkAKCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>AK</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkALCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>AL</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkARCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>AR</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkAZCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>AZ</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkCACamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>CA</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkCOCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>CO</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkCTCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>CT</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkDCCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>DC</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkDECamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>DE</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkFLCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>FL</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkGACamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>GA</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkHICamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>HI</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkIACamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>IA</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkIDCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>ID</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkILCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>IL</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkINCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>IN</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkKSCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>KS</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkKYCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>KY</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkLACamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>LA</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkMACamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>MA</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkMDCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>MD</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkMICamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>MI</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkMNCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>MN</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkMOCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>MO</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkMSCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>MS</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkMTCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>MT</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkNCCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>NC</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkNDCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>ND</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkNECamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>NE</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkNWCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>New England</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkNJCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>NJ</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkNMCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>NM</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkNVCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>NV</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkNYCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>NY</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkOHCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>OH</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkOKCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>OK</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkORCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>OR</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkPACamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>PA</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkRICamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>RI</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkSCCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>SC</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkSDCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>SD</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkTNCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>TN</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkTXCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>TX (Austin only)</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkUTCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>UT</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkVACamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>VA</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkWACamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>WA</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkWICamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>WI</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkWVCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>WV</td></tr>',
            '<tr><td colspan=2 align=center><input type="checkbox" id="chkWYCamEnabled" class="wmedotSettingsCheckbox"></td><td align=center>WY</td></tr>',
            '</table>',
            'Click <a href="https://www.waze.com/forum/viewtopic.php?f=819&t=145570&start=2270#p2078310">here</a> to see the forum post regarding the conflict with the current version of WME Toolbox',
            '</div></div>'
        ].join(' '));
        new WazeWrap.Interface.Tab('DOT Cameras', $section.html(), initializeSettings);
    }
    //Build the State Layers
    function buildDOTCamLayers(state) {
        eval(state.substring(0, 2) + 'Layer = new OpenLayers.Layer.Markers(' + state.substring(0, 2) + 'Layer)');
        eval('W.map.addLayer(' + state.substring(0, 2) + 'Layer)');
        eval(state + "Layer.setZIndex(" + newZIndex + ")");
    }

    function getCamFeed(url, type, callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function (response) {
                var result = response.responseText;
                callback(result);
            }
        });
    }

    function getCam(state) {
        let j = 0;
        while (j < state.URL.length) {
            getCamFeed(state.URL[j], "json", function (res) {
                let resultObj = [];
                if (state.x) {
                    resultObj = state.x(x2js.xml_str2json(res));
                } else if (state.y) {
                    resultObj = state.y(JSON.parse(res.toString().match(/(?<=camera_data = )[\s\S]*/)));
                } else {
                    resultObj = state.data(JSON.parse(res));
                }
                let i = 0;
                while (i < resultObj.length) {
                    drawCam(state.scheme(resultObj[i]));
                    i++;
                }
            });
            j++;
        }
    }
    function drawCam(spec) {
        var size = new OpenLayers.Size(20, 20);
        var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
        var icon = new OpenLayers.Icon(camIcon, size);
        var epsg4326 = new OpenLayers.Projection("EPSG:4326"); //WGS 1984 projection
        var projectTo = W.map.getProjectionObject(); //The map projection (Spherical Mercator)
        var lonLat = new OpenLayers.LonLat(spec.lon, spec.lat).transform(epsg4326, projectTo);
        var newMarker = new OpenLayers.Marker(lonLat, icon);
        newMarker.title = spec.desc;
        newMarker.url = spec.src;
        newMarker.width = spec.width;
        newMarker.height = spec.height;
        newMarker.state = spec.state;
        newMarker.camType = spec.camType;
        newMarker.location = lonLat;
        newMarker.events.register('click', newMarker, popupCam);
        eval(spec.state + 'Layer.addMarker(newMarker)');
    }
    //Generate the Camera Popup
    function popupCam(evt) {
        //Check to see if WME Toolbox is running, and if it is, go no further (hopefully temporary!)
        var i = 0;
        while (i < document.getElementsByTagName('script').length) {
            if (document.getElementsByTagName('script')[i].src == "chrome-extension://ihebciailciabdiknfomleeccodkdejn/scripts/WME_Toolbox.prod.min.js") {
                alert("WME DOT Cameras cannot run if Toolbox is enabled, due to current issues with the Toolbox extension.  Please disable the Toolbox extension in order to use this script until the issue is resolved.");
                return;
            }
            i++;
        }
        clearInterval(staticUpdateID);
        $("#gmPopupContainer").remove();
        $("#gmPopupContainer").hide();
        W.map.moveTo(this.location);
        console.log(this.url)
        var popupHTML = [];
        popupHTML[0] = (['<div id="gmPopupContainer" style="margin: 1;text-align: center;padding: 5px">' +
                         '<a href="#close" id="gmCloseDlgBtn" title="Close" class="modalclose" style="color:#FF0000;">X</a>' +
                         '<table border=0><tr><td><div id="mydivheader" style="min-height: 20px;"></div></td></tr>' +
                         '<tr><td><center><h4>' + this.title + '</h4></td></tr>' +
                         '<tr><td><div id="videoDiv">' +
                         '<video id="hlsVideo" width=' + this.width + ' height=' + this.height + ' controls autoplay></video>' +
                         '</div></td></tr>' +
                         '</table></div>'
                        ]);
        popupHTML[1] = (['<div id="gmPopupContainer" style="margin: 1;text-align: center;padding: 5px">' +
                         '<a href="#close" id="gmCloseDlgBtn" title="Close" class="modalclose" style="color:#FF0000;">X</a>' +
                         '<table border=0><tr><td><div id="mydivheader" style="min-height: 20px;"></div></td></tr>' +
                         '<tr><td><center><h4>' + this.title + '</h4></td></tr>' +
                         '<tr><td><img src="' + this.url + '" style="width:400px" id="staticimage"></td></tr>' +
                         '</table></div>'
                        ]);
        popupHTML[2] = (['<div id="gmPopupContainer" style="margin: 1;text-align: center;padding: 5px">' +
                         '<a href="#close" id="gmCloseDlgBtn" title="Close" class="modalclose" style="color:#FF0000;">X</a>' +
                         '<table border=0><tr><td><div id="mydivheader" style="min-height: 20px;"></div></td></tr>' +
                         '<tr><td><center><h4>' + this.title + '</h4></td></tr>' +
                         '<tr><td><iframe class="video" id="fp_embed_player" src="https://www.511pa.com/flowplayeri.aspx?CAMID=' + this.url + '"&autoplay=1 style="background: #FFFFFF;margin: 5px 20px;" frameborder=0 width=320 height=240 scrolling=no allowfullscreen=allowfullscreen></iframe></td></tr>' +
                         '</table></div>'
                        ]);
        var currentCamURL = this.url;
        switch (this.camType) {
            case 0:
                $("body").append(popupHTML[0]);
                setTimeout(function () {
                    video = document.getElementById('hlsVideo');
                    var videoSrc = currentCamURL;
                    if (hls) {hls.destroy();}
                    if (Hls.isSupported()) {
                        console.log('Loading video from ' + videoSrc);
                        hls = new Hls();
                        hls.loadSource(videoSrc);
                        hls.attachMedia(video);
                        hls.on(Hls.Events.MANIFEST_PARSED, function () {
                            video.play();
                        });
                    }
                }, 1000);
                break;
            case 1:
                $("body").append(popupHTML[1]);
                staticUpdateID = setInterval(function () {
                    var camImage = document.getElementById('staticimage');
                    if (currentCamURL.includes('?')) {camImage.src = `${currentCamURL}&rand=${Math.random()}`}
                    else {camImage.src = currentCamURL + '?rand=' + Math.random();}
                }, 5000);
                break;
            case 2:
                $("body").append(popupHTML[2]);
        }
        //Position the modal based on the position of the click event
        $("#gmPopupContainer").css({left: document.getElementById("user-tabs").offsetWidth + W.map.getPixelFromLonLat(W.map.getCenter()).x - document.getElementById("gmPopupContainer").clientWidth - 10 });
        $("#gmPopupContainer").css({top: document.getElementById("left-app-head").offsetHeight + W.map.getPixelFromLonLat(W.map.getCenter()).y - (document.getElementById("gmPopupContainer").clientHeight / 2) });
        //Add listener for popup's "Close" button
        $("#gmCloseDlgBtn").click(function () {
            if (hls) {
                hls.destroy();
            }
            clearInterval(staticUpdateID);
            $("#gmPopupContainer").remove();
            $("#gmPopupContainer").hide();
        });
        dragElement(document.getElementById("gmPopupContainer"));
        fetch(this.url)
            .then(response => {
                if (!response.ok) {
                    //Good feed
                    $('#videoDiv').empty();
                    document.getElementById('videoDiv').innerHTML = "<br>Sorry, this feed is currently offline.";
                } else {
                    //Bad Feed
                }
            });
    }
    // Make the DIV element draggable:
    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById("mydivheader")) {
            // if present, the header is where you move the DIV from:
            document.getElementById("mydivheader").onmousedown = dragMouseDown;
        } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    function initializeSettings() {
        loadSettings();
        setChecked('chkAKCamEnabled', settings.AKCamEnabled);
        setChecked('chkALCamEnabled', settings.ALCamEnabled);
        setChecked('chkARCamEnabled', settings.ARCamEnabled);
        setChecked('chkAZCamEnabled', settings.AZCamEnabled);
        setChecked('chkCACamEnabled', settings.CACamEnabled);
        setChecked('chkCOCamEnabled', settings.COCamEnabled);
        setChecked('chkCTCamEnabled', settings.CTCamEnabled);
        setChecked('chkDCCamEnabled', settings.DCCamEnabled);
        setChecked('chkDECamEnabled', settings.DECamEnabled);
        setChecked('chkFLCamEnabled', settings.FLCamEnabled);
        setChecked('chkGACamEnabled', settings.GACamEnabled);
        setChecked('chkHICamEnabled', settings.HICamEnabled);
        setChecked('chkIACamEnabled', settings.IACamEnabled);
        setChecked('chkIDCamEnabled', settings.IDCamEnabled);
        setChecked('chkILCamEnabled', settings.ILCamEnabled);
        setChecked('chkINCamEnabled', settings.INCamEnabled);
        setChecked('chkKSCamEnabled', settings.KSCamEnabled);
        setChecked('chkKYCamEnabled', settings.KYCamEnabled);
        setChecked('chkLACamEnabled', settings.LACamEnabled);
        setChecked('chkMACamEnabled', settings.MACamENabled);
        setChecked('chkMDCamEnabled', settings.MDCamEnabled);
        setChecked('chkMICamEnabled', settings.MICamEnabled);
        setChecked('chkMNCamEnabled', settings.MNCamEnabled);
        setChecked('chkMOCamEnabled', settings.MOCamEnabled);
        setChecked('chkMSCamEnabled', settings.MSCamEnabled);
        setChecked('chkMTCamEnabled', settings.MTCamEnabled);
        setChecked('chkNCCamEnabled', settings.NCCamEnabled);
        setChecked('chkNDCamEnabled', settings.NDCamEnabled);
        setChecked('chkNECamEnabled', settings.NECamEnabled);
        setChecked('chkNWCamEnabled', settings.NWCamEnabled);
        setChecked('chkNJCamEnabled', settings.NJCamEnabled);
        setChecked('chkNMCamEnabled', settings.NMCamEnabled);
        setChecked('chkNVCamEnabled', settings.NVCamEnabled);
        setChecked('chkNYCamEnabled', settings.NYCamEnabled);
        setChecked('chkOHCamEnabled', settings.OHCamEnabled);
        setChecked('chkOKCamEnabled', settings.OKCamEnabled);
        setChecked('chkORCamEnabled', settings.ORCamEnabled);
        setChecked('chkPACamEnabled', settings.PACamEnabled);
        setChecked('chkRICamEnabled', settings.RICamEnabled);
        setChecked('chkSCCamEnabled', settings.SCCamEnabled);
        setChecked('chkSDCamEnabled', settings.SDCamEnabled);
        setChecked('chkTNCamEnabled', settings.TNCamEnabled);
        setChecked('chkTXCamEnabled', settings.TXCamEnabled);
        setChecked('chkUTCamEnabled', settings.UTCamEnabled);
        setChecked('chkVACamEnabled', settings.VACamEnabled);
        setChecked('chkWACamEnabled', settings.WACamEnabled);
        setChecked('chkWICamEnabled', settings.WICamEnabled);
        setChecked('chkWVCamEnabled', settings.WVCamEnabled);
        setChecked('chkWYCamEnabled', settings.WYCamEnabled);
        document.getElementById('chkMTCamEnabled').disabled = true; // parser written but better feed would help
        document.getElementById('chkOKCamEnabled').disabled = true; // parser pending, would prefer better source
        document.getElementById('chkSDCamEnabled').disabled = true; // parser pending, need a good source
        document.getElementById('chkWVCamEnabled').disabled = true; // parser pending, post
        //Add Handler for Checkbox Setting Changes
        $('.wmedotSettingsCheckbox').change(function () {
            var settingName = $(this)[0].id.substr(3);
            settings[settingName] = this.checked;
            saveSettings();
            if (this.checked) {
                buildDOTCamLayers(settingName.substring(0, 2));
                eval("getCam(config." + settingName.substring(0, 2) + ")");
            } else {
                //eval(settingName.substring(0, 2) + "Layer.destroy()");
                eval('W.map.removeLayer(' + settingName.substring(0, 2) + 'Layer)');
            }
        });
        if (document.getElementById('WMEFUzoom') != null) {
            document.getElementById('WMEFUzoom').style.zIndex = "45000";
        }
        if (document.getElementById('chkAKCamEnabled').checked) {
            buildDOTCamLayers("AK");
            getCam(config.AK);
        }
        if (document.getElementById('chkALCamEnabled').checked) {
            buildDOTCamLayers("AL");
            getCam(config.AL);
        }
        if (document.getElementById('chkARCamEnabled').checked) {
            buildDOTCamLayers("AR");
            getCam(config.AR);
        }
        if (document.getElementById('chkAZCamEnabled').checked) {
            buildDOTCamLayers("AZ");
            getCam(config.Az);
        }
        if (document.getElementById('chkCACamEnabled').checked) {
            buildDOTCamLayers("CA");
            getCam(config.CA);
        }
        if (document.getElementById('chkCOCamEnabled').checked) {
            buildDOTCamLayers("CO");
            getCam(config.CO);
        }
        if (document.getElementById('chkCTCamEnabled').checked) {
            buildDOTCamLayers("CT");
            getCam(config.CT);
        }
        if (document.getElementById('chkDCCamEnabled').checked) {
            buildDOTCamLayers("DC");
            getCam(config.DC);
        }
        if (document.getElementById('chkDECamEnabled').checked) {
            buildDOTCamLayers("DE");
            getCam(config.DE);
        }
        if (document.getElementById('chkFLCamEnabled').checked) {
            buildDOTCamLayers("FL");
            getCam(config.FL);
        }
        if (document.getElementById('chkGACamEnabled').checked) {
            buildDOTCamLayers("GA");
            getCam(config.GA);
        }
        if (document.getElementById('chkHICamEnabled').checked) {
            buildDOTCamLayers("HI");
            getCam(config.HI);
        }
        if (document.getElementById('chkIACamEnabled').checked) {
            buildDOTCamLayers("IA");
            getCam(config.IA);
        }
        if (document.getElementById('chkIDCamEnabled').checked) {
            buildDOTCamLayers("ID");
            getCam(config.ID);
        }
        if (document.getElementById('chkILCamEnabled').checked) {
            buildDOTCamLayers("IL");
            getCam(config.IL);
        }
        if (document.getElementById('chkINCamEnabled').checked) {
            buildDOTCamLayers("IN");
            getCam(config.IL);
        }
        if (document.getElementById('chkKSCamEnabled').checked) {
            buildDOTCamLayers("KS");
            getCam(config.KS);
        }
        if (document.getElementById('chkKYCamEnabled').checked) {
            buildDOTCamLayers("KY");
            getCam(config.KY);
        }
        if (document.getElementById('chkLACamEnabled').checked) {
            buildDOTCamLayers("LA");
            getCam(config.LA);
        }
        if (document.getElementById('chkMACamEnabled').checked) {
            buildDOTCamLayers("MA");
            getCam(config.MA);
        }
        if (document.getElementById('chkMDCamEnabled').checked) {
            buildDOTCamLayers("MD");
            getCam(config.MD);
        }
        if (document.getElementById('chkMICamEnabled').checked) {
            buildDOTCamLayers("MI");
            getCam(config.MI);
        }
        if (document.getElementById('chkMNCamEnabled').checked) {
            buildDOTCamLayers("MN");
            getCam(config.MN);
        }
        if (document.getElementById('chkMOCamEnabled').checked) {
            buildDOTCamLayers("MO");
            getCam(config.MO);
        }
        if (document.getElementById('chkMSCamEnabled').checked) {
            buildDOTCamLayers("MS");
            //getMS();
        }
        if (document.getElementById('chkMTCamEnabled').checked) {
            buildDOTCamLayers("MT");
            // getMT();
        }
        if (document.getElementById('chkNCCamEnabled').checked) {
            buildDOTCamLayers("NC");
            getCam(config.NC);
        }
        if (document.getElementById('chkNDCamEnabled').checked) {
            buildDOTCamLayers("ND");
            getCam(config.ND);
        }
        if (document.getElementById('chkNECamEnabled').checked) {
            buildDOTCamLayers("NE");
            getCam(config.NE);
        }
        if (document.getElementById('chkNWCamEnabled').checked) {
            buildDOTCamLayers("NW");
            getCam(config.NW);
        }
        if (document.getElementById('chkNJCamEnabled').checked) {
            buildDOTCamLayers("NJ");
            getCam(config.NJ);
        }
        if (document.getElementById('chkNMCamEnabled').checked) {
            buildDOTCamLayers("NM");
            getCam(config.NM);
        }
        if (document.getElementById('chkNVCamEnabled').checked) {
            buildDOTCamLayers("NV");
            getCam(config.NV);
        }
        if (document.getElementById('chkNYCamEnabled').checked) {
            buildDOTCamLayers("NY");
            getCam(config.NY);
        }
        if (document.getElementById('chkOHCamEnabled').checked) {
            buildDOTCamLayers("OH");
            getCam(config.OH);
        }
        if (document.getElementById('chkOKCamEnabled').checked) {
            buildDOTCamLayers("OK");
            //getOK();
        }
        if (document.getElementById('chkORCamEnabled').checked) {
            buildDOTCamLayers("OR");
            getCam(config.OR);
        }
        if (document.getElementById('chkPACamEnabled').checked) {
            buildDOTCamLayers("PA");
            getCam(config.PA);
        }
        if (document.getElementById('chkRICamEnabled').checked) {
            buildDOTCamLayers("RI");
            getCam(config.RI);
        }
        if (document.getElementById('chkSCCamEnabled').checked) {
            buildDOTCamLayers("SC");
            getCam(config.SC);
        }
        if (document.getElementById('chkSDCamEnabled').checked) {
            buildDOTCamLayers("SD");
            //getSD();
        }
        if (document.getElementById('chkTNCamEnabled').checked) {
            buildDOTCamLayers("TN");
            getCam(config.TN);
        }
        if (document.getElementById('chkTXCamEnabled').checked) {
            buildDOTCamLayers("TX");
            // getTX();
        }
        if (document.getElementById('chkUTCamEnabled').checked) {
            buildDOTCamLayers("UT");
            getCam(config.UT);
        }
        if (document.getElementById('chkVACamEnabled').checked) {
            buildDOTCamLayers("VA");
            getCam(config.VA);
        }
        if (document.getElementById('chkWACamEnabled').checked) {
            buildDOTCamLayers("WA");
            getCam(config.WA);
        }
        if (document.getElementById('chkWICamEnabled').checked) {
            buildDOTCamLayers("WI");
            getCam(config.WI);
        }
        if (document.getElementById('chkWVCamEnabled').checked) {
            buildDOTCamLayers("WV");
            //getCam(config.WV);
        }
        if (document.getElementById('chkWYCamEnabled').checked) {
            buildDOTCamLayers("WY");
            getCam(config.WY);
        }
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
                AKCamEnabled: settings.AKCamEnabled,
                ALCamEnabled: settings.ALCamEnabled,
                ARCamEnabled: settings.ARCamEnabled,
                AZCamEnabled: settings.AZCamEnabled,
                CACamEnabled: settings.CACamEnabled,
                COCamEnabled: settings.COCamEnabled,
                CTCamEnabled: settings.CTCamEnabled,
                DCCamEnabled: settings.DCCamEnabled,
                DECamEnabled: settings.DECamEnabled,
                FLCamEnabled: settings.FLCamEnabled,
                GACamEnabled: settings.GACamEnabled,
                HICamEnabled: settings.HICamEnabled,
                IACamEnabled: settings.IACamEnabled,
                IDCamEnabled: settings.IDCamEnabled,
                ILCamEnabled: settings.ILCamEnabled,
                INCamEnabled: settings.INCamEnabled,
                KSCamEnabled: settings.KSCamEnabled,
                KYCamEnabled: settings.KYCamEnabled,
                LACamEnabled: settings.LACamEnabled,
                MACamEnabled: settings.MACamENabled,
                MDCamEnabled: settings.MDCamEnabled,
                MICamEnabled: settings.MICamEnabled,
                MNCamEnabled: settings.MNCamEnabled,
                MOCamEnabled: settings.MOCamEnabled,
                MSCamEnabled: settings.MSCamEnabled,
                MTCamEnabled: settings.MTCamEnabled,
                NCCamEnabled: settings.NCCamEnabled,
                NDCamEnabled: settings.NDCamEnabled,
                NECamEnabled: settings.NECamEnabled,
                NWCamEnabled: settings.NWCamEnabled, // currently for New England, will need to make one for Nebraska
                NJCamEnabled: settings.NJCamEnabled,
                NMCamEnabled: settings.NMCamEnabled,
                NVCamEnabled: settings.NVCamEnabled,
                NYCamEnabled: settings.NYCamEnabled,
                OHCamEnabled: settings.OHCamEnabled,
                OKCamEnabled: settings.OKCamEnabled,
                ORCamEnabled: settings.ORCamEnabled,
                PACamEnabled: settings.PACamEnabled,
                RICamEnabled: settings.RICamEnabled,
                SCCamEnabled: settings.SCCamEnabled,
                SDCamEnabled: settings.SDCamEnabled,
                TNCamEnabled: settings.TNCamEnabled,
                TXCamEnabled: settings.TXCamEnabled,
                UTCamEnabled: settings.UTCamEnabled,
                VACamEnabled: settings.VACamEnabled,
                WACamEnabled: settings.WACamEnabled,
                WICamEnabled: settings.WICamEnabled,
                WVCamEnabled: settings.WVCamEnabled,
                WYCamEnabled: settings.WYCamEnabled,
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
            initialize: function (a, b, c, d) {
                this.url = a;
                this.size = b || {
                    w: 20,
                    h: 20
                };
                this.offset = c || {
                    x: -(this.size.w / 2),
                    y: -(this.size.h / 2)
                };
                this.calculateOffset = d;
                a = OpenLayers.Util.createUniqueID("OL_Icon_");
                let div = this.imageDiv = OpenLayers.Util.createAlphaImageDiv(a);
                $(div.firstChild).removeClass('olAlphaImg'); // LEAVE THIS LINE TO PREVENT WME-HARDHATS SCRIPT FROM TURNING ALL ICONS INTO HARDHAT WAZERS --MAPOMATIC
            },
            destroy: function () {
                this.erase();
                OpenLayers.Event.stopObservingElement(this.imageDiv.firstChild);
                this.imageDiv.innerHTML = "";
                this.imageDiv = null;
            },
            clone: function () {
                return new OpenLayers.Icon(this.url, this.size, this.offset, this.calculateOffset);
            },
            setSize: function (a) {
                null !== a && (this.size = a);
                this.draw();
            },
            setUrl: function (a) {
                null !== a && (this.url = a);
                this.draw();
            },
            draw: function (a) {
                OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, null, this.size, this.url, "absolute");
                this.moveTo(a);
                return this.imageDiv;
            },
            erase: function () {
                null !== this.imageDiv && null !== this.imageDiv.parentNode && OpenLayers.Element.remove(this.imageDiv);
            },
            setOpacity: function (a) {
                OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, null, null, null, null, null, null, a);
            },
            moveTo: function (a) {
                null !== a && (this.px = a);
                null !== this.imageDiv && (null === this.px ? this.display(!1) : (
                    this.calculateOffset && (this.offset = this.calculateOffset(this.size)),
                    OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, {
                        x: this.px.x + this.offset.x,
                        y: this.px.y + this.offset.y
                    })
                ));
            },
            display: function (a) {
                this.imageDiv.style.display = a ? "" : "none";
            },
            isDrawn: function () {
                return this.imageDiv && this.imageDiv.parentNode && 11 != this.imageDiv.parentNode.nodeType;
            },
            CLASS_NAME: "OpenLayers.Icon"
        });
    }
    //--- CSS styles make it work...
    GM_addStyle("                                      \
#gmPopupContainer {                                     \
position:               absolute;                        \
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
hr.myhrline{\
margin: 5px;\
}\
.modalclose {\
background: lightgray;\
color: #FFFFFF;\
line-height: 25px;\
position: absolute;\
right: -12px;\
text-align: center;\
top: -10px;\
width: 24px;\
text-decoration: none;\
font-weight: bold;\
-webkit-border-radius: 12px;\
-moz-border-radius: 12px;\
border-radius: 12px;\
-moz-box-shadow: 1px 1px 3px #000;\
-webkit-box-shadow: 1px 1px 3px #000;\
box-shadow: 1px 1px 3px #000;\
text-decoration: none;\
}\
.modalclose:hover {\
background: #00d9ff;\
text-decoration: none;\
}\
");
    bootstrap();
})();
