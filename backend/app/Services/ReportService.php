<?php

namespace App\Services;

use Exception;

class ReportService
{
    protected OperationResourcesService $operationResourcesService;

    public function __construct(OperationResourcesService $operationResourcesService)
    {
        $this->operationResourcesService = $operationResourcesService;

    }

    public function getReport($operationId, $userId, $data)
    {

        try {
            $operationResources = $this->operationResourcesService->getOperationResource($operationId, $userId);

            if (! $operationResources) {
                throw new Exception('No operation resource');
            }
            $report = $operationResources;

            if ($report['operation']->status != 'completed') {
                throw new Exception('Operation is not completed');
            }

            $prompt = "Generate a concise and well-structured report based only on the provided operation data. The report should include:

Brief Summary (Max 40 Words)  Summarize the operations objective, execution, and outcome in one paragraph.
Key Insights (3-5 Bullet Points)  Highlight important details, including mission success/failure reasons, resource utilization (vehicles, weapons, personnel, equipment), and any major challenges.
Final Status & Conclusion (Max 3 Sentences)  State the final status of the operation and provide a short conclusion.
🔹 Keep the report under 500 words.
🔹 Do not generate extra information beyond the given data.
🔹 Use a formal and professional tone.

Operation Data:
(Include operation details, vehicles, weapons, personnel, and equipment as provided in the data)

Conclusions: Add a conlusion within 50 words

Now, generate the report in a short, structured format";

            $prompt .= "1. A short summary of the operation in no more than 50 words.\n";

            $prompt .= "2. Key insights and performance metrics, such as vehicle,weapon,personnel,equipment details and operation status and generate this by reporting style. Limit the key points to 3-5 bullet points.\n";
            $prompt .= "The total report length should be under 500 words. Only generate report not other any extra topic and word\n\n";

            $prompt .= "Operation Details:\n";
           
            $prompt .= "Name: {$report['operation']->name}\n";
            $prompt .= "Status: {$report['operation']->status}\n why it is fail or success in conlusion";
            $prompt .= 'Start Date: '.($report['operation']->start_date ?? 'Not provided')."\n";
            $prompt .= 'End Date: '.($report['operation']->end_date ?? 'Not provided')."\n";
            $prompt .= 'Location: '.($report['operation']->location ?? 'Not provided')."\n";
            $prompt .= 'Budget: '.($report['operation']->budget ?? 'Not provided')."\n";
            $prompt .= 'operation final status:'.($data['operation_status']);
            $prompt .= "\nVehicle Details:\n";

            if (count($report['vehicle']) > 0) {

                foreach ($report['vehicle'] as $vehicle) {
                    $prompt .= "Vehicle Name: {$vehicle->vehicle_name}\n";
                    $prompt .= 'Vehicle Description: '.($vehicle->vehicle_description ?? 'Not provided')."\n";
                    $prompt .= "Vehicle Count: {$vehicle->vehicle_count}\n";
                    $prompt .= 'Vehicle Type: '.($vehicle->vehicle_type ?? 'Not provided')."\n";
                    $prompt .= 'Vehicle Category: '.($vehicle->vehicle_category ?? 'Not provided')."\n";
                    $prompt .= 'Vehicle Model: '.($vehicle->vehicle_model ?? 'Not provided')."\n";
                    $prompt .= 'Vehicle Manufacturer: '.($vehicle->vehicle_manufacturer ?? 'Not provided')."\n";
                    $prompt .= "Vehicle Serial Number: {$vehicle->vehicle_serial_number}\n";
                    $prompt .= 'Vehicle Capacity: '.($vehicle->vehicle_capacity ?? 'Not provided')."\n";

                }

            } else {

                $prompt .= "No vehicle data provided.\n";
            }

            $prompt .= "\nWeapon Details:\n";
            if (count($report['weapon']) > 0) {
                foreach ($report['weapon'] as $weapon) {
                    $prompt .= "Weapon Name: {$weapon->weapon_name}\n";
                    $prompt .= 'Weapon Description: '.($weapon->weapon_description ?? 'Not provided')."\n";
                    $prompt .= "Weapon Count: {$weapon->weapon_count}\n";
                    $prompt .= 'Weapon Category: '.($weapon->weapon_category ?? 'Not provided')."\n";
                    $prompt .= 'Weapon Type: '.($weapon->weapon_type ?? 'Not provided')."\n";
                    $prompt .= 'Weapon Model: '.($weapon->weapon_model ?? 'Not provided')."\n";
                    $prompt .= 'Weapon Manufacturer: '.($weapon->weapon_manufacturer ?? 'Not provided')."\n";
                    $prompt .= "Weapon Serial Number: {$weapon->weapon_serial_number}\n";
                    $prompt .= 'Weapon Weight: '.($weapon->weapon_weight ?? 'Not provided')." kg\n";
                    $prompt .= 'Weapon Range: '.($weapon->weapon_range ?? 'Not provided')." meters\n";
                }
            } else {
                $prompt .= "No weapon data provided.\n";
            }

            $prompt .= "\nPersonnel Details:\n";
            if (count($report['personnel']) > 0) {
                foreach ($report['personnel'] as $personnel) {
                    $prompt .= "Personnel Name: {$personnel->personnel_name}\n";
                    $prompt .= 'Personnel Description: '.($personnel->personnel_description ?? 'Not provided')."\n";
                    $prompt .= "Personnel Count: {$personnel->personnel_count}\n";
                    $prompt .= "Personnel Category: {$personnel->personnel_category}\n";
                    $prompt .= 'Personnel Type: '.($personnel->personnel_type ?? 'Not provided')."\n";
                    $prompt .= 'Personnel Rank: '.($personnel->personnel_rank ?? 'Not provided')."\n";
                    $prompt .= 'Skills: '.($personnel->skills ?? 'Not provided')."\n";
                    $prompt .= "Personnel Serial Number: {$personnel->personnel_serial_number}\n";
                }
            } else {
                $prompt .= "No personnel data provided.\n";
            }

            $prompt .= "\nEquipment Details:\n";
            if (count($report['equipment']) > 0) {
                foreach ($report['equipment'] as $equipment) {
                    $prompt .= "Equipment Name: {$equipment->equipment_name}\n";
                    $prompt .= 'Equipment Description: '.($equipment->equipment_description ?? 'Not provided')."\n";
                    $prompt .= "Equipment Count: {$equipment->equipment_count}\n";
                    $prompt .= 'Equipment Category: '.($equipment->equipment_category ?? 'Not provided')."\n";
                    $prompt .= 'Equipment Type: '.($equipment->equipment_type ?? 'Not provided')."\n";
                    $prompt .= 'Equipment Manufacturer: '.($equipment->equipment_manufacturer ?? 'Not provided')."\n";
                    $prompt .= "Equipment Serial Number: {$equipment->equipment_serial_number}\n";
                }
            } else {
                $prompt .= "No equipment data provided.\n";
            }

            $prompt .= "\nUse only the above details to generate the report. Ignore any external context or data.\n";

            return [$prompt, $report['operation']->name];
        } catch (Exception $e) {

            print_r('Error getting operation resources: '.$e->getMessage());

            return false;
        }
    }
}
