import React, { useState, useEffect } from "react";
import { Table, Segment, Header, Loader, Dimmer, Icon, Menu,Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import axios from "axios";

function PartList() {
  const [parts, setParts] = useState([]);
  const [openPartId, setOpenPartId] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/Part/GetAllParts");
      setParts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    }
  };

  const toggleMenu = (id) => {
    setOpenPartId(openPartId === id ? null : id);
  };

  const handleUpdateClick = (id) => {
    console.log("Güncelle: ", id);
    // Güncelleme işlemleri burada yapılabilir
  };

  const handleDeleteClick = (id) => {
    console.log("Sil: ", id);
    // Silme işlemleri burada yapılabilir
  };

  return (
    <Segment>
      <Header as="h2" textAlign="center">Parça Listesi</Header>
      <Dimmer active={loading}>
        <Loader>Loading</Loader>
      </Dimmer>
      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>İşlemler</Table.HeaderCell>
            <Table.HeaderCell>Parça Adı</Table.HeaderCell>
            <Table.HeaderCell>Açıklama</Table.HeaderCell>
            <Table.HeaderCell>Marka Adı</Table.HeaderCell>
            <Table.HeaderCell>Model Adı</Table.HeaderCell>
            <Table.HeaderCell>Alış Fiyatı</Table.HeaderCell>
            <Table.HeaderCell>Satış Fiyatı</Table.HeaderCell>
            <Table.HeaderCell>KDV Oranı</Table.HeaderCell>
            <Table.HeaderCell>Ödenecek KDV Tutarı</Table.HeaderCell>
            <Table.HeaderCell>Stok Miktarı</Table.HeaderCell>
            <Table.HeaderCell>Kar</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {parts.map((part) => (
            <Table.Row key={part.id}>
              <Table.Cell>
                <div onClick={() => toggleMenu(part.id)}>
                  <Icon name='cog' />
                  {openPartId === part.id && (
                    <Menu vertical>
                      <Menu.Item as={Link} to={`/parts/${part.id}`}>Detay</Menu.Item>
                      <Menu.Item onClick={() => handleUpdateClick(part.id)}>Güncelle</Menu.Item>
                      <Menu.Item onClick={() => handleDeleteClick(part.id)}>Sil</Menu.Item>
                    </Menu>
                  )}
                </div> 
              </Table.Cell>
              <Table.Cell>{part.name}</Table.Cell>
              <Table.Cell>{part.description}</Table.Cell>
              <Table.Cell>{part.brandName}</Table.Cell>
              <Table.Cell>{part.modelName}</Table.Cell>
              <Table.Cell>{part.purchasePrice}</Table.Cell>
              <Table.Cell>{part.salePrice}</Table.Cell>
              <Table.Cell>{part.vat}%</Table.Cell>
              <Table.Cell>{part.vatPaid}</Table.Cell>
              <Table.Cell style={{ color: part.stock < 50 ? 'red' : 'black' }}>
                {part.stock}
              </Table.Cell>
              <Table.Cell>{part.profit}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <div style={{ marginTop: "20px", textAlign: "right" }}>
        <Button as={Link} to="/appointments/add" color="green">
          Parça Kaydet
        </Button>
      </div>
    </Segment>
    
    
  );
}

export default PartList;
