import React, { useState } from "react";
import Appointments from "./Appointments";
import ManageClients from "./ManageClients";


function ClientSession() {
  const [selectedWidget, setSelectedWidget] = useState(null);

  return (
    <div className="container mt-4 training-section">
      <h2 className="text-center">Client Session</h2>

      {!selectedWidget && (
        <div className="row mt-4">
          <div className="col-md-6">
            <div className="card p-3 shadow-sm training-card" onClick={() => setSelectedWidget("appointments")}>
              <h4>Appointments</h4>
              <p>Look up the appointments and approve them</p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card p-3 shadow-sm training-card" onClick={() => setSelectedWidget("clients")}>
              <h4> My Clients</h4>
              <p>View and manage your own clients</p>
            </div>
          </div>
        </div>
      )}

      {selectedWidget === "appointments" && <Appointments />}
      {selectedWidget === "clients" && <ManageClients />}
      
    </div>
  );
}

export default ClientSession;
