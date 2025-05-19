<?php

namespace App\Dto;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;

use App\Provider\EquipoCollectionProvider;
use App\Provider\EquipoItemProvider;
use App\Provider\EquiposPorUsuarioProvider;
use App\Processor\GuardarEquipoProcessor;


#[ApiResource(
    shortName: 'Equipo',
    operations: [
        new GetCollection(
            uriTemplate: '/equipos',
            provider: EquipoCollectionProvider::class,
            normalizationContext: ['groups' => ['equipo:read']],
            paginationEnabled: false
        ),
        new GetCollection(
            uriTemplate: '/usuarios/{id}/equipos',
            provider: EquiposPorUsuarioProvider::class,
            normalizationContext: ['groups' => ['equipo:read']],
            paginationEnabled: false
        ),
        new Get(
            uriTemplate: '/equipos/{id}',
            provider: EquipoItemProvider::class,
            normalizationContext: ['groups' => ['equipo:read']]
        ),
        new Post(
            uriTemplate: '/equipos',
            processor: GuardarEquipoProcessor::class,
            input: EquipoDto::class,
            output: false,
            denormalizationContext: ['groups' => ['equipo:write']]
        )
    ]
)]
class EquipoDto
{
    #[Groups(['equipo:read'])]
    public ?int $id = null;

    #[Groups(['equipo:read', 'equipo:write'])]
    public int $usuario;

    #[Groups(['equipo:read', 'equipo:write'])]
    public int $numero;

    #[Groups(['equipo:read', 'equipo:write'])]
    public string $nombre;

    #[Groups(['equipo:read', 'equipo:write'])]
    public array $pokemons = [];
}
