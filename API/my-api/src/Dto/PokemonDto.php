<?php

namespace App\Dto;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use App\Provider\PokemonCollectionProvider;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    shortName: 'Pokemon',
    operations: [
        new GetCollection(
            uriTemplate: '/pokemons',
            provider: PokemonCollectionProvider::class,
            normalizationContext: ['groups' => ['pokemon:read']]
        )
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
}
