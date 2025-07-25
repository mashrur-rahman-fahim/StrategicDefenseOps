-- 20 Weapons
INSERT INTO weapon (authorized_by, weapon_name, weapon_description, weapon_count, weapon_category, weapon_type, weapon_model, weapon_manufacturer, weapon_serial_number, weapon_weight, weapon_range, created_at, updated_at) VALUES
(2, 'Assault Rifle A1', 'Standard issue assault rifle.', 50, 'Rifle', 'Assault', 'A1', 'ArmaTech', 'SN-A1001', 3.5, 400, NOW(), NOW()),
(2, 'Sniper Rifle S2', 'Long-range sniper rifle.', 10, 'Rifle', 'Sniper', 'S2', 'LongShot', 'SN-S2002', 6.2, 1200, NOW(), NOW()),
(2, 'Handgun H3', 'Compact sidearm.', 30, 'Pistol', 'Handgun', 'H3', 'QuickFire', 'SN-H3003', 1.1, 50, NOW(), NOW()),
(2, 'Shotgun SG4', 'Pump-action shotgun.', 15, 'Shotgun', 'Pump', 'SG4', 'BlastCo', 'SN-SG4004', 4.0, 70, NOW(), NOW()),
(2, 'SMG SM5', 'Submachine gun for close combat.', 25, 'SMG', 'Automatic', 'SM5', 'RapidFire', 'SN-SM5005', 2.8, 150, NOW(), NOW()),
(2, 'Machine Gun MG6', 'Heavy machine gun.', 8, 'MG', 'Heavy', 'MG6', 'IronWorks', 'SN-MG6006', 10.0, 800, NOW(), NOW()),
(2, 'Grenade Launcher GL7', 'Multi-shot grenade launcher.', 5, 'Launcher', 'Grenade', 'GL7', 'BoomTech', 'SN-GL7007', 7.5, 300, NOW(), NOW()),
(2, 'Rocket Launcher RL8', 'Anti-vehicle rocket launcher.', 3, 'Launcher', 'Rocket', 'RL8', 'RocketMan', 'SN-RL8008', 12.0, 1500, NOW(), NOW()),
(2, 'Carbine C9', 'Lightweight carbine.', 20, 'Rifle', 'Carbine', 'C9', 'LiteArms', 'SN-C9009', 2.9, 350, NOW(), NOW()),
(2, 'Marksman Rifle MR10', 'Semi-auto marksman rifle.', 12, 'Rifle', 'Marksman', 'MR10', 'Precision', 'SN-MR1010', 5.0, 900, NOW(), NOW()),
(2, 'Light Machine Gun LMG11', 'Squad support weapon.', 7, 'MG', 'Light', 'LMG11', 'SupportArms', 'SN-LMG1111', 8.5, 600, NOW(), NOW()),
(2, 'Compact SMG CSM12', 'Ultra-compact SMG.', 18, 'SMG', 'Compact', 'CSM12', 'UrbanArms', 'SN-CSM1212', 2.2, 120, NOW(), NOW()),
(2, 'Tactical Shotgun TS13', 'Tactical semi-auto shotgun.', 10, 'Shotgun', 'Tactical', 'TS13', 'TacShot', 'SN-TS1313', 3.8, 80, NOW(), NOW()),
(2, 'Revolver R14', 'Heavy caliber revolver.', 9, 'Pistol', 'Revolver', 'R14', 'OldWest', 'SN-R1414', 1.4, 60, NOW(), NOW()),
(2, 'Anti-Material Rifle AMR15', 'High-caliber anti-material rifle.', 2, 'Rifle', 'Anti-Material', 'AMR15', 'BigShot', 'SN-AMR1515', 13.0, 2000, NOW(), NOW()),
(2, 'PDW P16', 'Personal defense weapon.', 14, 'PDW', 'Automatic', 'P16', 'Defender', 'SN-P1616', 2.5, 200, NOW(), NOW()),
(2, 'Combat Knife CK17', 'Standard combat knife.', 100, 'Knife', 'Combat', 'CK17', 'SteelEdge', 'SN-CK1717', 0.3, 1, NOW(), NOW()),
(2, 'Flamethrower F18', 'Short-range flamethrower.', 1, 'Special', 'Flamethrower', 'F18', 'FireStorm', 'SN-F1818', 16.0, 30, NOW(), NOW()),
(2, 'Grenade G19', 'Fragmentation grenade.', 40, 'Explosive', 'Grenade', 'G19', 'BoomCo', 'SN-G1919', 0.4, 15, NOW(), NOW()),
(2, 'Stun Gun SG20', 'Non-lethal stun gun.', 22, 'Pistol', 'Stun', 'SG20', 'SafeGuard', 'SN-SG2020', 0.8, 10, NOW(), NOW());

