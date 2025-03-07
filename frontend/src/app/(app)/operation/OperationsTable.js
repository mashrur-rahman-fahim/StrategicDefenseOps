import React from 'react'
import { Table, Button } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import Link from 'next/link'

export default function OperationsTable({
    operations,
    onEdit,
    onDelete,
    formatDate,
    user,
}) {
    return (
        <Table responsive striped hover className="bg-light">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {operations.map(operation => (
                    <tr key={operation.id}>
                        <td>{operation.name}</td>
                        <td>
                            <span
                                className={`text-${operation.status === 'ongoing' ? 'success' : operation.status === 'upcoming' ? 'warning' : 'primary'}`}>
                                {operation.status}
                            </span>
                        </td>
                        <td>{formatDate(operation.start_date)}</td>
                        <td>{formatDate(operation.end_date)}</td>
                        <td>
                            <Link
                                href={`/operation/${encodeURIComponent(operation.name)}`}
                                passHref>
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="me-2">
                                    <Icon icon="material-symbols:info-outline" width="20" height="20" />
                                </Button>
                            </Link>
                            {user.role_id != 4 && (
                                <Button
                                    variant="outline-success"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => onEdit(operation)}>
                                    <Icon icon="mdi:pencil" />
                                </Button>
                            )}
                            {user.role_id == 1 && (
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => onDelete(operation)}>
                                    <Icon icon="mdi:delete" />
                                </Button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
}
