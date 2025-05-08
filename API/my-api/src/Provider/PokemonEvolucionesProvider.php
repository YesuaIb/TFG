<?php

namespace App\Provider;

use App\Dto\PokemonEvolucionesDto;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use PDO;

class PokemonEvolucionesProvider implements ProviderInterface
{
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): ?PokemonEvolucionesDto
    {
        $id = $uriVariables['id'] ?? null;

        if (!$id) {
            return null;
        }

        $pdo = new PDO(
            'mysql:host=db;dbname=api_db;charset=utf8mb4',
            'root',
            'root',
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]
        );

        // Obtener el Pokémon actual
        $stmt = $pdo->prepare("SELECT ID_Pokemon, Nombre, Imagen, Evoluciona FROM Pokemon WHERE ID_Pokemon = ?");
        $stmt->execute([$id]);
        $actual = $stmt->fetch();

        if (!$actual) {
            return null;
        }

        // Buscar el inicio de la línea evolutiva
        $base = $actual;
        while ($base['Evoluciona']) {
            $stmt = $pdo->prepare("SELECT ID_Pokemon, Nombre, Imagen, Evoluciona FROM Pokemon WHERE ID_Pokemon = ?");
            $stmt->execute([$base['Evoluciona']]);
            $base = $stmt->fetch();
            if (!$base) break;
        }

        $linea = [];

        // Añadir el Pokémon base
        $linea[] = [
            'nombre' => $base['Nombre'],
            'imagen' => $base['Imagen']
        ];

        // Buscar todas las evoluciones del base
        $stmt = $pdo->prepare("SELECT ID_Pokemon, Nombre, Imagen FROM Pokemon WHERE Evoluciona = ?");
        $stmt->execute([$base['ID_Pokemon']]);
        $primerNivel = $stmt->fetchAll();

        foreach ($primerNivel as $evo) {
            $linea[] = [
                'nombre' => $evo['Nombre'],
                'imagen' => $evo['Imagen']
            ];

            // Buscar evoluciones de cada uno (nivel 2)
            $stmt2 = $pdo->prepare("SELECT ID_Pokemon, Nombre, Imagen FROM Pokemon WHERE Evoluciona = ?");
            $stmt2->execute([$evo['ID_Pokemon']]);
            $siguientes = $stmt2->fetchAll();

            foreach ($siguientes as $evo2) {
                $linea[] = [
                    'nombre' => $evo2['Nombre'],
                    'imagen' => $evo2['Imagen']
                ];
            }
        }

        $dto = new PokemonEvolucionesDto();
        $dto->lineaEvolutiva = $linea;

        return $dto;
    }
}
