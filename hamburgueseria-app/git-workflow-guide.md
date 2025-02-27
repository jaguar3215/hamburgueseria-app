# Guía Completa de Trabajo con Ramas en Git

## Configuración Inicial

### 1. Configurar Nombre de Usuario y Correo
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu.correo@ejemplo.com"
```

## Crear y Gestionar Ramas

### Crear una Nueva Rama
```bash
# Opción 1: Crear rama
git branch nombre_rama

# Opción 2: Crear y cambiar a la rama inmediatamente
git checkout -b nombre_rama
```

### Cambiar Entre Ramas
```bash
# Cambiar a una rama existente
git checkout nombre_rama

# Listar todas las ramas
git branch

# Listar ramas locales y remotas
git branch -a
```

## Trabajo en la Rama

### Flujo de Trabajo Básico
```bash
# Verificar estado de los archivos
git status

# Agregar archivos modificados
git add .

# Hacer commit de los cambios
git commit -m "Descripción clara de los cambios"
```

### Subir Rama al Repositorio Remoto
```bash
# Subir rama por primera vez
git push -u origin nombre_rama

# Subir cambios posteriores
git push origin nombre_rama
```

## Fusionar Ramas

### Método 1: Fusión Directa
```bash
# Cambiar a la rama principal
git checkout main

# Actualizar rama principal
git pull origin main

# Fusionar rama de características
git merge nombre_rama

# Subir cambios fusionados
git push origin main
```

### Método 2: Rebase (Método de Limpieza)
```bash
# En la rama de características
git checkout nombre_rama
git rebase main

# Cambiar a main y hacer merge
git checkout main
git merge nombre_rama
```

## Eliminar Ramas

### Eliminar Rama Local
```bash
# Si la rama ya está fusionada
git branch -d nombre_rama

# Si la rama no está fusionada (forzar eliminación)
git branch -D nombre_rama
```

### Eliminar Rama Remota
```bash
git push origin --delete nombre_rama
```

## Recuperación y Resolución de Problemas

### Ver Historial de Commits
```bash
# Historial completo
git log

# Historial resumido
git log --oneline
```

### Deshacer Cambios

#### Descartar Cambios Locales
```bash
# Descartar cambios en un archivo
git checkout -- nombre_archivo

# Descartar todos los cambios locales
git reset --hard HEAD
```

#### Volver a un Commit Anterior
```bash
# Volver sin perder cambios locales
git reset --soft hash_del_commit

# Volver descartando cambios locales
git reset --hard hash_del_commit
```

## Buenas Prácticas

1. Crear ramas para cada característica o corrección
2. Mantener la rama `main` siempre estable
3. Hacer commits pequeños y significativos
4. Usar nombres descriptivos para ramas
5. Revisar cambios antes de fusionar

## Ejemplo de Flujo de Trabajo Completo

```bash
# Crear rama para nueva característica
git checkout -b feature/nueva-autenticacion

# Hacer cambios
git add .
git commit -m "Implementar nuevo sistema de autenticación"

# Subir rama
git push -u origin feature/nueva-autenticacion

# Cuando esté lista para fusionar
git checkout main
git pull origin main
git merge feature/nueva-autenticacion
git push origin main

# Eliminar rama
git branch -d feature/nueva-autenticacion
git push origin --delete feature/nueva-autenticacion
```

## Consejos Finales

- Comunica con tu equipo antes de fusionar ramas
- Realiza pruebas antes de fusionar
- Mantén tus ramas actualizadas con la rama principal
- No fusiones código que no esté completamente probado

**¡Feliz codificación!**
