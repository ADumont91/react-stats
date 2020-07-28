import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { history } from '../_helpers';
import { alertActions } from '../_actions';
import { PrivateRoute } from '../_components';
import { HomePage } from '../HomePage';
import { LoginPage } from '../LoginPage';
import { RegisterPage } from '../RegisterPage';
import { ForgetPage } from '../ForgetPage';
import { TCPage } from '../TCPage';
import { Container, Navbar, NavbarBrand,NavItem, NavLink, Nav, Collapse } from 'shards-react'

class App extends React.Component {
    constructor(props) {
        super(props);

        history.listen((location, action) => {
            // clear alert on location change
            this.props.clearAlerts();
        });
    }

    render() {
        const { alert } = this.props;
        return (
			<div>
			<Navbar type="dark" theme="primary"  expand="md">
				<img src="https://gracelife.co/wp-content/uploads/2019/08/cropped-GL-logo_VECTOR_Blue-PNG.png" alt="Logo" style={{width:"60px"}}></img>
				<NavbarBrand href="/login">Login App</NavbarBrand>
				<Nav navbar>
					<NavItem><NavLink href="/login">Login</NavLink></NavItem>
					<NavItem><NavLink href="/register">Register</NavLink></NavItem>
				</Nav>
			</Navbar>

			<div className="jumbotron">
                <Container className="col-sm-8 col-sm-offset-4">
                    {alert.message &&
                        <div className={`alert ${alert.type}`}>{alert.message}</div>
                    }
                    <Router history={history}>
                        <Switch>
                            <PrivateRoute exact path="/" component={HomePage} />
							<Route path="/login" component={LoginPage} />
                            <Route path="/register" component={RegisterPage} />
							<Route path="/forgot" component={ForgetPage} />
							<Route path="/TCPage" component={TCPage} />
                            <Redirect from="*" to="/" />
                        </Switch>
                    </Router>
            </Container>
            </div>
			</div>
        );
    }
}

function mapState(state) {
    const { alert } = state;
    return { alert };
}

const actionCreators = {
    clearAlerts: alertActions.clear
};

const connectedApp = connect(mapState, actionCreators)(App);
export { connectedApp as App };