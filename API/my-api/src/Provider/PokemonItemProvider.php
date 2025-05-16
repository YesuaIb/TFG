<?php

namespace App\Provider;

use App\Dto\PokemonDto;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use PDO;

class PokemonItemProvider implements ProviderInterface
{
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): ?PokemonDto
    {
        $id = isset($uriVariables['id']) ? (int) $uriVariables['id'] : null;

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

        $stmt = $pdo->prepare("
            SELECT p.ID_Pokemon, p.Nombre, p.Imagen, p.`Imagen 2D`, p.Gif, p.Descripcion, p.Altura, p.Peso, p.Habilidades, p.HabilidadOculta, p.Especie, p.Generacion, GROUP_CONCAT(t.Nombre) AS Tipos, GROUP_CONCAT(t.Icono) AS Iconos 
            FROM Pokemon p 
            LEFT JOIN Pokemon_Tipo pt ON p.ID_Pokemon = pt.ID_Pokemon 
            LEFT JOIN Tipos t ON pt.ID_Tipo = t.ID_Tipos 
            WHERE p.ID_Pokemon = ? 
            GROUP BY p.ID_Pokemon
        ");
        $stmt->execute([$id]);
        $pokemon = $stmt->fetch();

        if (!$pokemon) {
            return null;
        }

        $dto = new PokemonDto();
        $dto->id = (int) $pokemon['ID_Pokemon'];
        $dto->nombre = $pokemon['Nombre'];
        $dto->imagen = $pokemon['Imagen'];
        $dto->icono = $pokemon['Imagen 2D'];
        $dto->gif = $pokemon['Gif'];
        $dto->descripcion = $pokemon['Descripcion'];
        $dto->altura = (int) $pokemon['Altura'];
        $dto->peso = (int) $pokemon['Peso'];
        $dto->habilidades = $pokemon['Habilidades'] ? explode(',', $pokemon['Habilidades']) : [];
        $dto->habilidadOculta = $pokemon['HabilidadOculta'];
        $dto->especie = $pokemon['Especie'];
        $dto->generacion = $pokemon['Generacion'];

        $tipos = $pokemon['Tipos'] ? explode(',', $pokemon['Tipos']) : [];
        $iconos = $pokemon['Iconos'] ? explode(',', $pokemon['Iconos']) : [];

        $dto->tipos = [];

        foreach ($tipos as $i => $tipo) {
            if (trim($tipo) !== '') {
                $dto->tipos[] = [
                    'nombre' => $tipo,
                    'icono' => $iconos[$i] ?? null,
                ];
            }
        }

        return $dto;
    }
}
