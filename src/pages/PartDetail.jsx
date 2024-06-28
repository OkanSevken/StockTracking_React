import React, { useState, useEffect } from "react";
import { Segment, Header, Loader, Dimmer, Button, Table, Modal } from "semantic-ui-react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function PartDetail() {
  const { id } = useParams();
  const [part, setPart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); 

  useEffect(() => {
    fetchPartDetails();
  }, []);

  const fetchPartDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/Part/GetListPart?id=${id}`);
      setPart(response.data[0]);
      setLoading(false);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
      setLoading(false);
    }
  };

  const handleUpdateClick = () => {
    console.log("Güncelle: ", id);
    window.location.href = `/UpdatePart/${id}`;
  };

  const handleDeleteClick = () => {
    setDeleteModalOpen(true); // Modalı aç
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/Part/DeleteParts`, { id: id }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("Silme işlemi başarılı:", response);
      setDeleteModalOpen(false);
      window.location.href = "/PartList";
    } catch (error) {
      console.error("Silme hatası:", error);
      setDeleteModalOpen(false); 
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false); 
  };

  if (loading) {
    return (
      <Segment>
        <Dimmer active>
          <Loader>Loading</Loader>
        </Dimmer>
      </Segment>
    );
  }

  if (!part) {
    return (
      <Segment>
        <Header as="h2" textAlign="center">Parça Detayı Bulunamadı</Header>
      </Segment>
    );
  }

  return (
    <Segment>
      <Header as="h2" textAlign="center">Parça Detayı</Header>
      <Table definition>
        <Table.Body>
          <Table.Row>
            <Table.Cell width={4}><strong>Parça Adı:</strong></Table.Cell>
            <Table.Cell>{part.name}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell><strong>Parça Kodu:</strong></Table.Cell>
            <Table.Cell>{part.partCode}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell><strong>Kategori Adı:</strong></Table.Cell>
            <Table.Cell>{part.categoryName}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell><strong>Araba Marka Adı:</strong></Table.Cell>
            <Table.Cell>{part.carBrandName}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell><strong>Araba Model Adı:</strong></Table.Cell>
            <Table.Cell>{part.carModelName}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell><strong>Parça Marka Adı:</strong></Table.Cell>
            <Table.Cell>{part.partBrandName}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell><strong>Parça Model Adı:</strong></Table.Cell>
            <Table.Cell>{part.partModelName}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell><strong>Parça Model Yılı:</strong></Table.Cell>
            <Table.Cell>{part.partModelYear}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell><strong>Stok Miktarı:</strong></Table.Cell>
            <Table.Cell style={{ color: part.stock < 50 ? 'red' : 'black' }}>
              {part.stock}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell><strong>Alış Fiyatı:</strong></Table.Cell>
            <Table.Cell>{part.purchasePrice}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell><strong>Satış Fiyatı:</strong></Table.Cell>
            <Table.Cell>{part.salePrice}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell><strong>KDV Oranı:</strong></Table.Cell>
            <Table.Cell>{part.vat}%</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell><strong>Ödenecek KDV Tutarı :</strong></Table.Cell>
            <Table.Cell>{part.vatPaid}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell><strong>Kar:</strong></Table.Cell>
            <Table.Cell>{part.profit}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Button as={Link} to="/PartList" color="blue">Parça Listesi</Button>
        <Button onClick={handleUpdateClick} color="yellow">Güncelle</Button>
        <Button onClick={handleDeleteClick} color="red">Sil</Button>
      </div>

      <Modal open={deleteModalOpen} onClose={cancelDelete} size="small">
        <Header content="Parça Silme Onayı" />
        <Modal.Content>
          <p>Bu parçayı silmek istediğinizden emin misiniz?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={cancelDelete}>
            Hayır
          </Button>
          <Button positive onClick={confirmDelete}>
            Evet
          </Button>
        </Modal.Actions>
      </Modal>
    </Segment>
  );
}

export default PartDetail;