-- 20 Vehicles
INSERT INTO vehicle (authorized_by, vehicle_name, vehicle_description, vehicle_count, vehicle_type, vehicle_category, vehicle_model, vehicle_manufacturer, vehicle_serial_number, vehicle_capacity, created_at, updated_at) VALUES
(2, 'Armored Truck AT1', 'Heavy armored transport vehicle.', 5, 'Truck', 'Armored', 'AT1', 'SafeMove', 'V-AT1001', 12, NOW(), NOW()),
(2, 'Recon Jeep RJ2', 'Lightweight reconnaissance jeep.', 8, 'Jeep', 'Recon', 'RJ2', 'FastTrack', 'V-RJ2002', 4, NOW(), NOW()),
(2, 'Medical Van MV3', 'Equipped for field medical support.', 3, 'Van', 'Medical', 'MV3', 'MediTrans', 'V-MV3003', 6, NOW(), NOW()),
(2, 'Patrol Car PC4', 'Standard patrol car.', 10, 'Car', 'Patrol', 'PC4', 'AutoGuard', 'V-PC4004', 5, NOW(), NOW()),
(2, 'Supply Truck ST5', 'Large supply transport truck.', 4, 'Truck', 'Supply', 'ST5', 'CargoMax', 'V-ST5005', 20, NOW(), NOW()),
(2, 'Command SUV CS6', 'SUV for command staff.', 2, 'SUV', 'Command', 'CS6', 'LeaderAuto', 'V-CS6006', 7, NOW(), NOW()),
(2, 'APC APC7', 'Armored personnel carrier.', 6, 'APC', 'Armored', 'APC7', 'Defender', 'V-APC7007', 10, NOW(), NOW()),
(2, 'Motorbike MB8', 'Fast response motorbike.', 12, 'Bike', 'Motorbike', 'MB8', 'Speedster', 'V-MB8008', 2, NOW(), NOW()),
(2, 'Fuel Tanker FT9', 'Fuel supply tanker.', 2, 'Tanker', 'Fuel', 'FT9', 'FuelTrans', 'V-FT9009', 15, NOW(), NOW()),
(2, 'Rescue Helicopter RH10', 'Helicopter for rescue missions.', 1, 'Helicopter', 'Rescue', 'RH10', 'SkyLift', 'V-RH1010', 8, NOW(), NOW()),
(2, 'Cargo Van CV11', 'General cargo van.', 7, 'Van', 'Cargo', 'CV11', 'HaulPro', 'V-CV1111', 10, NOW(), NOW()),
(2, 'Water Tanker WT12', 'Water supply tanker.', 2, 'Tanker', 'Water', 'WT12', 'AquaMove', 'V-WT1212', 14, NOW(), NOW()),
(2, 'Fire Truck FT13', 'Firefighting vehicle.', 1, 'Truck', 'Fire', 'FT13', 'FireSafe', 'V-FT1313', 6, NOW(), NOW()),
(2, 'Ambulance AM14', 'Emergency medical ambulance.', 3, 'Van', 'Ambulance', 'AM14', 'LifeLine', 'V-AM1414', 5, NOW(), NOW()),
(2, 'Transport Bus TB15', 'Personnel transport bus.', 2, 'Bus', 'Transport', 'TB15', 'PeopleMover', 'V-TB1515', 30, NOW(), NOW()),
(2, 'Engineering Truck ET16', 'Engineering support truck.', 2, 'Truck', 'Engineering', 'ET16', 'BuildTech', 'V-ET1616', 8, NOW(), NOW()),
(2, 'Drone Carrier DC17', 'Carrier for surveillance drones.', 1, 'Carrier', 'Drone', 'DC17', 'AeroTech', 'V-DC1717', 10, NOW(), NOW()),
(2, 'Hazmat Van HV18', 'Hazardous material response van.', 1, 'Van', 'Hazmat', 'HV18', 'SafeChem', 'V-HV1818', 4, NOW(), NOW()),
(2, 'Mobile Workshop MW19', 'Mobile repair workshop.', 1, 'Truck', 'Workshop', 'MW19', 'FixIt', 'V-MW1919', 6, NOW(), NOW()),
(2, 'Observation Balloon OB20', 'Tethered observation balloon.', 1, 'Balloon', 'Observation', 'OB20', 'SkyView', 'V-OB2020', 3, NOW(), NOW());

