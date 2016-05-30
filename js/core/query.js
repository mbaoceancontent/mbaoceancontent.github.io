	//定义
    var nowPage = 1;
    var totalPage = 2;
    var token = localStorage["token"];
    var pageSize = 10;
    var condition = null;
    
    var nowPageResult = null;
    
    var loadShowColumn = function() {
    	if(localStorage["columns"] == null) {
    		var columns = {"quarter": true,"species": true,"title": true,"broadcastNet": false,"broadcastTV": true,"type": true,"seed": true,"offer": true,"shootTime": false,"premiereDate": true,"week": true,"time": true,"term": false,"sellStatus": true,"team": false,"actors": false,"content": false,"other": false}
    		localStorage["columns"] = JSON.stringify(columns);
    		for(var x in columns) {
    			if(columns[x]) {
    				$("#c_"+x).attr("checked",true)
    			}
    		}
    	} else {
    		var json = JSON.parse(localStorage["columns"])
    		for(var x in json) {
    			if(json[x]) {
    				$("#c_"+x).attr("checked",true)
    			}
    		}
    	}
    }
    
    var checkShowColumn = function() {
		var json = JSON.parse(localStorage["columns"])
		for(var x in json) {
			if(json[x]) {
				$(".t_"+x).show();
			} else {
				$(".t_"+x).hide();
			}
		}
    }
    
    var refreshData = function(page, pageSize, condition) {
        $.ajax(URL+"excel/getExcelData", {
            dataType:"json",
            async:true,
            headers: {
            	token: token
            },
            data: {
                page:page,
                pageSize:pageSize,
                condition: condition
            },
            success: function(data) {
                if(data.code == 1) {
                	nowPageResult = data.result;
                	$("#now-page").html(page);
                    nowPage = page;
                    $("tbody").empty();
                    var num = data.num;
                    var jsonArray = data.result;
                    for(var i=0;i<num;i++) {
                        var json = jsonArray[i];
                        $("tbody").append(
                        		"<tr id="+json.id+">"+
                        			"<td title='"+json.quarter+"' class='t_quarter'>"+json.quarter+"</td>"+
                        			"<td title='"+json.species+"' class='t_species'>"+json.species+"</td>"+
                        			"<td title='"+json.title+"' class='t_title'>"+json.title+"</td>"+
                        			"<td title='"+json.broadcastTV+"' class='t_broadcastTV' style='display:none'>"+json.broadcastTV+"</td>"+
                        			"<td title='"+json.broadcastNet+"' class='t_broadcastNet'>"+json.broadcastNet+"</td>"+
                        			"<td title='"+json.seed+"' class='t_seed'>"+json.seed+"</td>"+
                        			"<td title='"+json.type+"' class='t_type'>"+json.type+"</td>"+
                        			"<td title='"+json.shootTime+"' class='t_shootTime' style='display:none'>"+json.shootTime+"</td>"+
                        			"<td title='"+json.premiereDate+"' class='t_premiereDate'>"+json.premiereDate+"</td>"+
                        			"<td title='"+json.week+"' class='t_week'>"+json.week+"</td>"+
                        			"<td title='"+json.time+"' class='t_time'>"+json.time+"</td>"+
                        			"<td title='"+json.term+"' class='t_term' style='display:none'>"+json.term+"</td>"+
                        			"<td title='"+json.offer+"' class='t_offer'>"+json.offer+"</td>"+
                        			"<td title='"+json.sellStatus1+"' class='t_sellStatus'>"+json.sellStatus1+"</td>"+
                        			"<td title='"+json.sellStatus2+"' class='t_sellStatus'>"+json.sellStatus2+"</td>"+
                        			"<td title='"+json.sellStatus3+"' class='t_sellStatus'>"+json.sellStatus3+"</td>"+
                        			"<td title='"+json.sellStatus4+"' class='t_sellStatus'>"+json.sellStatus4+"</td>"+
                        			"<td title='"+json.team+"' class='t_team' style='display:none'>"+json.team+"</td>"+
                        			"<td title='"+json.actors+"' class='t_actors' style='display:none'>"+json.actors+"</td>"+
                        			"<td title='"+json.content+"' class='t_content' style='display:none'>"+json.content+"</td>"+
                        			"<td title='"+json.other+"' class='t_other' style='display:none'>"+json.other+"</td>"+
                        		"</tr>");
                    }
                    checkShowColumn();
                    getTotalPage(pageSize, condition);
                    getLastUpdate();
                } else {
                	if(data.message == "用户权限不够") {
                		alert("用户权限不够");
                	} else if(data.message == "缺少token" || data.message == "token过期") {
                		alert("登录过期,请重新登录")
	                	localStorage.clear();
	                	location.href="index.html";
                	}
                }
            }
        })
    }

    var getTotalPage = function(pageSize, condition) {
        $.ajax(URL+"excel/getTotalNum", {
            dataType:"json",
            data: {
            	condition: condition
            },
            headers: {
            	token: token
            },
            success:function(data) {
            	if(data.message == "缺少token" || data.message == "token过期") {
            		alert("登录过期,请重新登录")
                	localStorage.clear();
                	location.href="index.html";
            	}
            	if(data.num % pageSize == 0) {
					totalPage = parseInt(data.num / pageSize)
				} else {
					totalPage = parseInt(data.num / pageSize) + 1;
				}
                $("#totle-page").html(totalPage);
            }
        })
    }

    var getLastUpdate = function() {
    	$.ajax(URL+"log/getLastUpdate", {
    		type:'GET',
    		dataType: 'json',
    		headers: {
    			token: token
    		},
    		success:function(data) {
				if(data.message == "缺少token" || data.message == "token过期") {
            		alert("登录过期,请重新登录")
                	localStorage.clear();
                	location.href="index.html";
            	}
				$("#query-subtitle-lastupdate-username").html(data.result.email);
				$("#query-subtitle-lastupdate-time").html(data.result.logTime.split('.')[0]);
    		}
    	})
    }
	//按钮
	 $("#next-page").on("click",function() {
        if(nowPage < totalPage) {
            refreshData(nowPage+1, pageSize, condition);
        }
    })

    $("#prev-page").on("click",function() {
        if(nowPage > 1) {
            refreshData(nowPage-1, pageSize, condition);
        }
    })

    $("#goto-page-btn").on("click",function() {
        var gotoPage = 0;
        gotoPage = parseInt($("#goto-page").val());
        if(isNaN(gotoPage)) {
            alert("数值类型错误");
        } else {
            if(gotoPage <= totalPage && gotoPage > 0) {
                refreshData(gotoPage, pageSize, condition);    
            }
        }
    })
    
    $("#export-to-excel").on("click",function() {
        $.ajax(URL+"excel/transformToExcel", {
            dataType: "json",
            headers: {
            	token: token
            },
            success: function(data) {
                if(data.code == 1) {
                    $("#export-modal-content").html('导出成功,<a href="'+data.url+'">点我下载</a>');
                } else {
                    $("#export-modal-content").html('导出失败,未知异常,请联系管理员');
                }
                if(data.message == "用户权限不够") {
            		alert("用户权限不够");
            	} else if(data.message == "token过期" || data.message == "缺少token") {
            		alert("登录过期,请重新登录")
                	localStorage.clear();
                	location.href="index.html";
            	}
            },
            error: function() {
                $("#export-modal-content").html("导出失败,网络异常");
            }
        })
    })
    
    $("#key-word-query-btn").on("click", function() {
    	condition = $("#key-word-query").val();
    	nowPage = 1;
		if(condition == "") {
			condition = null;
		} 
		refreshData(1,pageSize,condition);
    })
    
    $(".checkbox input").on("click",function() {
    	if($(this).attr("checked")) {
    		$(this).attr("checked", false);
    	} else {
    		$(this).attr("checked", true);
    	}
    })
    
    $("#save-setting-query").on("click", function() {
    	var json = JSON.parse(localStorage["columns"]);//获取到本地保存的数据
    	$(".checkbox input").each(function() {			//将页面上的设置和本地保存的进行对比并设置
    		var key = $(this).attr("id").split("_")[1]
    		if($(this).attr("checked")) {
    			json[key] = true
    		} else {
    			json[key] = false
    		}
    	})
    	localStorage["columns"] = JSON.stringify(json); //存储到本地
    	checkShowColumn(); 								//读取本地保存的数据并展示到前台
    	$("#querySetting").modal('hide');
    })
    
    //手机显示的时候有一个按钮点击时自动滚动
    var isShow = false
    $("#pageBtn").on("click",function() {
        if(!isShow) {
            $(".main").animate({
                scrollTop : $(document).height()+69
            },'slow')
            isShow = true;
        } else {
            isShow = !isShow;
        }
    })