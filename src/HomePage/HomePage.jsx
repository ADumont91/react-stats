import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import myFirebase from '../_services/firebase';
import { userActions } from '../_actions';

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        //this.props.getUsers();
        return null;
    }

    handleDeleteUser(id) {
        //return (e) => this.props.deleteUser(id);
        return null;
    }

    handleSubmit() {
        this.props.logout();
    }

    render() {
        const user = myFirebase.auth().currentUser;
        const users = this.props
        return (
            <div className="col-md-6 col-md-offset-3">
                <h1>Hi {user.uid}!</h1>
                <p>You're logged in with React, Redux and Firebase!!</p>
                <h3>This is where protected content will be displayed</h3>
                {users.loading && <em>Loading users...</em>}
                {users.error && <span className="text-danger">ERROR: {users.error}</span>}
                {users.items &&
                    <ul>
                        {users.items.map((user, index) =>
                            <li key={user.id}>
                                {user.firstName + ' ' + user.lastName}
                                {
                                    user.deleting ? <em> - Deleting...</em>
                                    : user.deleteError ? <span className="text-danger"> - ERROR: {user.deleteError}</span>
                                    : <span> - <a onClick={this.handleDeleteUser(user.id)}>Delete</a></span>
                                }
                            </li>
                        )}
                    </ul>
                }
                <p>
                    <Link onClick={this.handleSubmit} to="/login">Logout</Link>
                </p>
            </div>
        );
    }
}

function mapState(state) {
    const { users, authentication } = state;
    const { user } = authentication;
    return { user, users };
}

const actionCreators = {
    getUsers: userActions.getAll,
    deleteUser: userActions.delete,
    logout: userActions.logout
}

const connectedHomePage = connect(mapState, actionCreators)(HomePage);
export { connectedHomePage as HomePage };