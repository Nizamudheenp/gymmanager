import React, { useState, useEffect } from "react";
import { ListGroup, Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import io from "socket.io-client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
    transports: ["websocket", "polling"]
})


function Messages() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const userId = token ? jwtDecode(token)?.id : null;

    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userId) {
            socket.emit("join", { userId });

            return () => {
                socket.off("join");
            };
        }
    }, [userId]);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/messages/contacts`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setContacts(res.data.contacts);
        } catch (error) {
            console.error("Error fetching contacts", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (receiverId) => {
        try {
            setLoading(true);
            setMessages([]);
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/messages/${receiverId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(res.data.messages);
        } catch (error) {
            console.error("Error fetching messages", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectContact = (contact) => {
        setSelectedContact(contact);
        fetchMessages(contact._id);
    };

    const handleSendMessage = async () => {
        if (!selectedContact || !newMessage.trim()) {
            console.error("Receiver ID or message is missing.");
            return;
        }

        const receiverType = role === "trainer" ? "User" : "Trainer";
        const senderType = role.charAt(0).toUpperCase() + role.slice(1);

        const messageData = {
            senderId: userId,
            senderType,
            receiverId: selectedContact._id,
            receiverType,
            message: newMessage,
        };

        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/messages/send`, messageData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages((prev) => [...prev, res.data.data]);
            socket.emit("send_message", messageData);
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message", error);
        }
    };

    useEffect(() => {
        const handleReceiveMessage = (data) => {
            if (selectedContact && data.senderId === selectedContact._id) {
                setMessages((prev) => [...prev, data]);
            }
        };

        socket.on("receive_message", handleReceiveMessage);

        return () => {
            socket.off("receive_message", handleReceiveMessage);
        };
    }, [selectedContact]);

    return (
        <Container fluid >
            <Row>
                <Col md={4} className="border-end bg-light p-3 rounded-3 shadow-sm">
                    <h5 className="text-center mb-3 fw-bold">Messages</h5>
                    {loading && <p className="text-muted">Loading contacts...</p>}
                    <ListGroup variant="flush">
                        {contacts.map((contact) => (
                            <ListGroup.Item
                                key={contact._id}
                                action
                                onClick={() => handleSelectContact(contact)}
                                className={`mb-2 rounded ${contact.unread ? "fw-bold bg-warning-subtle" : "bg-white"}`}
                                style={{ cursor: "pointer", padding: "12px 16px", boxShadow: "0 0 6px rgba(0,0,0,0.05)" }}
                            >
                                {contact.username} ({role === "trainer" ? "User" : "Trainer"})
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>

                <Col md={8} className="p-1">
                    {selectedContact ? (
                        <Card className="shadow-sm border-0 rounded-4">
                            <Card.Header className="bg-dark text-white rounded-top-4">
                                <strong>Chat with {selectedContact.username}</strong>
                            </Card.Header>
                            <Card.Body>
                                <div className="chat-messages mb-3 d-flex flex-column gap-2" style={{ maxHeight: "400px", overflowY: "auto" }}>
                                    {loading ? (
                                        <p className="text-muted">Loading messages...</p>
                                    ) : (
                                        messages.map((msg, index) => {
                                            const isSender = msg.senderId === userId;
                                            return (
                                                <div
                                                    key={index}
                                                    className={`p-2 px-3 rounded-3 ${isSender ? "align-self-end bg-primary text-white" : "align-self-start bg-secondary text-white"}`}
                                                    style={{
                                                        maxWidth: "75%",
                                                        boxShadow: "0 0 6px rgba(0,0,0,0.1)",
                                                        wordBreak: "break-word",
                                                    }}
                                                >
                                                    {msg.message}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                                <Form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                                    <Form.Control
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        className="mb-2"
                                    />
                                    <div className="text-end">
                                        <Button type="submit" variant="warning" className="px-4">Send</Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    ) : (
                        <Card className="text-center shadow-sm p-5">
                            <p className="text-muted">Select a contact to start chatting</p>
                        </Card>
                    )}
                </Col>

            </Row>
        </Container>
    );
}

export default Messages;
