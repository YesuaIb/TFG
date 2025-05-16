<?php

namespace App\Processor;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Dto\LoginDto;
use PDO;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class LoginProcessor implements ProcessorInterface
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

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): LoginDto
    {
        if (!$data instanceof LoginDto) {
            throw new \RuntimeException('Datos inválidos.');
        }

        $stmt = $this->pdo->prepare("SELECT ID_Usuario, Nombre, Pass FROM Usuario WHERE Correo = ?");
        $stmt->execute([$data->correo]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($data->pass, $user['Pass'])) {
            throw new UnauthorizedHttpException('', 'Credenciales incorrectas');
        }

        $data->id = (int) $user['ID_Usuario'];
        $data->nombre = $user['Nombre'];
        $data->pass = ''; // no devolver nunca el hash

        return $data;
    }
}
