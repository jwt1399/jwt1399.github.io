---
title: Python虚拟环境
author: 简文涛
categories:
  - Python
tags:
  - Python虚拟环境
comments: true
top: false
summary: Python虚拟环境让每一个Python项目有独立的运行环境，只需要安装对应的模块，迁移时移动整个环境即可。
img: 'https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200824182635.png'
abbrlink: 26224
date: 2020-04-05 15:19:29
updated:
permalink:
---

## 虚拟环境

> 当做一个项目时，可能会用到一些模块，如果把所有的模块都安装在主机python环境中，很容易使得自带python环境十分臃肿，而且到时候如果迁移到别的电脑时还需要重新安装对应模块，所以可以用虚拟环境，在不同的环境下安装对应的模块，迁移时也把整个环境迁移过去即可

虚拟环境的作用：项目之间环境隔离
开发：本地环境
线上：多环境隔离

## 一、Linux用户

### 1.安装virtualenv

```bash
sudo pip3 install virtualenv
```
### 2.安装virtualenv扩展管理工具virtualenvwrapper

```bash
sudo pip3 install virtualenvwrapper
```
> 通过virtualenv来创建虚拟环境时，不管是创建还是激活的时候都要先cd到具体的目录下去，这样显得不方便。可以使用virtualenvwrapper来管理虚拟环境。
### 3. 配置''.bashrc''文件

> Ubuntu中'.bashrc'文件默认位置在'~/.bashrc',属于隐藏文件，可按ctrl+h 显示隐藏文件。打开后在文件末尾加入此段内容。
>
> 如果安装了 Oh My Zsh  就在.zshrc中加
```bash
export VIRTUALENVWRAPPER_PYTHON=/usr/bin/python3
export WORKON_HOME=$HOME/.virtualenvs
source /usr/local/bin/virtualenvwrapper.sh
```
- > VIRTUALENVWRAPPER_PYTHON ： 指定python3解释器的路径
- > WORKON_HOME ： 指定虚拟环境的默认存放位置
- > source ：每次登录自动执行的脚本

### 4. 让'.bashrc'生效

```bash
source ~/.bashrc

source ~/.zshrc #安装了Oh My Zsh使用这个
```
> 若提示 bash:/home/.../local/bin/virtualenvwrappper.sh： No shch file or directory,其原因是你在安装virtualenvwrapper时，你没有在前面加上sudo，你可以使用sudo pip3 uninstall virtualenvwrapper将其卸载后，重新加上sudo命令重装，或将'.bashrc'文件中的source 换成如下语句。
```bash
source ~/.local/bin/virutalenvwrapper.sh
```
### 5. 创建虚拟环境

- python 2.7
```bash
mkvirtualenv VM_name # VM_name 表示你的虚拟环境的名称
```
- python 3.x
```bash
mkvirtualenv -p python3 VM_name
```

![](https://i.loli.net/2020/04/06/sOXyeLwzqWfAaEC.png)

###  6. 进入虚拟环境

> 在ubuntu 18中，创建好环境后，会自动进入你的虚拟环境。命令行前会出现你的虚拟环境名称。
```bash
workon VM_name  
```
![](https://i.loli.net/2020/04/06/HTWYtux3hVXaS1o.png)

### 7. 退出当前虚拟环境

```bash
deactivate
```
### 8. 其他虚拟环境命令

- 列出所有虚拟环境
```bash
lsvirtualenv
```
![](https://i.loli.net/2020/04/06/GL6fjrBHRlp83uz.png)

- 进入虚拟环境目录
```bash
cdvirtualenv
```
![](https://i.loli.net/2020/04/06/A3DZN1hGkX5962F.png)

- 进入虚拟环境的site-packages目录
```bash
cdsitepackages
```
- 删除虚拟环境
```bash
rmvirtualenv VM_name
```

![](https://i.loli.net/2020/04/06/J3VAn7ySR6kcQ1o.png)

## 二、windows用户

### 1.安装virtualenv

```bash
pip3 install virtualenv
```
### 2. 安装virtualenvwrapper

> 为了使用virtualenv更方便，可以借助 virtualenvwrapper

```bash
pip install virtualenvwrapper-win
```

#### 2.1 配置环境变量

如果不配置环境变量,创建后的虚拟环境默认存储在当前用户`(C:/Users/xxx)`下`Env`文件夹下，如果你想要把虚拟环境存储在你指定的存储路径，那么就修改环境变量

新建有一个变量名叫 `WORKON_HOME` ，变量值就是我们自定义存放虚拟环境的地址，然后点击保存，就ok了

注：一定要重新打开一个cmd，不重新打开还是会建在`(C:/Users/xxx)`下`Env`文件夹下，如果还是不行的话，重启哈电脑就可以了

![](https://i.loli.net/2020/04/09/xg3USrXAa6icpjb.png)

#### 2.2 创建虚拟环境

```bash
mkvirtualenv -p python3 VM_name

mkvirtualenv --python==D:\python\python.exe my_env #可以自己指定python路径
```

#### 2.3 切换到某个虚拟环境

```
workon my_env
```

#### 2.4 退出当前虚拟环境

```
deactivate
```

#### 2.5 删除某个虚拟环境

```
rmvritualenv my_env
```

#### 2.6 列出所有虚拟环境所在目录

```
lsvirtualenv
```

#### 2.7 进入到虚拟环境所在目录

```
cdvirtualenv
```

#### 2.8.将环境导入Pycharm

选择我们上面创建好的虚拟环境

![](../images/Python%E8%99%9A%E6%8B%9F%E7%8E%AF%E5%A2%83/image-20200406212847887.png)



### 3 不安装virtualenvwrapper

**注：如果不安装virtualenvwrapper,就使用下面方法创建虚拟环境，但是建议还是装上，装上使用的命令就跟上方linux使用命令一样**

#### 3.1 创建虚拟环境

> windows用户最好指定一个目录专门来存放创建的虚拟环境

```bash
F:
cd py_envs #这是我指定的专门存放虚拟环境的目录

virtualenv VM_name # VM_name 表示你的虚拟环境的名称

virtualenv VM_name --python==python3.6
virtualenv VM_name --python==python2.7
virtualenv VM_name --python=='D:\python\python3.6.exe'
```
####  3.2 进入虚拟环境

> 进入你的虚拟环境，命令行前会出现你的虚拟环境名称。

```bash
cd 虚拟环境的Scripts目录 #cd py_envs/Vm_name/Scripts

activate.bat #激活虚拟环境
```

![](../images/Python%E8%99%9A%E6%8B%9F%E7%8E%AF%E5%A2%83/image-20200406210729415.png)

#### 3.3 退出当前虚拟环境

```bash
cd 虚拟环境的Scripts目录 #cd py_envs/Vm_name/Scripts

deactivate.bat
```

## 三、Pycharm直接配置环境

![](https://i.loli.net/2020/04/06/unmKz8C4iXtQy3w.png)
