import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { FormField, Button, Segment, Header, Message, Loader } from "semantic-ui-react";
import axios from "axios";

export default function WarehouseAdd() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const initialValues = {
    name: "",
    address: ""
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/Warehouse/CreateWarehouses", values);
      if (response.status === 200) {
        setSuccess(true);
        resetForm();
      } else {
        setError("Depo oluşturulurken bir hata oluştu.");
      }
    } catch (error) {
      setError("Depo oluşturulurken bir hata oluştu.");
    } finally {
      setLoading(false);
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
        Yeni Depo Oluştur
      </Header>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className="ui form" style={{ fontSize: "17px" }}>
              <FormField>
                <label>Depo Adı</label>
                <Field name="name" placeholder="Depo Adı" />
              </FormField>
              <FormField>
                <label>Adres</label>
                <Field name="address" placeholder="Adres" />
              </FormField>
              <Button type="submit" color="teal" fluid size="large" disabled={isSubmitting}>
                Depo Oluştur
              </Button>
              {success && (
                <Message success header="Başarılı!" content="Depo başarıyla oluşturuldu." />
              )}
              {error && (
                <Message error header="Hata!" content={error} />
              )}
            </Form>
          )}
        </Formik>
      </div>
    </Segment>
  );
}
