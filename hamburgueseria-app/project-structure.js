const fs = require('fs');
const path = require('path');

class ProjectStructure {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.ignoredDirs = [
      'node_modules', 
      '.git', 
      '.vscode', 
      '.idea', 
      'dist', 
      'build', 
      'coverage',
      '.next',
      '.nuxt'
    ];
  }

  // Método para ignorar directorios
  shouldIgnoreDir(dirName) {
    return this.ignoredDirs.includes(dirName) || 
           dirName.startsWith('.') || 
           dirName.startsWith('_');
  }

  // Método para generar la estructura del proyecto
  generateStructure(dirPath = this.rootPath, prefix = '') {
    let structure = '';
    
    try {
      const files = fs.readdirSync(dirPath);
      
      files.forEach((file, index) => {
        // Decidir si es el último elemento para formateo
        const isLast = index === files.length - 1;
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Ignorar directorios especificados
          if (this.shouldIgnoreDir(file)) return;
          
          // Agregar directorio
          structure += `${prefix}${isLast ? '└── ' : '├── '}${file}/\n`;
          
          // Recursivamente agregar contenido del directorio
          structure += this.generateStructure(
            fullPath, 
            prefix + (isLast ? '    ' : '│   ')
          );
        } else {
          // Agregar archivo
          structure += `${prefix}${isLast ? '└── ' : '├── '}${file}\n`;
        }
      });
      
      return structure;
    } catch (error) {
      console.error(`Error al generar estructura: ${error.message}`);
      return '';
    }
  }

  // Método para generar informe detallado
  generateDetailedReport(dirPath = this.rootPath) {
    const report = {
      totalFiles: 0,
      totalDirectories: 0,
      fileTypes: {},
      largestFiles: []
    };

    const traverseDirectory = (currentPath) => {
      try {
        const files = fs.readdirSync(currentPath);
        
        files.forEach(file => {
          const fullPath = path.join(currentPath, file);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            // Ignorar directorios especificados
            if (this.shouldIgnoreDir(file)) return;
            
            report.totalDirectories++;
            traverseDirectory(fullPath);
          } else {
            report.totalFiles++;
            
            // Contar tipos de archivos
            const ext = path.extname(file).toLowerCase();
            report.fileTypes[ext] = (report.fileTypes[ext] || 0) + 1;
            
            // Registrar archivos más grandes
            const fileSize = stat.size;
            report.largestFiles.push({ 
              path: fullPath, 
              size: fileSize 
            });
          }
        });
      } catch (error) {
        console.error(`Error al generar reporte: ${error.message}`);
      }
    };

    traverseDirectory(dirPath);

    // Ordenar archivos más grandes
    report.largestFiles.sort((a, b) => b.size - a.size);
    report.largestFiles = report.largestFiles.slice(0, 10);

    return report;
  }

  // Método principal para mostrar estructura y generar reporte
  displayProjectStructure() {
    console.log('Estructura del Proyecto:');
    console.log(this.generateStructure());
    
    console.log('\nReporte Detallado:');
    const report = this.generateDetailedReport();
    
    console.log('\nResumen:');
    console.log(`Total de Directorios: ${report.totalDirectories}`);
    console.log(`Total de Archivos: ${report.totalFiles}`);
    
    console.log('\nTipos de Archivos:');
    Object.entries(report.fileTypes)
      .sort((a, b) => b[1] - a[1])
      .forEach(([ext, count]) => {
        console.log(`  ${ext || '(sin extensión)'}: ${count}`);
      });
    
    console.log('\n10 Archivos Más Grandes:');
    report.largestFiles.forEach((file, index) => {
      const sizeInKB = (file.size / 1024).toFixed(2);
      console.log(`  ${index + 1}. ${file.path}: ${sizeInKB} KB`);
    });
  }
}

// Uso del script
const projectPath = process.argv[2] || process.cwd();
const projectStructure = new ProjectStructure(projectPath);
projectStructure.displayProjectStructure();