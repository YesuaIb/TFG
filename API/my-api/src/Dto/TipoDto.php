<?php

namespace App\Dto;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use Symfony\Component\Serializer\Annotation\Groups;

use App\Provider\TipoCollectionProvider;
use App\Provider\TipoItemProvider;


#[ApiResource(
    shortName: 'Tipo',
    operations: [
        new GetCollection(
            uriTemplate: '/tipos',
            provider: TipoCollectionProvider::class,
            normalizationContext: ['groups' => ['tipo:read']]
        ),
        new Get(
            uriTemplate: '/tipos/{id}',
            provider: TipoItemProvider::class,
            normalizationContext: ['groups' => ['tipo:read']]
        )
    ]
)]

class TipoDto
{
    #[Groups(['tipo:read'])]
    public int $id;

    #[Groups(['tipo:read'])]
    public string $nombre;

    #[Groups(['tipo:read'])]
    public ?string $icono = null;

    #[Groups(['tipo:read'])]
    public array $fuertesContra = [];

    #[Groups(['tipo:read'])]
    public array $debilContra = [];
}
