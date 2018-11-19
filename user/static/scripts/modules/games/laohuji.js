/**
 * Created by yx on 16-10-13.
 */
var laohuji = function(){
    var domCache = {isLaohujiBegin: false};
    var default_ = {
        template: null, //模板html 字符串數組
        prizes: [],//奖品图片id，及地址
        topMessage: '',//顶部消息
        errorprizes:{
            id:0,
            name:'额外奖品',
            img:'/styles/images/topic/xtyyh/pc/prizes/wenhao.png'
        },
        hasSound: false,//是否开启声音
        soundPlayer: null,//声音播放器
        url: '', //获取結果的url
        urlData: null, //請求数据
        successCallback: null,//获取数据成功回调
        errorCallback: null,//获取数据失敗回调
        resultReset:null,
        beforePlay: function(){return true;}//抽奖前回调
    }

    /**
     * 返回老虎机状态
     * @returns {boolean}true: 正在玩，false:空闲
     */
    function isPlaying(){
        return domCache.isLaohujiBegin;
    }
    function toggleSound(flag){
        default_.hasSound = flag;
        if(!window.isIELower){
            if(flag){
                domCache.isLaohujiBegin && default_.soundPlayer && default_.soundPlayer.play();
            }else{
                domCache.isLaohujiBegin && default_.soundPlayer && default_.soundPlayer.pause();
            }
        }
    }
    function setSoundPlayer(player){
        default_.soundPlayer = player;
    }
    function clone(obj) {  
        var o;  
        if (typeof obj == "object") {  
            if (obj === null) {  
                o = null;  
            } else {  
                if (obj instanceof Array) {  
                    o = [];  
                    for (var i = 0, len = obj.length; i < len; i++) {  
                        o.push(clone(obj[i]));  
                    }  
                } else {  
                    o = {};  
                    for (var j in obj) {  
                        o[j] = clone(obj[j]);  
                    }  
                }  
            }  
        } else {  
            o = obj;  
        }  
        return o;  
    }  
    /**
     * 游戏初始化
     * @param $gameContainer 模板容器
     * @param option 选项{
     *  template: [], 模板html 字符串數組
     *  topMessage: '',
     *  url: 'http://', //获取結果的url
     *  urlData: null, //请求数据
     *  successCallback: null,//获取数据成功回调
     *  errorCallback: null,//获取数据失敗回调
     *  beforePlay: null,//抽奖前回调 f
     * }
     */
    function init($gameContainer, option){
        var isIE = !!window.ActiveXObject;
        var isIE6 = isIE && !window.XMLHttpRequest;
        var isIE8 = isIE && !!document.documentMode;
        var isIE7 = isIE && !isIE6 && !isIE8;
        window.isIELower = isIE6 || isIE7 || isIE8;
        if(window.isIELower){
            if (!Function.prototype.bind) {
                Function.prototype.bind = function (oThis) {
                    if (typeof this !== "function") {
                        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
                    }
                    var aArgs = Array.prototype.slice.call(arguments, 1),
                        fToBind = this,
                        fNOP = function () {},
                        fBound = function () {
                            return fToBind.apply(this instanceof fNOP && oThis
                                    ? this
                                    : oThis,
                                aArgs.concat(Array.prototype.slice.call(arguments)));
                        };
                    fNOP.prototype = this.prototype;
                    fBound.prototype = new fNOP();
                    return fBound;
                };
            }
        }
        default_ = $.extend(default_, option);

        //问号
        default_.prizes.unshift(default_.errorprizes);

        var template = null;
        
        var prizesTpl = '',
            len = default_.prizes.length;

        if(default_.template){
            prizesTpl = default_.template;
        }else{
            for(var i=0;i<len;i++){
                var prize = default_.prizes[i];
                prizesTpl += '<div class="g_prize prize1" prize_num="'+prize.id+'" prize_name="'+prize.name+'"><div class="p_subwrap"><img class="prizeImg" src="'+prize.img+'"/></div></div>';
            }
        }
        template = [];
        template.push('<div id="gameItems" class="gameItems">');
        template.push(  '<div class="btn go_back" id="go_back"></div>');
        template.push(  '<div class="btn offmusic" id="musicbtn"></div>');
        template.push(  '<a href="//licai.p2peye.com/topic/xtyyh/gonglue" target="_blank" class="ui-game-gonglue ui-gameother-gonglue"></a>');
        template.push(  '<img id="game_bg" class="bg" src="/styles/images/topic/xtyyh/pc/laohuji_bg.jpg">');
        template.push(  '<div class="subwrap">');
        template.push(      '<div id="laohuji" class="gameItem laohuji">');
        template.push(          '<div class="g_machine" id="g_machine">');
        template.push(              '<div class="message_t">' + default_.topMessage + '</div>');
        template.push(              '<div class="btn lucky_draw"></div>');
        template.push(              '<a href="javascript:;" class="btn get_changes"></a>');
        template.push(              '<div class="btn g_currency"></div>');
        template.push(              '<a href="//licai.p2peye.com/loans/" target="_blank" class="btn show_more_item"></a>');
        template.push(              '<div class="message_b">中奖说明：摇中三张相同图片，即获得奖品。活动规则由网贷天眼在法律允许范围内依法解释。</div>');
        template.push(          '</div>');
        template.push(          '<div class="g_prize_container">');
        template.push(              '<div class="g_prize_container1">');
        template.push(                  '<div class="g_prizes">');
        template.push(                      prizesTpl);
        template.push(                  '</div>');
        template.push(              '</div>');
        template.push(              '<div class="g_prize_container2">');
        template.push(                  '<div class="g_prizes">');
        template.push(                      prizesTpl);
        template.push(                  '</div>');
        template.push(              '</div>');
        template.push(              '<div class="g_prize_container3">');
        template.push(                  '<div class="g_prizes">');
        template.push(                      prizesTpl);
        template.push(                  '</div>');
        template.push(              '</div>');
        template.push(          '</div>');
        template.push(      '</div>');
        template.push(  '</div>');
        template.push('</div>');
        $gameContainer.html(template.join(''));


        domCache = {
            isLaohujiBegin: false,
            laohuji_results: {code:0}
        };
        domCache.$gameItems = $('#gameItems');
        domCache.$gameItemss = domCache.$gameItems.find('div.gameItem');
        domCache.$game_bg = $('#game_bg');
        domCache.$laohuji = $('#laohuji');
        domCache.$g_prizes = $(".g_prizes");
        domCache.$lucky_draw = $(".lucky_draw");
        domCache.$go_back = $("#go_back");
        domCache.$musicbtn = $("#musicbtn");
        domCache.$game_bg.show().css('left', (domCache.$gameItems.width() - 1920) / 2 + 'px');
        domCache.laohuji_results_server = null;
        $(window).unbind("resize.game_bg").bind("resize.game_bg", function(){
            domCache.$game_bg.css('left', (domCache.$gameItems.width() - 1920) / 2 + 'px');
        })

        //音乐按钮事件注册
        domCache.$musicbtn.click(function(e){
            if(domCache.$musicbtn.hasClass('offmusic')) {
                if(!window.Audio){
                    _Fn.alert('当前浏览器版本不支持音效');
                    return;
                };
                toggleSound(false);
                domCache.$musicbtn.removeClass('offmusic').addClass('onmusic');
            }else{
                toggleSound(true);
                domCache.$musicbtn.removeClass('onmusic').addClass('offmusic');
            }
        });

        $('#g_machine').click(function (e) {
            var t = e.target || e.srcELement,
                $t = $(t);
            if ($t.hasClass('lucky_draw')) {//老虎机抽奖
                if(!default_.beforePlay())
                    return false;
                if(domCache.isLaohujiBegin) return false;


                $t.addClass('lucky_draw_playing');
                var prizeH = 138;
                var prizesH = domCache.$g_prizes.eq(0).height() - prizeH + 8;
                jQuery.Tween.prototype.run = function(e) {
                    var t, n = jQuery.Tween.propHooks[this.prop];
                    if(-this.now >= prizesH ){
                        this._loopCount = this._loopCount ? ++this._loopCount : 1;
                    }
                    if(this.options.duration){
                        this.pos = t = $.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration)
                    }else
                        this.pos = t = e
                    this.now = (this.end - this.start) * t + this.start + (this._loopCount? this._loopCount*prizesH : 0)
                    this.options.step && this.options.step.call(this.elem, this.now, this)
                    n && n.set ? n.set(this) : jQuery.Tween.propHooks._default.set(this)
                    return this;
                };
                domCache.isLaohujiBegin = true;
                domCache.laohujiEndPresetState = [false, false, false];
                !window.isIELower && default_.hasSound && default_.soundPlayer && (default_.soundPlayer.stop(), default_.soundPlayer.play());
                domCache.laohuji_results = {code:0};
                domCache.$g_prizes.css('bottom',0);
                var result = numRand();
                //$('#res').text('result = '+result);
                var num_arr = (result+'').split('');
                domCache.$g_prizes.each(function(index){
                    var _num = $(this);
                    setTimeout(function(){
                        _num.animate({
                            bottom: -(prizeH*30)
                        },{
                            duration: 4000,
                            easing: "easeInCirc",
                            complete: function(){
                                laohujiAnimate(_num, prizeH, index);

                            }
                        });
                    }, index * 500);
                });
                $.ajax({
                    type: "post",
                    url: _Fn.mockServer + default_.url,
                    data: default_.urlData || {},
                    dataType: "json",
                    success: function(data){
                        domCache.laohuji_results_server = data;
                        domCache.laohuji_results = default_.resultReset ? default_.resultReset(clone(data)) : data;
                    },
                    error: function(){
                        var data = {code:500,message:'请检查网络，大奖离你不远啦！'};
                        domCache.laohuji_results_server = data;
                        domCache.laohuji_results = default_.resultReset ? default_.resultReset(clone(data)) : data;
                    }
                });
            } else{


            }
        }.bind(this));
    }
    function numRand() {
        var x = 99999; //上限
        var y = 11111; //下限
        var rand = parseInt(Math.random() * (x - y + 1) + y);
        return rand;
    }
    function laohujiAnimate(_num, prizeH, index){

        _num.animate({
            bottom: -(prizeH*80)
        },{
            duration: 5000,
            easing: "linear",
            complete: function(_num, _i){
                var results = domCache.laohuji_results.data;
                if(results){
                    if(_i == 0){
                        domCache.laohujiEndPresetState[0] = true;
                    }else if(_i == 1 || _i == 2){
                        if(domCache.laohujiEndPresetState[0]){
                            domCache.laohujiEndPresetState[_i] = true;
                        }else{
                            return laohujiAnimate(_num, prizeH, _i);
                        }
                    }

                    if(results[0] == results[1] && results[1] == results[2]){

                        var prizeId = 0, lhj_ps= default_.prizes, i= 0,len=lhj_ps.length;
                        for(;i<len;i++){
                            if(lhj_ps[i].id == results[_i]){
                                prizeId = results[_i];
                                break;
                            }
                        }
                    }else{
                        var prizeId = results[_i];
                    }

                    var container = domCache.$g_prizes.eq(_i);
                    var prizeIndex = container.find('div[prize_num="'+prizeId+'"]').index();

                    _num.animate({
                        bottom: -(prizeH*((container.children().length-1)*4 - prizeIndex))
                    },{
                        duration: 3000,
                        easing: "easeOutCirc",
                        complete: function(_i){
                            if(_i==2){
                                domCache.isLaohujiBegin = false;
                                domCache.$lucky_draw.removeClass('lucky_draw_playing');

                                jQuery.Tween.prototype.run = function( percent ) {
                                    var eased,
                                        hooks = jQuery.Tween.propHooks[ this.prop ];

                                    if ( this.options.duration ) {
                                        this.pos = eased = jQuery.easing[ this.easing ](
                                            percent, this.options.duration * percent, 0, 1, this.options.duration
                                        );
                                    } else {
                                        this.pos = eased = percent;
                                    }
                                    this.now = ( this.end - this.start ) * eased + this.start;

                                    if ( this.options.step ) {
                                        this.options.step.call( this.elem, this.now, this );
                                    }

                                    if ( hooks && hooks.set ) {
                                        hooks.set( this );
                                    } else {
                                        jQuery.Tween.propHooks._default.set( this );
                                    }
                                    return this;
                                };

                                !window.isIELower && default_.hasSound && default_.soundPlayer && default_.soundPlayer.stop();
                                if(domCache.laohuji_results.code != 200){
                                    default_.errorCallback && default_.errorCallback(domCache.laohuji_results_server);
                                }else{
                                    default_.successCallback && default_.successCallback(domCache.laohuji_results_server);
                                }
                            }
                        }.bind(null, _i)
                    });
                }else{
                    laohujiAnimate(_num, prizeH, _i);
                }
            }.bind(null, _num, index)
        });
    }



    
    return {
        init: init,
        result: domCache.laohuji_results,
        toggleSound: toggleSound,
        setSoundPlayer: setSoundPlayer,
        isPlaying: isPlaying
    }
}();


exports.init = laohuji.init;
exports.result = laohuji.result;
exports.toggleSound = laohuji.toggleSound;
exports.setSoundPlayer = laohuji.setSoundPlayer;
exports.isPlaying = laohuji.isPlaying;