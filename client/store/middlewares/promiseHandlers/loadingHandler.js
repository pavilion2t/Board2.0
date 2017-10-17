export default class loadingHandler {
  constructor(dispatch, settings){
    this.dispatch = dispatch;
    this.settings = Object.assign({
      showLoading: true
    }, settings);
  }

  onBeforePromise() {
    if (this.settings.showLoading){
      this.dispatch({ type: 'START_FETCH' });
    }
  }

  onAfterPromise(){
    if (this.settings.showLoading){
      this.dispatch({ type: 'STOP_FETCH' });
    }
  }

  onCatchPromise(){
    if (this.settings.showLoading){
      this.dispatch({ type: 'STOP_FETCH' });
    }
  }
}
