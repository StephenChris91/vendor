// components/orders/OrderTrackingTimeline.tsx

import { order } from "@prisma/client";
import React from "react";

interface OrderTrackingTimelineProps {
  order: order;
}

const OrderTrackingTimeline: React.FC<OrderTrackingTimelineProps> = ({
  order,
}) => {
  const stages = [
    { name: "Order Placed", date: order.createdAt },
    { name: "Processing", date: order.updatedAt },
    { name: "Shipped", date: order.updatedAt },
    { name: "Out for Delivery", date: order.updatedAt },
    { name: "Delivered", date: order.updatedAt },
  ];

  return (
    <div className="order-tracking-timeline">
      {stages.map((stage, index) => (
        <div
          key={stage.name}
          className={`timeline-item ${stage.date ? "completed" : ""}`}
        >
          <div className="timeline-marker"></div>
          <div className="timeline-content">
            <h3>{stage.name}</h3>
            {stage.date && <p>{new Date(stage.date).toLocaleString()}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderTrackingTimeline;
