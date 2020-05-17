---
abbrlink: 1
---




[![](https://img.shields.io/badge/python-3.7.0-blue.svg)](https://www.python.org/downloads/release/python-370/)[![](https://img.shields.io/badge/djiango-3.0.5-blue.svg)](https://www.djangoproject.com/)[![](https://img.shields.io/badge/mysql-5.7-blue.svg)](https://dev.mysql.com/downloads/mysql/5.7.html)

## 基于Django的博客系统

## 页面展示

### 首页![image-20200430125911927](https://i.loli.net/2020/04/30/v81iAjyXfaOTDEM.png)

![首页](https://i.loli.net/2020/04/30/a7AJsXpyFYVBImr.png)

![image-20200430131109349](https://i.loli.net/2020/04/30/zDZ4hCxGeajY6sP.png)

### 文章详情

![image-20200430131044918](https://i.loli.net/2020/04/30/ZjCmuz3BtYJVlDH.png)

### 评论

![image-20200430131553099](https://i.loli.net/2020/04/30/QLOJxbqvESMACYg.png)

### 友链

![image-20200430130147159](https://i.loli.net/2020/04/30/UBGCaWhu2trEsvP.png)

### 文章分类详情页

![image-20200430130800053](https://i.loli.net/2020/04/30/QKT43AdMIuVwBs7.png)

### 归类页

![image-20200430130311895](https://i.loli.net/2020/04/30/pEIf5lxVhwMiFDA.png)

### 关于页

![image-20200430130449572](https://i.loli.net/2020/04/30/6qZaAePunibI7T3.png)

### 后台登录页

![image-20200430132009042](https://i.loli.net/2020/04/30/FsnOIrijYU5cCmy.png)

### 后台首页

![image-20200430132304261](https://i.loli.net/2020/04/30/odTXF4GEalcOg7Z.png)

### 文章管理

![image-20200430132329623](https://i.loli.net/2020/04/30/XWqhaxkzT8H4LYQ.png)

### 分类

![image-20200430132344365](https://i.loli.net/2020/04/30/HJwTCU42liPXZRj.png)

### 友链

![image-20200430132401630](https://i.loli.net/2020/04/30/Zi5QfJYGePV8bHT.png)

### 关于设置

![image-20200430132432507](https://i.loli.net/2020/04/30/CkouXdEQGKp3tB2.png)

### 网站设置

![image-20200430132456327](https://i.loli.net/2020/04/30/vespBGZSxJYDTEt.png)

重要的事情说3遍：

👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇

👉               1.[部署教程]()                👈

​        👉        2.[部署教程]()         👈

👉               3.[部署教程]()                👈

👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆

## Ubuntu安装Docker

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



## Linux安装Docker compose

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

## Python安装

```
sudo apt install python3.7
sudo apt-get install python3.7-pip
pip3 install --upgrade pip
```



部署docker是到这样一个问题，开启容器时***提示本地3306端口被占用\***，于是就使用这条命令查了下端口使用情况：

```
fuser -v -n tcp 3306
```



发现确实被占用了，于是用
`kill -s 9 pid`
把占用的进程干掉，再次查看是发现还在占用，于是发现是***本地的MySQL服务\*** 开着，就通过：

```bash
service mysqld stop(5.0版本是mysqld)

service mysql stop(5.5.7版本之后是mysql)
```

把MySQL服务关掉，发现这时端口3306 已经被释放了。

## 赞助💰

如果你觉得对你有帮助，你可以赞助我一杯冰可乐

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
