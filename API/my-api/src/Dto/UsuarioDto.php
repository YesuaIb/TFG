<?php

namespace App\Dto;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use Symfony\Component\Serializer\Annotation\Groups;
use \App\Processor\UsuarioPostProcessor;


#[ApiResource(
    operations: [
        new Post(
            uriTemplate: '/usuarios',
            processor: UsuarioPostProcessor::class,
            denormalizationContext: ['groups' => ['usuario:write']]
        )
    ]
)]
class UsuarioDto
{
    #[Groups(['usuario:write'])]
    public string $nombre;

    #[Groups(['usuario:write'])]
    public string $correo;

    #[Groups(['usuario:write'])]
    public string $pass;
}
