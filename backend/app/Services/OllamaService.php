<?php

namespace App\Services;

use GuzzleHttp\Client;
use Psr\Http\Message\StreamInterface;

class OllamaService
{
    protected $client;

    public function __construct(Client $client)
    {
        $this->client = new Client([
            'timeout' =>120,
            'connect_timeout' => 120,
        ]);
    }

    public function generateResponse(string $prompt)
    {
        try {
            $response = $this->client->post('http://localhost:11434/api/generate', [
                'json' => [
                    'model' => 'llama3.1',
                    'prompt' => $prompt,
                    'max_tokens'=>1
                    
                ],
                'stream' => true,
            ]);

            $body = $response->getBody();

            foreach ($this->processStream($body) as $chunk) {
                yield $chunk;
            }
        } catch (\Exception $e) {
            \Log::error('Ollama API Error: ' . $e->getMessage());
            yield null;
        }
    }

    private function processStream(StreamInterface $body): \Generator
    {
        while (!$body->eof()) {
            $chunk = $body->read(1024); // Read 1024 bytes at a time

            foreach (explode("\n", $chunk) as $line) {
                $json = json_decode(trim($line), true);

                if (!empty($json['response'])) {
                    yield trim($json['response']); // Directly yield the response
                }

                if (!empty($json['done'])) {
                    return;
                }
            }
        }
    }
}
