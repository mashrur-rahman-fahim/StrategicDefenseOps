<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Operation extends Model
{
    use HasFactory;

    // Specify the table name (optional if the table name matches the model name)
    protected $table = 'operations';

    // Define the fillable fields (mass assignment protection)
    protected $fillable = [
        'name',
        'description',
        'status',
        'start_date',
        'end_date',
        'location',
        'budget',
        'created_by',
        'updated_by',
    ];

    // Define the casts for specific attributes
    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'budget' => 'decimal:2',
    ];

    // Relationships
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function resources()
    {
        return $this->belongsToMany(Resources::class, 'operation_resources', 'operation_id', 'resource_id')
                    ->withPivot('resource_count')
                    ->withTimestamps();
    }
    
}