import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useSpring, animated } from '@react-spring/web';
import { Modal, Button } from 'react-bootstrap';

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

    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Animación con React Spring
    const fadeIn = useSpring({
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
        config: { tension: 200, friction: 20 }
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
        
        // Limpiar errores al cambiar
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido";
        else if (formData.nombre.length < 3) newErrors.nombre = "Mínimo 3 caracteres";
        
        if (!formData.apellido.trim()) newErrors.apellido = "El apellido es requerido";
        
        if (!formData.deporte) newErrors.deporte = "Selecciona un deporte";
        
        if (!formData.genero) newErrors.genero = "Selecciona tu género";
        
        if (!formData.departamento) newErrors.departamento = "Selecciona tu departamento";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setShowModal(true);
        }
    };

    const saveToGoogleSheets = async () => {
        setIsSubmitting(true);
        const scriptURL = 'https://script.google.com/macros/s/AKfycbwrJIkTEDV9Ve0FYFScmaWmwIuSgt12Bg3nSzc6qg7Mu-XPGr2d8XvuOyai7x6TSZ1C/exec';
        
        try {
            // Enviar datos a Google Sheets
            const response = await fetch(scriptURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    ...formData,
                    edad: formData.edad ? 'Sí' : 'No' // Convertir booleano a texto
                }).toString()
            });
            
            const result = await response.text();
            console.log('Datos guardados en Google Sheets:', result);
            
            // Generar Excel
            generateExcel();
            
        } catch (error) {
            console.error('Error al guardar en Google Sheets:', error);
            alert('Ocurrió un error al guardar los datos');
        } finally {
            setIsSubmitting(false);
            setShowModal(false);
        }
    };

    const generateExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet([{
            ...formData,
            edad: formData.edad ? 'Sí' : 'No'
        }]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { 
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        saveAs(data, `datos-${formData.nombre}-${new Date().toISOString().slice(0,10)}.xlsx`);
    };

    const handleConfirm = () => {
        saveToGoogleSheets();
    };

    return (
        <animated.div style={fadeIn} className="container mt-5">
            <div className="glass-card">
                <h1 className="text-center mb-4">Actualizar Información</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nombre de pila:</label>
                        <input 
                            type="text" 
                            className={`form-control ${errors.nombre && 'is-invalid'}`}
                            name="nombre" 
                            value={formData.nombre} 
                            onChange={handleChange} 
                            placeholder="Introduce tu nombre" 
                        />
                        {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Apellido:</label>
                        <input 
                            type="text" 
                            className={`form-control ${errors.apellido && 'is-invalid'}`}
                            name="apellido" 
                            value={formData.apellido} 
                            onChange={handleChange} 
                            placeholder="Introduce tu apellido" 
                        />
                        {errors.apellido && <div className="invalid-feedback">{errors.apellido}</div>}
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Deporte favorito:</label>
                        <select 
                            className={`form-select ${errors.deporte && 'is-invalid'}`}
                            name="deporte" 
                            value={formData.deporte} 
                            onChange={handleChange}
                        >
                            <option value="">Selecciona un deporte</option>
                            {deportes.map((deporte, index) => (
                                <option key={index} value={deporte}>{deporte}</option>
                            ))}
                        </select>
                        {errors.deporte && <div className="invalid-feedback">{errors.deporte}</div>}
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Género:</label>
                        <div className="d-flex gap-3">
                            {['Masculino', 'Femenino', 'No estoy seguro'].map((genero) => (
                                <div key={genero} className="form-check">
                                    <input 
                                        className="form-check-input"
                                        type="radio" 
                                        name="genero" 
                                        id={`genero-${genero}`}
                                        value={genero} 
                                        checked={formData.genero === genero} 
                                        onChange={handleChange} 
                                    />
                                    <label className="form-check-label" htmlFor={`genero-${genero}`}>
                                        {genero}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {errors.genero && <div className="text-danger small">{errors.genero}</div>}
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Departamento:</label>
                        <select 
                            className={`form-select ${errors.departamento && 'is-invalid'}`}
                            name="departamento" 
                            value={formData.departamento} 
                            onChange={handleChange}
                        >
                            <option value="">Selecciona tu departamento</option>
                            {departamentos.map((depto, index) => (
                                <option key={index} value={depto}>{depto}</option>
                            ))}
                        </select>
                        {errors.departamento && <div className="invalid-feedback">{errors.departamento}</div>}
                    </div>
                    
                    <div className="mb-3 form-check">
                        <input 
                            className="form-check-input"
                            type="checkbox" 
                            name="edad" 
                            id="edad"
                            checked={formData.edad} 
                            onChange={handleChange} 
                        />
                        <label className="form-check-label" htmlFor="edad">
                            21 años o más
                        </label>
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
                    
                    <button 
                        type="submit" 
                        className="btn btn-glass w-100 mt-3"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Procesando...' : 'Guardar cambios'}
                    </button>
                </form>
            </div>

            {/* Modal de Resumen */}
            <Modal show={showModal} onHide={() => setShowModal(false)} className="modal-glass">
                <Modal.Header closeButton className="modal-content-glass">
                    <Modal.Title>Confirmar Datos</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-content-glass">
                    <p><strong>Nombre:</strong> {formData.nombre} {formData.apellido}</p>
                    <p><strong>Deporte favorito:</strong> {formData.deporte}</p>
                    <p><strong>Género:</strong> {formData.genero}</p>
                    <p><strong>Departamento:</strong> {formData.departamento}</p>
                    <p><strong>21 años o más:</strong> {formData.edad ? 'Sí' : 'No'}</p>
                    <p><strong>Modelo de coche:</strong> {formData.modeloCoche || 'No especificado'}</p>
                    
                    <div className="alert alert-info mt-3">
                        Los datos se guardarán en Google Sheets y se generará un archivo Excel.
                    </div>
                </Modal.Body>
                <Modal.Footer className="modal-content-glass">
                    <Button 
                        variant="secondary" 
                        onClick={() => setShowModal(false)}
                        disabled={isSubmitting}
                    >
                        Corregir
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleConfirm}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Guardando...' : 'Confirmar y Descargar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </animated.div>
    );
};

export default Formulario;