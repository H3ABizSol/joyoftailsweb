import React, { useEffect, useState } from "react";
import { Dashboardnav } from "../components/Dashboardnav/Dashboardnav";
import axios from "axios";
import "./user.css";

export const User = () => {
  const [user, setUsers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [show, setShow] = useState(false);
  const [isUser, setIsUser] = useState(true);
  const [isFilterUser, setIsFilterUser] = useState(false);
  const [filterUser, setFilterUser] = useState([]);
  const [ok, setOk] = useState(false);

  const getAlluser = async () => {
    const { data } = await axios.get("/api/user", {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    setUsers([...data.AllUsers]);
  };

  useEffect(() => {
    getAlluser();
  }, [show]);

  const deleteUser = async (id) => {
    const confirm = window.confirm("Are you sure");
    if (confirm) {
      const { data } = await axios.delete(`/api/user/${id}`);
      if (data.success) {
        setOk(true);
      }
    }
  };

  const search = () => {
    const filterData = user.filter((item) => {
      if (item._id.toLowerCase().includes(keyword.toLowerCase())) {
        setIsUser(false);
        setIsFilterUser(true);
        return item;
      }
      if (item.username.toLowerCase().includes(keyword.toLowerCase())) {
        setIsUser(false);
        setIsFilterUser(true);
        return item;
      }
      if (item.email.toLowerCase().includes(keyword.toLowerCase())) {
        setIsUser(false);
        setIsFilterUser(true);
        return item;
      }
    });
    setFilterUser(filterData);
  };
  if (ok) {
    return <User />;
  }
  return (
    <section className="dashboard-section">
      <div className="dashboard-wrapper">
        <div className="left-section">
          <Dashboardnav />
        </div>
        <div className="right-section">
          <input
            style={{ marginTop: "2rem", marginLeft: "2rem" }}
            type="search"
            name="search"
            placeholder="search users"
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
            onKeyUp={search}
          />
          <div className="user-container">
            <div className="user-wrapper">
              <div className="grid-user">
                <div>
                  <p>Sr No</p>
                </div>
                <p>USER ID</p>
                <p>Name</p>
                <p>EMAIL</p>
                <p>ACTIONS</p>
              </div>
              {user.length > 0 &&
                isUser &&
                user.map((userData, index) => {
                  return (
                    <div className="grid-user">
                      <p>{index + 1}</p>
                      <div>
                        <p>{userData._id}</p>
                      </div>
                      <div>
                        <p>{userData.username}</p>
                      </div>
                      <p>{userData.email}</p>
                      <div className="button">
                        <button
                          className="btn"
                          onClick={() => {
                            deleteUser(userData._id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              {filterUser.length > 0 &&
                isFilterUser &&
                filterUser.map((userData, index) => {
                  return (
                    <div className="grid-user">
                      <p>{index + 1}</p>
                      <p>{userData._id}</p>
                      <p>{userData.username}</p>
                      <p>{userData.email}</p>
                      <div>
                        <button
                          className="btn"
                          onClick={() => {
                            deleteUser(userData._id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          {/* <div style={{ width: "70%", margin: " 2rem auto" }}>
            <p style={{ fontSize: "1.6rem" }}>Page 1 out of 30</p>
          </div> */}
        </div>
      </div>
    </section>
  );
};

// {user &&
//   isUser &&
//   user.map((userData, index) => {
//     return (
//       <tr>
//         <td>{index + 1}</td>
//         <td>{userData._id}</td>
//         <td>{userData.username}</td>
//         <td>{userData.email}</td>
//         <button
//           className="btn"
//           onClick={() => {
//             deleteUser(userData._id);
//           }}
//         >
//           Delete
//         </button>
//       </tr>
//     );
//   })}

// {filterUser &&
//   filterUser.map((userData, index) => {
//     return (
//       <tr>
//         <td>{index + 1}</td>
//         <td>{userData._id}</td>
//         <td>{userData.username}</td>
//         <td>{userData.email}</td>
//         <button
//           className="btn"
//           onClick={() => {
//             deleteUser(userData._id);
//           }}
//         >
//           Delete
//         </button>
//       </tr>
//     );
//   })}

// <div className="items">
//   <img src={userData.image} alt="" />
//   <div>
//     <h2
//       style={{
//         fontSize: "2rem",
//         textAlign: "center",
//         textTransform: "capitalize",
//       }}
//     >
//       {userData.username}
//     </h2>
//     {/* <p >
//       Lorem ipsum dolor sit amet consectetur, adipisicing
//       elit. Incidu
//     </p> */}
//   </div>
//   <div
//     style={{
//       display: "flex",
//       justifyContent: "center",
//       marginTop: "2rem",
//     }}
//   >
//     {/* <button>Edit</button> */}
//     <button
//       onClick={() => {
//         deleteUser(userData._id);
//       }}
//     >
//       Delete
//     </button>
//   </div>
// </div>
