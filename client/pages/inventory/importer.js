import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import map from 'lodash/map';
import JSZip from 'jszip';
import forEach from 'lodash/forEach';
import includes from 'lodash/includes';
import Alert from '~/components/alert/alert';
import uniqueId from 'lodash/uniqueId';

const IMPORTED = "imported";
const PENDING_VALIDATION = "pending_validation";
const PENDING_IMPORT = "pending_import";
const IMPORTING = "importing";
const VALIDATED = "validated";
const VALIDATING = "validating";

import {
  WAIT_SERVER_UPLOAD_IMAGES,
  UPLOADING_IMAGES,
  FINISH_UPLOAD_IMAGES,
  ERROR_UPLOAD_IMAGES
} from '../../actions/inventoryActions';

export default class Importer extends Component {
  static propTypes = {
     appState: PropTypes.object.isRequired,
     params: PropTypes.object.isRequired,
     actions: PropTypes.object.isRequired
  }

  componentWillReceiveProps(nextProps) {
     let status = nextProps.appState.importerStatus.status || '';
     let allow_import = nextProps.appState.importerStatus.allow_import || '';
     let inventory_import_id = nextProps.appState.importerStatus.id || '';

     if (status === VALIDATING || status === PENDING_VALIDATION || status === VALIDATED && allow_import === false){
        this.startPoll(inventory_import_id);
     } else if (status === PENDING_IMPORT || status === IMPORTING){
        this.startPoll(inventory_import_id);
     }
  }

  validateFileName(files){
    //validating the file name
    let isValid = true;
    forEach(files, (val, key) => {
      if (!val.dir && !includes(val.name, 'png') && !includes(val.name, 'jpg')){
        isValid = false;
      }
    });
    return isValid;
  }

  handleImagesFile(e){

    let self = this;
    let {params, actions, appState} = this.props;
    let {store_id} = params;
    let reader = new FileReader();
    let file = self.refs.uploadImages.files[0];
    let import_id = appState.importerStatus.id;

    reader.onload = function (onloadFile) {

      let zip = new JSZip(onloadFile.target.result);
      let isValid = self.validateFileName(zip.files);

      if (!isValid){
        alert('You files contain invalid extension name, png/jpg only and please remove all folder in your .zip file');
      } else {
        let path = appState.importerStatus.upload_url;
        actions.postImagesToS3(path, reader.result, store_id, import_id);
      }

      //self.refs.uploadImagesForm.reset();


    };
    reader.readAsArrayBuffer(file);
  }

