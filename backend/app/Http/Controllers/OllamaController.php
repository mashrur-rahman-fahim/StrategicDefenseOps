<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\OllamaService;
use Symfony\Component\HttpFoundation\StreamedResponse;

class OllamaController extends Controller
{
    protected OllamaService $ollamaService;

    public function __construct(OllamaService $ollamaService)
    {
        $this->ollamaService = $ollamaService;
    }

    public function generateResponse(Request $request): StreamedResponse
    {
        // Validate the request
        $validated = $request->validate([
            'prompt' => 'required|string',
        ]);

        return response()->stream(function () use ($validated) {
            foreach ($this->ollamaService->generateResponse($validated['prompt']) as $chunk) {
                if (!empty($chunk)) {
                    echo $chunk." " ;
                    if (ob_get_level() > 0) {
                        ob_flush();
                    }
                    flush();
                }
            }
        }, 200, [
            'Content-Type' => 'text/plain',
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'X-Accel-Buffering' => 'no',
            'Connection' => 'keep-alive',
        ]);
    }
}
