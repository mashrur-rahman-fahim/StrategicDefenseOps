<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OperationResources extends Model
{
    use HasFactory;
    protected $fillable = [
        'resource_count',
        'operation_id',
        'resource_id'
    ];
   
    public function operation(){
        return $this->belongsTo(Operation::class,'operation_id');
    }
    public function resources(){
        return $this->belongsTo(Resources::class,'resource_id');
    }
}
