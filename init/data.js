const initResources = () => {
  const resources = [];

  const hospitals = [
    { name: "City Hospital", location: "Mumbai", bedsAvailable: 20, oxygenUnits: 10, bloodUnits: 5, medicines: 50 },
    { name: "Green Care", location: "Delhi", bedsAvailable: 15, oxygenUnits: 5, bloodUnits: 3, medicines: 30 },
    { name: "Sunrise Medical", location: "Bangalore", bedsAvailable: 25, oxygenUnits: 12, bloodUnits: 8, medicines: 60 }
  ];

  hospitals.forEach(h => {
    resources.push({
      hospitalName: h.name,
      location: h.location,
      resourceType: "Bed",
      quantityAvailable: h.bedsAvailable,
      status: h.bedsAvailable > 10 ? "Available" : "Low"
    });
    resources.push({
      hospitalName: h.name,
      location: h.location,
      resourceType: "Oxygen",
      quantityAvailable: h.oxygenUnits,
      status: h.oxygenUnits > 5 ? "Available" : "Low"
    });
    resources.push({
      hospitalName: h.name,
      location: h.location,
      resourceType: "BloodUnit",
      quantityAvailable: h.bloodUnits,
      status: h.bloodUnits > 5 ? "Available" : "Low"
    });
    resources.push({
      hospitalName: h.name,
      location: h.location,
      resourceType: "Medicine",
      quantityAvailable: h.medicines,
      status: h.medicines > 30 ? "Available" : "Low"
    });
  });

  return resources;
};


const resources = initResources();
module.exports = { data: resources };

