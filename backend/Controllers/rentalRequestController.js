const { RentalRequest, Property, User } = require('../Models');

// POST /api/rentals/request
// {
//     "property_id": "UUID_OF_PROPERTY",
//     "message": "Optional message from the user"
//   }
const sendRentalRequest = async (req, res) => {
  try {
    const { property_id, message } = req.body;
    const user_id = req.user.id; // we are useing authenticateJWT and attaching req.user = decoded; // Attached decoded user info to the request like this,  `req.user` contains the authenticated user.

    // Check if property exists
    const property = await Property.findByPk(property_id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Check if user already sent a request
    const existingRequest = await RentalRequest.findOne({
      where: { owner_id: user_id, property_id, status: 'pending' },
    });
    if (existingRequest) {
      return res.status(400).json({ error: 'Request already sent for this property.' });
    }

    // Create the rental request
    const rentalRequest = await RentalRequest.create({
      owner_id: user_id,
      property_id,
      message,
    });

    return res.status(201).json({ message: 'Request sent successfully.', rentalRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

//
// PUT /api/rentals/request/:id
// {
//     "status": "accepted" // or "rejected"
//   }
const handleRentalRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user_id = req.user.id; // we are useing authenticateJWT and attaching req.user = decoded; // Attached decoded user info to the request like this,  `req.user` contains the authenticated user.

    // Validate status
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }

    // Find the rental request
    const rentalRequest = await RentalRequest.findByPk(id, {
      include: [{ model: Property, as: 'property' }],
    });

    if (!rentalRequest) {
      return res.status(404).json({ error: 'Rental request not found.' });
    }

    // Ensure the current user is the property owner // person who is acception the request should be the owner of the property 
    if (rentalRequest.owner_id !== user_id) { 
      return res.status(403).json({ error: 'You are not authorized to update this request.' });
    }

    // Update the status of the rental request
    rentalRequest.status = status;
    await rentalRequest.save();

    return res.status(200).json({ message: `Request ${status} successfully.`, rentalRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = {
    sendRentalRequest,
    handleRentalRequest,
  };