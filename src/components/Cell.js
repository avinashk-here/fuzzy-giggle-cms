import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import models from "../data/models.json";
import prompts from "../data/prompts.json";

export default function Cell({ isNew, isAlternate }) {
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [model, setModel] = useState(models[0]);
  const [prompt, setPrompt] = useState(prompts[0]);

  const runAI = () => {
    setOutput(`Model: ${model}\nPrompt: ${prompt}\nContext: ${context}`);
  };

  return (
    <div
      className="p-3 mb-3 border rounded"
      style={{
        borderColor: isNew ? "#ee4c0cff" : "#070606ff",
        borderWidth: isNew ? 3 : 1,
        backgroundColor: isNew
          ? "#fff9db"
          : isAlternate
          ? "#f36506ff"  // light gray for alternate cells
          : "white",
        transition: "background-color 0.5s ease",
      }}
    >
      <Form.Group className="mb-2">
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Paste context here..."
          value={context}
          onChange={(e) => setContext(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Output will appear here..."
          value={output}
          readOnly
        />
      </Form.Group>

      <Row className="align-items-center">
        <Col>
          <Form.Select value={model} onChange={(e) => setModel(e.target.value)}>
            {models.map((m, idx) => (
              <option key={idx} value={m}>
                {m}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col>
          <Form.Select value={prompt} onChange={(e) => setPrompt(e.target.value)}>
            {prompts.map((p, idx) => (
              <option key={idx} value={p}>
                {p}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col xs="auto">
          <Button variant="danger" onClick={runAI}>
            Run
          </Button>
        </Col>
      </Row>
    </div>
  );
}
