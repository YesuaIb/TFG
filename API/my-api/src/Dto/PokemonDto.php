<?php

namespace App\Dto;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use Symfony\Component\Serializer\Annotation\Groups;

use App\Provider\PokemonCollectionProvider;
use App\Provider\PokemonItemProvider;

#[ApiResource(
    shortName: 'Pokemon',
    operations: [
        new GetCollection(
            uriTemplate: '/pokemons',
            provider: PokemonCollectionProvider::class,
            normalizationContext: ['groups' => ['pokemon:read']],
            paginationEnabled: false
        ),
        new Get(
            uriTemplate: '/pokemons/{id}',
            provider: PokemonItemProvider::class,
            normalizationContext: ['groups' => ['pokemon:read']]
        ),
    ]
)]
class PokemonDto
{
    #[Groups(['pokemon:read'])]
    public int $id;

    #[Groups(['pokemon:read'])]
    public string $nombre;

    #[Groups(['pokemon:read'])]
    public ?string $imagen = null;

    #[Groups(['pokemon:read'])]
    public ?string $icono = null;

    #[Groups(['pokemon:read'])]
    public ?string $gif = null;

    #[Groups(['pokemon:read'])]
    public ?string $descripcion = null;

    #[Groups(['pokemon:read'])]
    public array $tipos = [];

    #[Groups(['pokemon:read'])]
    public ?int $altura = null;

    #[Groups(['pokemon:read'])]
    public ?int $peso = null;

    #[Groups(['pokemon:read'])]
    public ?array $habilidades = null;

    #[Groups(['pokemon:read'])]
    public ?string $habilidadOculta = null;

    #[Groups(['pokemon:read'])]
    public ?string $especie = null;

    #[Groups(['pokemon:read'])]
    public ?string $generacion = null;
}
