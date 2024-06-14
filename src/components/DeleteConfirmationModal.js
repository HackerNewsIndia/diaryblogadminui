import React from "react";

const DeleteConfirmationModal = ({ show, onHide, onConfirm }) => {
  return (
    <div className={`modal ${show ? "block" : "hidden"} fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75`}>
      <div className="modal-dialog mx-auto my-12 max-w-sm p-6 bg-white rounded shadow-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm Deletion</h5>
            <button type="button" className="close" onClick={onHide}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            Are you sure you want to delete this campaign?
          </div>
          <div className="modal-footer">
            <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded" onClick={onHide}>Cancel</button>
            <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded" onClick={onConfirm}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
