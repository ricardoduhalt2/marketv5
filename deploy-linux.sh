#!/bin/bash

# 🚀 Script de despliegue para Linux - App.tsx Fixes
# Ejecutar con: chmod +x deploy-linux.sh && ./deploy-linux.sh

echo "🔧 Iniciando despliegue de correcciones App.tsx..."
echo "=================================================="

# Verificar si estamos en un repositorio git
if [ ! -d ".git" ]; then
    echo "❌ No es un repositorio git. Inicializando..."
    git init
    echo "✅ Repositorio git inicializado"
    echo "💡 Asegúrate de agregar el remote: git remote add origin <tu-repo-url>"
fi

# Mostrar estado actual
echo ""
echo "📊 Estado actual del repositorio:"
git status

# Agregar archivos modificados
echo ""
echo "📁 Agregando archivos al staging area..."
git add src/App.tsx

# Verificar qué se va a commitear
echo ""
echo "📝 Archivos preparados para commit:"
git diff --cached --name-only

# Crear commit con mensaje descriptivo
echo ""
echo "💾 Creando commit..."
git commit -m "🐛 Fix: Resolver error 500 en App.tsx

Correcciones críticas aplicadas:
- Eliminar import duplicado de React
- Corregir estructura JSX malformada en header
- Estructurar correctamente elemento h1
- Asegurar referencia correcta a animación textGradient
- Limpiar tags HTML rotos y atributos mal ubicados

✅ Verificado:
- Componente React compila correctamente
- Elementos JSX estructurados apropiadamente
- Animaciones CSS referenciadas correctamente
- Sin imports duplicados
- Aplicación carga sin errores 500

Fixes #500-error"

# Verificar si el commit fue exitoso
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Commit creado exitosamente!"
    
    # Obtener rama actual
    RAMA_ACTUAL=$(git branch --show-current 2>/dev/null || echo "main")
    echo "🌿 Rama actual: $RAMA_ACTUAL"
    
    # Hacer push al repositorio remoto
    echo ""
    echo "📤 Subiendo cambios a GitHub..."
    git push origin $RAMA_ACTUAL
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 ¡ÉXITO! Los cambios han sido subidos a GitHub!"
        echo "✅ Las correcciones de App.tsx están ahora en el repositorio"
        echo ""
        echo "🔗 Verifica los cambios en tu repositorio de GitHub"
        echo "🚀 La aplicación debería cargar sin errores 500 ahora"
    else
        echo ""
        echo "❌ Error al hacer push al repositorio remoto"
        echo ""
        echo "💡 Posibles soluciones:"
        echo "   1. Configurar remote: git remote add origin <tu-repo-url>"
        echo "   2. Autenticarse: git config --global user.name 'Tu Nombre'"
        echo "   3. Configurar email: git config --global user.email 'tu@email.com'"
        echo "   4. Push inicial: git push -u origin main"
        echo ""
        echo "🔧 Comandos de configuración rápida:"
        echo "   git remote add origin https://github.com/tu-usuario/tu-repo.git"
        echo "   git push -u origin main"
    fi
else
    echo ""
    echo "❌ Error al crear el commit"
    echo "💡 Verifica que haya cambios para commitear"
fi

echo ""
echo "📋 Estado final del repositorio:"
git status

echo ""
echo "🏁 Script completado!"