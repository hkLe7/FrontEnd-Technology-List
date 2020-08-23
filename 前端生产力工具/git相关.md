### git 相关

#### git reflog和 git log

* git log 

git log 命令可以显示所有提交过的版本信息，加参数 --pretty=oneline，只会现实版本号和提交的备注信息

* git reflog
git reflog 命令可以查看所有分支的所有git操作记录（包括已经被删除的commit 记录和 reset 的操作）

#### git reset 和 git **revert**
* git reset

回滚到之前提交的某个版本，恢复的是此版本前的commit

```
git reset --hard 版本号
```
* git revert
基于之前的某个版本创建一个新版本，同时保留该版本后面的版本，记录整个版本变动流程
```
git revert -n 版本号
git add 
git commit -m 
```

#### git rebase
把本地未push的commit历史整理成直线，目的是为了让我们在查看git历史提交的变化时候更容易，因为分支的提交需要三方对比，但一定注意只在本地commit进行此操作

#### git cherry-pick
选择某一个分支中的一个或几个commit(s)来进行操作
```
git cherry-pick 版本号
```
