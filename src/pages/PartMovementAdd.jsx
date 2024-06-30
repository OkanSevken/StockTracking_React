import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { FormField, Button, Segment, Header, Loader } from "semantic-ui-react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Select from "react-select";

export default function PartMovementAdd() {
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
      const warehouseOptions = response.data.map((warehouse) => ({
        value: warehouse.id,
        label: warehouse.warehouseName,
      }));
      setWarehouses(warehouseOptions);
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
    movementType: "Giris",
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

  const partOptions = parts.map((part) => ({
    value: part.id,
    label: part.partCode,
  }));

  return (
    <Segment>
      <Header as="h2" textAlign="center">
        Stok Giriş
      </Header>
      <div style={{ maxWidth: "1400px", margin: "0 auto"}}>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="ui form" style={{ fontSize: '17px' }}>
              <FormField>
                <label>Parça Kodu</label>
                <Select
                  name="partId"
                  options={partOptions}
                  onChange={(option) => fetchWarehousesForPart(option.value, setFieldValue)}
                  placeholder="Parça Kodu Seçin"
                />
              </FormField>
              <FormField>
                <label>Depo Adı</label>
                <Select
                  name="warehouseId"
                  options={warehouses}
                  onChange={(option) => setFieldValue("warehouseId", option.value)}
                  placeholder="Depo Seçin"
                  isDisabled={fetchingWarehouses}
                />
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
