import React, { useState, useEffect, createContext, useContext } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
// nodejs library that concatenates classes
import classnames from "classnames";
// reactstrap components
import {
    Card,
    CardHeader,
    CardBody,
    Container,
    Row,
    Col,
    Button,
    Form,
    FormGroup,
    Label,
    Input
} from "reactstrap";
// core components
import MenuHeader from "components/Headers/MenuHeader.js";
// single loading success page component
import SingleLoadingSuccess from "views/pages/examples/SLSuccess.js";
import SingleLoadingFail from "views/pages/examples/SLFail.js";

import { publicFetch } from '../../../util/fetcher.js';
import { AuthContext } from '../../../store/auth.js';
import { NETWORK_PROVIDERS, PRODUCT_TYPE } from "util/config.js";

function SingleLoading() {
    const { authState, logout } = useContext(AuthContext);
    const username = authState.userInfo?.username;
    const user_id = authState.userInfo?.id;

    const [formData, setFormData] = useState({
        loadFor: "Myself",
        networkProvider: "",
        type: "",
        product_id: "",
        mobileNumber: "08312346578",
    });
    const mobileNumbers = {
        'Myself': '0830012345',
        '0740034141': '0740034141',
        '0840000000': '0840000000',
        '0900023826': '0900023826',
        '0830012300': '0830012300',
        '0830012345': '0830012345',
        '0850012300': '0850012300',
        '0850012345': '0850012345',
        '0850200005': '0850200005',
        '0820012300': '0820012300',
        '0820012301': '0820012301',
        '0820012345': '0820012345',
        'WrongNumberExample': '0820012312123',
    }
    const [response, setResponse] = useState({ mobileNumber: 'testing....' });

    const [showing, setShowing] = useState("main"); //main, success, fail
    const [errStatus, setErrStatus] = useState("");

    useEffect(() => {
        let mobileNumber = mobileNumbers[formData.loadFor]
        console.log(mobileNumber)
        setFormData({ ...formData, mobileNumber: mobileNumber })
    }, [formData.loadFor])


    const onChangeInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async () => {
        try {
            // const { data } = await publicFetch.post('/single-loading/transaction', { user_id, data: formData });
            // const { data } = await publicFetch.post('/bltelecoms/bundle/sales', { mobilenumber: formData.mobileNumber });
            const { data } = await publicFetch.post('/single-loading/transaction', { mobilenumber: formData.mobileNumber, user_id });

            if (data.result) {
                setResponse(data.data)
                setShowing("success");
            } else {
                setResponse(data.message)
                setShowing("fail");
            }
        } catch (error) {
            console.log('error =>', error.message);
            setResponse(error.message)
            setShowing("fail");
        }
    };

    const [products, setProducts] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await publicFetch.post('/bltelecoms/bundle/products', {});
                if (data.result)
                    setProducts(data.data)
                else
                    console.log(data.message)
            } catch (error) {
                console.log(error.message)
            }
        })();

    }, [])


    return (
        <>
            {showing === "main" &&
                <>
                    <MenuHeader
                        title={username}
                    />
                    <Container className="text-center pb-4 px-2 px-lg-8" style={{ marginTop: '-10rem' }}>
                        <Card className="card-pricing bg-gradient-success zoom-in shadow-lg rounded border-0 text-center mb-4 mx-4">
                            <CardBody className="px-lg-6 pb-2">
                                {/* <span>{JSON.stringify(formData)}</span> */}
                                <Form>
                                    <FormGroup className="row">
                                        <Label
                                            className="form-control-label text-left"
                                            htmlFor="example-text-input"
                                            md="3"
                                        >
                                            Load for
                                        </Label>
                                        <Col md="9">
                                            <Input id="exampleFormControlSelect1" type="select" placeholder="Select Mobile Number" name="loadFor" value={formData.loadFor} onChange={(e) => onChangeInput(e)}>
                                                {
                                                    Object.keys(mobileNumbers).map((key, index) => <option value={key} key={index}>{key}</option>)
                                                }
                                            </Input>
                                        </Col>
                                    </FormGroup>
                                </Form>
                                <Form>
                                    <FormGroup className="row">
                                        <Label
                                            className="form-control-label text-left"
                                            htmlFor="example-text-input"
                                            md="3"
                                        >
                                            Network
                                        </Label>
                                        <Col md="9">
                                            <Input id="exampleFormControlSelect2" type="select" placeholder="Select Network" name="networkProvider" onChange={(e) => onChangeInput(e)}>
                                                <option>---</option>
                                                {NETWORK_PROVIDERS.map((item, index) => <>
                                                    <option value={item.id} key={index}>{item.name}</option>
                                                </>)}
                                            </Input>
                                        </Col>
                                    </FormGroup>
                                </Form>
                                <Form>
                                    <FormGroup className="row">
                                        <Label
                                            className="form-control-label text-left"
                                            htmlFor="example-text-input"
                                            md="3"
                                        >
                                            Type
                                        </Label>
                                        <Col md="9">
                                            <Input id="exampleFormControlSelect3" type="select" name="type" value={formData.type} onChange={(e) => onChangeInput(e)}>
                                                <option>---</option>
                                                {PRODUCT_TYPE.map((item, index) => <>
                                                    <option value={item.id} key={index}>{item.name}</option>
                                                </>)}
                                            </Input>
                                        </Col>
                                    </FormGroup>
                                </Form>
                                <Form>
                                    <FormGroup className="row">
                                        <Label
                                            className="form-control-label text-left"
                                            htmlFor="example-text-input"
                                            md="3"
                                        >
                                            Product
                                        </Label>
                                        <Col md="4">
                                            <Input id="exampleFormControlSelect4" type="select" name="product_id" onChange={(e) => onChangeInput(e)}>
                                                <option>---</option>
                                                {products.filter((item) => item.vendorId == formData.networkProvider && item.category == formData.type).map((item, index) => <>
                                                    <option value={item.id} key={index}>{item.name}</option>
                                                </>)}
                                            </Input>
                                        </Col>
                                        <Label
                                            className="form-control-label text-left"
                                            htmlFor="example-text-input"
                                            md="2"
                                        >
                                            Amount
                                        </Label>
                                        <Col md="3">
                                            <Input
                                                placeholder="0"
                                                type="text"
                                                name="amount"
                                                value={products.find((item) => item.id == formData.product_id)?.amount}
                                                readOnly
                                            />
                                        </Col>
                                    </FormGroup>
                                </Form>
                                <Form>
                                    <FormGroup className="row">
                                        <Label
                                            className="form-control-label text-left"
                                            htmlFor="example-text-input"
                                            md="3"
                                        >
                                            Mobile number
                                        </Label>
                                        <Col md="9">
                                            <Input
                                                placeholder="12345678"
                                                id="example-text-input"
                                                type="text"
                                                name="mobileNumber"
                                                value={formData.mobileNumber}
                                                onChange={(e) => onChangeInput(e)}
                                                readOnly
                                            />
                                        </Col>
                                    </FormGroup>
                                </Form>
                                {<div className='mb-3' style={{ color: '#fb6340' }}>{(errStatus || errStatus.length !== 0) && <small>{errStatus}</small>}</div>}
                            </CardBody>
                        </Card>
                    </Container>
                    <Container className="text-center pb-5">
                        <Button
                            className=" my-2 mr-4"
                            color="primary"
                            onClick={onSubmit}
                        >
                            Submit
                        </Button>
                        <Button
                            className="btn-neutral my-2"
                            color="default"
                            onClick={() => logout()}
                        >
                            Logout
                        </Button>
                    </Container>
                </>
            }
            {showing === "success" &&
                <SingleLoadingSuccess response={response} />}
            {showing === "fail" &&
                <SingleLoadingFail response={response} />
            }
        </>
    );
}

export default SingleLoading;
