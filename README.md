#  ![Logo](assets/logo.webp) **🎯✨ Strategic Defense Operations and Command Resource Coordination Management System** 🛡️🚀

---

A robust and centralized web-based solution designed to streamline the management of defense operations, optimize resource allocation, generate insightful analytics, and enhance decision-making through real-time updates. Built with Laravel and MySQL, this system ensures secure access, seamless coordination, and transparency for defense teams.

---

## 📋 Table of Contents
1. [👥 Team Members](#-team-members)
2. [🎯 Objective](#-objective)
3. [🎯 Target Audience](#-target-audience)
4. [💻 Tech Stack](#-tech-stack)
5. [🎨 UI Design](#-ui-design)
6. [⚙️ Features](#-features)
   - [🔒 User Authentication & Role Management](#-user-authentication--role-management)
   - [📊 Operations Dashboard](#-operations-dashboard)
   - [🛠️ Resource Management](#-resource-management)
   - [📈 Reports & Analytics](#-reports--analytics)
   - [🔔 Notifications](#-notifications)
   - [🗒️ Audit Logs](#-audit-logs)
7. [📞 Contact Us](#-contact)
8. [🎯 Milestones](#-milestones)
9. [📜 License](#-license)
10. [🤝 Contributing](#-contributing)

---

## 👥 Team Members
| Name                    | Roll        | Email                             | Role                           |
|-------------------------|-------------|-----------------------------------|--------------------------------|
| Mashrur Rahman          | 20220104108 | mashrur950@gmail.com              | Full-stack Developer  ( Lead ) |
| Ahnuf Karim Chowdhury   | 20220104122 | ahnufkarimchowdhury@gmail.com     | Full-stack Developer           |
| Nahid Asef              | 20220104128 | naas50dx@gmail.com                | Frontend Developer             |
| Chowdhury Ajmayeen Adil | 20220104121 | ajmayeen.cse.20220104121@aust.edu | Frontend Developer             |

---

## 🎯 Objective
This project aims to provide a centralized platform for managing defense operations, resources, and reports, ensuring real-time updates and optimized use of resources. The objective is to solve the challenge of efficiently coordinating large-scale operations in defense, improving decision-making through insightful analytics and real-time notifications.

---

## 🎯 Target Audience
The intended users of this application are defense operations teams, military command centers, and resource management units who need an integrated system for managing operations, tracking resources, and generating reports.

---

## 💻 Tech Stack
- **Backend**: Laravel
- **Frontend**: Next JS
- **Rendering Method**: Client-Side Rendering (CSR)

---

## 🎨 UI Design
[**🔗 View the ERD on Figma**](https://www.figma.com/design/Yj0yCxlnNI0jvJWOdml3Of/StrategicDefenseOps?node-id=0-1&p=f&t=CqUVnzrobXx0kBXt-0)

---

## 🎨 ERD (Entity Relationship Diagram)
![ERD Preview](assets/erd.png)

## ⚙️ Features

### 🔒 User Authentication & Role Management
- **Roles and Access**:
  - **Admin**: Full access to all authentication settings and role management.
  - **Manager**: Can manage users within their operations but cannot assign roles.
  - **Operator**: No access to role management or authentication settings.
  - **Viewer**: No access to role management or authentication settings.
- **How It Works**:
  - Users can register, log in, and authenticate through a secure system.
  - Roles (Admin, Manager, Operator, Viewer) are assigned upon user registration or by an Admin.
  - Each user’s access is restricted based on their role, ensuring that only authorized users can access sensitive data or features.
  - Admins can modify user roles and permissions to control access across the system.

---

### 📊 Operations Dashboard
- **Roles and Access**:
  - **Admin**: Full access to view, update, create, and delete operations.
  - **Manager**: Can view, update, and create operations but cannot delete.
  - **Operator**: Can view assigned operations and update their status.
  - **Viewer**: Read-only access to view ongoing and upcoming operations.
- **How It Works**:
  - Displays all ongoing and upcoming defense operations.
  - Admins and Managers can create and modify operations, specifying important details like start/end dates, resources, and personnel involved.
  - Operators can mark operations as completed or update their status.
  - Operations are grouped by status (Ongoing, Upcoming, Completed) to ensure easy monitoring.
  - A real-time updating system ensures that the dashboard is always current with the latest operation statuses.
  - **Weather Updates**: Weather information (e.g., temperature, humidity, storm warnings) will be displayed on the operations dashboard, integrating real-time weather data relevant to the operation locations.
  - **Location Tracking**: The system will track the real-time location of personnel, resources, and vehicles, which will be displayed directly on the operations dashboard to provide a comprehensive view.

---

### 🛠️ Resource Management
- **Roles and Access**:
  - **Admin**: Full access to manage resources (add, update, allocate, and delete).
  - **Manager**: Can allocate and update resources but cannot add or delete.
  - **Operator**: Can view assigned resources and update their status.
  - **Viewer**: Read-only access to view resource details.
- **How It Works**:
  - Admins and Managers can track and allocate resources such as vehicles, personnel, and equipment.
  - Resources are categorized (e.g., available, in use, maintenance) for easy monitoring.
  - Real-time alerts notify users of resource status changes (e.g., maintenance required).
  - Operators can only interact with resources assigned to their specific operations, ensuring that resources are not overused or misallocated.
  - Resources can be assigned directly to operations based on real-time needs and availability.

---

### 📈 Reports & Analytics
- **Roles and Access**:
  - **Admin**: Full access to view, generate, and export reports.
  - **Manager**: Can generate and view reports within their scope of operations.
  - **Operator**: Cannot generate or view reports.
  - **Viewer**: Cannot generate or view reports.
- **How It Works**:
  - Reports can be generated based on operations, resources, and other criteria like date range or resource type.
  - Admins and Managers can view generated reports and export them in formats like CSV or PDF.
  - Analytics include graphical visualizations such as pie charts, bar graphs, and line charts to help users interpret data and performance trends.
  - Reports are automatically generated after certain operations or resource changes, providing real-time insights into operations efficiency and resource utilization.

---

### 🔔 Notifications
- **Roles and Access**:
  - **Admin**: Can configure and send notifications to all users.
  - **Manager**: Can send notifications to users within their scope of operations.
  - **Operator**: Can receive notifications related to assigned operations and resources.
  - **Viewer**: Can receive notifications but cannot send or configure them.
- **How It Works**:
  - Real-time notifications alert users about critical events (e.g., operation status changes, resource issues).
  - Admins and Managers can configure notification triggers for specific actions (e.g., resource allocation, operation completion).
  - Notifications are sent via email or in-app alerts, and users can customize their preferences for which notifications they receive.
  - Operators receive updates relevant to their assigned operations, while Admins can configure system-wide alerts.
  - **Email Notifications**: Admins can configure automated email alerts for important events or updates regarding operations, resources, or system changes.

---

### 🗒️ Audit Logs
- **Roles and Access**:
  - **Admin**: Full access to all audit logs, including search and filter functionalities.
  - **Manager**: Can view audit logs related to operations and resources they manage.
  - **Operator**: Cannot access audit logs.
  - **Viewer**: Cannot access audit logs.
- **How It Works**:
  - Every action performed by a user (e.g., login, resource allocation, report generation) is logged in the system.
  - Admins have access to a complete audit trail of all actions performed within the system, which can be filtered by user, action type, or time range.
  - Logs include essential information such as timestamp, user details, action performed, and the affected resources or operations.
  - Audit logs ensure transparency, providing a detailed record of every system interaction for compliance, troubleshooting, and security purposes.

---

## 📞 Contact
For further inquiries or feedback, please contact:

- [**Mashrur Rahman**](mailto:mashrur950@gmail.com) - Lead Developer
- [**Ahnuf Karim Chowdhury**](mailto:ahnufkarimchowdhury@gmail.com) -  Developer
- [**Nahid Asef**](mailto:naas50dx@gmail.com) -  Developer
- [**Ahmayeen Adil**](mailto:ajmayeen.cse.20220104121@aust.edu) -  Developer
  
  

---

## 🎯 Milestones
1. **Milestone 1**: Initial setup and basic authentication system.
2. **Milestone 2**: Operations dashboard and resource management functionality.
3. **Milestone 3**: Finalization of reports, analytics, and real-time notifications.

---

## 📜 License

This project is licensed under the [GPL-3.0 License](https://opensource.org/licenses/GPL-3.0).


---

## 🤝 Contributing
We welcome contributions to this project! Please fork the repository and submit a pull request with your proposed changes.
