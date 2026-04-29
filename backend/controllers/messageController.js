const supabase = require("../config/supabaseClient");

exports.getMessagesByTradeRequest = async (req, res) => {
  try {
    const { tradeRequestId } = req.params;

    const { data: tradeRequest, error: requestError } = await supabase
      .from("trade_requests")
      .select("id, seller_id, buyer_id")
      .eq("id", tradeRequestId)
      .single();

    if (requestError || !tradeRequest) {
      return res.status(404).json({ error: "Trade request not found" });
    }

    if (![tradeRequest.seller_id, tradeRequest.buyer_id].includes(req.user.id)) {
      return res.status(403).json({ error: "Not authorized to view messages" });
    }

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("trade_request_id", tradeRequestId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { trade_request_id, body } = req.body;

    if (!trade_request_id || !body?.trim()) {
      return res.status(400).json({ error: "trade_request_id and body are required" });
    }

    const { data: tradeRequest, error: requestError } = await supabase
      .from("trade_requests")
      .select("id, seller_id, buyer_id")
      .eq("id", trade_request_id)
      .single();

    if (requestError || !tradeRequest) {
      return res.status(404).json({ error: "Trade request not found" });
    }

    if (![tradeRequest.seller_id, tradeRequest.buyer_id].includes(req.user.id)) {
      return res.status(403).json({ error: "Not authorized to send messages" });
    }

    const receiverId =
      tradeRequest.seller_id === req.user.id ? tradeRequest.buyer_id : tradeRequest.seller_id;

    const { data, error } = await supabase
      .from("messages")
      .insert({
        trade_request_id,
        sender_id: req.user.id,
        receiver_id: receiverId,
        body: body.trim(),
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: "Message sent", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
