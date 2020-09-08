---
title: Cobalt Strike 学习记录
author: 简文涛
categories:
  - 工具
tags:
  - Cobalt Strike
comments: true
top: false
img: 'https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200802181358.jpg'
abbrlink: 24047
date: 2020-07-26 10:39:50
updated:
summary:
permalink:
---

Cobalt Strike（简称“CS”）是一款团队作战渗透测试神器，分为客户端和服务端，一个服务端可以对应多个客户端，一个客户端可以连接多个服务端，集成了端口转发、服务扫描，自动化溢出，多模式端口监听，exe、powershell木马生成等。主要用来后期持久渗透、横向移动、流量隐藏、数据窃取的工具。

## 安装

Cobalt Strike 分为客户端和服务端。服务端只能运行在Linux系统中，可搭建在VPS上；客户端在Windows、Linux、Mac下都可以运行 (需要配置好Java环境)。

Cobalt Strike 4 破解版下载地址：[CobaltStrike.zip](https://jwt1399.lanzous.com/iTvBaf82p1g)

### 文件结构

```bash
$:/CobaltStrike4# tree
.
├── agscript
├── c2lint
├── Cobalt Strike 4.exe
├── cobaltstrike.auth
├── CobaltstrikeCN.jar	# 汉化包
├── cobaltstrike.jar	# 客户端程序
├── cobaltstrike.store
├── icon.ico
├── icon.jpg
├── peclone
├── start.bat
├── start.sh
├── teamserver	# 服务端程序
├── teamserver.bat
└── third-party	# 第三方工具
    ├── README.winvnc.txt
    ├── winvnc.x64.dll
    └── winvnc.x86.dll

1 directory, 17 files
```

### 服务端安装

下载好**CobaltStrike.zip**解压，将文件夹放入Linux机器中（我放在了 `opt` 目录下），然后运行：

```bash
cd /opt/CobaltStrike4

chmod +x teamserver

sudo ./teamserver <host> <password>   


# host：服务器外网IP
# password：客户端连接需要的密码
```

![服务端操作](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200802155722.png)

### 客户端安装

将上面同样的文件夹在Windows上面放一份，双击运行文件夹中的 `Cobalt Strike 4.exe` ，这个exe是我自己制作的启动器，如果你下载的其他安装包，你可以点击文件夹中的 `start.bat` 进行启动。

![客户端连接](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200802155728.png)

 如果这是您与此团队服务器的第一次连接，Cobalt Strike将询问您是否识别此团队服务器的SHA256哈希值。如果您这样做，请按OK，Cobalt Strike客户端将连接到服务器。Cobalt Strike还会记住这个SHA256哈希，以便将来连接。您可以通过Cobalt Strike – >Preferences – > Fingerprints管理这些哈希值。

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200802155730.png)

![登录成功界面](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200802155734.png)

### 扩展知识：启动器制作

每次启动`Cobalt Strike`都得通过`start.bat` 进行启动，但是追求完美的简简是忍受不了的，那么接下来就来制作一个`exe`启动器

**修改前后对比：**

| 修改前                                                       | 修改后                                                       |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200802164722.png) | ![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200802164725.png) |

制作需要用到 **Bat_To_Exe_Converter** 这个工具。下载地址：[Bat_To_Exe_Converter.zip](https://jwt1399.lanzous.com/iCpJUf85wdi)

1.选择新建或者直接打开start.bat，主要是将启动的代码导入

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200802170438.png)

2.在右侧设置图标(ico格式)，密码，EXE格式等属性。这里我添加了图标并把EXE格式设置为64位隐形

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200802170548.png)

**EXE格式**控制windows的黑窗口是否弹出，隐形为不弹出，可见为弹出；打包压缩，会对我们生成的exe进行压缩。

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200802170535.png)

还可以设置版本信息，这里我没有设置

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200802170532.png)

3.设置好后，点击转换按钮，选择存放的目录就可以啦

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200802170521.png)

## 快捷工具条

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200804182433.png)

## Listeners和Payload

**1.CS创建Listener**

> Listner(监听器)：专门用于对其他对象身上发生的事件或状态改变进行监听和相应处理的对象，当被监视的对象发生情况时，立即采取相应的行动。

选择 `Cobalt Stike` → `Listeners` → `Add` 创建一个监听器

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200804163614.png)

**2.生成Payload文件**

> Payload在渗透测试之中大家可以简单地理解为一段漏洞利用/植入后门的代码或程序。

选择`攻击` -> `生成后门` -> `Windows Executable(S)`，监听器选择刚创建的 `Listener`，输出选择`Windows EXE`

![](../images/%E5%86%85%E7%BD%91%E6%B8%97%E9%80%8F%E9%9D%B6%E6%9C%BA%EF%BC%9AVulnStack1/image-20200804165256799.png)

**3.蚁剑上传后门**

先关闭受害机防火墙

```bash
netsh advfirewall set allprofiles state off
```

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200804170220.png)

再上传生成的exe

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200804170222.png)

**4.执行exe获得shell**
直接输入exe 文件名执行 exe

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200804170206.png)

获得Cobalt Strike 的 shell

| 主机上线                                                     | 主机上线                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200804170514.png) | ![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200804171118.png) |

拿到 `shell` 第一步，调低心跳值，默认心跳为 `60s`，执行命令的响应很慢，进入 `beacon` 执行 `sleep 5` 或者右键主机选择 `会话` →`Sleep`进行设置

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200804172330.png)

**参考：**

- https://www.cnblogs.com/ichunqiu/p/11934077.html

## beacon基本命令

![基本命令](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200804182137.png)

## 与Metasploit联动

待更。。。

## 文件/进程管理

 [文件/进程管理与键盘记录](https://www.cnblogs.com/ichunqiu/p/12034201.html)

## 安装扩展

选择菜单栏的`Cobalt Strike`-->`脚本管理器`，点击`load`，然后选择  `cna` 扩展文件即可，旁边的unload为去除该扩展，reload为重新加载该扩展。

### elevate.cna

脚本功能：增加五种提权方式
脚本位置：在Elevate中
地址： https://github.com/rsmudge/ElevateKit

### ProcessTree.cna

脚本功能：让ps命令可以显示父子关系并显示颜色
脚本位置：命令行中
地址： https://github.com/ars3n11/Aggressor-Scripts



参考：[使用Aggressor脚本雕饰Cobalt Strike](https://mp.weixin.qq.com/s/CEI1XYkq2PZmYsP0DRU7jg)

## 中文用户手册

CobaltStrike4.0用户手册_中文翻译：[蓝奏云](https://jwt1399.lanzous.com/iuF2Efajjoh)

## 赞助💰

如果你觉得对你有帮助，你可以请我喝一杯冰可乐！嘻嘻🤭

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