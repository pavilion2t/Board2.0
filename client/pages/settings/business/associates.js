import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import CreateForm from './associate-create';
import AddForm from './associate-add';

import { getAssociate, addAssociate, createNewAssociate, promoteAssociate, removeAssociate, alert } from '~/actions';
import { dateTime } from '~/helpers/formatHelper';

function mapStateToProps(state, ownProps) {
  let pathname = ownProps.location.pathname;
  let pathState = state.path[pathname] || {};
  let pageState = {};

  try {
    pageState.associates = map(pathState.associates, id => state.entities.associates[id]);

  } catch (e) {
    console.warn('associates not ready');
    pageState.associates = null;
  }


  return pageState;
}
function mapDispatchToProps(dispatch) {
  const actions = { getAssociate, addAssociate, createNewAssociate, promoteAssociate, removeAssociate, alert };
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

class SettingAssociates extends Component {
  static propTypes = {
    actions: PropTypes.object,
    params: PropTypes.object,
    location: PropTypes.object,
    associates: PropTypes.array,
  }
  static contextTypes = {
    currentStore: React.PropTypes.object.isRequired
  }
  state = {
    createForm: false,
    addForm: false,
  }

  componentDidMount() {
    const { store_id } = this.props.params;
    const { pathname } = this.props.location;
    const { getAssociate } = this.props.actions;

    getAssociate(store_id, pathname);
  }

  updateSettings = (data) => {
  }
  removeAssociate(id) {
    const { store_id } = this.props.params;
    const { pathname } = this.props.location;
    const { removeAssociate, alert } = this.props.actions;

    if (confirm('Are you sure you want to remove this associate?')) {
      removeAssociate(store_id, id, pathname)
      .then(data => {
        alert('success', 'Associate removed.');
        this.closeCreateForm();
      })
      .catch(err => {
        alert('danger', err.message);
      });
    }
  }
  changeRole(id, event) {
    const { store_id } = this.props.params;
    const { pathname } = this.props.location;
    const { promoteAssociate, alert } = this.props.actions;

    promoteAssociate(store_id, id, parseInt(event.target.value), pathname)
    .then(data => {
      alert('success', 'Role changed.');
      this.closeCreateForm();
    })
    .catch(err => {
      alert('danger', err.message);
    });
  }

  openCreateForm = () => {
    this.setState({ createForm: true });
  }
  openAddForm = () => {
    this.setState({ addForm: true });
  }
  closeCreateForm = () => {
    this.setState({ createForm: false });
  }
  closeAddForm = () => {
    this.setState({ addForm: false });
  }
  submitCreateForm = () => {
    this.refs.CreateForm.submit();
  }
  submitAddForm = () => {
    this.refs.AddForm.submit();
  }

  createNewAssociate = (data) => {
    const { store_id } = this.props.params;
    const { pathname } = this.props.location;
    const { createNewAssociate, alert } = this.props.actions;

    createNewAssociate(store_id, {associate: data}, pathname)
    .then(data => {
      alert('success', 'New associate created.');
      this.closeCreateForm();
    })
    .catch(err => {
      alert('danger', err.message);
    });
  }

  addAssociate = (data) => {
    const { store_id } = this.props.params;
    const { pathname } = this.props.location;
    const { addAssociate, alert } = this.props.actions;

    addAssociate(store_id, {associate: data}, pathname)
    .then(data => {
      alert('success', 'Associate added.');
      this.closeAddForm();
    })
    .catch(err => {
      alert('danger', err.message);
    });
  }

  render() {
    let { associates } = this.props;
    let { store_permissions = [] } = this.context.currentStore || {};
    let roles = reduce(store_permissions, (acc, storePermission) => {
      acc[storePermission.store_role_id] = storePermission.store_role_name;
      return acc;
    }, {});


    const customModalStyle = {
      content : {
        top: '80px',
      },
      overlay: {
        overflow: 'auto',
      }
    };


    return (
        <div className="main-content">
          <header className="main-content-header columns">
            <h1 className="main-content-title columns-main">Associates</h1>
            <div>
              <button className="btn btn-secondary btn-sm" onClick={ this.openAddForm }>Add Exsiting User</button> &nbsp;
              <button className="btn btn-secondary btn-sm" onClick={ this.openCreateForm }>Create New Associate</button>
            </div>
          </header>
          <div className="main-content-section">
            <table className="table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Role</th>
                  <th>Added by</th>
                  <th>Last Update</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
              {
                associates.map(a => (
                  <tr key={ a.id }>
                    <td>{ a.full_name }</td>
                    <td>
                      <select value={ a.role } onChange={ this.changeRole.bind(this, a.id) }>
                        {
                          map(roles, (role, key) => (
                            <option key={ key } value={ key }>{ role }</option>
                          ))
                        }
                      </select>


                    </td>
                    <td>{ a.added_by }</td>
                    <td>{ dateTime(a.updated_at) }</td>
                    <td><a className="a text-danger" onClick={ this.removeAssociate.bind(this, a.id) }>remove</a></td>
                  </tr>
                ))
              }
              </tbody>
            </table>
          </div>
          <Modal className="modal-dialog open" style={ customModalStyle } isOpen={ this.state.createForm } onRequestClose={ this.closeCreateForm }>
            <div className="modal-content">
               <div className="modal-header">
                 <h4 className="modal-title">Create New Associate</h4>
               </div>
               <div className="modal-body">
                  <CreateForm ref="CreateForm" onSubmit={ this.createNewAssociate } roles={ roles } />
               </div>
               <div className="modal-footer">
                 <button type="button" className="btn btn-secondary" onClick={ this.closeCreateForm }>Cancel</button>
                 <button type="button" className="btn btn-primary" onClick={ this.submitCreateForm }>Create Bindo Account</button>
               </div>
             </div>
          </Modal>

          <Modal className="modal-dialog open" style={ customModalStyle } isOpen={ this.state.addForm } onRequestClose={ this.closeAddForm }>
            <div className="modal-content">
               <div className="modal-header">
                 <h4 className="modal-title">Add Existing Associate</h4>
               </div>
               <div className="modal-body">
                  <AddForm ref="AddForm" onSubmit={ this.addAssociate } roles={ roles } />
               </div>
               <div className="modal-footer">
                 <button type="button" className="btn btn-secondary" onClick={ this.closeAddForm }>Cancel</button>
                 <button type="button" className="btn btn-primary" onClick={ this.submitAddForm }>Add Associate</button>
               </div>
             </div>
          </Modal>

        </div>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(SettingAssociates);
