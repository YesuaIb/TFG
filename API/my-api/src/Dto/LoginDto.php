<?php

namespace App\Dto;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use App\Processor\LoginProcessor;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    shortName: 'Login',
    operations: [
        new Post(
            uriTemplate: '/login',
            processor: LoginProcessor::class,
            denormalizationContext: ['groups' => ['login:write']],
            normalizationContext: ['groups' => ['login:read']],
            
        )
    ]
)]
class LoginDto
{
    #[Groups(['login:write'])]
    public string $correo;

    #[Groups(['login:write'])]
    public string $pass;

    #[Groups(['login:read'])]
    public ?int $id = null;

    #[Groups(['login:read'])]
    public ?string $nombre = null;
}
