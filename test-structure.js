#!/usr/bin/env node
/**
 * Package structure validation test
 */

const fs = require('fs')
const path = require('path')

console.log('🧪 Testing Learning Package Structure\n')

const basePath = './packages/learning'

function checkFile(filePath, description) {
  const fullPath = path.join(basePath, filePath)
  if (fs.existsSync(fullPath)) {
    console.log(`   ✅ ${description}`)
    return true
  } else {
    console.log(`   ❌ ${description} - FILE MISSING`)
    return false
  }
}

function checkDirectory(dirPath, description) {
  const fullPath = path.join(basePath, dirPath)
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
    console.log(`   ✅ ${description}`)
    return true
  } else {
    console.log(`   ❌ ${description} - DIRECTORY MISSING`)
    return false
  }
}

let allTestsPassed = true

console.log('📁 1. Checking Core Package Structure...')
allTestsPassed &= checkFile('package.json', 'Package configuration')
allTestsPassed &= checkFile('src/index.ts', 'Main package export')
allTestsPassed &= checkDirectory('src/types', 'Types directory')
allTestsPassed &= checkDirectory('src/services', 'Services directory')
allTestsPassed &= checkDirectory('src/components', 'Components directory')
allTestsPassed &= checkDirectory('src/data', 'Data directory')

console.log('\n📋 2. Checking Type Definitions...')
allTestsPassed &= checkFile('src/types/index.ts', 'Types index export')
allTestsPassed &= checkFile('src/types/Module.ts', 'Learning module types')
allTestsPassed &= checkFile('src/types/Exercise.ts', 'Exercise types')
allTestsPassed &= checkFile('src/types/Vocabulary.ts', 'Vocabulary types')
allTestsPassed &= checkFile('src/types/Progress.ts', 'Progress tracking types')
allTestsPassed &= checkFile('src/types/Achievement.ts', 'Achievement types')

console.log('\n🔧 3. Checking Service Layer...')
allTestsPassed &= checkFile('src/services/index.ts', 'Services index export')
allTestsPassed &= checkFile('src/services/LearningService.ts', 'Learning service')
allTestsPassed &= checkFile('src/services/VocabularyService.ts', 'Vocabulary service')
allTestsPassed &= checkFile('src/services/ProgressService.ts', 'Progress service')
allTestsPassed &= checkFile('src/services/AchievementService.ts', 'Achievement service')

console.log('\n🎨 4. Checking Component Layer...')
allTestsPassed &= checkFile('src/components/index.ts', 'Components index export')
allTestsPassed &= checkDirectory('src/components/exercises', 'Exercises components directory')
allTestsPassed &= checkFile('src/components/exercises/index.ts', 'Exercises index export')
allTestsPassed &= checkFile('src/components/exercises/MatchingExercise.svelte', 'Matching exercise component')
allTestsPassed &= checkFile('src/components/exercises/MultipleChoiceExercise.svelte', 'Multiple choice exercise component')
allTestsPassed &= checkFile('src/components/exercises/SpellingExercise.svelte', 'Spelling exercise component')

console.log('\n📊 5. Checking Data Layer...')
allTestsPassed &= checkFile('src/data/german-vocabulary.ts', 'German vocabulary dataset')

console.log('\n🗄️ 6. Checking Database Schema...')
allTestsPassed &= checkFile('../database/migrations/20250831_create_learning_system.sql', 'Learning system migration')

console.log('\n📄 7. Checking Configuration Files...')
allTestsPassed &= checkFile('tsconfig.json', 'TypeScript configuration')

// Count files and provide statistics
const countFiles = (dir, ext) => {
  const fullPath = path.join(basePath, dir)
  if (!fs.existsSync(fullPath)) return 0
  return fs.readdirSync(fullPath).filter(f => f.endsWith(ext)).length
}

console.log('\n📊 Package Statistics:')
console.log(`   TypeScript files: ${countFiles('src/types', '.ts')} types, ${countFiles('src/services', '.ts')} services`)
console.log(`   Svelte components: ${countFiles('src/components/exercises', '.svelte')} exercises`)
console.log(`   Data files: ${countFiles('src/data', '.ts')} datasets`)

if (allTestsPassed) {
  console.log('\n🎉 PACKAGE STRUCTURE VALIDATION PASSED ✅')
  console.log('All essential files and directories are present!')
} else {
  console.log('\n❌ PACKAGE STRUCTURE VALIDATION FAILED')
  console.log('Some files or directories are missing.')
}