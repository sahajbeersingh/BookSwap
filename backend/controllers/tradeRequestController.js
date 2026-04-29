const supabase = require("../config/supabaseClient");

exports.createTradeRequest = async (req, res) => {
  try {
    const { listing_id, message, contact_preference } = req.body;

    if (!listing_id) {
      return res.status(400).json({ error: "listing_id is required" });
    }

    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("id, seller_id")
      .eq("id", listing_id)
      .single();

    if (listingError || !listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    if (listing.seller_id === req.user.id) {
      return res.status(400).json({ error: "Cannot request trade on your own listing" });
    }

    const payload = {
      listing_id,
      seller_id: listing.seller_id,
      buyer_id: req.user.id,
      message: message || null,
      contact_preference: contact_preference || null,
    };

    const { data, error } = await supabase
      .from("trade_requests")
      .insert(payload)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({ message: "Trade request created", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getOutgoingRequests = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("trade_requests")
      .select("*, listings (*, books (*))")
      .eq("buyer_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyRequests = async (req, res) => {

    if (error) throw error;

    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