  handleFile(e){
    let self = this;
    let {params, actions} = this.props;
    let {store_id} = params;
    let reader = new FileReader();

    let file = self.refs.uploadCSV.files[0];

    reader.onload = function (upload) {

      let data = new FormData();
      data.append('inventory_import[csv]', file);
      actions.validateImportInventory(store_id, data);

      //self.refs.uploadCSVForm.reset();


    };
    reader.readAsText(file);
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  startPoll(inventory_import_id){
    let {store_id} = this.props.params;
    let {actions} = this.props;
    this.timeout = setTimeout(() => actions.getImportInventory(store_id, inventory_import_id), 1000);
  }

  startImport(){
    let {store_id} = this.props.params;
    let id = this.props.appState.importerStatus.id;
    this.props.actions.postImportInventory(store_id, id);
  }

  render() {
    let { appState, params } = this.props;
    let validate_msg = '';
    let warning_msg = '';
    let error_msg = '';
    let disableImport = true;
    let isShowUploadForm = false;
    let isShowUploadCSVForm = true;
    let progress_rate = 0;

    let backPath = `/v2/${params.store_id}/inventory`;

    switch (appState.importerStatus.status) {

      case ERROR_UPLOAD_IMAGES:
        validate_msg = appState.importerStatus.statusText;
        isShowUploadCSVForm = true;
      break;

      case WAIT_SERVER_UPLOAD_IMAGES:
        validate_msg = 'Wait for server response';
        progress_rate = appState.importerStatus.percentComplete;
        isShowUploadCSVForm = false;
      break;

      case FINISH_UPLOAD_IMAGES:
        validate_msg = 'Upload Images Success';
        progress_rate = 100;
        disableImport = false;
        isShowUploadCSVForm = true;
      break;

      case UPLOADING_IMAGES:
        validate_msg = 'Uploading images';
        progress_rate = appState.importerStatus.percentComplete;
        isShowUploadCSVForm = false;
      break;

      case IMPORTED:
        validate_msg = 'Import Success';
        progress_rate = 100;
        isShowUploadCSVForm = true;
        break;

      case VALIDATING:
      case PENDING_VALIDATION:
          validate_msg = 'Please wait, we are validating your data';
          progress_rate = parseFloat(appState.importerStatus.validation_progress_rate || 0)  * 100;
          isShowUploadCSVForm = false;
        break;

      case IMPORTING:
      case PENDING_IMPORT:
          validate_msg = 'Please wait, we are importing your data';
          progress_rate = parseFloat(appState.importerStatus.import_progress_rate || 0)  * 100;
          isShowUploadCSVForm = false;
        break;

      case VALIDATED:

        warning_msg = map(appState.importerStatus.humanize_validation_warnings, (items, key) => {
            return (
              <table key={ uniqueId() } className="table">
                    <thead>
                        <tr>
                            <th>Row</th>
                            <th>warning message</th>
                        </tr>
                    </thead>
                    <tbody>
                      { map(items, (item) => {
                          return <tr key={ uniqueId() }><td>{ parseInt(key) }</td><td> { item }</td></tr>;
                      }) }
                    </tbody>
                </table>
            );
        });

        error_msg = map(appState.importerStatus.humanize_validation_errors, (items, key) => {

            return  (
                <table key={ uniqueId() } className="table">
                    <thead>
                        <tr>
                            <th>Row</th>
                            <th>Error message</th>
                        </tr>
                    </thead>
                    <tbody>
                      { map(items, (item) => {
                          return <tr key={ uniqueId() }><td>{ parseInt(key) }</td><td> { item }</td></tr>;
                      }) }
                    </tbody>
                </table>
            );
        });

        if (!error_msg.length && !warning_msg.length){
          validate_msg = 'Validate Success & ready to upload images';
        }


        isShowUploadCSVForm = true;


        disableImport = error_msg.length ? true : false;
        progress_rate = 100;
        isShowUploadForm = disableImport ? false : true;
        break;
    }




    return (
        <div className="main-content">
            <header className="main-content-header columns">
                <h1 className="main-content-title columns-main">Inventory</h1>
                <div>
                  <Link to={ backPath } className="btn btn-secondary btn-sm">Cancel</Link> &nbsp;
                  <button disabled={ disableImport } onClick={ this.startImport.bind(this) } className="btn btn-primary btn-sm">Import</button>
                </div>
            </header>
            <div className="main-content-section">
                <h2>Import Inventory</h2>
                <p><b>How to import:</b></p>
                <ol>
                    <li>You can download a <a href={ require('./samples/simple.csv') }>Simplify Inventory template</a></li>
                    <li>Fill in product details in a template</li>
                    <li>Start to import</li>
                </ol>



            </div>
            <div className="main-content-section">
                <h3>Step 1. Select Action</h3>
                <div className="form-group">
                    <input type="radio" name="import_action" id="new-inventory" defaultChecked/> &nbsp;
                    <label htmlFor="new-inventory">Import New Inventory</label>
                </div>

            </div>
            <div className="main-content-section">
                <h3>Step 2. Select File</h3>
                <progress className="progress" value={ progress_rate } max="100"></progress>
                <p>1.Inventory file (CSV, TXT only)</p>
                {
                  isShowUploadCSVForm ? (
                    <form ref="uploadCSVForm" onSubmit={ this.handleSubmit } encType="multipart/form-data">
                      <p><input accept=".csv,.txt" ref="uploadCSV" type="file" onChange={ this.handleFile.bind(this) } /></p>
                    </form>
                  ) : null
                }

                {
                  isShowUploadForm ? (
                    <div>
                      <p>2.Inventory images (zip only)</p>
                      <form ref="uploadImagesForm" onSubmit={ this.handleSubmit } encType="multipart/form-data">
                        <p><input ref="uploadImages" accept=".zip" type="file" onChange={ this.handleImagesFile.bind(this) } /></p>
                      </form>
                    </div>
                  ) : null
                }
                <div>

                  {
                    validate_msg ? (
                      <Alert style="info"> <p>{ validate_msg }</p> </Alert>
                    ) : null
                  }
                  {
                    warning_msg && warning_msg.length > 0 ? (
                      <Alert style="warning"> { warning_msg } </Alert>
                    ) : null
                  }
                  {
                    error_msg && error_msg.length > 0 ? (
                      <Alert style="danger"> { error_msg } </Alert>
                    ) : null
                  }

                </div>
            </div>
        </div>
    );
  }
}
