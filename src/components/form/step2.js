import { Form, Button } from "react-bootstrap";
import { useEffect } from "react";
import randomstring from "randomstring";
import styled from "styled-components";



const Step2 = (props) => {
  const validate = () => {
    if (props.useCoupon) {
    if (
      props.formContent.coupon.length > 3 &&
      props.formContent.coupon.length < 9 &&
      props.formContent.coupon_value > 0 &&
      props.formContent.coupon_value < 100
    ) {
      console.log("Good");
      props.setPreventNext(false);
    } else {
      props.setPreventNext(true);
    }
  } else {
    props.setPreventNext(false);    
  }
  };



  const yes_coupon = () => {
    props.setUseCoupon(true);
    validate();

  }

  const no_coupon = () => {
    props.setUseCoupon(false);
    validate();

  }



  // Run validate when component mounts
  useEffect(() => {
    validate();
  });


  const generateCoupon = () => {
    const random = randomstring.generate({
      charset: "ABCDEFGHJKMNQPRSTUVXYZ123456789",
      length: 6,
    });
    props.setFormContent({
      ...props.formContent,
      coupon: random,
    });
  };

  return (
    <div className="div">
      <h2 className="section-title">Introduction</h2>
      <p>
        Customise the introduction to your email. Create a coupon code and
        set a percentage discount.
      </p>
      <hr />
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Introduction</Form.Label>
          <Form.Control
            as="textarea"
            onChange={(e) =>
              props.setFormContent({
                ...props.formContent,
                intro: e.target.value,
              })
            }
            rows={10}
            value={props.formContent.intro}
          />
        </Form.Group>
      <div className="col-12">
      
      <Togglebtns>
       <h2 className="section-title">Would you like to include a coupon code?</h2>
       <Button className={`btn-primary ${props.useCoupon ? "selected" : "not-selected"}`} onClick={() => yes_coupon()}>Yes</Button>
       <Button className={`m-2 ${!props.useCoupon ? "selected" : "not-selected"}`} onClick={() => no_coupon()}>No</Button>

       </Togglebtns>
       </div>

       {props.useCoupon ? 
       <div>
        <Form.Group className="mb-3">
          <Form.Label>
            Coupon Code (Must be <strong>between 4 and 8 characters</strong>)
          </Form.Label>
          <Form.Control
            value={props.formContent.coupon}
            onChange={(e) =>
              props.setFormContent({
                ...props.formContent,
                coupon: e.target.value,
              })
            }
            placeholder="Enter coupon code"
          />
          <Button className="mt-3" onClick={() => generateCoupon()}>
            Generate
          </Button>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            Discount (Percentage) - Please enter a whole number between 1 and 99
          </Form.Label>
          <Form.Control
            value={props.formContent.coupon_value.replace("%", "")}
            type="number"
            onChange={(e) =>
              // Only allow numbers between 1 & 99
              e.target.value > 0 && e.target.value < 100
                ? props.setFormContent({
                    ...props.formContent,
                    coupon_value: e.target.value,
                  })
                : props.setFormContent({
                    ...props.formContent,
                    coupon_value: "",
                  })
            }
            placeholder="Enter coupon percentage value"
          />
        </Form.Group>
        </div>
        : null }
      </Form>
    </div>
  );
};

const Togglebtns = styled.div`

.selected {
background-color: green !important;
border: none;
}

.not-selected {
background-color: lightgray !important;
border: none;
}

`


export default Step2;
