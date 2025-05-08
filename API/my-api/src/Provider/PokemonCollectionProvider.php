<?php

namespace App\Provider;

use App\Dto\PokemonDto;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use PDO;

class PokemonCollectionProvider implements ProviderInterface
{
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): array
    {
        $pdo = new PDO(
            'mysql:host=db;dbname=api_db;charset=utf8mb4',
            'root',
            'root',
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]
        );

        $stmt = $pdo->query("
        SELECT p.ID_Pokemon, p.Nombre, p.Imagen, p.`Imagen 2D`, p.Gif, p.Descripcion,         
            GROUP_CONCAT(t.Nombre) AS Tipos,
            GROUP_CONCAT(t.Icono) AS Iconos
        FROM Pokemon p
        LEFT JOIN Pokemon_Tipo pt ON p.ID_Pokemon = pt.ID_Pokemon
        LEFT JOIN Tipos t ON pt.ID_Tipo = t.ID_Tipos
        GROUP BY p.ID_Pokemon
        ORDER BY p.ID_Pokemon
        ");
        $pokemons = $stmt->fetchAll();

        $result = [];
        foreach ($pokemons as $pokemon) {
            $dto = new PokemonDto();
            $dto->id = (int) $pokemon['ID_Pokemon'];
            $dto->nombre = $pokemon['Nombre'];
            $dto->imagen = $pokemon['Imagen'];
            $dto->icono = $pokemon['Imagen 2D'];
            $dto->gif = $pokemon['Gif'];
            $dto->descripcion = $pokemon['Descripcion'];
            $tipos = $pokemon['Tipos'] ? explode(',', $pokemon['Tipos']) : [];
            $iconos = $pokemon['Iconos'] ? explode(',', $pokemon['Iconos']) : [];

            $dto->tipos = [];

            foreach ($tipos as $index => $tipo) {
                if (trim($tipo) !== '') {
                    $dto->tipos[] = [
                        'nombre' => $tipo,
                        'icono' => $iconos[$index] ?? null,
                    ];
                }
            }

            $result[] = $dto;
        }

        return $result;
    }
}
