<?php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use PDO;

#[AsCommand(
    name: 'app:import-tipos',
    description: 'Importa tipos desde la PokéAPI y descarga sus íconos Sword & Shield.',
)]
class ImportTiposWithIconCommand extends Command
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
        $iconDir = '/var/www/html/public/uploads/tipos/';
        if (!is_dir($iconDir)) mkdir($iconDir, 0777, true);

        $response = $this->client->request('GET', 'https://pokeapi.co/api/v2/type');
        $types = $response->toArray();

        foreach ($types['results'] as $type) {
            $nombre = $type['name'];

            // Obtener detalle del tipo (para extraer ID)
            try {
                $typeDetail = $this->client->request('GET', $type['url'])->toArray();
                $tipoId = $typeDetail['id'];

                $iconUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/{$tipoId}.png";
                $iconName = $nombre . '.png';
                $iconPath = $iconDir . $iconName;
                $iconRel = '/uploads/tipos/' . $iconName;

                // Descargar si no existe
                if (!file_exists($iconPath)) {
                    $iconData = $this->client->request('GET', $iconUrl)->getContent();
                    file_put_contents($iconPath, $iconData);
                }

                // Insertar tipo (o actualizar si ya existe)
                $stmt = $this->pdo->prepare("SELECT ID_Tipos FROM Tipos WHERE Nombre = ?");
                $stmt->execute([$nombre]);
                $exists = $stmt->fetch();

                if ($exists) {
                    $stmt = $this->pdo->prepare("UPDATE Tipos SET Icono = ? WHERE Nombre = ?");
                    $stmt->execute([$iconRel, $nombre]);
                    $output->writeln("🔁 Actualizado tipo: $nombre con icono");
                } else {
                    $stmt = $this->pdo->prepare("INSERT INTO Tipos (Nombre, Icono) VALUES (?, ?)");
                    $stmt->execute([$nombre, $iconRel]);
                    $output->writeln("✅ Insertado tipo: $nombre con icono");
                }
            } catch (\Exception $e) {
                $output->writeln("❌ Error procesando tipo $nombre: " . $e->getMessage());
            }
        }

        return Command::SUCCESS;
    }
}
