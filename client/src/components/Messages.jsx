import React, { useState, useEffect, useRef } from "react";
import { ListGroup, Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import io from "socket.io-client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { FaPaperPlane, FaArrowLeft } from "react-icons/fa";
import "./Messages.css";
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
    const messagesEndRef = useRef(null);
    const isInitialLoad = useRef(true);

    const scrollToBottom = (behavior = "smooth") => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };

    useEffect(() => {
        if (isInitialLoad.current) {
            scrollToBottom("auto");
            if (messages.length > 0) isInitialLoad.current = false;
        } else {
            scrollToBottom("smooth");
        }
    }, [messages]);

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
            isInitialLoad.current = true; // Set to true when loading new chat 
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
        <Container fluid className="messaging-container">
            <Row className="messaging-row">
                <Col md={4} className={`contact-list-card ${selectedContact ? "hide-on-mobile" : ""}`}>
                    <h5 className="text-center m-3 fw-bold text-uppercase gy-fit-title">gy-fit connections</h5>
                    {loading && <p className="text-muted text-center">Loading contacts...</p>}
                    <ListGroup variant="flush" className="contact-list-container">
                        {contacts.map((contact) => (
                            <ListGroup.Item
                                key={contact._id}
                                action
                                onClick={() => handleSelectContact(contact)}
                                className={`contact-item ${contact.unread ? "unread-contact" : ""} ${selectedContact && selectedContact._id === contact._id ? "active-contact" : ""}`}
                            >
                                {contact.username}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>

                <Col md={8} className={`chat-window-card ${!selectedContact ? "hide-on-mobile" : ""}`}>
                    {selectedContact ? (
                        <>
                            <div className="chat-header">
                                <button className="mobile-back-btn" onClick={() => setSelectedContact(null)}>
                                    <FaArrowLeft />
                                </button>
                                Chat with {selectedContact.username}
                            </div>
                            <div className="chat-body-container">
                                <div className="chat-messages">
                                    {loading ? (
                                        <p className="text-muted text-center mt-3">Loading messages...</p>
                                    ) : (
                                        messages.map((msg, index) => {
                                            const isSender = msg.senderId === userId;
                                            return (
                                                <div
                                                    key={index}
                                                    className={`message-bubble ${isSender ? "message-sender" : "message-receiver"}`}
                                                >
                                                    {msg.message}
                                                </div>
                                            );
                                        })
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                                <div className="chat-input-area">
                                    <Form className="d-flex align-items-center gap-3" onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                                        <Form.Control
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type your message..."
                                            className="chat-input m-0"
                                        />
                                        <Button type="submit" className="chat-send-btn p-0">
                                            <FaPaperPlane size={16} />
                                        </Button>
                                    </Form>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="chat-empty-state">
                            <FaPaperPlane size={40} style={{ opacity: 0.2, marginBottom: "15px" }} />
                            <p>Select a contact to start chatting</p>
                        </div>
                    )}
                </Col>

            </Row>
        </Container >
    );
}

export default Messages;
