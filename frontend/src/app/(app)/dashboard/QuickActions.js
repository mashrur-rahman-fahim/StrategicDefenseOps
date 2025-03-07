import React from 'react'
import { Card, Row, Col } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import Link from 'next/link'

const QuickActions = ({ user }) => {
    const actions = [
        {
            title: 'Chatbot',
            icon: 'hugeicons:bot',
            link: '/chatbot',
            colorClass: 'bg-primary'
        },
        {
            title: 'Operation Resources',
            icon: 'mdi:cube-outline',
            link: '/operation-resources',
            colorClass: 'bg-success'
        }
    ]

    if (user?.role_id < 3) {
        actions.push(
            {
                title: 'Assign Roles',
                icon: 'mdi:arrow-right-bold-box',
                link: '/assign',
                colorClass: 'bg-info'
            },
            {
                title: 'Unassign Roles',
                icon: 'mdi:arrow-left-bold-box',
                link: '/un-assign',
                colorClass: 'bg-warning'
            },
            {
                title: 'View Roles',
                icon: 'mdi:account-group',
                link: '/view-roles',
                colorClass: 'bg-secondary'
            }
        )
    }

    return (
        <>
            <h4 className="mt-4 mb-3">Quick Actions</h4>
            <Row className="g-3 mb-4">
                {actions.map((action, index) => (
                    <Col key={index} xs={6} sm={4} md={3} xl={2}>
                        <Card className="shadow-sm h-100 border-0 text-center">
                            <Card.Body className="p-3">
                                <Link
                                    href={action.link}
                                    className="text-decoration-none"
                                >
                                    <div
                                        className={`${action.colorClass} bg-opacity-10 p-3 rounded-circle d-inline-block mb-3`}
                                    >
                                        <Icon
                                            icon={action.icon}
                                            width="28"
                                            height="28"
                                            className={`text-${action.colorClass.replace('bg-', '')}`}
                                        />
                                    </div>
                                    <h6 className="mb-0 text-body">
                                        {action.title}
                                    </h6>
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    )
}

export default QuickActions
