import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link, useHistory} from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Map, Marker, TileLayer } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import api from "../../services/api";
import ibge from "../../services/ibge";
import logo from "../../assets/logo.svg";
import "./styles.css";

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface IbgeUf {
  sigla: string;
}

interface IbgeMunicipios {
  nome: string;
}

interface Position {
  0: number;
  1: number;
}

const Home: React.FC = () => {
  const [initialPosition, setInitialPosition] = useState<Position>([0, 0]);
  const [selectedPosition, setSelectedPosition] = useState<Position>([0, 0]);
  const [items, setItems] = useState<Array<Item>>([]);
  const [ibgeUFs, setIbgeUFs] = useState<Array<IbgeUf>>([]);
  const [ibgeCities, setIbgeCities] = useState<Array<IbgeMunicipios>>([]);
  const [selectedUF, setSelectedUF] = useState("0");
  const [selectedCity, setSelectedCity] = useState("0");
  const [selectedItemsIds, setSelectedItemsIds] = useState<Array<Number>>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
  });

  const history = useHistory()

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
      setInitialPosition([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  useEffect(() => {
    api.get("items").then((response) => {
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    ibge.get("estados").then((response) => {
      setIbgeUFs(response.data);
    });
  }, []);

  useEffect(() => {
    if (selectedUF === "0") {
      return;
    }
    ibge.get(`estados/${selectedUF}/municipios`).then((response) => {
      setIbgeCities(response.data);
    });
  }, [selectedUF]);

  const handleMapClick = (event: LeafletMouseEvent) => {
    setSelectedPosition([event.latlng.lat, event.latlng.lng]);
  };

  const handleSelectedUF = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedUF(event.target.value);
  };

  const handleSelectedCity = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(event.target.value);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectItem = (id: Number) => {
    const alreadySelected = selectedItemsIds.findIndex(
      (itemId) => itemId === id
    );
    if (alreadySelected >= 0) {
      const filteredItemsIds = selectedItemsIds.filter(
        (itemId) => itemId !== id
      );
      setSelectedItemsIds(filteredItemsIds);
    } else {
      setSelectedItemsIds([...selectedItemsIds, id]);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const data = {
      name: formData.name,
      email: formData.email,
      whatsapp: formData.whatsapp,
      uf: selectedUF,
      city: selectedCity,
      latitude: selectedPosition[0],
      longitude: selectedPosition[1],
      items: selectedItemsIds,
    };
    await api.post("points", data);
    alert("Ponto de coleta criado!")
    history.push("/")
  };

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <span>
            <FiArrowLeft />
          </span>
          Voltar para home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>
          Cadastro de ponto do
          <br /> coleta
        </h1>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="text"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map
            center={[initialPosition[0], initialPosition[1]]}
            zoom={15}
            onclick={handleMapClick}
          >
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[selectedPosition[0], selectedPosition[1]]} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select
                name="uf"
                id="uf"
                value={selectedUF}
                onChange={handleSelectedUF}
              >
                <option value="0">Selecione seu estado</option>
                {ibgeUFs.map((uf) => (
                  <option key={uf.sigla} value={uf.sigla}>
                    {uf.sigla}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                name="city"
                id="uf"
                value={selectedCity}
                onChange={handleSelectedCity}
              >
                <option value="0">Selecione sua cidade</option>
                {ibgeCities.map((city) => (
                  <option key={city.nome} value={city.nome}>
                    {city.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Itens de coleta</h2>
            <span>Selecione um ou mais itens de coleta</span>
          </legend>
          <ul className="items-grid">
            {items.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSelectItem(item.id)}
                className={selectedItemsIds.includes(item.id) ? "selected" : ""}
              >
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>
        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
};

export default Home;
