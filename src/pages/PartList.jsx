import React, { useState, useEffect } from "react";
import { Table, Segment, Header, Loader, Dimmer, Icon, Menu, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import axios from "axios";


function PartList() {
  const [parts, setParts] = useState([]);
  const [openPartId, setOpenPartId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

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

  const handlePageChange = (direction) => {
    if (direction === 'next') {
      setCurrentPage((prevPage) => prevPage + 1);
    } else if (direction === 'prev') {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = parts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(parts.length / itemsPerPage);

  return (
    <Segment>
      <Header as="h2" textAlign="center">Parça Listesi</Header>
      <Dimmer active={loading}>
        <Loader>Loading</Loader>
      </Dimmer>
      <Table celled striped style={{ fontSize: '17px' }}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>İşlemler</Table.HeaderCell>
            <Table.HeaderCell>Kategori Adı</Table.HeaderCell>
            <Table.HeaderCell>Parça Adı</Table.HeaderCell>
            <Table.HeaderCell>Parça Kodu</Table.HeaderCell>
            <Table.HeaderCell>Stok Miktarı</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {currentItems.map((part) => (
            <Table.Row key={part.id}>
              <Table.Cell className="settings-cell">
                <div onClick={() => toggleMenu(part.id)}>
                  <Icon name='cog' className="settings-icon" />
                  {openPartId === part.id && (
                    <div className="settings-dropdown">
                      <Menu>
                        <Menu.Item as={Link} to={`/PartDetail/${part.id}`}>Detay</Menu.Item>
                        {/* <Menu.Item onClick={() => handleUpdateClick(part.id)}>Güncelle</Menu.Item>
                        <Menu.Item onClick={() => handleDeleteClick(part.id)}>Sil</Menu.Item> */}
                      </Menu>
                    </div>
                  )}
                </div>
              </Table.Cell>
              <Table.Cell>{part.categoryName}</Table.Cell>
              <Table.Cell>{part.name}</Table.Cell>
              <Table.Cell>{part.partCode}</Table.Cell>
              <Table.Cell style={{ color: part.stock < 50 ? 'red' : 'black' }}>
                {part.stock}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <Button as={Link} to="/CreatePart" color="green">
          Yeni Parça Kaydet
        </Button>
        <div>
          <Button onClick={() => handlePageChange('prev')} disabled={currentPage === 1}>
            Önceki
          </Button>
          <Button onClick={() => handlePageChange('next')} disabled={currentPage === totalPages}>
            Sonraki
          </Button>
        </div>
      </div>
    </Segment>
  );
}

export default PartList;