-- 20 Personnel
INSERT INTO personnel (authorized_by, personnel_name, personnel_description, personnel_count, personnel_category, personnel_type, personnel_rank, skills, personnel_serial_number, created_at, updated_at) VALUES
(2, 'John Carter', 'Infantry squad leader.', 10, 'Infantry', 'Soldier', 'Sergeant', 'Marksmanship, Tactics', 'P-SN1001', NOW(), NOW()),
(2, 'Alice Kim', 'Field medic specialist.', 5, 'Medical', 'Medic', 'Corporal', 'First Aid, Trauma Care', 'P-SN1002', NOW(), NOW()),
(2, 'David Singh', 'Reconnaissance expert.', 8, 'Recon', 'Scout', 'Private', 'Stealth, Surveillance', 'P-SN1003', NOW(), NOW()),
(2, 'Maria Lopez', 'Communications officer.', 3, 'Support', 'Communications', 'Lieutenant', 'Radio Ops, Encryption', 'P-SN1004', NOW(), NOW()),
(2, 'James Lee', 'Heavy weapons operator.', 6, 'Infantry', 'Gunner', 'Corporal', 'Heavy Weapons, Defense', 'P-SN1005', NOW(), NOW()),
(2, 'Sara Novak', 'Logistics coordinator.', 4, 'Support', 'Logistics', 'Sergeant', 'Supply Chain, Planning', 'P-SN1006', NOW(), NOW()),
(2, 'Omar Farouk', 'Vehicle mechanic.', 7, 'Engineering', 'Mechanic', 'Private', 'Repair, Maintenance', 'P-SN1007', NOW(), NOW()),
(2, 'Linda Zhang', 'Drone operator.', 2, 'Recon', 'Drone Pilot', 'Specialist', 'UAV Control, Mapping', 'P-SN1008', NOW(), NOW()),
(2, 'Victor Ivanov', 'Sniper team leader.', 2, 'Infantry', 'Sniper', 'Sergeant', 'Long-range Shooting', 'P-SN1009', NOW(), NOW()),
(2, 'Emily Brown', 'Field intelligence analyst.', 3, 'Intelligence', 'Analyst', 'Lieutenant', 'Analysis, Reporting', 'P-SN1010', NOW(), NOW()),
(2, 'Carlos Mendes', 'Explosives expert.', 1, 'Engineering', 'EOD', 'Corporal', 'Demolition, EOD', 'P-SN1011', NOW(), NOW()),
(2, 'Fatima Al-Sayed', 'Medical evacuation nurse.', 2, 'Medical', 'Nurse', 'Private', 'Evacuation, First Aid', 'P-SN1012', NOW(), NOW()),
(2, 'George Smith', 'Squad marksman.', 5, 'Infantry', 'Marksman', 'Private', 'Sharpshooting', 'P-SN1013', NOW(), NOW()),
(2, 'Hiro Tanaka', 'Radio technician.', 2, 'Support', 'Technician', 'Specialist', 'Radio Repair', 'P-SN1014', NOW(), NOW()),
(2, 'Isabella Rossi', 'Field cook.', 3, 'Support', 'Cook', 'Private', 'Cooking, Nutrition', 'P-SN1015', NOW(), NOW()),
(2, 'Jack Wilson', 'Armored vehicle driver.', 4, 'Engineering', 'Driver', 'Corporal', 'Driving, Navigation', 'P-SN1016', NOW(), NOW()),
(2, 'Khalid Hassan', 'Base security guard.', 6, 'Security', 'Guard', 'Private', 'Patrol, Surveillance', 'P-SN1017', NOW(), NOW()),
(2, 'Laura Müller', 'Field nurse.', 2, 'Medical', 'Nurse', 'Private', 'First Aid, Triage', 'P-SN1018', NOW(), NOW()),
(2, 'Mohammed Ali', 'Interpreter.', 1, 'Support', 'Interpreter', 'Specialist', 'Languages, Translation', 'P-SN1019', NOW(), NOW()),
(2, 'Natalie Dubois', 'Operations planner.', 2, 'Intelligence', 'Planner', 'Lieutenant', 'Strategy, Planning', 'P-SN1020', NOW(), NOW());

