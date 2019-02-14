var uUtils = {
  /**
   * [urlExist description]
   * @param  {[type]} url [description]
   * @return {[type]}     [description]
   */
  urlExist : function(url){
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
	//console.log("HTTP: ", http);
    return http.status!=404;
  },

  /**
   * [verifyExist description]
   * @param  {[type]}   url      [description]
   * @param  {Function} callback [description]
   * @param  {[type]}   timer    [description]
   * @param  {[type]}   loops    [description]
   * @param  {[type]}   maxTime  [description]
   * @return {[type]}            [description]
   */
  verifyExist : function(url, callback, timer, loops, maxTime){
    timer = ((1000) * (timer || 10)); // cada 10 segundos
    loops = loops || false;
    maxTime = maxTime || ((60000) * 10); // timeout de 10 minutos
    var loop = null;
    var iOut = null;
    var this_ = this;
    var finish = function(loop, iOut, cbk, rs){
      clearInterval(loop);
	    clearInterval(iOut);
      loop = null;
      iOut = null;
	     delete loop; delete iOut;
      cbk && cbk(rs);
      return null;
    };

    loop = window.setInterval(function(){
      var iExist = this_.urlExist(url);
      var iFinish = loops!==false ? (loops<=0 ? true : (loops--)) : false;
      (iFinish || iExist) && finish(loop, iOut, callback, iExist);
    }, timer);

    iOut = maxTime && window.setTimeout(function(){ finish(loop, iOut, callback, false); }, maxTime);
  },

  /**
   * [loaderBlock description]
   * @type {Object}
   */
  loaderBlock : {
    show : function(target){
      target = $(target);
      if (!$(target).hasClass('panel-loading')) {
        var lay = $('<div>', {
          css:{
            'position':'fixed',
            'background-color':'rgba(82, 82, 82, 0.45)',
            'width':'100%',
            'height':'100%',
            'display':'block',
            'top':'0px',
            'left':'0px',
            'z-index':'999',
            'cursor':'progress'
          },
          'class':'panel-loader'
        }).html('<span class="spinner-small"></span>');
        $(target).addClass('panel-loading').css('position','relative');
        $(target).prepend(lay);
      }
    },
    hide : function(target){
      $(target).removeClass('panel-loading').css('position','inherit');
      $(target).find('.panel-loader').remove();
    }
  },

  loader: {
    isDisabled: false,
    isAppend: false,
    layer: {
      bg: null,
      content: null,
      title: null,
      icon: null
    },
    createElements: function(addItem) {
      var hg = addItem || $(document);
      uUtils.loader.layer = {
        bg: $("<div>", {
          'class': "modal-backdrop fade in",
          'css': {
            height: $(hg).height() + 20,
            position: (addItem ? 'absolute' : 'fixed'),
            cursor:'progress'
          }
        }),
        loader: uUtils.loader.layer.loader || $("<div>", {
          'class': "modal-backdrop-content backdrop-loader"
        }),
        title: uUtils.loader.layer.title || $("<span>"),
      };
      uUtils.loader.layer.loader.css({
        'background-image': 'inherit',
        'position': 'fixed',
        'top': '42%',
        'width': '100%',
        'text-align': 'center',
        'font-size': '19px',
        'color': '#FFF',

      });
      return uUtils.loader.layer;
    },
    show: function(desc, classLoader, addItem, html_) {
      desc = desc || html_ || 'Cargando...';

      if (!uUtils.loader.isAppend && !uUtils.loader.isDisabled) {
        var lyr = uUtils.loader.createElements(addItem);
        addItem = addItem || $("body");
        (html_ ? (desc && lyr.title.append(desc)) : (desc && lyr.title.text(desc)));
        if (classLoader) {
          lyr.loader.removeClass('backdrop-loader');
          lyr.loader.addClass(classLoader);
        }
        lyr.loader.append(lyr.title);
        uUtils.loader.isAppend = true;
        lyr.bg.append(lyr.loader);
        addItem.append(lyr.bg);
      } else if (desc || html_) {
        this.setDesc(desc, html_);
      }
    },
    hide: function(callback) {
      if (!uUtils.loader.isDisabled && uUtils.loader.layer.bg) {
        uUtils.loader.layer.bg.fadeOut("fast", function() {

          uUtils.loader.isAppend = false;
          $(this).remove();
          callback && callback();
        });
        uUtils.loader.isAppend = false;
      } else
        callback && callback();
    },
    setDesc: function(desc, html_) {
      desc && this.layer.title && this.layer.title.text(desc);
      html_ && this.layer.title && this.layer.title.append(html_);
    }
  },

  /**
   * FALTA PROGRAMARLO
   * @type {Object}
   */
  expandBlock : function(){
    $(document).on('click', '[data-click=panel-expand]', function(e) {
       e.preventDefault();
       var target = $(this).closest('.panel');
       var targetBody = $(target).find('.panel-body');
       var targetTop = 40;
       if ($(targetBody).length !== 0) {
           var targetOffsetTop = $(target).offset().top;
           var targetBodyOffsetTop = $(targetBody).offset().top;
           targetTop = targetBodyOffsetTop - targetOffsetTop;
       }

       if ($('body').hasClass('panel-expand') && $(target).hasClass('panel-expand')) {
           $('body, .panel').removeClass('panel-expand');
           $('.panel').removeAttr('style');
           $(targetBody).removeAttr('style');
       } else {
           $('body').addClass('panel-expand');
           $(this).closest('.panel').addClass('panel-expand');

           if ($(targetBody).length !== 0 && targetTop != 40) {
               var finalHeight = 40;
               $(target).find(' > *').each(function() {
                   var targetClass = $(this).attr('class');

                   if (targetClass != 'panel-heading' && targetClass != 'panel-body') {
                       finalHeight += $(this).height() + 30;
                   }
               });
               if (finalHeight != 40) {
                   $(targetBody).css('top', finalHeight + 'px');
               }
           }
       }
       $(window).trigger('resize');
   });
  },

  /**
	 * [strReplace description]
	 * @param  {[type]} search  [description]
	 * @param  {[type]} replace [description]
	 * @param  {[type]} txt     [description]
	 * @param  {[type]} notRecursive  [description]
	 * @return {[type]}         [description]
	 */
	strReplace : function(search, replace, txt, notRecursive){
		if(search && txt){
			search = search.pop ? search : [search];
			replace = replace.pop ? replace : [replace];
			for(var x in search){
				var val = search[x];
				var rpl = (replace[x]!==undefined && replace[x]!==null && replace[x]!==false ? replace[x] : (replace[0] || ''));
				var iExpr = val.match(/^(\/(.*?)\/)$/gi);
				var expr = iExpr ? new RegExp(val.replace(/^(\/(.*?)\/)$/gi,"$2"), 'gi') : val.toString();
				//console.log("EXPR:", txt, expr);
				txt = txt ? (txt.toString()).replace(expr, rpl) : null;
				!notRecursive && (txt = (iExpr ? txt : (txt.indexOf(expr)>=0 ? uUtils.strReplace(search, replace, txt) : txt)));
			}
		}
		return txt;
	},
  /**
   * [search description]
   * @param  {[type]} arr [description]
   * @param  {[type]} src [description]
   * @return {[type]}     [description]
   */
  search : function(arr, src){
    var st = arr && arr.pop ? (arr.indexOf(src)) : null;
    if(st===null && typeof(arr)=='object'){
      for(var i in arr){
        var obj = arr[i];
        console.log("search: ", obj, src , (obj === src || obj == src));
        st = typeof(obj)=='object' || (obj.pop) ? uUtils.search(obj, src) : ((obj === src || obj == src) && i);
        if(st) break;
      }
    }
    return st;
  },
  /**
   * [count description]
   * @param  {[type]} obj [description]
   * @return {[type]}     [description]
   */
  count : function(obj, m){
    var total = (obj && obj.length) || 0;
    if(m && total)
      return true;
    else if(!total && obj)
      for(var i in obj) total++;
    return total;
  },

  /**
   * Randomize array element order in-place.
   * Using Durstenfeld shuffle algorithm.
   * @param  {[type]} array [description]
   * @return {[type]}       [description]
   */
  shuffle : function(array) {
    var i_ = uUtils.count(array) - 1;
    for (var i = i_; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      if(array[i]){
        var temp = array[i];
        if(array[j]){
          array[i] = array[j];
          array[j] = temp;
        }
      }
    }
    return array;
  },
  /**
   * [random description]
   * @param  {[type]} min [description]
   * @param  {[type]} max [description]
   * @return {[type]}     [description]
   */
  random :function (min, max) {
    min = Number(min) || 1;
    max = Number(max) || 99999;
    return Math.round(Math.random() * (max - min) + min);
  },
  /**
   * [description]
   * @param  {[type]} num [description]
   * @param  {[type]} dec [description]
   * @return {[type]}     [description]
   */
  round : function (num, dec){
    dec = Number(dec) || 0;
    var flot = parseFloat(num);
    var res  = Math.round(flot*Math.pow(10,dec))/Math.pow(10,dec);
    return res;
  },
  /**
   * [description]
   * @param  {[type]} num [description]
   * @param  {[type]} a   [description]
   * @param  {[type]} b   [description]
   * @param  {[type]} _eq [description]
   */
  between: function(num, a, b, _eq){
    num = Number(num) || 0;
    a = Number(a) || 0;
    b = Number(b) || 0;
    var min = Math.min.apply(Math, [a, b]);
    var max = Math.max.apply(Math, [a, b]);
    return _eq ? (num > min && num < max) : (num>= min && num <= max);
  },
  /**
   * [toByte description]
   * @param  {[type]} cnt [description]
   * @return {[type]}     [description]
   */
  toByte : function(cnt){
    var rt = 1;
    cnt = Number(cnt) || 1;
    while(cnt--) rt*=1024;
    return rt;
  },
  /**
   * [getTyByte description]
   * @param  {[type]} ty [description]
   * @return {[type]}    [description]
   */
  getTyByte : function(ty){
    var lst = {'Byte':0,'KB':1,'MB':2,'GB':3,'TB':4,'PB':5,'EB':6,'ZB':7};
    ty = ty.toUpperCase();
    return ty && lst[ty] ? this.toByte(lst[ty]) : 1;
  },
  /**
   * [formatMbytes description]
   * @param  {[type]} bytes [description]
   * @return {[type]}       [description]
   */
  formatBytes : function (bytes, fxd) {
    fxd = fxd || 1;
    if(bytes < this.getTyByte('KB')) return bytes + " Bytes";
    else if(bytes < this.getTyByte('MB')) return(bytes / this.getTyByte('KB')).toFixed(fxd) + " KB";
    else if(bytes < this.getTyByte('GB')) return(bytes / this.getTyByte('MB')).toFixed(fxd) + " MB";
    else if(bytes < this.getTyByte('TB')) return(bytes / this.getTyByte('GB')).toFixed(fxd) + " GB";
    else if(bytes < this.getTyByte('PB')) return(bytes / this.getTyByte('TB')).toFixed(fxd) + " TB";
    else if(bytes < this.getTyByte('EB')) return(bytes / this.getTyByte('PB')).toFixed(fxd) + " PB";
    else if(bytes < this.getTyByte('ZB')) return(bytes / this.getTyByte('EB')).toFixed(fxd) + " EB";
  },
  isset : function(itm, obj) {
    var _o = obj ? obj[itm] : window[itm];
    return (typeof(_o) !== "undefined");
  },

  /**
	 * Metodo para obtener el valor o texto de un input, select o textarea
	 */
	onGetValue : function(obj, iTxt, type){

	  if(typeof(obj)=='string'){
		return this.onGetValue($("#"+obj), iTxt);
	  }
	  var rtr = 0;
	  if(obj){
		type = type || ($(obj)[0] && $(obj)[0].tagName) || false;
		type = type ? type.toLowerCase() : '';
		if(type){
		  switch(type.toLowerCase()){
			case 'select':
			  var opts = $("option:selected", obj);
			  if(opts && opts.length && opts.length>1){
				  var vl = [];

				  for(var i in opts){
					  if(opts[i].tagName=='OPTION'){
						  //console.log("OPTION:SELECTED: ", opts[i].tagName, $(opts[i]));
						  vl.push((iTxt ? $(opts[i]).text() : $(opts[i]).val()));
					  }
				  }
				  rtr = "["+(vl.join(", "))+"]";
			  }else{
				  rtr =  iTxt ? opts.text() : obj.val();
			  }
			  break;
			case 'file':
				if($(obj)[0] && $(obj)[0].files){
					rtr = [];
					for(var j in $(obj)[0].files){
						var iFile = $(obj)[0].files[j];
						iFile && iFile.name && iFile.size && rtr.push(iFile);
					}
				}
				break;
			case 'input':
			case 'textarea':
			  if(obj.attr('type') == 'checkbox')
				  rtr = obj.is(':checked') ? obj.parents('label').text() || obj.val() : '';
        else if(obj.attr('type') == 'file')
          rtr = this.onGetValue(obj, iTxt, 'file');
			  else
				  rtr = obj.val() || obj.attr('data-value');
			  break;
		  }
		}
	  }
	  return rtr ? rtr : '';
	},

  responsiveTable: {
    elements: null,
    table_: null,
    ini: function(tbl, height) {
        //<th data-list="#selGrado" class="sorting_disabled" rowspan="1" colspan="1" style="width: 43px; padding-top: 0px; padding-bottom: 0px; border-top-width: 0px; border-bottom-width: 0px; height: 0px;"><div class="dataTables_sizing" style="height:0;overflow:hidden;">Grado</div></th>
        tbl = tbl || this.table_;
        var this_ = this;
        var iWidth = tbl.outerWidth();
        height = height || tbl.attr("table-height") || tbl.outerHeight();
        var elm = this.setStructure(tbl, height);
        this.table_ = tbl;
        this.elements = elm;
        $("thead th", tbl).each(function() {
            //elm.headScrollTable
            $(this).addClass("sorting_disabled").attr("rowspan", 1).attr("colspan", 1);
            var th_ = $(this).clone();

            th_.width($(this).width());
            //$(this).width($(this).width());
            if(true){
              $(this).css({
                  "width": $(this).width(),
                  "padding-top": "0px",
                  "padding-bottom": "0px",
                  "border-top-width": "0px",
                  "border-bottom-width": "0px",
                  //"height": "0px",
              });
              var html_ = $(this).html();
              $(this).html('<div class="dataTables_sizing" style="height:0;overflow:hidden;">' + html_ + '</div>');
            }
            elm.headScrollTable.find("thead tr").append(th_);
        });

        $("thead th", tbl).css('height', '0px');

        this.onAdjust();
        $(window).resize(function() {
            this_.onAdjust();
        });


    },
    onAdjust: function() {
        var this_ = this;
        this.elements.headScrollTable.html('<thead id="rr"><tr></tr></thead>');
        //return ;
        $("thead th", this.table_).each(function() {
            $(this).width($(this).width());
            var th_ = $(this).clone();
            th_.removeAttr("style");
            th_.width($(this).width());
            th_.html(($("div", th_).text()));
            this_.elements.headScrollTable.find("thead tr").append(th_);
        });
    },
    setStructure: function(tbl, height) {
        var iParent = tbl.parent();
        var elm = {
            wrapper: $("<div>", {
                'id': "data-table_wrapper",
                'class': "dataTables_wrapper no-footer"
            }),
            scroll: $("<div>", {
                'class': "table-scrollable"
            }),
            tableScroll: $("<div>", {
                'class': "dataTables_scroll"
            }),

            headScroll: $("<div>", {
                'class': "dataTables_scrollHead"
                //'class': "dataTables_scrollBody"

            }).css({
                "overflow": "hidden",
                "position": "relative",
                "border": "0px",
                "width": "100%",
            }),
            //  dataTables_scrollHeadInner
            headScrollInner: $("<div>", {
                'class': "dataTables_scrollHeadInner"
            }).css({
                "width": "99%",
                "min-width": tbl.outerWidth(),
                "box-sizing": "content-box",
                "padding-right": "17px",
            }),
            headScrollTable: $("<table>", {
                'role': "grid",
                'class': "table table-striped table-bordered table-hover dataTable no-footer responsive-scrollable"
            }).css({
                "width": "100%",
                "min-width": tbl.outerWidth(),
                "margin-left": "0px",
            }).html('<thead><tr role="row"></tr></thead>'),

            bodyScroll: $("<div>", {
                'class': "dataTables_scrollBody"
            }).css({
                "overflow": "auto",
                "height": height,
                "width": "100%",
            }),
        };

        tbl.attr("role", "grid");
        tbl.attr("aria-describedby", "data-table_info");
        tbl.css({
            'width': '100%'
        });

        elm.headScrollInner.append(elm.headScrollTable);
        elm.headScroll.append(elm.headScrollInner);
        elm.tableScroll.append(elm.headScroll);

        elm.bodyScroll.append(tbl);
        elm.tableScroll.append(elm.bodyScroll);

        elm.scroll.append(elm.tableScroll);
        elm.wrapper.append(elm.scroll);

        iParent.html(elm.wrapper);

        //elm.headScroll.scroll();
        $(".dataTables_scrollBody").scroll(function(a, b) {
            $(".dataTables_scrollHead").scrollLeft($(this).scrollLeft());
        });


        return elm;
    },
    onSearch : function(){
      $(".table-scrollables").prepend('<input placeholder="Buscar..." id="busc" type="text" style="width:200px; padding:5px;">');
      window.setTimeout(function(){
      	var table = $("#data-table").DataTable({ "searching": true, paging:false});
      	$("#data-table_filter").hide();
      	$('#busc').on( 'keyup', function () {
      	    table.search( this.value ).draw(); uUtils.responsiveTable.onAdjust();
      	} );
      }, 1);
    }
  },

  /**
   * [validExtFile description]
   * @param  {[type]} file   [description]
   * @param  {[type]} tyFile [description]
   * @return {[type]}        [description]
   */
  validExtFile : function(file, tyFile){
    var fileName = (typeof(file) == 'string' ? file : (typeof(file) == 'object' && file.name) || '' );
    var ext = fileName.replace(/((.*\.)(.*))/, "$3");
    if(ext){
      tyFile = tyFile && tyFile.pop ? tyFile : ['image','docs','audio','video','application'];
      var typeSupported = {
        'image' : ["gif","jpe?g","png","bmp","ico","svg"],
        'docs'  : ["txt","doc","odt","ott","dot","ppt","pps","xls","xlt","csv","pdf","xml","bz"],
        'audio' : ["mp3","wav","ogg","m3u","m2a","aif","mpga","midi"],
        'video' : ["wmv","mp4","mov","mpeg","mpg","avi","dl","dv","movie","asx"],
        'application' : ["zip","gzip","bz","swf"],
      };
      var regExpr = [];
      for(var i in tyFile){
        var idx = tyFile[i];
        var iList = typeSupported[idx];
        if( iList && ext.match( (new RegExp((iList.join("|")), "gi")) ) )
          return true;
      }
    }
    return false;
  },

  sendPostSites:function(url, dataForm, cbk){
    dataForm = typeof(dataForm) == 'object' ? dataForm : $(dataForm).serialize();
    if(dataForm && this.count(dataForm)){
      $.ajax({
        url: url,
        data : dataForm,
        method:'POST',
        dataType :'JSON',
        success : function(res){
          cbk && cbk(true, res);
        },
        error : function(){
          cbk && cbk(false);
        }
      });
    }
  },
};
