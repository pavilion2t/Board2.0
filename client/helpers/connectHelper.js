import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

export function wrapConnect(element, actions) {
  const mapStateToProps = (state) => {
    return {
      appState: state
    };
  };

  const mapDispatchToProps = (dispatch) => {
    return {
      actions: bindActionCreators(actions, dispatch)
    };
  };
  
  return connect(mapStateToProps, mapDispatchToProps)(element);
}
