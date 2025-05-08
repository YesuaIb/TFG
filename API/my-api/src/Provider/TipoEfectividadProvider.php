<?php

namespace App\Provider;

use App\Dto\TipoEfectividadDto;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use PDO;

class TipoEfectividadProvider implements ProviderInterface
{
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): ?TipoEfectividadDto
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

        // Obtener nombre del tipo base
        $stmtTipo = $pdo->prepare("SELECT Nombre FROM Tipos WHERE ID_Tipos = ?");
        $stmtTipo->execute([$id]);
        $row = $stmtTipo->fetch();

        if (!$row) {
            return null;
        }

        $dto = new TipoEfectividadDto();
        $dto->tipo = $row['Nombre'];
        $dto->eficacia = [];

        // Obtener efectividad hacia cada tipo destino
        $stmt = $pdo->prepare("
            SELECT t.Nombre AS Destino, te.Multiplicador
            FROM Tipo_Eficaz te
            JOIN Tipos t ON te.ID_Tipo_Destino = t.ID_Tipos
            WHERE te.ID_Tipo_Origen = ?
        ");
        $stmt->execute([$id]);
        $efectividades = $stmt->fetchAll();

        foreach ($efectividades as $ef) {
            $dto->eficacia[$ef['Destino']] = (float) $ef['Multiplicador'];
        }

        return $dto;
    }
}
