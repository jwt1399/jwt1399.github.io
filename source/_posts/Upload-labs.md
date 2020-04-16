---
title: Upload-labs学习笔记
author: 简文涛
categories:
  - Web
tags:
  - 文件上传
comments: true
img: 'https://i.loli.net/2019/07/10/5d25917f079d184377.png'
abbrlink: 22458
date: 2019-07-10 15:18:35
---
![](https://i.loli.net/2019/07/10/5d25917f079d184377.png)
**upload-labs包含漏洞类型分类**
![](https://i.loli.net/2019/07/10/5d25e308bd36010715.png)
**如何判断上传漏洞类型**?
![](https://i.loli.net/2019/07/10/5d25e308a563a72451.png)
**上传的过程**
![](https://i.loli.net/2019/07/10/5d25e308bcbfc88081.png)
## Pass-01（前端JS绕过）
```php
function checkFile() {
    var file = document.getElementsByName('upload_file')[0].value;
    if (file == null || file == "") {
        alert("请选择要上传的文件!");
        return false;
    }
    //定义允许上传的文件类型
    var allow_ext = ".jpg|.png|.gif";
    //提取上传文件的类型
    var ext_name = file.substring(file.lastIndexOf("."));
    //判断上传文件类型是否允许上传
    if (allow_ext.indexOf(ext_name + "|") == -1) {
        var errMsg = "该文件不允许上传，请上传" + allow_ext + "类型的文件,当前文件类型为：" + ext_name;
        alert(errMsg);
        return false;
    }
}
```
**方法一**：前端检测。js的检测只能位于client，可以禁用js,在浏览器设置中修改。或者直接改掉这里的 `checkFile()`
![](https://i.loli.net/2019/07/10/5d25e3089bf2484973.png)
修改之后就可以直接上传.php文件,上传之后复制图像地址就可以得到上传路径了
![](https://i.loli.net/2019/07/10/5d259e89e70f481855.png)
![](https://i.loli.net/2019/07/10/5d259eeca0ff482219.png)
**方法二**：上传1.png直接抓包，修改后缀为php就可以绕过上传
![](https://i.loli.net/2019/07/10/5d25921a1fa3871606.png)
得到路径/upload/1.php,连接菜刀，得到shell
![](https://i.loli.net/2019/07/10/5d259e89e762113980.png)
## Pass-02（MIME绕过）
```php
$is_upload = false;
$msg = null;
if (isset($_POST['submit'])) {
    if (file_exists(UPLOAD_PATH)) {
        if (($_FILES['upload_file']['type'] == 'image/jpeg') || ($_FILES['upload_file']['type'] == 'image/png') || ($_FILES['upload_file']['type'] == 'image/gif')) {
            $temp_file = $_FILES['upload_file']['tmp_name'];
            $img_path = UPLOAD_PATH . '/' . $_FILES['upload_file']['name']            
            if (move_uploaded_file($temp_file, $img_path)) {
                $is_upload = true;
            } else {
                $msg = '上传出错！';
            }
        } else {
            $msg = '文件类型不正确，请重新上传！';
        }
    } else {
        $msg = UPLOAD_PATH.'文件夹不存在,请手工创建！';
    }
}
```
本节对数据包的MIME（content-type）进行了限定，只允许 image/jpeg、image/png、image/gif 图片内容数据传输。操作和第一节方法二一样。

上传1.png直接抓包，修改后缀为php就可以绕过上传
![](https://i.loli.net/2019/07/10/5d25921a1fa3871606.png)
得到路径/upload/1.php,连接菜刀，得到shell
![](https://i.loli.net/2019/07/10/5d259e89e762113980.png)

## Pass-03（上传特殊可解析后缀绕过php4、phtml）
```php
$is_upload = false;
$msg = null;
if (isset($_POST['submit'])) {
    if (file_exists(UPLOAD_PATH)) {
        $deny_ext = array('.asp','.aspx','.php','.jsp');
        $file_name = trim($_FILES['upload_file']['name']);
        $file_name = deldot($file_name);//删除文件名末尾的点
        $file_ext = strrchr($file_name, '.');
        $file_ext = strtolower($file_ext); //转换为小写
        $file_ext = str_ireplace('::$DATA', '', $file_ext);//去除字符串::$DATA
        $file_ext = trim($file_ext); //收尾去空

        if(!in_array($file_ext, $deny_ext)) {
            $temp_file = $_FILES['upload_file']['tmp_name'];
            $img_path = UPLOAD_PATH.'/'.date("YmdHis").rand(1000,9999).$file_ext;            
            if (move_uploaded_file($temp_file,$img_path)) {
                 $is_upload = true;
            } else {
                $msg = '上传出错！';
            }
        } else {
            $msg = '不允许上传.asp,.aspx,.php,.jsp后缀文件！';
        }
    } else {
        $msg = UPLOAD_PATH . '文件夹不存在,请手工创建！';
    }
}
```

查看源码，发现是设置了文件后缀名黑名单，禁止上传后缀名为.php文件，这里利用php2、php3、php4、php5、phps、phtml一样会解析，直接修改后缀名为phps上传。
复制图像地址
![](https://i.loli.net/2019/07/10/5d25a447e8e7e46472.png)
得到上传路径
![](https://i.loli.net/2019/07/10/5d25a3f3b012145109.png)
**常见扩展名绕过**：
```
asp:asa,cer,cdx
aspx:ashx,asmx,ascx
php:php2、php3、php4、php5、phps、phtml
jsp:jspx,jspf
```
## Pass-04（上传 .htaccess）
```php
$is_upload = false;
$msg = null;
if (isset($_POST['submit'])) {
    if (file_exists(UPLOAD_PATH)) {
        $deny_ext = array(".php",".php5",".php4",".php3",".php2","php1",".html",".htm",".phtml",".pht",".pHp",".pHp5",".pHp4",".pHp3",".pHp2","pHp1",".Html",".Htm",".pHtml",".jsp",".jspa",".jspx",".jsw",".jsv",".jspf",".jtml",".jSp",".jSpx",".jSpa",".jSw",".jSv",".jSpf",".jHtml",".asp",".aspx",".asa",".asax",".ascx",".ashx",".asmx",".cer",".aSp",".aSpx",".aSa",".aSax",".aScx",".aShx",".aSmx",".cEr",".sWf",".swf");
        $file_name = trim($_FILES['upload_file']['name']);
        $file_name = deldot($file_name);//删除文件名末尾的点
        $file_ext = strrchr($file_name, '.');
        $file_ext = strtolower($file_ext); //转换为小写
        $file_ext = str_ireplace('::$DATA', '', $file_ext);//去除字符串::$DATA
        $file_ext = trim($file_ext); //收尾去空

        if (!in_array($file_ext, $deny_ext)) {
            $temp_file = $_FILES['upload_file']['tmp_name'];
            $img_path = UPLOAD_PATH.'/'.date("YmdHis").rand(1000,9999).$file_ext;
            if (move_uploaded_file($temp_file, $img_path)) {
                $is_upload = true;
            } else {
                $msg = '上传出错！';
            }
        } else {
            $msg = '此文件不允许上传!';
        }
    } else {
        $msg = UPLOAD_PATH . '文件夹不存在,请手工创建！';
    }
}
```
比刚才的黑名单多了不少，但是.htaccess还是没有过滤，可以`重写文件解析规则`绕过，上传一个`.htaccess`，文件内容如下，意思就是在upload目录下匹配1.jpg的文件并以php文件执行
```php
<FilesMatch "1.jpg">
SetHandler application/x-httpd-php
</FilesMatch>	
```
上传一个`.htaccess`
![](https://i.loli.net/2019/07/10/5d25ad7b5ee8e39892.png)
上传`1.jpg`,应为重写了文件解析规则，1.jpg将会被以php文件执行
![](https://i.loli.net/2019/07/10/5d25b04b0258016333.png)
然后直接连接菜刀
![](https://i.loli.net/2019/07/10/5d25b1ad8c6b176191.png)
getshell
![](https://i.loli.net/2019/07/10/5d25b1639408c69941.png)
**.htaccess攻击总结**
有的时候由于各种名单的原因，可能我们不能上传任何php文件，而且还没有其他地方来解析成php，咋办？如果你能上传.htaccess文件的话，那么就很好办了。
建一个.htaccess 文件，里面的内容如下
```php
<FilesMatch "1.jpg">
SetHandler application/x-httpd-php
</FilesMatch>
```
这个时候就上传一个文件名字是1.jpg的文件，然后里面是一句话木马，1.jpg就会被当成1.php执行，就能成功连接菜刀

## Pass-05（后缀大小写绕过）
```php
$is_upload = false;
$msg = null;
if (isset($_POST['submit'])) {
    if (file_exists(UPLOAD_PATH)) {
        $deny_ext = array(".php",".php5",".php4",".php3",".php2",".html",".htm",".phtml",".pht",".pHp",".pHp5",".pHp4",".pHp3",".pHp2",".Html",".Htm",".pHtml",".jsp",".jspa",".jspx",".jsw",".jsv",".jspf",".jtml",".jSp",".jSpx",".jSpa",".jSw",".jSv",".jSpf",".jHtml",".asp",".aspx",".asa",".asax",".ascx",".ashx",".asmx",".cer",".aSp",".aSpx",".aSa",".aSax",".aScx",".aShx",".aSmx",".cEr",".sWf",".swf",".htaccess");
        $file_name = trim($_FILES['upload_file']['name']);
        $file_name = deldot($file_name);//删除文件名末尾的点
        $file_ext = strrchr($file_name, '.');
        $file_ext = str_ireplace('::$DATA', '', $file_ext);//去除字符串::$DATA
        $file_ext = trim($file_ext); //首尾去空

        if (!in_array($file_ext, $deny_ext)) {
            $temp_file = $_FILES['upload_file']['tmp_name'];
            $img_path = UPLOAD_PATH.'/'.date("YmdHis").rand(1000,9999).$file_ext;
            if (move_uploaded_file($temp_file, $img_path)) {
                $is_upload = true;
            } else {
                $msg = '上传出错！';
            }
        } else {
            $msg = '此文件类型不允许上传！';
        }
    } else {
        $msg = UPLOAD_PATH . '文件夹不存在,请手工创建！';
    }
}
```
**Pass-04与Pass-05代码对比**
![](https://i.loli.net/2019/07/10/5d25e308c1cf337348.png)
对比之后发现黑名单多了一个`.htaccess`
并且没有将文件后缀转小写的代码了
于是这里显然可以用大小写绕过，例如 .Php .phP
![](https://i.loli.net/2019/07/11/5d2697927638a47192.png)

## Pass-06（后缀末尾 加空格 绕过）
```php
$is_upload = false;
$msg = null;
if (isset($_POST['submit'])) {
    if (file_exists(UPLOAD_PATH)) {
        $deny_ext = array(".php",".php5",".php4",".php3",".php2",".html",".htm",".phtml",".pht",".pHp",".pHp5",".pHp4",".pHp3",".pHp2",".Html",".Htm",".pHtml",".jsp",".jspa",".jspx",".jsw",".jsv",".jspf",".jtml",".jSp",".jSpx",".jSpa",".jSw",".jSv",".jSpf",".jHtml",".asp",".aspx",".asa",".asax",".ascx",".ashx",".asmx",".cer",".aSp",".aSpx",".aSa",".aSax",".aScx",".aShx",".aSmx",".cEr",".sWf",".swf",".htaccess");
        $file_name = $_FILES['upload_file']['name'];
        $file_name = deldot($file_name);//删除文件名末尾的点
        $file_ext = strrchr($file_name, '.');
        $file_ext = strtolower($file_ext); //转换为小写
        $file_ext = str_ireplace('::$DATA', '', $file_ext);//去除字符串::$DATA
        
        if (!in_array($file_ext, $deny_ext)) {
            $temp_file = $_FILES['upload_file']['tmp_name'];
            $img_path = UPLOAD_PATH.'/'.date("YmdHis").rand(1000,9999).$file_ext;
            if (move_uploaded_file($temp_file,$img_path)) {
                $is_upload = true;
            } else {
                $msg = '上传出错！';
            }
        } else {
            $msg = '此文件不允许上传';
        }
    } else {
        $msg = UPLOAD_PATH . '文件夹不存在,请手工创建！';
    }
}
```
**Pass-05与Pass-06代码对比**
![](https://i.loli.net/2019/07/10/5d25eb9e76b1292828.png)
发现删去了将文件名前后去空格的操作 所以可以利用`6.php(空格)`
![](https://i.loli.net/2019/07/11/5d2696f2bc32834852.png)
## Pass-07（后缀末尾 加点 绕过）
```php
$is_upload = false;
$msg = null;
if (isset($_POST['submit'])) {
    if (file_exists(UPLOAD_PATH)) {
        $deny_ext = array(".php",".php5",".php4",".php3",".php2",".html",".htm",".phtml",".pht",".pHp",".pHp5",".pHp4",".pHp3",".pHp2",".Html",".Htm",".pHtml",".jsp",".jspa",".jspx",".jsw",".jsv",".jspf",".jtml",".jSp",".jSpx",".jSpa",".jSw",".jSv",".jSpf",".jHtml",".asp",".aspx",".asa",".asax",".ascx",".ashx",".asmx",".cer",".aSp",".aSpx",".aSa",".aSax",".aScx",".aShx",".aSmx",".cEr",".sWf",".swf",".htaccess");
        $file_name = trim($_FILES['upload_file']['name']);
        $file_ext = strrchr($file_name, '.');
        $file_ext = strtolower($file_ext); //转换为小写
        $file_ext = str_ireplace('::$DATA', '', $file_ext);//去除字符串::$DATA
        $file_ext = trim($file_ext); //首尾去空
        
        if (!in_array($file_ext, $deny_ext)) {
            $temp_file = $_FILES['upload_file']['tmp_name'];
            $img_path = UPLOAD_PATH.'/'.$file_name;
            if (move_uploaded_file($temp_file, $img_path)) {
                $is_upload = true;
            } else {
                $msg = '上传出错！';
            }
        } else {
            $msg = '此文件类型不允许上传！';
        }
    } else {
        $msg = UPLOAD_PATH . '文件夹不存在,请手工创建！';
    }
}
```
**Pass-06与Pass-07代码对比**
![](https://i.loli.net/2019/07/11/5d268d5ff024a68329.png)
对比发现没有去处文件末尾的点的操作了
于是利用`7.php.`
![](https://i.loli.net/2019/07/11/5d268e891711188220.png)
## Pass-08（ ::$DATA 绕过 ）
```php
$is_upload = false;
$msg = null;
if (isset($_POST['submit'])) {
    if (file_exists(UPLOAD_PATH)) {
        $deny_ext = array(".php",".php5",".php4",".php3",".php2",".html",".htm",".phtml",".pht",".pHp",".pHp5",".pHp4",".pHp3",".pHp2",".Html",".Htm",".pHtml",".jsp",".jspa",".jspx",".jsw",".jsv",".jspf",".jtml",".jSp",".jSpx",".jSpa",".jSw",".jSv",".jSpf",".jHtml",".asp",".aspx",".asa",".asax",".ascx",".ashx",".asmx",".cer",".aSp",".aSpx",".aSa",".aSax",".aScx",".aShx",".aSmx",".cEr",".sWf",".swf",".htaccess");
        $file_name = trim($_FILES['upload_file']['name']);
        $file_name = deldot($file_name);//删除文件名末尾的点
        $file_ext = strrchr($file_name, '.');
        $file_ext = strtolower($file_ext); //转换为小写
        $file_ext = trim($file_ext); //首尾去空
        
        if (!in_array($file_ext, $deny_ext)) {
            $temp_file = $_FILES['upload_file']['tmp_name'];
            $img_path = UPLOAD_PATH.'/'.date("YmdHis").rand(1000,9999).$file_ext;
            if (move_uploaded_file($temp_file, $img_path)) {
                $is_upload = true;
            } else {
                $msg = '上传出错！';
            }
        } else {
            $msg = '此文件类型不允许上传！';
        }
    } else {
        $msg = UPLOAD_PATH . '文件夹不存在,请手工创建！';
    }
}
```
**Pass-07与Pass-08代码对比**
![](https://i.loli.net/2019/07/11/5d269874eb86289062.png)
对比发现这里删掉了` ::$DATA`的限制
`::$DATA备用流`存在于每个文件，因此它可以是访问任何文件的替代方法
所以使用`8.php::$DATA`
![](https://i.loli.net/2019/07/11/5d269c8c2007e67852.png)
**Windows :: DATA备用数据流漏洞：**
https://www.owasp.org/index.php/Windows_::DATA_alternate_data_stream
## Pass-09（点和空格配合绕过）
```php
$is_upload = false;
$msg = null;
if (isset($_POST['submit'])) {
    if (file_exists(UPLOAD_PATH)) {
        $deny_ext = array(".php",".php5",".php4",".php3",".php2",".html",".htm",".phtml",".pht",".pHp",".pHp5",".pHp4",".pHp3",".pHp2",".Html",".Htm",".pHtml",".jsp",".jspa",".jspx",".jsw",".jsv",".jspf",".jtml",".jSp",".jSpx",".jSpa",".jSw",".jSv",".jSpf",".jHtml",".asp",".aspx",".asa",".asax",".ascx",".ashx",".asmx",".cer",".aSp",".aSpx",".aSa",".aSax",".aScx",".aShx",".aSmx",".cEr",".sWf",".swf",".htaccess");
        $file_name = trim($_FILES['upload_file']['name']);
        $file_name = deldot($file_name);//删除文件名末尾的点
        $file_ext = strrchr($file_name, '.');
        $file_ext = strtolower($file_ext); //转换为小写
        $file_ext = str_ireplace('::$DATA', '', $file_ext);//去除字符串::$DATA
        $file_ext = trim($file_ext); //首尾去空
        
        if (!in_array($file_ext, $deny_ext)) {
            $temp_file = $_FILES['upload_file']['tmp_name'];
            $img_path = UPLOAD_PATH.'/'.$file_name;
            if (move_uploaded_file($temp_file, $img_path)) {
                $is_upload = true;
            } else {
                $msg = '上传出错！';
            }
        } else {
            $msg = '此文件类型不允许上传！';
        }
    } else {
        $msg = UPLOAD_PATH . '文件夹不存在,请手工创建！';
    }
}
```
**Pass-08与Pass-09代码对比**
![](https://i.loli.net/2019/07/11/5d26a0be9756512346.png)
对比发现代码后缀名处理的不够严谨, 先去除了文件后面的`.` 再去除了文件后缀的空格, 由于只处理了一次, 所以可以通过上传`9.php. .`虽然有去末尾点和去首尾空格的操作
但是并不是循环处理的
所以可以这样构造`9.php. .`
这样经过一轮处理后，变为`9.php.`
![](https://i.loli.net/2019/07/11/5d26ac3cd04d742978.png)
## Pass-10（双后缀名绕过）
```php
$is_upload = false;
$msg = null;
if (isset($_POST['submit'])) {
    if (file_exists(UPLOAD_PATH)) {
        $deny_ext = array("php","php5","php4","php3","php2","html","htm","phtml","pht","jsp","jspa","jspx","jsw","jsv","jspf","jtml","asp","aspx","asa","asax","ascx","ashx","asmx","cer","swf","htaccess");

        $file_name = trim($_FILES['upload_file']['name']);
        $file_name = str_ireplace($deny_ext,"", $file_name);
        $temp_file = $_FILES['upload_file']['tmp_name'];
        $img_path = UPLOAD_PATH.'/'.$file_name;        
        if (move_uploaded_file($temp_file, $img_path)) {
            $is_upload = true;
        } else {
            $msg = '上传出错！';
        }
    } else {
        $msg = UPLOAD_PATH . '文件夹不存在,请手工创建！';
    }
}
```
发现关键点
```php
$file_name = str_ireplace($deny_ext,"", $file_name);

//将文件名（$file_name）中含有黑名单（$deny_ext）的替换为""（删除黑名单字符）
```
但是代码并未循环过滤，于是存在`10.pphphp`
![](https://i.loli.net/2019/07/11/5d26c459dae9d18308.png)
菜刀连接
![](https://i.loli.net/2019/07/11/5d26c459b690b50978.png)
getshell
![](https://i.loli.net/2019/07/11/5d26c459c8b8169526.png)
## Pass-11（%00截断绕过）
```php
$is_upload = false;
$msg = null;
if(isset($_POST['submit'])){
    $ext_arr = array('jpg','png','gif');
    $file_ext = substr($_FILES['upload_file']['name'],strrpos($_FILES['upload_file']['name'],".")+1);
    if(in_array($file_ext,$ext_arr)){
        $temp_file = $_FILES['upload_file']['tmp_name'];
        $img_path = $_GET['save_path']."/".rand(10, 99).date("YmdHis").".".$file_ext;

        if(move_uploaded_file($temp_file,$img_path)){
            $is_upload = true;
        } else {
            $msg = '上传出错！';
        }
    } else{
        $msg = "只允许上传.jpg|.png|.gif类型文件！";
    }
}
```
发现关键点
```php
 $img_path = $_GET['save_path']."/".rand(10, 99).date("YmdHis").".".$file_ext;
 
 上传文件路径由路径+时间+后缀重新命名
```
1.PHP 版本 < 5.3.4
2.php.ini 中 magic_quotes_gpc=off
满足上面的条件的时候php就是把%00当成结束符，后面的数据直接忽略
save_path可控，因此00截断即可。利用save_path=../upload/11.php%00
![](https://i.loli.net/2019/07/11/5d26c459c992b49149.png)
现在貌似成功不了
## Pass-12（同上%00截断）
```php
$is_upload = false;
$msg = null;
if(isset($_POST['submit'])){
    $ext_arr = array('jpg','png','gif');
    $file_ext = substr($_FILES['upload_file']['name'],strrpos($_FILES['upload_file']['name'],".")+1);
    if(in_array($file_ext,$ext_arr)){
        $temp_file = $_FILES['upload_file']['tmp_name'];
        $img_path = $_POST['save_path']."/".rand(10, 99).date("YmdHis").".".$file_ext;

        if(move_uploaded_file($temp_file,$img_path)){
            $is_upload = true;
        } else {
            $msg = "上传失败";
        }
    } else {
        $msg = "只允许上传.jpg|.png|.gif类型文件！";
    }
}
```
**Pass-11与Pass-12代码对比**
![](https://i.loli.net/2019/07/13/5d294778b4d2086258.png)
这题跟上一题代码唯一的不同就是`save_path` 从 GET 变成了 POST, 此时不能再使用 %00 截断, 原因是 %00 截断在 GET 中被 url 解码之后是空字符, 但是在 POST 中 %00 不会被 url 解码, 所以只能通过 burpsuite 修改 hex 值为 00 进行截断.
在upload后面加上12.php+(添加+是为了方便改hex值)
![](https://i.loli.net/2019/07/13/5d294eff861fc79140.png)
这里把 2b('+'的 hex) 修改成 00
![](https://i.loli.net/2019/07/13/5d294f73f2a9189616.png)
或者直接在upload后面加上`12.php%00`，然后选中%00实施`URL-decode`
![](https://i.loli.net/2019/07/13/5d29606da9cc397060.png)
由于环境没配好，所以并没有成功，但是原理是这样的
网上找的别人成功的图

![](https://i.loli.net/2019/07/13/5d29560c6acab89069.png)
`$img_path = $_POST['save_path']."/".rand(10,99).date("YmdHis").".".$file_ext;` 
其中`"/".rand(10, 99).date("YmdHis").".".$file_ext;`会被截断
## Pass-13（图片马）
```php
function getReailFileType($filename){
    $file = fopen($filename, "rb");
    $bin = fread($file, 2); //只读2字节
    fclose($file);
    $strInfo = @unpack("C2chars", $bin);    
    $typeCode = intval($strInfo['chars1'].$strInfo['chars2']);    
    $fileType = '';    
    switch($typeCode){      
        case 255216:            
            $fileType = 'jpg';
            break;
        case 13780:            
            $fileType = 'png';
            break;        
        case 7173:            
            $fileType = 'gif';
            break;
        default:            
            $fileType = 'unknown';
        }    
        return $fileType;
}

$is_upload = false;
$msg = null;
if(isset($_POST['submit'])){
    $temp_file = $_FILES['upload_file']['tmp_name'];
    $file_type = getReailFileType($temp_file);

    if($file_type == 'unknown'){
        $msg = "文件未知，上传失败！";
    }else{
        $img_path = UPLOAD_PATH."/".rand(10, 99).date("YmdHis").".".$file_type;
        if(move_uploaded_file($temp_file,$img_path)){
            $is_upload = true;
        } else {
            $msg = "上传出错！";
        }
    }
}
```
这关主要是利用了一个判断文件的函数
`fopen`打开文件数据流
`fread`读取2个字节
用`unpack`对二进制数据进行解包，`C`代表无符号字节型，后面的2代表个数，也可以用`*`代替
把两个`chars`连接起来再用`intval`转换为整数型
做一个图片马就可以绕过
**图片马制作**
**方法一：**
我们需要一张图片`1.jpg `和一句话木马写好的php文件`1.php` 
将1.jpg和1.php放到同一目录下,
然后在该目录下用cmd执行命令`copy 1.jpg/b + 1.php/a 2.jpg `
新生成的2.jpg就是我们制作好的图片马
![](https://i.loli.net/2019/07/13/5d295bd449c1993400.png)
**方法二**：
HxD打开一张图片`1.jpg`
![](https://i.loli.net/2019/07/13/5d295be59cb6829409.png)
在图片末尾加上一句话木马，保存得到的图片就是图片马了
![](https://i.loli.net/2019/07/13/5d295c7214fb631104.png)
## Pass-14（突破exif_imagetype）
```php
function isImage($filename){
    $types = '.jpeg|.png|.gif';
    if(file_exists($filename)){
        $info = getimagesize($filename);
        $ext = image_type_to_extension($info[2]);
        if(stripos($types,$ext)){
            return $ext;
        }else{
            return false;
        }
    }else{
        return false;
    }
}

$is_upload = false;
$msg = null;
if(isset($_POST['submit'])){
    $temp_file = $_FILES['upload_file']['tmp_name'];
    $res = isImage($temp_file);
    if(!$res){
        $msg = "文件未知，上传失败！";
    }else{
        $img_path = UPLOAD_PATH."/".rand(10, 99).date("YmdHis").$res;
        if(move_uploaded_file($temp_file,$img_path)){
            $is_upload = true;
        } else {
            $msg = "上传出错！";
        }
    }
}
```
getimagesize判断图片内置函数,所以一样可以使用图片马绕过.可以参考官方文档http://php.net/manual/zh/function.getimagesize.php

image_type_to_extension取文件后缀的内置函数http://php.net/manual/zh/function.image-type-to-extension.php
## Pass-15（突破exif_imagetype）
```php
function isImage($filename){
    //需要开启php_exif模块
    $image_type = exif_imagetype($filename);
    switch ($image_type) {
        case IMAGETYPE_GIF:
            return "gif";
            break;
        case IMAGETYPE_JPEG:
            return "jpg";
            break;
        case IMAGETYPE_PNG:
            return "png";
            break;    
        default:
            return false;
            break;
    }
}

$is_upload = false;
$msg = null;
if(isset($_POST['submit'])){
    $temp_file = $_FILES['upload_file']['tmp_name'];
    $res = isImage($temp_file);
    if(!$res){
        $msg = "文件未知，上传失败！";
    }else{
        $img_path = UPLOAD_PATH."/".rand(10, 99).date("YmdHis").".".$res;
        if(move_uploaded_file($temp_file,$img_path)){
            $is_upload = true;
        } else {
            $msg = "上传出错！";
        }
    }
}
```
exif_imagetype 也是判断图片的类型的，所以一样可以使用图片马绕过.具体可以看官方文档http://php.net/manual/zh/function.exif-imagetype.php
## Pass-16（图片二次渲染）
```php
$is_upload = false;
$msg = null;
if (isset($_POST['submit'])){
    // 获得上传文件的基本信息，文件名，类型，大小，临时文件路径
    $filename = $_FILES['upload_file']['name'];
    $filetype = $_FILES['upload_file']['type'];
    $tmpname = $_FILES['upload_file']['tmp_name'];

    $target_path=UPLOAD_PATH.basename($filename);

    // 获得上传文件的扩展名
    $fileext= substr(strrchr($filename,"."),1);

    //判断文件后缀与类型，合法才进行上传操作
    if(($fileext == "jpg") && ($filetype=="image/jpeg")){
        if(move_uploaded_file($tmpname,$target_path))
        {
            //使用上传的图片生成新的图片
            $im = imagecreatefromjpeg($target_path);

            if($im == false){
                $msg = "该文件不是jpg格式的图片！";
                @unlink($target_path);
            }else{
                //给新图片指定文件名
                srand(time());
                $newfilename = strval(rand()).".jpg";
                $newimagepath = UPLOAD_PATH.$newfilename;
                imagejpeg($im,$newimagepath);
                //显示二次渲染后的图片（使用用户上传图片生成的新图片）
                $img_path = UPLOAD_PATH.$newfilename;
                @unlink($target_path);
                $is_upload = true;
            }
        } else {
            $msg = "上传出错！";
        }

```
三段代差不多，取其中的一段来分析`$target_path`已经用了`basename`来限制你修改目录绕过的方法了。
`$fileext`以点为界，取点后面的字符作为后缀名。

变量`$filetype`获取的值取判断`content-type`是否符合条件

`imagecreatefromjpeg`判断是否为图片资源，具体可以看官方文档http://php.net/manual/zh/function.imagecreatefromjpeg.php

`srand(time())`看官方文档http://php.net/manual/zh/function.srand.php，和下面的[strval](http://www.php.net/manual/zh/function.strval.php)`(rand())` 相结合，随机数发生器的初始化，为了让上传的随机文件名不重复。
`imagecreatefromjpeg`二次渲染它相当于是把原本属于图像数据的部分抓了出来，再用自己的API 或函数进行重新渲染在这个过程中非图像数据的部分直接就隔离开了。

详细绕过方法https://secgeek.net/bookfresh-vulnerability/
文章中提供的图片马`POC.gif`(在上述链接文章的最后面有)
![POC.gif](https://i.loli.net/2019/07/14/5d2aa57e5bb1e20848.gif)
视频绕过演示（翻墙才能看）：https://youtu.be/z-_5a1wyPF0

## Pass-17（条件竞争，大批量发包绕过）
```php
$is_upload = false;
$msg = null;

if(isset($_POST['submit'])){
    $ext_arr = array('jpg','png','gif');
    $file_name = $_FILES['upload_file']['name'];
    $temp_file = $_FILES['upload_file']['tmp_name'];
    $file_ext = substr($file_name,strrpos($file_name,".")+1);
    $upload_file = UPLOAD_PATH . '/' . $file_name;

    if(move_uploaded_file($temp_file, $upload_file)){
        if(in_array($file_ext,$ext_arr)){
             $img_path = UPLOAD_PATH . '/'. rand(10, 99).date("YmdHis").".".$file_ext;
             rename($upload_file, $img_path);
             $is_upload = true;
        }else{
            $msg = "只允许上传.jpg|.png|.gif类型文件！";
            unlink($upload_file);
        }
    }else{
        $msg = '上传出错！';
    }
}
```
通过白名单检测后缀名，符合就rename改名，不符合就unlink删除文件。


参考：
[Upload-labs&amp;Upload Bypass Summarize](https://cloud.tencent.com/developer/article/1377897)
[Upload-Labs上传绕过](http://www.bubuko.com/infodetail-2944836.html)
[upload-labs刷关记录](https://blog.csdn.net/u011377996/article/details/86776198)
[upload-labs WriteUp](http://www.she1don.cn/index.php/archives/38.html)
[图片木马制作大法](http://gv7.me/articles/2017/picture-trojan-horse-making-method/)
[upload-labs 通关笔记](https://getpass.cn/2018/11/24/upload-labs/)