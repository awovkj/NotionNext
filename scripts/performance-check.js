#!/usr/bin/env node

/**
 * 性能检查脚本
 * 用于检测项目中的性能问题
 */

const fs = require('fs')
const path = require('path')

console.log('🚀 开始性能检查...\n')

const checks = []

// 检查1: 大文件检测
function checkLargeFiles() {
  console.log('📦 检查大文件...')
  const largeFiles = []
  const maxSize = 100 * 1024 // 100KB

  function scanDir(dir, baseDir = '') {
    const files = fs.readdirSync(dir)
    files.forEach(file => {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      
      if (stat.isDirectory()) {
        if (!file.includes('node_modules') && !file.includes('.next') && !file.includes('.git')) {
          scanDir(filePath, path.join(baseDir, file))
        }
      } else if (stat.isFile() && (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx'))) {
        if (stat.size > maxSize) {
          largeFiles.push({
            path: path.join(baseDir, file),
            size: (stat.size / 1024).toFixed(2) + 'KB'
          })
        }
      }
    })
  }

  scanDir(process.cwd())

  if (largeFiles.length > 0) {
    console.log('  ⚠️  发现大文件:')
    largeFiles.forEach(file => {
      console.log(`     ${file.path}: ${file.size}`)
    })
    checks.push({ name: '大文件检查', status: 'warning', count: largeFiles.length })
  } else {
    console.log('  ✅ 没有发现过大的文件\n')
    checks.push({ name: '大文件检查', status: 'pass' })
  }
}

// 检查2: 未使用的依赖
function checkDependencies() {
  console.log('\n📚 检查依赖使用情况...')
  const packageJson = require('../package.json')
  const deps = Object.keys(packageJson.dependencies || {})
  
  console.log(`  ℹ️  共有 ${deps.length} 个生产依赖`)
  console.log(`  💡 建议定期使用 'npm prune' 清理未使用的依赖\n`)
  
  checks.push({ name: '依赖检查', status: 'info', count: deps.length })
}

// 检查3: 图片优化
function checkImages() {
  console.log('🖼️  检查图片资源...')
  let totalSize = 0
  let imageCount = 0
  const largeImages = []

  function scanImages(dir) {
    const files = fs.readdirSync(dir)
    files.forEach(file => {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      
      if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('.next')) {
        scanImages(filePath)
      } else if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)) {
        imageCount++
        totalSize += stat.size
        
        if (stat.size > 200 * 1024) { // 200KB
          largeImages.push({
            path: filePath.replace(process.cwd(), ''),
            size: (stat.size / 1024).toFixed(2) + 'KB'
          })
        }
      }
    })
  }

  const publicDir = path.join(process.cwd(), 'public')
  if (fs.existsSync(publicDir)) {
    scanImages(publicDir)
  }

  console.log(`  ℹ️  找到 ${imageCount} 张图片，总大小: ${(totalSize / 1024 / 1024).toFixed(2)}MB`)
  
  if (largeImages.length > 0) {
    console.log('  ⚠️  发现大图片 (>200KB):')
    largeImages.slice(0, 5).forEach(img => {
      console.log(`     ${img.path}: ${img.size}`)
    })
    if (largeImages.length > 5) {
      console.log(`     ... 还有 ${largeImages.length - 5} 个`)
    }
    checks.push({ name: '图片优化', status: 'warning', count: largeImages.length })
  } else {
    console.log('  ✅ 图片大小合理\n')
    checks.push({ name: '图片优化', status: 'pass' })
  }
}

// 检查4: console.log检测
function checkConsoleLogs() {
  console.log('\n🔍 检查console.log...')
  let consoleCount = 0

  function scanFiles(dir) {
    const files = fs.readdirSync(dir)
    files.forEach(file => {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      
      if (stat.isDirectory()) {
        if (!file.includes('node_modules') && !file.includes('.next') && file !== 'scripts') {
          scanFiles(filePath)
        }
      } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
        const content = fs.readFileSync(filePath, 'utf8')
        const matches = content.match(/console\.log/g)
        if (matches) {
          consoleCount += matches.length
        }
      }
    })
  }

  scanFiles(process.cwd())

  if (consoleCount > 0) {
    console.log(`  ⚠️  发现 ${consoleCount} 个 console.log`)
    console.log('  💡 生产环境建议移除console.log')
    checks.push({ name: 'console检查', status: 'warning', count: consoleCount })
  } else {
    console.log('  ✅ 没有发现console.log\n')
    checks.push({ name: 'console检查', status: 'pass' })
  }
}

// 执行所有检查
checkLargeFiles()
checkDependencies()
checkImages()
checkConsoleLogs()

// 总结
console.log('\n' + '='.repeat(50))
console.log('📊 检查总结:\n')

checks.forEach(check => {
  const icon = check.status === 'pass' ? '✅' : check.status === 'warning' ? '⚠️' : 'ℹ️'
  const count = check.count ? ` (${check.count})` : ''
  console.log(`  ${icon} ${check.name}${count}`)
})

const warnings = checks.filter(c => c.status === 'warning').length
console.log(`\n总计: ${checks.length} 项检查, ${warnings} 个警告`)

if (warnings > 0) {
  console.log('\n💡 建议查看上述警告并进行优化')
  process.exit(1)
} else {
  console.log('\n🎉 所有检查通过!')
  process.exit(0)
}
