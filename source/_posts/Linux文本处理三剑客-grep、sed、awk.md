---
title: Linux文本处理三剑客
author: 简文涛
categories:
  - 工具
tags:
  - linux文本处理
comments: true
top: false
summary: awk、sed、grep是linux操作文本的三大利器，合称文本三剑客。也是必须掌握的linux命令之一。
img: 'https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200609133642.jpg'
abbrlink: 22718
date: 2020-06-09 12:08:33
updated:
permalink:
---

awk、sed、grep是linux操作文本的三大利器，合称文本三剑客，也是必须掌握的linux命令之一。三者的功能都是处理文本，但侧重点各不相同，grep更适合单纯的查找或匹配文本，sed更适合编辑匹配到的文本，awk更适合格式化文本，对文本进行较复杂格式处理。

## awk🍉

### awk简介

◆名字来源于三个作者的名字简称
◆适用于需要按列处理的数据，主要用于文本内容的分析处理，也常用于处理数据，生成报告

### awk基本用法

#### 1、打印对应列

`ifconfig | awk '{print $1,$2,$3}'`  获取1、2、3列的内容，默认每列按空格或者TAB键分割。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image002-1591679078851.jpg)

#### 2、-F 参数

`cat /etc/shadow | awk -F: '{print $1}'`   指定 `：`为分隔字符来获取该文件的第1列的列值。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image004-1591679078852.jpg)

`awk 'BEGIN{FS=":"}{print $1}' test.txt`   内建变量，指定 ：为分隔字符。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image006-1591679078853.jpg)

`awk -F'[ :]' '{print $1}' test.txt`  使用多个分割符，在[]内有一个空格和 : 字符，先使用空格作为分隔符，然后对分割结果再使用:进行分割。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image008-1591679078853.jpg)

####  3、-v 参数

`awk -vb=3 '{print $1,$b}' test.txt`  设置变量，即可以任意给定变量的值，在选择要输出的列的值就可以设置为这个变量。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image010-1591679078853.jpg)

`awk -vx=2 -vy=fl '{print $1,$x,$1y}' test.txt` 除设置数字型变量以外，还能够在某一列的列值末尾添加字符。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image012-1591679078853.jpg)

####  4、-f 参数

`awk -f fl.awk test.txt`  使用文件中的awk参数来获取信息。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image014-1591679078853.jpg)

####  5、运算符

`awk '$1>3' test.txt`  列出第一列值大于3的行。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image016-1591679078853.jpg)

 `awk '$1==3' test.txt`   显示第一列值等于3的行。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image018-1591679078853.jpg)

 

`awk '$1==3 {print $1,$3}’ test.txt`   显示第一列值等于3的所在行的第一列和第三列的值。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image020-1591679078853.jpg)

 

`awk '$1>3 && $4=="aaaaaa" {print $1,$2,$3,$4}' test.txt`   显示第一列大于3且第四列的列值等于“aaaaaa”的所在行的第1,2,3,4列的列值。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image022-1591679078853.jpg)

#### 6、打印抬头文

`awk -F:   'BEGIN {print "---------fulin_test-----------"} {print $1}' test.txt` 

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image030-1591679500766.jpg)

## sed🍓

### sed简介

◆stream editor
◆根据定位到的数据行修改数据，主要用于文本内容的编辑，默认只处理模式空间，不改变原数据

### sed基本用法

#### 1、-n 参数

#####  **1.1** **显示单行**

`sed -n '4p' test.txt` 显示文件的第4行。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image002-1591679500761.jpg)

#####  **1.2** **显示行范围**

`sed -n '3,6p' test.txt` 显示文件的3至6行。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image004-1591679500762.jpg)

#####  **1.3** **显示关键字所在行**

`sed -n '/aaaa/'p test.txt` 显示包含关键字的所有行。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image006-1591679500763.jpg)

#####  1.4 显示整个文件

`sed -n '1,$p' test.txt`  显示整个文件，其中$p代表最后一行。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image008-1591679500764.jpg)

`sed -n '/\$/'p test.txt` 由于$本身对sed代表一种含意（表示最后一行）,而若需要过滤文档本身$字符，要让$字符失去意义就要将用\$表示$字符本身.

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image010-1591679500764.jpg)

