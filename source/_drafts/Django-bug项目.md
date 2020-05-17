---
title: Django-bug项目
author: 简简
categories:
  - Python
tags:
  - Django
comments: true
top: false
summary: Django 是一个高级 Python Web 框架，鼓励快速开发和干净、实用的设计，它是自由和开源的。
abbrlink: 60439
date: 2020-04-07 14:58:17
updated:
img: https://i.loli.net/2020/04/06/LEZlkIYrRANGixa.jpg
permalink:
---

## 实现目标

## 项目环境

- 项目地址：
- 操作系统：windows 10

- Python：python 3.7
- Django：Django 3.0.5
- 数据库：mysql
- 前端：HTML、CSS、JS、BootStrap

## 准备环节

### 创建虚拟环境：bug

```bash
mkvirtualenv -p python3 bug

pip3 install django==3.0.5
```

![image-20200417100352149](../images/Django-bug%E9%A1%B9%E7%9B%AE/image-20200417100352149.png)

### 创建django项目：bug

![创建django项目](../images/Django-bug%E9%A1%B9%E7%9B%AE/image-20200417100628433.png)

### 选择项目解释器: bug

![选择项目解释器](https://i.loli.net/2020/04/18/UXYfWjABkEragq3.png)

## 目录规划



### 生成requirements.txt

```bash
pip3 freeze > requirement.txt #生成项目所包含模块清单

pip3 install -r requirements.txt #一键安装上方文档中的模块
```

###  上传git仓库：bug

```bash
github上新建仓库
#首次本地执行：
git init
git add .
git commit -m "xxxxxxxx"
git remote add origin https://github.com/jwt1399/bug.git
git push -u origin master

#以后执行上传：
git add .
git commit -m "xxxxx"
git push -u origin master
#不想上传的文件，写在`.gitignore`中
```

