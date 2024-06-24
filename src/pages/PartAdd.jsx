import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { FormField, Button, Segment, Header, Loader } from 'semantic-ui-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function PartAdd() {
  const [models, setModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/PartBrandModel/GetAllPartBrandModels');
      setModels(response.data);
      setLoadingModels(false);
    } catch (error) {
      console.error('Modeller çekilirken hata:', error);
    }
  };

  const initialValues = {
    name: '',
    description: '',
    purchasePrice: 0,
    vat: 0,
    modelId: 0,
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/Part/CreateParts', values);
      console.log('Başarılı:', response);
      alert('Parça başarıyla oluşturuldu!');
      resetForm();
      navigate('/PartList'); 
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

  if (loadingModels || loading) {
    return (
      <Loader active inline="centered" size="large">
        Yükleniyor...
      </Loader>
    );
  }

  return (
    <Segment>
      <Header as="h2" textAlign="center">
        Parça Kaydet
      </Header>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="ui form" style={{ fontSize: '17px' }}>
              <FormField>
                <label>Parça Adı</label>
                <Field name="name" type="text" placeholder="Parça Adı" />
              </FormField>
              <FormField>
                <label>Açıklama</label>
                <Field name="description" type="text" placeholder="Açıklama" />
              </FormField>
              <FormField>
                <label>Alış Fiyatı</label>
                <Field name="purchasePrice" type="number" placeholder="Alış Fiyatı" />
              </FormField>
              <FormField>
                <label>KDV Yüzdesi</label>
                <Field name="vat" type="number" placeholder="KDV" />
              </FormField>
              <FormField>
                <label>Model</label>
                <Field
                  as="select"
                  name="modelId"
                  value={values.modelId}
                  onChange={(e) => setFieldValue('modelId', e.target.value)}
                >
                  <option value="">Marka Model Seçin</option>
                  {models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.brand} - {model.model} ({model.category})
                    </option>
                  ))}
                </Field>
              </FormField>
              <Button    type="submit" color="teal" fluid size="large" disabled={isSubmitting}>
                Ekle
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Segment>
  );
}