-- 20 Equipment
INSERT INTO equipment (authorized_by, equipment_name, equipment_description, equipment_count, equipment_category, equipment_type, equipment_manufacturer, equipment_serial_number, created_at, updated_at) VALUES
(2, 'Night Vision Goggles', 'Enhanced night vision for troops.', 30, 'Optics', 'Goggles', 'VisionPro', 'EQ-SN1001', NOW(), NOW()),
(2, 'Radio Set RS2', 'Long-range communication radio.', 15, 'Communications', 'Radio', 'ComTech', 'EQ-SN1002', NOW(), NOW()),
(2, 'Body Armor BA3', 'Kevlar body armor vest.', 40, 'Protection', 'Vest', 'SafeGuard', 'EQ-SN1003', NOW(), NOW()),
(2, 'First Aid Kit FA4', 'Comprehensive field first aid kit.', 50, 'Medical', 'Kit', 'MediPack', 'EQ-SN1004', NOW(), NOW()),
(2, 'Portable Generator PG5', 'Field power generator.', 5, 'Power', 'Generator', 'PowerGen', 'EQ-SN1005', NOW(), NOW()),
(2, 'Drone DR6', 'Reconnaissance drone.', 8, 'Recon', 'Drone', 'AeroScout', 'EQ-SN1006', NOW(), NOW()),
(2, 'Water Purifier WP7', 'Portable water purification unit.', 12, 'Utility', 'Purifier', 'PureLife', 'EQ-SN1007', NOW(), NOW()),
(2, 'Binoculars BN8', 'High-zoom binoculars.', 25, 'Optics', 'Binoculars', 'ZoomMax', 'EQ-SN1008', NOW(), NOW()),
(2, 'Satellite Phone SP9', 'Global satellite phone.', 10, 'Communications', 'Phone', 'SatCom', 'EQ-SN1009', NOW(), NOW()),
(2, 'Tool Kit TK10', 'Multi-purpose field tool kit.', 20, 'Utility', 'Tool Kit', 'FixIt', 'EQ-SN1010', NOW(), NOW()),
(2, 'Gas Mask GM11', 'Chemical protection gas mask.', 35, 'Protection', 'Mask', 'SafeBreath', 'EQ-SN1011', NOW(), NOW()),
(2, 'Thermal Imager TI12', 'Thermal imaging device.', 6, 'Optics', 'Imager', 'HeatSeek', 'EQ-SN1012', NOW(), NOW()),
(2, 'Field Laptop FL13', 'Rugged field laptop.', 7, 'Computing', 'Laptop', 'ToughTech', 'EQ-SN1013', NOW(), NOW()),
(2, 'Medical Tent MT14', 'Portable medical tent.', 3, 'Medical', 'Tent', 'ShelterPro', 'EQ-SN1014', NOW(), NOW()),
(2, 'Metal Detector MD15', 'Mine and metal detector.', 9, 'Detection', 'Detector', 'FindAll', 'EQ-SN1015', NOW(), NOW()),
(2, 'Portable Stove PS16', 'Compact field stove.', 18, 'Utility', 'Stove', 'CookEasy', 'EQ-SN1016', NOW(), NOW()),
(2, 'Solar Charger SC17', 'Solar charging unit.', 11, 'Power', 'Charger', 'SunPower', 'EQ-SN1017', NOW(), NOW()),
(2, 'Field Camera FC18', 'High-res field camera.', 4, 'Recon', 'Camera', 'SnapShot', 'EQ-SN1018', NOW(), NOW()),
(2, 'Hazmat Suit HS19', 'Full-body hazmat suit.', 5, 'Protection', 'Suit', 'SafeWear', 'EQ-SN1019', NOW(), NOW()),
(2, 'Satellite Uplink SU20', 'Portable satellite uplink.', 2, 'Communications', 'Uplink', 'SatLink', 'EQ-SN1020', NOW(), NOW());

