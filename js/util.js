/**
 *
 * @authors rnn
 * @date    2017-01-22 14:17:06
 * @version 1.0
 * @description util.js
 */
//封装常用方法，以便调用
define(function (require, exports, module) {
    var $ = require('jquery');
     var template = require('template');
    // ajax请求
    exports.AJAX = function (url, type, data, sucFuc) {
        AJAX(url, type, data, sucFuc);
    }; 
    function AJAX(url, type, data, sucFuc) {
        var host = "http://172.31.2.218:8086/"; //dev
        // var host = "http://172.31.88.118:8086/"; //QA
          var d = JSON.stringify(data);
        $.ajax({
            url: host + url,
            type: type,
            dataType: 'json',
            contentType:"application/json",
            data:d,
            success: function (data) {
                if(data.code == 200){
                    if(data.success == false){
                        layer('数据缺失!');
                    }else{
                        if(data != null){
                            sucFuc(data);
                        }else{
                            layer('当前没有数据!'); 
                        }
                        
                    }
                }else{
                    layer('您当前没有连网，请检查网络设置。');  
                }
               
                
            },
            error: function (e) {
                console.log(e)
               layer('请求错误!')
            }

        });
    };
// 信息提示层
    exports.layer = function (msg, fun) {
        layer(msg, fun);
    }
    function layer(msg, fun) {
        var str = $('<div id="layer"><div class="layer-bg" style="position: fixed;top: 0;left: 0;width: 100%;height: 100%;z-index: 9999;background-color:transparent;"></div><div class="my_layer" style="position:fixed;bottom:60px;left: 50%;z-index:10000;width:80%;margin-left:-40%;opacity:0.8;background:#222222;border-radius:100px;"><div style="color:#ffffff!important;height:50px;line-height:50px; text-align:center;">' + msg + '</div></div></div>');
        $('body').append(str);
        setTimeout(function () {
            $('#layer').remove();
            fun && fun();
        }, 2000);
    }
    function ifLoged(){
        if(localStorage.getItem("tokenId")){
            $(".shadow,.loginbg").hide();
            $(".login").hide();
            $(".per").show();
            $(".nav-right ").css("right","20px");
            $(".head-bg").show();
            $(".m-loginbg").hide();
            $(".order").show();
        }
    }

    /**
     * 限制字数
     * @param   titleClass   标题类名
     * @param   num          限制字数
     *
     * @author by rnn
     */
    exports.titleClass = function(titleClass, num) {
        var numTitleArr = $(titleClass);
        if (numTitleArr && numTitleArr.length >= 1) {
            $.each(numTitleArr, function(index, ele) {
                var txt = $(ele).html().trim(),
                    len = txt.length;
                if (len > num) {
                    $(ele).html(txt.substr(0, num) + '...');
                }
            });
        }
    }
 // 获取地址栏参数
 exports.getQuery = function(i) {
     var j = location.search.match(new RegExp("[?&]" + i + "=([^&]*)(&?)", "i"));
     return j ? j[1] : j
 };
   exports.showLoading = function (ele, type) {
        var loading = '<div id="loading" style="padding: 20px;text-align: center;"><img src="/images/loading.gif" alt="loading图"></div>';

        if (type) {
            ele.html(loading);
        } else {
            ele.append(loading);
        }
    }

  /****************************** 添加公共的辅助方法*****************************/

    /**
     * 对日期进行格式化，
     * @param date 要格式化的日期
     * @param format 进行格式化的模式字符串
     *     支持的模式字母有：
     *     y:年,
     *     M:年中的月份(1-12),
     *     d:月份中的天(1-31),
     *     h:小时(0-23),
     *     m:分(0-59),
     *     s:秒(0-59),
     *     S:毫秒(0-999),
     *     q:季度(1-4)
     * @return String
     */
    template.helper('dateFormat', function(date, format) {

        if (typeof date === "string") {
            var mts = date.match(/(\/Date\((\d+)\)\/)/);
            if (mts && mts.length >= 3) {
                date = parseInt(mts[2]);
            }
        }
        date = new Date(date);
        if (!date || date.toUTCString() == "Invalid Date") {
            return "";
        }

        var map = {
            "M": date.getMonth() + 1, //月份
            "d": date.getDate(), //日
            "h": date.getHours(), //小时
            "m": date.getMinutes(), //分
            "s": date.getSeconds(), //秒
            "q": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };


        format = format.replace(/([yMdhmsqS])+/g, function(all, t) {
            var v = map[t];
            if (v !== undefined) {
                if (all.length > 1) {
                    v = '0' + v;
                    v = v.substr(v.length - 2);
                }
                return v;
            } else if (t === 'y') {
                return (date.getFullYear() + '').substr(4 - all.length);
            }
            return all;
        });
        return format;
    });

template.helper('date', function () {
                        var d = new Date();
                        var str = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
                       return str;
                       
});    
});
