"use client";

import React, { useState } from "react";
import { Button } from "@component/buttons";
import TextField from "@component/text-field";
import Spinner from "@component/Spinner";
import ErrorBoundary from "@component/ErrorBoundary";
import axios from "axios";
import Box from "@component/Box";
import Typography from "@component/Typography";
import { toast } from "react-hot-toast";
const TERMINAL_AFRICA_API_URL = "https://sandbox.terminal.africa/v1";
const API_KEY = "sk_test_nfkFJs8y9KARbAEfIzxZC4DBwpFE6Hcr";

export default function OrderTrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  //   const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setTrackingNumber(e.target.value);
  };

  const trackOrder = async () => {
    if (!trackingNumber) {
      //   setError("Please enter a tracking number");
      toast.error("Please enter a tracking number");
      return;
    }

    setLoading(true);
    // setError(null);

    try {
      const response = await axios.get(
        `${TERMINAL_AFRICA_API_URL}/shipments/track/${trackingNumber}`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      setTrackingInfo(response.data);
    } catch (err) {
      toast.error(
        "Failed to fetch tracking information. Please check your tracking number and try again."
      );
      console.error("Tracking error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <Box>
        <Typography as="h1">Track Your Order</Typography>
        <Box flex="flex" justifyContent="space-between" alignItems="center">
          <TextField
            fullwidth
            label="Enter Tracking Number"
            value={trackingNumber}
            onChange={handleInputChange}
            placeholder="e.g. TA123456789"
          />
          <Button
            fullwidth
            variant="contained"
            color="primary"
            onClick={trackOrder}
            disabled={loading}
            size="medium"
            // disabled={loading}
          >
            {loading ? "Tracking..." : "Track Order"}
          </Button>
        </Box>

        {loading && <Spinner />}

        {/* {error && <div className="error-message">{error}</div>} */}

        {trackingInfo && (
          <div className="tracking-info">
            <h2>Tracking Information</h2>
            <p>Status: {trackingInfo?.tracking_status || "Enroute"}</p>
            <p>
              Estimated Delivery Date: {trackingInfo.estimated_delivery_date}
            </p>
            <h3>Tracking History</h3>
            <ul>
              {/* {trackingInfo.tracking_history.map((event, index) => (
                <li key={index}>
                  <p>
                    {event.date}: {event.status}
                  </p>
                  <p>{event.location}</p>
                </li>
              ))} */}
              {JSON.stringify(trackingInfo)}
            </ul>
          </div>
        )}
      </Box>
    </ErrorBoundary>
  );
}
