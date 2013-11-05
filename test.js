var _dds = require('./')
  , _path = require('path')
  , _expect = require('expect.js');

describe('分析meta', function(){
  it('下载分析', function(done){
    this.timeout(1000 * 60 * 60);
    //var _dds = require('download-dropbox-share');
    var url = 'https://www.dropbox.com/sh/0ue01tzygjqqb37/lXbAbJqheX';
    //选项暂时无效
    var options = {
      depth: -1,
      filter: [/\.(md|css)$/i]
    };

    //要保存的路径
    var saveTo = _path.join(__dirname, 'dropbox');

    //下载所有文件
    _dds.downloadAll(url, saveTo, options, function(){
      console.log('完成');
      done();
    });
  });
});