function RF(){

    // SCREEN SIZE CHECK
    let isMobile = window.innerWidth <= 576;
    let debugMode = true;

    // CONFIGURATION
    const mouseWheelZoomEnabled = false;
    const initialPanOffset      = isMobile ? 0 : -100;
    const zoomLevels            = 20;
    const maxZoom               = 0.4 + ( zoomLevels * 0.1 )
    const videoDebug            = false;
    const AUTO_PLAY_PAUSE_MS    = 3000;     // 2sec
    let zoomLevel               = isMobile ? 0.9 : 0.6; // Set Zoom level according to screen size
    let circleRadius            = isMobile ? 8 : 3;

    const playBtnIcon  = "img/play.png";
    const pauseBtnIcon = "img/pause.png";
    const soundOnIcon  = "img/sound.png";
    const soundOffIcon = "img/mute.png"
    const videoTextOn  = "img/video-text-open.svg";
    const videoTextOff = "img/video-text-close.svg"

    const PLAY_ALL_TEXT    = "Play All";
    const PLAYING_ALL_TEXT = "Playing..."

    // VIDEO ENTRIES THAT MUST BE REMOVED:
    const removedEntriesFromVids = [ "143.skyrou" ];
    const removedEntriesFromId   = [ 143 ];
    
    // HELPERS
    const $ = selector => document.querySelector(selector);

    // EMOTIONAL CATEGORIES + HUES
    const emotions = [

        ["rage", "fury", "anger", "unsafety", "alertness"],

        ["perplexity", "confusion", "asphyxiation", "suspicion", "insightfulness", "alienation", "strangeness"],

        ["boredom", "neutrality", "normality", "acceptance", "dullness"],

        ["calmness"],

        [ "anxiety", "fearfulness", "agony" ],

        ["sadness", "loneliness", "blurry", "awfulness", "emptiness", "bad", "creepy", "non festive"],

        ["confinement", "solitude", "constraint", "enclosure", "isolation", "caging", "self-estrangement"],

        ["nostalgia", "belonging", "gratitude", "strength", "love", "emotional", "devoutness", "awe", "mixed feelings"],

        ["sundayish", "full of life", "feeling the nature", "breathing", "freedom", "fitness", "joy", "playfulness", "stresslessness", "chillness", "festivity"],

        ["restlessness", "concern", "worry", "nervousness", "uncanny", "carefulness"],

        ["hopefulness", "illumination", "optimism", "comfortable", "coolness", "blooming", "revolt"],

        ["expectation", "anticipation", "concentration", "productivity", "dizzyness", "curiosity", "connection", "poetry", "astonishment"],

        ["melancholy", "depression", "noir", "dark", "blue", "tiredness", "insecurity", "exhaustion", "post-apocalyptic", "aging"],

        ["peacefulness", "comfort", "relief", "quietude", "dyschronometria", "time stands still"],

        ["no feelings shared"]
    ];

    // Emotional Colors have changed:
    const colorsToDisplay = [
        // COLORS: A, B, C, CATEGORY
        [ "CA003D", "8E1537", "CA003D", 4 ],
        [ "9164CC", "60269E", "9164CC", 2 ],
        [ "B78B1E", "977124", "B78B1E", 8 ],
        [ "00AE42", "007853", "00AE42", 10 ],
        [ "E54360", "C10230", "E54360", 1 ],
        [ "5887DA", "0047BA", "5887DA", 7 ],
        [ "B980D0", "73308A", "B980D0", 6],
        [ "789C4A", "4D5A31", "789C4A", 14 ],
        [ "FF7F40", "E65300", "FF7F40", 12 ],
        [ "B14FC5", "7A2682", "B14FC5", 3 ],
        [ "E31D93", "AF0061", "E31D93", 9 ],
        [ "DD8A03", "B06533", "DD8A03", 13 ],
        [ "7E57C5", "410099", "7E57C5", 5 ],
        [ "00B2E3", "0069A7", "00B2E3", 11 ],
        [ "A9A89F", "7E7F73", "A9A89F", 15 ]
    ];
    
    const colors = [
        // COLORS: A, B, C, CATEGORY
        [ "E54360", "C10230", "E54360", 1 ],
        [ "9164CC", "60269E", "9164CC", 2 ],
        [ "B14FC5", "7A2682", "B14FC5", 3 ],
        [ "CA003D", "8E1537", "CA003D", 4 ],
        [ "7E57C5", "410099", "7E57C5", 5 ],
        [ "B980D0", "73308A", "B980D0", 6],
        [ "5887DA", "0047BA", "5887DA", 7 ],
        [ "B78B1E", "977124", "B78B1E", 8 ],
        [ "E31D93", "AF0061", "E31D93", 9 ],
        [ "00AE42", "007853", "00AE42", 10 ],
        [ "00B2E3", "0069A7", "00B2E3", 11 ],
        [ "FF7F40", "E65300", "FF7F40", 12 ],
        [ "DD8A03", "B06533", "DD8A03", 13 ],
        [ "789C4A", "4D5A31", "789C4A", 14 ],
        [ "A9A89F", "7E7F73", "A9A89F", 15 ]
    ];

    // CSV COLUMNS DESCRIPTION:
    const idx = { 
        VIDEO   : 0,
        ADDRESS : 1,
        LAT     : 2,
        LON     : 3,
        CREATOR : 4,
        STREET  : 5,
        AREA    : 6,
        DATE    : 7,
        CATEGORY: 9,
        TEXT    : 12
    }

    const URL_BASE          = "https://rattlingframes.net";
    const mainContainer     = $(".container");
    const mainTemplate      = $(`${ isMobile ? "script#mobile" : "script#screen" }`); // Pick a template based on whether we are on a mobile or large-screen device 
    if ( isMobile ) { 
        document.body.classList.add("mobile"); 
    }

    mainContainer.innerHTML = mainTemplate.textContent;

    // DOM ELEMENTS
    const mapWrapper        = $("#map");
    const logo              = $("#logo img");
    const mainMap           = $("#map_main");
    const svg               = $('#map_svg')
    const gradStopColor1    = svg.querySelector("#grad1 #drag_stop_color1");
    const gradStopColor2    = svg.querySelector("#grad1 #drag_stop_color2");

    const grayGradStopColor1    = svg.querySelector("#grad1 #graygrad_stop_color1");
    const grayGradStopColor2    = svg.querySelector("#grad1 #graygrad_stop_color2");

    const emoIdx            = $("#emotional_index");
    const streetInfo        = $("#street_info");
    const style             = $("#dynamic");
    const styleAll          = $("#dynamic_all");
    const emoText           = $("#current_emotion");
    const zoomIn            = $("#plus");
    const zoomOut           = $("#minus");
    const allBtn            = $("#all");
    // const noneBtn           = $("#none");
    const slide             = $("#slide");
    const aside             = $("aside");
    const close             = $("#close");
    const help              = $("#help");
    const helpImg           = $("#help img");
    const helpModal         = $("#help_modal");
    const closeModal        = $("#help_modal--close");
    const zoomScale         = $("#zoom_scale");
    const instructions      = $("#instructions");
    const dynDefs           = $("svg defs#dynamic_defs");

    // DOM ELEMENTS | VIDEO CONTROLS
    const videoModal        = $("#video_modal");
    const videoClose        = $("#video_close");
    const video             = videoModal.querySelector("video");
    const videoInfo         = videoModal.querySelector("#video_info");
    const videoPlay         = $("#play");
    const playIcon          = videoPlay.querySelector("img");
    const videoSound        = $("#sound");
    const soundIcon         = videoSound.querySelector("img");
    const videoNext         = $("#video_next");
    const videoPrev         = $("#video_prev");
    const videoCtrls        = $("#video_controls");
    const videoRCtrls       = $("#video_rcontrols");
    const videoContainer    = $("#video_container");
    const videoPlayAll      = videoModal.querySelector("#play_all");
    const videoFull         = $("#full_screen");
    const videoSelect       = $("#video_selector"); // DEBUGGING

    const vInfo             = $(".v-info");
    const vText             = $(".v-text");
    const vInfoCreator      = videoModal.querySelector("#v-info--creator");
    const vInfoStreet       = videoModal.querySelector("#v-info--street");
    const vInfoDate         = videoModal.querySelector("#v-info--datetime");
    const vInfoToggle       = videoModal.querySelector("#v-info--toggle");
    const vInfoText         = videoModal.querySelector("#v-info--text");
    const vInfoEmotions     = videoModal.querySelector(".v-emotions");

    const [ width, height ] = [ 300, 300 ];
    let panZoomTiger;
    // zoomLevel = 1.4;
    let currentZoomSpan     = isMobile ? zoomLevels - 4 : zoomLevels - 3;
    let currentVideo        = null;
    let currentCat          = null;
    let currentEmotion      = null;
    let isVideoModalOpen    = false;
    let isVideoTextOn       = false;
    let selectedVideoOnFirstClick = 0;
    let selectedVideoIndices = [];
    let isPlayAllClicked     = false;
    let hasAllColorGradients = false;

    const search = document.location.search.split("=");
    if ( search[1] ){
        currentEmotion = search[1];
    }

    let videoHeight         = null;
    let playing             = false;
    let videoList           = [ null ];
    let isMuted             = false;

    // INIT APP
    svg.style.display = "block";
    mapWrapper.appendChild( svg );

    if ( zoomScale ){
        for( let i = 0; i < zoomLevels; i++ ){
            zoomScale.innerHTML += `<span class="scale">-</span>`
        }
        zoomScale.querySelector(`span.scale:nth-child(${currentZoomSpan})`).classList.add("active");
    }
    

    function drawCircle({ x, y, cat, location, vid }) {

        const color = "#" + colors[cat-1][1];
        const radius = circleRadius;
        x += 300;
        y += 300;

        mainMap.insertAdjacentHTML(
            "beforeend", 
            `
            <g class="point cat-${cat}">
                <circle 
                    cx="${x}" 
                    cy="${y}"
                    r="${radius}" 
                    data-category="${cat}" 
                    data-video="${vid}" 
                    data-location="${location}"
                    disabled-fill="${color}" 
                    fill="url(#graygrad)"
                />
                <!-- <text filter="url(#solid)" x="${x}" y="${y}" font-size="0.4em">${location.toUpperCase()}</text> -->
            </g>
            `
        );

    }
    function drawLine({ x1, y1, x2, y2, cat }) {

        let color = "#" + colors[cat-1][1];
        if ( cat === 15 ){
            color = "#" + colors[cat-1][0];
        }
        x1 += 300;
        y1 += 300;
        x2 += 300;
        y2 += 300;
        // const strokeWidth = 0.15;
        const strokeWidth = 0.25;

        mainMap.insertAdjacentHTML(
            "beforeend", 
            `
            <line
                vector-effect="non-scaling-stroke" 
                class="synapse 
                cat-${cat}" 
                id="line" 
                x1="${x1}" 
                y1="${y1}" 
                x2="${x2}" 
                y2="${y2}" 
                stroke="${color}" 
                stroke-width="${strokeWidth}" />
            `
        );

    }
    function zoom( level ){

        // const isZoomIn = zoomLevel < level;
        zoomLevel = level;
        // console.log({ zoomLevel });
        panZoomTiger.zoom( zoomLevel );

        // DEPRECATED [ Replaced by setBeforeZoom() ]
        /*
        mainMap.querySelectorAll("circle").forEach( (circle,idx) =>{

            const radius = circle.getAttribute("r"); 
            if ( idx === 1 ){
                console.log( "Radius before: ", radius );
                console.log( "Zoom: ", zoomLevel );
            }
            const newRadius = isZoomIn ? radius * 0.95 : radius * 1.05; 
            circle.setAttribute("r", newRadius );
            if ( idx === 1 ){
                console.log( "Radius After: ", radius );
                console.log( "Zoom: ", zoomLevel );
            }
        });
        */

        // DEPRECATED [ Replaced by vector-effect="non-scaling-stroke" ]
        /*
        mainMap.querySelectorAll("line").forEach( line =>{
            const strokeWidth = line.getAttribute("stroke-width"); 
            const newRadius = isZoomIn ? strokeWidth * 0.9 : strokeWidth * 1.1;
            line.setAttribute("stroke-width", newRadius );
        });
        */

    }

    const { drawCircleFromLatLon, drawLineFromLatLon } = (function() {

        // Translating Latitude/Longitude to SVG X/Y
        // LON: 38.03288 -> 37.94885
        // LAT: 23.68701 -> 23.79044
        const lonX       = 23.68701;
        const maxLonX    = 23.79044;
        const latY       = 38.03288;
        const maxLatY    = 37.94885;
        // Normalizing: 0 -> maxLatX, 0 -> maxLatY
        const nLonX    = 0;
        const nMaxLonX = ( maxLonX - lonX );
        const nLatY    = 0;
        const nMaxLatY = Math.abs( maxLatY - latY );
        // Relative
        const relX = width / nMaxLonX;
        const relY = height / nMaxLatY;

        // Closures FTW
        return {
            drawLineFromLatLon: function( options ){
                const { lat1, lon1, lat2, lon2 } = options;
                const x1 = ( (( lon1 ) - lonX ) * relX );
                const x2 = ( (( lon2 ) - lonX ) * relX );
                const y1 = Math.abs( (( lat1 ) - latY ) * relY );
                const y2 = Math.abs( (( lat2 ) - latY ) * relY );
                drawLine({ x1, y1, x2, y2, ...options });

            },
            drawCircleFromLatLon: function( options ){
                const { lat, lon } = options;
                const x = ( (( lon ) - lonX ) * relX );
                const y = Math.abs( (( lat ) - latY ) * relY );
                drawCircle({ x, y, ...options });
            }
        }

    }());

    function renderDot( moment, index, list ){

        const street = moment[idx.STREET].toLowerCase().trim();
        const loc    = moment[idx.AREA].trim();
        const lat    = moment[idx.LAT].toLowerCase().trim();
        const lon    = moment[idx.LON].toLowerCase().trim();
        const cat    = moment[idx.CATEGORY];
        const vid    = moment[idx.VIDEO].toLowerCase().trim();

        if ( removedEntriesFromVids.indexOf( vid ) > -1 ){
            return;
        }

        drawCircleFromLatLon({
            lat, lon, cat, location: loc, vid
        });

        /*
        if ( cat === 8 ){
            return { lat, lon, cat, loc }
        }
        */

        list.forEach(( point, ix ) => {
            if ( ix !== index ){
                drawLineFromLatLon({ 
                    lat1: lat,
                    lon1: lon,
                    lat2: point[idx.LAT],
                    lon2: point[idx.LON],
                    cat: cat
                })
            }
        });

        return { lat, lon, cat, loc }
    }

    function parseCSV( text ){

        const array = text.split("\n").slice(1);
        const categories = array.reduce(( acc, moment, index ) => {
            const row = moment.split("\t");

            // SKIP SELECTED ENTRIES [ Buggy ]
            // if ( index === 142 ){
            //     return acc;
            // }

            row[idx.CATEGORY] = parseInt( row[idx.CATEGORY].trim().slice(1) );
            const videoNum = row[idx.VIDEO].toLowerCase().trim().split(".")[0]; 
            const videoArea = row[idx.AREA].trim(); 
            const videoStreet = row[idx.STREET];
            const streetArea = `${videoStreet}${videoArea.length > 0 && videoStreet !== videoArea ? `, ${videoArea}` : ""}`

            videoList.push( 
                [ 
                    videoNum + ".mp4",      // VIDEO FILE
                    row[idx.CATEGORY],      // CAT
                    parseInt( videoNum ),   // VIDEO NUM
                    row[idx.CREATOR],       // CREATOR
                    streetArea,             // STREET, AREA
                    row[idx.DATE],          // DATE
                    row[idx.TEXT]           // TEXT
                ]
            );
            if ( acc[row[idx.CATEGORY]] ){
                acc[row[idx.CATEGORY]].push( row );
            } else {
                acc[row[idx.CATEGORY]] = [ row ];
            }
            return acc;
        }, []); // Array -> Index 1 ~ 15 (Categories)

        if ( debugMode ){ window.videoList = videoList; }

        /* DEBUGGING VIDEOS: */
        if ( videoDebug ){
            videoSelect.style.display = "block";
            array.forEach( m => {
                const vid = m.split("\t")[0];
                // const lat = m.split("\t")[2];
                // const lon = m.split("\t")[3];
                const cat = m.split("\t")[9].split(".")[1].trim();
                videoSelect.insertAdjacentHTML('beforeend',`
                    <option value="${vid.split(".")[0]}">${vid} (${cat})</option>
                `);
            });
        }
        /* DEBUGGING VIDEOS: */

        categories.forEach( category => category.map(renderDot) );

        // TEST PERIMETER ON CAT-8
        /*
        [
            categories[8][7],
            categories[8][3],
            categories[8][2],
            categories[8][1],
            categories[8][0],
            categories[8][4],
            categories[8][5],
            categories[8][6]
        ].map( renderPerimeter );
        */

        return categories;

    }

    function clearZoomLevel(){
        if ( zoomScale ){
            zoomScale.querySelectorAll(`span.scale.active`).forEach( z => {
                z.classList.remove("active");
            })
        }
    }

    function deactivateEmotions(){
        emoIdx.querySelectorAll(".active").forEach( p => p.classList.remove('active') );                
    }

    // INITIALIZE ALL THE EVENT HANDLERS AFTER PARSING HAS FINISHED:
    function addEventHandlers( categories ){

        function stopVideo(){
            video.pause();
            // video.currentTime = 0;
            playing = false;
        }

        function onPlay( e ){
            console.log("videoPlay()");
            if ( playing ){
                playIcon.setAttribute("src", playBtnIcon );
                video.pause();
                isPlayAllClicked = false;
                videoPlayAll.textContent = PLAY_ALL_TEXT;
            } else {
                playIcon.setAttribute("src", pauseBtnIcon );
                video.play();
            }
            playing = !playing;
        }

        function getSelectedVideoIndices( _currentCategory, _currentVideo ){

            selectedVideoIndices = videoList
            .slice(1)
            .filter( v => {
                return ( v[1] === +_currentCategory ) && ( v[2] !== +_currentVideo ) 
            })
            .map( p => p[2] );
            selectedVideoIndices.unshift( +_currentVideo );
            
            // console.log({ selectedVideoIndices });

        }

        function handleMainMapClick( e ){

            debugMode && console.log("handleMainMapClick()");
            debugMode && console.log({ isPlayAllClicked });

            if ( e.target.nodeName !== "circle" ){
                return;
            };

            if ( isMobile ){
                if ( 
                    ( currentEmotion !== "all" ) && 
                    ( currentEmotion !== null )  
                ){
                    // return helpModal.classList.add("active");
                } else {
                    return false;
                }
            }

            currentCat   = e.target.getAttribute("data-category");
            currentVideo = e.target.getAttribute("data-video").split(".")[0]; 
            getSelectedVideoIndices( currentCat, currentVideo );
            selectedVideoOnFirstClick = 0;

            videoPrev.style.opacity = 0.15;
            videoNext.style.opacity = 1;
            
            const URL = `${URL_BASE}/data/${currentVideo}.mp4`;
            video.setAttribute("src", URL);
        }

        function addGradient( id, color ){

            const gradient = `
                <radialGradient id="${id}">
                    <stop offset="0%" stop-color="#${color}" id="drag_stop_color1" style="stop-opacity: 1.0" />
                    <stop offset="50%" stop-color="#${color}" id="drag_stop_color2" style="stop-opacity: 0.5" />
                    <stop offset="100%" stop-color="#fdfdfd" style="stop-opacity: 0.0" />
                </radialGradient>                
            `
            dynDefs.insertAdjacentHTML("afterbegin", gradient);

        }

        function displayAll(){
            
            deactivateEmotions();
            emoText.innerHTML = "&nbsp;";
            let styleTextContent = "";

            // console.log( dynDefs.childElementCount );
            colors.slice( 0, -1 ).forEach((color, idx) => {
                
                const elId = "dyn_color_" + idx;
                const cColor = colors[idx][1];
                if ( !hasAllColorGradients ){
                    addGradient( elId, cColor );
                }

                styleTextContent += `
                    svg .point {
                        display: none;
                    }
                    svg .point.cat-${idx+1} {
                        display: block;
                        fill: #${cColor};
                    }
                    svg .point.cat-${idx+1} circle{
                        display: block;
                        Dfill: url(#grad1) !important;
                        Dfill: #${cColor} !important;
                        fill: url(#${elId}) !important;
                    }
                    svg .synapse.cat-${idx+1} {
                        display: block !important;
                    }
                `
            });
            hasAllColorGradients = true;
            style.textContent = styleTextContent;
        }

        // Toggle Video Description on and off
        function toggleVideoText(){
            if ( isVideoTextOn ){
                vText.classList.remove("unfolded");
                vInfoText.style.display = "none";
                vInfoEmotions.style.visibility = "visible";
                vInfoToggle.querySelector("img").src = videoTextOn;
            } else {
                vText.classList.add("unfolded");
                vInfoText.style.display = "block";
                vInfoEmotions.style.visibility = "hidden";
                vInfoToggle.querySelector("img").src = videoTextOff;
            }
            isVideoTextOn = !isVideoTextOn;
        }

        function closeVideoText(){
            vText.classList.remove("unfolded");
            vInfoText.style.display = "none";
            vInfoEmotions.style.visibility = "visible";
            vInfoToggle.querySelector("img").src = videoTextOn;
            isVideoTextOn = false;
        }

        function displayVideoInfo( video, cat ){
            debugMode && console.log( 
                "Video source: ",
                video.currentSrc,
                " Category: ",
                cat,
                " Duration: ",
                video.duration,
                "Video offsetWidth: ",
                video.offsetWidth,
                "Video offsetHeight: ",
                video.offsetHeight,
                "Video width: ",
                video.videoWidth,
                "Video height: ",
                video.videoHeight 
            );
        }

        // This is where the video loading and all-related things to it happen...
        function onLoadedMetaData( e ){

            // debugMode && console.log("onLoadedMetaData()");
            // debugMode && console.log({ isPlayAllClicked });

            playIcon.setAttribute("src", playBtnIcon);
            
            let currentCatColor = "#ddd";
            let vidCat;

            // DISPLAY CAT COLOR + DATA
            if ( currentVideo ){

                currentCatColor = "#" + colors[ videoList[currentVideo][1] -1 ][0];
                const creator = videoList[currentVideo][3]; 
                const street  = videoList[currentVideo][4];
                const date    = videoList[currentVideo][5];
                const text    = videoList[currentVideo][6];
                       vidCat = videoList[currentVideo][1];

                vInfoCreator.innerText = creator;
                vInfoStreet.innerText  = street;
                if ( date.trim() !== "" ){
                    vInfoDate.innerText    = date[0] + date.slice(1).toLowerCase();
                }
                vInfoText.innerText    = text;

                if ( text.trim() === "" ){
                    vInfoToggle.style.visibility = "hidden";
                } else {
                    vInfoToggle.style.visibility = "visible";
                    vInfoToggle.onclick = toggleVideoText;
                }

            } else if ( currentCat ) {

                currentCatColor = `#${colors[currentCat-1][2]}`;
            }
            // displayVideoInfo( video, vidCat );
            
            videoCtrls.style.backgroundColor     = currentCatColor;
            videoModal.classList.add("active");
            document.body.classList.add("video-modal-active");
            isVideoModalOpen = true;

            // DISPLAY EMOTIONS
            const emoBtn = emoIdx.querySelector(`[data-cat="${currentCat-1}"]`);
            const emo = emoBtn.getAttribute("data-emotion");
            vInfoEmotions.innerText = emotions[emo].join("–");

            videoPlay.addEventListener( "click", onPlay );

            // CALCULATING VIDEO CONTAINER DIMENSIONS:
            const { width, height } = video.getBoundingClientRect();
            const containerWidth = videoContainer.getBoundingClientRect().width;
            const containerHeight = videoContainer.getBoundingClientRect().height;

            let { videoWidth, videoHeight } = video;
            const landscape = Math.max( videoWidth, videoHeight ) === videoWidth;

            if ( debugMode ){
                console.table({ 
                    landscape, width, height, videoWidth, videoHeight,
                    containerWidth, containerHeight 
                });
                window.video = video;
                window.videoCtrls = videoCtrls;
                console.log(
                    `%c Video Aspect Ration: ${ videoWidth / videoHeight }`,
                    'background: #222; color: #bada55'
                );

            }
            
            if ( !videoHeight ){
                videoHeight = video.videoHeight = window.innerHeight * 0.62;
            }
            const ratio = height / videoHeight;
            console.log({ ratio }); // 0.x OK, 1.x NOT OK
            
            console.log( "videoWidth * ratio", videoWidth * ratio );
            if ( landscape && videoWidth * ratio > containerWidth ){
                video.classList.add("landscape");
                videoCtrls.style.width = containerWidth + "px";
            } else {
                videoCtrls.style.width = ( videoWidth * ratio ) + "px";
                video.classList.remove("landscape");
            }

            // OFFSET VIDEO INFO ON LARGE VIDEOS
            const videoRatio = videoHeight / videoWidth;
            // console.log({ videoRatio });

            // TODO: When videoRatio is below ~ 0.6, we have a problem with the videoCtrls width on tablet screens
            
            // If the video aspect ratio is landscape
            // if ( videoRatio < 0.751 ){  
            if ( ( videoWidth / videoHeight ) > 1.6 ){  
                const videoInfoLeft = videoInfo.getBoundingClientRect().left;
                const videoCtrlsLeft = videoCtrls.getBoundingClientRect().left;
                if ( videoCtrlsLeft > videoInfoLeft ){
                    vInfo.style.transform = `translateX( ${Math.floor(videoCtrlsLeft - videoInfoLeft) }px  )`;
                    console.log("Translating Info Box to:");
                    console.log(`translateX( ${Math.floor(videoCtrlsLeft - videoInfoLeft) }px  )`);
                } else {
                    vInfo.style.transform = "";
                }
            } else {
                vInfo.style.transform = "";
            }

            // UPDATE LOCATION HASH WITH VIDEO ID + CAT:
            window.location.hash = `#video=${currentVideo}|cat=${currentCat}`

            // AUTOPLAY:
            if ( isPlayAllClicked ){ onPlay(); }

        }

        function onVideoPrev(){

            stopVideo();
            closeVideoText()

            const { width, height } = videoContainer.getBoundingClientRect();
            videoContainer.style.width = width + "px";
            videoContainer.style.height = height + "px";

            if ( selectedVideoOnFirstClick > 0 ){
                selectedVideoOnFirstClick = selectedVideoOnFirstClick - 1;
                console.log( "PREVIOUS:", selectedVideoIndices[selectedVideoOnFirstClick] );
                if ( selectedVideoIndices[selectedVideoOnFirstClick-1] ){
                    videoPrev.style.opacity = 1;
                } else {
                    videoPrev.style.opacity = 0.15;
                }
                if ( selectedVideoIndices[selectedVideoOnFirstClick + 1] ){
                    videoNext.style.opacity = 1;
                } else {
                    videoNext.style.opacity = 0.15;
                }
                currentVideo = selectedVideoIndices[selectedVideoOnFirstClick];

                // SKIPPING SELECTED VIDEOS
                if ( removedEntriesFromId.indexOf(currentVideo) > -1 ){
                    console.log( "Skipping ", currentVideo );
                    return onVideoPrev();
                }

                video.src = `${URL_BASE}/data/${currentVideo}.mp4`;
            }

            // [ DEPRECATED ]
            /*
            const prevVideo = videoList.slice( 1, +currentVideo ).reverse().find( video => video[1] == currentCat );
            
            console.log("onVideoPrev()", { currentVideo, prevVideo, selectedVideoOnFirstClick });
 
            if ( prevVideo ){
                // videoNext.style.opacity = 1;
                // videoPrev.style.opacity = 1;
                currentVideo = prevVideo[2];
                // video.src = `${URL_BASE}/data/${currentVideo}.mp4`;
            } else {
                // videoPrev.style.opacity = 0.15;
                currentVideo = videoList.slice( +currentVideo ).reverse().find( video => video[1] == currentCat )[2];
            }
 
            // SKIPPING SELECTED VIDEOS
            if ( removedEntriesFromId.indexOf(currentVideo) > -1 ){
                console.log( "Skipping ", currentVideo );
                return onVideoPrev();
            }
 
            // if ( currentVideo === +selectedVideoOnFirstClick ){
            //     return videoPrev.style.opacity = 0.15;
            // }
 
            video.src = `${URL_BASE}/data/${currentVideo}.mp4`;
            */

        }

        function onVideoNext(){

            stopVideo();
            closeVideoText()

            const { width, height } = videoContainer.getBoundingClientRect();
            videoContainer.style.width = width + "px";
            videoContainer.style.height = height + "px";

            if ( selectedVideoOnFirstClick < selectedVideoIndices.length - 1 ){
                selectedVideoOnFirstClick = selectedVideoOnFirstClick + 1;
                console.log( "NEXT:", selectedVideoIndices[selectedVideoOnFirstClick] );
                if ( selectedVideoIndices[selectedVideoOnFirstClick + 1] ){
                    videoNext.style.opacity = 1;
                } else {
                    videoNext.style.opacity = 0.15;
                }
                if ( selectedVideoIndices[selectedVideoOnFirstClick - 1] ){
                    videoPrev.style.opacity = 1;
                } else {
                    videoPrev.style.opacity = 0.15;
                }
                currentVideo = selectedVideoIndices[selectedVideoOnFirstClick];

                // SKIPPING SELECTED VIDEOS
                if ( removedEntriesFromId.indexOf(currentVideo) > -1 ){
                    console.log( "Skipping ", currentVideo );
                    return onVideoNext();
                }

                video.src = `${URL_BASE}/data/${currentVideo}.mp4`;
                // video.src = `LOADING.mp4`; // DEBUGGING LOADING INDICATOR
            }

            // [ DEPRECATED ]
            /*
            const { width, height } = videoContainer.getBoundingClientRect();
            videoContainer.style.width = width + "px";
            videoContainer.style.height = height + "px";
 
            const nextVideo = videoList.slice( +currentVideo + 1 ).find( video => video[1] == currentCat );
 
            console.table("onVideoPrev()", { currentVideo, nextVideo, selectedVideoOnFirstClick });
 
            if ( nextVideo ){
                // videoPrev.style.opacity = 1;
                // videoNext.style.opacity = 1;
                currentVideo = nextVideo[2];
                // video.src = `${URL_BASE}/data/${currentVideo}.mp4`;
            } else {
                // videoNext.style.opacity = 0.15;
                currentVideo = videoList.slice(1).find( video => video[1] == currentCat )[2];
            }
 
            // SKIPPING SELECTED VIDEOS
            if ( removedEntriesFromId.indexOf(currentVideo) > -1 ){
                console.log( "Skipping ", currentVideo );
                return onVideoNext();
            }
 
            // if ( currentVideo === +selectedVideoOnFirstClick ){
            //     return videoNext.style.opacity = 0.15;
            // }
 
            video.src = `${URL_BASE}/data/${currentVideo}.mp4`;
            */

        }

        function onVideoEnd(){
            video.pause();
            if ( isPlayAllClicked ){
                setTimeout(()=>{
                    onVideoNext();
                }, AUTO_PLAY_PAUSE_MS );
            } else {
                playing = false;
                playIcon.setAttribute( "src", playBtnIcon );
            }
        }

        function closeVideo(){
            videoModal.classList.remove("active");
            document.body.classList.remove("video-modal-active");
            videoPlay.removeEventListener( "click", onPlay );
            stopVideo();
            isPlayAllClicked = false;
            videoPlayAll.textContent = PLAY_ALL_TEXT;
            location.hash = "";
        }

        function handleGlobalClick( e ){
            if ( isMobile ){
            // if ( isMobile && ( currentEmotion === "all" || currentEmotion === null ) ){
                return;
            }
            const nodeName     = e.target.nodeName.toLowerCase();
            const isSvgClicked = nodeName === "svg";
            const isNavClicked = nodeName === "nav";
            const isLogo       = e.target.getAttribute("id") === "logo";
            if ( isNavClicked || isSvgClicked || isLogo ){
                deactivateEmotions();
                currentEmotion = null;
                emoText.innerHTML = "&nbsp;";
                style.textContent = "";                
                gradStopColor1.setAttribute("stop-color", "#ddd");
                gradStopColor2.setAttribute("stop-color", "#ddd");
                if ( aside.classList.contains("active") ){
                    aside.classList.remove("active");
                }
            }

        }

        function onLogoClick(){
            console.log("onLogoClick()");
            document.location = "about.html";
        }

        function loadVideoOnReload(){

            if ( window.location.hash.indexOf("#video") === 0 ){
                const split = window.location.hash.split("#video=");
                const [ _currentVideo, catList ] = split[1].split("|");
                currentVideo = _currentVideo;
                currentCat   = catList.split("=")[1];
                getSelectedVideoIndices( currentCat, currentVideo );
                videoPrev.style.opacity = 0.15;
                selectedVideoOnFirstClick = 0;
                video.setAttribute("src", `${URL_BASE}/data/${currentVideo}.mp4`);
            }

        }

        function pointOnHover( circle ){

            circle.addEventListener( "mouseleave", e =>{
                if ( streetInfo ){
                    streetInfo.innerText = "";
                }
                e.target.setAttribute( "r", e.target.getAttribute('r') / 2 );

                if ( currentEmotion === "all" ){
                    deactivateEmotions();
                    emoText.innerHTML = "&nbsp;";
                } 

            });

            circle.addEventListener( "mouseenter", e =>{

                if ( currentEmotion === null ){
                    deactivateEmotions();
                }

                if ( streetInfo ){
                    streetInfo.innerText = "Location: " + e.target.getAttribute("data-location");
                }
                e.target.setAttribute( "r", e.target.getAttribute('r') * 2 );

                if ( currentEmotion !== null && currentEmotion !== "all" ){
                    return; 
                }
                let cat = e.target.getAttribute("data-category");
                if ( !cat ){ return; }
                cat = parseInt( cat );

                const selectedEmotionBlock = emoIdx.querySelector(`[data-cat='${cat-1}']`);
                if ( selectedEmotionBlock ){
                    selectedEmotionBlock.classList.add("active");
                }

                const emotion = +selectedEmotionBlock.getAttribute("data-emotion");
                emoText.innerHTML = emotions[emotion].join("—");

                if ( currentEmotion !== "all" ){

                    const catColor = "#" + colors[cat-1][0];

                    gradStopColor1.setAttribute("stop-color", catColor);
                    gradStopColor2.setAttribute("stop-color", catColor);

                    style.textContent = `
                        svg .point.cat-${cat} {
                            display: block;
                        }
                        svg .point.cat-${cat} circle {
                            display: block;
                            fill: url(#grad1) !important;
                        }
                        svg .synapse.cat-${cat} {
                            display: block !important;
                        }
                    `;

                }
            });


        }

        function onEmotionIndexClick( e ){

            console.log("onEmotionIndexClick()");
            
            const cat     = e.target.getAttribute("data-cat");
            const emotion = +e.target.getAttribute("data-emotion");

            /*
            if ( cat === "5" ){
                cat6.reduce( (acc, val) =>{
                    const [ , lat1, lon1 ] = acc;
                    const [ , lat2, lon2 ] = val;
                    drawLineFromLatLon({ lat1, lon1, lat2, lon2, cat: 6 });
                    return val;
                });
                emoIdx.querySelectorAll(".active").forEach( p => p.classList.remove('active') );
                e.target.classList.add('active');
                emoText.textContent = emotions[cat];
                style.textContent = `
                    svg .point {
                        display: none;
                    }
                    svg .point.cat-${parseInt(cat)+1} {
                        display: block;
                        fill: #${colors[parseInt(cat)][1]};
                    }
                    svg .synapse.cat-${parseInt(cat)+1} {
                        display: block !important;
                    }
                `;
                return false;
            }
            */

           if ( cat ){

                console.log("onEmotionIndexClick()::cat", cat);

                deactivateEmotions();

                if ( currentEmotion !== cat ){

                   currentEmotion = cat;
                   e.target.classList.add('active');
                   // Display selected category of dots
                   const intCat = parseInt(cat);
                   const catColor = "#" + colors[intCat][0];

                   // CATEGORY IS 'NONE'
                   if ( intCat === 14 ){

                        gradStopColor1.setAttribute("stop-color", "#888");
                        gradStopColor2.setAttribute("stop-color", "#888");

                        currentEmotion = "none";
                        // emoText.innerHTML = "&nbsp;";
                        emoText.innerHTML = emotions[emotion].join("");
                        let styleTextContent = `
                            svg .point {
                                display: none;
                            }
                            svg .point.cat-15 {
                                display: block;
                                DISfill: #${colors[14][1]};
                            }
                            svg .point.cat-15 circle {
                                fill: url(#grad1) !important;
                            }
                            svg .synapse.cat-15 {
                                display: block !important;
                                stroke: #${colors[14][0]};
                            }
                        `
                        style.textContent = styleTextContent;
        

                   } else {

                       gradStopColor1.setAttribute("stop-color", catColor);
                       gradStopColor2.setAttribute("stop-color", catColor);
                    //    emoText.textContent = emotions[cat].join(" | ");
                       emoText.textContent = emotions[emotion].join("—");
                       style.textContent = `
                           svg .point {
                               display: none;
                           }
                           svg .point.cat-${intCat+1} {
                               display: block;
                               /* fill: ${catColor}; */
                           }
                           svg .point.cat-${intCat+1} circle {
                               display: block;
                               fill: url(#grad1) !important;
                           }
                           svg .synapse.cat-${intCat+1} {
                               display: block !important;
                           }
                       `;
                   }
                   
                } else {

                    currentEmotion = null;
                    emoText.innerHTML = "&nbsp;";
                    style.textContent = "";

                }
            }

        }

        function onPlayAll( e ){
            console.log("onPlayAll()");
            isPlayAllClicked = true;
            videoPlayAll.textContent = PLAYING_ALL_TEXT;
            onPlay();
        }

        function onSoundToggle( e ){
            console.log("Sound Toggle");
            if ( isMuted ){
                soundIcon.setAttribute("src", soundOnIcon );
                isMuted = false;
                return video.volume = 1;
            }
            isMuted = true;
            soundIcon.setAttribute("src", soundOffIcon );
            video.volume = 0;
        }

        function onGlobalKeyUp( e ){
            if ( e.key === "Escape" || e.code === "Escape" ){
                return closeVideo();
            }
            if ( e.key === "ArrowLeft" || e.code === "ArrowLeft" ){
                return onVideoPrev();
            }
            if ( e.key === "ArrowRight" || e.code === "ArrowRight" ){
                return onVideoNext();
            }
        }

        function onZoomIn( e ){
            if ( zoomLevel.toFixed(1) >= maxZoom ){ return; }
            zoom( zoomLevel + 0.1 );
            currentZoomSpan--;
            clearZoomLevel();
            if ( zoomScale ){
                zoomScale.querySelector(`span.scale:nth-child(${currentZoomSpan})`).classList.add("active");
            }
        }

        function onZoomOut( e ){
            if ( zoomLevel.toFixed(1) <= 0.5 ){ return; }
            zoom( zoomLevel - 0.1 );
            currentZoomSpan++;
            clearZoomLevel();
            if ( zoomScale ){
                zoomScale.querySelector(`span.scale:nth-child(${currentZoomSpan})`).classList.add("active");
            }
        }

        function centerCurrentEmotionBox(){

            const middlePoint = document.querySelectorAll("#emotional_index .point")[7];
            const emoCenter = emoText.getBoundingClientRect().left + ( emoText.getBoundingClientRect().width / 2 );
            const midCenter = middlePoint.getBoundingClientRect().left + ( middlePoint.getBoundingClientRect().width / 2 );
            emoText.style.marginLeft = ( ( midCenter - emoCenter ) * 2 ) + "px";
        }

        displayAll();
        loadVideoOnReload();
        centerCurrentEmotionBox();
        if ( isMobile ){
            video.setAttribute("controls", true);
        }

        // TODO: If ?debug=true > debugMode = true;

        // if ( currentEmotion === "all" ){
        //     displayAll();
        // }
        let resizeTimer;

        function onWindowResize( e ){
            // Done Resizing Event: 
            // https://css-tricks.com/snippets/jquery/done-resizing-event/
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                // Run code here, resizing has "stopped"
                console.log("onWindowResize()::onresizeend");
                // panZoomTiger.center();
                if ( !videoModal.classList.contains("active") ){
                    location.reload();
                }
            }, 250);
        }

        window.addEventListener("resize", onWindowResize );
        window.addEventListener( "keyup", onGlobalKeyUp );
        logo.addEventListener( "click", onLogoClick );
        document.body.addEventListener( "touchstart", handleGlobalClick );
        document.body.addEventListener( "click", handleGlobalClick );
               zoomIn.addEventListener( "click", onZoomIn );
              zoomOut.addEventListener( "click", onZoomOut );
               emoIdx.addEventListener( "click", onEmotionIndexClick );
        
        allBtn.addEventListener( "click", e =>{
            const isCurrentEmotionAll = currentEmotion === "all";
            if ( isMobile && isCurrentEmotionAll ){ return; }
            if ( isCurrentEmotionAll ){
                deactivateEmotions();
                currentEmotion = null;
                return style.textContent = "";
            }
            currentEmotion = "all";
            displayAll();
        });
        slide.addEventListener( "click", e => {
            aside.classList.add("active");
        });
        close.addEventListener( "click", e => {
            aside.classList.remove("active");
        });
        help.addEventListener( "click", e =>{

            // Handle Mobile Help Modal:
            if ( isMobile ){
                return helpModal.classList.add("active");
            } 

            // Handle Desktop Help
            instructions.classList.toggle("active");
            if ( helpImg.getAttribute("src") === "img/Help.png" ){
                helpImg.setAttribute("src", "img/HelpClose.png");
            } else {
                helpImg.setAttribute("src", "img/Help.png");
            }
        });
        closeModal.addEventListener( "click", e =>{
            helpModal && helpModal.classList.remove("active");
        });
        // POINTS CLICK HANDLER:
        mainMap.addEventListener( "touchstart", handleMainMapClick /* DEBUG */ ); 
        mainMap.addEventListener( "click", handleMainMapClick );
        // POINTS HOVER EFFECT:
        mainMap.querySelectorAll("circle").forEach( pointOnHover );

        // QUARTERS ON HOVER:
        svg.querySelectorAll("path").forEach( path =>{
            path.addEventListener('mouseenter', e =>{
                if ( e.target.id === "map_backdrop" ){
                    return;
                }
                if ( streetInfo ){
                    const dataId = e.target.getAttribute("data-id");
                    if ( dataId ){
                        streetInfo.innerText = "Location: " + e.target.getAttribute("data-id");
                    }
                }
                // MOVE HOVERED PATHS (QUARTERS) TO THE TOP OF THE VISUAL HIERARCHY
                /*
                svg
                .querySelector("#map_main")
                .insertBefore( 
                    e.target,
                    svg.querySelector('#separator')
                );
                */
                
                
            });
            path.addEventListener('mouseleave', e =>{
                if ( e.target.id === "map_backdrop" ){
                    return;
                }
                if ( streetInfo ){
                    streetInfo.innerHTML = "&nbsp;";
                }
            });
        }); 

        // VIDEO CONTROLS:
        videoPlayAll.addEventListener( "click", onPlayAll );
          videoClose.addEventListener( "click", closeVideo );
          videoSound.addEventListener( "click", onSoundToggle );
               video.addEventListener( "loadedmetadata", onLoadedMetaData );
               video.addEventListener( "ended", onVideoEnd );
           videoNext.addEventListener( "click", onVideoNext );
           videoPrev.addEventListener( "click", onVideoPrev );

        videoFull.addEventListener("click", e => {

            if ( video.requestFullscreen ){
                video.requestFullscreen();
            } else if ( video.webkitRequestFullscreen ){
                video.webkitRequestFullscreen();
            } else if ( video.msRequestFullScreen ){
                video.msRequestFullScreen();
            }
        
        });
        
        /* NONE BUTTON [ DEPRECATED ]
        noneBtn.addEventListener( "click", e =>{
            deactivateEmotions();
            if ( currentEmotion === "none" ){
                currentEmotion = null;
                return style.textContent = "";
            }
            currentEmotion = "none";
            emoText.innerHTML = "&nbsp;";
            let styleTextContent = `
                svg .point {
                    display: none;
                }
                svg .point.cat-15 {
                    display: block;
                    fill: #${colors[14][1]};
                }
                svg .synapse.cat-15 {
                    display: block !important;
                }
            `
            style.textContent = styleTextContent;
        });
        */

        // DEBUGGING VIDEOS:
        if ( videoDebug ){

            videoSelect.style.display = "block";
            videoSelect.addEventListener("change", e =>{
                console.log(e.target.selectedOptions[0].value);
                video.src = `${URL_BASE}/data/${e.target.selectedOptions[0].value}.mp4`;
            });

        }

    }

    // DRAW EMOTIONAL INDEX BUTTONS
    // colors.slice( 0, -1 ).forEach( ... ) // Drop the 15th category
    // colors.forEach(( color, idx ) => {
    colorsToDisplay.forEach(( color, idx ) => {
        const direction = isMobile ? 'bottom' : 'right';
        const className = idx === 0 ? 'first' : idx === colorsToDisplay.length - 1 ? "last" : "";
        const style = `
            background:linear-gradient(
                to ${direction}, 
                #${color[0]} 0, #${color[0]} 33%, 
                #${color[1]} 33%, #${color[1]} 66%, 
                #${color[2]} 66%, #${color[2]} 100%
            );
        `
        emoIdx.insertAdjacentHTML( 
            'beforeend', 
            `
            <div class="point ${className}">
                <div data-cat="${color[3]-1}" data-emotion="${idx}" style="${style}" class="ellipse">&nbsp;</div>
            </div>
            `
        );

    });

    // CALCULATE ALL BUTTON'S TRIANGLE:
    const emoIdxPointWidth = emoIdx.querySelector(".point").getBoundingClientRect().width;
    styleAll.textContent = `
        #emotional_index #all {
            visibility: visible;            
            width: ${emoIdxPointWidth}px;
        }
        #emotional_index #all::before {
            border-width: 0 0 10px ${emoIdxPointWidth}px;
        }    
    `
    panZoomTiger = svgPanZoom(svg, { 
        dblClickZoomEnabled: false, 
        mouseWheelZoomEnabled 
    });

    panZoomTiger.setBeforeZoom(( prev, next ) =>{

        mainMap.querySelectorAll("circle").forEach( (circle,idx) =>{
            const radius = circle.getAttribute("r"); 
            const ratio = prev / next;
            circle.setAttribute("r", radius * ratio );
        });

        
    })
    zoom( zoomLevel );
    const { x, y } = panZoomTiger.getPan();
    panZoomTiger.pan({ x, y: y + initialPanOffset });
    if ( debugMode ){
        window.panZoomTiger = panZoomTiger;
    }

    // LOAD + PARSE CSV
    fetch("map.tsv")
    .then( res => res.text() )
    .then( parseCSV )
    .then( addEventHandlers )
    .catch( console.error );

}

document.addEventListener("DOMContentLoaded", RF );

// TODO: Fix Video Width (fullscreen): https://rattlingframes.net/#video=12|cat=9 (Firefox)