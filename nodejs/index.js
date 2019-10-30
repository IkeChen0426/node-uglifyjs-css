const fs = require('fs')
const path = require('path')
const UglifyJS = require('uglify-js')
const CleanCSS = require('clean-css')
const distDir = path.join(__dirname, './dist') // 压缩后的目录
const sourceDir = path.join(__dirname, '../fooww1911') // 项目源代码
deleteFolder(distDir) // 清楚打包后的目录
// 清除目录
function deleteFolder (paths) {
  var files = []
  if (fs.existsSync(paths)) {
    files = fs.readdirSync(paths)
    files.forEach(function (file, index) {
      var curPath = paths + '/' + file
      if (fs.statSync(curPath).isDirectory()) {
        // recurse
        deleteFolder(curPath)
      } else {
        // delete file
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(paths)
  }
}

var copyFile = function (srcPath, tarPath, cb) {
  var rs = fs.createReadStream(srcPath)
  rs.on('error', function (err) {
    if (err) {
      console.log('read error', srcPath)
    }
    cb && cb(err)
  })

  var ws = fs.createWriteStream(tarPath)
  ws.on('error', function (err) {
    if (err) {
      console.log('write error', tarPath)
    }
    cb && cb(err)
  })
  ws.on('close', function (ex) {
    cb && cb(ex)
  })

  rs.pipe(ws)
}
var copyFolder = function (srcDir, tarDir, cb) {
  fs.readdir(srcDir, function (err, files) {
    var count = 0
    var checkEnd = function () {
      ++count == files.length && cb && cb()
    }

    if (err) {
      checkEnd()
      return
    }

    files.forEach(function (file) {
      var srcPath = path.join(srcDir, file)
      var tarPath = path.join(tarDir, file)

      fs.stat(srcPath, function (err, stats) {
        if (stats.isDirectory()) {
          console.log('mkdir', tarPath)
          fs.mkdir(tarPath, function(err) {
            if (err) {
              console.log(err)
              return
            }
            copyFolder(srcPath, tarPath, checkEnd)
          })
        } else {
          copyFile(srcPath, tarPath, checkEnd)
        }
      })
    })

    // 为空时直接回调
    files.length === 0 && cb && cb()
  })
}
// 创建dist目录
function creatDir (dir) {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, function (err) {
      if (err) {
        reject(err)
      } else {
        console.log('目录创建成功。')
        resolve()
      }
    })
  })
}
creatDir(distDir)
  .then(() => {
    copyFolder(sourceDir, distDir, function (err) {
      if (err) {
        return
      }
      console.log('处理完了')
      fileDisplay(distDir)
    })
  })
  .catch(err => {})

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
function fileDisplay (filePath) {
  // 根据文件路径读取文件，返回文件列表
  fs.readdir(filePath, function (err, files) {
    if (err) {
      console.warn(err)
    } else {
      // 遍历读取到的文件列表
      files.forEach(function (filename) {
        // 获取当前文件的绝对路径
        var filedir = path.join(filePath, filename)
        // 根据文件路径获取文件信息，返回一个fs.Stats对象
        fs.stat(filedir, function (eror, stats) {
          if (eror) {
            console.warn('获取文件stats失败')
          } else {
            var isFile = stats.isFile() // 是文件
            var isDir = stats.isDirectory() // 是文件夹
            if (isFile && /\.js/.test(filedir)) {
              // 压缩js
              console.log(filedir)
              fs.readFile(filedir, 'utf8', function (err, data) {
                if (err) {
                  throw err
                }
                var result = UglifyJS.minify(data)
                if (result.code) {
                  fs.writeFile(filedir, result.code, function () {
                    console.log('编译完成success')
                  })
                }
              })
            }

            if (isFile && /\.css/.test(filedir)) {
              // 压缩css
              console.log(filedir)
              fs.readFile(filedir, 'utf8', function (err, data) {
                if (err) {
                  throw err
                }
                new CleanCSS().minify(data, function (err, output) {
                  if(err) {
                    throw err
                  }
                  fs.writeFile(filedir, output.styles, function () {
                    console.log('编译完成success')
                  })
                })
              })
            }

            if (isDir) {
              fileDisplay(filedir) // 递归，如果是文件夹，就继续遍历该文件夹下面的文件
            }
          }
        })
      })
    }
  })
}
