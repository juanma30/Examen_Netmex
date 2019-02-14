var uHtml = {
  /**
   * //http://bootsnipp.com/tags
  * Drag para elementos HTML con jquery
  *
  * @param item
  * @param callback
  */
  drag: function(item, callback) {
    $(item).mousedown(function(e) {
      this._iDrag = true;
      callback && callback('start', e.pageX, e.pageY);
    });
    $(item).mouseout(function(e) {
      this._iDrag = false;
      callback && callback('stop', e.pageX, e.pageY);
    });
    $(item).mouseup(function(e) {
      this._iDrag = false;
      callback && callback('stop', e.pageX, e.pageY);
    });
    $(item).mousemove(function(e) {
      if (this._iDrag) {
        callback && callback('drag', e.pageX, e.pageY);
      }
    });
  },
  previewComponent: function(type_, file_, title_, version_) {
    var pathTmp_ = toth.path;
    pathTmp_ = pathTmp_.replace(/src/, '');
    pathTmp_ = pathTmp_.replace(/\//, '');
    pathTmp_ += '?build=Animation&preview=true&type=' + type_ + '&item=' + file_ + '&version='
      + version_ + (title_ ? '&title=' + title_ : '');
    var posX = (screen.width / 2) - ((screen.width - 250) / 2);
    var posY = (screen.height / 2) - ((screen.height - 200) / 2);
    window.open(pathTmp_, "Preview Alebrigma [" + file_ + "]", "width="
      + (screen.width - 250) + "," + "height=" + (screen.height - 250) + ","
      + "menubar=0," + "toolbar=0," + "directories=0," + "location=0,"
      + "scrollbars=no," + "resizable=no," + "left=" + posX + "," + "top="
      + posY);
    return true;
  },

  /**
   * Agrega un elemento html
   * addHtml('div','id:idDiv|class:demo-container','Texto del div');
   */
  addHtml: function(type, pp, value) {
    var st = '', r;
    if (pp) {
      var rr = pp.split('|');
      for (var x = 0; x < rr.length; x++) {
        r = rr[x].split(':');
        r[1] != 'undefined' && (st += ' ' + (r[0] == '!' ? r[1] : (r[0] + '="' + r[1] + '"')));
      }
    }
    return '<' + type + st + '>' + (value || '') + '</' + type + '>';
  },
  /**
   * Agrega un elemento Html
   * addElement('input',['id','name','value'],'id|name|value');
   */
  addElement: function(type, dt, vt, data) {
    var rr = vt.split('|');
    var st = '', rr;
    if (dt) {
      for (var x = 0; x < dt.length; x++)
        dt[x] != undefined && (st += ' ' + (rr[x] == '!' ? dt[x] : (rr[x] + '="' + dt[x] + '"')));
    }
    return '<' + type + ' ' + st + (data ? '>' + data + '</' + type + '>' : '/>');
  },
  /**
   * Convierte un array a un HTML
   */
  createHtml: function(data, bb) {
    var ht = '',
      ot = '', d, r, rr, ty, cls, lt, rq;
    //console.log(data);
    for (var idx = 0; idx < data.length; idx++) {
      d = data[idx];
      ty = 0;
      rq = undefined;
      ot = '';
      cls = 'form-group';
      //console.log(d[0]);
      if (typeof d == 'string') {
        if (d == '-')
          ht += '<hr/>';
        else
          ht += d;
      } else {
        /\+$/.test(d[0]) && (ty = 1, d[0] = d[0].replace('+', '')); //clase bloque
        /\-$/.test(d[0]) && (ty = 2, d[0] = d[0].replace('-', '')); //clase inline
        /^\!/.test(d[1]) && (rq = 'required="required"', d[1] = d[1].replace('!', '')); //requiere
        switch (d[0]) {
          case 'hidden':
            d[3] = d[2] + '';d[2] = null;
          case 'file':
          case 'password':
          case 'number':
          case 'url':
          case 'tel':
          case 'email':
          case 'color':
          case 'date':
          case 'time':
          case 'datetime':
          case 'range':
          case 'search':
          case 'text':
            d[5] && (rq=(rq!==undefined?(rq+' '+d[5]):d[5]));
            d[2] && (ot += uHtml.addElement('label', [d[1]], 'for', d[2]));
            ot += uHtml.addElement('input', [d[0], d[1], d[1], d[3], d[4]||'form-control', rq],
              'type|id|name|value|class|!');
            break;
          case 'textarea':
            d[2] && (ot += uHtml.addElement('label', [d[1]], 'for', d[2]));
            ot += uHtml.addHtml('textarea', 'id:' + d[1] + '|name:' + d[1] +
              '|rows:5|class:form-control' + (rq ? '|!:required' : ''), d[3] || '');
            break;
          case 'reset':
          case 'submit':
          case 'button': //
            cls = d[0] == 'submit' ? 'primary' : (d[0] == 'reset' ? 'danger' : 'default');
            ot += uHtml.addHtml('button', 'type:' + d[0] + '|id:' + d[1] + '|name:' + d[1] +
              '|class:btn btn-' + cls + (rq ? '|!:required' : ''), d[2] || '');
            ty = false;
            break;
          case 'select':
            for (var i = 0; i < d[3].length; i++) {
              r = d[3][i].split(':');
              rr = [r[0], d[4] == r[0] ? 'selected' : undefined];
              ot += uHtml.addElement('option', rr, 'value|selected', r[1]);
            }
            ot = uHtml.addElement('select', [d[1], d[1], 'form-control', rq],
              'id|name|class|!', ot);
            d[2] && (ot = uHtml.addElement('label', [d[1]], 'for', d[2]) + ot);
            break;
          case 'radio':
          case 'checkbox':
            cls = 'checkbox';
            d[2] && (ot += uHtml.addElement('label', [], '', d[2]));
            var chk;
            for (var i = 0; i < d[3].length; i++) {
              r = d[3][i].split(':');
               chk =('|'+d[4]+'|').indexOf('|'+r[0]+'|') !==-1;
              rr = [d[0], d[1] + i, d[1]+'[]', r[0], chk ? 'checked' : undefined];
              lt = uHtml.addElement('input', rr, 'type|id|name|value|checked');
              lt = uHtml.addHtml('label', ty == 2 ? 'class:' + d[0] + '-inline' : '', lt + (r[1] || ''));
              ot += (ty == 1 ? uHtml.addHtml('div', 'class:' + d[0], lt) : lt);
            }
            ty = false;
            break;
          case 'check-toggle':
            d[2] && (ot += uHtml.addElement('label', [], '', d[2]));
            lt='';
            lt ='';
            var chk=0;
            for (var i = 0; i < d[3].length; i++) {
              r = d[3][i].split(':');
              chk =('|'+d[4]+'|').indexOf('|'+r[0]+'|') !==-1;
              rr = ['checkbox', d[1] + i, d[1]+'[]', r[0], chk? 'checked' : undefined,'off'];
              cls = uHtml.addElement('input', rr, 'type|id|name|value|checked|autocomplete')+
                    uHtml.addHtml('span', 'class:glyphicon glyphicon-ok', ' ');
              lt += uHtml.addHtml('label','class:btn btn-default'+(chk?' active':''),r[1]+' '+cls);
            }
            ot += uHtml.addElement('div', ['btn-group','buttons'], 'class|data-toggle',lt);
          break;
          case 'uid':
            rr = d[2].split('-');
            var vv = d[3].split('-');
            lt='';
            for(var i in rr ){
              lt += uHtml.addElement('input', ['text','box-uid-item',d[1]+rr[i],d[1]+'['+rr[i]+']',vv[i]||'',rr[i]], 'type|class|id|name|value|placeholder');
            }
            ot +=  uHtml.addElement('div',['box-uid-group'], 'class',lt);
          break;
          case 'agree':
            lt = uHtml.addElement('input', ['checkbox',d[4]||undefined,d[1],d[1],1], 'type|checked|id|name|value')+
                 uHtml.addElement('label', [d[1]], 'for',d[3]);
            ot +=  uHtml.addElement('div', ['checkbox3 checkbox-'+d[2]+' checkbox-inline checkbox-check  checkbox-circle checkbox-light'], 'class',lt);
          break;
          case 'loadbar':
           lt =  uHtml.addElement('div', ['progress-bar progress-bar-'+(d[4]||'')+' progress-bar-striped active','progressbar','100','0','100','width: 100%'], 'class|role|aria-valuenow|aria-valuemin|aria-valuemax|style',d[2]);
           ot += uHtml.addElement('div', [d[1],'progress '+d[3]], 'id|class', lt);
            break;
          case 'alert':
              ot +=  uHtml.addElement('div', ['alert alert-'+d[2],'alert',d[1]], 'class|role|id',d[3]);
            break;
          case 'rangebar':
            ot+= uHtml.addHtml('div','class:range range-primary',
                  uHtml.addHtml('input','class:box-rangebar:|type:range|id:'+d[1]+'|name:'+d[1]+'|min:0|max:100|value:'+d[3]||'0')+
                  uHtml.addHtml('output','id:'+d[1]+'Output',d[3])
                );
          break;
          case 'calendar-datetime':
            ot+=uHtml.createHtml([
                d[2]?['label','',d[2]]:'',
                ['div','class:input-group date box-datetimer|id:'+d[1]+'DatetimerPicker',[
                  ['text',d[1],'',d[3]||''],
                  ['span','class:input-group-addon',[
                    ['span','class:glyphicon glyphicon-calendar']]]
                ]]]);
            break;
          case 'attached':
            lt =  uHtml.addHtml('li', 'class:glyphicon glyphicon-plus', '');
            lt =  uHtml.addHtml('button','data-count:0|type:button|class:aif-btn-file btn btn-default|id:'+d[1] ,lt+' '+d[2]);
            lt =  uHtml.addHtml('h3','class:panel-title' ,lt);
            lt =  uHtml.addHtml('div','clss:cpanel-heading' ,lt)+
                  uHtml.addHtml('ul','class:list-group|id:'+d[1]+'Body' ,'');
            ot += uHtml.addHtml('div', 'class:panel panel-default', lt);
          break;
          default: ot += uHtml.addHtml(d[0], d[1],
            typeof d[2]=='object'?uHtml.createHtml(d[2]):d[2]);
        }
        ht += ty ? uHtml.addHtml('div', 'class:' + cls, ot) : ot;
      }
    }
    //console.log('finalize.............' + ht);
    return ht;
  },

  setOptions:function(rs,idx,id,text){
    var ht =text?'<option value="0">'+text+'</option>':'',vv,tt;
    for(var x in rs){
      //console.log("RS-1: ", x, rs[x]);
      if(rs[x]!==null){
        rs[x] = typeof(rs[x]) == 'string' ? [x, rs[x]] : rs[x];
        //console.log("RS-2: ", x, rs[x]);
        vv = rs[x][0];
        tt = rs[x][1];
        ht+='<option value="'+vv+'"'+(idx==vv?' selected="selected" ':'')+'>'+tt+'</option>';
      }
    }
    if(id)$('#'+id).html(ht);
    else return ht;
  },

 form:function (id,url,data,btn,css,barLabel){
  return '<form id="'+id+'" role="form" data-toggle="validator" novalidate="true" '+(css||'')+'>'+uHtml.createHtml(data)+
      '<div id="idBar'+id+'" class="progress hide">'+
      '<div class="progress-bar progress-bar- progress-bar-striped active"'+
        ' role="progressbar" aria-valuenow="100" aria-valuemin="0"'+
        ' aria-valuemax="100" style="width: 100%">'+
        (barLabel || 'Espere un momento...')+'</div></div>'+
        '<div class="text-right">'+
          '<button id="'+id+'Submit" type="submit" class="btn btn-primary">'+(btn||'Enviar')+'</button>'+
        '</div></form>';
    },

  createForm: function(id, data, pp) {
    pp = pp || 'class:uhtml-form';
    var fr = uHtml.addHtml('form', 'role:form|id:' + id + '|' + pp, uHtml.createHtml(data));
    $('body').html(uHtml.addHtml('div', 'class:container', fr));
    //
  },
  createModal: function(id, title,data,labelBtn,lock,cls,labelBar,type) {
    $('#' + id).remove();
    type || (type=1);
    var hh = '';
    if(labelBtn || type==2 || type==3){
      hh = uHtml.addHtml('span', 'aria-hidden:true', '&times;');
      hh = uHtml.addHtml('button', 'id:' + id + 'BtnCloseTop|type:button|' +
        'class:close|data-dismiss:modal|aria-label:Cerrar', hh);
    }

    hh += uHtml.addHtml('h4', 'class:modal-title', title);
    hh = uHtml.addHtml('div', 'class:modal-header', hh);
    data.push(['loadbar','idBar'+id,labelBar||'','hide']);
    var bb = uHtml.addHtml('div', 'class:modal-body', uHtml.createHtml(data));
    var ff = '';
    if((type==1 || labelBtn=='x') && (type!=3)){
        ff=uHtml.addHtml('button', 'id:' + id + 'BtnClose|type:button|' +
          'class:btn btn-default|data-dismiss:modal', 'Cerrar');
      }
    if(labelBtn && labelBtn!='x'){
       ff+= uHtml.addHtml('button', 'id:' + id + 'BtnSave|type:button|' +
          'class:btn btn-primary', labelBtn||'Guardar');
    }
    ff && (ff = uHtml.addHtml('div', 'class:modal-footer', ff));
    var dd = uHtml.addHtml('div', 'class:modal-content', hh + bb + ff);
    dd = uHtml.addHtml('div', 'class:modal-dialog', dd);
    dd = uHtml.addHtml('div', 'id:' + id + '|class:modal '+(cls||''), dd);
    $('body').append(dd);
    var win = $('#' + id);
    win.onCenter = function(){
      console.log('centrarse');
      win.css({top: '50%',
        transform: 'translateY(-50%)',
      });
      return this;
    };
    win.onLock=function(ty){
      win.modal({ backdrop: ty?'static':'',keyboard: ty?true:false});
      return this;
    };
    win.onClose=function(){
      win.modal('hide');
      win.remove();
      return null;
    };
    win.onLoadBar=function(ty,lck){
      ty ? $('#idBar'+id).removeClass('hide'):$('#idBar'+id).addClass('hide');
      if(lck){
        $("form :input").attr('readonly', 'readonly');
        $(':button').attr("disabled", true);
        //$(":checkbox").attr('readonly', 'readonly');
      }else{
        $("form :input").removeAttr('readonly');
        $(":button").attr("disabled", false);
        //$(":checkbox").removeAttr('readonly');
      }
      return this;
    };
    lock && win.onLock(true);
    win.on('shown.bs.modal', function(e) {
      win.focus();
    });
   return win;
  },
  onLoading: function(id,ty,title) {
    id || (id = 'idLoadingModal');
    var win = $('#'+id);
    win.length && ty && (win.modal('hide'),win.remove(),win=[]);
    win.length || (win = uHtml.createModal(id,title||'',[],null,true));
    if(ty){
      win.modal('show').onLoadBar(true).onCenter();
      return win;
    }
    return win.onClose();
  },
  evtForm:function(){
    var bb = $('.aif-btn-file');
    bb.length && uHtml.onAttached(bb);
    $('.box-rangebar').mousemove(function(event) {
      var id = $(this).attr('id');
      $('#'+id+'Output').val($(this).val());
    });
  },

  addModal: function(id, title, data, callback,labelBtn,lock,ty,wd,hg) {
    if(!uHtml.onSupport())return null;
    var win = uHtml.createModal(id,title,data,labelBtn,lock,'fade modal-primary in','Espere un momento...',ty||1);
    uHtml.evtForm();
    $('#' + id + 'BtnSave').click(function() {
      callback && callback(true);
    });
    $('#' + id + 'BtnClose').click(function() {
      callback && callback(false);
    });
    $('#' + id + 'BtnCloseTop').click(function() {
      callback && callback(false);
    });
    if(wd){
      win.callRz && uApp.delResize(win.callRz);
        win.callRz = uApp.callResize(function(w,h,ty){
          $('.modal-dialog').css('width', w<770?'auto':wd);
        });
    }
    hg && $('.modal-dialog').css('min-height', hg);
    // bg && $('.back').css('background-color', '#834cb4');

    // win.css('margin', '90%');
    //win.css('background-color','rgba(209, 159, 255, 0.58)');
    win.modal('show');

    return win;
  },
  onSupport:function(){
    var sp = true;
    if (window.JSON == undefined)sp=false;
    if (window.FormData==undefined)sp=false;
    if(!sp){
      uHtml.createModal('idModal',' Problemas de compatibilidad',[
       ['alert','idAlert','danger','Lamentablemente tu navegador es incompatible con algunas funcionalidades del la aplicaci&oacute;n, para hacer de &eacute;sta una mejor experiencia, te sugerimos que utilices Google Chrome'
        ],
       '<br/> Si a&uacute;n no lo tienes, puedes descargarlo gratis aqu&iacute;: ',
       '<a href="http://www.google.com/chrome">http://www.google.com/chrome</a>'
      ],'Aceptar',false,'fade modal-primary in','').modal('show');
    }
    return sp;
  },
  addList:function(id,data,imgs){
    var ht ='',img,ar;
    if(data)
      for(x in data){
        img=null;
        if(data[x].indexOf('|')!==-1){
          ar = data[x].split('|');
          data[x]=ar[0];
          img = imgs+ar[1]+'.png';
        }
        ht+='<li id="'+id+x+'" class="list-group-item">'+
        '<a id="_1'+id+x+'" class="pull-left oplistbtn1'+id+'" href="#">'+
         '<span class="glyphicon glyphicon-save"></span>'+
        '</a>&nbsp;&nbsp;'+
        '<a id="_2'+id+x+'" href="#" class="oplistbtn2'+id+'">'+
          (img?'<img class="icon-file" src="'+img+'" />':'')+data[x]
         +'</a>'+
        '<a id="_3'+id+x+'" href="#" class="pull-right oplistbtn3'+id+'">'+
          '<span class="glyphicon glyphicon-trash"></span>'+
        '</a>&nbsp;</li>';
    }
    return ht;
  },
  onAttached:function(itm){
    itm.length && itm.click(function(event) {
      var id = $(this).attr('id');
      var idx = parseInt($(this).attr('data-count'));
      $('#'+id+'Body').append('<li id="aifInputFile'+id+idx+'" class="list-group-item">'+
        uHtml.addElement('input',['file',id+idx,id+idx,'pull-left'],'type|id|name|class','')+
        '<a href="javascript:$(\'#aifInputFile'+id+idx+'\').remove();"><span class="glyphicon glyphicon-remove pull-right"></span></a>&nbsp;'+
        '</li>');
      $(this).attr('data-count',idx+1);
     console.log(id,idx);
    });
  },

  addPages:function(id,nm,ty,active){
    var ht ='';
    for (var i = 1; i<=nm; i++)
      ht+= uHtml.createHtml([['li',(i==active?'class:active|':'')+'id:'+id+'Pg'+i,'<a class="'+id+'Pg" data-pg="'+i+'" href="#">'+i+'</a>']]);
    $('#'+id).html(uHtml.createHtml([
      ty?['li','id:'+id+'PgP','<a class="'+id+'Pg" data-pg="P" href="#"><i class="fa fa-arrow-left"></i></a>']:'',
      ty==2?'':ht,
      ty?['li','id:'+id+'PgN','<a class="'+id+'Pg" data-pg="N" href="#"><i class="fa fa-arrow-right"></i></a>']:''
    ]));
  }
};

var uApp = {
    jsonDecode: function(str) {
    if (str) {
      var json = window.JSON;
      if (typeof json === 'object' && typeof json.parse === 'function') {
        try {
          return json.parse(str);
        } catch (err) {
          if (!(err instanceof SyntaxError)) {
            throw new Error(
              'Unexpected error type in json_decode()');
          }
          return null;
        }
      }
    }
    return null;
  },

  chr:function (codePt) {
  if (codePt > 0xFFFF) {
    codePt -= 0x10000;
    return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF))
  }
  return String.fromCharCode(codePt);
  },
  objForm:function(id){
    var win = {};
    win.modal=function() {
      return this;
    };
    win.onLoadBar=function(ty,lck){
      ty ? $('#idBar'+id).removeClass('hide'):$('#idBar'+id).addClass('hide');
      if(lck){
        $("form :input").attr('readonly', 'readonly');
        $(':button').attr("disabled", true);
        //$(":checkbox").attr('readonly', 'readonly');
      }else{
        $("form :input").removeAttr('readonly');
        $(":button").attr("disabled", false);
      }
      return this;
    };
    win.onCenter=function() {
      console.log('centrar');
      return this;
    };
    return win;
  },
  submitForm:function(win,id,url,callback){
        uApp.sendForm(id,url, function(ty,rs) {
         if(ty){
            win.onLoadBar(true,true);
            if(rs!==null){
              console.log(rs);
              if(rs.success){
                win.modal('hide');
                win.onLoadBar(false,false);
                if(callback)callback(true,rs);
                else window.location.reload();
              }else{
                win.onLoadBar(false,false);
                alert(rs.alert);
                if(callback)callback(false,rs.alert,rs.valid||0);
              }
            }
         }
        });
    },
  sendForm: function(id, url, callback) {
    $('#' + id).validator().on('submit', function(event) {
      if (event.isDefaultPrevented()) {
        callback && callback(false,null);
        alert('Porfavor introduce la información requerida...');
      } else {
        if (!("FormData" in window)) {
          alert('Tu navegador no soprta todas las opciones requeridas por este sistema, para hacer de ésta una mejor experiencia, te sugerimos que utilices Google Chrome.');
          return false;
        }
        callback && callback(true,null);
        var data = new FormData($('#' + id)[0]);
        $.ajax({
          type: 'POST',
          url: url,
          dataType: 'text',  // what to expect back from the PHP script, if anything
          cache: false,
          data: data,
          contentType: false,
          processData: false,
          beforeSend: function() {},
          success: function(result) {
            callback && callback(true,uApp.jsonDecode(result));
          },
          error: function() {}
        });
      }
      return false;
    });
  },
  sendData:function(url,data,callback, errorCallback){
    $.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        data: data,
        success: function (rs,a) {
          callback && callback(rs, a);
        },
        error: function (rs) {
          (errorCallback && errorCallback(null, rs)) || (callback && callback(null, rs));
        }

    });
  },
