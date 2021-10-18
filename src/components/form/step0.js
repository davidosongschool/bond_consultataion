import { Form, Alert, Button } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";

const Step0 = (props) => {
  // Key Errors
  const [keyError, setKeyError] = useState(null);

  const validateKey = () => {
    console.log("KEY: " + props.storeKey);
    if (props.storeKey.length !== 43) {
      setKeyError("Please check your API key length");
      props.setPreventNext(true);
    } else {
      // If they key is the correct length, check the key by making a call to the server
      setKeyError("Checking key ...");
      axios
        .get(
          `https://bondhairhealth.ie/wp-json/wc/v3/products?search=test&consumer_key=ck_54a3e1aeda8c469900896bc89908867caf60e4ba&consumer_secret=${props.storeKey}`
        )
        .then((res) => {
          setKeyError(1);
          props.setPreventNext(false);
        })
        .catch((e) => {
          setKeyError("There was an error - Please check your key!");
          props.setPreventNext(true);
        });
    }
  };

  return (
    <div>
      <h2>Enter Your Secret Key</h2>
      <Form>
        <Form.Group className="mb-3 mt-4">
          <Form.Control
            type="text"
            value={props.storeKey || ""}
            onChange={(e) => {
              props.setStoreKey(e.target.value);
            }}
            placeholder="Paste your secret key here"
          />
          <Button variant="success mt-3" onClick={() => validateKey()}>
            Validate Key
          </Button>
        </Form.Group>
      </Form>
      {keyError === 1 ? (
        <Alert variant="success">Key is good!</Alert>
      ) : keyError !== null ? (
        <Alert variant="danger">{keyError}</Alert>
      ) : null}
    </div>
  );
};

export default Step0;
