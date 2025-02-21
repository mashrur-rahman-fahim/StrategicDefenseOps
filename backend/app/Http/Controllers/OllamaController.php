<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\OllamaService;
use Symfony\Component\HttpFoundation\StreamedResponse;

class OllamaController extends Controller
{
    protected $ollamaService;

    public function __construct(OllamaService $ollamaService)
    {
        $this->ollamaService = $ollamaService;
    }

    public function generateResponse(Request $request)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'prompt' => 'required|string',
        ]);
        

        // Create a streamed response
        return new StreamedResponse(function () use ($validated) {
            foreach ($this->ollamaService->generateResponse($validated['prompt']) as $chunk) {
                if ($chunk !== null) {
                    echo $chunk . " "; // Output each chunk with a newline
                    ob_flush(); // Flush the output buffer
                    flush();    // Send the output to the client
                }
            }
        }, 200, [
            'Content-Type' => 'text/plain', // Use text/plain for streaming
        ]);
    }
}