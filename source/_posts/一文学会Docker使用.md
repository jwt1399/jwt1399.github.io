---
title: 一文学会Docker使用
author: 简简
categories:
  - 工具
tags:
  - Docker
comments: true
top: false
summary: Docker可以让开发者打包他们的应用以及依赖包到一个轻量级、可移植的容器中，然后发布到任何流行的Linux 机器上，也可以实现虚拟化。
abbrlink: 39812
img: 'https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200824181722.jpg'
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

linux下docker默认的存储目录是`/var/lib/docker`

存放元数据(项目源码)`/var/lib/docker/overlay2`

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

### 运行容器

```bash
$ docker run [options] 镜像名 /bin/bash
```

- **-i**: 交互式操作。
- **-t**: 终端。
- **-d:**让容器在后台运行。
- **-P:**将容器内部使用的网络端口映射到我们使用的主机上。
- **-p:**指定端口映射，格式为：主机(宿主)端口:容器端口

[docker run 命令](https://www.runoob.com/docker/docker-run-command.html)

例如：

```bash
docker run -d -p 8000:80 --name 容器名 镜像名 #部署一个容器，并将80端口映射到宿主机的8000端口上

docker run -it ubuntu /bin/bash #使用 ubuntu 镜像启动一个容器，参数为以命令行模式进入该容器
```

## Dockerfile

> Docker 允许通过文本格式的配置文件来构建镜像，默认名称为 **Dockerfile**

### Dockerfile 的组成部分

| 部分               | 命令                                                     |
| ------------------ | -------------------------------------------------------- |
| 基础镜像信息       | FROM                                                     |
| 维护者信息         | MAINTAINER                                               |
| 镜像操作指令       | RUN、COPY、ADD、EXPOSE、WORKDIR、ONBUILD、USER、VOLUME等 |
| 容器启动时执行指令 | CMD、ENTRYPOINT                                          |

### FROM：指定基础镜像

```dockerfile
# 指定基础镜像
FROM <image>

# 指定一个tag版本的基础镜像
FROM <image>:<tag>                 

例如：FROM ubuntu:18.04
```

### MAINTAINER:声明作者

```dockerfile
MAINTAINER [name] [email]

例如 MAINTAINER jwt "jianwentaook@163.com"
```

### RUN：执行命令

```dockerfile
RUN <command> 
# shell模式，以#/bin/sh -c command 形式执行, 如RUN echo hello                                                                                 
RUN ["executable", "param1", "param2" ... ] 
# exec模式，指定其他形式的shell来运行指令 ,如RUN ["/bin/bash" ,“-c”,“echo  hello" ]

例如：RUN apt-get update && mkdir /code  
```

### COPY：复制文件\目录

```dockerfile
COPY <src> <dest>

例如：COPY index.html /test/
```

### ADD：高级复制文件

```dockerfile
ADD [--chown=<user>:<group>] <src>... <dest>
ADD [--chown=<user>:<group>] ["<src>",... "<dest>"]

例如：ADD index.html /var/www/html
例如：ADD /var/share/1.txt /var/www/html
```

### ENV：设置环境变量

```dockerfile
ENV <key> <value>
ENV <key>=<value> ...

例如：ENV JAVA_HOME /usr/local/jdk1.8.0_45
例如：ENV PYTHONUNBUFFERED 1
```

### VOLUME：定义匿名卷

```dockerfile
VOLUME ["/data"]

例如：VOLUME /myvol
例如：VOLUME ["/var/www", "/var/log/apache2", "/etc/apache2"]
```

### EXPOSE：暴露端口

```dockerfile
EXPOSE <port> [<port>/<protocol>...]

例如：EXPOSE 80 443
例如：EXPOSE 80/tcp
```

### WORKDIR：指定工作目录

```dockerfile
WORKDIR /path

例如：WORKDIR /data
```

### USER：指定当前用户

```dockerfile
USER <user>[:<group>]
USER <UID>[:<GID>]

例如：USER jwt
```

### CMD：容器启动命令

```dockerfile
CMD ["executable","param1","param2"] 
CMD ["param1","param2"] 
CMD command param1 param2 

例如：CMD ["/usr/bin/wc","--help"]
例如：CMD echo "This is a test." | wc -
```

### ENTRYPOINT：入口点

```
ENTRYPOINT ["executable", "param1", "param2"]
ENTRYPOINT command param1 param2

例如：ENTRYPOINT ["top", "-b"]
例如：ENTRYPOINT ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]
```

### 实例

```dockerfile
# 从仓库拉取 带有 python 3.7 的 Linux 环境
FROM python:3.7

# 设置 python 环境变量
ENV PYTHONUNBUFFERED 1

# 创建 code 文件夹并将其设置为工作目录
RUN mkdir /code
WORKDIR /code
# 更新 pip
RUN pip install pip -U
# 将 requirements.txt 复制到容器的 code 目录
ADD requirements.txt /code/
# 安装库
RUN pip install -r requirements.txt
# 将当前目录复制到容器的 code 目录
ADD . /code/
```



## Docker compose

> 在线上环境中，通常不会将项目的所有组件放到同一个容器中；更好的做法是**把每个独立的功能装进单独的容器**，这样方便复用。比如将 Django 代码放到容器A，将 Mysql 数据库放到容器B，以此类推。

因此同一个服务器上有可能会运行着多个容器，如果每次都靠一条条指令去启动，未免也太繁琐了。 `Docker-compose` 就是解决这个问题的，它用来编排多个容器，将启动容器的命令统一写到 `docker-compose.yml` 文件中，以后每次启动这一组容器时，只需要 `docker-compose up` 就可以了。

### Ubantu安装Docker compose

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

### 实例

在项目根目录创建 **docker-compose.yml** 并写入：

```yml
version: "3"
services:
  app:
    restart: always
    build: .  # '点'代表当前目录
    command: "python3 manage.py runserver 0.0.0.0:8000"
    volumes:
      - .:/code
    ports:
      - "8000:8000"
```

让我们来分解一下其中的各项含义。

`version` 代表 docker-compose.yml 的版本，目前最新版为 3，不需要改动它。

接着定义了一个名叫 `app` 的容器。后面的内容都是 `app` 容器的相关配置：

- `restart` ：除正常工作外，容器会在任何时候重启，比如遭遇 bug、进程崩溃、docker 重启等情况。
- `build` ：指定一个包含 **Dockerfile** 的路径，并通过此 Dockerfile 来构建容器镜像。注意那个 **"."** ,代表当前目录。
- `command` ：容器运行时需要执行的命令。这里就是我们很熟悉的运行开发服务器了。
- `volumes` ：**卷，这是个很重要的概念。**前面说过容器是和宿主机完全隔离的，但是有些时候又需要将其连通；比如我们开发的 Django 项目代码常常会更新，并且更新时还依赖如 Git 之类的程序，在容器里操作就显得不太方便。所以就有**卷**，它定义了宿主机和容器之间的映射：**"."** 表示宿主机的当前目录，**":"** 为分隔符，"/code" 表示容器中的目录。即宿主机当前目录和容器的 /code 目录是连通的，宿主机当前目录的 Django 代码更新时，容器中的 /code 目录中的代码也相应的更新了。这有点儿像是在容器上打了一个洞，某种程度上也是**实用性**和**隔离性**的一种妥协。

> 严格意义上讲，这里用到的 `.:/code` 并不是**卷**，而是叫**挂载**，它两是有区别的，只不过 docker-compose 允许将挂载写到卷的配置中。后面章节会讲到。

- `ports` ：定义了宿主机和容器的端口映射。容器的隔离不止环境，甚至连端口都隔离起来了。但 web 应用不通过端口跟外界通信当然不行，因此这里定义将宿主机的 8000 端口映射到容器的 8000 端口，即访问宿主机的 8000 端口就是访问到了容器的 8000 端口，但要确保端口没有被其他程序占用。

## Docker 可视化

> Portainer是Docker的图形化管理工具，提供状态显示面板、应用模板快速部署、容器镜像网络数据卷的基本操作（包括上传下载镜像，创建容器等操作）、事件日志显示、容器控制台操作、Swarm集群和服务等集中管理和操作、登录用户管理和控制等功能。功能十分全面，基本能满足中小型单位对容器管理的全部需求。

项目地址：https://github.com/portainer/portainer

官方文档：https://www.portainer.io/documentation/

### 安装

```bash
# 拉取镜像
docker pull portainer/portainer

# 一键部署
docker volume create portainer_data
docker run -d -p 9000:9000 --name portainer --restart always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer
```

### 使用

浏览器访问`9000`端口即可进入到Portainer界面，首次打开需要设置密码

> 若无法访问，请到云服务器控制台，开启9000端口

![](https://i.loli.net/2020/05/21/YGp7sS3dzCaubMo.png)

单机版本选择`Local`，点击Connect即可连接到本地docker

![](https://i.loli.net/2020/05/21/AC8XVlY4utNw9mS.png)

登录后我们可以查看服务器上各个镜像、容器、网络、**Volume** 等信息，并可以对它们进行管理。
![](https://i.loli.net/2020/05/21/DJmZEe2btkzcsMP.png)

![](https://i.loli.net/2020/05/21/cCk57HPUdYDXxms.png)

在页面上就可以直接进行容器的创建、启动、停止、删除等操作

![](https://i.loli.net/2020/05/21/hRBW54fCcum1abA.png)

可查看容器详细信息，还可查看 **log** 日志，甚至进入容器执行命令。

![](https://i.loli.net/2020/05/21/qKBcjLRifZ6Ez3s.png)

### 创建一个容器

在 **Containers** 页面中，点击右上角的“**Add container**” 按钮。

接着填写好容器名、镜像名、端口映射等相关信息后，点击下方的“**Deploy the container**” 后便会开始自动拉取镜像启动容器。

参考：[Portainer - Docker的可视化管理工具使用详解](https://www.hangge.com/blog/cache/detail_2597.html)