<?php

namespace App\Services;

use GuzzleHttp\Client;
use Psr\Http\Message\StreamInterface;

class OllamaService
{
    protected $client;

    public function __construct()
    {
        $this->client = new Client([
            'timeout' => 500, // Increased timeout for longer responses
            'connect_timeout' => 40, 
            'headers' => [
                'Connection' => 'keep-alive', // Keeps connection open for long responses
            ],
        ]);
    }

    /**
     * Generate a streamed response from Ollama API.
     */
    public function generateResponse(string $prompt)
    {
        try {
            $response = $this->client->post('https://rdl84gw0-11434.asse.devtunnels.ms/api/generate', [
                'json' => [
                    'model' => 'wizardlm2:latest',
                    'prompt' => $prompt,
                    'stream' => false, // Enable true streaming from Ollama
                    'options' => [
                        'temperature' => 0.01,
                        'top_k'=>10,
                        'top_p'=>0.8,
                        'typical_p'=>0.5,
                        'presence_penalty'=>1.8,
                        'frequency_penalty'=>1.2,
                        'mirostat_tau'=>0.5,
                        'mirostat_eta'=>0.3
                    ],
                ],
            ]);

            yield from $this->processStream($response->getBody());
        } catch (\Exception $e) {
            \Log::error('Ollama API Error: ' . $e->getMessage());
            yield '**Error:** Unable to generate a response.';
        }
    }

    /**
     * Process long streamed responses in real-time.
     */
    private function processStream(StreamInterface $body): \Generator
    {
        $buffer = '';

        while (!$body->eof()) {
            $chunk = $body->read(2048); // Read 2KB at a time
            $buffer .= $chunk;

            $lines = explode("\n", $buffer);
            $buffer = array_pop($lines);

            foreach ($lines as $line) {
                $trimmedLine = trim($line);
                if (empty($trimmedLine)) {
                    continue;
                }

                $json = json_decode($trimmedLine, true);
                if (json_last_error() !== JSON_ERROR_NONE) {
                    \Log::warning('Invalid JSON received: ' . $trimmedLine);
                    continue;
                }

                if (!empty($json['response'])) {
                    yield $this->cleanResponse($json['response']);
                }

                if (!empty($json['done'])) {
                    return;
                }
            }
        }

        if (!empty($buffer)) {
            $json = json_decode(trim($buffer), true);
            if (json_last_error() === JSON_ERROR_NONE && !empty($json['response'])) {
                yield $this->cleanResponse($json['response']);
            }
        }
    }

    /**
     * Clean unwanted tags and format the response.
     */
    private function cleanResponse(string $response): string
    {
        return trim(preg_replace('/<think>.*?<\/think>/s', '', $response));
    }
}
