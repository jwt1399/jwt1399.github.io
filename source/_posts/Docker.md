---
title: Docker使用及部署CTF题目
author: 简文涛
categories:
  - 工具
tags:
  - docker
comments: true
img: 'https://i.loli.net/2019/07/05/5d1eba127dd6f95102.png'
abbrlink: 50751
date: 2019-07-05 10:36:43
---
![](https://i.loli.net/2019/07/05/5d1eba127dd6f95102.png)
Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的镜像中，然后发布到任何流行的 Linux或Windows 机器上，也可以实现虚拟化。容器是完全使用沙箱机制，相互之间不会有任何接口。

## docker安装

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

- 启动docker

  ```python
  $ service docker start
  ```

## docker常用命令

- 从镜像仓库中拉取或者更新指定镜像
```php
docker pull [OPTIONS] NAME[:TAG|@DIGEST]
```
```php
    从Docker Hub下载java最新版镜像。
    docker pull java
    
    从Docker Hub下载REPOSITORY为java的所有镜像。
    docker pull -a java```
```

- 创建镜像
```php
docker build [options] path | url | - .(最后的点不能丢)
eg：docker build -t warmup .
eg: docker build -f /path/to/a/Dockerfile .
eg: docker build github.com/creack/docker-firefox
```
- 新建一个docker容器，并映射端口号。
```php
docker run [options] [host port]:[docker port] [image]
用到的option： -d 后台运行
               -P 随机把容器的端口映射到一个主机未使用的高端口
               -p 格式为主机端口：容器端口 ，自选端口映射
               -i  以交互模式运行容器，常与-t连用
               -t  为容器重新分配一个伪输入终端，常与-i连用
eg：docker run -i -d -P warmup 
eg: docker run -d -p 100:80 -p 32768:80 warmup
```
- 查看本地的docker镜像
```php
docker images 或者 docker image ls
```
- 查看正在运行的docker容器。
```php
docker ps
```
- 启动/停止一个docker容器。
```php
docker start [container id]
docker stop  [container id]
```
- 删除一个docker容器。（注意：需要先把容器停止才可以删除。）
```php
docker rm [container id]
```
- 容器与主机(服务器，不是自己的PC)之间的数据拷贝
```php
docker cp  dest_path [container id]:container_path ##主机cp到容器
docker cp  [container id]:container_path dest_path ##容器cp到主机
```
```php
将主机/www/runoob目录拷贝到容器96f7f14e99ab的/www目录下
docker cp /www/runoob 96f7f14e99ab:/www/

 将容器96f7f14e99ab的/www目录拷贝到主机的/tmp目录中
docker cp 96f7f14e99ab:/www /tmp/

 将主机/www/runoob目录拷贝到容器96f7f14e99ab中，目录重命名为www
docker cp /www/runoob 96f7f14e99ab:/www
```
## docker部署CTF题目
由于要部署web题，所以选择了一个apache-php5
```php
docker pull registry.cn-hangzhou.aliyuncs.com/lxepoo/apache-php5
```
然后运行镜像，并绑定一下端口。
```php
docker run -d -p 8085:80 registry.cn-hangzhou.aliyuncs.com/lxepoo/apache-php5
```
此时会返回一个值，表示该运行docker的id。以后如果想访问这个容器，需要通过该id。
也可通过`docker ps `查看正在运行的容器，得到容器id

    然后将本地源码文件拷贝到docker，使用docker的cp命令（在id前几位没有重复的情况下，可以取前几位。）
```php
docker cp ./ f7d233:/var/www/
```
- 进入docker容器内部.
```php
docker exec -it f7d233 bash

    -d :分离模式: 在后台运行
    -i :即使没有附加也保持STDIN 打开
    -t :分配一个伪终端
```
- 退出docker容器内部.
```php
Ctrl+p+q
```




参考：
[菜鸟教程-Docker 命令大全](http://www.runoob.com/docker/docker-tutorial.html)
[通过docker部署ctf题目 ](http://blog.5am3.com/2017/12/08/SCodeCTF/)
[记docker复现CTF题的一次流程](https://blog.csdn.net/weixin_40871137/article/details/86609153)

