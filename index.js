var _strformat = require('strformat')
  , _ansyc = require('async')
  , _fetch = require('fetch').fetchUrl
  , _fetchStream = require("fetch").FetchStream
  , _fs = require('fs-extra')
  , _ = require('underscore')
  , _path = require('path')
  , _url = require('url')
  , _cheerio = require('cheerio');

var _dropbox = function(remote, saveTo, options, done){
  var ops = {
    depth: -1,
    filter: null
  };

  this.options = _.extend(ops, options);
  this.saveTo = saveTo;
  this.remote = remote;
  this.done = done;
  this.rootPath = _url.parse(this.remote).pathname;
  this.run();
}

//执行
_dropbox.prototype.run = function(){
  this.fetch(this.remote, this.done);
}

/*
 获取一个页面所有符合规则的链接
 */
_dropbox.prototype.fetch = function(url, fetchDone){
  console.log('获取文件夹：%s', url);
  var expr = '#list-view-container a.thumb-link';
  var self = this;
  //下载页面，并转换为$
  this.toCheerio(url, function(err, $){
    if(err) return done(err);

    var index = 0;
    var $list = $(expr);
    _ansyc.whilst(function(){
      return index <  $list.length;
    }, function(callback){
      var $item = $($list[index]);
      index ++;
      var link = $item.attr('href');
      //包含s_web_folder_32这个样式，则是文件夹
      if($('.s_web_folder_32', $item).length > 0){
        self.fetch(link, callback);
      }else{
        self.download(link, callback);
      }
    }, function(err){
      //全部完成
      fetchDone(err);
    });
  });
};

/*
 获取下载文件的链接
 */
_dropbox.prototype.fetchDownloadLink = function(url, callback){
  var self = this;
  this.toCheerio(url, function(err, $){
    if(err) return callback(err);

    var $link = $('#download_button_link');
    var link = $link.attr('href');
    callback(null, link);
  });
}

/*
  获取文件名，替换掉根目录
 */
_dropbox.prototype.getFileName = function(link){
  var url = _url.parse(link);
  var filename = url.pathname.replace(/\/sh\/([^\/]+\/){2}/, '');
  filename = decodeURIComponent(filename);
  return filename;
  //return url.pathname.replace(this.rootPath, '');
}
/*
  下载指定链接的文件到本地
 */
_dropbox.prototype.download = function(url, callback){
  var self = this;
  this.fetchDownloadLink(url, function(err, link){
    if(err) return callback(err);
    var filename = self.getFileName(link)
    var saveFile = _path.join(self.saveTo, filename);

    //如果文件存在，则删除
    if(_fs.existsSync(saveFile)){
      _fs.removeSync(saveFile);
    }else{
      //创建这个文件夹
      var path = _path.dirname(saveFile);
      _fs.mkdirsSync(path);
    }

    _fetch(link, function(err, meta, body){
      if(err) return callback(err);
      _fs.outputFileSync(saveFile, body);
      console.log('文件[%s]保存成功', filename);
      callback();
    });
  });
}

/*
 下载某个html，并根据表达式返回cheerio的对象
 @param {String} url - 要下载的链接
 @param {String} expr - 用于cheerio过滤的表达式，参考jQuery
 @param {Function} callback - 回调处理
 */
_dropbox.prototype.toCheerio = function(url, callback){
  _fetch(url, function(err, meta, body){
    if(err) return callback(err);

    var content = body.toString();
    callback(null, _cheerio.load(content));
  });
}

/*
  下载dropbox共享链接下的所有文章
  @param {String} url - dropbox的共享链接，例如：https://www.dropbox.com/sh/0ue01tzygjqqb37/lXbAbJqheX
  @saveTo {String}
  @options {Object} options - 选项
    var options = {
      //获取文件夹的最深层级，-1为不限制，0为第一级，类推
      depth: -1,
      //文件夹过滤限制，支持多个
      filter: [/\.md$/i],
      //本地文件保存位置
      saveTo: 'dropbox'
    }
  @param {Function} done - 完成后的回调
 */
exports.downloadAll = function(url, saveTo, options, done){
  new _dropbox(url, saveTo, options, done);
}