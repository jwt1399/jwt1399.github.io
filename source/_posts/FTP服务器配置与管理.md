---
title: FTP服务器配置与管理
author: 简文涛
categories:
  - 信息安全
tags:
  - FTP服务器
  - Windows服务器配置与管理
comments: true
top: false
img: 'https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200824183541.jpg'
abbrlink: 11968
date: 2020-03-21 16:33:35
updated:
summary:
---

## 一、 **实验环境**

1. 操作系统：Windows系统、阿里云Windows Server 2016
2. 实验设备：PC机
## 二、 实验内容

任务 1：FTP服务器的安装
任务 2：创建FTP站点
任务 3：配置客户端访问FTP站点
任务 4：FTP访问配置

## 三、 实验步骤与结果

### 1. FTP服务器的安装

i.       打开【服务器管理器】，单击【添加角色和功能】按钮，进入【添加角色和功能向导】。
ii.      单击【下一步】按钮，选择【基于角色或基于功能的安装单击【下一步】按钮，选择【从服务器池中选择服务器】，安装程序会自动检测与显示这台计算机采用静态IP地址设置的网络连接。
iii.      单击【下一步】，在【服务器角色】中，选择【Web服务器（IIS）】, 自动弹出【添加Web服务器（IIS）所需的功能】对话框，单击【添加功能】按钮。
iv.     单击【下一步】按钮，选择需要添加的功能，如无特殊需求，一般默认即可。
v.      单击【下一步】按钮，在【服务器角色】中，勾选【FTP服务器】。
<img src="https://i.loli.net/2020/03/21/StgI9R2dDKpVmNj.png"/>
vi.      单击【下一步】按钮，在【确认】对话框中，确认所需安装的角色、角色服务或功能，单击【安装】。安装完成后，单击【关闭】按钮完成安装。

<img src="https://i.loli.net/2020/03/21/tUmu4sh2GeZI3LQ.png" />

### 2. 创建FTP站点

i.      打开【服务器管理器】，单击【工具】，选择【Internet信息服务（IIS）管理器】。
ii.      右键单击【网站】，选择【添加FTP站点】。
iii.      在【添加FTP站点】对话框中，输入FTP站点的名称，设置该站点所提供文件的本地所在位置，单击【下一步】按钮。
<img src="https://i.loli.net/2020/03/21/twbD613MfmJsC5j.png"/>
iv.      设置FTP站点的绑定IP地址和端口号，在SLL选项中，选择【无SLL】（FTP的数据传输是明文传输，如果需要在安全性较高的环境下使用，可以选择【允许SLL】和【需要SSL】），单击【下一步】按钮。
<img src="https://i.loli.net/2020/03/21/NB7KAgzE9jmwYvS.png"/>
v.      设置FTP站点的身份验证、授权和权限。在身份验证中，勾选【基本】。在授权中，选择【所有用户】均可访问。在权限中，勾选【读取】和【写入】两个权限，单击【完成】按钮。
<img src="https://i.loli.net/2020/03/21/vCBoniJNufUlZcH.png"/>
vi.      FTP站点创建成功。
<img src="https://i.loli.net/2020/03/21/K81px7b6dCh5OML.png"/>

在浏览器或者在此电脑地址框中输入`ftp://127.0.0.1`都可以成功访问FTP服务器

