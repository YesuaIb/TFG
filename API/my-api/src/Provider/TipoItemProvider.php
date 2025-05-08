<?php

namespace App\Provider;

use App\Dto\TipoDto;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use PDO;

class TipoItemProvider implements ProviderInterface
{
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): ?TipoDto
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

        $stmt = $pdo->prepare("
            SELECT ID_Tipos, Nombre, Icono
            FROM Tipos
            WHERE ID_Tipos = ?
        ");
        $stmt->execute([$id]);
        $tipo = $stmt->fetch();

        if (!$tipo) {
            return null;
        }

        $dto = new TipoDto();
        $dto->id = (int) $tipo['ID_Tipos'];
        $dto->nombre = $tipo['Nombre'];
        $dto->icono = $tipo['Icono'];

        // Fuerte contra
        $stmtFuerte = $pdo->prepare("
            SELECT t.Nombre
            FROM Tipo_Eficaz te
            JOIN Tipos t ON te.ID_Tipo_Destino = t.ID_Tipos
            WHERE te.ID_Tipo_Origen = ? AND te.Multiplicador > 1
        ");
        $stmtFuerte->execute([$dto->id]);
        $dto->fuertesContra = array_column($stmtFuerte->fetchAll(), 'Nombre');

        // Débil contra
        $stmtDebil = $pdo->prepare("
            SELECT t.Nombre
            FROM Tipo_Eficaz te
            JOIN Tipos t ON te.ID_Tipo_Destino = t.ID_Tipos
            WHERE te.ID_Tipo_Origen = ? AND te.Multiplicador < 1
        ");
        $stmtDebil->execute([$dto->id]);
        $dto->debilContra = array_column($stmtDebil->fetchAll(), 'Nombre');

        return $dto;
    }
}
