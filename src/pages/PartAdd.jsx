import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { FormField, Button, Segment, Header } from 'semantic-ui-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function PartAdd() {
  const [carBrands, setCarBrands] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [partBrands, setPartBrands] = useState([]);
  const [partModels, setPartModels] = useState([]);
  const [partModelYears, setPartModelYears] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCarBrands();
    fetchPartBrands();
    fetchCategories();
  }, []);

  const fetchCarBrands = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/CarBrand/GetAllCarBrands');
      setCarBrands(response.data);
    } catch (error) {
      console.error('Araba markaları çekilirken hata:', error);
    }
  };

  const fetchCarModels = async (selectedBrandId, setFieldValue) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/CarModel/GetListCarModelsFromBrand?id=${selectedBrandId}`);
      setCarModels(response.data);
      setFieldValue('carBrandId', selectedBrandId);
    } catch (error) {
      console.error('Araba modelleri çekilirken hata:', error);
    }
  };

  const fetchPartBrands = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/PartBrand/GetAllPartBrands');
      setPartBrands(response.data);
    } catch (error) {
      console.error('Parça markaları çekilirken hata:', error);
    }
  };

  const fetchPartModels = async (selectedPartBrandId, setFieldValue) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/PartModel/GetListPartModelsFromBrand?id=${selectedPartBrandId}`);
      setPartModels(response.data);
      setFieldValue('partBrandId', selectedPartBrandId);
    } catch (error) {
      console.error('Parça modelleri çekilirken hata:', error);
    }
  };

  const fetchPartModelYears = async (selectedPartModelId, setFieldValue) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/PartModel/GetListPartModelsFromModel?id=${selectedPartModelId}`);
      setPartModelYears(response.data);
      setFieldValue('partModelId', selectedPartModelId);
    } catch (error) {
      console.error('Parça model yılları çekilirken hata:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/Category/GetAllCategory');
      setCategories(response.data);
    } catch (error) {
      console.error('Kategoriler çekilirken hata:', error);
    }
  };

  const initialValues = {
    name: '',
    partCode: '',
    purchasePrice: 0,
    vat: 0,
    categoryId: '',
    partModelId: 0,
    partModelYear: 0,
    carModelId: 0,
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    try {
      const requestData = {
        ...values,
        partModelId: parseInt(values.partModelId, 10),
        partModelYear: parseInt(values.partModelYear, 10),
        carModelId: parseInt(values.carModelId, 10),
        categoryId: parseInt(values.categoryId, 10)
      };

      const response = await axios.post('http://localhost:5000/api/Part/CreateParts', requestData);
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
                <label>Araba Markası</label>
                <Field
                  as="select"
                  name="carBrandId"
                  value={values.carBrandId}
                  onChange={(e) => {
                    const selectedBrandId = e.target.value;
                    setFieldValue('carBrandId', selectedBrandId);
                    setFieldValue('carModelId', '');
                    setFieldValue('partBrandId', '');
                    setFieldValue('partModelId', '');
                    fetchCarModels(selectedBrandId, setFieldValue);
                  }}
                >
                  <option value="">Araba Markası Seçin</option>
                  {carBrands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.brandName}
                    </option>
                  ))}
                </Field>
              </FormField>
              <FormField>
                <label>Araba Modeli</label>
                <Field
                  as="select"
                  name="carModelId"
                  value={values.carModelId}
                  onChange={(e) => {
                    const selectedModelId = e.target.value;
                    setFieldValue('carModelId', selectedModelId);
                    setFieldValue('partBrandId', '');
                    setFieldValue('partModelId', '');
                    fetchPartBrands(selectedModelId, setFieldValue);
                  }}
                >
                  <option value="">Araba Modeli Seçin</option>
                  {carModels.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.modelName}
                    </option>
                  ))}
                </Field>
              </FormField>
              <FormField>
                <label>Parça Markası</label>
                <Field
                  as="select"
                  name="partBrandId"
                  value={values.partBrandId}
                  onChange={(e) => {
                    const selectedPartBrandId = e.target.value;
                    setFieldValue('partBrandId', selectedPartBrandId);
                    setFieldValue('partModelId', '');
                    fetchPartModels(selectedPartBrandId, setFieldValue);
                  }}
                >
                  <option value="">Parça Markası Seçin</option>
                  {partBrands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.brandName}
                    </option>
                  ))}
                </Field>
              </FormField>
              <FormField>
                <label>Parça Modeli</label>
                <Field
                  as="select"
                  name="partModelId"
                  value={values.partModelId}
                  onChange={(e) => {
                    const selectedPartModelId = e.target.value;
                    setFieldValue('partModelId', selectedPartModelId);
                    fetchPartModelYears(selectedPartModelId, setFieldValue);
                  }}
                >
                  <option value="">Parça Modeli Seçin</option>
                  {partModels.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.modelName}
                    </option>
                  ))}
                </Field>
              </FormField>
              <FormField>
                <label>Parça Modeli Yılı</label>
                <Field
                  as="select"
                  name="partModelYear"
                  value={values.partModelYear}
                  onChange={(e) => setFieldValue('partModelYear', parseInt(e.target.value, 10))}
                >
                  <option value="">Parça Model Yılı Seçin</option>
                  {partModelYears.map((model) => (
                    <option key={model.id} value={model.year}>
                      {model.year}
                    </option>
                  ))}
                </Field>
              </FormField>
              <FormField>
                <label>Kategori</label>
                <Field
                  as="select"
                  name="categoryId"
                  value={values.categoryId}
                  onChange={(e) => setFieldValue('categoryId', e.target.value)}
                >
                  <option value="">Kategori Seçin</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.categoryName}
                    </option>
                  ))}
                </Field>
              </FormField>
              <FormField>
                <label>Parça Adı</label>
                <Field name="name" type="text" placeholder="Parça Adı" />
              </FormField>
              <FormField>
                <label>Parça Kodu</label>
                <Field name="partCode" type="text" placeholder="Parça Kodu" />
              </FormField>
              <FormField>
                <label>Alış Fiyatı</label>
                <Field name="purchasePrice" type="number" placeholder="Alış Fiyatı" />
              </FormField>
              <FormField>
                <label>KDV Yüzdesi</label>
                <Field name="vat" type="number" placeholder="KDV" />
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
