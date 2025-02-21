INSERT INTO roles (role_name, created_at, updated_at) VALUES
('admin', NOW(), NOW()),
('manager', NOW(), NOW()),
('operator', NOW(), NOW()),
('viewer', NOW(), NOW());

insert into users (name,password,email,role_id,parent_id) values 
("m1","password","test1@gmail.com",2,1),
("m2","password","test2@gmail.com",2,1),
("m3","password","test3@gmail.com",2,1);

insert into operations (name,status,created_by,updated_by) values
("testOp1","ongoing",1,1),
("testOp2","ongoing",5,5),
("testOp3","ongoing",6,6),
("testOp4","ongoing",6,6),
("testOp5","ongoing",7,7);

insert into resource_category (resource_category) values 
('vehicle'),
('weapon'),
('personnel'),
('equipment')

insert into weapon (weapon_name,authorized_by,weapon_count,weapon_serial_number) values
("AK47",1,2,"54515"),
("AK47",1,2,"54516")

insert into resources (resources_name,resource_category,weapon_id) values 
("ak47",2,1),
("ak47",2,2)

insert into operation_resources (operation_id,resource_id,resource_count) values 
(2,1,100)

