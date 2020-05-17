---
title: 一文学会Docker使用(更新中)
author: 简简
categories:
  - Web
tags:
  - Docker
comments: true
top: false
summary: Docker可以让开发者打包他们的应用以及依赖包到一个轻量级、可移植的容器中，然后发布到任何流行的Linux 机器上，也可以实现虚拟化。
abbrlink: 39812
img: 'https://i.loli.net/2020/04/29/TBYkqrKVIEFalQ8.jpg'
date: 2020-04-29 20:18:17
updated:
permalink:
---

## 前言

Docker我以前学过，但是太久没用，忘得差不多了。。。这几天准备把写好的Django应用通过Docker部署到服务器，所以重新复习了Docker，于是写了此文，希望对想使用Docker的你有所帮助。

## 初识Docker

> Docker 是一个开源的应用容器引擎，Docker 可以让开发者打包他们的应用以及依赖包到一个可移植的容器中，然后发布到任何流行的 Linux 机器上，也可以实现虚拟化。

Docker 的整个生命周期由三部分组成：镜像（image）+ 容器（container）+ 仓库（repository）

**镜像**是一个只读的模板，它包括了运行容器所需的数据。镜像可以包含一个完整的 Linux 操作环境，里面仅安装了 Python 或者其他用户需要的程序。

**容器**是由镜像创建出来的实例，类似虚拟机，里面可以运行特定的应用，并且容器与容器是相互隔离的。

**仓库**概念与 Git 和 Github 类似，如果你用过它们就非常容易理解。Docker 使用的默认仓库是由官方维护的 Docker hub 公共仓库，从中上传、拉取的操作类似 Git。

## 安装Docker

```bash
$ curl -fsSL get.docker.com -o get-docker.sh
$ sudo sh get-docker.sh --mirror Aliyun
```

**检验Docker是否安装成功**

```python
$ docker run hello-world

Unable to find image 'hello-world:latest' locally
......
latest: Pulling from library/hello-world
1b930d010525: Pull complete 
......
Hello from Docker!
This message shows that your installation appears to be working correctly.
......
```

[官方文档](https://docs.docker.com/engine/install/ubuntu/)

## Docker命令

### 查看本地已有镜像

```bash
$ docker images

REPOSITORY      TAG        IMAGE ID           CREATED           SIZE
hello-world     latest     fce289e99eb9       9 months ago      1.84kB

# 镜像名           版本        ID 号             创建时间           大小
```

### 查看本地已有的容器

```bash
$ docker ps -a
```

### 删除镜像

```bash
$ docker rmi [images ID]  
```

### 删除容器

```bash
$ docker container rm [container ID]  
```

### 停止容器

```bash
$ docker container stop [container ID] 
```

### 启动容器

```bash
$ docker container start [container ID]  
```

## Dockerfile

Docker 允许通过文本格式的配置文件来构建镜像，默认名称为 **Dockerfile**



## Docker compose

> 在线上环境中，通常不会将项目的所有组件放到同一个容器中；更好的做法是**把每个独立的功能装进单独的容器**，这样方便复用。比如将 Django 代码放到容器A，将 Mysql 数据库放到容器B，以此类推。

因此同一个服务器上有可能会运行着多个容器，如果每次都靠一条条指令去启动，未免也太繁琐了。 `Docker-compose` 就是解决这个问题的，它用来编排多个容器，将启动容器的命令统一写到 `docker-compose.yml` 文件中，以后每次启动这一组容器时，只需要 `docker-compose up` 就可以了。

## Ubantu安装Docker compose

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
```

### Docker compose命令

### 启动容器服务

```bash
$ docker-compose up

#Ctrl + C 即可停止开发服务器运行
```

### 删除容器

停止服务器后实际上容器还存在，只是停止运行了而已，输入下面命令可以删除容器

```bash
$ docker-compose down
```

### 后台运行容器

```bash
$ docker-compose up -d
```

### 重新构建镜像

```bash
$ docker-compose build
```

### 启动和停止已有的容器：

```bash
$ docker-compose start
$ docker-compose stop
```

### 查看容器日志

```bash
$ docker-compose logs
```