import React, { useState } from "react";
import { Button, Form, Modal, Container } from "react-bootstrap";
import axios from "axios";

export const Note = () => {
  const [note, setNote] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(true);
  const [existingNote, setExistingNote] = useState(false);


  const mongoose = require('mongoose');


const noteSchema = new mongoose.Schema({
  title: String,
  text: String,
  passwordHash: String,
});


const Note = mongoose.model('Note', noteSchema);


  const createNote = async (event) => {
    event.preventDefault();
    try {
      await axios.post("/note", { title: window.location.pathname.substring(1), text: note, password });
      setShowModal(false);
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const getNote = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`/note/${window.location.pathname.substring(1)}`, { password });
      setNote(response.data.text);
      setShowModal(false);
      setExistingNote(true);
    } catch (error) {
      console.error("Error retrieving note:", error);
    }
  };

  const checkNoteStatus = async () => {
    try {
      const response = await axios.get(`/note-status/${window.location.pathname.substring(1)}`);
      if (response.data.exists) {
        setShowModal(true);
        setExistingNote(true);
      } else {
        setShowModal(true);
        setExistingNote(false);
      }
    } catch (error) {
      console.error("Error checking note status:", error);
    }
  };

  return (
    <Container>
      <header className="my-4 d-flex justify-content-between">
        <h1 className="fs-4">🔐 Protected Text</h1>
      </header>
      <main>
        <>
          <Modal show={showModal} size="sm">
            <form onSubmit={existingNote ? getNote : createNote}>
              <Modal.Header>
                <Modal.Title>
                  {existingNote ? `This site (${window.location.pathname}) is already occupied` : `Create new site? (${window.location.pathname})`}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {existingNote ? (
                  <>
                    <p>Password required</p>
                    <Form.Label htmlFor="password">Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      name="password"
                      id="password"
                    />
                  </>
                ) : (
                  <p>Great! This site doesn&apos;t exist, it can be yours!</p>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={existingNote ? getNote : createNote}
                >
                  {existingNote ? "Check" : "Create"}
                </Button>
              </Modal.Footer>
            </form>
          </Modal>
          <Form onSubmit={createNote}>
            <Form.Control
              value={note}
              onChange={(e) => setNote(e.target.value)}
              name="note"
              as="textarea"
              id="note"
              cols="30"
              rows="10"
              placeholder="Your text goes here..."
              disabled={existingNote}
            />
            <Button className="mt-2 d-block ms-auto" type="submit" disabled={existingNote}>
              Save
            </Button>
          </Form>
        </>
      </main>
    </Container>
  );
};