#####  **1.5** **正则表达式**

 `sed -n '/.*fl/'p test.txt` 使用正则表达式：’. ‘ ‘*’ ‘ .*fl’等。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image012-1591679500765.jpg)

#### 2、模式/pattern/= 显示行号

`sed '/fl/=' test.txt` 使用模式/pattern/=显示文件所有内容及关键字所在行的行号。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image014-1591679500765.jpg)

`sed -n '/fl/=' test.txt`在模式/pattern/=的基础上添加-n参数表示仅显示关键字所在行的行号。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image016-1591679500766.jpg)

#### 3、-e参数

`sed -n -e'/aaaaaa/=' -e '/fl/=' -e'/abs/=' test.txt` -e参数能够支持多个模式/pattern/=。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image018-1591679500766.jpg)

`sed -n -e'/ssaa/'p -e'/bkha/'p test.txt` -e参数也能够支持多个’/pattern/’p模式。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image020-1591679500766.jpg)

#### 4、替换匹配行的关键字

`sed '2s/a/A/g' test.txt` 将文件的第2行的所有 a 字符全部替换为A字符。（2s代表第二行、/a/A/匹配第2行的a字符并将a替换为A，g代表的是全局）。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image022-1591679500766.jpg)

但是这种关键字的替换`并不会修改源文件`，仅是在命令执行后临时性的显示一次。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image024-1591679500766.jpg)

#### 5、-i参数

 `sed -i '4s/a/A/g' test.txt`   **-i** 直接修改文件内容 ,替换修改会保存到源文件中。  4s指的是进行第四行替换， g代指的全局替换 将a替换成A。并保存文件。

 

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image026-1591679500766.jpg)

 

#### 6、-i.bak参数

`sed -i.bak '4d' test.txt` 删除源文件的第4行，并且备份一份未被修改的源文件‘.bak’。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image028-1591679500766.jpg)

#### 7、sed应用实例

##### 7.1 实用性：达到取任何一个字符

`ifconfig | sed -n '2p' |awk -F: '{print $2}'|awk '{print $1}'|awk -F. '{print $2}'|awk -F1 '{print $2}'|awk -F8 '{print $1}'`

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image032-1591679500766.jpg)

#####  7.2 截取linux所有网卡及网卡的MAC地址

`ifconfig | sed -n -e '1p' -e '10p' |awk '{print $1,"\t|\t"$5}'`

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image034-1591679500766.jpg)

 

#####  7.3 截取linux所有网卡的IP地址及其子网掩码

`ifconfig | sed -n -e'2p' -e'11p' | awk '{print $2}'|awk -F: '{print $2}'|grep -v '^$'`

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image036-1591679500767.jpg)

## grep🍒

### grep简介

◆global  regular expression print 
◆基于正则表达式查找满足条件的行，主要用于文本内容查找，支持正则表达式

### grep基本用法

#### 1、 在文件中查找关键字

 `grep "fl" /etc/passwd` 搜索关键字并打印出关键字所在的行。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image002.jpg)

##### 1.1  -A 参数

`grep -A 10 "fl" /etc/passwd` 搜索关键字并打印出关键字所在的行以及关键字以下十行。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image004.jpg)

##### 1.2  -B 参数

 `grep -B 10 "fl" /etc/passwd` 搜索关键字并打印出关键字所在的行以及关键字以上十行。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image006.jpg)

##### 1.3  -C 参数

`grep -C 10 "fl" /etc/passwd` 搜索关键字并打印出关键字所在的行以及关键字以上下十行。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image008.jpg)

#### 2、 在多个文件中查找模式

`grep "fl" /etc/passwd /etc/shadow /etc/group /etc/gshadow` 

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image010.jpg)

#### 3、-l 参数

**作用：列出包含关键字的文件名**

`grep -l "fl" /etc/passwd test.txt a.txt /etc/shadow /etc/group /etc/gshadow` 

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image012.jpg)

#### 4、-n 参数

**作用：列出关键字所在的行号及行的内容**

`grep -n "fl" /etc/passwd` 

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image014.jpg)

#### 5、-v  参数

