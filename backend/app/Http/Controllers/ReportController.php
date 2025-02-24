<?php
namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\User;
use App\Services\OllamaService;
use App\Services\ReportService;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    protected ReportService $reportService;
    protected OllamaService $ollamaService;

    public function __construct(ReportService $reportService, OllamaService $ollamaService)
    {
        $this->reportService = $reportService;
        $this->ollamaService = $ollamaService;
    }

    public function generateReport(Request $request, $operationId)
    {
        set_time_limit(300); // 5 minutes

        $data = $request->validate([
            "report_type" => "required|string",
            "operation_status" => "required|string"
        ]);
        $user = User::find(auth()->id());
        if (!$user || $user->role_id > 2) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }


        $info = $this->reportService->getReport($operationId, auth()->id(),$data);
        // return response( $report["operation"]->id);
        if(!$info){
            return response()->json(['error' => 'Failed to generate report'], 500);
        }
        $prompt=$info[0];
        $data['report_name']=$info[1];

        // Construct the prompt for the AI model
       




        return response()->stream(function () use ($data, $prompt, $operationId, $user) {
            $reportContent = '';
            $wordCount = 0;

            // Stream the AI response in chunks
            foreach ($this->ollamaService->generateResponse($prompt) as $chunk) {
                if (!empty($chunk)) {
                    // Split by word count and track the total length
                    $words = explode(' ', $chunk);
                    $wordCount += count($words);

                    // Accumulate the report content
                    $reportContent .= $chunk . " ";

                    // Flush output to keep the stream responsive
                    if (ob_get_level() > 0) {
                        ob_flush();
                    }
                    flush();
                }
            }

            // Once AI finishes, save the report to the database
            $report = Report::create([
                'report_name' => $data['report_name'],
                'operation_id' => $operationId,
                'generated_by' => $user->id,
                'report_summary' => "A concise summary of the operation with key insights.",
                'report_details' => $reportContent,
                'operation_status' => $data['operation_status'],
                'report_type' => $data['report_type']
            ]);

            echo $report;
        });
    }
}
