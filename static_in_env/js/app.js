$(document).ready(function(){
	var trackTask;
	var face_scan = true;
    var preview = document.getElementById('preview');
    var faceObj = new tracking.ObjectTracker(['face']);
    var loading = document.querySelector(".loading");
    var stage = document.querySelector(".stage");
    var trackerCanvas = document.getElementById('facetracker');
    var resultSet = document.querySelector(".item-list ul");
    var items = {};
    var unitPrices = {};
    var total = 0.0;
    var itemCodeReg = /\/(\d+)$/;
    var captureCanvas = document.getElementById('image_capture');
    var livestreamCanvas = document.getElementById('livestream');
    var w = preview.clientWidth, h = preview.clientHeight;
    var scanner;
    trackerCanvas.width = w;
    trackerCanvas.height = h;
    captureCanvas.width = w;
    captureCanvas.height = h;
    livestreamCanvas.width = w;
    livestreamCanvas.height = h;

    var trackerCtx = trackerCanvas.getContext('2d');
    var captureCtx = captureCanvas.getContext('2d');
    var liveCtx = livestreamCanvas.getContext('2d');
    
    var initDelay = 3;
    var delayCtx = { timerId: -1, cnt : initDelay };
    var defaultCamera;

    $('#pay-btn').on('click', function(){
    	if(!face_scan) {
    		face_scan = true;
    		trackTask.run();
    	    items = {};
    	    unitPrices = {};
    	    total = 0.0;
            stage.innerText = "Face Scanning";
            face_scan = true;
            $('.list-group').html("");
            $('.total').text("$0");
    	}
    });
    
    var delayFunc = function(ctx) {
        return function() {
            if(!ctx || ctx.timerId === -1) return;
            if(ctx.cnt > 0)
                document.querySelector('.overlay').innerText = ctx.cnt;
            ctx.cnt -= 1;
            if(ctx.cnt < 0) {
                document.querySelector('.overlay').innerText = "";
                captureCtx.drawImage(preview, 0, 0, image_capture.width, image_capture.height);
                var dataUrl = captureCanvas.toDataURL('image/webp');
                if(trackTask) { 
                    trackerCtx.clearRect(0, 0, trackerCanvas.width, trackerCanvas.height);
                    trackTask.stop();
                    face_scan = false;
                }
                ctx.timerId = -1;
                ctx.cnt = initDelay;
                if(!scanner) {
                	scanner = new Instascan.Scanner({
                        video: preview,
                        scanPeriod: 1,
                        mirror : false
                    });
                    scanner.addListener('scan', function(content, image){
                        var code = content.match(itemCodeReg);
                        if(code && code[1]) {
                        	code = code[1];
                        	if(!items[code]) {
                            	$.get(`/item/${code}`, function(req){
                                    var li = document.createElement("li");
                                    li.classList.add("list-group-item");
                                    li.setAttribute("data-code", code);
                                    items[code] = 1;
                                    unitPrices[code] = req.unitPrice;
                                    var itemDiv = document.createElement("div");
                                    itemDiv.classList.add("item");
                                    li.append(itemDiv);
                                    var text = document.createElement("span");
                                    var quantity = document.createElement("span");
                                    var wrapper = document.createElement("span");
                                    wrapper.classList.add("item-quantity");
                                    wrapper.innerText = "X";
                                    quantity.innerText = "1";
                                	text.innerText = `${req.name}($${req.unitPrice})`;
                                    itemDiv.append(text);
                                    itemDiv.append(wrapper);
                                    wrapper.append(quantity);
                                    resultSet.append(li);
                                    total += req.unitPrice;
                                    $('.total').text(`$${parseFloat(total).toFixed(2)}`);
                                    $('#beep')[0].play();
                            	});
                        	} else {
                        		var span = document.querySelector(`[data-code="${code}"] .item-quantity > span`);
                        		items[code] += 1;
                        		span.innerText = items[code];
                        		total += unitPrices[code];
                        		$('#beep')[0].play();
                        		$('.total').text(`$${parseFloat(total).toFixed(2)}`);
                        	}
                        } else {
                        	alert("No Such Item!");
                        }                        
                    });
                }
                //                 request api to recoginize face
                stage.innerText = "Recoginizing...";
                captureCtx.drawImage(preview, 0, 0, w, h);
                var dataUrl = captureCanvas.toDataURL('image/webp'); 
                loading.classList.replace('hide','show');
                $.ajax({
                	url : '/auth/user/',
                	type : 'PUT',
                	data : dataUrl,
                	success : function(usr) {
                		if(usr.id) {
                    		stage.innerText = "QR Code Scanning";
                    		$('h4.card-title').text(usr.name);
                    		$('.card-text').text('Prime');
                    		$('.user-card img')[0].src = usr.photo;
                            scanner.start(defaultCamera);
                		} else {
//                			alert('you are not in database');
                			stage.innerText = "Face Scanning";
                			ctx.timerId = -1;
                            ctx.cnt = initDelay;
                            trackTask.run();
                		}
                		loading.classList.replace('show','hide');
                	},
                	fail : function(err, usr) {
            			stage.innerText = "Face Scanning";
            			ctx.timerId = -1;
                        ctx.cnt = initDelay;
                        trackTask.run();                		
                	}
                });
                
            } else {
                ctx.timerId = setTimeout(delayFunc(ctx), 1000);
            }
        }
    }

    var onTrack = function(evt) {
        trackerCtx.clearRect(0, 0, trackerCanvas.width, trackerCanvas.height);
        if(evt.data.length == 0) {
            // not detected
            // if(delayCtx.timerId !== -1) {
            //     clearTimeout(delayCtx.timerId);
            //     delayCtx.timerId = -1;
            //     delayCtx.cnt = initDelay;    
            // }
        } else {

            if(delayCtx.timerId === -1) {
                delayCtx.timerId = 0;
                delayFunc(delayCtx)();
            }

            evt.data.forEach(function(rect) {
                trackerCtx.strokeStyle = 'blue';
                trackerCtx.lineWidth = 3;
                trackerCtx.strokeRect(rect.x, rect.y, rect.width, rect.height);
                // trackerCtx.font = '11px Helvetica';
                // trackerCtx.fillStyle = "#fff";
                // trackerCtx.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
                // trackerCtx.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
            });
        }
    }

    faceObj.setInitialScale(4);
    faceObj.setStepSize(2);
    faceObj.setEdgesDensity(0.1);
    faceObj.on('track', onTrack);
    trackTask = tracking.track(preview, faceObj);

    Instascan.Camera.getCameras().then(function(cameras){
        if(cameras.length > 0) {
            defaultCamera = cameras[0];
            defaultCamera.start().then(function(stream){
                preview.srcObject = stream;
            });
        }
    }).catch(function(err){
        console.error(err);
    });
    
    var wsHost = "ws://" + location.host + "/livestream";
	var ws = new WebSocket(wsHost);
	ws.onopen = function() {
		console.log("connected.");
	    requestAnimationFrame(function step(ts){
	    	liveCtx.drawImage(preview, 0, 0, w, h);
	    	var message = livestreamCanvas.toDataURL("image/webp");
	    	ws.send(message);
	    	requestAnimationFrame(step);
	    });
	}
	ws.onmessage = function() {
		//ignore
	}
	ws.onerror = function(err) {
		console.log("ws err: " + err);
		console.dir(err);
	}

});