sendDataImg:function(id, url, callback){
  var data = new FormData($('#' + id)[0]);
  $.ajax({
         type: 'POST',
         url: url,
         dataType: 'text',  // what to expect back from the PHP script, if anything
         cache: false,
         data: data,
         contentType: false,
         processData: false,
         beforeSend: function() {},
         success: function(result) {
         callback && callback(true,uApp.jsonDecode(result));
         },
    error: function() {}
  });
},
sendImgJson:function(id,url,callback, errorCallback){
  var data = new FormData($('#' + id)[0]);
    $.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        data: data,
         contentType: false,
         processData: false,
        success: function (rs,a) {
          callback && callback(rs, a);
        },
        error: function (rs) {
          (errorCallback && errorCallback(null, rs)) || (callback && callback(null, rs));
        }

    });
  },
  getData: function(url,data,callback,ty) {
    var ld=ty?undefined:uHtml.onLoading(null,true,'Espere mientras se cargan los datos.');
    callback && callback(true,null);
    $.ajax({
          type: 'POST',
          url: url,
          dataType: 'text',  // what to expect back from the PHP script, if anything
          data: data || {},
          contentType: false,
          processData: false,
          beforeSend: function() {},
          success: function(result) {
            ld && ld.onClose();
            callback && callback(true,uApp.jsonDecode(result));
          },
          error: function() {
            alert('Ocurrio un error de conexión, intente mas tarde...');
            ld && ld.onClose();
            callback && callback(false,null);
          }
    });
    return false;
  },
  getAjax: function(url,callback,ty) {
    var ld=ty?undefined:uHtml.onLoading(null,true,'Espere mientras se cargan los datos.');
    callback && callback(true,null);
    $.ajax({
          type: 'GET',
          url: url,
          success: function(result) {
            ld && ld.onClose();
            callback && callback(true,result);
          },
          error: function() {
            alert('Ocurrio un error de conexión, intente mas tarde...');
            ld && ld.onClose();
            callback && callback(false,null);
          }
    });
    return false;
  },
  subWrapStr:function(str,sz,prx){
    if(str.length <sz)return str;
    var st = str.substr(0, sz);
    return  st.substr(0, Math.min(st.length, st.lastIndexOf(' ')))+(prx||'');
  },
  scrollToBottom:function(id){
    $(id).animate({ scrollTop: $(id)[0].scrollHeight}, 1000);
  },
  scrollToTop:function(id) {
    $(id).animate({ scrollTop: 0}, 1000);
  },
  poolRz:[],
  callResize : function(callback) {
    if(typeof callback == 'function'){
      var width = window.innerWidth || screen.width || $(window).width();
      var height = window.innerHeight || screen.height || (window).height();
      callback(width,height,0);
      return uApp.poolRz.push(callback) - 1 ;
    };
    return null;
  },
  delResize : function(idx) {
    idx!==null && (uApp.poolRz[idx]=null);
  },
  onCallResize:function(ty){
    var width = window.innerWidth || screen.width || $(window).width();
    var height = window.innerHeight || screen.height || (window).height();
    for (var i = 0; i < uApp.poolRz.length; i++) {
      //console.log(uApp.poolRz[i]);
      typeof uApp.poolRz[i] == 'function' && uApp.poolRz[i](width,height,ty);
    }
  },
  onCache : function(url){
    return url;
  }
};


