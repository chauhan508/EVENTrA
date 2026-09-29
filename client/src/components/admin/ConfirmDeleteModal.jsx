import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import Modal from '../common/Modal';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, itemName, isDeleting }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion" maxWidth="max-w-md">
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-950/30 border border-red-900/50">
          <AlertTriangle className="w-5 h-5 text-[#FF4D2E] shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-white">This action cannot be undone.</p>
            <p className="text-zinc-400 text-xs mt-1">
              Are you sure you want to permanently delete{' '}
              <span className="text-white font-mono font-medium">"{itemName}"</span>? All associated
              student registrations will also be removed.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-medium text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-[#FF4D2E] hover:bg-[#E63D1E] text-white transition-colors disabled:opacity-50"
          >
            {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Delete Event</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
