<?php

namespace App\Dto;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\Provider\PokemonEvolucionesProvider;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    shortName: 'Evoluciones',
    operations: [
        new Get(
            uriTemplate: '/pokemons/{id}/evoluciones',
            provider: PokemonEvolucionesProvider::class,
            normalizationContext: ['groups' => ['evoluciones:read']]
        )
    ]
)]
class PokemonEvolucionesDto
{
    #[Groups(['evoluciones:read'])]
    public array $lineaEvolutiva = [];
}
