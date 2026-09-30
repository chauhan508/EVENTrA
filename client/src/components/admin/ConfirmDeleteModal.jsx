import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import Modal from '../common/Modal';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, itemName, isDeleting }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion" maxWidth="max-w-md">
      <div className="space-y-4 text-left">
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-950/20 border border-red-500/20">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-[#F5F7F4]">This action cannot be undone.</p>
            <p className="text-[#8F9B94] text-xs mt-1 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <span className="text-[#F5F7F4] font-medium">"{itemName}"</span>? All associated
              student registrations will also be removed.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-medium text-[#8F9B94] hover:text-[#F5F7F4] rounded-lg hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors disabled:opacity-50"
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
