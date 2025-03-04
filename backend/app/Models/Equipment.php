<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipment extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'equipment';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'authorized_by',
        'equipment_name',
        'equipment_description',
        'equipment_count',
        'equipment_category',
        'equipment_type',
        'equipment_manufacturer',
        'equipment_serial_number',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'equipment_count' => 'integer', // Cast equipment_count to integer
    ];

    /**
     * Get the user who authorized the equipment.
     */
    public function authorizedBy()
    {
        return $this->belongsTo(User::class, 'authorized_by');
    }

    /**
     * Get the resource associated with the equipment.
     */
    public function resource()
    {
        return $this->hasOne(Resources::class, 'equipment_id');
    }
}
