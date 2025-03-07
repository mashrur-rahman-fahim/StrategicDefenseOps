// page.js
'use client'
import React, { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import axios from '@/lib/axios'
import { useAuth } from '@/hooks/auth'
import Layout from '@/components/layout'
import Loading from '@/components/Loading'
import DashboardHeader from './DashboardHeader'
import QuickActions from './QuickActions'
import OperationsStatus from './OperationsStatus'
import ResourceOverview from './ResourceOverview'
import RecentOperations from './RecentOperations'
import TopResources from './TopResources'
import ResourceAllocation from './ResourceAllocation'

export default function Dashboard() {
    const { user } = useAuth({
        middleware: 'auth',
        redirectIfAuthenticated: '/dashboard',
    })

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [stats, setStats] = useState({
        resources: {
            weapons: 0,
            vehicles: 0,
            personnel: 0,
            equipment: 0,
            total: 0,
        },
        operations: {
            ongoing: 0,
            upcoming: 0,
            completed: 0,
            total: 0,
        },
    })
    const [recentOperations, setRecentOperations] = useState([])
    const [topResources, setTopResources] = useState([])

    const fetchDashboardData = async () => {
        try {
            setLoading(true)

            // Get resource counts
            const resourcesResponse = await axios.get('/api/get-all-resources')
            const resourceData = resourcesResponse.data[1] || []

            // Get operations
            const operationsResponse = await axios.get('/api/get-all-operations')
            const operationsData = operationsResponse.data[1] || []

            // Calculate resource stats
            const totalWeaponCount = resourceData.reduce((total, resource) => {
                return total + (resource.weapon_count || 0)
            }, 0)

            const totalVehicleCount = resourceData.reduce((total, resource) => {
                return total + (resource.vehicle_count || 0)
            }, 0)

            const totalPersonnelCount = resourceData.reduce((total, resource) => {
                return total + (resource.personnel_count || 0)
            }, 0)

            const totalEquipmentCount = resourceData.reduce((total, resource) => {
                return total + (resource.equipment_count || 0)
            }, 0)

            // Calculate operation stats
            const ongoingOps = operationsData.filter(op => op.status === 'ongoing').length
            const upcomingOps = operationsData.filter(op => op.status === 'upcoming').length
            const completedOps = operationsData.filter(op => op.status === 'completed').length

            setStats({
                resources: {
                    weapons: totalWeaponCount,
                    vehicles: totalVehicleCount,
                    personnel: totalPersonnelCount,
                    equipment: totalEquipmentCount,
                    total: totalWeaponCount + totalVehicleCount + totalPersonnelCount + totalEquipmentCount,
                },
                operations: {
                    ongoing: ongoingOps,
                    upcoming: upcomingOps,
                    completed: completedOps,
                    total: operationsData.length,
                },
            })

            // Get recent operations (5 most recent)
            const sortedOperations = [...operationsData]
                .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
                .slice(0, 5)

            setRecentOperations(sortedOperations)

            // Get top resources (most available)
            const topResourcesList = [...resourceData]
                .sort((a, b) => {
                    const countA = a.weapon_count || a.vehicle_count || a.personnel_count || a.equipment_count || 0
                    const countB = b.weapon_count || b.vehicle_count || b.personnel_count || b.equipment_count || 0
                    return countB - countA
                })
                .slice(0, 5)

            setTopResources(topResourcesList)

            setError(null)
        } catch (err) {
            console.error('Error fetching dashboard data:', err)
            setError('Failed to load dashboard data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    if (loading) {
        return (
            <Layout>
                <Container fluid className="p-4">
                    <Loading text={'Loading Dashboard...'} />
                </Container>
            </Layout>
        )
    }

    if (error) {
        return (
            <Layout>
                <Container fluid className="p-4">
                    <div className="text-center text-danger">{error}</div>
                </Container>
            </Layout>
        )
    }

    return (
        <Layout>
            <Container fluid className="p-4">
                <DashboardHeader user={user} />
                <QuickActions />
                <ResourceOverview stats={stats.resources} />
                <OperationsStatus stats={stats.operations} />
                <div className="row g-4 mt-2">
                    <div className="col-12 col-lg-6">
                        <RecentOperations operations={recentOperations} />
                    </div>
                    <div className="col-12 col-lg-6">
                        <TopResources resources={topResources} />
                    </div>
                </div>
                <ResourceAllocation resourceStats={stats.resources} />
            </Container>
        </Layout>
    )
}