<?php

namespace App\Dto;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\Provider\TipoEfectividadProvider;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    shortName: 'TipoEfectividad',
    operations: [
        new Get(
            uriTemplate: '/tipos/{id}/efectividad',
            provider: TipoEfectividadProvider::class,
            normalizationContext: ['groups' => ['efectividad:read']]
        )
    ]
)]
class TipoEfectividadDto
{
    #[Groups(['efectividad:read'])]
    public string $tipo;

    #[Groups(['efectividad:read'])]
    public array $eficacia = [];
}
