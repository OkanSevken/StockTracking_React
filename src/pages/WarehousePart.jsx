import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { FormField, Button, Segment, Header, Loader } from 'semantic-ui-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

export default function WarehousePart() {
  const [parts, setParts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loadingParts, setLoadingParts] = useState(true);
  const [loadingWarehouses, setLoadingWarehouses] = useState(true);
  const [existingMatches, setExistingMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchParts();
    fetchWarehouses();
    fetchExistingMatches();
  }, []);

  const fetchParts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/Part/GetAllParts');
      setParts(response.data);
      setLoadingParts(false);
    } catch (error) {
      console.error('Parçalar çekilirken hata:', error);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/Warehouse/GetAllWarehouse');
      setWarehouses(response.data);
      setLoadingWarehouses(false);
    } catch (error) {
      console.error('Depolar çekilirken hata:', error);
    }
  };

  const fetchExistingMatches = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/WarehousePart/GetAllWarehouseParts');
      setExistingMatches(response.data);
    } catch (error) {
      console.error('Mevcut eşleşmeler çekilirken hata:', error);
    }
  };

  const initialValues = {
    partId: '',
    warehouseId: '',
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    try {
      const existingMatch = existingMatches.find(
        (match) => match.partId === parseInt(values.partId) && match.warehouseId === parseInt(values.warehouseId)
      );

      if (existingMatch) {
        alert('Bu parça ve depo için zaten bir eşleşme mevcut.');
      } else {
        const response = await axios.post('http://localhost:5000/api/WarehousePart/CreateWarehouseParts', values);
        console.log('Başarılı:', response);
        alert('Depo parça eşleşmesi başarıyla oluşturuldu!');
        resetForm();
        navigate('/PartList');
        fetchExistingMatches(); 
      }
    } catch (error) {
      console.error('Hata:', error);
      if (error.response) {
        console.error('API\'den dönen hata:', error.response.data);
        alert('Hata: ' + error.response.data.title);
      } else {
        alert('Bir hata oluştu, lütfen tekrar deneyiniz.');
      }
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  if (loadingParts || loadingWarehouses || loading) {
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

  const warehouseOptions = warehouses.map((warehouse) => ({
    value: warehouse.id,
    label: warehouse.name,
  }));

  return (
    <Segment>
      <Header as="h2" textAlign="center">
         Parça-Depo Ataması 
      </Header>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="ui form" style={{ fontSize: '17px' }}>
              <FormField>
                <label>Parça Kodu</label>
                <Select
                  name="partId"
                  options={partOptions}
                  onChange={(option) => setFieldValue('partId', option.value)}
                  placeholder="Parça Kodu Seçin"
                />
              </FormField>
              <FormField>
                <label>Depo Adı</label>
                <Select
                  name="warehouseId"
                  options={warehouseOptions}
                  onChange={(option) => setFieldValue('warehouseId', option.value)}
                  placeholder="Depo Seçin"
                />
              </FormField>
              <Button type="submit" color="teal" fluid size="large" disabled={isSubmitting}>
                Ekle
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Segment>
  );
}
