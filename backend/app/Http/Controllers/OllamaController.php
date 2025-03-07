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
        // Validate the request
        set_time_limit(500);
        $validated = $request->validate([
            'prompt' => 'required|string',
        ]);

        return response()->stream(function () use ($validated) {
            foreach ($this->ollamaService->generateResponse($validated['prompt']) as $chunk) {
                if (! empty($chunk)) {
                    echo $chunk."\n"; // Preserve formatting (Markdown-friendly)

                    if (ob_get_level() > 0) {
                        ob_flush();
                    }
                    flush();
                   // Slight delay for smooth streaming
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
