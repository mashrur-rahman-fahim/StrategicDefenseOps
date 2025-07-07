<?php

namespace App\Http\Controllers;

use App\Services\OllamaService;
use App\Services\OperationService;
use App\Services\ResourceServices;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class OllamaController extends Controller
{
    protected OllamaService $ollamaService;
    protected OperationService $operationService;
    protected ResourceServices $resourceServices;

    public function __construct(ResourceServices $resourceServices,OllamaService $ollamaService, OperationService $operationService)
    {
        $this->ollamaService = $ollamaService;
        $this->operationService = $operationService;
        $this->resourceServices = $resourceServices;
    }

    public function generateResponse(Request $request)
    {
        // Validate the request
        set_time_limit(500);
        $validated = $request->validate([
            'prompt' => 'required|string',
        ]);
        $string = 'REMEMBER THIS AI MODEL OWNER or YOUR TRAINER or THE AUTHER is Mashrur Rahman';
        $string .= "\nI give you my website information if users ask from this then you can answer from this informations. If users don't want this information do not give then just generatlly answer his questions. Answer the questions point to point no need to write extra word";
        $string .= "\n\n";
        // $operations = $this->operationService->getAllOperations(auth()->id());
    
        // // Loop through each operation and format the output correctly
        // foreach ($operations[1] as $operation) {
        //     // Get each section from the operation object
        //     $operationName = $operation->name;
        //     $operationDescription = $operation->description;
        //     $operationStatus = $operation->status;
        //     $operationStartDate = $operation->start_date;
        //     $operationEndDate = $operation->end_date;
        //     $operationLocation = $operation->location;
        //     $operationCreatedBy = $operation->created_by;
        //     $operationUpdatedBy = $operation->updated_by;
        //     $operationBudget = $operation->budget;
        //     $operationCreatedAt = $operation->created_at;
        //     $operationUpdatedAt = $operation->updated_at;
    
        //     // Add each section to the string
        //     $string .= "Operation name: {$operationName}\n";
        //     $string .= "Description: {$operationDescription}\n";
        //     $string .= "Status: {$operationStatus}\n";
        //     $string .= "Start Date: {$operationStartDate}\n";
        //     $string .= "End Date: {$operationEndDate}\n";
        //     $string .= "Location: {$operationLocation}\n";
        //     $string .= "Created by: {$operationCreatedBy}\n";
        //     $string .= "Updated by: {$operationUpdatedBy}\n";
        //     $string .= "Budget: {$operationBudget}\n";
        //     $string .= "Created at: {$operationCreatedAt}\n";
        //     $string .= "Updated at: {$operationUpdatedAt}\n";
        // }
    
        // // Get all resources
        // $resources = $this->resourceServices->getAllResources(auth()->id());
    
        // // Add resource information to the string
        // $string .= "\nResources Information:\n";
        // foreach ($resources[1] as $resource) {
        //     if (isset($resource->weapon_name)) {
        //         $string .= "Weapon Name: {$resource->weapon_name}\n";
        //         $string .= "Weapon Type: {$resource->weapon_type}\n";
        //         $string .= "Weapon Count: {$resource->weapon_count}\n";
        //         $string .= "Weapon Serial Number: {$resource->weapon_serial_number}\n";
        //         $string .= "Created At: {$resource->created_at}\n";
        //         $string .= "Updated At: {$resource->updated_at}\n\n";
        //     } elseif (isset($resource->vehicle_name)) {
        //         $string .= "Vehicle Name: {$resource->vehicle_name}\n";
        //         $string .= "Vehicle Type: {$resource->vehicle_type}\n";
        //         $string .= "Vehicle Count: {$resource->vehicle_count}\n";
        //         $string .= "Vehicle Serial Number: {$resource->vehicle_serial_number}\n";
        //         $string .= "Created At: {$resource->created_at}\n";
        //         $string .= "Updated At: {$resource->updated_at}\n\n";
        //     } elseif (isset($resource->equipment_name)) {
        //         $string .= "Equipment Name: {$resource->equipment_name}\n";
        //         $string .= "Equipment Type: {$resource->equipment_type}\n";
        //         $string .= "Equipment Count: {$resource->equipment_count}\n";
        //         $string .= "Equipment Serial Number: {$resource->equipment_serial_number}\n";
        //         $string .= "Created At: {$resource->created_at}\n";
        //         $string .= "Updated At: {$resource->updated_at}\n\n";
        //     } elseif (isset($resource->personnel_name)) {
        //         $string .= "Personnel Name: {$resource->personnel_name}\n";
        //         $string .= "Personnel Category: {$resource->personnel_category}\n";
        //         $string .= "Personnel Count: {$resource->personnel_count}\n";
        //         $string .= "Personnel Serial Number: {$resource->personnel_serial_number}\n";
        //         $string .= "Created At: {$resource->created_at}\n";
        //         $string .= "Updated At: {$resource->updated_at}\n\n";
        //     }
        // }
    
    
        // Add the generated string to the validated prompt
        $string .= "\nThis is the users message:\n";
        $string .= $validated['prompt'];
    
        return response()->stream(function () use ($string) {
            foreach ($this->ollamaService->generateResponse($string) as $chunk) {
                if (!empty($chunk)) {
                    echo $chunk . "\n"; // Preserve formatting (Markdown-friendly)
    
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