**作用：打印出不包含关键字所有的行**

`grep -v "defaults" /etc/fstab` 

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image016.jpg)

#### 6、 ^  符号

**作用：输出以某个关键字开头的所有行**

`grep "^UUID" /etc/fstab`

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image018.jpg)

#### 7、 $ 符号

**作用：输出以某个关键字结尾的所有行**

`grep "bash$" /etc/passwd`

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image020.jpg)

**过滤注释和空行**： `grep -v "#"  test.txt |grep -v "^$"`  其中 "^$" 代表空行

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image022.jpg)

#### 8、-r 参数

**作用：递归查找**

`grep -r -n "aaaaaa" .` 能把一个目录中只要是包含关键字的所有文件及所在的行的行号都打印出来。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image024.jpg)

#### 9、-i 参数

**作用：忽略大小写**

`grep -r -i "aaaaaa" .`

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image026.jpg)

#### 10、-e 参数

**作用：多关键字查找**

`grep -e "aaaaa" -e "bbbb" test.txt`

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image028.jpg)

查看文件中生效的配置：`grep -v -e "#" -e "^$" test.txt`

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image030.jpg)

#### 11、-f 参数

**作用：以指定的文件里面的匹配模式去搜索**

`grep -f tmp.txt /etc/passwd`

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image032.jpg)

#### 12、-c 参数

**作用：显示匹配关键字的行数**

`grep -c "aaaaa" test.txt`

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image034.jpg)

 

### grep结合正则表达式

####  1、^

**作用：**锚定行首

 `grep ^fl /etc/passwd`

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image036.jpg)

####  2、$

**作用：**锚定行尾

`grep bash$ /etc/passwd`

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image038.jpg)

####  3、.

**作用：**匹配为非换行符的任意字符

`grep "f....l" test.txt`  当`.字符`位于两个指定指定的关键字的中间时，一个 `. 字符`匹配为一个非换行符的任意字符。 

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image040.jpg)

`grep "f." test.txt`  当 `.字符`位于末尾时则匹配为任意多个非换行符的字符。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image042.jpg)

####  4、\

**作用：**匹配零个或多个先前字符

`grep "fu*" test.txt` 列出匹配0个或多个关键字所在行。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image044.jpg)

####  5、[]

**作用：**匹配一个指定范围内的字符

`grep [ahb] test.txt`  列出含有指定范围内的1个或多个关键字的所在行。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image046.jpg)

####  6、[^]

**作用：**匹配不在指定范围内的字符

`grep [^fabc] test.txt` 列出除了所有字符都是指定范围内的1个或多个关键字的所在行。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image048.jpg)

####  7、过滤有数字的行

`grep -v [0-9] test.txt`

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image050.jpg)

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image051.jpg)

####  8、打印出有数字的行

`grep [0-9] test.txt`

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image053.jpg)

####  9、打印出有字符的行

`grep [a-zA-Z] test.txt`

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image055.jpg)

#####  9.1 打印出小写字母的行

`grep [a-z] test.txt`

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image057.jpg)

#####  9.2 打印出大写字母的行

`grep [A-Z] test.txt`

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image059.jpg)

 

####  10、\关键字

**作用：**打印 `\关键字` 标记匹配字符

`grep \aaaaa test.txt` 列出含有关键字的所在行。（^锚定行的开始  $锚定行的结束）。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image061.jpg)

####  11、`\<`

**作用：**锚定单词开始行

`grep "\<fl" test.txt` 列出以关键字开头的字符串所在行。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image063.jpg)

####  12、`\>`

**作用：**锚定单词结束行

`grep "fl\>" test.txt` 列出以关键字结尾的字符串所在行。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image065.jpg)

####  13、`x\{m\} `

**作用：**重复连续字符x,m次数

`grep "a\{4\}" test.txt` 列出文件中存在4个及以上关键字a的所在行。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image067.jpg)

####  14、`x\{m,n\} `

**作用：**重复连续字符x,m-n次数

`grep "a\{7,9\}" test.txt` 列出文件中存在7个到9个连续关键字a的所在行。

![](../images/Linux%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2-grep%E3%80%81sed%E3%80%81awk/clip_image069.jpg)

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