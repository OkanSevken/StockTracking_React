import React, { useState, useEffect, forwardRef } from "react";
import { Table, Segment, Header, Loader, Dimmer, Button, Input, Icon, Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import axios from "axios";

// Dimmer component wrapped with forwardRef
const CustomDimmer = forwardRef((props, ref) => (
  <Dimmer {...props} ref={ref} />
));

function LowStockPartsList({ itemsPerPage = 3 }) {
  const [parts, setParts] = useState([]);
  const [warehouseParts, setWarehouseParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [openPartId, setOpenPartId] = useState(null);

  useEffect(() => {
    fetchParts();
    fetchWarehouseParts();
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

  const fetchWarehouseParts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/WarehousePart/GetAllWarehouseParts");
      setWarehouseParts(response.data);
    } catch (error) {
      console.error("Depo parçaları veri çekme hatası:", error);
    }
  };

  const getTotalStockForPart = (partId) => {
    return warehouseParts
      .filter((warehousePart) => warehousePart.partId === partId)
      .reduce((total, warehousePart) => total + warehousePart.stockQuantity, 0);
  };

  const getWarehouseStockDetailsForPart = (partId) => {
    return warehouseParts
      .filter((warehousePart) => warehousePart.partId === partId)
      .map((warehousePart) => ({
        warehouseName: warehousePart.warehouseName,
        stockQuantity: warehousePart.stockQuantity
      }));
  };

  const handlePageChange = (direction) => {
    if (direction === 'next') {
      setCurrentPage((prevPage) => prevPage + 1);
    } else if (direction === 'prev') {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const toggleMenu = (partId) => {
    setOpenPartId(openPartId === partId ? null : partId);
  };

  const lowStockParts = parts.filter((part) => getTotalStockForPart(part.id) < 50);
  const filteredParts = lowStockParts.filter((part) =>
    part.partCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredParts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredParts.length / itemsPerPage);

  return (
    <Segment>
      <Header as="h2" textAlign="center">Düşük Stok Listesi</Header>
      <Input
        placeholder="Parça koduna göre ara..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: '20px' }}
      />
      <CustomDimmer active={loading}>
        <Loader>Loading</Loader>
      </CustomDimmer>
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
              <Table.Cell>
                <strong style={{ color: 'red' }}>
                  Toplam: {getTotalStockForPart(part.id)} (Düşük Stok)
                </strong>
                <br /><br />
                {getWarehouseStockDetailsForPart(part.id).map((detail, index) => (
                  <div key={index} style={{ color: detail.stockQuantity < 50 ? 'red' : 'black' }}>
                    <br />{detail.warehouseName}: {detail.stockQuantity}
                  </div>
                ))}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <Button onClick={() => handlePageChange('prev')} disabled={currentPage === 1}>
          Önceki
        </Button>
        <Button onClick={() => handlePageChange('next')} disabled={currentPage === totalPages}>
          Sonraki
        </Button>
      </div>
    </Segment>
  );
}

export default LowStockPartsList;
