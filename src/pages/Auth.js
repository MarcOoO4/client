import React, {useContext, useEffect, useState} from 'react';
import {Container, Form} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {LOGIN_ROUTE, REGISTRATION_ROUTE, ACCOUNT_ROUTE, LOGIN_ADMIN_ROUTE} from "../utils/consts";
import { userLogin, userRegistration} from "../http/userAPI";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import InputMask from 'react-input-mask';
import {checkDatabaseStatus, checkServerConnection} from "../http/statusAPI";


const Auth = observer(() => {
    const {user} = useContext(Context)
    const location = useLocation()
    const navigate = useNavigate()
    const isLogin = location.pathname === LOGIN_ROUTE
    const [FIO, setFIO] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [name_ur, setName_ur] = useState('')
    const [INN, setINN] = useState('')
    const [KPP, setKPP] = useState('')
    const [OGRN, setOGRN] = useState('')
    const [OKPO, setOKPO] = useState('')
    const [ur_address, setUr_address] = useState('')
    const [payment_account, setPayment_account] = useState('')
    const [password, setPassword] = useState('')

    const [dbStatus, setDbStatus] = useState('Проверка...');
    const [serverStatus, setServerStatus] = useState('Проверка...');

    const checkDatabase = async () => {
        try {
            const data = await checkDatabaseStatus();
            setDbStatus(data.message);
        } catch (error) {
            setDbStatus('не установлено');
        }
    };

    const checkServer = async () => {
        try {
            const data = await checkServerConnection();
            setServerStatus(data.message);
        } catch (error) {
            setServerStatus('не установлено');
        }
    };

    useEffect(() => {
        // Проверка статуса базы данных и сервера при загрузке страницы
        checkDatabase();
        checkServer();

        // Установка интервала для регулярной проверки статуса базы данных и сервера
        const dbInterval = setInterval(checkDatabase, 500);
        const serverInterval = setInterval(checkServer, 500);

        // Очистка интервалов при размонтировании компонента
        return () => {
            clearInterval(dbInterval);
            clearInterval(serverInterval);
        };
    }, []);

    const click = async () => {
        try {
            let data;
            if (isLogin) {
                data = await userLogin(email, password);
            } else {
                data = await userRegistration(
                    FIO,
                    phone,
                    email,
                    name_ur,
                    INN,
                    parseInt(KPP),
                    parseInt(OGRN),
                    parseInt(OKPO),
                    ur_address,
                    payment_account,
                    password
                );
            }
            // Сохраняем данные пользователя в локальное хранилище
            localStorage.setItem('FIO', data.FIO);
            localStorage.setItem('phone', data.phone);
            localStorage.setItem('email', data.email);
            localStorage.setItem('id', data.id);
            localStorage.setItem('INN', data.INN);
            localStorage.setItem('OGRN', data.OGRN);
            user.setUser(data)
            user.setIsAuth(true)
            navigate(ACCOUNT_ROUTE)
        } catch (e) {
            alert(e.response.data.message)
        }

    }

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{height: '110vh'}}
        >
            <div className="status-box mt-5">
                <h2>Статус подключения</h2>
                <p>Подключение к базе данных: {dbStatus}</p>
                <p>Подключение к серверу: {serverStatus}</p>
            </div>
            <Card style={{width: 600}} className="p-5">
                <h2 className="m-auto">{isLogin ? 'Авторизация' : "Регистрация"}</h2>
                <Form className="d-flex flex-column">
                    {!isLogin && (
                        <Form.Control
                            className="mt-3"
                            placeholder="Введите ФИО"
                            value={FIO}
                            onChange={e => setFIO(e.target.value)}
                        />
                    )}
                    {!isLogin && (
                        <Form.Control
                            className="mt-3"
                            placeholder="Введите наименование юридического лица"
                            value={name_ur}
                            onChange={e => setName_ur(e.target.value)}
                        />
                    )}
                    {!isLogin && (
                        <Form.Control
                            className="mt-3"
                            placeholder="Введите ИНН"
                            value={INN}
                            onChange={e => setINN(e.target.value)}
                        />
                    )}
                    {!isLogin && (
                        <Form.Control
                            className="mt-3"
                            placeholder="Введите КПП"
                            value={KPP}
                            onChange={e => setKPP(e.target.value)}
                        />
                    )}
                    {!isLogin && (
                        <Form.Control
                            className="mt-3"
                            placeholder="Введите ОГРН"
                            value={OGRN}
                            onChange={e => setOGRN(e.target.value)}
                        />
                    )}
                    {!isLogin && (
                        <Form.Control
                            className="mt-3"
                            placeholder="Введите ОКПО"
                            value={OKPO}
                            onChange={e => setOKPO(e.target.value)}
                        />
                    )}
                    {!isLogin && (
                        <Form.Control
                            className="mt-3"
                            placeholder="Введите юридический адрес"
                            value={ur_address}
                            onChange={e => setUr_address(e.target.value)}
                        />
                    )}
                    {!isLogin && (
                        <Form.Control
                            className="mt-3"
                            placeholder="Введите расчётный счет"
                            value={payment_account}
                            onChange={e => setPayment_account(e.target.value)}
                        />
                    )}
                    {!isLogin && (
                        <InputMask
                            className="mt-3 form-control"
                            mask="+7 (999) 999-99-99"
                            placeholder="Введите номер телефона"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                        />
                    )}
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите пароль"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                    />
                    <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
                        {isLogin ?
                            <div>
                                Нет аккаунта? <NavLink to={REGISTRATION_ROUTE}>Зарегистрируйтесь!</NavLink>
                                <div><NavLink to={LOGIN_ADMIN_ROUTE}>Авторизация для администратора</NavLink></div>
                            </div>
                            :
                            <div>
                                Есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войдите!</NavLink>
                            </div>
                        }
                        <Button
                            className={"mt-3"}
                            variant={"outline-success"}
                            onClick={click}
                        >
                            {isLogin ? 'Войти' : 'Регистрация'}
                        </Button>
                    </Row>
                </Form>
            </Card>
        </Container>
    );
});

export default Auth;