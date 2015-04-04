// ioESP JavaScript & jQuery Library

$(document).ready(function(e) { onDeviceReady(); });

function onLoad() {
	document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
	if(typeof(Storage) === "undefined") {
    	window.alert("Sorry! No Web Storage support..");
	}
	
	SlideManu = false;
	Dialog = false;
	DialogName = "";
	
	UpDateListAll();
	
	$("[data-page='index'] ul.list-io > li").click(function(e) {
        if ($(this).find("i.io-icon").attr("class").indexOf("io-icon i") >= 0){
			$(this).find("i.io-icon").attr("class", "io-icon o");
		}else{
			$(this).find("i.io-icon").attr("class", "io-icon i");
		}
    });
	
	$(".slide-menu-show").click(function(e) {
        $("#slide-menu").show().css({"transition": "300ms", "-webkit-transition": "300ms", "-webkit-transform": "translate(280px, 0)", "box-shadow": "0 0 5px rgba(0, 0, 0, 0.5)"});
		$("#back-background").fadeIn(300);
		SlideManu = true;
    });
	
	$(".slide-menu-hide, #back-background").click(function(e) {
        $("#slide-menu").css({"transition": "300ms", "-webkit-transition": "300ms", "-webkit-transform": "translate(0, 0)", "box-shadow": "none"});
		$("#back-background").fadeOut(300);
		SlideManu = false;
    });
	
	$("#slide-menu > .menu-list li > a").click(function(e) {
        $(".slide-menu-hide").click();
		$("[data-type='page']").each(function(index, element) {
            $(this).hide();
        });
		$("[data-type='page'][data-page='" + $(this).attr("data-href") + "']").show();
		$("#title").text($("[data-type='page'][data-page='" + $(this).attr("data-href") + "']").attr("data-title"));
		$("body > header > .icon-right").remove();
		if ($("[data-type='page'][data-page='" + $(this).attr("data-href") + "']").attr("data-icon-right"))
			$("body > header").prepend('<span class="icon-right"><i class="' + $("[data-type='page'][data-page='" + $(this).attr("data-href") + "']").attr("data-icon-right").replace(/\,/g, ' ') + '"></i></span>');
		if ($(this).attr("data-href") == 'manage'){
			$(".new-io").click(function(e) {
                $("#new-dialog").css({"transition": "300ms", "-webkit-transition": "300ms", "-webkit-transform": "translate(0, 0)"});
				Dialog = true;
				DialogName = "#new-dialog";
            });
		}
    });
	
	$(document).swipe( {
        swipeStatus:function(event, phase, direction, distance , duration , fingerCount) {
           // console.log("swiped " + direction + " : " + distance + ' px');
			if (Dialog == false){
				if (SlideManu == false && direction == "right" && distance <= 280)
					$("#slide-menu").show().css({"transition": "none", "-webkit-transition": "none", "-webkit-transform": "translate(" + distance + "px, 0)", "box-shadow": "0 0 5px rgba(0, 0, 0, 0.5)"});
				else if (SlideManu == true && direction == "left" && distance <= 280)
					$("#slide-menu").show().css({"transition": "none", "-webkit-transition": "none", "-webkit-transform": "translate(" + (280 - distance) + "px, 0)", "box-shadow": "0 0 5px rgba(0, 0, 0, 0.5)"});
				if(phase === $.fn.swipe.phases.PHASE_END || phase === $.fn.swipe.phases.PHASE_CANCEL) {
					if (SlideManu == false)
						$(".slide-menu-hide").click();
					else if (SlideManu == true)
						$(".slide-menu-show").click();
				}
			}else{
				if (direction == "right")
					$(DialogName).css({"transition": "none", "-webkit-transition": "none", "-webkit-transform": "translate(" + distance + "px, 0)"});
				if(phase === $.fn.swipe.phases.PHASE_END || phase === $.fn.swipe.phases.PHASE_CANCEL) {
					$(DialogName).css({"transition": "300ms", "-webkit-transition": "300ms", "-webkit-transform": "translate(0, 0)"});
				}
			}
        },
        swipe:function(event, direction, distance, duration, fingerCount) {
			if (Dialog == false){
				if (SlideManu == false && direction == "right")
					$(".slide-menu-show").click();
				else if (SlideManu == true && direction == "left")
					$(".slide-menu-hide").click();
			}else{
				$(DialogName).css({"transition": "300ms", "-webkit-transition": "300ms"}).css({"-webkit-transform": "translate(100%, 0)"});
				Dialog = false;
			}
        },
		fingers:$.fn.swipe.fingers.ALL  
	});
	
	$(".DialogCancel").click(function(e) {
        $(DialogName).css({"transition": "300ms", "-webkit-transition": "300ms", "-webkit-transform": "translate(100%, 0)"});
		Dialog = false;
		DialogName = "";
    });
	
	$(".Edit-Save").click(function(e) {
		var id = $("#edit-id").val();
		var name = $("#edit-name").val();
		var pin = $("#edit-pin").val();
        $(".DialogCancel").click();
    });
	
	$(".New-Save").click(function(e) {
		$("#newio-form").submit();
	});
	
	$("#newio-form").submit(function(e) {
        e.preventDefault();
		if ($("#new-name").val().length <= 0){
			$("#new-name").focus();
			return false;
		}
			
		if ($("#new-pin").val().length <= 0 || $("#new-pin").val() < 1 || $("#new-pin").val() > 8){
			$("#new-pin").focus();
			return false;
		}
		
		var ListIOJson = localStorage.io;
		if (typeof ListIOJson === "undefined")
			ListIOJson = "[]";
		var ListIO = JSON.parse(ListIOJson);
		ListIO.push({name: $("#new-name").val(), status: false, port: $("#new-pin").val()});
		localStorage.io = JSON.stringify(ListIO);
		UpDateListAll();
		$(".DialogCancel").click();
		$(this)[0].reset();
    });
}

