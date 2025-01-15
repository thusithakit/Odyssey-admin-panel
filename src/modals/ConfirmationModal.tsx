import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

interface ConfirmationModalProps {
    modal: boolean;
    id: string;
    handleDelete: (id: string) => void;
    setModal: (modal: boolean) => void;
}

function ConfirmationModal({ modal, handleDelete, id, setModal }: ConfirmationModalProps) {
    return (
        <div>
            <Modal
                isOpen={modal !== false}
                onRequestClose={() => setModal(false)}
                className='modal'
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    },
                }}
            >
                <h2>Are you sure?</h2>
                <div className="buttons flex items-center justify-center gap-10">
                    <button className='btn-delete' onClick={() => handleDelete(id)}>Yes, Delete</button>
                    <button onClick={() => setModal(false)}>Cancel</button>
                </div>
            </Modal>
        </div>
    )
}

export default ConfirmationModal
