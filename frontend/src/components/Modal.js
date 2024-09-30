// src/components/Modal.js
import React from 'react';
import './Modal.css';

const Modal = ({ show, handleClose, children }) => {
    if (!show) return null;

    return (
        <div className="modal-backdrop" onClick={handleClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={handleClose}>x</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;