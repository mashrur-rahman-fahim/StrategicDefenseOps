import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { Icon } from '@iconify/react';

export default function OperationsTable({ operations, onEdit, onDelete, formatDate }) {
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
                            <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-2"
                                onClick={() => onEdit(operation)}>
                                <Icon icon="mdi:pencil" />
                            </Button>
                            <Button
                                variant="outline-danger"
                                size="sm"
                                className="me-2"
                                onClick={() => onDelete(operation)}>
                                <Icon icon="mdi:delete" />
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}