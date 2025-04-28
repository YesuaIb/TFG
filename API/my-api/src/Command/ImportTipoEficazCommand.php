<?php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use PDO;

#[AsCommand(
    name: 'app:import-tipo-eficaz',
    description: 'Importa relaciones de efectividad entre tipos desde la PokéAPI y las guarda en Tipo_Eficaz.',
)]
class ImportTipoEficazCommand extends Command
{
    private PDO $pdo;

    public function __construct(private HttpClientInterface $client)
    {
        parent::__construct();

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

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $response = $this->client->request('GET', 'https://pokeapi.co/api/v2/type');
        $typesList = $response->toArray();

        foreach ($typesList['results'] as $typeEntry) {
            $typeName = $typeEntry['name'];
            $typeDetail = $this->client->request('GET', $typeEntry['url'])->toArray();

            // Obtener ID interno del tipo en nuestra BBDD
            $stmt = $this->pdo->prepare("SELECT ID_Tipos FROM Tipos WHERE Nombre = ?");
            $stmt->execute([$typeName]);
            $origenTipo = $stmt->fetch();

            if (!$origenTipo) {
                $output->writeln("⚠️ Tipo no encontrado en base de datos: $typeName");
                continue;
            }

            $origenId = $origenTipo['ID_Tipos'];

            // Daño doble (2.0)
            foreach ($typeDetail['damage_relations']['double_damage_to'] as $destino) {
                $this->insertEficacidad($origenId, $destino['name'], 2.0, $output);
            }

            // Daño reducido (0.5)
            foreach ($typeDetail['damage_relations']['half_damage_to'] as $destino) {
                $this->insertEficacidad($origenId, $destino['name'], 0.5, $output);
            }

            // Inmunidad (0.0)
            foreach ($typeDetail['damage_relations']['no_damage_to'] as $destino) {
                $this->insertEficacidad($origenId, $destino['name'], 0.0, $output);
            }

            $output->writeln("✅ Efectividades importadas para tipo: $typeName");
        }

        return Command::SUCCESS;
    }

    private function insertEficacidad(int $origenId, string $destinoNombre, float $multiplicador, OutputInterface $output): void
    {
        $stmt = $this->pdo->prepare("SELECT ID_Tipos FROM Tipos WHERE Nombre = ?");
        $stmt->execute([$destinoNombre]);
        $destinoTipo = $stmt->fetch();

        if (!$destinoTipo) {
            $output->writeln("❌ Tipo destino no encontrado: $destinoNombre");
            return;
        }

        $destinoId = $destinoTipo['ID_Tipos'];

        // Insertar relación
        $stmt = $this->pdo->prepare("REPLACE INTO Tipo_Eficaz (ID_Tipo_Origen, ID_Tipo_Destino, Multiplicador) VALUES (?, ?, ?)");
        $stmt->execute([$origenId, $destinoId, $multiplicador]);
    }
}
