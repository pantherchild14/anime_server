// Swticher Cookie Base
/**
 * Styleswitch stylesheet switcher built on jQuery
 * Under an Attribution, Share Alike License
 * By Kelvin Luck ( http://www.kelvinluck.com/ )
 * Thanks for permission! 
 **/

// DEMO Swticher Base
jQuery('.switcher-icon').click(function(){
	if(jQuery('.demo_changer').hasClass("active")){
		jQuery('.demo_changer').animate({"inset-inline-end":"-270px"},function(){
			jQuery('.demo_changer').removeClass("active");
		});
	}else{
		jQuery('.demo_changer').animate({"inset-inline-end":"0px"},function(){
			jQuery('.demo_changer').addClass("active");
		});
	} 
});

//p-scroll bar
const ps5 = new PerfectScrollbar('.sidebar-right1', {
	useBothWheelAxes:true,
	suppressScrollX:true,
  });
  
jQuery('.page').click(function(){
	if(jQuery('.demo_changer').hasClass("active")){
		jQuery('.demo_changer').animate({"inset-inline-end":"-270px"},function(){
			jQuery('.demo_changer').removeClass("active");
		});
	}
	
});