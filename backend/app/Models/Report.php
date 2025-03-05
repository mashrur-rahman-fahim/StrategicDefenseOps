<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $table = 'reports'; // Table name

    protected $fillable = [
        'report_type',
        'operation_id',
        'generated_by',
        'report_summary',
        'report_details',
        'operation_status',
        'report_name',
    ];

    /**
     * Get the operation associated with the report.
     */
    public function operation()
    {
        return $this->belongsTo(Operation::class, 'operation_id');
    }

    /**
     * Get the resource associated with the report.
     */
    public function resource()
    {
        return $this->belongsTo(Resources::class, 'resource_id');
    }

    /**
     * Get the user who generated the report.
     */
    public function generatedBy()
    {
        return $this->belongsTo(User::class, 'generated_by');
    }
}
