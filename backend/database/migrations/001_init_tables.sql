CREATE TABLE `roles` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `role_name` ENUM('admin', 'manager', 'operator', 'viewer') NOT NULL,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL
);
CREATE TABLE `users` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `email_verified_at` TIMESTAMP NULL,
    `password` VARCHAR(255) NOT NULL,
    `google_id` VARCHAR(255) NULL,
    `role_id` INT UNSIGNED NOT NULL,
    `parent_id` INT UNSIGNED NULL,
    `remember_token` VARCHAR(100) NULL,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE,
    CONSTRAINT `users_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `users`(`id`) ON delete set NULL
) ;
CREATE TABLE `password_resets` (
    `email` VARCHAR(255) NOT NULL PRIMARY KEY,
    `token` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NULL
);
CREATE TABLE `failed_jobs` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `uuid` VARCHAR(255) NOT NULL UNIQUE,
    `connection` TEXT NOT NULL,
    `queue` TEXT NOT NULL,
    `payload` LONGTEXT NOT NULL,
    `exception` LONGTEXT NOT NULL,
    `failed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE `personal_access_tokens` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `tokenable_type` VARCHAR(255) NOT NULL,
    `tokenable_id` INT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `token` VARCHAR(64) NOT NULL UNIQUE,
    `abilities` TEXT NULL,
    `last_used_at` TIMESTAMP NULL,
    `expires_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
    KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`, `tokenable_id`)
);
CREATE TABLE operations (
    id INT unsigned AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    status ENUM('ongoing', 'upcoming', 'completed') NOT NULL,
    start_date DATETIME NULL,
    end_date DATETIME NULL,
    location VARCHAR(255) NULL,
    created_by INT unsigned NOT NULL,
    updated_by INT unsigned NULL,
    budget DECIMAL(10, 2) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE set NULL
);




create table weapon(
    id INT unsigned AUTO_INCREMENT PRIMARY KEY,
    authorized_by INT unsigned not null ,
    weapon_name varchar(200) NOT NULL,
    weapon_description TEXT,
    weapon_count INT NOT NULL,
    weapon_category varchar(200), -- gun granade explosive
    weapon_type varchar(200),  -- rifle pistol
    weapon_model varchar(200),
    weapon_manufacturer varchar(200),
    weapon_serial_number varchar(200) NOT NULL UNIQUE,
    weapon_weight DECIMAL(10,2),
    weapon_range DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (authorized_by) REFERENCES users(id) ON DELETE CASCADE
   );
create table vehicle(
    id INT unsigned AUTO_INCREMENT PRIMARY KEY,
    authorized_by INT unsigned not null,
    vehicle_name varchar(200) NOT NULL,
    vehicle_description TEXT,
    vehicle_count INT NOT NULL,
    vehicle_type varchar(200),   -- car
    vehicle_category varchar(200) , -- land,air
    vehicle_model varchar(200),
    vehicle_manufacturer varchar(200),
    vehicle_serial_number varchar(200) NOT NULL UNIQUE,
    vehicle_capacity int ,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (authorized_by) REFERENCES users(id) on DELETE CASCADE
);
create table personnel(
    id INT unsigned AUTO_INCREMENT PRIMARY KEY,
    authorized_by INT unsigned not null,
    personnel_name varchar(200) NOT NULL,
    personnel_description TEXT,
    personnel_count INT NOT NULL,
    personnel_category varchar(200) NOT NULL, -- medical, eng
    personnel_type varchar(200), -- doctor,nurse
    personnel_rank varchar(200), -- captain, lieutenant
    skills varchar(200), -- first aid,heavy machinery
    personnel_serial_number varchar(200) not null UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (authorized_by) REFERENCES users(id) on DELETE CASCADE
);
create table equipment(
    id INT unsigned AUTO_INCREMENT PRIMARY KEY,
    authorized_by INT unsigned not null,
    equipment_name varchar(200) NOT NULL,
    equipment_description TEXT,
    equipment_count INT NOT NULL,
   equipment_category varchar(200), -- communication
    equipment_type varchar(200), -- radio, television
    equipment_manufacturer varchar(200),
    equipment_serial_number varchar(200) not null unique,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (authorized_by) REFERENCES users(id) on DELETE CASCADE
 );


create table resource_category(
    id INT unsigned AUTO_INCREMENT PRIMARY KEY,
    resource_category ENUM ('vehicle','weapon','personnel','equipment'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

create table Resources(
    id INT unsigned AUTO_INCREMENT PRIMARY KEY,
    resources_name VARCHAR(200) not null,
    resource_category int UNSIGNED not null ,
    weapon_id int unsigned NULL ,  
    vehicle_id int unsigned NULL ,
    personnel_id int unsigned NULL ,
    equipment_id int unsigned NULL ,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (weapon_id) REFERENCES weapon(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicle(id) ON DELETE CASCADE,
    FOREIGN KEY (personnel_id) REFERENCES personnel(id) ON DELETE CASCADE,
    FOREIGN KEY (resource_category) references resource_category(id) on DELETE CASCADE
);

create table operation_resources (
    id INT unsigned AUTO_INCREMENT PRIMARY KEY,
    operation_id  INT unsigned not null ,
    resource_id  INT unsigned not null ,
    resource_count INT unsigned not null,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (resource_id) references Resources(id) on DELETE CASCADE,
    FOREIGN KEY (operation_id) REFERENCES operations(id) on DELETE CASCADE
);

CREATE TABLE activity_log(
    id int unsigned auto_increment PRIMARY KEY,
    log_name VARCHAR(255) NULL,
    user_id INT unsigned NOT NULL,
    user_name VARCHAR(255) NULL,
    user_email VARCHAR(255) NULL,
    role_id int UNSIGNED NULL,
    description TEXT NOT NULL,
    subject_id int UNSIGNED NULL,
    subject_type VARCHAR(255) NULL,
    causer_id int UNSIGNED NULL,
    causer_type VARCHAR(255) NULL,
    properties JSON NULL,
    event VARCHAR(255) NULL, 
    batch_uuid CHAR(36) NULL, 
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    INDEX log_name_index (log_name),
    FOREIGN KEY (user_id) references users(id) on delete CASCADE,
    FOREIGN KEY (role_id) references roles(id) on delete set NULL
   
);


