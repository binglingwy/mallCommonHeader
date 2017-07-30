$(function(){
	$("#formlay input").blur(function(){
		$("input").css("background-color","#D6D6FF");
	});
	$(document).on({
		blur:function(){
			var _this=$(this);
			var vzhi= $.trim(_this.val());
			var vzhireg1=/^[a-zA-Z0-9!@#$%^&*-_=+]{8,20}$/;
			var vzhireg2 = /\d+/g;
			var vzhireg3 = /[a-zA-Z]+/g;
			if(vzhi.length==0){
				var err=_this.attr("data-null");
				_this.after('<div class="form-error"><i class="icon iconfont">&#xe6e7;</i>'+err+'</div>');
			}else{
				if(_this.attr("id")=='pwd1'){
					if(vzhi.length<8){
						_this.after('<div class="form-error"><i class="icon iconfont">&#xe6e7;</i>密码不能少于8位</div>');
					}else{
						if(!vzhireg1.test(vzhi) || !vzhireg2.test(vzhi) || !vzhireg3.test(vzhi)){
							_this.after('<div class="form-error"><i class="icon iconfont">&#xe6e7;</i>密码不符合要求</div>');
						}else{
							if(vzhi==$("#userNickName").val()){
								_this.after('<div class="form-error"><i class="icon iconfont">&#xe6e7;</i>账号和密码不能一样</div>');
							}
						}
					}
				}
				if(_this.attr("id")=='pwd2'){
					if(vzhi!=$("#pwd1").val()){
						_this.after('<div class="form-error"><i class="icon iconfont">&#xe6e7;</i>两次输入的密码不一致</div>');
					}
				}
			}


		},
		focus:function(){
			var _this=$(this);
			_this.siblings(".form-error").remove();
		}
	},"#formlay input");
	var top = {
		popDialog: null,	
		// 修改密码
		editPassword: function(){
			var that = this;
			that.popDialog.close().remove();
			var d = dialog({
			    content:$("#editPasswordTpl").html(),
				title:"密码修改",
				width:790,
				height:255,
				fixed: true,
				okValue: '确认修改',
				ok: function () {
					//验证新密码是否符合规则
					var str ="";
					var vzhireg1=/^[a-zA-Z0-9!@#$%^&*-_=+]{8,20}$/;
					var vzhireg2 = /\d+/g;
					var vzhireg3 = /[a-zA-Z]+/g;

					if($.trim($("#formerPwd").val()).length == 0){
						$("#formerPwd").siblings(".form-error").remove();
						$("#formerPwd").after('<div class="form-error"><i class="icon iconfont">&#xe6e7;</i>密码不能为空</div>');
					}else{
						if($.trim($("#pwd1").val()).length == 0){
							$("#pwd1").siblings(".form-error").remove();
							$("#pwd1").after('<div class="form-error"><i class="icon iconfont">&#xe6e7;</i>密码不能为空</div>');
						}else{
							if($.trim($("#pwd1").val()).length<8){
								$("#pwd1").siblings(".form-error").remove();
								$("#pwd1").after('<div class="form-error"><i class="icon iconfont">&#xe6e7;</i>密码不能少于8位</div>');
							}else{
								if(!vzhireg1.test($.trim($("#pwd1").val())) || !vzhireg2.test($.trim($("#pwd1").val())) || !vzhireg3.test($.trim($("#pwd1").val()))){
									$("#pwd1").siblings(".form-error").remove();
									$("#pwd1").after('<div class="form-error"><i class="icon iconfont">&#xe6e7;</i>密码不符合要求</div>');
								}else{
									if($.trim($("#pwd1").val())==$("#userNickName").val()){
										$("#pwd1").siblings(".form-error").remove();
										$("#pwd1").after('<div class="form-error"><i class="icon iconfont">&#xe6e7;</i>账号和密码不能一样</div>');
									}else{
										if($.trim($("#pwd2").val()).length == 0){
											$("#pwd2").siblings(".form-error").remove();
											$("#pwd2").after('<div class="form-error"><i class="icon iconfont">&#xe6e7;</i>确认密码不能为空</div>');
										}else{
											if($.trim($("#pwd2").val())!=$("#pwd1").val()){
												$("#pwd2").siblings(".form-error").remove();
												$("#pwd2").after('<div class="form-error"><i class="icon iconfont">&#xe6e7;</i>两次输入的密码不一致</div>');
											}else{
												Yt.ajax({
													type:"post",
													url: $("#basePath").val()+"/admin/user/user/checkUserPass.json",
													data: {
														userPass:$("#formerPwd").val(),
														userPwd2:$("#pwd2").val()
													},
													dataType: "json",
													success: function(data){
														if(data.success){
															//开始提交表单
															$.ajax({
																type:"post",
																url: $("#basePath").val()+"/admin/user/user/editPwd.json",
																data: {userPass:$("#pwd2").val()},
																dataType: "json",
																success: function(data){
																	if(data.success){

																		Yt.tips("密码修改成功！请重新登录",function(){
																			window.location.href=$("#basePath").val()+"/pub/login/logout.do";
																		});
																	}
																}
															});
															return true;
														}else{
															if(data.message == "0"){
																str ="新密码不能跟原密码相同！";
															}else{
																str ="原密码不正确！";
															}

															Yt.tips(str);
															$("#pwd1").focus();
															return false;
														}
													}
												});

											}
										}
									}
								}
							}
						}
					}
					return false;
				}
			});
			$(".ui-dialog-button").css("float",'inherit');
			$(".ui-dialog-button").css("padding-left",'375px');
			$(".ui-dialog-footer button.ui-dialog-autofocus").css("padding",'10px  50px');
			$(".ui-dialog-footer button.ui-dialog-autofocus").css("font-size",'16px');
			d.showModal();
		},
		subPass:function(){

		},
		// 系统设置
		configs: function(){
			var that = this,
				configWrap = null;
			
			that.popDialog = dialog({
					align: 'bottom right',
					quickClose: true,
					padding:2,
					width:170,
				    content:$("#sysConfigTpl").html()
			});
			that.popDialog.show(document.getElementById('setupBtn'));
			
			
			configWrap = $("#configWrap");
			configWrap.find("#editPasswordBtn").click(function(){
				that.editPassword();
			});
			configWrap.find("#setPriceCheckbox").click(function(){
				that.setPriceStutas($(this));
			});
			
			configWrap.find("#loginOutBtn").click(function(){
				Yt.confirm("您确定要退出系统吗？",function(){
					window.location.href=$("#basePath").val()+"/pub/login/logout.do";
				});
			});
		},
		
		// 设置价格显示隐藏 0显示 1隐藏
		setPriceStutas: function(target){
			var hidePriceVal = 0,
				priceCheckbox = target;
			
			if(priceCheckbox.hasClass("active")){
				hidePriceVal = 1;
				priceCheckbox.removeClass("active");
				priceCheckbox.find("i").html("&#xe65e;");
			}else{
				hidePriceVal = 0;
				priceCheckbox.addClass("active");
				priceCheckbox.find("i").html("&#xe65d;");
			}

			Yt.post($("#basePath").val()+"/admin/user/user/togglePriceInfo.json", {hidePriceInfo:hidePriceVal}, function(data){
				window.location.reload();
			 });
		},

		// 低版本浏览器控制
		bowserControl: function () {
			var isMS = /(msie|trident|edge)/i.test(navigator.userAgent) && !window.opera,
				isLowerIE8 = isMS  && parseInt($.browser.version, 10) < 8;
			if(isLowerIE8){
				window.location.href = $("#basePath").val() + '/static/noSupport/noSupport.htm';
			}
		}
			
	};

	top.bowserControl();
	
	$("#sysConfigBtn").click(function(){
		top.configs();
	});
	
	$("#aboutClose").click(function(){
		$("#aboutWrap").hide();
	});
	
	$("#aboutBtn").click(function(){
		$("#aboutWrap").show();
	});
	
	$("#setupBtn").click(function(){
		top.configs();
	});
	
//	$(document).ready(function(){
//		Yt.get($("#basePath").val()+"/admin/notice/getNewNotice.json",{},function(data){
//			var notice=data.data;
//			if(notice && notice.title){
//				if(notice.title.length > 22){
//					var content='<a href="'+$("#basePath").val()+'/admin/notice/shopNoticeList.do?id='+notice.id+'">'
//					content=content+'<marquee direction="left" behavior="scroll" scrollamount="10" scrolldelay="200">';
//					content=content+notice.title;
//					content=content+'</marquee></a>';
//					$("#topNotice").append(content);
//				}else{
//					$("#topNotice").append('<a href="'+$("#basePath").val()+'/admin/notice/shopNoticeList.do">'+notice.title+'</a>');
//				}
//			}
//				
//		});
//	});

	var aboutWrap = $('#aboutWrap');
	if(aboutWrap.length){
		aboutWrap.on('hover', function(event) {

			aboutWrap.find('.about-info').toggleClass('actived');
			aboutWrap.find('.about-slide').toggleClass('d-n');

		});

		aboutWrap.find('.close').on('click', function(event) {
			$(this).parents('#aboutWrap').remove();
		});

	}


});




