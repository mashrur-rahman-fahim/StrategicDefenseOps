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
        set_time_limit(500);
        $this->reportService = $reportService;
        $this->ollamaService = $ollamaService;
    }

    public function generateReport(Request $request, $operationId)
    {
        set_time_limit(500); // 5 minutes

        $data = $request->validate([
            'report_type' => 'required|string',
            'operation_status' => 'required|string',
        ]);

        $user = User::find(auth()->id());
        if (!$user || $user->role_id > 2) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $info = $this->reportService->getReport($operationId, auth()->id(), $data);

        if (!$info) {
            return response()->json(['error' => 'Failed to generate report'], 500);
        }

        $prompt = $info[0];
        $data['report_name'] = $info[1];

        return response()->stream(function () use ($data, $prompt, $operationId, $user) {
            $reportContent = '';
            $errorOccurred = false;

            try {
                foreach ($this->ollamaService->generateResponse($prompt) as $chunk) {
                    if (!empty($chunk)) {
                        echo $chunk . "\n";
                        $reportContent .= $chunk . ' ';

                        if (ob_get_level() > 0) {
                            ob_flush();
                        }
                        flush();
                    }
                }
            } catch (\Exception $e) {
                \Log::error('Error generating AI report: ' . $e->getMessage());
                $errorOccurred = true;
                echo json_encode(['error' => 'AI generation failed.']) . "\n";
                flush();
            }

            if (!$errorOccurred && !empty($reportContent)) {
                try {
                    Report::create([
                        'report_name' => $data['report_name'],
                        'operation_id' => $operationId,
                        'generated_by' => $user->id,
                        'report_summary' => 'A concise summary of the operation with key insights.',
                        'report_details' => trim($reportContent),
                        'operation_status' => $data['operation_status'],
                        'report_type' => $data['report_type'],
                    ]);
                } catch (\Exception $e) {
                    \Log::error('Error saving report to database: ' . $e->getMessage());
                }
            }

        }, 200, [
            'Content-Type' => 'text/plain',
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'X-Accel-Buffering' => 'no',
            'Connection' => 'keep-alive',
        ]);
    }
    public function viewReport($operationId){
        $report=$this->reportService->viewReport($operationId);
        if($report){
            return response()->json($report,200);
        }
        return response()->json(['error'=>'Report not found'],404);
    }
    public function editReport($operationId,Request $request){
        $user = User::find(auth()->id());
        $data=$request->validate([
            'report_name'=>'nullable|string',
            'report_summary'=>'nullable|string',
            'report_details'=>'nullable|string',
        ]);
        if (!$user || $user->role_id > 2) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $report=$this->reportService->editReport($data,$operationId);
        if($report){
            return response()->json($report,200);
        }
        return response()->json(['error'=>'Failed to update report'],500);
    }
    public function deleteReport($operationId){
        $user = User::find(auth()->id());
        if (!$user || $user->role_id > 1) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $report=$this->reportService->deleteReport($operationId);
        if($report){
            return response()->json(['message'=>'Report deleted successfully'],200);
        }
        return response()->json(['error'=>'Failed to delete report'],500);
    }

}
