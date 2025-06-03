# 🐧 Comandos para Linux - Subir App.tsx a GitHub

## 🚀 Opción 1: Script Automático (Recomendado)

```bash
# Hacer el script ejecutable y correrlo
chmod +x deploy-linux.sh
./deploy-linux.sh
```

## 🔧 Opción 2: Comandos Manuales

### Paso 1: Verificar estado del repositorio
```bash
git status
```

### Paso 2: Agregar archivos modificados
```bash
git add src/App.tsx
```

### Paso 3: Crear commit con mensaje descriptivo
```bash
git commit -m "🐛 Fix: Resolver error 500 en App.tsx

Correcciones críticas aplicadas:
- Eliminar import duplicado de React
- Corregir estructura JSX malformada en header
- Estructurar correctamente elemento h1
- Asegurar referencia correcta a animación textGradient
- Limpiar tags HTML rotos y atributos mal ubicados

Fixes #500-error"
```

### Paso 4: Subir a GitHub
```bash
git push origin main
```

## 🆘 Si es tu primer push o no tienes remote configurado:

### Configurar repositorio remoto:
```bash
git remote add origin https://github.com/tu-usuario/tu-repositorio.git
```

### Configurar usuario (si no está configurado):
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

### Push inicial:
```bash
git push -u origin main
```

## 🔍 Comandos de verificación:

### Ver estado actual:
```bash
git status
```

### Ver historial de commits:
```bash
git log --oneline -5
```

### Ver archivos modificados:
```bash
git diff --name-only
```

### Ver remotes configurados:
```bash
git remote -v
```

## ⚡ Comando Todo-en-Uno (Copia y Pega):

```bash
# Comando completo para ejecutar de una vez
git add src/App.tsx && git commit -m "🐛 Fix: Resolver error 500 en App.tsx - Eliminar import duplicado de React - Corregir estructura JSX malformada - Fixes #500-error" && git push origin main
```

## 📋 Checklist de Verificación:

- [ ] ✅ Archivo App.tsx agregado al staging area
- [ ] ✅ Commit creado con mensaje descriptivo  
- [ ] ✅ Push exitoso a GitHub
- [ ] ✅ Verificar cambios en GitHub web
- [ ] ✅ Probar aplicación sin error 500

## 🎯 Resultado Esperado:

Después de ejecutar estos comandos:
1. Los cambios estarán en tu repositorio de GitHub
2. El error 500 estará resuelto
3. Las animaciones de gradiente funcionarán correctamente
4. La aplicación cargará sin problemas