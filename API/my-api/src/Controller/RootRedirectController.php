<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Annotation\Route;

class RootRedirectController
{
    #[Route('/', name: 'root_redirect')]
    public function __invoke(): RedirectResponse
    {
        return new RedirectResponse('/docs');
    }
}
