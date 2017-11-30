define(function (require, exports, module) {
   var $ = require('jquery');
   var util = require('util');
   var template = require("template");
  var globalParam = {};
  var globalShareSuccessPromationInfo = {};
     util.showLoading($('.state-bg2')); //load  
// 领取
window.document.addEventListener('message', function (e) {
    const message = e.data;
    var json = $.parseJSON(message);
    if(json.command == 'PARAMS'){
        var param = json.payload.property;

        receive(param);
        loadPage(param);
        globalParam = param;
    }else if(json.command == 'SHARESUCCESS'){
       // alert(json.command);
       //处理弹框
       // window.postMessage(message)
       getShareSuccessPromotion({
          "agentId": globalParam.agentId,
          "deviceId": globalParam.deviceId,
          "promotionType": "SHARE_SUCCESS_PROMOTION",
          "token": globalParam.token,
          "uid": globalParam.uid
       });
     
      $(".shadow,.popup-bg,.propbgg").show();
      $(".shadow,.propbg2,.propbgg").hide();

    }else if(json.command == 'SHAREFAILD'){
         $(".shadow,.propbg2,.propbgg").hide();

    }

})

// globalParam={
//       "agentId": 3000,
//       "promotionId":1,
//       "deviceId": "GJHB000001",
//       "promotionType": "SHARE_SUCCESS_PROMOTION",
//       "token": "IDAHIHKLHKIBKOOKKBMLDOLNOBLPOHKK",
//       "uid": "4ba65f3e-966c-4f58-a57d-b244abf56a62"
// }


// 本地网络测试用
// getShareSuccessPromotion({
//           "agentId": 3000,
//           "deviceId": "GJHB000001",
//           "promotionType": "SHARE_SUCCESS_PROMOTION",
//           "token": "IDAHIHKLHKIBKOOKKBMLDOLNOBLPOHKK",
//           "uid": "4ba65f3e-966c-4f58-a57d-b244abf56a62",
//           "dataplanId":''
//        });

// receive({
//           "agentId": 3000,
//           "deviceId": "GJHB000001",
//           "promotionId": 1,
//           "promotionType": "MULTIPLE_TYPE_NEW_USER_PROMOTION",
//           "token": "IDAHIHKLHKIBKOOKKBMLDOLNOBLPOHKK",
//           "uid": "4ba65f3e-966c-4f58-a57d-b244abf56a62"
//        });

// loadPage({
//           "agentId": 3000,
//           "deviceId": "GJHB000001",
//           "promotionId": 1,
//           "promotionType": "MULTIPLE_TYPE_NEW_USER_PROMOTION",
//           "token": "IDAHIHKLHKIBKOOKKBMLDOLNOBLPOHKK",
//           "uid": "4ba65f3e-966c-4f58-a57d-b244abf56a62"
//        });
//领取活动
function receive(param){            
          util.showLoading($('.state-bg2')); //load
        util.AJAX("v2/device/promotions/getPromotionInfo", "post", param, function(data) {
               if (data) {
                   var str = '';
                   globalPromationInfo = data.devicePromotion;
                   var dataitem = data.devicePromotion.receiveInfos;
                   var time = new Date().getTime();
                   var AvailableTime=data.devicePromotion.nextAvailableTime;
                   var nowReceive =data.devicePromotion.nowReceive;
                   console.log(time);
                   
                   $.each(dataitem, function(i, dataitem) {
                       var index = i + 1;
                       if (i % 4 == 3) {
                           str += '<li class="margin-right0">';
                       } else {
                           str += '<li>';
                       };
                       if (time > dataitem.startTime && time < dataitem.endTime) {
         str +='<div class="state-img2"><img src="/images/c-right.png" class="state-img3" id="ok"></div>';
                           str += '<div class="number">' + index + '</div></li>';
           
                       } else if (dataitem.startTime>time) {
                           str += '<img src="/images/state4.png" class="state-img">';
                           str += '<div class="number">' + index + '</div></li>';
                       } else if (dataitem.endTime<time && dataitem.received==true)  {
                               str += '<img src="/images/state1.png" class="state-img">';
                               str += '<div class="number">' + index + '</div></li>';   
                       }else if (dataitem.endTime<time && dataitem.received==false)  {
                               str += '<img src="/images/state2.png" class="state-img">';
                               str += '<div class="number">' + index + '</div></li>';   
                       }
                   });
              $('.state-bg2').html(str);
             if (nowReceive == false) {
                 $(".receive-btn").hide(); 
                 $(".receive-btn2").show();
                  $(".state-img3").show();
             } else {

                 $(".receive-btn").show();
                 $(".receive-btn2").hide();

             }
                 } else {
                     util.layer('暂无数据!');
                 }
         });
}
             //活动说明
     function loadPage(param) {      
        util.AJAX("v2/promotion/promotions/promotionInfo", "post", param, function(data) {
                 var tmpHtml = '';
                 if(data.promotionInfo) {
                     tmpHtml = template('introduce', data);
                     $('.introducebg').html(tmpHtml);
                 } else {
                     util.layer('暂无数据!');
                 }
         });
         }

//获取流量
// 恭喜领取
$(".receive-btn").click(function() {
    $(".shadow,.propbg2,.propbgg").show();
    requireFlow(globalParam); 
});
$("#delete2").click(function() {
    $(".shadow,.propbg2,.propbgg,.receive-btn").hide();
    $(".state-img3").show();
    $(".receive-btn2").show();
});
//成功获取
    function requireFlow(globalParam) {
        var param = {
                "agentId": globalParam.agentId,
                "deviceId": globalParam.deviceId,
                "promotionId":globalParam.promotionId,
                "token": globalParam.token,
                "uid": globalParam.uid,
                "dataplanId":''
                      }
        util.AJAX("v2/promotion/promotions/receive", "post", param, function(data) {
                 var tmpHtml = '';
                 if(data) {
                     tmpHtml = template('flow', data);
                     $('.prop2-tip2').html(tmpHtml);
                       const pramsData = {
                                              command: 'GETSUCCESS', // 表明意图
                                              payload: { // 表明内容
                   
                                              }
                                          }
                        window.postMessage(JSON.stringify(pramsData));
                 } else {
                     util.layer('暂无数据!');
                 }
         });

    }
// requireFlow end
//分享
$("#wx").click(function(){
      const pramsData = {
                command: 'WECHATSHARE', // 表明意图
                payload: { // 表明内容
                   
                }
            }
      window.postMessage(JSON.stringify(pramsData));
  });
$("#qq").click(function(){
      const pramsData = {
                command: 'QQ', // 表明意图
                payload: { // 表明内容
                   
                }
            }
      window.postMessage(JSON.stringify(pramsData));
  });
$("#fd").click(function(){
      const pramsData = {
                command: 'TIMELINESHARE', // 表明意图
                payload: { // 表明内容
                   
                }
            }
      window.postMessage(JSON.stringify(pramsData));
  });
$("#qz").click(function(){
      const pramsData = {
                command: 'QQZONE', // 表明意图
                payload: { // 表明内容
                   
                }
            }
      window.postMessage(JSON.stringify(pramsData));
  });
$("#wb").click(function(){
      const pramsData = {
                command: 'WEIBO', // 表明意图
                payload: { // 表明内容
                   
                }
            }
      window.postMessage(JSON.stringify(pramsData));

  });
// 二次成功获取 
function getShareSuccessPromotion(globalParam) {
             
        util.AJAX("v2/promotion/promotions/promotionInfo", "post", globalParam, function(data) {
                 
                 console.log(data);
                 if(data && data.success){
                   if(data.promotionInfo != null){
                       promationId = data.promotionInfo.promotionId;
                       shareSuccess(promationId);    
                    }else{
                        util.layer('服务器错误');
                    };
                  }           
        })
    }
    // function getShareInfo(promationId){
    //   param = {
    //       "agentId": 3000,
    //       "deviceId": "GJHB000001",
    //       "promotionId": promationId,
    //       "promotionType": "MULTIPLE_TYPE_NEW_USER_PROMOTION",
    //       "token": "IDAHIHKLHKIBKOOKKBMLDOLNOBLPOHKK",
    //       "uid": "4ba65f3e-966c-4f58-a57d-b244abf56a62"
    //    }

    //   shareSuccess(param);
    // }
  function shareSuccess(promationId) {
                var param = {
                        "agentId": globalParam.agentId,
                        "deviceId": globalParam.deviceId,
                        "promotionId":promationId,
                        "token": globalParam.token,
                        "uid": globalParam.uid,
                        "dataplanId":''
                              }
                   console.log(promationId);
         util.AJAX("v2/promotion/promotions/receive", "post", param, function(data) {
              console.log(data);
                 var tmpHtml = '';
                 if(data) {
                     tmpHtml = template('success', data);
                     $('.popup-tip').html(tmpHtml);
                      tmpHtml = template('success2', data);
                     $('.p-explain').html(tmpHtml);
                      $(".shadow,.popup-bg,.propbgg").show();
                       const pramsData = {
                                              command: 'GETSUCCESS', // 表明意图
                                              payload: { // 表明内容
                   
                                              }
                                          }
                        window.postMessage(JSON.stringify(pramsData));
                 } else {
                     util.layer('暂无数据!');
                 }
         });

    }
// 关闭成功分享的二次弹窗
$(".know,#dlelete1").click(function() {
 $(".shadow,.popup-bg,.propbgg,.receive-btn").hide();
 $(".state-img3").show();
 $(".receive-btn2").show();
});


    });