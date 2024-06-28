import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { FormField, Button, Segment, Header, Loader } from "semantic-ui-react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';


export default function DropStock() {
  const [parts, setParts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingWarehouses, setFetchingWarehouses] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchPartCodes();
  }, []);

  const fetchPartCodes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/Part/GetAllParts"
      );

      const uniquePartsMap = new Map();

      response.data.forEach((part) => {
        if (!uniquePartsMap.has(part.id)) {
          uniquePartsMap.set(part.id, {
            id: part.id,
            partCode: part.partCode,
          });
        }
      });

      const uniqueParts = Array.from(uniquePartsMap.values());

      setParts(uniqueParts);
      setLoading(false);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    }
  };

  const fetchWarehousesForPart = async (selectedPartId, setFieldValue) => {
    setFetchingWarehouses(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/Warehouse/GetListWarehouseFromPart?id=${selectedPartId}`
      );
      setWarehouses(response.data);
      setFieldValue("partId", selectedPartId);
      setFetchingWarehouses(false);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
      setFetchingWarehouses(false);
    }
  };

  const initialValues = {
    partId: "",
    warehouseId: "",
    amount: "",
    price: "",
    invoice: false,
    movementType: "",
    description: "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/PartMovement/CreatePartMovements",
        values
      );
      console.log("Başarılı:", response);
      alert("Parça hareketi başarıyla oluşturuldu!");
      resetForm();
      navigate('/PartList'); 
    } catch (error) {
      console.error("Hata:", error);
      if (error.response) {
        console.error("API'den dönen hata:", error.response.data);
        alert("Hata: " + error.response.data.title);
      } else {
        alert("Bir hata oluştu, lütfen tekrar deneyiniz.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Loader active inline="centered" size="large">
        Yükleniyor...
      </Loader>
    );
  }

  return (
    <Segment>
      <Header as="h2" textAlign="center">
        Stok Çıkış
      </Header>
      <div style={{ maxWidth: "1400px", margin: "0 auto"}}>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="ui form" style={{ fontSize: '17px' }}>
              <FormField>
                <label>Parça Kodu</label>
                <Field
                  as="select"
                  name="partId"
                  onChange={(e) =>
                    fetchWarehousesForPart(e.target.value, setFieldValue)
                  }
                  value={values.partId}
                >
                  <option value="">Parça Kodu Seçin</option>
                  {parts.map((part) => (
                    <option key={part.id} value={part.id}>
                      {part.partCode}
                    </option>
                  ))}
                </Field>
              </FormField>
              <FormField>
                <label>Depo Adı</label>
                <Field
                  as="select"
                  name="warehouseId"
                  value={values.warehouseId}
                  onChange={(e) => setFieldValue("warehouseId", e.target.value)}
                >
                  <option value="">Depo Seçin</option>
                  {warehouses.map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.warehouseName}
                    </option>
                  ))}
                </Field>
                {fetchingWarehouses && <Loader active inline size="small" />}
              </FormField>
              <FormField>
                <label>Parça Adedi</label>
                <Field
                  name="amount"
                  type="number"
                  placeholder="Miktar"
                  style={{ width: "100%" }}
                />
              </FormField>
              <FormField>
                <label>Birim Fiyat</label>
                <Field
                  name="price"
                  type="number"
                  placeholder="Fiyat(Kdv Hariç)"
                  style={{ width: "100%" }}
                />
              </FormField>
              <FormField>
                <label>Fatura Var Mı?</label>
                <Field name="invoice" type="checkbox" />
              </FormField>
              <FormField>
                <label>Hareket Tipi</label>
                <Field
                  as="select"
                  name="movementType"
                  onChange={(e) =>
                    setFieldValue("movementType", e.target.value)
                  }
                  value={values.movementType}
                >
                  <option value="">Stok Hareketi Seçin</option>
                  <option value="Cikis">Stok Çıkışı</option>
                </Field>
              </FormField>
              <FormField>
                <label>Açıklama</label>
                <Field
                  name="description"
                  type="text"
                  placeholder="Açıklama"
                  style={{ width: "100%" }}
                />
              </FormField>
              <Button
                type="submit"
                color="teal"
                fluid
                size="large"
                disabled={isSubmitting}
              >
                Ekle
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Segment>
  );
}
