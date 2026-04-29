import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHeader, PageShell, SectionCard, StatusState } from "../components/PageLayout";
import { extractApiError, messageApi, tradeRequestApi } from "../lib/api";
import useAuth from "../hooks/useAuth";
import "./Messages.css";

function Messages() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [tradeRequests, setTradeRequests] = useState([]);
  const [activeRequestId, setActiveRequestId] = useState("");
  const [messages, setMessages] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState("");
  const [composerText, setComposerText] = useState("");

  const loadThreads = async () => {
    try {
      setLoadingRequests(true);
      setError("");
      const response = await tradeRequestApi.getAll();
      const data = Array.isArray(response?.data) ? response.data : [];
      setTradeRequests(data);
      const initialId = searchParams.get("tradeRequestId");
      if (!activeRequestId && data.length > 0 && !initialId) {
        setActiveRequestId(data[0].id);
      }
    } catch (apiError) {
      setError(extractApiError(apiError, "Unable to load conversations."));
      setTradeRequests([]);
    } finally {
      setLoadingRequests(false);
    }
  };

  const loadMessages = async (requestId) => {
    if (!requestId) {
      setMessages([]);
      return;
    }

    try {
      setLoadingMessages(true);
      const response = await messageApi.getByTradeRequest(requestId);
      setMessages(Array.isArray(response?.data) ? response.data : []);
    } catch (apiError) {
      setError(extractApiError(apiError, "Unable to load messages."));
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    loadThreads();
  }, []);

  useEffect(() => {
    const initialId = searchParams.get("tradeRequestId");
    if (initialId) {
      setActiveRequestId(initialId);
    }
  }, [searchParams]);

  useEffect(() => {
    loadMessages(activeRequestId);
  }, [activeRequestId]);

  const activeRequest = useMemo(
    () => tradeRequests.find((request) => request.id === activeRequestId),
    [activeRequestId, tradeRequests],
  );

  const handleSend = async (event) => {
    event.preventDefault();
    if (!activeRequestId || !composerText.trim()) {
      return;
    }

    try {
      const response = await messageApi.send({
        trade_request_id: activeRequestId,
        body: composerText.trim(),
      });
      const newMessage = response?.data;
      if (newMessage) {
        setMessages((prev) => [...prev, newMessage]);
      }
      setComposerText("");
    } catch (apiError) {
      setError(extractApiError(apiError, "Unable to send message."));
    }
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="Inbox"
        title="Messages"
        description="Chat with buyers and sellers to coordinate trades and exchanges."
      />

      <SectionCard
        id="messages-state"
        title="Conversations"
        description="All your buyer and seller conversations in one place."
      >
        {loadingRequests ? (
          <StatusState
            tone="info"
            title="Loading conversations"
            message="Fetching your trade threads..."
          />
        ) : null}

        {!loadingRequests && error ? (
          <StatusState tone="error" title="Could not load messages" message={error} />
        ) : null}

        {!loadingRequests && !error && tradeRequests.length === 0 ? (
          <StatusState
            tone="neutral"
            title="No conversations yet"
            message="When you message a buyer or seller, it will appear here."
          />
        ) : null}

        {!loadingRequests && !error && tradeRequests.length > 0 ? (
          <div className="messages-layout">
            <aside className="conversation-list" aria-label="Trade threads">
              {tradeRequests.map((request) => {
                const isActive = request.id === activeRequestId;
                const bookTitle = request.listings?.books?.title || "Untitled Book";
                const isSeller = request.seller_id === user?.id;
                const counterpart = isSeller ? "Buyer" : "Seller";
                return (
                  <button
                    key={request.id}
                    type="button"
                    className={isActive ? "conversation-card active" : "conversation-card"}
                    onClick={() => setActiveRequestId(request.id)}
                  >
                    <div>
                      <h3>{bookTitle}</h3>
                      <p className="conversation-subject">{counterpart} thread</p>
                      <p className="conversation-preview">
                        {request.message || "Open the thread to view messages."}
                      </p>
                    </div>
                  </button>
                );
              })}
            </aside>

            <section className="message-thread" aria-label="Message thread">
              <header>
                <div>
                  <h3>{activeRequest?.listings?.books?.title || "Conversation"}</h3>
                  <p>{activeRequest?.listings?.books?.author || ""}</p>
                </div>
              </header>
              <div className="thread-body">
                {loadingMessages ? (
                  <StatusState
                    tone="info"
                    title="Loading messages"
                    message="Fetching conversation history..."
                  />
                ) : null}
                {!loadingMessages && messages.length === 0 ? (
                  <StatusState
                    tone="neutral"
                    title="No messages yet"
                    message="Start the conversation with a message."
                  />
                ) : null}
                {!loadingMessages && messages.length > 0
                  ? messages.map((message) => (
                      <div
                        key={message.id}
                        className={
                          message.sender_id === user?.id ? "message-bubble me" : "message-bubble"
                        }
                      >
                        <p className="message-meta">
                          {new Date(message.created_at).toLocaleString()}
                        </p>
                        <p className="message-text">{message.body}</p>
                      </div>
                    ))
                  : null}
              </div>
              <form className="message-composer" onSubmit={handleSend}>
                <input
                  type="text"
                  value={composerText}
                  onChange={(event) => setComposerText(event.target.value)}
                  placeholder="Write a message"
                  aria-label="Message"
                />
                <button className="btn btn-primary" type="submit" disabled={!composerText.trim()}>
                  Send
                </button>
              </form>
            </section>
          </div>
        ) : null}
      </SectionCard>
    </PageShell>
  );
}

export default Messages;
