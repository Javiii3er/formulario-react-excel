import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import 'bootstrap/dist/css/bootstrap.min.css';

const Formulario = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        deporte: '',
        genero: '',
        departamento: '',
        edad: false,
        modeloCoche: ''
    });

    // Lista de deportes actualizada
    const deportes = [
        "Fútbol", "Baloncesto", "Béisbol", "Fútbol Americano", 
        "Tenis", "Natación", "Ciclismo", "Atletismo", "Voleibol",
        "Boxeo", "Golf", "Hockey", "Otro"
    ];

    // Los 22 departamentos de Guatemala
    const departamentos = [
        "Alta Verapaz", "Baja Verapaz", "Chimaltenango", "Chiquimula", 
        "El Progreso", "Escuintla", "Guatemala", "Huehuetenango", 
        "Izabal", "Jalapa", "Jutiapa", "Petén", "Quetzaltenango", 
        "Quiché", "Retalhuleu", "Sacatepéquez", "San Marcos", 
        "Santa Rosa", "Sololá", "Suchitepéquez", "Totonicapán", "Zacapa"
    ];

    const modelosCoches = ["Vado", "Chrysler", "Toyota", "Nissan", "Otro"];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const worksheet = XLSX.utils.json_to_sheet([formData]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(data, 'datos-formulario.xlsx');
    };

    return (
        <div className="container mt-5">
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h1 className="text-center">Actualizar información</h1>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Nombre de pila:</label>
                            <input 
                                type="text" 
                                className="form-control"
                                name="nombre" 
                                value={formData.nombre} 
                                onChange={handleChange} 
                                placeholder="Introduce tu nombre" 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Apellido:</label>
                            <input 
                                type="text" 
                                className="form-control"
                                name="apellido" 
                                value={formData.apellido} 
                                onChange={handleChange} 
                                placeholder="Introduce tu apellido" 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Deporte favorito:</label>
                            <select 
                                className="form-select"
                                name="deporte" 
                                value={formData.deporte} 
                                onChange={handleChange} 
                                required
                            >
                                <option value="">Selecciona un deporte</option>
                                {deportes.map((deporte, index) => (
                                    <option key={index} value={deporte}>{deporte}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Género:</label>
                            <div className="d-flex gap-3">
                                <div className="form-check">
                                    <input 
                                        className="form-check-input"
                                        type="radio" 
                                        name="genero" 
                                        value="Masculino" 
                                        checked={formData.genero === "Masculino"} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                    <label className="form-check-label">Masculino</label>
                                </div>
                                <div className="form-check">
                                    <input 
                                        className="form-check-input"
                                        type="radio" 
                                        name="genero" 
                                        value="Femenino" 
                                        checked={formData.genero === "Femenino"} 
                                        onChange={handleChange} 
                                    />
                                    <label className="form-check-label">Femenino</label>
                                </div>
                                <div className="form-check">
                                    <input 
                                        className="form-check-input"
                                        type="radio" 
                                        name="genero" 
                                        value="No estoy seguro" 
                                        checked={formData.genero === "No estoy seguro"} 
                                        onChange={handleChange} 
                                    />
                                    <label className="form-check-label">No estoy seguro</label>
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Departamento:</label>
                            <select 
                                className="form-select"
                                name="departamento" 
                                value={formData.departamento} 
                                onChange={handleChange} 
                                required
                            >
                                <option value="">Selecciona tu departamento</option>
                                {departamentos.map((depto, index) => (
                                    <option key={index} value={depto}>{depto}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3 form-check">
                            <input 
                                className="form-check-input"
                                type="checkbox" 
                                name="edad" 
                                checked={formData.edad} 
                                onChange={handleChange} 
                            />
                            <label className="form-check-label">21 años o más</label>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Modelo de coche:</label>
                            <select 
                                className="form-select"
                                name="modeloCoche" 
                                value={formData.modeloCoche} 
                                onChange={handleChange}
                            >
                                <option value="">Selecciona un modelo</option>
                                {modelosCoches.map((modelo, index) => (
                                    <option key={index} value={modelo}>{modelo}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Guardar cambios</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Formulario;