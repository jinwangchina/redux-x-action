export const X_TYPE_ASYNC_STATUS = "X_UPDATE_ASYNC_STATUS";
export const X_STATE_ASYNC = "xAsyncStatus";
export const X_STATE_VALUE_ASYNC_RUNNING = "x_async_running";
export const X_STATE_VALUE_ASYNC_SUCCESS = "x_async_success";
export const X_STATE_VALUE_ASYNC_FAILURE = "x_async_failure";

const isXAction = ( action ) => {
    return action.xAction != null;
};

const updateAsyncStatus = ( dispatch, asyncStatus ) => {
    let action = {
        type: X_TYPE_ASYNC_STATUS
    };
    if ( typeof asyncStatus === 'string' ) {
        action = {
            ...action,
            xAction: {
                xStateName: X_STATE_ASYNC,
                xStateData: asyncStatus
            }
        };

    } else {
        action = {
            ...action,
            ...asyncStatus
        };
    }
    dispatch( action );
};

const handleAsync = ( dispatch, action ) => {
    let xAction = action.xAction;
    if ( typeof xAction.xAsync === 'function' ) {
        updateAsyncStatus( dispatch, xAction.xAsyncRunningAction != null ? xAction.xAsyncRunningAction : X_STATE_VALUE_ASYNC_RUNNING );
        let promise = xAction.xAsync();
        promise.then( ( result ) => {
            xAction.xStateData = result;
            updateAsyncStatus( dispatch, xAction.xAsyncSuccessAction != null ? xAction.xAsyncSuccessAction : X_STATE_VALUE_ASYNC_SUCCESS );
            dispatch( action );
        } ).catch( ( error ) => {
            xAction.xStateData = error;
            updateAsyncStatus( dispatch, xAction.xAsyncFailureAction != null ? xAction.xAsyncFailureAction : X_STATE_VALUE_ASYNC_FAILURE );
            dispatch( action );
        } );
    } else {
        xAction.xStateData = xAction.xAsync;
        dispatch( action );
    }
}

export class XReducer {
    create() {
        return ( state = {}, action = null ) => {
            if ( isXAction( action ) ) {
                let xAction = action.xAction;
                let newState = {};
                if ( typeof xAction.xSync === 'function' ) {
                    newState = xAction.xSync( state, action );
                } else if ( xAction.xStateName != null ) {
                    newState[ xAction.xStateName ] = xAction.xStateData;
                }
                return {
                    ...state,
                    ...newState
                };
            }
            return state;
        };
    }
}

export const createXReducer = ( args ) => new XReducer().create();

export const createXMiddleware = ( args ) => {
    return ( store ) => ( next ) => ( action ) => {
        if ( isXAction( action ) ) {
            let xAction = action.xAction;
            if ( xAction.xAsync != null ) {
                handleAsync( next, action );
            }
        }
        return next( action );
    };
};





