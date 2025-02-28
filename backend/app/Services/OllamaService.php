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
            'timeout' => 120,
            'connect_timeout' => 120,
        ]);
    }

    public function generateResponse(string $prompt)
    {
       
        try {
            $response = $this->client->post('https://rdl84gw0-11434.asse.devtunnels.ms/api/generate', [
                'json' => [
                    'model' => 'deepseek-r1:1.5b',
                    'prompt' => $prompt,
                    'stream' => true, // Set to true if you want streamed responses
                    'options' => [
                        'temperature' => 0.5,
                     
                        'top_p' => 0.9, // Nucleus sampling (higher = more diverse output)
                        'repeat_penalty' => 1.2, // Reduces repetition
                        'presence_penalty' => 1.2, // Encourages new words
                        'frequency_penalty' => 0.8, // Lessens overuse of frequent words
                       
                       
                    ],
                ]
                
            ]);

            $body = $response->getBody();
            yield from $this->processStream($body);

        } catch (\Exception $e) {
            \Log::error('Ollama API Error: ' . $e->getMessage());
            yield "**Error:** Unable to generate a response.";
        }
    }

    private function processStream(StreamInterface $body): \Generator
{
    $buffer = ''; // Buffer to handle incomplete JSON objects

    while (!$body->eof()) {
        $chunk = $body->read(1024); // Read 1024 bytes at a time
        $buffer .= $chunk; // Append chunk to buffer

        // Split the buffer into lines
        $lines = explode("\n", $buffer);
        $buffer = array_pop($lines); // Keep the last (possibly incomplete) line in the buffer

        foreach ($lines as $line) {
            $json = json_decode(trim($line), true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                continue; // Skip invalid JSON
            }

            if (!empty($json['response'])) {
                // Clean the response: Remove unwanted tags and fix LaTeX formatting
                $cleanedResponse = $this->cleanResponse($json['response']);
                yield $cleanedResponse; // Yield the cleaned response text
            }

            if (!empty($json['done'])) {
                return; // Stop processing when done
            }
        }
    }

    // Process any remaining data in the buffer
    if (!empty($buffer)) {
        $json = json_decode(trim($buffer), true);
        if (json_last_error() === JSON_ERROR_NONE && !empty($json['response'])) {
            $cleanedResponse = $this->cleanResponse($json['response']);
            yield $cleanedResponse;
        }
    }
}

private function cleanResponse(string $response): string
{
    // Remove unwanted tags like <think></think>
    $response = str_replace(['<think>', '</think>'], '', $response);
   

    return trim($response);
}
}