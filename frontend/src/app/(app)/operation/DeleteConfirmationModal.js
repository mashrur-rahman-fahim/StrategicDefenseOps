import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import Loading from '@/components/Loading';

export default function DeleteConfirmationModal({
    show,
    onHide,
    operationName,
    onDelete,
    loading,
}) {
    return (
        <Modal show={show} onHide={onHide} size="sm">
            <Modal.Header closeButton>
                <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete the operation "{operationName}"?
                This action cannot be undone.
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={onDelete} disabled={loading}>
                    {loading ? <Loading text="Deleting..." /> : 'Delete'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
