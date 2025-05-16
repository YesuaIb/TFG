<?php

namespace App\Dto;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\Get;

use App\Provider\EquipoCollectionProvider;
use App\Provider\EquipoItemProvider;
use App\Provider\EquiposPorUsuarioProvider;


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
        )
    ]
)]
class EquipoDto
{
    #[Groups(['equipo:read'])]
    public int $id;

    #[Groups(['equipo:read'])]
    public string $nombre;

    #[Groups(['equipo:read'])]
    public int $numero;

    #[Groups(['equipo:read'])]
    public array $usuario = [];

    #[Groups(['equipo:read'])]
    public array $pokemons = [];
}
