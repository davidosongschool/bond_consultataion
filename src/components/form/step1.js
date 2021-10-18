import { Form } from "react-bootstrap";
import { useEffect } from "react";

const Step1 = (props) => {
  const validate = () => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const email_check = re.test(String(props.formContent.email).toLowerCase());
    console.log(email_check);
    if (props.formContent.name.length > 0 && email_check === true) {
      console.log("Good");
      props.setPreventNext(false);
    } else {
      props.setPreventNext(true);
    }
  };

  // Run validate when component mounts
  useEffect(() => {
    validate();
  });

  return (
    <div>
      <h2 className="section-title">Customer Details</h2>
      <p>Enter the customers name and email address</p>
      <hr />
      <Form>
        <Form.Group className="mb-3 mt-4">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="name"
            value={props.formContent.name || ""}
            onChange={(e) => {
              props.setFormContent({
                ...props.formContent,
                name: e.target.value,
              });
              validate();
            }}
            placeholder="Enter customer name"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            value={props.formContent.email || ""}
            onChange={(e) => {
              props.setFormContent({
                ...props.formContent,
                email: e.target.value,
              });
              validate();
            }}
            placeholder="Enter customer email"
          />
        </Form.Group>
      </Form>
    </div>
  );
};

export default Step1;
