download-dropbox-share
======================

下载dropbox共享文件夹下的所有文件到本地，无需使用app key。该项目是[Purelog](http://purelog.org)的一个子项目。

#安装

`npm install download-dropbox-share`

#使用

    var _dds = require('download-dropbox-share');
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

`download-dropbox-share`会获取该共享链接下的所有文件并下载。

#依赖项

* fs-extra
* cheerio
* strformat
* fetch
* async

#Author

Conis

Blog: [http://iove.net](http://iove.net)

E-mail: [conis.yi@gmail.com](conis.yi@gmail.com)

[Purelog](http://Purelog.org)
