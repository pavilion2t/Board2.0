import React, { PropTypes, Component } from 'react';
import uniqueId from 'lodash/uniqueId';
import forEach from 'lodash/forEach';
import FormGroup from '../../../components/form-group/formGroup';

class ListingOverviewFormComponent extends Component {

  static defaultProps = {
    isCustomMode: false,
    isInventoryManager: "YES"
  }


  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    departments: PropTypes.arrayOf(PropTypes.object).isRequired,
    isCustomMode: PropTypes.bool.isRequired,
    isInventoryManager: PropTypes.string.isRequired,
  }


  state = {
    uploadImages: []
  }

  previewFiles = (event) => {
    forEach(event.target.files, file => {  // event.target.files is not a array
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () =>  {
        this.state.uploadImages.push({
          id: uniqueId(),
          src: reader.result,
          file: file
        });
        this.setState({ uploadImages: this.state.uploadImages });

        this.props.fields.upload_images.onChange(this.state.uploadImages);
      };
    });

  }
  cancelUpload(index) {
    this.state.uploadImages.splice(index, 1);
    this.setState({ uploadImages: this.state.uploadImages });
    this.props.fields.upload_images.onChange(this.state.uploadImages);
  }

  render() {
    const { fields, handleSubmit, departments, isCustomMode, isInventoryManager} = this.props;
    let enabledEdit = true;
    if (!isCustomMode) {
      let isManager = isInventoryManager === "NO" ? true : false;
      let isGtid = fields.gtid.defaultValue === null ? true : false;
      enabledEdit = isManager && isGtid;
    }


    return (
      <form className="row" id="listing-form" onSubmit={ handleSubmit } >
        <div className="col-sm-12">
          <FormGroup label="Title" state={ fields.name }>
            <input className="form-control" type="text" { ...fields.name } disabled={ !enabledEdit }/>
          </FormGroup>
        </div>
        <div className="col-sm-12">
          <FormGroup label="Description" state={ fields.name }>
            <textarea className="form-control" rows={ 4 } { ...fields.description } disabled={ !isCustomMode && !enabledEdit }/>

          </FormGroup>
        </div>
        <div className="col-sm-6">
          <FormGroup label="UPC/EAN" state={ fields.gtid }>
            <input className="form-control" type="text" { ...fields.gtid } disabled/>
          </FormGroup>
        </div>
        <div className="col-sm-3">
          <FormGroup label="QTY on shelf" state={ fields.quantity }>
            <input className="form-control" type="text" { ...fields.quantity } />
          </FormGroup>
        </div>
        <div className="col-sm-3">
          <FormGroup label="QTY stockroom" state={ fields.qty_stockroom }>
            <input className="form-control" type="text" { ...fields.qty_stockroom } />
          </FormGroup>
        </div>
        <div className="col-sm-6">
          <FormGroup label="PLU/SKU" state={ fields.listing_barcode }>
            <input className="form-control" type="text" { ...fields.listing_barcode } />
          </FormGroup>
        </div>
        <div className="col-sm-6">
          <FormGroup label="Price" state={ fields.price }>
            <input className="form-control" type="text" { ...fields.price } />
          </FormGroup>
        </div>
        <div className="col-sm-6">
          <FormGroup label="Brand" state={ fields.brand_name }>
            <input className="form-control" type="text" { ...fields.brand_name } disabled={ !isCustomMode && !enabledEdit }/>
          </FormGroup>
        </div>
        <div className="col-sm-6">
          <FormGroup label="Department" state={ fields.department_id }>
            <select { ...fields.department_id }>
              <option key="0" value="">(no department)</option>

              {
                departments.map(d => (
                  <option key={ d.id } value={ d.id }>{ d.stackdisplay }</option>
                ))
              }

            </select>
          </FormGroup>
        </div>


        <div className="col-sm-12">
          <br /><hr /><br />

          <p><input type="checkbox" onChange={ fields.in_store_only.onChange } checked={ fields.in_store_only.checked } /> In Store Only</p>
          <p><input type="checkbox" onChange={ fields.discontinued.onChange } checked={ fields.discontinued.checked } /> Discontinued</p>
          <p><input type="checkbox" onChange={ fields.exempt_loyalty.onChange } checked={ fields.exempt_loyalty.checked } /> Exempt item from loyalty program</p>
          <p><input type="checkbox" onChange={ fields.exempt_discount.onChange } checked={ fields.exempt_discount.checked } /> Exclude from all discount</p>
          <p><input type="checkbox" onChange={ fields.storefront_allow_negative_quantity.onChange } checked={ fields.storefront_allow_negative_quantity.checked } /> Store front allow negative quantity</p>

          <br /><hr /><br />

        </div>

        {
          fields.product_graphics.map(graphic => (
            <div className="col-sm-2" key={ graphic.value.id } >
              <div className="small text-danger" >
                <label><input type="checkbox" onChange={ graphic.delete.onChange } /> Remove image</label>
              </div>
              <img src={ graphic.value.small_image_url } />
            </div>
          ))
        }
        {
          this.state.uploadImages.map((image, index) => (
            <div className="col-sm-2" key={ image.id } >
              <div className="small text-danger" >
                <span className="a" onClick={ this.cancelUpload.bind(this, index) }>&times; cancel</span>
              </div>
              <img className="upload-preview" src={ image.src } />
            </div>
          ))
        }

        <div className="col-sm-12">
          <hr className="clear" />
          <h4>Upload new product image</h4>
          <input type="file" multiple onChange={ this.previewFiles } disabled={ !isCustomMode && !enabledEdit }/>
        </div>
      </form>
    );
  }
}

export default ListingOverviewFormComponent;
