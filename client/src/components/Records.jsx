import { useState, useEffect } from "react";
import "../style/home.css";
import { Card, Input, Button, Modal, Select } from "antd";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { Link } from "react-router-dom";
import {
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import AddCar from "./AddCar";
import AddPerson from "./AddPerson";
import Meta from "antd/es/card/Meta";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

const UPDATE_CAR = gql`
  mutation UpdateCar($carId: String!, $car: AddCarType) {
    updateCar(carId: $carId, car: $car) {
      make
      model
      id
    }
  }
`;

const DELETE_CAR = gql`
  mutation DeleteCar($carId: String!) {
    deleteCar(carId: $carId) {
      make
      model
      id
    }
  }
`;

const UPDATE_PERSON = gql`
  mutation Update($personId: String!, $person: AddPersonType) {
    updatePerson(personId: $personId, person: $person) {
      firstName
      lastName
      id
    }
  }
`;

const DELETE_PERSON = gql`
  mutation Delete($personId: String!) {
    deletePerson(personId: $personId) {
      firstName
      id
    }
  }
`;

export default function Records() {
  const [peopleList, setPeopleList] = useState(null);
  const [carList, setCarList] = useState(null);
  const [editingCarId, setEditingCarId] = useState(null);
  const [carFormData, setCarFormData] = useState({});
  const [editingPersonId, setEditingPersonId] = useState(null);
  const [personFormData, setPersonFormData] = useState({});
  const [selectedPerson, setSelectedPerson] = useState("");

  useEffect(() => {
    fetchPeopleAndCars();
  }, []);

  const fetchPeopleAndCars = () => {
    client
      .query({
        query: gql`
          query GetAllPeople {
            getAllPerson {
              id
              firstName
              lastName
            }
          }
        `,
      })
      .then((result) => {
        setPeopleList(result.data.getAllPerson);
      });

    client
      .query({
        query: gql`
          query GetAllCars {
            getAllCars {
              id
              year
              make
              model
              price
              personId
            }
          }
        `,
      })
      .then((result) => {
        setCarList(result.data.getAllCars);
      });
  };

  const handleCarInputChange = (e) => {
    const { name, value } = e.target;
    setCarFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePersonInputChange = (e) => {
    const { name, value } = e.target;
    setPersonFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCarAdded = (newCar) => {
    setCarList((prevCarList) => [...prevCarList, newCar]);
  };

  const handlePersonAdded = (newPerson) => {
    console.log(newPerson);
    setPeopleList((prevPeopleList) => [...prevPeopleList, newPerson]);
  };

  const handleEditCar = (car) => {
    setEditingCarId(car.id);
    setCarFormData({ ...car });
    setSelectedPerson(car.personId);
  };

  const handleEditPerson = (person) => {
    setEditingPersonId(person.id);
    setPersonFormData({ ...person });
  };

  const handleCancelCarEdit = () => {
    setEditingCarId(null);
    setCarFormData({});
  };

  const handleCancelPersonEdit = () => {
    setEditingPersonId(null);
    setPersonFormData({});
  };

  const handlePersonChange = (value) => {
    setSelectedPerson(value);
    setCarFormData((prev) => ({ ...prev, personId: value }));
  };

  const handleSaveCar = () => {
    client
      .mutate({
        mutation: UPDATE_CAR,
        variables: {
          carId: carFormData.id,
          car: {
            make: carFormData.make,
            model: carFormData.model,
            year: Number(carFormData.year),
            price: parseFloat(carFormData.price),
            personId: selectedPerson,
          },
        },
      })
      .then((result) => {
        console.log("Car updated successfully:", result.data.updateCar);
        setCarList((prevCarList) =>
          prevCarList.map((car) =>
            car.id === carFormData.id
              ? { ...car, ...carFormData, personId: selectedPerson }
              : car
          )
        );
        setEditingCarId(null);
        setCarFormData({});
        setSelectedPerson("");
      })
      .catch((error) => {
        console.error("Error updating car:", error);
      });
  };

  const handleSavePerson = () => {
    console.log(personFormData);
    client
      .mutate({
        mutation: UPDATE_PERSON,
        variables: {
          personId: personFormData.id,
          person: {
            firstName: personFormData.firstName,
            lastName: personFormData.lastName,
          },
        },
      })
      .then((result) => {
        console.log("Person updated successfully:", result.data.updatePerson);
        setPeopleList((prevPeopleList) =>
          prevPeopleList.map((person) =>
            person.id === personFormData.id
              ? { ...person, ...personFormData }
              : person
          )
        );
        setEditingPersonId(null);
        setPersonFormData({});
      })
      .catch((error) => {
        console.error("Error updating person:", error);
      });
  };

  const handleDeleteCar = (car) => {
    client
      .mutate({
        mutation: DELETE_CAR,
        variables: {
          carId: car.id,
        },
      })
      .then((result) => {
        console.log("Car deleted successfully:", result.data.deleteCar);
        setCarList((prevCarList) => prevCarList.filter((c) => c.id !== car.id));
      })
      .catch((error) => {
        console.error("Error deleting car:", error);
      });
  };

  const handleDeletePerson = (person) => {
    Modal.confirm({
      title: "Are you sure you want to delete this person?",
      content: "This action cannot be undone.",
      onOk() {
        client
          .mutate({
            mutation: DELETE_PERSON,
            variables: {
              personId: person.id,
            },
          })
          .then((result) => {
            console.log(
              "Person deleted successfully:",
              result.data.deletePerson
            );
            setPeopleList((prevPeopleList) =>
              prevPeopleList.filter((p) => p.id !== person.id)
            );
            setCarList((prevCarList) =>
              prevCarList.filter((car) => car.personId !== person.id)
            );
          })
          .catch((error) => {
            console.error("Error deleting person:", error);
          });
      },
    });
  };

  return (
    <>
      <AddPerson onPersonAdded={handlePersonAdded} />
      {peopleList && peopleList.length == 0 ? (
        ""
      ) : (
        <AddCar onCarAdded={handleCarAdded} />
      )}
      <section>
        <div className="section-heading">
          <h2>
            <span>Records</span>
          </h2>
        </div>

        {peopleList &&
          peopleList.length !== 0 &&
          peopleList.map((person) => {
            return (
              <Card
                key={person.id}
                style={{ margin: 16 }}
                actions={
                  editingPersonId === person.id
                    ? [
                        <SaveOutlined key="save" onClick={handleSavePerson} />,
                        <CloseOutlined
                          key="cancel"
                          onClick={handleCancelPersonEdit}
                        />,
                      ]
                    : [
                        <EditOutlined
                          key="edit"
                          onClick={() => handleEditPerson(person)}
                        />,
                        <DeleteOutlined
                          key="delete"
                          onClick={() => handleDeletePerson(person)}
                          style={{ color: "red" }}
                        />,
                      ]
                }
                title={
                  editingPersonId === person.id ? (
                    <div className="form-wrapper">
                      <Input
                        type="text"
                        name="firstName"
                        onChange={(e) => handlePersonInputChange(e)}
                        value={personFormData.firstName}
                      />
                      <Input
                        type="text"
                        name="lastName"
                        onChange={(e) => handlePersonInputChange(e)}
                        value={personFormData.lastName}
                      />
                    </div>
                  ) : (
                    `${person.firstName} ${person.lastName}`
                  )
                }
              >
                {carList &&
                  carList
                    .filter((car) => car.personId === person.id)
                    .map((car) => (
                      <div key={car.id}>
                        {editingCarId === car.id ? (
                          <Card style={{ marginTop: 16 }} type="inner">
                            <Input
                              name="year"
                              value={carFormData.year}
                              onChange={handleCarInputChange}
                              placeholder="Year"
                              style={{ marginBottom: 8 }}
                            />
                            <Input
                              name="make"
                              value={carFormData.make}
                              onChange={handleCarInputChange}
                              placeholder="Make"
                              style={{ marginBottom: 8 }}
                            />
                            <Input
                              name="model"
                              value={carFormData.model}
                              onChange={handleCarInputChange}
                              placeholder="Model"
                              style={{ marginBottom: 8 }}
                            />
                            <Input
                              name="price"
                              value={carFormData.price}
                              onChange={handleCarInputChange}
                              placeholder="Price"
                              style={{ marginBottom: 8 }}
                            />
                            <Select
                              style={{ width: "100%", marginBottom: 8 }}
                              value={selectedPerson}
                              onChange={handlePersonChange}
                              placeholder="Select a person"
                            >
                              {peopleList.map((p) => (
                                <Select.Option key={p.id} value={p.id}>
                                  {p.firstName} {p.lastName}
                                </Select.Option>
                              ))}
                            </Select>
                            <Button
                              type="primary"
                              icon={<SaveOutlined />}
                              onClick={handleSaveCar}
                              style={{ marginRight: 8 }}
                            >
                              Save
                            </Button>
                            <Button
                              icon={<CloseOutlined />}
                              onClick={handleCancelCarEdit}
                            >
                              Cancel
                            </Button>
                          </Card>
                        ) : (
                          <Card
                            title={`${car.year} ${car.make} ${car.model} -> $${car.price}`}
                            style={{ marginTop: 16 }}
                            type="inner"
                            actions={[
                              <EditOutlined
                                key="edit"
                                onClick={() => handleEditCar(car)}
                              />,
                              <DeleteOutlined
                                key="delete"
                                onClick={() => handleDeleteCar(car)}
                                style={{ color: "red" }}
                              />,
                            ]}
                          />
                        )}
                      </div>
                    ))}
                <Meta
                  description={<Link to={`/person/${person.id}`}>Learn More</Link>}
                  style={{ marginTop: 16 }}
                />
              </Card>
            );
          })}
      </section>
    </>
  );
}