(function(){
  $(window).resize(function() {
    uApp.onCallResize();
  });
  window.onorientationchange = function() {
    uApp.onCallResize();
  };
})();



/*
--------------------------------------------------------------------------------
Bibliotecas externas
--------------------------------------------------------------------------------
 * JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 * Copyright 2011, Sebastian Tschan
 * Licensed under the MIT license:
 */
!function(n){"use strict";function t(n,t){var r=(65535&n)+(65535&t),e=(n>>16)+(t>>16)+(r>>16);return e<<16|65535&r}function r(n,t){return n<<t|n>>>32-t}function e(n,e,o,u,c,f){return t(r(t(t(e,n),t(u,f)),c),o)}function o(n,t,r,o,u,c,f){return e(t&r|~t&o,n,t,u,c,f)}function u(n,t,r,o,u,c,f){return e(t&o|r&~o,n,t,u,c,f)}function c(n,t,r,o,u,c,f){return e(t^r^o,n,t,u,c,f)}function f(n,t,r,o,u,c,f){return e(r^(t|~o),n,t,u,c,f)}function i(n,r){n[r>>5]|=128<<r%32,n[(r+64>>>9<<4)+14]=r;var e,i,a,h,d,l=1732584193,g=-271733879,v=-1732584194,m=271733878;for(e=0;e<n.length;e+=16)i=l,a=g,h=v,d=m,l=o(l,g,v,m,n[e],7,-680876936),m=o(m,l,g,v,n[e+1],12,-389564586),v=o(v,m,l,g,n[e+2],17,606105819),g=o(g,v,m,l,n[e+3],22,-1044525330),l=o(l,g,v,m,n[e+4],7,-176418897),m=o(m,l,g,v,n[e+5],12,1200080426),v=o(v,m,l,g,n[e+6],17,-1473231341),g=o(g,v,m,l,n[e+7],22,-45705983),l=o(l,g,v,m,n[e+8],7,1770035416),m=o(m,l,g,v,n[e+9],12,-1958414417),v=o(v,m,l,g,n[e+10],17,-42063),g=o(g,v,m,l,n[e+11],22,-1990404162),l=o(l,g,v,m,n[e+12],7,1804603682),m=o(m,l,g,v,n[e+13],12,-40341101),v=o(v,m,l,g,n[e+14],17,-1502002290),g=o(g,v,m,l,n[e+15],22,1236535329),l=u(l,g,v,m,n[e+1],5,-165796510),m=u(m,l,g,v,n[e+6],9,-1069501632),v=u(v,m,l,g,n[e+11],14,643717713),g=u(g,v,m,l,n[e],20,-373897302),l=u(l,g,v,m,n[e+5],5,-701558691),m=u(m,l,g,v,n[e+10],9,38016083),v=u(v,m,l,g,n[e+15],14,-660478335),g=u(g,v,m,l,n[e+4],20,-405537848),l=u(l,g,v,m,n[e+9],5,568446438),m=u(m,l,g,v,n[e+14],9,-1019803690),v=u(v,m,l,g,n[e+3],14,-187363961),g=u(g,v,m,l,n[e+8],20,1163531501),l=u(l,g,v,m,n[e+13],5,-1444681467),m=u(m,l,g,v,n[e+2],9,-51403784),v=u(v,m,l,g,n[e+7],14,1735328473),g=u(g,v,m,l,n[e+12],20,-1926607734),l=c(l,g,v,m,n[e+5],4,-378558),m=c(m,l,g,v,n[e+8],11,-2022574463),v=c(v,m,l,g,n[e+11],16,1839030562),g=c(g,v,m,l,n[e+14],23,-35309556),l=c(l,g,v,m,n[e+1],4,-1530992060),m=c(m,l,g,v,n[e+4],11,1272893353),v=c(v,m,l,g,n[e+7],16,-155497632),g=c(g,v,m,l,n[e+10],23,-1094730640),l=c(l,g,v,m,n[e+13],4,681279174),m=c(m,l,g,v,n[e],11,-358537222),v=c(v,m,l,g,n[e+3],16,-722521979),g=c(g,v,m,l,n[e+6],23,76029189),l=c(l,g,v,m,n[e+9],4,-640364487),m=c(m,l,g,v,n[e+12],11,-421815835),v=c(v,m,l,g,n[e+15],16,530742520),g=c(g,v,m,l,n[e+2],23,-995338651),l=f(l,g,v,m,n[e],6,-198630844),m=f(m,l,g,v,n[e+7],10,1126891415),v=f(v,m,l,g,n[e+14],15,-1416354905),g=f(g,v,m,l,n[e+5],21,-57434055),l=f(l,g,v,m,n[e+12],6,1700485571),m=f(m,l,g,v,n[e+3],10,-1894986606),v=f(v,m,l,g,n[e+10],15,-1051523),g=f(g,v,m,l,n[e+1],21,-2054922799),l=f(l,g,v,m,n[e+8],6,1873313359),m=f(m,l,g,v,n[e+15],10,-30611744),v=f(v,m,l,g,n[e+6],15,-1560198380),g=f(g,v,m,l,n[e+13],21,1309151649),l=f(l,g,v,m,n[e+4],6,-145523070),m=f(m,l,g,v,n[e+11],10,-1120210379),v=f(v,m,l,g,n[e+2],15,718787259),g=f(g,v,m,l,n[e+9],21,-343485551),l=t(l,i),g=t(g,a),v=t(v,h),m=t(m,d);return[l,g,v,m]}function a(n){var t,r="",e=32*n.length;for(t=0;t<e;t+=8)r+=String.fromCharCode(n[t>>5]>>>t%32&255);return r}function h(n){var t,r=[];for(r[(n.length>>2)-1]=void 0,t=0;t<r.length;t+=1)r[t]=0;var e=8*n.length;for(t=0;t<e;t+=8)r[t>>5]|=(255&n.charCodeAt(t/8))<<t%32;return r}function d(n){return a(i(h(n),8*n.length))}function l(n,t){var r,e,o=h(n),u=[],c=[];for(u[15]=c[15]=void 0,o.length>16&&(o=i(o,8*n.length)),r=0;r<16;r+=1)u[r]=909522486^o[r],c[r]=1549556828^o[r];return e=i(u.concat(h(t)),512+8*t.length),a(i(c.concat(e),640))}function g(n){var t,r,e="0123456789abcdef",o="";for(r=0;r<n.length;r+=1)t=n.charCodeAt(r),o+=e.charAt(t>>>4&15)+e.charAt(15&t);return o}function v(n){return unescape(encodeURIComponent(n))}function m(n){return d(v(n))}function p(n){return g(m(n))}function s(n,t){return l(v(n),v(t))}function C(n,t){return g(s(n,t))}function A(n,t,r){return t?r?s(t,n):C(t,n):r?m(n):p(n)}"function"==typeof define&&define.amd?define(function(){return A}):"object"==typeof module&&module.exports?module.exports=A:n.md5=A}(this);
/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 * Copyright 2006, 2014 Klaus Hartl
 * Released under the MIT license
 */
