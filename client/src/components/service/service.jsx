import React, { useEffect, useState } from "react";
import "./service.css";
import { Card, Modal } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Rating } from "react-simple-star-rating";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const { Meta } = Card;

export const Ourservice = () => {
  const params = useParams();
  const [serviceDetails, setServiceDetails] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const [id, setId] = useState("");
  const [ok, setOk] = useState(false);

  const getDetails = async () => {
    const { data } = await axios.get(`/api/service`);
    const filterData = data.details.filter((i) => {
      return i.title.toLowerCase() === params.name.toLowerCase();
    });
    setServiceDetails(filterData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (localStorage.getItem("token")) {
      const { data } = await axios.put(
        `/api/service/review/${id}`,
        {
          user: localStorage.getItem("id"),
          rating,
          comment,
          name: localStorage.getItem("user"),
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      if (data.success) {
        setOk(true);
      }
    } else {
      toast.error("you have to login first", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getDetails();
  }, []);

  if (ok) {
    return <Ourservice />;
  }
  return (
    <>
      <ToastContainer />
      <div className="service">
        <h2
          style={{
            textAlign: "center",
            fontSize: "2.6rem",
            marginTop: "4rem",
            textTransform: "capitalize",
          }}
        >
          {params.name}
        </h2>
        <div className="service-wrapper">
          {serviceDetails.length > 0 &&
            serviceDetails.map((e) => {
              return (
                <Card
                  hoverable
                  style={{
                    width: 240,
                  }}
                  cover={<img alt="example" src={`/uploads/${e.image}`} />}
                >
                  <Meta title={e.title} description={e.address} />
                  <p>Contact : {e.mobile}</p>
                  <Rating
                    size={20}
                    fillColor="#FF6347"
                    readonly
                    initialValue={e.ratings}
                    allowFraction={true}
                  />{" "}
                  {/* {e.reviews.map((c) => {
                    return (
                      <p style={{ textTransform: "lowercase" }}>{c.comment}</p>
                    );
                  })} */}
                  <p>{e.reviews.length} comments</p>
                  <span
                    onClick={() => {
                      setOpen2(true);
                    }}
                  >
                    See All
                  </span>
                  <Modal
                    title="How was the service"
                    centered
                    open={open2}
                    onCancel={() => setOpen2(false)}
                    footer={null}
                  >
                    <div>
                      {e.reviews.map((c) => {
                        return (
                          <p
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "0.2rem",
                              alignContent: "center",
                            }}
                          >
                            {c.name}
                            <span
                              style={{ fontSize: "1rem", fontWeight: "400" }}
                            >
                              {c.comment}
                            </span>
                          </p>
                        );
                      })}
                    </div>
                  </Modal>
                  <div>
                    <button
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "tomato",
                        border: "none",
                        borderRadius: "5px",
                        color: "white",
                        marginTop: "1rem",
                      }}
                      onClick={() => {
                        setOpen(true);
                        setId(e._id);
                      }}
                    >
                      Add Review
                    </button>
                  </div>
                </Card>
              );
            })}
        </div>
        <Modal
          title="How was the service"
          centered
          open={open}
          onCancel={() => setOpen(false)}
          footer={null}
        >
          <form className="form-wrapper" onSubmit={handleSubmit} method="put">
            <Rating
              size={20}
              initialValue={rating}
              onClick={(e) => {
                setRating(e);
              }}
              allowFraction={true}
            />
            <div>
              <textarea
                name="comment"
                placeholder="comment"
                value={comment}
                rows={5}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
              />
            </div>
            <div>
              <button className="modal-btn">Submit Review</button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};
