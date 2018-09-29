# duplicate-removel
一次nodejs命令行工具开发的尝试

**功能---删除重复文件并可选的在执行完后删除空白文件夹**

## 安装
```
    npm install -g duplicate-removel
```

## 使用
```
  Usage: dr [options]

    去除文件夹下重复的文件

  Options:

    -V, --version           output the version number
    -V, --version           工具版本号
    -i, --ignore <dirname>  忽略的文件夹(以,连接多个)
    -r, --reomve            是否直接删除重复文件(默认移动到统一文件夹)
    -h, --help              output usage information

  Example:

    $ dr -i node_modules,.git
    $ dr -i node_modules,.git -r

```

***注意***

1.此工具用到了Linux下的du命令,所以请在Linux环境下使用(ps: Windows下的git Bash也行,亲测有效)

2.对于windows下带有某些特殊符号的路径,del模块无法删除,会启用nodejs的fs模块自带的rmdir方法删除,所以有时会造成多层嵌套的空目录无法删除