---
title: 'RSA工具集-openssl,rsatool,RsaCtfTool,RSAtool'
author: 简文涛
categories:
  - CTF
tags:
  - RSA工具
comments: true
img: 'https://i.loli.net/2019/07/17/5d2ee0c13f66b76353.png'
abbrlink: 49954
date: 2019-07-17 16:46:00
---
![RSA.png](https://i.loli.net/2019/07/17/5d2ee0c13f66b76353.png)
## openssl
>OpenSSL 是一个开源项目，其组成主要包括一下三个组件：
    openssl：多用途的命令行工具
    libcrypto：加密算法库
    libssl：加密模块应用库，实现了ssl及tls

  openssl可以实现：秘钥证书管理、对称加密和非对称加密 。

RSA PEM文件格式

**1**.PEM私钥格式文件
```php
-----BEGIN RSA PRIVATE KEY-----
-----END RSA PRIVATE KEY-----
```

**2**. PEM公钥格式文件
```php
-----BEGIN PUBLIC KEY-----
-----END PUBLIC KEY-----
```
**3**. PEM RSAPublicKey公钥格式文件
```php
-----BEGIN RSA PUBLIC KEY-----
-----END RSA PUBLIC KEY-----
```
**OpenSSL密钥相关命令**
**1**. 生成密钥
```php
openssl genrsa -out key.pem 1024
    -out 指定生成文件，此文件包含公钥和私钥两部分，所以即可以加密，也可以解密
    1024 生成密钥的长度
```
**2**. 提取PEM格式公钥
```php
openssl rsa -in key.pem -pubout -out pubkey.pem
    -in 指定输入的密钥文件
    -out 指定提取生成公钥的文件(PEM公钥格式)
```
**3**. 提取PEM RSAPublicKey格式公钥
```php
openssl rsa -in key.pem -RSAPublicKey_out -out pubkey.pem
    -in 指定输入的密钥文件
    -out 指定提取生成公钥的文件(PEM RSAPublicKey格式)
```
**4**. 公钥加密文件
```php
openssl rsautl -encrypt -in input.file -inkey pubkey.pem -pubin -out output.file
    -in 指定被加密的文件
    -inkey 指定加密公钥文件
    -pubin 表面是用纯公钥文件加密
    -out 指定加密后的文件
```
**5**. 私钥解密文件
```php
openssl rsautl -decrypt -in input.file -inkey key.pem -out output.file
    -in 指定需要解密的文件
    -inkey 指定私钥文件
    -out 指定解密后的文件
```
**ras** 的用法如下：
```php
openssl rsa [-inform PEM|NET|DER] [-outform PEM|NET|DER] [-in filename] [-passin arg] [-out filename] [-passout arg]
       [-sgckey] [-des] [-des3] [-idea] [-text] [-noout] [-modulus] [-check] [-pubin] [-pubout] [-engine id]</pre>

常用选项：

-in filename：指明私钥文件
-out filename：指明将提取出的公钥保存至指定文件中 
-pubin:根据公钥提取出私钥
-pubout：根据私钥提取出公钥 
```
示例如下：
![](https://i.loli.net/2019/07/17/5d2ee290dd00071030.png)

## rsatool
**安装**：
```php
git clone https://github.com/ius/rsatool.git
cd rsatool  //进入这个目录
python setup.py install
```
提供模数和私有指数，PEM输出到key.pem：
```php
python rsatool.py -f PEM -o key.pem -n 13826123222358393307 -d 9793706120266356337
```
提供两个素数，DER输出到key.der：
```php
python rsatool.py -f DER -o key.der -p 4184799299 -q 3303891593
```
项目地址:https://github.com/ius/rsatool
## RsaCtfTool
**安装**：
```php
安装之前必须先安装这四个库(PyCrypto,GMPY2,SymPy,requests)

git clone https://github.com/Ganapati/RsaCtfTool.git 
cd RsaCtfTool  //进入这个目录
安装python第三方库
pip install -r requirements.txt

```
**用法一**：已知公钥(自动求私钥) –publickey，密文 —-uncipherfile。
将文件解压复制到RsaCtfTool里：
```php
python RsaCtfTool.py --publickey 公钥文件 --uncipherfile 加密的文件
```
![](https://i.loli.net/2019/07/17/5d2ee417c580785483.png)
**用法二**：已知公钥求私钥。
```php
RsaCtfTool.py --publickey 公钥文件 --private
```
![](https://i.loli.net/2019/07/17/5d2ee3dc1bc6f77134.png)
**用法三**：密钥格式转换——把PEM格式的公钥转换为n，e
```php
python RsaCtfTool.py --dumpkey --key 公钥文件
umpkey --key 公钥文件
```
![](https://i.loli.net/2019/07/17/5d2ee3b44a24342430.png)
**用法四**：密钥格式转换——把n,e转换为PEM格式
```php
python RsaCtfTool.py --createpub -n 782837482376192871287312987398172312837182 -e 65537
```
![](https://i.loli.net/2019/07/17/5d2ee35e11f2039360.png)
项目地址:https://github.com/Ganapati/RsaCtfTool

## RSAtool
下载地址：http://www.skycn.net/soft/appid/39911.html
`RSAtool `是一个非常方便实用的小工具，可以用来计算 RSA 中的几个参数、生成密钥、加解密，一些不太复杂的破解工作也可以用它。
我们找一道题为例，来看看 RSAtool 的基本用法。
>还记得 veryeasy RSA 吗？是不是不难？那继续来看看这题吧，这题也不难。 
已知一段 RSA 加密的信息为：0xdc2eeeb2782c 且已知加密所用的公钥： 
(N=322831561921859 e = 23) 
请解密出明文，提交时请将数字转化为 ascii 码提交 
比如你解出的明文是 0x6162，那么请提交字符串 ab 
提交格式：PCTF {明文字符串}

这道题可以用 Python 算出来,用 RSAtool 可以更方便，因为不用自己去写脚本。
![](https://i.loli.net/2019/07/17/5d2ee91e7a76c90913.png)
图中的 `P`、`Q`、`R`、`D`、`E` 分别就是 RSA 算法中的 `p`、`q`、`N`、`d`、`e`，右上角选择进制，注意不要弄错，e 只有十六进制可用，所以这里要把 `23` 换成 `17`。
将` N=322831561921859` 填入，左下角有一个 `Factor N` 的按钮，这是分解 `N` 的意思，点一下，会自动开始分解因数，得到 `P=13574881`、Q=23781539，再点一下 `Calc. D`，计算出`d=42108459725927`，这时可以看到 `Test` 按钮不再是灰色，表明可以使用简单的加解密功能，点它，弹出一个框。
 ![](https://i.loli.net/2019/07/17/5d2ee9383312d23972.png)
第一个框是明文，第二个框是密文，输入明文 `6162`，点击 `Encrypt`，得到密文 `178401292768926`，这时就可以使用解密功能（好像必须先用一次加密才行）。
密文 `0xdc2eeeb2782c`，换算十进制 `242094131279916`，点 `Decrypt`，直接得到字符串 `3a5Y`。

参考：
[Ubuntu下RsaCtfTool的安装及使用](https://www.freebuf.com/sectool/185468.html)
[RSA 常用工具介绍](https://www.40huo.cn/blog/rsa-tools.html)
