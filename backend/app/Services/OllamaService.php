<?php
namespace App\Services;

use GuzzleHttp\Client;

class OllamaService
{
    protected $client;

    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    public function generateResponse($prompt)
    {
        try {
            // Send a POST request to Ollama's API
            $response = $this->client->post('http://localhost:11434/api/generate', [
                'json' => [
                    'model' => 'llama3.1',
                    'prompt' => $prompt,
                ],
                'stream' => true, // Enable streaming
            ]);

            // Get the response body as a stream
            $body = $response->getBody();

            // Process the stream in chunks
            while (!$body->eof()) {
                $chunk = $body->read(1024); // Read 1024 bytes at a time
                foreach (explode("\n", $chunk) as $line) { // Split by newline (NDJSON format)
                    if (trim($line) === '') continue; // Skip empty lines
                    $json = json_decode($line, true); // Parse the JSON object
                    if (isset($json['response'])) {
                        // Remove all <think> and </think> tags (with or without content)
                        $cleanedResponse = preg_replace('/<\/?think[^>]*>/', '', $json['response']);
                        yield trim($cleanedResponse); // Yield each cleaned response chunk
                    }
                    if (isset($json['done']) && $json['done']) {
                        break 2; // Exit when the response is complete
                    }
                }
            }
        } catch (\Exception $e) {
            // Log the exception for debugging
            \Log::error('Ollama Error:', ['message' => $e->getMessage()]);
            yield null; // Yield null in case of an error
        }
    }
}