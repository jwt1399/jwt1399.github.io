---
title: 基于Django+Simpleui的博客系统
author: 简简
categories:
  - Python
tags:
  - Django
comments: true
top: false
summary: '学了一段时间Django了,于是自己尝试了哈用Django来写一个动态博客系统，后台是SimpleUi框架。'
abbrlink: 31757
img: 'https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200824182002.png'
date: 2020-04-16 13:58:17
updated:
permalink:
---
## 前言

打算密码学项目改用Django来完成，所以最近一段时间都在学习Django,学了也有一段时间了，想要找个练手的项目，网上大部分关于Django练手的项目都是写博客系统，刚好又看到国光大佬用Django改写了他的博客，于是自己也来实现一哈。

## 基于Django+Simpleui的博客系统

项目地址：https://github.com/jwt1399/Django_Blog

前端：[hexo-theme-matery](https://github.com/blinkfox/hexo-theme-matery)，就是我[博客](https://jwt1399.top)的hexo主题

后台：[SimpleUi](https://simpleui.88cto.com/simpleui)

Django：[Django 3.0.5](https://www.djangoproject.com/)       

Python：python3.7

👇 👇 👇 👇 👇 👇 👇 👇 👇

👇部署方法在文章最后 👇

 👇 👇 👇 👇 👇 👇 👇 👇👇

## 前端页面展示

### 首页

![](https://i.loli.net/2020/04/30/v81iAjyXfaOTDEM.png)

![](https://i.loli.net/2020/04/30/9PBT6RwqzvruUAL.png)

### 文章详情

![](https://i.loli.net/2020/04/30/oZyrvMUiu1fQctK.png)

### 评论

![](https://i.loli.net/2020/04/30/S4Q1pJRoieqyOsU.png)

### 友链

![](https://i.loli.net/2020/04/30/52SQMVl4IwUtDcT.png)

### 文章分类详情页

![](https://i.loli.net/2020/04/30/ubRrh4qinAV3ogL.png)

### 归类页

![](https://i.loli.net/2020/04/30/pEIf5lxVhwMiFDA.png)

### 关于页

![](https://i.loli.net/2020/04/30/vXOc26i3gYtrITo.png)

## 后台页面展示

### 后台登录页

![](https://i.loli.net/2020/04/30/FsnOIrijYU5cCmy.png)

### 后台首页

![](https://i.loli.net/2020/04/30/96yhb4T3nNKsR5G.png)

### 文章管理

![](https://i.loli.net/2020/04/30/UR6I2pTXleYy9Sf.png)

### 分类

![](https://i.loli.net/2020/04/30/HJwTCU42liPXZRj.png)

### 友链

![](https://i.loli.net/2020/04/30/rDlRJpN2yALYz3M.png)

### 关于设置

![](https://i.loli.net/2020/04/30/UtfSdoZbGvOwAhn.png)

### 网站设置

![](https://i.loli.net/2020/04/30/VAJtn5DxIYjiNH6.png)

## 部署方法  👇

### 安装Docker

[官方文档](https://docs.docker.com/engine/install/ubuntu/)

```bash
$ curl -fsSL get.docker.com -o get-docker.sh
$ sudo sh get-docker.sh --mirror Aliyun
```

**检验Docker是否安装成功**

```python
$ docker run hello-world

Unable to find image 'hello-world:latest' locally
...
latest: Pulling from library/hello-world
1b930d010525: Pull complete 
...

Hello from Docker!
This message shows that your installation appears to be working correctly.
...
```

### 安装Docker compose

[官方文档 ](https://docs.docker.com/compose/install/) | [查看最新版本](https://github.com/docker/compose/releases)

根据新版本的变化自行调整下面命令中的版本来安装：

```bash
# 下载docker-compose
$ sudo curl -L "https://github.com/docker/compose/releases/download/1.25.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 给docker-compose执行权限
$ chmod +x /usr/local/bin/docker-compose

# 查看docker compose版本，测试是否安装成功
$ docker-compose  version
docker-compose version 1.25.5, build 8a1c60f6
docker-py version: 4.1.0
CPython version: 3.7.5
OpenSSL version: OpenSSL 1.1.0l  10 Sep 2019
```

### 安装Python3

```bash
$ sudo apt install python3
$ sudo apt-get install python3-pip
$ pip3 install --upgrade pip
```

### 克隆项目

```bash
$ git clone https://github.com/jwt1399/Django_Blog.git
```

## 一键部署

```bash
$ docker-compose up #构建镜像并启动容器
```


## 赞助💰

如果你觉得对你有帮助，你可以赞助我一杯冰可乐吧！

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
