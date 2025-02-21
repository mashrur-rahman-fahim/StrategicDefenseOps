<?php

namespace App\Services;

use GuzzleHttp\Client;

class OllamaService
{
    protected $client;
    protected $baseUrl;

    public function __construct()
    {
        $this->client = new Client();
        $this->baseUrl = 'http://localhost:11434/api/generate'; // Ollama default API URL
    }

    public function generateText($prompt)
    {
        $response = $this->client->post($this->baseUrl, [
            'json' => [
                'model' => 'mistral', // Specify the model you've chosen (e.g., mistral, llama)
                'prompt' => $prompt
            ]
        ]);

        return json_decode($response->getBody()->getContents(), true);
    }
}
