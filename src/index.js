export const X_STATE_VALUE_ASYNC_RUNNING = "x_async_running";
export const X_STATE_VALUE_ASYNC_SUCCESS = "x_async_success";
export const X_STATE_VALUE_ASYNC_FAILURE = "x_async_failure";

const isXAction = ( action ) => {
    return action.xAction != null;
};

const isXActionWithAsync = ( action ) => {
    return isXAction( action ) && action.xAction.xAsync != null;
};

const updateAsyncResult = ( dispatch, action, asyncStatus, data ) => {
    let newAction = { ...action };
    newAction.xAction = {
        xData: {
            ...asyncStatus,
        }
    };
    newAction.xAction.xData[ action.xAction.xStateName ] = data;
    dispatch( newAction );
};

const handleAsync = ( dispatch, action ) => {
    let xAction = action.xAction;
    let xAsyncRunning = xAction.xAsyncRunning != null ? xAction.xAsyncRunning : { xAsyncStatus: X_STATE_VALUE_ASYNC_RUNNING };
    let xAsyncSuccess = xAction.xAsyncSuccess != null ? xAction.xAsyncSuccess : { xAsyncStatus: X_STATE_VALUE_ASYNC_SUCCESS };
    let xAsyncFailure = xAction.xAsyncFailure != null ? xAction.xAsyncFailure : { xAsyncStatus: X_STATE_VALUE_ASYNC_FAILURE };
    updateAsyncResult( dispatch, action, xAsyncRunning );
    if ( typeof xAction.xAsync === 'function' ) {
        let promise = xAction.xAsync( dispatch );
        promise.then( ( res ) => {
            updateAsyncResult( dispatch, action, xAsyncSuccess, res );
        } ).catch( ( err ) => {
            updateAsyncResult( dispatch, action, xAsyncFailure, err );
        } );
    } else {
        updateAsyncResult( dispatch, action, xAsyncSuccess, xAction.xAsync );
    }
}

export class XReducer {
    create() {
        return ( state = {}, action = null ) => {
            if ( isXAction( action ) ) {
                let xAction = action.xAction;
                let newState = {}

                // handle sync update - xStateData
                if ( xAction.xStateData != null ) {
                    if ( typeof xAction.xStateData === 'function' ) {
                        newState[ xAction.xStateName ] = xAction.xStateData();
                    } else {
                        newState[ xAction.xStateName ] = xAction.xStateData;
                    }
                    return { ...state, ...newState };
                }

                // handle sync update - xData
                if ( xAction.xData != null ) {
                    if ( typeof xAction.xData === 'function' ) {
                        newState = xAction.xData( state, action );
                    } else {
                        newState = xAction.xData;
                    }
                    return { ...state, ...newState };
                }
            }
            return state;
        };
    }
}

export class XMiddleware {
    create() {
        return ( store ) => ( next ) => ( action ) => {
            if ( isXActionWithAsync( action ) ) {
                handleAsync( next, action );
                return null;
            }
            return next( action );
        };
    }
}

export const createXReducer = args => new XReducer().create();

export const createXMiddleware = args => new XMiddleware().create();





