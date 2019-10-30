@echo off
:: 设置压缩JS文件的根目录，会自动压缩所有的JS文件
SET JSFOLDER=C:\Users\fooww\Desktop\uglify\fooww1911\js
chdir /d %JSFOLDER%
for /r . %%a in (*.js) do (
@echo 正在压缩 %%~a ...
uglifyjs %%~fa -m -o %%~fa
)
echo 完成!
pause & exit