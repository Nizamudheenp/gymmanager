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
        <Container fluid>
            <Row>
                <Col md={4} className="border-end">
                    <h4 className="text-dark text-center">Messages</h4>
                    {loading && <p>Loading contacts...</p>}
                    <ListGroup>
                        {contacts.map((contact) => (
                            <ListGroup.Item
                            style={{padding:"10px",marginBottom:"8px"}}
                                key={contact._id}
                                action
                                onClick={() => handleSelectContact(contact)}
                                className={contact.unread ? "fw-bold bg-warning" : ""}
                            >
                                {contact.username} ({role === "trainer" ? "User" : "Trainer"})
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
                <Col md={8}>
                    {selectedContact ? (
                        <Card>
                            <Card.Header className="bg-dark text-light">
                                Chat with {selectedContact.username}
                            </Card.Header>
                            <Card.Body>
                                <div className="chat-messages" style={{ maxHeight: "400px", overflowY: "auto" }}>
                                    {loading ? (
                                        <p>Loading messages...</p>
                                    ) : (
                                        messages.map((msg, index) => (
                                            <p key={index} className={msg.senderId === userId ? "text-end text-primary" : "text-start text-secondary"}>
                                                {msg.message}
                                            </p>
                                        ))
                                    )}
                                </div>
                                <Form className="mt-3" onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                                    <Form.Control
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                    />
                                    <Button type="submit" variant="warning" className="mt-2 p-1 px-4">Send</Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    ) : (
                        <p>Select a contact to start chatting</p>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default Messages;
