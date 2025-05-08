<?php

namespace App\Provider;

use App\Dto\TipoDto;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use PDO;

class TipoCollectionProvider implements ProviderInterface
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

        $tipos = $pdo->query("SELECT ID_Tipos, Nombre, Icono FROM Tipos ORDER BY ID_Tipos")->fetchAll();
        $result = [];

        foreach ($tipos as $tipo) {
            $dto = new TipoDto();
            $dto->id = (int) $tipo['ID_Tipos'];
            $dto->nombre = $tipo['Nombre'];
            $dto->icono = $tipo['Icono'];

            // Tipos a los que es fuerte (Multiplicador > 1)
            $stmtFuerte = $pdo->prepare("
                SELECT t.Nombre 
                FROM Tipo_Eficaz te
                JOIN Tipos t ON te.ID_Tipo_Destino = t.ID_Tipos
                WHERE te.ID_Tipo_Origen = ? AND te.Multiplicador > 1
            ");
            $stmtFuerte->execute([$dto->id]);
            $dto->fuertesContra = array_column($stmtFuerte->fetchAll(), 'Nombre');

            // Tipos a los que es débil (Multiplicador < 1)
            $stmtDebil = $pdo->prepare("
                SELECT t.Nombre 
                FROM Tipo_Eficaz te
                JOIN Tipos t ON te.ID_Tipo_Destino = t.ID_Tipos
                WHERE te.ID_Tipo_Origen = ? AND te.Multiplicador < 1
            ");
            $stmtDebil->execute([$dto->id]);
            $dto->debilContra = array_column($stmtDebil->fetchAll(), 'Nombre');

            $result[] = $dto;
        }

        return $result;
    }
}
