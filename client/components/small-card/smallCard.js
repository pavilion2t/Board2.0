import "./smallCard.scss";
import React, {Component, PropTypes} from 'react';


export default class SmallCard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let content = this.props.editable?
            (<input onBlur={ this.props.inputContent }></input>):
                (typeof(this.props.cardContent) === 'string'?
                (<p>{ this.props.cardContent }</p>): this.props.cardContent) ;
        return (
            <div className="smallCardContainer">
                <p className="smallCardTag">{ this.props.cardTag }</p>
                { content }
            </div>
        );
    }
}

SmallCard.propTypes = {
    editable: PropTypes.bool,
    cardTag: PropTypes.string.isRequired,
    cardContent: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.object)]),
    inputContent: PropTypes.func
};