!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):"object"==typeof exports?module.exports=e(require("jquery")):e(jQuery)}(function(e){function n(e){return u.raw?e:encodeURIComponent(e)}function o(e){return u.raw?e:decodeURIComponent(e)}function i(e){return n(u.json?JSON.stringify(e):String(e))}function t(e){0===e.indexOf('"')&&(e=e.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\"));try{return e=decodeURIComponent(e.replace(c," ")),u.json?JSON.parse(e):e}catch(n){}}function r(n,o){var i=u.raw?n:t(n);return e.isFunction(o)?o(i):i}var c=/\+/g,u=e.cookie=function(t,c,s){if(arguments.length>1&&!e.isFunction(c)){if(s=e.extend({},u.defaults,s),"number"==typeof s.expires){var a=s.expires,d=s.expires=new Date;d.setMilliseconds(d.getMilliseconds()+864e5*a)}return document.cookie=[n(t),"=",i(c),s.expires?"; expires="+s.expires.toUTCString():"",s.path?"; path="+s.path:"",s.domain?"; domain="+s.domain:"",s.secure?"; secure":""].join("")}for(var f=t?void 0:{},p=document.cookie?document.cookie.split("; "):[],l=0,m=p.length;m>l;l++){var x=p[l].split("="),g=o(x.shift()),j=x.join("=");if(t===g){f=r(j,c);break}t||void 0===(j=r(j))||(f[g]=j)}return f};u.defaults={},e.removeCookie=function(n,o){return e.cookie(n,"",e.extend({},o,{expires:-1})),!e.cookie(n)}});
