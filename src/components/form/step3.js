import { Form, Button, Modal } from "react-bootstrap";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faPlusCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import styled from "styled-components";
import { useEffect } from "react";

const Step3 = (props) => {
  const [storeSection, setStoreSection] = useState({ products: [] });
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const handleShow = (sectionid) => {
    props.setCurrentSection(sectionid + 1);

    props.sections.map((section) => {
      if (section.id === sectionid + 1) {
        return setStoreSection(section);
      } else {
        console.log("No Section Found");
        return 1;
      }
    });

    console.log(props.currentSection);
    setShow(true);
  };

  const validate = () => {
    if (props.sections.length > 0) {
      console.log(props.sections);
      if (props.sections[0].products.length !== 0) {
        console.log("Good");
        props.setPreventNext(false);
      } else {
        props.setPreventNext(true);
        console.log("Bad");
      }
    } else {
      props.setPreventNext(true);
    }
  };

  // Run validate when component mounts
  useEffect(() => {
    validate();
  });

  const searchProduct = (searchTerm) => {
    props.setShowLoading(true);
    if (searchTerm.length > 0) {
      axios
        .get(
          `https://truahair.ie/wp-json/wc/v3/products?search=${searchTerm}&consumer_key=ck_6138cb16f2484fd1f5acb447f6eaa82f2b2900c8&consumer_secret=${props.storeKey}`
        )
        .then((res) => {
          props.setShowLoading(false);
          props.setProducts({ data: res.data });
          console.log(props.products);
          console.log(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      props.setProducts({ data: null });
      props.setShowLoading(false);
    }
  };

  /* Creates A section and gives it an ID*/
  const createSection = () => {
    props.setSections([
      ...props.sections,
      {
        id: props.sectionCounter,
        name: "New Section",
        products: [],
        extra: [],
      },
    ]);
    props.setSectionCounter((prev) => prev + 1);
    setStoreSection({ name: "Section" + props.sectionCounter });
  };

  /* Takes in section id and removes section */
  const deleteSection = (sectionid) => {
    props.setSections([
      ...props.sections.filter((section) => section.id !== sectionid),
    ]);
    props.setSectionCounter((prev) => prev - 1);
  };

  /* Updates the section name */
  const updateSectionName = (id, name) => {
    props.setSections(
      props.sections.map((section) =>
        section.id === id
          ? {
              ...section,
              name: name,
            }
          : section
      )
    );
  };

  /* Takes in section id and adds product info to that section */
  const addProduct = (
    id,
    product_id,
    product_name,
    product_short_description,
    product_permalink,
    product_image
  ) => {
    console.log("ADD TO SECTION: " + props.currentSection);

    // Store current section in state to output selected / not selected buttons in modal
    setStoreSection((prevState) => {
      return {
        products: [
          ...prevState.products,
          {
            product_id: product_id,
            product_name: product_name,
            product_description: product_short_description,
            product_link: product_permalink,
            product_image: product_image,
          },
        ],
      };
    });

    // Store new product in sections state
    props.setSections((prev) =>
      props.sections.map((section) =>
        section.id === id
          ? {
              ...section,
              products: [
                ...section.products,
                {
                  product_id: product_id,
                  product_name: product_name,
                  product_description: product_short_description,
                  product_link: product_permalink,
                  product_image: product_image,
                },
              ],
            }
          : section
      )
    );
  };

  /* Takes in product id and section id and removes it from current section and modal state */
  const deleteProduct = (id, sectionid) => {
    // Delete product
    props.setSections((prev) =>
      props.sections.map((section) =>
        section.id === sectionid
          ? {
              ...section,
              products: [
                ...section.products.filter(
                  (product) => product.product_id !== id
                ),
              ],
            }
          : section
      )
    );
  };

  return (
    <div>
      {/*Create Section*/}
      <h2 className="section-title">Select Products</h2>
      <p>Create product categories and insert products into each category</p>
      <p className="text-muted">
        Note: You must add at least one section and one product before
        continuing
      </p>
      <hr />
      <CreateSection>
        <div
          className="create-section"
          onClick={() => {
            window.scrollTo(0, document.body.scrollHeight);
            createSection();
          }}
        >
          <div className="col-12 text-center pt-3">
            <FontAwesomeIcon className="add-icon" icon={faPlusCircle} />
            <h5>Add A Category</h5>
          </div>
        </div>

        {/*Output Each section*/}
        {props.sections.map((section, index) => (
          <div className="contain-section text-center">
            <input
              type="text"
              onChange={(e) => updateSectionName(section.id, e.target.value)}
              placeholder={section.name}
            />
            <FontAwesomeIcon
              icon={faTimesCircle}
              onClick={() => deleteSection(section.id)}
              className="remove-section-icon"
            />

            <Button className="mb-3" onClick={() => handleShow(index)}>
              Add Products
            </Button>

            {/* Show selected products for that section*/}
            <div className="selected-products">
              <div className="row">
                {section.products.map((product) => (
                  <div className="col-6 text-center contain-product">
                    <img src={product.product_image} alt="product img" />
                    <h4 className="mt-3">
                      {product.product_name}{" "}
                      <FontAwesomeIcon
                        onClick={() =>
                          deleteProduct(product.product_id, section.id)
                        }
                        icon={faTrashAlt}
                        className="trash-icon"
                      />
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        <Modal show={show} onHide={handleClose} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>
              Add Products to {storeSection ? storeSection.name : null}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3 mt-5">
              <Form.Control
                type="name"
                onChange={(e) => searchProduct(e.target.value)}
                placeholder="Start Typing Product Name To Search"
              />
            </Form.Group>

            {/* Search Form to search Products*/}
            <Results>
              <div className="contain-search-results mt-4">
                <div className="row text-center mx-auto">
                  {props.products.data ? (
                    props.products.data.map((product) => (
                      <div className="col-12 col-md-6 ml-2 mr-2 mt-2 mb-2">
                        <div className="contain-product p-2">
                          <h5>{product.name}</h5>
                          {product.images[0] ? (
                            <img src={product.images[0].src} alt="1" />
                          ) : null}

                          {storeSection.products ? (
                            !storeSection.products.find(
                              (o) => o.product_name === product.name
                            ) ? (
                              <Button
                                className="mt-3"
                                onClick={() =>
                                  addProduct(
                                    props.currentSection,
                                    product.id,
                                    product.name,
                                    product.short_description,
                                    product.permalink,
                                    product.images[0].src
                                  )
                                }
                              >
                                Select
                              </Button>
                            ) : (
                              <Button className="mt-3 selected">
                                Selected
                              </Button>
                            )
                          ) : null}
                        </div>
                      </div>
                    ))
                  ) : props.showloading ? (
                    <p>Loading...</p>
                  ) : null}
                </div>
              </div>
            </Results>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </CreateSection>
    </div>
  );
};

export default Step3;

const Results = styled.div`
  img {
    height: 150px;
    width: 150px;
    display: block;
    margin: 0 auto;
  }

  .selected {
    background-color: red;
    border: none !important;
  }
`;

const CreateSection = styled.div`
  .create-section {
    height: 100px;
    width: 100%;
    margin: 0 auto;
    padding-top: 5px;
    background-color: #d4edda;
    border: 1px solid #c3e6cb;
    border-radius: 5px;
    cursor: pointer;
  }

  .create-section:hover {
    background-color: #a8ebb8;
  }

  .remove-section-icon {
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .remove-section-icon:hover {
    color: red;
    cursor: pointer;
  }

  .trash-icon {
    color: red;
    font-size: 15px;
    margin-left: 10px;
    cursor: pointer;
  }

  .add-icon {
    font-size: 30px;
    cursor: pointer;
  }

  .add-icon:hover {
    color: green;
  }

  .contain-section {
    min-height: 100px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    margin-top: 30px;
    margin-bottom: 30px;
    padding-left: 30px;
    padding-right: 30px;
    padding-top: 10px;
    position: relative;
  }

  input {
    border: none;
    font-size: 24px;
    color: gray;
    text-align: center;
    width: 80%;
    display: block;
    margin: 0 auto;
    margin-bottom: 20px;
    margin-top: 5px;
  }

  input:focus {
    border: none;
  }
`;
