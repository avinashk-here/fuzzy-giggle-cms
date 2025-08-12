// colabcms/src/components/Cell.js
import React, { useState, useRef } from "react";
import { Form, Button, Row, Col, Spinner } from "react-bootstrap";
import models from "../data/models.json";
import prompts from "../data/prompts.json";

export default function Cell({ isNew, isAlternate }) {
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [model, setModel] = useState(models[0]);
  const [prompt, setPrompt] = useState(prompts[0]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const outputRef = useRef(null);

  const runAI = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, prompt, context }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setOutput(data.output);
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

    const copyOutput = () => {
        if (outputRef.current) {
        navigator.clipboard.writeText(outputRef.current.value).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 8000);
        });
        }
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
          ? "#f36506ff"
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

      {/* Output with Copy button */}
      <Form.Group className="mb-3 position-relative">
        <Button
          size="sm"
          variant="outline-secondary"
          onClick={copyOutput}
          className="position-absolute"
          style={{ top: 4, right: 4, zIndex: 2 }}
        >
          {copied ? "Copied" : "Copy"}
        </Button>

        <Form.Control
          ref={outputRef}
          as="textarea"
          rows={3}
          placeholder={loading ? "⏳ Generating…" : "Output will appear here…"}
          value={loading ? "" : output}
          readOnly
          disabled={loading}
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
          <Button variant="danger" onClick={runAI} disabled={loading}>
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-1"
                />
                Loading…
              </>
            ) : (
              "Run"
            )}
          </Button>
        </Col>
      </Row>
    </div>
  );
}