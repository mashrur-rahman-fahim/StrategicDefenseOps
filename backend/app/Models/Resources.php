<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resources extends Model
{
    use HasFactory;
    protected $fillable=[
        'name',
        'weapon_id',
        'resource_category',
    ];
    public function category()
    {
        return $this->belongsTo(ResourceCategory::class, 'resource_category');
    }

    public function weapon()
    {
        return $this->belongsTo(Weapon::class, 'weapon_id');
    }

    public function operations()
    {
        return $this->belongsToMany(Operation::class, 'operation_resources', 'resource_id', 'operation_id')
                    ->withPivot('resource_count')
                    ->withTimestamps();
    }
   
}
