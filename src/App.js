import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import './App.css';
import initialRecords from "./data/records.json"; // Importăm datele inițiale

function App() {
  const [records, setRecords] = useState(initialRecords);

  const addRecord = (record) => {
    setRecords([...records, record]);
  };

  const deleteRecord = (id) => {
    setRecords(records.filter((record) => record.id !== id));
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<RecordList records={records} deleteRecord={deleteRecord} />}
        />
        <Route path="/add" element={<AddRecordForm addRecord={addRecord} />} />
        <Route path="/details/:id" element={<RecordDetails records={records} />} />
      </Routes>
    </Router>
  );
}

function AddRecordForm({ addRecord }) {
  const [formData, setFormData] = useState({ camp1: "", camp2: "", camp3: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.camp1) newErrors.camp1 = "Camp1 este obligatoriu.";
    if (!formData.camp2) newErrors.camp2 = "Camp2 este obligatoriu.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      addRecord({ ...formData, id: Date.now().toString() });
      navigate("/");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Adaugă o Înregistrare</h1>
      <div>
        <label>Camp1:</label>
        <input name="camp1" value={formData.camp1} onChange={handleChange} />
        {errors.camp1 && <span>{errors.camp1}</span>}
      </div>
      <div>
        <label>Camp2:</label>
        <input name="camp2" value={formData.camp2} onChange={handleChange} />
        {errors.camp2 && <span>{errors.camp2}</span>}
      </div>
      <div>
        <label>Camp3:</label>
        <input name="camp3" value={formData.camp3} onChange={handleChange} />
      </div>
      <button type="submit">Adaugă</button>
    </form>
  );
}

function RecordList({ records, deleteRecord }) {
  return (
    <div>
      <h1>Lista Înregistrărilor</h1>
      <Link to="/add">Adaugă o Înregistrare</Link>
      <ul>
        {records.map((record) => (
          <li key={record.id}>
            <h3>{record.camp1}</h3>
            <p>{record.camp2}</p>
            <button onClick={() => deleteRecord(record.id)}>Șterge</button>
            <Link to={`/details/${record.id}`}>Detalii</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RecordDetails({ records }) {
  const { id } = useParams();
  const record = records.find((rec) => rec.id === id);

  if (!record) return <p>Înregistrarea nu există.</p>;

  return (
    <div>
      <h1>Detalii</h1>
      <p>Camp1: {record.camp1}</p>
      <p>Camp2: {record.camp2}</p>
      <p>Camp3: {record.camp3 || "N/A"}</p>
      <Link to="/">Înapoi la listă</Link>
    </div>
  );
}

export default App;
