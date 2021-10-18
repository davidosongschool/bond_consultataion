import styled from "styled-components";
import React from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import axios from "axios";

const Step4 = (props) => {
  let productsHTML = "";
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [apiError, setApiError] = useState(null);

  const [selectedEdit, setSelectedEdit] = useState({});
  const handleShow = (product_id, product_descirption) => {
    setShow(true);
    product_descirption = product_descirption.replace(/<[^>]+>/g, "");
    setSelectedEdit({
      product_id: product_id,
      product_descirption: product_descirption,
    });
  };

  const setEmailHTML = () => {
    productsHTML +=
      '<div style="text-align: center"><img src="https://digitalsalon.ie/wp-content/uploads/2021/09/your-logo.png" style="width: 150px; height 150px;  margin: 0 auto !important; float: center; text-align: center; margin-top: 20px; margin-bottom: 20px;"></div>';
    productsHTML += `<div style="text-align: center"><br/> <br/>Hi <strong>${props.formContent.name}</strong>, <br/><br/></div>`;
    productsHTML += `<div style="text-align: center">${props.formContent.intro}</div>`;
    productsHTML += `<div style="background-color: #D1E7DD; padding: 10px; margin-top: 20px; border-radius: 10px; text-align: center;"><br/><h2 style="padding-top: 0px; margin-top: 0px;">Coupon</h2><p>Use code <strong>${props.formContent.coupon}</strong> for <strong>${props.formContent.coupon_value}</strong>% off your next purchase!</p></div>`;
    props.sections.map((section) =>
      section
        ? (productsHTML +=
            `<br /><div>
        <div style="width: 100%; padding: 6px; background-color: #40376E; color: #fff; text-align: center; border-radius: 10px;"><h1><strong>` +
            section.name +
            `</strong></h1></div>` +
            section.products.map(
              (
                product
              ) => `<div style="text-align: center"><div style="margin-top: 30px; margin-bottom: 10px;"> <h2> ${product.product_name} </h2> </div>
              <div><img style="width: 300px; height: 300px; border-radius: 3px;" src="${product.product_image}"> </div>
              <div><p style="padding: 10px; white-space: pre-wrap">${product.product_description}<p></div>
              <a style="text-decoration: none !important;" href="${product.product_link}"><div style="background-color:#6CC840; padding: 10px; border-radius: 20px; font-size: 16px; margin-top: 30px; margin-bottom: 30px; width: 200px; text-align: center; color: #fff !important; margin: 0 auto !important;">Buy Now</div></a></div>
              `
            ) +
            `</div>`)
        : ``
    );
    productsHTML += `<div style="margin-top: 50px; background-color: #40376E; text-align: center; color: #fff; padding: 8px; width: 100%;"><h3>Thanks ${props.formContent.name} for choosing us</h3></div>`;
  };

  //delete coupon
  const deleteCoupon = (id) => {
    let config = {
      auth: {
        username: "ck_6138cb16f2484fd1f5acb447f6eaa82f2b2900c8",
        password: props.storeKey,
      },
    };
    axios
      .delete(
        `https://truahair.ie/wp-json/wc/v3/coupons/${id}?force=true`,
        config
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const submitConsultation = () => {
    let couponid = null;
    setEmailHTML();
    if (props.storeKey.length < 43) {
      setApiError("Please check your API key length");
    } else {
      props.setisLoading(true);
      let config = {
        auth: {
          username: "ck_6138cb16f2484fd1f5acb447f6eaa82f2b2900c8",
          password: props.storeKey,
        },
      };

      axios
        .post(
          "https://truahair.ie/wp-json/wc/v3/coupons",
          {
            code: props.formContent.coupon,
            discount_type: "percent",
            amount: props.formContent.coupon_value,
            individual_use: true,
            exclude_sale_items: false,
            minimum_amount: "0",
            usage_limit_per_user: "1",
            usage_limit: "1",
          },
          config
        )
        .then((res) => {
          console.log(res.data);
          // Store id of coupon created incase of email failure
          couponid = res.data.id;
          axios
            .post("https://truahair.ie/wp-json/wc/v3/custom/", {
              password: props.storeKey,
              content: productsHTML,
              email: props.formContent.email,
              name: props.formContent.name,
            })
            .then((res) => {
              props.setisLoading(false);
              console.log(res.data);
              if (!res.data) {
                setApiError(
                  "There was an error sending the email! Please check you have entered the email address correctly!"
                );
                deleteCoupon(couponid);
              } else if (res.data) {
                props.setSuccessMessage(true);
                setApiError(null);
              }
            })
            .catch((e) => {
              props.setisLoading(false);
              setApiError(e);
              deleteCoupon();
            });
        })
        .catch((e) => {
          console.log(e.response.data.message);
          setApiError(e.response.data.message);
          props.setisLoading(false);
        });
    }
  };

  const updateDescription = (product_id, product_description) => {
    setShow(false);
    props.setSections((prev) =>
      props.sections.map((section) =>
        section.id
          ? {
              ...section,
              products: [
                ...section.products.map((product) =>
                  product.product_id === product_id
                    ? { ...product, product_description: product_description }
                    : product
                ),
              ],
            }
          : section
      )
    );
    setEmailHTML();
  };

  const couponstyle = {
    backgroundColor: "#D1E7DD",
    padding: "10px",
    marginTop: "20px",
    borderRadius: "10px",
    textAlign: "center",
  };

  const headingstyle = {
    backgroundColor: "#40376E",
    padding: "6px",
    borderRadius: "10px",
    textAlign: "center",
    color: "#fff",
  };

  return (
    <div>
      <h2 className="section-title">Review</h2>
      <p>
        Review your consultation and send to the customer. You'll need your
        secret key to send the email!
      </p>
      <hr />
      <p>
        To:{" "}
        {props.formContent.name.length > 0 ? (
          props.formContent.name
        ) : (
          <Alert2>Name is missing</Alert2>
        )}{" "}
        ({" "}
        {props.formContent.email.length > 0 ? (
          <strong>{props.formContent.email}</strong>
        ) : (
          <Alert2>Email is missing</Alert2>
        )}{" "}
        )
      </p>
      <br />
      <p>
        Dear{" "}
        {props.formContent.name.length > 0 ? (
          props.formContent.name
        ) : (
          <Alert2>Name is missing</Alert2>
        )}
        , <br />
        <br />
        <p dangerouslySetInnerHTML={{ __html: props.formContent.intro }}></p>
      </p>
      <br />
      <div style={couponstyle}>
        Please use the following coupon code for{" "}
        <strong>{props.formContent.coupon_value}% off </strong>your next
        purchase:
        <strong> {props.formContent.coupon}</strong>
      </div>
      <br />
      {props.sections
        ? props.sections.map((section) => (
            <div className="row mt-5">
              <div className="col-12 text-center mb-3">
                <div style={headingstyle}>
                  {" "}
                  <h2>{section.name}</h2>
                </div>
              </div>
              {section.products.map((product) => (
                <div className="row mt-4 mb-4">
                  <div className="col-6 text-center">
                    <img
                      className="product-image-review"
                      src={product.product_image}
                      alt="product img"
                    />
                  </div>
                  <div className="col-6">
                    <h3>
                      <strong>{product.product_name}</strong>
                    </h3>
                    <p
                      style={{ whiteSpace: "pre-wrap" }}
                      dangerouslySetInnerHTML={{
                        __html: product.product_description,
                      }}
                    ></p>

                    <Button
                      variant="primary"
                      onClick={() =>
                        handleShow(
                          product.product_id,
                          product.product_description
                        )
                      }
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ))
        : null}
      <ContainModal>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Product Description</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body">
            <TextareaAutosize
              minRows="10"
              style={{ width: "100%" }}
              value={selectedEdit.product_descirption}
              onChange={(e) =>
                setSelectedEdit({
                  product_id: selectedEdit.product_id,
                  product_descirption: e.target.value,
                })
              }
              className="textarea"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() =>
                updateDescription(
                  selectedEdit.product_id,
                  selectedEdit.product_descirption
                )
              }
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </ContainModal>
      <Button
        className="mt-3 mb-5 btn-success"
        onClick={() => submitConsultation()}
        disabled={props.isLoading}
      >
        Submit Consultation
      </Button>
      {apiError === "success" ? (
        <Alert variant="success">
          Consultation has been sent to {props.formContent.email}
        </Alert>
      ) : apiError ? (
        <Alert variant="danger">{apiError}</Alert>
      ) : null}
    </div>
  );
};

export default Step4;

const Alert2 = styled.span`
  padding: 5px;
  background-color: #e03e3e;
  color: #fff;
`;

const ContainModal = styled.div``;
