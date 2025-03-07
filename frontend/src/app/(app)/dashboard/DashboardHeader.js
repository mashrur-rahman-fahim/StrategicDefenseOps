import React from 'react'

const DashboardHeader = ({ user }) => {
    const role = {
        1: 'Admin',
        2: 'Manager',
        3: 'Operator',
        4: 'Viewer',
    }

    return (
        <div>
            <h1 className="mb-1">Dashboard</h1>
            <p className="text-muted mb-0">
                Welcome back, {`${user?.name} (${role[user.role_id]})` || 'User'}
            </p>
        </div>
    )
}

export default DashboardHeader