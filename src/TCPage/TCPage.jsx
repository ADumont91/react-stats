import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { userActions } from '../_actions';

class TCPage extends React.Component {
    constructor(props) {
        super(props);

        // reset login status
        this.props.logout();

        this.state = {
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
    }

    render() {
        const { acceptingTC } = this.props;
        const { submitted } = this.state;
        return (
            <div className="col-md-6 col-md-offset-3">
                <h2>Terms and Conditions</h2>
				<p> We ain't liable for nothin! </p>
                <Link to="/register" className="btn btn-link">Back to Registration</Link>
            </div>
        );
    }
}

function mapState(state) {
    const { acceptingTC } = state.authentication;
    return { acceptingTC };
}

const actionCreators = {
    login: userActions.login,
    logout: userActions.logout
};

const connectedTCPage = connect(mapState, actionCreators)(TCPage);
export { connectedTCPage as TCPage };