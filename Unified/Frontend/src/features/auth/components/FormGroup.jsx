import React from "react";

const FormGroup = ({ label, placeholder, type, value, onChange }) => {
    return (
        <div className="form-group">
            <label htmlFor={label}>{label}</label>
            <input
                type={type}
                className="form-control"
                id={label}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export default FormGroup;
