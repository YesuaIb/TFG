#!/bin/bash

echo "📁 Verificando ruta del archivo de comando..."
if [ -f src/Command/ImportPokemonsPDOCommand.php ]; then
  echo "✅ Archivo encontrado: src/Command/ImportPokemonsPDOCommand.php"
else
  echo "❌ El archivo NO está en la ruta correcta."
  exit 1
fi

echo "🔍 Comprobando sintaxis del archivo..."
php -l src/Command/ImportPokemonsPDOCommand.php || exit 1

echo "🔄 Ejecutando composer dump-autoload..."
composer dump-autoload

echo "📋 Buscando el comando registrado..."
php bin/console list | grep import

echo "🚀 Ejecutando el comando si está disponible..."
php bin/console app:import-pokemons-pdo
