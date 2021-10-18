import { Button } from "react-bootstrap";
import styled from "styled-components";
import { useState } from "react";
import Step0 from "./step0";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faSquare as faCircle,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { faSquare as farCircle } from "@fortawesome/free-regular-svg-icons";

const ConsultForm = () => {
  const [position, setPosition] = useState(0);
  // will be used to disable button and show loading screen when submitting consultation
  const [isLoading, setisLoading] = useState(false);

  // Set initial state
  const [products, setProducts] = useState({
    data: null,
  });

  // Control Next Validation
  const [preventNext, setPreventNext] = useState(true);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showloading, setShowLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState(1);
  const [sectionCounter, setSectionCounter] = useState(1);

  const [formContent, setFormContent] = useState({
    name: "",
    email: "",
    coupon: "",
    coupon_value: "",
    intro: ``,
  });

  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState();

  const [successMessage, setSuccessMessage] = useState(false);

  const [storeKey, setStoreKey] = useState("");

  const nextStep = () => {
    if (position < 5) {
      setPosition(position + 1);
    }
  };

  const backStep = () => {
    if (position > 0) {
      setPosition(position - 1);
    }
  };

  return (
    <div>
      <ContainForm>
        <ContainProgress>
          <FontAwesomeIcon icon={faCircle} />
          <FontAwesomeIcon icon={position > 0 ? faCircle : farCircle} />
          <FontAwesomeIcon icon={position > 1 ? faCircle : farCircle} />
          <FontAwesomeIcon icon={position > 2 ? faCircle : farCircle} />
          <FontAwesomeIcon icon={position > 3 ? faCircle : farCircle} />
        </ContainProgress>
        {isLoading ? (
          <LoadingScreen>
            <FontAwesomeIcon icon={faSpinner} className="spinner" />
          </LoadingScreen>
        ) : null}

        {position === 0 ? (
          <Step0
            storeKey={storeKey}
            setStoreKey={setStoreKey}
            preventNext={preventNext}
            setPreventNext={setPreventNext}
          />
        ) : position === 1 ? (
          <Step1
            preventNext={preventNext}
            setPreventNext={setPreventNext}
            formContent={formContent}
            setFormContent={setFormContent}
          />
        ) : position === 2 ? (
          <Step2
            formContent={formContent}
            preventNext={preventNext}
            setPreventNext={setPreventNext}
            setFormContent={setFormContent}
          />
        ) : position === 3 ? (
          <Step3
            preventNext={preventNext}
            setPreventNext={setPreventNext}
            products={products}
            setProducts={setProducts}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            showloading={showloading}
            setShowLoading={setShowLoading}
            sections={sections}
            setSections={setSections}
            selectedSection={selectedSection}
            setselectedSection={setSelectedSection}
            currentSection={currentSection}
            setCurrentSection={setCurrentSection}
            sectionCounter={sectionCounter}
            setSectionCounter={setSectionCounter}
            storeKey={storeKey}
          />
        ) : position === 4 ? (
          <Step4
            products={products}
            selectedProducts={selectedProducts}
            formContent={formContent}
            sections={sections}
            setSections={setSections}
            isLoading={isLoading}
            setisLoading={setisLoading}
            setSuccessMessage={setSuccessMessage}
            successMessage={successMessage}
            storeKey={storeKey}
          />
        ) : null}

        <div className="row text-center">
          <div className="col-6">
            {position < 4 ? (
              <Button
                disabled={preventNext}
                onClick={() => {
                  nextStep();
                  window.scrollTo(0, 0);
                }}
                className="nav-btns"
              >
                Next
              </Button>
            ) : null}
          </div>
          <div className="col-6">
            {position > 1 ? (
              <Button
                onClick={() => {
                  backStep();
                  window.scrollTo(0, 0);
                }}
                className="nav-btns"
                disabled={isLoading}
              >
                Back
              </Button>
            ) : null}
          </div>
        </div>
      </ContainForm>

      {successMessage ? (
        <div>
          <BlockScreen />
          <Success>
            <FontAwesomeIcon className="thumb" icon={faThumbsUp} />
            <h2 className="pt-3 pb-3">
              <strong>Great Job!</strong>
            </h2>
            <p>
              Your email has been sent successfully to{" "}
              <strong>{formContent.email}</strong>
            </p>
            <p className="text-muted pb-3">
              We've also sent a copy to your email address for your own records!
            </p>
            <Button onClick={() => window.location.reload()}>Close</Button>
          </Success>
        </div>
      ) : null}
    </div>
  );
};

export default ConsultForm;

const Success = styled.div`
  padding-top: 50px;
  padding-bottom: 50px;
  width: 80%;
  height: auto;
  text-align: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 20px;
  padding: 10px;
  padding-top: 50px;
  padding-bottom: 50px;

  margin: 0 auto;
  background-color: #fff;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

  .thumb {
    font-size: 80px;
    color: green;
  }
`;

const BlockScreen = styled.div`
  position: fixed;
  left: 0px;
  top: 0px;
  height: 100vh;
  width: 100vw;
  background-color: #22222275;
`;

const LoadingScreen = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100vw;
  background-color: #d3d3d375;
  display: flex;
  justify-content: center;
  align-items: center;

  .spinner {
    animation: spin infinite 3s linear;
    font-size: 40px;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const ContainProgress = styled.div`
  display: flex;
  justify-content: space-between;
  width: 50%;
  margin: 0 auto;
  margin-bottom: 50px;
  margin-top: 20px;
  font-size: 25px;
`;

const ContainForm = styled.div`
  font-family: "Signika", sans-serif;
  .textarea {
    min-width: 100% !important;
  }

  .section-title {
    font-weight: bold;
  }

  @media (min-width: 998px) {
    width: 70%;
    margin: 0 auto;
    padding-left: 10%;
    padding-right: 10%;
  }

  @media (max-width: 997px) {
    width: 90%;
    margin: 0 auto;
  }

  .nav-btns {
    width: 100%;
    margin-top: 20px;
  }

  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 18px 0px;
  padding: 20px;
  border-radius: 10px;

  .contain-product {
    border-radius: 10px;
  }

  h4 {
    font-size: 1rem;
  }

  .contain-product {
    padding-top: 15px;
    padding-bottom: 15px;
  }

  .contain-product h4 {
    min-height: 60px;
  }

  .contain-product img {
    display: block;
    margin: 0 auto;
    width: 100px;
    height: 100px;
  }

  .product-image-review {
    width: 150px;
  }

  .selected {
    background-color: green;
    border: none !important;
  }

  .delete-icon {
    color: red;
    cursor: pointer;
  }

  .send-consult {
    background-color: green;
    width: 80%;
    margin-top: 20px;
    border: none;
  }
`;
