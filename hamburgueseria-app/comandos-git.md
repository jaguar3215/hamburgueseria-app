# Comandos Esenciales de Git

## Configuración Inicial

| Comando | Descripción |
|---------|-------------|
| `git config --global user.name "Tu Nombre"` | Configura tu nombre de usuario de forma global |
| `git config --global user.email "tu@email.com"` | Configura tu correo electrónico de forma global |
| `git config --list` | Muestra todas las configuraciones actuales |

## Creación y Clonación de Repositorios

| Comando | Descripción |
|---------|-------------|
| `git init` | Inicializa un nuevo repositorio Git en el directorio actual |
| `git clone https://github.com/usuario/repositorio.git` | Clona un repositorio remoto a tu máquina local |

## Operaciones Básicas

| Comando | Descripción |
|---------|-------------|
| `git status` | Muestra el estado actual del repositorio (archivos modificados, nuevos, eliminados) |
| `git add archivo.js` | Añade un archivo específico al área de preparación |
| `git add .` | Añade todos los archivos modificados al área de preparación |
| `git commit -m "Mensaje descriptivo"` | Guarda los cambios con un mensaje descriptivo |
| `git log` | Muestra el historial de commits |
| `git log --oneline` | Muestra el historial de commits en formato resumido |
| `git diff` | Muestra las diferencias entre los archivos modificados y la última versión guardada |

## Gestión de Ramas

| Comando | Descripción |
|---------|-------------|
| `git branch` | Muestra la lista de ramas existentes |
| `git branch nueva-rama` | Crea una nueva rama |
| `git checkout nombre-rama` | Cambia a una rama específica |
| `git checkout -b nueva-rama` | Crea una nueva rama y cambia a ella en un solo paso |
| `git merge nombre-rama` | Fusiona la rama especificada con la rama actual |
| `git branch -d nombre-rama` | Elimina una rama (si ya ha sido fusionada) |
| `git branch -D nombre-rama` | Fuerza la eliminación de una rama (aunque no haya sido fusionada) |

## Trabajo con Repositorios Remotos

| Comando | Descripción |
|---------|-------------|
| `git remote -v` | Muestra los repositorios remotos configurados |
| `git remote add origin https://github.com/usuario/repositorio.git` | Añade un repositorio remoto |
| `git push origin nombre-rama` | Envía tus cambios locales al repositorio remoto |
| `git pull origin nombre-rama` | Descarga y fusiona los cambios del repositorio remoto |
| `git fetch origin` | Descarga los cambios del repositorio remoto sin fusionarlos |

## Deshacer Cambios

| Comando | Descripción |
|---------|-------------|
| `git checkout -- archivo.js` | Descarta los cambios en un archivo específico |
| `git reset HEAD archivo.js` | Quita un archivo del área de preparación |
| `git reset --soft HEAD~1` | Deshace el último commit manteniendo los cambios en el área de preparación |
| `git reset --hard HEAD~1` | Elimina completamente el último commit y sus cambios (¡CUIDADO!) |
| `git revert commit-id` | Crea un nuevo commit que deshace los cambios de un commit específico |

## Guardar Cambios Temporalmente

| Comando | Descripción |
|---------|-------------|
| `git stash` | Guarda temporalmente los cambios no confirmados |
| `git stash list` | Muestra la lista de cambios guardados |
| `git stash apply` | Aplica los cambios guardados más recientes sin eliminarlos |
| `git stash pop` | Aplica los cambios guardados más recientes y los elimina |
| `git stash drop` | Elimina los cambios guardados más recientes |

## Etiquetas (Tags)

| Comando | Descripción |
|---------|-------------|
| `git tag` | Muestra todas las etiquetas |
| `git tag -a v1.0 -m "Versión 1.0"` | Crea una etiqueta anotada |
| `git push origin --tags` | Envía todas las etiquetas al repositorio remoto |

## Herramientas Avanzadas

| Comando | Descripción |
|---------|-------------|
| `git bisect start` | Inicia una búsqueda binaria para encontrar un commit problemático |
| `git cherry-pick commit-id` | Aplica los cambios de un commit específico a la rama actual |
| `git rebase nombre-rama` | Reorganiza el historial de commits (¡usar con precaución!) |
| `git reflog` | Muestra el historial de referencias de HEAD (útil para recuperación) |

## Consejos para evitar problemas

1. **Haz commits pequeños y frecuentes** con descripciones claras
2. **Revisa siempre qué estás confirmando** con `git status` y `git diff`
3. **Trabaja en ramas separadas** para nuevas características o correcciones
4. **Haz pull antes de empezar a trabajar** cada día
5. **Nunca uses `--force`** sin entender las consecuencias
6. **Configura bien tu `.gitignore`** para evitar subir archivos innecesarios
7. **Crea copias de seguridad** de tu repositorio regularmente

## Solución de problemas comunes

| Problema | Solución |
|----------|----------|
| Commit en la rama incorrecta | `git cherry-pick` para mover a la rama correcta |
| Commit con mensaje incorrecto | `git commit --amend` para editar el último commit |
| Archivos sensibles añadidos por error | Usar `.gitignore` y `git rm --cached` |
| Conflictos en la fusión | Resolver manualmente y luego `git add` + `git commit` |
