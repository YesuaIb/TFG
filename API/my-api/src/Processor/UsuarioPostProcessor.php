<?php

namespace App\Processor;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Dto\UsuarioDto;
use PDO;

class UsuarioPostProcessor implements ProcessorInterface
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

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): UsuarioDto
    {
        if (!$data instanceof UsuarioDto) {
            throw new \RuntimeException('Datos inválidos.');
        }

        $stmt = $this->pdo->prepare("
            INSERT INTO Usuario (Nombre, Correo, Pass) 
            VALUES (?, ?, ?)
        ");
        $hashedPassword = password_hash($data->pass, PASSWORD_BCRYPT);
        $stmt->execute([$data->nombre, $data->correo, $hashedPassword]);


        return $data;
    }
}