![](https://i.loli.net/2020/03/22/noblh9EIYPGTRKO.png)

![](https://i.loli.net/2020/03/22/HojKXOGYDWpfxzF.png)

我们发现我的FTP服务器里面什么都没有，我们可以向我设定的默认FTP物理路径`C:\FTP`中添加文件，例如添加一个logo.png
![](https://i.loli.net/2020/03/22/J2NbdyCfWnVvQkA.png)
然后我们就可以访问到添加的图片了

![](https://i.loli.net/2020/03/22/eYNclhtw6LXviua.png)

### 3. 配置客户端访问FTP站点

> 上面我们已经实现了在服务器本地访问FTP,现在我们来实现在外网条件下来访问FTP服务器

i. 设置安全组及防火墙，您需要在实例安全组的入方向添加一条放行FTP端口的安全组规则
<img src="https://i.loli.net/2020/03/22/JY9TtZKg13hqXE2.png"/>
配置之后通过浏览器无法访问FTP服务器,查询之后发现，外网无法连接和访问Windows实例搭建的FTP，这种情况可能是由于以下两种原因导致的。

- [安全组拦截外网访问](https://help.aliyun.com/knowledge_detail/40914.html#wWHYT)
- [防火墙拦截FTP进程](https://help.aliyun.com/knowledge_detail/40914.html#aWGNP)

如果搭建的FTP服务在外网无法连接和访问，请参考如下文档进行排查处理。 [在外网无法连接和访问Windows实例中的FTP服务](https://help.aliyun.com/document_detail/40914.html)

**解决方法：**在 添加安全组规则 对话框，协议类型 选择 `全部`，授权对象 填写 `0.0.0.0/0`
<img src="https://i.loli.net/2020/03/22/G1mUhDE4nFHwtI9.png" />
然后就可以通过浏览器正常访问FTP服务器了
<img src="https://i.loli.net/2020/03/22/fwEoInbaVYp1Q3A.png"/>
我通过计算机的地址栏访问，又报如下错误
![](https://i.loli.net/2020/03/22/xlHW5CJMyFGqiOR.png)
解决方法：打开IE 浏览器 -- 工具 -- Internet 选项 -- 高级 -- 设置 -- 浏览 -- 把 使用被动FTP （用于防火墙和 DSL 调制解调器的兼容） 前面的勾去掉.
修改之后就可以成功访问了
![](https://i.loli.net/2020/03/22/TzponZCfH9l3qVr.png)



###  4. FTP访问配置

#### 4.1 IP地址限制

打开FTP IP地址限制和域限制
![](https://i.loli.net/2020/03/24/k4sMOrf6LTbqhwS.png)


点击添加拒绝条目，输入要限定的IP地址

![](https://i.loli.net/2020/03/24/A9P5e3rQbw4BpSZ.png)
客户端再访问FTP就弹出登录框，无法再访问FTP,删除拒绝IP又可以继续访问FTP

<img src="https://i.loli.net/2020/03/24/5UnqGgCdVcKZh4E.png"/>

#### 4.2 身份验证

打开FTP身份验证

![](https://i.loli.net/2020/03/24/xinPTYCMsdNgu3Z.png)

匿名身份验证开启可直接访问FTP,基本身份验证开启需要输入管理员用户名和密码

![](https://i.loli.net/2020/03/24/pseAuZgRatKbUjO.png)

实际工作中一般不会使用管理账号来访问FTP,因此我们需要添加一些专门用于FTP访问的账号，打开计算机管理在本地用户和组中新建用户

<img src="https://i.loli.net/2020/03/24/PqvuBgsOEbxMAFV.png"/>

设置用户名和密码

<img src="https://i.loli.net/2020/03/24/BgDoX1PispKeqwE.png"/>

设置新建用户所在组对FTP的访问权限

<img src="https://i.loli.net/2020/03/24/9zBnQdYilA3aGq5.png"/>

在客户端输入新建的用户的信息就可以正常访问FTP了

<img src="https://i.loli.net/2020/03/24/82qocGQStIeuzFw.png"/>

#### 4.3 授权规则

打开FTP授权规则，点击添加允许规则，可以设定授权规则
例如：我们可以设匿名用户只能读取，指定用户可以读取和写入等等操作

<img src="https://i.loli.net/2020/03/24/gG6TvA8xNCPzwmn.png"/>

#### 4.4 请求筛选

打开FTP请求筛选，可以设置拒绝放入或者上传的文件扩展名等等操作

<img src="https://i.loli.net/2020/03/24/7gWYcTVIwOznmha.png"/>



​          
