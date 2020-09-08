---
title: Linux 学习笔记
author: 简文涛
categories:
  - 信息安全
tags:
  - Linux
comments: true
img: 'https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200824183627.jpg'
permalink: linuxbasic
abbrlink: 30369
date: 2019-07-26 16:44:59
updated: 2020-02-24 16:44:59
---

## 前言

由于平常做CTF题经常会用到kali linux，但是作为安全小萌新的我，对linux简直是一无所知，惊羡于大佬仅用几条命令就能实现各种操作，于是乎我的linux学习之路就此开始。

2020.2.24更新：由于本专业开设了`《Linux操作系统安全》`课，于是乎本文档得到了进一步完善。

学习环境：Ubuntu 18.04

## 操作系统简介

我通过以下四点介绍什么操作系统：

*   操作系统（Operation System，简称OS）是管理计算机硬件与软件资源的程序，是计算机系统的内核与基石；

*   操作系统本质上是运行在计算机上的软件程序 ；

*   为用户提供一个与系统交互的操作界面 ；

*   操作系统分内核与外壳（我们可以把外壳理解成围绕着内核的应用程序，而内核就是能操作硬件的程序）。
![](https://i.loli.net/2019/07/26/5d3abff49b3d832580.png)

**操作系统简单分类**

*   **Windows:** 目前最流行的个人桌面操作系统

*   **Unix：** 最早的多用户、多任务操作系统 .按照操作系统的分类，属于分时操作系统。Unix 大多被用在服务器、工作站，现在也有用在个人计算机上。它在创建互联网、计算机网络或客户端/服务器模型方面发挥着非常重要的作用。

*   **Linux:** Linux是一套免费使用和自由传播的类Unix操作系统.Linux存在着许多不同的Linux版本，但它们都使用了 **Linux内核** 。Linux可安装在各种计算机硬件设备中，比如手机、平板电脑、路由器、视频游戏控制台、台式计算机、大型机和超级计算机。严格来讲，Linux这个词本身只表示Linux内核，但实际上人们已经习惯了用Linux来形容整个基于Linux内核，并且使用GNU 工程各种工具和数据库的操作系统。

## 文件系统简介

**在Linux操作系统中，所有被操作系统管理的资源，例如网络接口卡、磁盘驱动器、打印机、输入输出设备、普通文件或是目录都被看作是一个文件。**

也就是说在LINUX系统中有一个重要的概念：**一切都是文件**。其实这是UNIX哲学的一个体现，而Linux是重写UNIX而来，所以这个概念也就传承了下来。在UNIX系统中，把一切资源都看作是文件，包括硬件设备。UNIX系统把每个硬件都看成是一个文件，通常称为设备文件，这样用户就可以用读写文件的方式实现对硬件的访问。

## 文件类型与目录结构

### Linux支持5种文件类型

![文件类型](https://i.loli.net/2019/07/26/5d3abfac9119f69728.png)

### Linux的目录结构

Linux文件系统的结构层次鲜明，就像一棵倒立的树，最顶层是其根目录：

![目录结构](https://i.loli.net/2019/07/26/5d3abfce940d319974.png)

### 常见目录说明

*   **/bin：** 存放二进制可执行文件(ls,cat,mkdir等)，常用命令一般都在这里；

*   **/etc：**  存放系统管理和配置文件；

*   **/home：**  存放所有用户文件的根目录，是用户主目录的基点，比如用户user的主目录就是/home/user，可以用~user表示；

*   **/usr ：** 用于存放系统应用程序；

*   **/opt：** 额外安装的可选应用程序包所放置的位置。一般情况下，我们可以把tomcat等都安装到这里；

*   **/proc：**  虚拟文件系统目录，是系统内存的映射。可直接访问这个目录来获取系统信息；

*   **/root：** 超级用户（系统管理员）的主目录（特权阶级^o^）；

*   **/sbin:** 存放二进制可执行文件，只有root才能访问。这里存放的是系统管理员使用的系统级别的管理命令和程序。如ifconfig等；

*   **/dev：** 用于存放设备文件；

*   **/mnt：** 系统管理员安装临时文件系统的安装点，系统提供这个目录是让用户临时挂载其他的文件系统；

*   **/boot：** 存放用于系统引导时使用的各种文件；

*   **/lib ：**      存放着和系统运行相关的库文件 ；

*   **/tmp：** 用于存放各种临时文件，是公用的临时文件存储点；

*   **/var：** 用于存放运行时需要改变数据的文件，也是某些大文件的溢出区，比方说各种服务的日志文件（系统启动日志等。）等；

*   **/lost+found：** 这个目录平时是空的，系统非正常关机而留下“无家可归”的文件（windows下叫什么.chk）就在这里。  
##   Ubuntu 18.04 美化

### 安装美化工具gnome-tweak-tool

```bash
sudo apt install gnome-tweak-tool
sudo apt install gnome-shell-extensions       //扩展  
```
### 安装dash to dock 任务栏美化

```bash
sudo apt-get install gnome-shell-extension-dashtodock     
//安装完后重启
```
### 下载主题和图标

网站https://www.gnome-look.org/
下载好解压后放到对应文件夹下

```
/usr/share/themes
/usr/share/icons
```
然后打开gnome-tweak-tool(优化)选择自己喜欢的主题和图标

![美化后](https://i.loli.net/2020/03/11/xuKrgijEfVkyc1H.png)

### 终端美化

**安装Oh My Zsh**

```bash
#安装zsh
apt-get install zsh -y

# 修改默认shell为zsh
chsh -s /bin/zsh

#安装oh-my-zsh
wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | sh

#修改主题,我用的"ys"主题
sudo vim ~/.zshrc
找到ZSH_THEME="robbyrussell"，修改为：ZSH_THEME="ys"；

#生效：
source ~/.zshrc

#还可以安装一些插件，我就不赘述了，百度一大堆
```

### 自定义配色

打开终端选择首选项，我的配色是我自己调配的

![终端配色](https://i.loli.net/2020/04/13/jQNV58CTRb9vFkD.png)

![美化后](https://i.loli.net/2020/04/13/q4kBpujszaHe3ET.png)

## 快捷键操作

```bash
Ctrl+Alt+F1:Ubuntu进入纯命令模式
Ctrl+Alt+F7:Ubuntu进入图形界面模式
Ctrl+l:在文件夹中查看文件目录
Ctrl+h:查看文件夹中隐藏文件

#命令行的快捷键
Ctrl -:终端缩小
Ctrl Shift+:终端放大
Ctrl+r:搜索你使用过的命令 #histoty打印你使用过的命令
Ctrl+l:命令行清屏        #或者用clear  
Ctrl+e:光标快速移到行尾
Ctrl+z:把命令放入后台
Ctrl+c:强制终止当前命令

开机默认纯命令模式
 cd /etc/default  
 sudo gedit grub 
将#GRUB_TERMINAL=console中的#去掉
```
## 基础命令

>Linux命令大全:[菜鸟教程](https://www.runoob.com/linux/linux-command-manual.html)
Linux命令快速查询：man.linuxde.net/


### 切换目录命令

```bash
cd usr：	切换到该目录下usr目录

cd ..（或cd../）：	切换到上一层目录

cd ../.. :         切换到上上层目录

cd /：	切换到系统根目录

cd ~：	切换到用户主目录

cd -：	切换到上一个所在目录
```

### 目录的操作命令

```bash
1 mkdir 目录名称：新建目录  -p 创建多级目录 
eg:mkdir test1/t1/t2

2 ls或者ll（ll是ls -l的缩写，ll命令以看到该目录下的所有目录和文件的详细信息）：查看目录信息

3 find 目录 参数：寻找目录（查）

示例： 
列出当前目录及子目录下所有文件和文件夹: find . 
在/home目录下查找以.txt结尾的文件名:find /home -name "*.txt" 

同上，但忽略大小写: find /home -iname "*.txt" 

当前目录及子目录下查找所有以.txt和.pdf结尾的文件:find . \( -name "*.txt" -o -name "*.pdf" \)或find . -name "*.txt" -o -name "*.pdf"  # -0 或者(-or)

根据文件类型进行搜索find . -type 类型参数
  
4 mv 目录名称 新目录名称：修改目录的名称（改） 

注意：mv的语法不仅可以对目录进行重命名而且也可以对各种文件，压缩包等进行 重命名的操作。mv命令用来对文件或目录重新命名，或者将文件从一个目录移到另一个目录中。后面会介绍到mv命令的另一个用法。

5 mv 目录名称 目录的新位置：移动目录的位置---剪切（改） 

注意：mv语法不仅可以对目录进行剪切操作，对文件和压缩包等都可执行剪切操作。另外mv与cp的结果不同，mv好像文件“搬家”，文件个数并未增加。而cp对文件进行复制，文件个数增加了。

6 cp -r 目录名称 目录拷贝的目标位置：拷贝目录（改），-r代表递归拷贝 

注意：cp命令不仅可以拷贝目录还可以拷贝文件，压缩包等，拷贝文件和压缩包时不 用写-r递归

7 rm [-rf] 目录: 删除目录（删） 

注意：rm不仅可以删除目录，也可以删除其他文件或压缩包，为了增强大家的记忆， 无论删除任何目录或文件，都直接使用rm -rf 目录/文件/压缩包
```

### grep搜索命令

> **grep**（global search regular expression(RE) and print out the line，全面搜索正则表达式并把行打印出来）是一种强大的文本搜索工具，它能使用正则表达式搜索文本，并把匹配的行打印出来。
选项：
```bash
-a 不要忽略二进制数据。
-A<显示列数> 除了显示符合范本样式的那一行之外，并显示该行之后的内容。
-b 在显示符合范本样式的那一行之外，并显示该行之前的内容。
-c 计算符合范本样式的列数。
-C<显示列数>或-<显示列数>  除了显示符合范本样式的那一列之外，并显示该列之前后的内容。
-d<进行动作> 当指定要查找的是目录而非文件时，必须使用这项参数，否则grep命令将回报信息并停止动作。
-e<范本样式> 指定字符串作为查找文件内容的范本样式。
-E 将范本样式为延伸的普通表示法来使用，意味着使用能使用扩展正则表达式。
-f<范本文件> 指定范本文件，其内容有一个或多个范本样式，让grep查找符合范本条件的文件内容，格式为每一列的范本样式。
-F 将范本样式视为固定字符串的列表。
-G 将范本样式视为普通的表示法来使用。
-h 在显示符合范本样式的那一列之前，不标示该列所属的文件名称。
-H 在显示符合范本样式的那一列之前，标示该列的文件名称。
-i 忽略字符大小写的差别。
-l 列出文件内容符合指定的范本样式的文件名称。
-L 列出文件内容不符合指定的范本样式的文件名称。
-n 在显示符合范本样式的那一列之前，标示出该列的编号。
-q 不显示任何信息。
-R/-r 此参数的效果和指定“-d recurse”参数相同。
-s 不显示错误信息。
-v 反转查找。
-w 只显示全字符合的列。
-x 只显示全列符合的列。
-y 此参数效果跟“-i”相同。
-o 只输出文件中匹配到的部分。
```

```bash
#查询cpuinfo信息合并输入一条
grep name /proc/cpuinfo | uniq     uniq:合并

#查询cpuinfo信息合并输入一条并只输出:后的
cat /proc/cpuinfo | grep name |cut -f2 -d ":" |uniq
# -f2 显示第二列的内容；-d ":" 以:为分隔符

#查询cpuinfo信息合并输入第3列
cat /proc/cpuinfo |grep name | awk '{print $3}'

cat /proc/meminfo |grep MemTotal | awk '{print $2/1024}'
```

### 文件的操作命令（增删改查）

```bash
1 touch 文件名称: 文件的创建（增）

2 cat/more/less/tail文件名称  文件的查看（查）

   cat：只能显示最后一屏内容

 more：可以显示百分比，回车可以向下一行， 空格可以向下一页，q可以退出查看

 less：可以使用键盘上的PgUp和PgDn向上 和向下翻页，q结束查看

 tail-10 ：查看文件的后10行，Ctrl+C结束

注意：命令 tail -f 文件 可以对某个文件进行动态监控，例如tomcat的日志文件， 会随着程序的运行，日志会变化，可以使用tail -f catalina-2016-11-11.log 监控 文 件的变化

3 vim 文件：修改文件的内容（改）

vim编辑器是Linux中的强大组件，是vi编辑器的加强版，vim编辑器的命令和快捷方式有很多，但此处不一一阐述，大家也无需研究的很透彻，使用vim编辑修改文件的方式基本会使用就可以了。 

在实际开发中，使用vim编辑器主要作用就是修改配置文件，下面是一般步骤： 

vim 文件------>进入文件----->命令模式------>按i进入编辑模式----->编辑文件 ------->按Esc进入底行模式----->输入:wq/q! （输入wq代表写入内容并退出，即保存；输入q!代表强制退出不保存。）

4 rm -rf 文件：删除文件（删）同目录删除：熟记 rm -rf文件 即可
    -p 递归删除空目录 -f 强制删除 -r 递归 -i 询问

```
### 压缩文件的操作命令

```bash
1）打包并压缩文件：

Linux中的打包文件一般是以.tar结尾的，压缩的命令一般是以.gz结尾的。

而一般情况下打包和压缩是一起进行的，打包并压缩后的文件的后缀名一般.tar.gz。命令：tar -zcvf 打包压缩后的文件名 要打包压缩的文件,其中：

z：调用gzip压缩命令进行压缩

c：打包文件

v：显示运行过程

f：指定文件名

比如：加入test目录下有三个文件分别是 :aaa.txt bbb.txt ccc.txt,如果我们要打包test目录并指定压缩后的压缩包名称为test.tar.gz可以使用命令：tar -zcvf test.tar.gz aaa.txt bbb.txt ccc.txt或：tar -zcvf test.tar.gz /test/

2）解压压缩包：

命令：tar [-xvf] 压缩文件

其中：x：代表解压

示例：

1 将/test下的test.tar.gz解压到当前目录下可以使用命令：tar -xvf test.tar.gz

2 将/test下的test.tar.gz解压到根目录/usr下:tar -xvf xxx.tar.gz -C /usr(-C代表指定解压的位置）
```

## 文件权限命令

操作系统中每个文件都拥有特定的权限、所属用户和所属组。权限是操作系统用来限制资源访问的机制，在Linux中权限一般分为读(readable)、写(writable)和执行(excutable)，分为三组。分别对应文件的属主(owner)，属组(group)和其他用户(other)，通过这样的机制来限制哪些用户、哪些组可以对特定的文件进行什么样的操作。通过 ·ls -l· 命令我们可以 查看某个目录下的文件或目录的权限

示例：在随意某个目录下ls -l
![](https://i.loli.net/2019/07/26/5d3ac443b1b1f34567.png)
第一列的内容的解释信息如下：
![](https://i.loli.net/2019/07/26/5d3ac4062d35135223.png)

下面将详细讲解文件的类型、Linux中权限以及文件有所有者、所在组、其它组具体是什么？

**文件的类型**：

```bash
•d：代表目录
•-：代表文件
•l：代表链接（可以认为是window中的快捷方式）
```
**Linux中权限分为以下几种**：

```bash
•r：代表权限是可读，r也可以用数字4表示
•w：代表权限是可写，w也可以用数字2表示
•x：代表权限是可执行，x也可以用数字1表示
```
**文件和目录权限的区别**：

对文件和目录而言，读写执行表示不同的意义。

对于文件：
![](https://i.loli.net/2019/07/26/5d3ac5277a41331143.png)

对于目录：
![](https://i.loli.net/2019/07/26/5d3ac53f2976858167.png)



>在linux中的每个用户必须属于一个组，不能独立于组外。在linux中每个文件有所有者、所在组、其它组的概念。

* 所有者

一般为文件的创建者，谁创建了该文件，就天然的成为该文件的所有者，用ls ‐ahl命令可以看到文件的所有者 也可以使用chown 用户名 文件名来修改文件的所有者 。

* 文件所在组

当某个用户创建了一个文件后，这个文件的所在组就是该用户所在的组 用ls ‐ahl命令可以看到文件的所有组 也可以使用chgrp 组名 文件名来修改文件所在的组。

* 其它组

除开文件的所有者和所在组的用户外，系统的其它用户都是文件的其它组

**如何修改文件/目录的权限**

修改文件/目录的权限的命令：chmod
格式：[ugoa...][[+-=][rwxX]...][,...]

```bash
u表示拥有者（user）
g表示与拥有者属于同组group）
o表示其它用户（other）
a表示这三者皆是。(all)
```
```bash
+表示添加权限，-表示取消权限。=表示唯一设定权限。

r：表示可读取，w表示可写入，x表示可运行。
```
示例：修改/test下的aaa.txt的权限为属主有全部权限，属主所在的组有读写权限， 其他用户只有读的权限

```chmod u=rwx,g=rw,o=r aaa.txt```
![](https://i.loli.net/2019/07/26/5d3ac6193b4d871854.png)
上述示例还可以使用数字表示：

```chmod 764 aaa.txt```
**使用数字设置权限**：
语法：chmod abc file

当中a,b,c各为一个数字，a表示User，b表示Group。c表示Other的权限。
```bash
r=4，w=2。x=1

若要rwx（可读、可写、可运行）属性，则4+2+1=7

若要rw-（可读、可写、不可运行）属性，则4+2=6

若要r-w（可读、不可写、可运行）属性，则4+1=5
```
示例：
```bash
chmod a=rwx file 和 chmod 777 file 效果同样

chmod ug=rwx,o=x file 和 chmod 771 file 效果同样

若用chmod 4755 filename可使此程式具有root的权限
```
**注意：文件夹要有x权限才可以访问，只有r不可以访问**

**补充一个比较常用的东西**:

假如我们装了一个zookeeper，我们每次开机到要求其自动启动该怎么办？

1.新建一个脚本zookeeper
2.为新建的脚本zookeeper添加可执行权限，命令是:chmod +x zookeeper
3.把zookeeper这个脚本添加到开机启动项里面，命令是：chkconfig --add zookeeper
4.如果想看看是否添加成功，命令是：chkconfig --list

## 用户管理

Linux系统是一个多用户多任务的分时操作系统，任何一个要使用系统资源的用户，都必须首先向系统管理员申请一个账号，然后以这个账号的身份进入系统。

用户的账号一方面可以帮助系统管理员对使用系统的用户进行跟踪，并控制他们对系统资源的访问；另一方面也可以帮助用户组织文件，并为用户提供安全性保护。

#### 用户管理的几个系统配置文件

1.   **/etc/passwd**：**存放关于账户相关的信息**

   ![](https://i.loli.net/2020/03/30/icPxY4WV7d69pjg.png)

2.  **etc/shadow：/etc/passwd的影子文件**

   ```bash
   root:$6$/LWuDRno$roPA0L5ZR.gsfLmCWKqNnE2F3oePaaqvHlF2O07oM9tzDzBlyyC62gS6VxKpc/eKGz/UaypXCtfltmQ7d7/7b1:18314:0:99999:7:::
   ```
   | **字段名**   | **编号** | **说明**                                            |
   | ------------ | -------- | --------------------------------------------------- |
   | **username** | **1**    | **root**                                            |
   | **password** | **2**    | **加密口令：$6$/LWuDRno$roPA0L5ZR.gs.../7b1**       |
   | **lastchg**  | **3**    | **自1970.1.1起到上次修改口令所经过的天数：17431天** |
   | **min**      | **4**    | **需几天可以修改口令：0天**                         |
   | **max**      | **5**    | **口令还会有效的最大天数：99999天，即永不过期**     |
   | **warn**     | **6**    | **口令失效前7天内向用户发出警告**                   |
   | **inactive** | **7**    | **禁止登录前用户还有效的天数未定义，以“：”表示**    |
   | **expire**   | **8**    | **用户被禁止登录的时间未定义，以“：”表示**          |
   | **flag**     | **9**    | **保留未使用，以“：”表示**                          |

```bash
jwt:$6$VtVD9Veq$B2YcOYK6qE96wiWNMq45N4pGB.3/UdSzTBmdyizB3YADRjbE5HbaBOhw5JxpDWCH.b/Bj3MBQSB8Y8zqLFjef1:18314:0:99999:7:::
```
![](https://i.loli.net/2020/03/30/e8WmFto13ATRDpL.png)

| **字段名** | **编号** | **说明**                                   |
| ---------- | -------- | ------------------------------------------ |
| username   | **1**    | **用户的登录名**                           |
| password   | **2**    | **加密的用户密码**                         |
| lastchg    | **3**    | **自1970.1.1起到上次修改口令所经过的天数** |
| min        | **4**    | **两次修改口令之间至少经过的天数**         |
| max        | **5**    | **口令还会有效的最大天数**                 |
| warn       | **6**    | **口令失效前多少天内向用户发出警告**       |
| inactive   | **7**    | **禁止登录前用户还有效的天数**             |
| expire     | **8**    | **用户被禁止登录的时间**                   |
| flag       | **9**    | **保留**                                   |

3. **/etc/group文件:存放用户组相关的信息资料**

```bash
root:x:0:

jwt:x:1000:
```

| 字段名         | 编号  | 说明                   |
| -------------- | ----- | ---------------------- |
| group_name     | **1** | **用户组名**           |
| group_password | **2** | **加密后的用户组密码** |
| group_id       | **3** | **用户组ID**           |
| group_members  | **4** | **逗号分隔开的组成员** |

 4.**etc/gshadow:为了保护用户组的加密密码，防止暴力破解**

```bash
root:*::

jwt:!::
```

| 字段名         | 编号  | 说明                               |
| -------------- | ----- | ---------------------------------- |
| group_name     | **1** | **用户组名**                       |
| group_password | **2** | **加密后的用户组密码**             |
| group_id       | **3** | **用户组ID（可以为空）**           |
| group_members  | **4** | **逗号分隔开的组成员（可以为空）** |

`！`表示组没有设置密码，可以用`gpasswd`命令给组设置密码

#### 添加用户

```bash
useradd 选项 用户名   #创建新用户
#注意：使用useradd命令添加用户后，如果不使用passwd命令为用户设置密码，此用户将无法登录。

adduser 选项 用户名   #添加用户
```
**useradd命令常用选项：**

| **选项** | **作用**                                                     |
| -------- | ------------------------------------------------------------ |
| **-d**   | **指定用户主目录。如果此目录不存在，则同时使用-m选项，可以创建主目录。** |
| **-g**   | **指定gid**                                                  |
| **-u**   | **指定uid**                                                  |
| **-G**   | **指定用户所属的附加组。**                                   |
| **-l**   | **不要把用户添加到lastlog和failog中，这个用户的登录记录不需要记载** |
| **-M**   | **不要建立用户主目录**                                       |
| **-m**   | **自动创建用户主目录**                                       |
| **-p**   | **指定新用户的密码**                                         |
| **-r**   | **建立一个系统帐号**                                         |
| **-s**   | **指定shell**                                                |

useradd命令用于Linux中创建的新的系统用户。useradd可用来建立用户帐号。帐号建好之后，再用passwd设定帐号的密码．而可用userdel删除帐号。`使用useradd指令所建立的帐号，实际上是保存在/etc/passwd文本文件中。` `使用adduser指令所建立的帐号，会在home目录下产生工作目录.`

#### 修改密码

```bash
passwd 用户名        #更改或创建用户的密码
sudo passwd root    #为root设置密码

passwd -S 用户名     #显示用户账号密码信息

passwd -d 用户名     #清除用户密码
```

**passwd命令常用选项：**

| 选项   | 作用                                                     |
| ------ | -------------------------------------------------------- |
| **-l** | **管理员通过锁定口令来锁定已经命名的账户，即禁用该用户** |
| **-u** | **管理员解开账户锁定状态**                               |
| **-x** | **管理员设置最大密码使用时间（天）**                     |
| **-n** | **管理员设置最小密码使用时间（天）**                     |
| **-d** | **管理员删除用户的密码**                                 |
| **–f** | **强迫用户下次登录时修改口令**                           |

passwd命令用于设置用户的认证信息，包括用户密码、密码过期时间等。系统管理者则能用它管理系统用户的密码。只有管理者可以指定用户名称，一般用户只能变更自己的密码。

#### 修改用户属性

```bash
usermod 选项 用户名   #改变用户属性
```

**usermod命令常用选项:**

| **选项** | **作用**                               |
| -------- | -------------------------------------- |
| **-d**   | **修改用户主目录**                     |
| **-e**   | **修改帐号的有效期限**                 |
| **-f**   | **修改在密码过期后多少天即关闭该帐号** |
| **-g**   | **修改用户所属的组**                   |
| **-G**   | **修改用户所属的附加组**               |
| **-l**   | **修改用户帐号名称**                   |
| **-L**   | **锁定用户密码，使密码无效**           |
| **-s**   | **修改用户登入后所使用的shell**        |
| **-u**   | **修改用户ID**                         |
| **-U**   | **解除密码锁定**                       |

#### 删除用户

```bash
userdel 选项 用户名   #删除用户帐号

userdel  test4         删除用户test4，保留主目录
userdel  test5  -r     删除用户test5及其主目录
```

## 用户组管理

每个用户都有一个用户组，系统可以对一个用户组中的所有用户进行集中管理。不同Linux 系统对用户组的规定有所不同，如Linux下的用户属于与它同名的用户组，这个用户组在创建用户时同时创建。

用户组的管理涉及用户组的添加、删除和修改。组的增加、删除和修改实际上就是对/etc/group文件的更新。

**系统用户组的管理相关命令**:

#### 增加组

```bash
groupadd 选项 组名 

groupadd -g 343 newgroup
#新建一个ID为343的组
```

**groupadd命令的常用选项**

| **选项** | **作用**                                         |
| -------- | ------------------------------------------------ |
| **–g**   | **指定组ID号，除非使用-o选项，否则该值必须唯一** |
| **–o**   | **允许设置相同组id的群组，不必唯一**             |
| **–r**   | **建立系统组账号，即组ID低于499**                |
| **–f**   | **强制执行，创建相同id的组**                     |

#### 更改组属性

```bash
groupmod 选项 组名

groupmod -n linux newgroup
#将newgroup群组的名称改为linux
```
**groupmod命令的常用选项**

| **选项** | **作用**                               |
| -------- | -------------------------------------- |
| **–g**   | **指定组ID号**                         |
| **–o**   | **与groupadd相同，重复使用群组识别码** |
| **–n**   | **修改用户组名**                       |

#### 删除组

```bash
groupdel 组名 

groupdel  linux
#删除linux组 如果组里面有用户，那么需要先删除用户，再删除组。      
```

#### 添加用户入组

```bash
sudo gpasswd -M user1,user2  group  
#为group组指定user1和user2组成员
```

#### 删除组中用户

```bash
gpasswd -d test4 sudo
#将组sudo中的用户test4删除
```

## 用户权限

> 第一个用户默认有sudo权限

两种方法让普通用户具有sudo 的权限：

- 修改配置文件(/etc/sudoers)把用户加到sudo组

```bash
sudo gedit /etc/sudoers

#在文件此处添加你要加的用户
# Allow members of group sudo to execute any command
%sudo	ALL=(ALL:ALL) ALL
jwt     ALL=(ALL:ALL) ALL  #将jwt用户加进去了
```

- 使用命令把用户加到sudo组

```bash
#方法一
sudo usermod  -G  sudo  jwt  #添加用户jwt进入组sudo

#方法二
sudo gpasswd -a jwt  sudo    #添加用户jwt进入组sudo
```

## 设备管理

#### 基础命令

```bash
fdisk -l #磁盘及分区管理工具，在硬盘设备中创建、删除、更改分区等操作通过fdisk命令进行

mkfs #将硬盘分区后，使用mkfs（Make Filesystem，创建文件系统）命令可对其进行格式化。
# mkfs  -t  ext3  /dev/hdb1

fsck #扫描磁盘问题

df #命令功能是检查文件系统的磁盘空间占用情况。

du #统计目录（或文件）所占磁盘空间的大小。-a显示每个子文件的磁盘占用量 -s 统计总磁盘占用量
# du -a /home/user/dir

quota #命令可以显示磁盘已使用的空间与限制

mount #命令可以实现对存储设备的挂载
mount -t 
示例：挂载u盘设备（假设u盘标识为sdb1）到/mnt/usb目录。
#mount  /dev/sdb1  /mnt/usb
```

### 使用cifs在Linux上挂载Windows共享

#### **方法一**：使用命令进行挂载

1.查看Windows的IP:**ipconfig**，我的ip是192.168.137.1

2.在Windows上建立共享文件

![](https://i.loli.net/2020/04/21/78HuMbGZnemYV2q.png)

3.在linux上新建要挂载到的文件夹 我是建在`~/Win-Share`

4.在linux上执行挂载语句

```bash
sudo mount -t cifs -o username='Win用户名',password='登录密码',uid=jwt,gid=jwt //192.168.137.1/Ubuntu-Share/ ~/Win-Share


# username,password是windows登录用户名密码，一定不能输错。
# //192.168.137.1/Ubuntu-Share/ 就是windows要的共享文件夹
# ~/Win-Share是linux将共享文件夹要挂载到的地方，可任意定位置
# uid和gid也可以不要，uid和gid查看方法：命令行执行"id"命令

sudo apt install cifs-utils #没有cifs执行这个命令安装
sudo mount -t c(table) #查看是否有cifs
```

5.取消挂载

```bash
sudo umount ~/Win-Share
```

6.查看挂载信息

```bash
$ mount | grep Win-Share
//192.168.137.1/Ubuntu-Share/ on /home/jwt/Win-Share type cifs (rw,relatime,vers=default,cache=strict,username=admin,domain=,uid=0,noforceuid,gid=0,noforcegid,addr=192.168.137.1,file_mode=0755,dir_mode=0755,soft,nounix,serverino,mapposix,rsize=1048576,wsize=1048576,echo_interval=60,actimeo=1)
```

#### 挂载时遇见的错误

我执行时遇到了`无法以只读方式挂载`的错误，排查之后是我的用户名错了

![](https://i.loli.net/2020/04/21/tuOR845TNiShLCf.png)

查看Win用户`net user`,我开始使用Administrator，一直报错，换成admin成功了，所以用户名和密码一定不要输错了

![](https://i.loli.net/2020/04/21/KUmtpdRrTvs9F7k.png)

#### 方法二：手动挂载

打开文件，点击其他位置，在连接到服务输入`smb://ip/win共享文件夹`,点击连接输入win用户名和密码

```
smb://192.168.137.1/ubuntu-share/
```

![](https://i.loli.net/2020/04/21/D7KCcizMoEIYVsx.png)

### 挂载光盘文件 iso

1.	制作光盘镜像文件
2.	挂载该文件

```bash
#流程
1.	将文件和目录制作成光盘镜像文件，执行下面的命令。
#mkisofs -r -J -V tt  -o ~/Desktop/tt.iso ~/Desktop/exam
2.	将新的光盘镜像加载
sudo mount -t iso9660 -o loop ~/Desktop/tt.iso  ~/Desktop/tTest
```

### 综合案例

> 新增加一个磁盘，对磁盘进行分区，格式化分区，挂载分区，并给该磁盘进行配额。指定用户限额流程：

流程：
1.	虚拟机 -->设置-->添加磁盘  重启Ubuntu （模拟服务器接了一个新硬盘）
2.	查看分区信息，虚拟机新建分区
3.	dfisk 进行分区
4.	格式化新分区
5.	新建挂载点  sudo mkdir /home/newdisk
6.	将分区挂载到 挂载点 sudo mount /dev/sdb1  /home/newDisk.

配额设置：

1.	mount 将磁盘重新挂载到用户配额和组配额 sudo mount -o remount,usrquota,grpquota  /home/newDisk
2.	检查是否挂载到配额 mount | grep sdb1
3.	查看配额信息  quatocheck -avug
4.	开启配额 （服务） sudo quotaon -vug  /home/newDisk
5.	给用户分配配额。 Sudo edquota -u zj    Ctrl + O, ctrl+m ,ctrl+x
6.	给组分配陪  Sudo edquota -g zj   (硬限制>软限制）
7.	 查看配额 sudo quota -uvs zj
8.	测试

## 日志管理

> 日志文件所处的位置都在**/var/log**目录下

```bash
alternatives.log   -更新替代信息都记录在这个文件中
kern.log    –包含内核产生的日志，有助于在定制内核时解决问题。
apport.log  -应用程序崩溃记录
apt/  用apt-get安装卸载软件的信息
auth.log  -登录认证log
boot.log  -包含系统启动时的日志。
wtmp  —包含登录信息。使用wtmp可以找出谁正在登陆进入系统，谁使用命令显示这个文件或信息等。
btmp    -记录所有失败启动信息
dist-upgrade  -dist-upgrade更新方式的信息
dpkg.log   - 包括安装或dpkg命令清除软件包的日志。
fontconfig.log -与字体配置有关的log。
lastlog —记录所有用户的最近信息。这不是一个ASCII文件，因此需要用lastlog命令查看内容。
faillog –包含用户登录失败信息。此外，错误登录命令也会记录在本文件中。
```

Linux系统中的有三个主要的日志子系统

1.连接时间日志子系统 utmp、wtmp和lastlog

2.进程统计日志子系统

3.错误日志子系统

**less  --主要用来查看日志**

```bash
G:跳转到末尾
/字符串：向下搜索"字符串"的功能
?字符串：向上搜索"字符串"的功能
n：重复前一个搜索（与 / 或 ? 有关）
N：反向重复前一个搜索（与 / 或 ? 有关）
q: 退出
空格键 滚动一页
回车键 滚动一行
```

**free** 内存查看命令 

**Lastcomm** 可以监测系统中任何时候执行的命令

## 进程管理

```bash
#查看进程
ps  静态的
top 动态的
```

ps-显示当前进程的状态

```bash
ps -l  #将目前属于您自己这次登入的 PID 与相关信息列示出来，长格式显示更加详细的信息；
ps -a  #显示一个终端的所有进程，除会话引线外； tty:终端
ps -A  #显示所有进程信息
ps –u root #指定用户的所有进程信息
ps -e  #显示所有进程信息

ps aux ##查看系统中所有的进程显示所有包含其他使用者的行程
ps -axjf #以程序树的方式显示
ps -eLf #显示线程信息
ps -a | wc -l #统计行数
ps -ef | grep queue | grep -v grep | wc -l #查找含有queue关键词的进程（-v去掉grep本身），输出找到的进程数量。
ps -aux | awk '$2~/S/ {print $0}' #统计sleep状态的进程
#统计终端为tty1的所有进程
ps aux | awk '$7~/tty1/' | wc -l   #$7表示tty在ps aux 数据的第7列 #  ~/tty1/ 表示包含tty1的

```

## 查看系统信息命令

````bash
uname -a # 查看内核/操作系统/CPU信息 
head -n 1 /etc/issue # 查看操作系统版本 
cat /proc/cpuinfo # 查看CPU信息 
hostname # 查看计算机名 
lspci -tv # 列出所有PCI设备 
lsusb -tv # 列出所有USB设备 
lsmod # 列出加载的内核模块 
env # 查看环境变量资源 
free -m # 查看内存使用量和交换区使用量 
df -h # 查看各分区使用情况 
du -sh <目录名> # 查看指定目录的大小 
grep MemTotal /proc/meminfo # 查看内存总量 
grep MemFree /proc/meminfo # 查看空闲内存量 
uptime # 查看系统运行时间、用户数、负载 
cat /proc/loadavg # 查看系统负载磁盘和分区 
mount | column -t # 查看挂接的分区状态 
fdisk -l # 查看所有分区 
swapon -s # 查看所有交换分区 
hdparm -i /dev/hda # 查看磁盘参数(仅适用于IDE设备) 
dmesg | grep IDE # 查看启动时IDE设备检测状况网络 
ifconfig # 查看所有网络接口的属性 
iptables -L # 查看防火墙设置 
route -n # 查看路由表 
netstat -lntp # 查看所有监听端口 
netstat -antp # 查看所有已经建立的连接 
netstat -s # 查看网络统计信息进程 
ps -ef # 查看所有进程 
top # 实时显示进程状态用户 
w # 查看活动用户 
id <用户名> # 查看指定用户信息 
last # 查看用户登录日志 
cut -d: -f1 /etc/passwd # 查看系统所有用户 
cut -d: -f1 /etc/group # 查看系统所有组 
crontab -l # 查看当前用户的计划任务服务 
chkconfig –list # 列出所有系统服务 
chkconfig –list | grep on # 列出所有启动的系统服务程序 
rpm -qa # 查看所有安装的软件包
````

## 其他常用命令

```bash
pwd：显示当前所在位置

uname -a 查看内核/操作系统/CPU信息

grep 要搜索的字符串 要搜索的文件 --color：搜索命令，--color代表高亮显示

ps -ef/ps aux：这两个命令都是查看当前系统正在运行进程，两者的区别是展示格式不同。如果想要查看特定的进程可以使用这样的格式：ps aux|grep redis（查看包括redis字符串的进程）

注意：如果直接用ps（（Process Status））命令，会显示所有进程的状态，通常结合grep命令查看某进程的状态。

kill -9 进程的pid：杀死进程（-9 表示强制终止。）

先用ps查找进程，然后用kill杀掉
```
**网络通信命令**：

```bash
查看当前系统的网卡信息：ifconfig

查看与某台机器的连接情况：ping

查看当前系统的端口使用：netstat -an

shutdown：

shutdown -h now：指定现在立即关机

shutdown +5 "System will shutdown after 5 minutes":指定5分钟后关机，同时送出警告信息给登入用户。

reboot：重启。

reboot -w：做个重开机的模拟（只有纪录并不会真的重开机）。

gnome-session-quit：注销

logout:注销（纯命令模式下）
```

## 文本处理三剑客--grep、sed、awk

请看我另外一篇文章：https://jwt1399.top/posts/22718.html

## Linux下Shell编程

```shell
#!/bin/bash
echo "开始学习shell !"
```

`#!`(Shebang) 告诉系统这个脚本需要什么解释器来执行，即使用哪一种 Shell。

### 运行方法

```bash
chmod +x ./test.sh  #使脚本具有执行权限
./test.sh  #执行脚本
```

### 文件表达式

```shell
-e filename 如果 filename存在，则为真
-d filename 如果 filename为目录，则为真 
-f filename 如果 filename为常规文件，则为真
-L filename 如果 filename为符号链接，则为真
-r filename 如果 filename可读，则为真 
-w filename 如果 filename可写，则为真 
-x filename 如果 filename可执行，则为真
-s filename 如果文件长度不为0，则为真
-h filename 如果文件是软链接，则为真
filename1 -nt filename2 如果 filename1比 filename2新，则为真。
filename1 -ot filename2 如果 filename1比 filename2旧，则为真。
```

### 整数变量表达式

```shell
-eq 等于
-ne 不等于
-gt 大于
-ge 大于等于
-lt 小于
-le 小于等于
```

**test 命令**

> shell中的 test 命令用于检查某个条件是否成立，它可以进行数值、字符和文件三个方面的测试。

```shell
num1=100
num2=100
if test $[num1] -eq $[num2]
then
    echo '两个数相等！'
else
    echo '两个数不相等！'
fi
```



### 字符串变量表达式

```shell
if  [ $a = $b ]                 如果string1等于string2，则为真,字符串允许使用赋值号做等号           if  [ $string1 !=  $string2 ]   如果string1不等于string2，则为真       
if  [ -n $string  ]             如果string 非空(非0），返回0(true)  
if  [ -z $string  ]             如果string 为空，则为真
if  [ $sting ]                  如果string 非空，返回0 (和-n类似) 
if  [ ! 表达式 ]				  逻辑非 !    条件表达式的相反
if  [ ! -d $num ]               如果不存在目录$num
if  [ 表达式1  –a  表达式2 ]      逻辑与 –a     条件表达式的并列
if  [ 表达式1  –o 表达式2 ]       逻辑或 -o     条件表达式的或
```

### 特殊变量

| $#   | 传递到脚本的参数个数                                         |
| ---- | ------------------------------------------------------------ |
| $*   | 以一个单字符串显示所有向脚本传递的参数。 如"$*"用「"」括起来的情况、以"$1 $2 … $n"的形式输出所有参数。 |
| $$   | 脚本运行的当前进程ID号                                       |
| $!   | 后台运行的最后一个进程的ID号                                 |
| $@   | 与$*相同，但是使用时加引号，并在引号中返回每个参数。 如"$@"用「"」括起来的情况、以"$1" "$2" … "$n" 的形式输出所有参数。 |
| $-   | 显示Shell使用的当前选项，与[set命令](https://www.runoob.com/linux/linux-comm-set.html)功能相同。 |
| $?   | 显示最后命令的退出状态。0表示没有错误，其他任何值表明有错误。 |

### Shell算术运算

**1、expr expression**

```sh
eg：expr  $a + $b
```

注意：在使用expr时，运算符前后要有空格，且乘法要用`\`转义，即`\*`的形式。

**2、$((expression))**

```shell
eg: $((a+b))
```

**3、let命令**

```shell
eg: let c=a+b
```

### if语句

```shell
if condition1
then
	command1
elif condition2
	command2
else
	commandN
fi
```

### for语句

```shell
#C风格的for
for var in item1 item2 ... itemN
do
	command1
	command2
	...
	commandN
done
```

```shell
for (( EXP1; EXP2; EXP3 ))
do
	command1
	command2
	command3
done
```

**循环常见场景：**

写成一行do前面要加分号

```shell
#1、有限数字（用空格隔开）
for i in 1 2 3 4 5;do echo $i ;done　

#2、序列数据（seq 开始 步长 最后） ---步长默认1
for i in $(seq 1 3 100); do echo $i ;done

#3、命令结果（默认空格为分隔符）
for i in `cat 01.txt`;do echo $i ;done
for i in `ls | grep "heh"`;do echo $i ;done

#4、语法循环（类似C，注意为双括号,分号隔开）
for ((i=1;i<3;i+=2));do echo i ;done
for ((;;);do echo"无限循环";done

```

### while语句

```shell
while [ condition ]
do
	command
done
```
### until语句

until语句与while语句一样，都是循环语句，但处理方式正好相反，即`当判断条件为真时，循环停止`。

```shell
until condition
do
	command
done
```

### case语句

case的语法和C family语言差别很大，它需要一个esac（就是case反过来）作为结束标记，每个case分支用右圆括号，用两个分号表示break

```shell
#!/bin/bash
echo "please enter the number of the week:"
read number
case $number in
 1) echo "Monday";;
 2) echo "Tuesday";;
 3) echo "Wednsday";;
 4) echo "Thursday";;
 5) echo "Friday";;
 6) echo "saturday";;
 7) echo "Sunday";;
 *) echo "your enter must be in 1-7.";;
esac
```

case支持合并匹配模式，即在每一个模式中，可以使用通配符或逻辑符号。

```shell
#! /bin/bash
echo "please input score:"
read score
let score/=10
case $score in
0|1|2|3|4|5) echo "不及格";;
6) echo "及格";;
7|8) echo "良好";;
9|10) echo "优秀";;
*) echo "错误";;
esac
```

### Shell 函数

```shell
[ function ] funname [()]
{
    action;
    [return int;]
}
```

可以带function funname() 定义，也可以直接funname() 定义,不带任何参数。

示例：

```shell
add()
{
	echo "input a:"
	read a
	echo "input b:"
	read b
	echo -n "a+b="
	return $(($a+$b))
}
add
exho $?
```



参考：
[CS基础：Linux基础（1）](https://mp.weixin.qq.com/s/C8kv8itPU1wHYGaH3tG9zg)
[CS基础：Linux基础（2）](https://mp.weixin.qq.com/s/-eANH2n_IDo6ojyP3RdeDA)