function UpDateListAll(){
	var ListIOJson = localStorage.io;
	if (typeof ListIOJson !== "undefined"){
		var ListIO = JSON.parse(ListIOJson);
		if (ListIO.length > 0){
			$("article[data-page='index'] > ul").html('');
			$("article[data-page='manage'] > ul#edit-list").html('');
			ListIO.forEach(function(IO, index, array){
				var name = IO.name;
				var status = IO.status;
				var port = IO.port;
				html = '';
				html += '<li data-id="' + index + '">';
				html += '<div class="name">' + name + '</div>';
				html += '<div class="right-icon">';
				html += '<i class="io-icon ' + (status ? 'i' : 'o') + '"></i>';
				html += '</div>';
				html += '</li>';
				$("article[data-page='index'] > ul").append(html);
				
				html = '';
				html += '<li data-id="' + index + '">';
				html += '<div class="name">' + name + '</div>';
				html += '<div class="right-icon manage-icon-box">';
				html += '<span class="edit">';
				html += '<i class="md md-mode-edit"></i>';
				html += '</span>';
				html += '<span class="remove">';
				html += '<i class="md md-close"></i>';
				html += '</span>';
				html += '</div>';
				html += '</li>';
				$("article[data-page='manage'] > ul#edit-list").append(html);
			});
		}
	}
	
	$("#edit-list > li span.edit").click(function(e) {
		var id = $(this).parents("li").attr("data-id");
		$("#edit-id").val(id);
		var ListIOJson = localStorage.io;
		var ListIO = JSON.parse(ListIOJson);
		if (typeof ListIO[id] !== "undefined"){
			$("#edit-name").val(ListIO[id].name);
			$("#edit-pin").val(ListIO[id].port);
		}
        $("#edit-dialog").css({"transition": "300ms", "-webkit-transition": "300ms", "-webkit-transform": "translate(0, 0)"});
		Dialog = true;
		DialogName = "#edit-dialog";
    });
	
	$("#edit-list > li span.remove").click(function(e) {
		var id = $(this).parents("li").attr("data-id");
		$(this).parents("li").slideUp(400, "swing", function(){
			$(this).remove(); 
			$("ul.list-io > li[data-id='" + id + "']").each(function(index, element) {
				$(this).remove();
			});
			var ListIOJson = localStorage.io;
			var ListIO = JSON.parse(ListIOJson);
			if (typeof ListIO[id] !== "undefined")
				ListIO.splice(id, 1);
			localStorage.io = JSON.stringify(ListIO);
		});
	});
}