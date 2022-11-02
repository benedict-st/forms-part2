import React, { useEffect, useState } from "react";

import PropTypes from "prop-types";
import api from "../../../api";
import TextField from "../../common/form/textField";
import SelectField from "../../common/form/selectField";
import RadioField from "../../common/form/radioField";
import MultiSelectField from "../../common/form/multiSelectField";
import { useParams, useHistory } from "react-router-dom";

export default function EditUserPage() {
    const params = useParams();
    const { userId } = params;
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUser] = useState();
    const history = useHistory();
    useEffect(() => {
        api.users
            .getById(userId)
            .then((user) => {
                setUser(user);
            })
            .then(() => {
                setIsLoading(true);
            });
    }, []);

    const [data, setData] = useState({
        name: "",
        email: "",
        profession: "",
        sex: "",
        qualities: []
    });

    useEffect(() => {
        if (isLoading) {
            setData({
                name: users.name,
                email: users.email,
                profession: users.profession,
                sex: users.sex,
                qualities: users.qualities
            });
        }
    }, [users]);
    const [qualities, setQualities] = useState([]);
    const [professions, setProfession] = useState([]);

    useEffect(() => {
        api.professions.fetchAll().then(
            (data) => {
                const professionsList = Object.keys(data).map(
                    (professionName) => ({
                        label: data[professionName].name,
                        value: data[professionName]._id
                    })
                );
                setProfession(professionsList);
            },
            [users]
        );

        api.qualities.fetchAll().then((data) => {
            const qualitiesList = Object.keys(data).map((optionName) => ({
                value: data[optionName]._id,
                label: data[optionName].name,
                color: data[optionName].color
            }));
            setQualities(qualitiesList);
        });
    }, [users]);

    const getProfessionById = (id) => {
        if (typeof id !== "object") {
            for (const prof of professions) {
                if (prof.value === id) {
                    return { _id: prof.value, name: prof.label };
                }
            }
        } else {
            return id;
        }
    };
    const getQualities = (elements) => {
        const qualitiesArray = [];

        for (const elem of elements) {
            for (const quality in qualities) {
                if (typeof elem.value !== "undefined") {
                    if (String(elem.value) === qualities[quality].value) {
                        qualitiesArray.push({
                            _id: qualities[quality].value,
                            name: qualities[quality].label,
                            color: qualities[quality].color
                        });
                    }
                } else if (typeof elem._id !== "undefined") {
                    if (String(elem._id) === qualities[quality].value) {
                        qualitiesArray.push({
                            _id: qualities[quality].value,
                            name: qualities[quality].label,
                            color: qualities[quality].color
                        });
                    }
                }
            }
        }
        return qualitiesArray;
    };

    const handleChange = (target) => {
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { profession, qualities } = data;
        const formaData = {
            ...data,
            profession: getProfessionById(profession),
            qualities: getQualities(qualities)
        };
        api.users.update(userId, formaData).then((data) => setUser(data));
        history.push(`/users/${userId}`);
    };
    if (isLoading) {
        return (
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-6 offset-md-3 shadow p-4">
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Имя"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                type="text"
                            />
                            <TextField
                                label="Электронная почта"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                            />
                            {data.profession ? (
                                <SelectField
                                    label="Выбери свою профессию"
                                    defaultOption={data.profession}
                                    options={professions}
                                    name="profession"
                                    onChange={handleChange}
                                    value={data.profession}
                                />
                            ) : (
                                console.log("....loading professions")
                            )}
                            <RadioField
                                options={[
                                    { name: "Male", value: "male" },
                                    { name: "Female", value: "female" },
                                    { name: "Other", value: "other" }
                                ]}
                                value={data.sex}
                                name="sex"
                                onChange={handleChange}
                                label="Выберите ваш пол"
                            />
                            {data.qualities ? (
                                <MultiSelectField
                                    options={qualities}
                                    defaultValue={data.qualities}
                                    onChange={handleChange}
                                    name="qualities"
                                    label="Выберите ваши качества"
                                />
                            ) : (
                                console.log("....loading qualities")
                            )}

                            <button
                                className="btn btn-primary w-100 mx-auto"
                                type="submit"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    } else {
        return <h1>Loading</h1>;
    }
}

EditUserPage.propTypes = {
    userId: PropTypes.string
};