-- 20 Resources for weapons
INSERT INTO resources (resources_name, resource_category, weapon_id, vehicle_id, personnel_id, equipment_id, created_at, updated_at) VALUES
('Assault Rifle A1', 2, 1, NULL, NULL, NULL, NOW(), NOW()),
('Sniper Rifle S2', 2, 2, NULL, NULL, NULL, NOW(), NOW()),
('Handgun H3', 2, 3, NULL, NULL, NULL, NOW(), NOW()),
('Shotgun SG4', 2, 4, NULL, NULL, NULL, NOW(), NOW()),
('SMG SM5', 2, 5, NULL, NULL, NULL, NOW(), NOW()),
('Machine Gun MG6', 2, 6, NULL, NULL, NULL, NOW(), NOW()),
('Grenade Launcher GL7', 2, 7, NULL, NULL, NULL, NOW(), NOW()),
('Rocket Launcher RL8', 2, 8, NULL, NULL, NULL, NOW(), NOW()),
('Carbine C9', 2, 9, NULL, NULL, NULL, NOW(), NOW()),
('Marksman Rifle MR10', 2, 10, NULL, NULL, NULL, NOW(), NOW()),
('Light Machine Gun LMG11', 2, 11, NULL, NULL, NULL, NOW(), NOW()),
('Compact SMG CSM12', 2, 12, NULL, NULL, NULL, NOW(), NOW()),
('Tactical Shotgun TS13', 2, 13, NULL, NULL, NULL, NOW(), NOW()),
('Revolver R14', 2, 14, NULL, NULL, NULL, NOW(), NOW()),
('Anti-Material Rifle AMR15', 2, 15, NULL, NULL, NULL, NOW(), NOW()),
('PDW P16', 2, 16, NULL, NULL, NULL, NOW(), NOW()),
('Combat Knife CK17', 2, 17, NULL, NULL, NULL, NOW(), NOW()),
('Flamethrower F18', 2, 18, NULL, NULL, NULL, NOW(), NOW()),
('Grenade G19', 2, 19, NULL, NULL, NULL, NOW(), NOW()),
('Stun Gun SG20', 2, 20, NULL, NULL, NULL, NOW(), NOW());

-- 20 Resources for vehicles
INSERT INTO resources (resources_name, resource_category, weapon_id, vehicle_id, personnel_id, equipment_id, created_at, updated_at) VALUES
('Armored Truck AT1', 1, NULL, 1, NULL, NULL, NOW(), NOW()),
('Recon Jeep RJ2', 1, NULL, 2, NULL, NULL, NOW(), NOW()),
('Medical Van MV3', 1, NULL, 3, NULL, NULL, NOW(), NOW()),
('Patrol Car PC4', 1, NULL, 4, NULL, NULL, NOW(), NOW()),
('Supply Truck ST5', 1, NULL, 5, NULL, NULL, NOW(), NOW()),
('Command SUV CS6', 1, NULL, 6, NULL, NULL, NOW(), NOW()),
('APC APC7', 1, NULL, 7, NULL, NULL, NOW(), NOW()),
('Motorbike MB8', 1, NULL, 8, NULL, NULL, NOW(), NOW()),
('Fuel Tanker FT9', 1, NULL, 9, NULL, NULL, NOW(), NOW()),
('Rescue Helicopter RH10', 1, NULL, 10, NULL, NULL, NOW(), NOW()),
('Cargo Van CV11', 1, NULL, 11, NULL, NULL, NOW(), NOW()),
('Water Tanker WT12', 1, NULL, 12, NULL, NULL, NOW(), NOW()),
('Fire Truck FT13', 1, NULL, 13, NULL, NULL, NOW(), NOW()),
('Ambulance AM14', 1, NULL, 14, NULL, NULL, NOW(), NOW()),
('Transport Bus TB15', 1, NULL, 15, NULL, NULL, NOW(), NOW()),
('Engineering Truck ET16', 1, NULL, 16, NULL, NULL, NOW(), NOW()),
('Drone Carrier DC17', 1, NULL, 17, NULL, NULL, NOW(), NOW()),
('Hazmat Van HV18', 1, NULL, 18, NULL, NULL, NOW(), NOW()),
('Mobile Workshop MW19', 1, NULL, 19, NULL, NULL, NOW(), NOW()),
('Observation Balloon OB20', 1, NULL, 20, NULL, NULL, NOW(), NOW());

