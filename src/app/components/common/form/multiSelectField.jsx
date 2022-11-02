import React from "react";
import Select from "react-select";
import PropTypes from "prop-types";

const MultiSelectField = ({ options, onChange, name, label, defaultValue }) => {
    const optionsArray =
        !Array.isArray(options) && typeof options === "object"
            ? Object.values(options)
            : options;

    const defaultValueArray =
        typeof defaultValue === "object"
            ? Object.keys(defaultValue).map((defaultValueName) => ({
                  value: defaultValue[defaultValueName]._id,
                  label: defaultValue[defaultValueName].name
              }))
            : defaultValue;

    const handleChange = (value) => {
        onChange({ name: name, value });
    };
    return (
        <div className="mb-4">
            <label className="form-label">{label}</label>
            {defaultValueArray.length > 0 ? (
                <Select
                    isMulti
                    closeMenuOnSelect={false}
                    options={optionsArray}
                    defaultValue={defaultValueArray}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={handleChange}
                    name={name}
                />
            ) : (
                console.log("....loading")
            )}
        </div>
    );
};
MultiSelectField.propTypes = {
    options: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    onChange: PropTypes.func,
    name: PropTypes.string,
    label: PropTypes.string,
    defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

export default MultiSelectField;
