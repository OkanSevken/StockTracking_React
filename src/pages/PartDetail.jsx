import React, { useState, useEffect } from "react";
import { Segment, Header, Loader, Dimmer, Button, Table } from "semantic-ui-react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function PartDetail() {
  const { id } = useParams(); // URL'den parametre olarak gelen parça id'sini alıyoruz
  const [part, setPart] = useState(null); // Parça detayları için state
  const [loading, setLoading] = useState(true); // Veri yüklenme durumu için state

  useEffect(() => {
    fetchPartDetails();
  }, []);

  const fetchPartDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/Part/GetListPart?id=${id}`);
      setPart(response.data[0]); // API'den gelen parça detaylarını state'e kaydediyoruz
      setLoading(false); // Veri yükleme tamamlandı
    } catch (error) {
      console.error("Veri çekme hatası:", error);
      setLoading(false); // Hata durumunda da loading durumunu false yapmalıyız
    }
  };

  const handleUpdateClick = () => {
    console.log("Güncelle: ", id);
    // Güncelleme işlemleri burada yapılabilir, örneğin güncelleme sayfasına yönlendirme
    // Programatik olarak yönlendirme örneği
    window.location.href = `/UpdatePart/${id}`;
  };

  const handleDeleteClick = () => {
    console.log("Sil: ", id);
    // Silme işlemleri burada yapılabilir
    // Örnek olarak axios ile silme işlemi yapabilirsiniz
    axios.delete(`http://localhost:5000/api/Part/DeletePart?id=${id}`)
      .then(response => {
        console.log("Silme işlemi başarılı:", response);
        // Silme işlemi başarılı ise kullanıcıyı parça listesine yönlendirme
        window.location.href = "/PartList";
      })
      .catch(error => {
        console.error("Silme hatası:", error);
      });
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

  // Eğer parça bulunamadıysa veya hata oluşursa
  if (!part) {
    return (
      <Segment>
        <Header as="h2" textAlign="center">Parça Detayı Bulunamadı</Header>
      </Segment>
    );
  }

  // Parça bulunduysa, detayları göster
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
    </Segment>
  );
}

export default PartDetail;
