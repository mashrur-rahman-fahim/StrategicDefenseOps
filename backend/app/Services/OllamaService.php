<?php

namespace App\Services;

use GuzzleHttp\Client;
use Psr\Http\Message\StreamInterface;

class OllamaService
{
    protected $client;

    public function __construct()
    {
        set_time_limit(500);
        $this->client = new Client([

        ]);
    }

    public function generateResponse(string $prompt): \Generator
    {
        set_time_limit(500);
        try {
            $response = $this->client->post('https://rdl84gw0-11434.asse.devtunnels.ms/api/generate', [
                'json' => [
                    'model' => 'qwen2.5:1.5b',
                    'prompt' => $prompt,
                    'stream' => false,
                    'options' => ['temperature' => 0.6],
                ],
                // Ensure streaming response
            ]);

            foreach ($this->streamResponse($response->getBody()) as $chunk) {
                yield $chunk;
            }
        } catch (\Exception $e) {
            \Log::error('Ollama API Error: ' . $e->getMessage());
            yield '**Error:** Unable to generate a response.';

        }
    }

    private function streamResponse(StreamInterface $body): \Generator
    {
        set_time_limit(500);
        $buffer = '';

        while (!$body->eof()) {
            $buffer .= $body->read(1024);

            // Split by newlines while preserving buffer
            while (($pos = strpos($buffer, "\n")) !== false) {
                $line = substr($buffer, 0, $pos);
                $buffer = substr($buffer, $pos + 1);

                if (!empty(trim($line))) {
                    $json = json_decode(trim($line), true);
                    if (json_last_error() === JSON_ERROR_NONE && isset($json['response'])) {
                        yield $this->cleanResponse($json['response']);
                    }
                }
            }
        }

        // Process remaining buffer
        if (!empty(trim($buffer))) {
            $json = json_decode(trim($buffer), true);
            if (json_last_error() === JSON_ERROR_NONE && isset($json['response'])) {
                yield $this->cleanResponse($json['response']);
            }
        }
    }
    private function cleanResponse(string $response): string
    {
        // Remove everything between <think> and </think>, including the tags
        $response = preg_replace('/<think>.*?<\/think>/s', '', $response);
    
        // Remove any standalone <think> or </think> tags
        $response = str_replace(['<think>', '</think>'], '', $response);
    
        return trim($response);
    }
    
}