-- 20 Resources for personnel
INSERT INTO resources (resources_name, resource_category, weapon_id, vehicle_id, personnel_id, equipment_id, created_at, updated_at) VALUES
('John Carter', 3, NULL, NULL, 1, NULL, NOW(), NOW()),
('Alice Kim', 3, NULL, NULL, 2, NULL, NOW(), NOW()),
('David Singh', 3, NULL, NULL, 3, NULL, NOW(), NOW()),
('Maria Lopez', 3, NULL, NULL, 4, NULL, NOW(), NOW()),
('James Lee', 3, NULL, NULL, 5, NULL, NOW(), NOW()),
('Sara Novak', 3, NULL, NULL, 6, NULL, NOW(), NOW()),
('Omar Farouk', 3, NULL, NULL, 7, NULL, NOW(), NOW()),
('Linda Zhang', 3, NULL, NULL, 8, NULL, NOW(), NOW()),
('Victor Ivanov', 3, NULL, NULL, 9, NULL, NOW(), NOW()),
('Emily Brown', 3, NULL, NULL, 10, NULL, NOW(), NOW()),
('Carlos Mendes', 3, NULL, NULL, 11, NULL, NOW(), NOW()),
('Fatima Al-Sayed', 3, NULL, NULL, 12, NULL, NOW(), NOW()),
('George Smith', 3, NULL, NULL, 13, NULL, NOW(), NOW()),
('Hiro Tanaka', 3, NULL, NULL, 14, NULL, NOW(), NOW()),
('Isabella Rossi', 3, NULL, NULL, 15, NULL, NOW(), NOW()),
('Jack Wilson', 3, NULL, NULL, 16, NULL, NOW(), NOW()),
('Khalid Hassan', 3, NULL, NULL, 17, NULL, NOW(), NOW()),
('Laura Müller', 3, NULL, NULL, 18, NULL, NOW(), NOW()),
('Mohammed Ali', 3, NULL, NULL, 19, NULL, NOW(), NOW()),
('Natalie Dubois', 3, NULL, NULL, 20, NULL, NOW(), NOW());

-- 20 Resources for equipment
INSERT INTO resources (resources_name, resource_category, weapon_id, vehicle_id, personnel_id, equipment_id, created_at, updated_at) VALUES
('Night Vision Goggles', 4, NULL, NULL, NULL, 1, NOW(), NOW()),
('Radio Set RS2', 4, NULL, NULL, NULL, 2, NOW(), NOW()),
('Body Armor BA3', 4, NULL, NULL, NULL, 3, NOW(), NOW()),
('First Aid Kit FA4', 4, NULL, NULL, NULL, 4, NOW(), NOW()),
('Portable Generator PG5', 4, NULL, NULL, NULL, 5, NOW(), NOW()),
('Drone DR6', 4, NULL, NULL, NULL, 6, NOW(), NOW()),
('Water Purifier WP7', 4, NULL, NULL, NULL, 7, NOW(), NOW()),
('Binoculars BN8', 4, NULL, NULL, NULL, 8, NOW(), NOW()),
('Satellite Phone SP9', 4, NULL, NULL, NULL, 9, NOW(), NOW()),
('Tool Kit TK10', 4, NULL, NULL, NULL, 10, NOW(), NOW()),
('Gas Mask GM11', 4, NULL, NULL, NULL, 11, NOW(), NOW()),
('Thermal Imager TI12', 4, NULL, NULL, NULL, 12, NOW(), NOW()),
('Field Laptop FL13', 4, NULL, NULL, NULL, 13, NOW(), NOW()),
('Medical Tent MT14', 4, NULL, NULL, NULL, 14, NOW(), NOW()),
('Metal Detector MD15', 4, NULL, NULL, NULL, 15, NOW(), NOW()),
('Portable Stove PS16', 4, NULL, NULL, NULL, 16, NOW(), NOW()),
('Solar Charger SC17', 4, NULL, NULL, NULL, 17, NOW(), NOW()),
('Field Camera FC18', 4, NULL, NULL, NULL, 18, NOW(), NOW()),
('Hazmat Suit HS19', 4, NULL, NULL, NULL, 19, NOW(), NOW()),
('Satellite Uplink SU20', 4, NULL, NULL, NULL, 20, NOW(), NOW());

