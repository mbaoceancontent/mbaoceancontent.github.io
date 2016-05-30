	var index = -1;
	var changeName;
	var id = -1;
	$("tbody").on("dblclick", function(e) {
		if(e.target.tagName == "TD") {
			var tr = $(e.target).parent();
			id = tr.attr("id")

			$("#changeModal").modal('show');
			for(var i=0;i<nowPageResult.length;i++) {
				if(nowPageResult[i].id == id) {
					index = i;
				}
			}
			
			$("#changeInput").val($("#"+id).find("."+e.target.className).html());
			changeName = e.target.className.split("_")[1];
			var data = nowPageResult[index];
		}
	})
	
	$("#changeSubmit").on("click", function() {
		var data = nowPageResult[index];
		data[changeName] = $("#changeInput").val();
		var quarter = data.quarter;
		var title = data.title;
		var species = data.species;
		var broadcastTV = data.broadcastTV;
		var broadcastNet = data.broadcastNet;
		var seed = data.seed;
		var type = data.type;
		var shootTime = data.shootTime;
		var premiereDate = data.premiereDate;
		var week = data.week;
		var time = data.time;
		var term = data.term;
		var offer = data.offer;
		var sellStatus1 = data.sellStatus1;
		var sellStatus2 = data.sellStatus2;
		var sellStatus3 = data.sellStatus3;
		var sellStatus4 = data.sellStatus4;
		var team = data.team;
		var actors = data.actors;
		var content = data.content;
		var other = data.other;
		var token = localStorage["token"]
		$.ajax({
			url: URL+"excel/changeExcel",
			headers: {
				token: token
			},
			data:{
				id: id,
				quarter: quarter,
				title: title,
				species: species,
				broadcastTV: broadcastTV,
				broadcastNet: broadcastNet,
				seed: seed,
				type: type,
				shootTime: shootTime,
				premiereDate: premiereDate,
				week: week,
				time: time,
				term: term,
				offer: offer,
				sellStatus1: sellStatus1,
				sellStatus2: sellStatus2,
				sellStatus3: sellStatus3,
				sellStatus4: sellStatus4,
				team: team,
				actors: actors,
				content: content,
				other: other
			},
			dataType:'json',
			type: 'post',
			success: function(data) {
				if(data.message == "缺少token" || data.message == "token过期") {
            		alert("登录过期,请重新登录")
                	localStorage.clear();
                	location.href="index.html";
            	}else if(data.message == "用户权限不够") {
            		alert("用户权限不够");
            	} else {
					alert(data.message);
					refreshData(1,pageSize,condition);
					$("#changeModal").modal('hide');
            	}
			}
		})
	})
