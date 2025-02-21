<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OpenAI;

class ChatbotController extends Controller
{
    /**
     * Handle user chat request and fetch AI response.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:500'
        ]);

        try {
            $client = OpenAI::client(env('OPENAI_API_KEY'));

            $response = $client->chat()->create([
                'model' => 'gpt-3.5-turbo',
                'messages' => [
                    ['role' => 'system', 'content' => 'You are a helpful assistant.'],
                    ['role' => 'user', 'content' => $request->message],
                ],
                'max_tokens' => 50, // Increased for better responses
                'temperature' => 0.7, // Adjusted for balanced creativity
            ]);

            return response()->json([
                'message' => $response['choices'][0]['message']['content'] ?? 'No response received'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch response from OpenAI',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}