-- 20 Operations
INSERT INTO operations (name, description, status, start_date, end_date, location, created_by, updated_by, budget, created_at, updated_at) VALUES
('Operation Alpha', 'Secure the Alpha sector perimeter.', 'ongoing', '2025-07-01 08:00:00', NULL, 'Alpha Base', 2, 2, 15000.00, NOW(), NOW()),
('Operation Bravo', 'Reconnaissance in Bravo hills.', 'upcoming', '2025-07-15 09:00:00', NULL, 'Bravo Hills', 2, 2, 12000.00, NOW(), NOW()),
('Operation Charlie', 'Night patrol in Charlie district.', 'completed', '2025-06-10 22:00:00', '2025-06-11 06:00:00', 'Charlie District', 2, 2, 9000.00, NOW(), NOW()),
('Operation Delta', 'Evacuation drill for Delta city.', 'ongoing', '2025-07-05 10:00:00', NULL, 'Delta City', 2, 2, 18000.00, NOW(), NOW()),
('Operation Echo', 'Supply drop at Echo outpost.', 'upcoming', '2025-07-20 14:00:00', NULL, 'Echo Outpost', 2, 2, 11000.00, NOW(), NOW()),
('Operation Foxtrot', 'Medical support for Foxtrot camp.', 'completed', '2025-06-20 07:00:00', '2025-06-20 19:00:00', 'Foxtrot Camp', 2, 2, 8000.00, NOW(), NOW()),
('Operation Golf', 'Training exercise in Golf sector.', 'ongoing', '2025-07-03 13:00:00', NULL, 'Golf Sector', 2, 2, 9500.00, NOW(), NOW()),
('Operation Hotel', 'Resource audit at Hotel warehouse.', 'upcoming', '2025-07-18 11:00:00', NULL, 'Hotel Warehouse', 2, 2, 13000.00, NOW(), NOW()),
('Operation India', 'Border patrol in India region.', 'completed', '2025-06-15 06:00:00', '2025-06-15 18:00:00', 'India Region', 2, 2, 10500.00, NOW(), NOW()),
('Operation Juliet', 'Personnel rotation at Juliet base.', 'ongoing', '2025-07-08 15:00:00', NULL, 'Juliet Base', 2, 2, 11500.00, NOW(), NOW()),
('Operation Kilo', 'Equipment maintenance in Kilo zone.', 'upcoming', '2025-07-22 10:00:00', NULL, 'Kilo Zone', 2, 2, 12500.00, NOW(), NOW()),
('Operation Lima', 'Recon mission in Lima valley.', 'completed', '2025-06-18 05:00:00', '2025-06-18 17:00:00', 'Lima Valley', 2, 2, 14000.00, NOW(), NOW()),
('Operation Mike', 'Night ops in Mike forest.', 'ongoing', '2025-07-04 21:00:00', NULL, 'Mike Forest', 2, 2, 9500.00, NOW(), NOW()),
('Operation November', 'Logistics run to November depot.', 'upcoming', '2025-07-25 12:00:00', NULL, 'November Depot', 2, 2, 10000.00, NOW(), NOW()),
('Operation Oscar', 'Surveillance in Oscar sector.', 'completed', '2025-06-12 08:00:00', '2025-06-12 20:00:00', 'Oscar Sector', 2, 2, 11000.00, NOW(), NOW()),
('Operation Papa', 'Evacuation support at Papa town.', 'ongoing', '2025-07-09 16:00:00', NULL, 'Papa Town', 2, 2, 12000.00, NOW(), NOW()),
('Operation Quebec', 'Training at Quebec range.', 'upcoming', '2025-07-28 09:00:00', NULL, 'Quebec Range', 2, 2, 13000.00, NOW(), NOW()),
('Operation Romeo', 'Supply chain review in Romeo city.', 'completed', '2025-06-22 07:00:00', '2025-06-22 19:00:00', 'Romeo City', 2, 2, 14000.00, NOW(), NOW()),
('Operation Sierra', 'Recon in Sierra mountains.', 'ongoing', '2025-07-06 10:00:00', NULL, 'Sierra Mountains', 2, 2, 15000.00, NOW(), NOW()),
('Operation Tango', 'Night watch in Tango valley.', 'upcoming', '2025-07-30 20:00:00', NULL, 'Tango Valley', 2, 2, 16000.00, NOW(), NOW());
