<?php

namespace App\Http\Controllers;

use App\Services\OllamaService;
use Illuminate\Http\Request;
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
        set_time_limit(500); // Prevents PHP timeout for long responses

        $validated = $request->validate([
            'prompt' => 'required|string',
        ]);

        return response()->stream(function () use ($validated) {
            foreach ($this->ollamaService->generateResponse($validated['prompt']) as $chunk) {
                if (!empty($chunk)) {
                    echo $chunk . "\n"; 
                    ob_flush();
                    flush();
                }
            }
        }, 200, [
            'Content-Type' => 'text/plain',
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'X-Accel-Buffering' => 'no', // Ensures real-time streaming
            'Connection' => 'keep-alive',
        ]);
    }
}
