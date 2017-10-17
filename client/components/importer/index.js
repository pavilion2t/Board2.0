import React, { PropTypes } from 'react';
import { Modal, ModalContainer, ModalHeader, ModalContent, ModalBottom } from '~/components/modal';

import './importer.scss';

import Preview from './Preview';
import Status from './Status';
import CsvFile from './CsvFile';
import Result from './Result';

export default class Importer extends Modal {
  static propTypes = {
    title: PropTypes.string,
    status: PropTypes.string,
    previewData: PropTypes.array.isRequired,
    errors: PropTypes.array.isRequired,
    warnings: PropTypes.array.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    isSubmitted: PropTypes.bool.isRequired,
    isValidating: PropTypes.bool.isRequired,
    isValidated: PropTypes.bool.isRequired,
    isUploaded: PropTypes.bool.isRequired,
    isPosting: PropTypes.bool.isRequired,
    isPosted: PropTypes.bool.isRequired,
    isDone: PropTypes.bool.isRequired,
    isDoing: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onUpload: PropTypes.func.isRequired,
    importProgress: PropTypes.number.isRequired,
    validatateProgress: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired,
    style: PropTypes.object //should not set this value
  };

  static defaultProps = {
    style: {
      content: {
        left: '6%',
        top: '6%',
        right: '6%',
        bottom: '6%',
        transform: 'none',
        margin: '0px'
      }
    }
  };

  renderChildren() {
    const {
      title,
      isDone,
      isDoing,
      style,
      onClose,
      isUploaded,
      onUpload,
      previewData,
      onSubmit,
      status,
      step,
      importProgress,
      validatateProgress,
      errors,
      warnings
    } = this.props;

    let rates = [undefined, importProgress, validatateProgress];

    let rate = rates[step];

    return (
      <ModalContainer style={ style }>
        <ModalHeader title={ title } onRequestClose={ onClose }/>
        <ModalContent>
          { <div className="row">
            <div className="col-md-6">
              <CsvFile onUpload={ onUpload }/>
            </div>
          </div> }
          <br/>
          { isDoing && <Status status={ status } rate={ rate } showProgress={ step === 1 || step === 2 }/> }
          { isDone && <Result errors={ errors } warnings={ warnings }/> }
          { isUploaded && <Preview data={ previewData }/> }
        </ModalContent>
        <ModalBottom>
          <button className="btn btn-primary btn-sm"
                  type="submit"
                  onClick={ onSubmit }
                  disabled={ !isUploaded }>Submit
          </button>
        </ModalBottom>
      </ModalContainer>
    );
  }
}
