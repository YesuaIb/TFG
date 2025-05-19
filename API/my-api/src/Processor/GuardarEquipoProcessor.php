<?php

namespace App\Processor;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Dto\EquipoDto;
use PDO;

class GuardarEquipoProcessor implements ProcessorInterface
{
    private PDO $pdo;

    public function __construct()
    {
        $this->pdo = new PDO(
            'mysql:host=db;dbname=api_db;charset=utf8mb4',
            'root',
            'root',
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]
        );
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): EquipoDto
    {
        if (!$data instanceof EquipoDto) {
            throw new \InvalidArgumentException('Invalid data type');
        }

        // Insertar en Equipo
        $stmt = $this->pdo->prepare("
            INSERT INTO Equipo (ID_Usuario, `Numero_Equipo`, Nombre_Equipo)
            VALUES (?, ?, ?)
        ");
        $stmt->execute([
            $data->usuario,
            $data->numero,
            $data->nombre
        ]);

        $idEquipo = $this->pdo->lastInsertId();

        // Insertar en Equipos_Pokemon
        $stmtPokemon = $this->pdo->prepare("
            INSERT INTO Equipos_Pokemon (ID_Equipo, ID_Pokemon)
            VALUES (?, ?)
        ");

        foreach ($data->pokemons as $idPokemon) {
            $stmtPokemon->execute([$idEquipo, $idPokemon]);
        }

        return $data;
    }
}
