"use client";

import React, { useState } from "react";
import { Button } from "@component/buttons";
import TextField from "@component/text-field";
import Spinner from "@component/Spinner";
import ErrorBoundary from "@component/ErrorBoundary";
import axios from "axios";

const TERMINAL_AFRICA_API_URL = "https://api.terminal.africa";
const API_KEY = process.env.NEXT_PUBLIC_TERMINAL_AFRICA_API_KEY;

export default function OrderTrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setTrackingNumber(e.target.value);
  };

  const trackOrder = async () => {
    if (!trackingNumber) {
      setError("Please enter a tracking number");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${TERMINAL_AFRICA_API_URL}/shipments/${trackingNumber}/track`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      setTrackingInfo(response.data);
    } catch (err) {
      setError(
        "Failed to fetch tracking information. Please check your tracking number and try again."
      );
      console.error("Tracking error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="order-tracking-page">
        <h1>Track Your Order</h1>
        <div className="tracking-input">
          <TextField
            fullwidth
            label="Enter Tracking Number"
            value={trackingNumber}
            onChange={handleInputChange}
            placeholder="e.g. TA123456789"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={trackOrder}
            disabled={loading}
          >
            {loading ? "Tracking..." : "Track Order"}
          </Button>
        </div>

        {loading && <Spinner />}

        {error && <div className="error-message">{error}</div>}

        {trackingInfo && (
          <div className="tracking-info">
            <h2>Tracking Information</h2>
            <p>Status: {trackingInfo.status}</p>
            <p>
              Estimated Delivery Date: {trackingInfo.estimated_delivery_date}
            </p>
            <h3>Tracking History</h3>
            <ul>
              {trackingInfo.tracking_history.map((event, index) => (
                <li key={index}>
                  <p>
                    {event.date}: {event.status}
                  </p>
                  <p>{event.location}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
