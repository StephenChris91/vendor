// components/orders/CancelOrderModal.tsx

import React, { Fragment, useState } from "react";
import Modal from "@component/Modal";
import { Button } from "@component/buttons";
import { cancelOrder } from "actions/orders/canelOrder";
interface CancelOrderModalProps {
  orderId: string;
  open: boolean;
  onClose: () => void;
  onOrderCancelled: () => void;
}

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  orderId,
  open,
  onClose,
  onOrderCancelled,
}) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = async () => {
    setLoading(true);
    setError(null);
    try {
      await cancelOrder(orderId, reason);
      onOrderCancelled();
      onClose();
    } catch (err) {
      setError("Failed to cancel order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Fragment>
        <h2>Cancel Order</h2>
        <p>Are you sure you want to cancel this order?</p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Please provide a reason for cancellation"
          rows={4}
          className="cancel-reason-textarea"
        />
        {error && <p className="error-message">{error}</p>}
        <div className="modal-actions">
          <Button onClick={onClose} variant="outlined">
            No, keep order
          </Button>
          <Button
            onClick={handleCancel}
            variant="contained"
            color="error"
            disabled={loading}
          >
            {loading ? "Cancelling..." : "Yes, cancel order"}
          </Button>
        </div>
      </Fragment>
    </Modal>
  );
};

export default CancelOrderModal;
