<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Weapon extends Model
{
    use HasFactory;
    protected $fillable = [
        'weapon_name',
        'weapon_description',
        'weapon_count',
        'weapon_category',
        'weapon_type',
        'weapon_model',
        'weapon_manufacturer',
        'weapon_serial_number',
        'weapon_weight',
        'weapon_range'
    ];
    protected $casts = [
        'weapon_count' => 'integer',
        'weapon_weight' => 'decimal:2',
        'weapon_range' => 'decimal:2',
    ];

    public function authorizedBy()
    {
        return $this->belongsTo(User::class, 'authorized_by');
    }

    public function resources()
    {
        return $this->hasOne(Resources::class, 'weapon_id');
    }

}
