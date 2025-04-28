<?php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use PDO;

#[AsCommand(
    name: 'app:import-pokemons-full',
    description: 'Importa Pokémon, imágenes oficiales, iconos 2D, gifs y tipos con iconos sword-shield.',
)]
class ImportPokemonsFullCommand extends Command
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
        $pokemonDir = '/var/www/html/public/uploads/pokemon/';
        $tipoDir = '/var/www/html/public/uploads/tipos/';
        if (!is_dir($pokemonDir)) mkdir($pokemonDir, 0777, true);
        if (!is_dir($tipoDir)) mkdir($tipoDir, 0777, true);

        $response = $this->client->request('GET', 'https://pokeapi.co/api/v2/pokemon?limit=151');
        $data = $response->toArray();

        foreach ($data['results'] as $pokemonData) {
            $detail = $this->client->request('GET', $pokemonData['url'])->toArray();
            $nombre = $detail['name'];
            $descripcion = '';

            // Imagen oficial
            $imagen = $this->descargarImagen($detail['sprites']['other']['official-artwork']['front_default'] ?? null, $pokemonDir, $nombre . '.png');

            // Icono tipo Pokédex
            $imagen2d = $this->descargarImagen($detail['sprites']['versions']['generation-viii']['icons']['front_default'] ?? null, $pokemonDir, $nombre . '_icon.png');

            // Gif animado (lo puedes ajustar tú si quieres usar showdown)
            $gif = $this->descargarImagen($detail['sprites']['other']['showdown']['front_default'] ?? null, $pokemonDir, $nombre . '.gif');

            $stmt = $this->pdo->prepare("SELECT ID_Pokemon FROM Pokemon WHERE Nombre = ?");
            $stmt->execute([$nombre]);
            if ($stmt->fetch()) {
                $output->writeln("Ya existe: $nombre");
                continue;
            }


            // Obtener ID real del Pokémon desde la PokéAPI
            $idApi = $detail['id'];

            // Obtener descripción en español
            $descripcion = '';
            try {
                $species = $this->client->request('GET', $detail['species']['url'])->toArray();
                foreach ($species['flavor_text_entries'] as $entry) {
                    if ($entry['language']['name'] === 'es') {
                        $descripcion = $entry['flavor_text'];
                        break;
                    }
                }
            } catch (\Exception $e) {
                $output->writeln("⚠️ No se pudo obtener descripción para {$nombre}: " . $e->getMessage());
            }

            // Descargar imagen oficial
            $imagen = $this->descargarImagen($detail['sprites']['other']['official-artwork']['front_default'] ?? null, $pokemonDir, $nombre . '.png');
            $output->writeln("📸 Imagen oficial de {$nombre}: " . ($imagen ?? 'NO DESCARGADA'));

            // INSERT actualizado con ID_Api y descripción
            $stmt = $this->pdo->prepare("INSERT INTO Pokemon (ID_Api, Nombre, Imagen, `Imagen 2D`, Gif, Descripcion) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$idApi, $nombre, $imagen, $imagen2d, $gif, $descripcion]);
            $pokemonId = $this->pdo->lastInsertId();


            //Tipos
            foreach ($detail['types'] as $typeData) {
                $tipoNombre = $typeData['type']['name'];

                try {
                    // Obtener el ID real del tipo
                    $typeDetail = $this->client->request('GET', "https://pokeapi.co/api/v2/type/{$tipoNombre}")->toArray();
                    $tipoId = $typeDetail['id'];

                    // Construir URL del icono tipo Sword & Shield
                    $iconoUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/{$tipoId}.png";

                    // Log para depuración
                    $output->writeln("➡️ Descargando icono de tipo: {$tipoNombre} (ID: {$tipoId})");
                    $output->writeln("   URL: {$iconoUrl}");

                    // Descargar el icono
                    $icono = $this->descargarImagen($iconoUrl, $tipoDir, $tipoNombre . '.png');

                    if (!$icono) {
                        $output->writeln("❌ No se pudo guardar el icono del tipo $tipoNombre");
                    }
                } catch (\Exception $e) {
                    $output->writeln("❌ Error al obtener ID del tipo {$tipoNombre}: " . $e->getMessage());
                    $icono = null;
                }

                $stmt = $this->pdo->prepare("SELECT ID_Tipos FROM Tipos WHERE Nombre = ?");
                $stmt->execute([$tipoNombre]);
                $tipo = $stmt->fetch();

                if (!$tipo) {
                    $stmt = $this->pdo->prepare("INSERT INTO Tipos (Nombre, Icono) VALUES (?, ?)");
                    $stmt->execute([$tipoNombre, $icono]);
                    $tipoId = $this->pdo->lastInsertId();
                } else {
                    $tipoId = $tipo['ID_Tipos'];
                }

                $stmt = $this->pdo->prepare("INSERT INTO Pokemon_Tipo (ID_Pokemon, ID_Tipo) VALUES (?, ?)");
                $stmt->execute([$pokemonId, $tipoId]);
            }

            $output->writeln("✅ Importado: $nombre");
        }

        return Command::SUCCESS;
    }

    private function descargarImagen(?string $url, string $dir, string $nombre): ?string
    {
        if (!$url) return null;
        $ruta = $dir . $nombre;
        $rutaRelativa = str_replace('/var/www/html/public', '', $ruta);
        if (!file_exists($ruta)) {
            try {
                $contenido = $this->client->request('GET', $url)->getContent();
                file_put_contents($ruta, $contenido);
            } catch (\Exception $e) {
                return null;
            }
        }
        return $rutaRelativa;
    }
}
