import './App.css'
import StudentForm from './components/StudentForm'
import StudentList from './components/StudentList'
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [details, setDetails] = useState([]);
  const getData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/students");
      setDetails(response.data);
    }
    catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div> Student Managment System</div>
      <StudentForm getData={getData} />
      <StudentList details={details} />
    </>
  )
}

export default App;
