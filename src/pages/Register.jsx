import React from "react";
import { Formik, Form, Field } from "formik";
import { FormField, Button, Grid } from 'semantic-ui-react';
import registerService from "../Services/registerService"; 
import { useNavigate ,Link} from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();

    const handleSubmit = async (values, { setSubmitting }) => {

            const response = await registerService.register(
                values.fullName,
                values.email,
                values.password,
            );
            console.log(response);
            alert("Kayıt başarıyla tamamlandı. Şimdi giriş yapabilirsiniz.");
            navigate('/Login');
    };

    return (
        <Grid
            textAlign="center"
            style={{ height: "100vh" }}
            verticalAlign="middle"
        >
            <Grid.Column style={{ maxWidth: 650 }}>
                <h2>Kayıt Ol</h2> <br/><br/>
                <Formik
                    initialValues={{ name: '', surname: '', usernameSurname: '', password: '' }}
                    onSubmit={handleSubmit}
                >
                    <Form className="ui form">
                        <FormField>
                            <label>Ad</label>
                            <Field name="fullName" type="text" />
                        </FormField>
                        <FormField>
                            <label>Email</label>
                            <Field name="email" type="text" />
                        </FormField>
                        <FormField>
                            <label>Şifre</label>
                            <Field name="password" type="password" />
                        </FormField>
                        <Button type="submit" color="teal" fluid size="large">
                            Kayıt Ol
                        </Button>
                        <p> Hesabınız var mı? <Link to="/Login">Giriş Yap</Link></p>
                    </Form>
                </Formik>
            </Grid.Column>
        </Grid>
    );
}