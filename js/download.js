define(function (require, exports, module) {
   var $ = require('jquery');
   function is_weixin() { 


    var ua = window.navigator.userAgent.toLowerCase(); 
    if (ua.match(/MicroMessenger/i) == 'micromessenger') { 
        $(".shadow2").show();  
           
    } else if (ua.match(/WeiBo/i) == "weibo") {

               $(".shadow2").show();  

       }else if (ua.match(/QQ/i) == "qq") {

                $(".shadow2").show(); 

       } else { 
         $(".receive-btn").click(function(){
           window.location.href="https://www.baidu.com/";     
          }); 
       
    } 

   
   }  
    is_weixin();

    });