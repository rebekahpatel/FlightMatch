import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {getUID} from "./login.js";
import { useNavigate } from "react-router";

const Record = (props) => (
  <tr>
    <td>{props.record.number}</td>
    <td>{props.record.date}</td>
    <td>{props.record.time}</td>
    <td>{props.record.baggage}</td>
    <td>
      <Link className="btn-link" to={`/edit/${props.record._id}`}>Edit</Link>   
      <text> | </text>
      <Link className="btn-link" onClick={() => { props.deleteRecord(props.record._id);}}>
        Delete
      </Link> 
    </td>
  </tr>
);

export default function RecordList() {
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();

  // This method fetches the records from the database.
  useEffect(() => {
    async function getRecords() {
      const response = await fetch(`http://localhost:5001/arriving`);

      if (!response.ok) {
        const message = `An error occured: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const records = await response.json();
      //const newRecords = records.filter((el) => el.date === new Date());
      setRecords(records);
    }

    getRecords();

    return; 
  }, [records.length]);

  // This method will delete a record
  async function deleteRecord(id) {
    await fetch(`http://localhost:5001/${id}`, {
      method: "DELETE"
    });

    const newRecords = records.filter((el) => el._id !== id);
    setRecords(newRecords);
  }

  // This method will map out the records on the table
  //note
  function RecordList() {
    
    //The filter shows flights that match getUID
    let filteredFlights = records.filter(
      (flight) => flight.uid === getUID()
    );
    
    console.log("THE UID is: ", getUID());

    return filteredFlights.map((record) => {
      return (
        <Record
          record={record}
          deleteRecord={() => deleteRecord(record._id)}
          key={record._id}
        />
      );
    });
  }


  if (getUID() === 0)
  {
    return (
      <div>
        <h3> Invalid Credentials. Must be Logged in to view this page </h3>
        <h3> Use the Navigation Bar or Press the Button to Login</h3>
        <button onClick={() => navigate("/")}>Go to Login</button>
      </div>
    );
  }

  // This following section will display the table with the records of individuals.
  return (
    <div>
      <h3>My Flights</h3>
      
      <table className="table table-striped" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Flight Number</th>
            <th>Arrival Date</th>
            <th>Arrival Time</th>
            <th>Bags</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{RecordList()}</tbody>
      </table>
    </div>
  );
}
