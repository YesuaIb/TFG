<?php

namespace App\Provider;

use App\Dto\EquipoDto;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use PDO;

class EquipoCollectionProvider implements ProviderInterface
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
            SELECT e.ID_Equipo, e.Nombre_Equipo, e.Numero_Equipo,
                    u.ID_Usuario, u.Nombre AS UsuarioNombre
            FROM Equipo e
            JOIN Usuario u ON e.ID_Usuario = u.ID_Usuario
        ");
        $equiposRaw = $stmt->fetchAll();

        $result = [];

        foreach ($equiposRaw as $equipo) {
            $dto = new EquipoDto();
            $dto->id = (int) $equipo['ID_Equipo'];
            $dto->nombre = $equipo['Nombre_Equipo'];
            $dto->numero = $equipo['Numero_Equipo'];
            $dto->usuario = [
                'id' => (int) $equipo['ID_Usuario'],
                'nombre' => $equipo['UsuarioNombre']
            ];

            // Obtener Pokémon del equipo
            $stmtPokemons = $pdo->prepare("
                SELECT p.ID_Pokemon, p.Nombre, p.Imagen
                FROM Equipos_Pokemon ep
                JOIN Pokemon p ON ep.ID_Pokemon = p.ID_Pokemon
                WHERE ep.ID_Equipo = ?
            ");
            $stmtPokemons->execute([$dto->id]);
            $dto->pokemons = [];

            foreach ($stmtPokemons->fetchAll() as $poke) {
                $dto->pokemons[] = [
                    'id' => (int) $poke['ID_Pokemon'],
                    'nombre' => $poke['Nombre'],
                    'imagen' => $poke['Imagen']
                ];
            }

            $result[] = $dto;
        }

        return $result;
    }
}
