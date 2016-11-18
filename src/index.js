export const X_STATE_VALUE_ASYNC_RUNNING = "x_async_running";
export const X_STATE_VALUE_ASYNC_SUCCESS = "x_async_success";
export const X_STATE_VALUE_ASYNC_FAILURE = "x_async_failure";

const isXAction = ( action ) => {
    return action.xAction != null;
};

const updateAsyncResult = ( dispatch, action, asyncStatus, data ) => {
    action.xAction.xAsyncStateData = {
        status: asyncStatus,
        data: data
    };
    dispatch( action );
};

const handleAsync = ( dispatch, action ) => {
    let xAction = action.xAction;
    let xAsyncRunningAction = xAction.xAsyncRunningAction != null ? xAction.xAsyncRunningAction : X_STATE_VALUE_ASYNC_RUNNING;
    let xAsyncSuccessAction = xAction.xAsyncSuccessAction != null ? xAction.xAsyncSuccessAction : X_STATE_VALUE_ASYNC_SUCCESS;
    let xAsyncFailureAction = xAction.xAsyncFailureAction != null ? xAction.xAsyncFailureAction : X_STATE_VALUE_ASYNC_FAILURE;
    updateAsyncResult( dispatch, action, xAsyncRunningAction );
    if ( typeof xAction.xAsync === 'function' ) {
        let promise = xAction.xAsync();
        promise.then( ( result ) => {
            updateAsyncResult( dispatch, action, xAsyncSuccessAction, result );
        } ).catch( ( error ) => {
            updateAsyncResult( dispatch, action, xAsyncFailureAction, error );
        } );
    } else {
        updateAsyncResult( dispatch, action, xAsyncSuccessAction, xAction.xAsync );
    }
}

export class XReducer {
    create() {
        return ( state = {}, action = null ) => {
            if ( isXAction( action ) ) {
                let xAction = action.xAction;
                // handle sync update
                if ( xAction.xStateData != null ) {
                    let newState = {}
                    if ( typeof xAction.xStateData === 'function' ) {
                        newState = xAction.xSync( state, action );
                    } else {
                        newState[ xAction.xStateName ] = xAction.xStateData;
                    }
                    return {
                        ...state,
                        ...newState
                    };
                }
                // handle async update
                if ( xAction.xAsync != null ) {
                    let newState = {};
                    if ( typeof xAction.xAsyncStateData.status === 'function' ) {
                        newState = xAction.xAsyncStateData.status( state, action );
                    } else {
                        newState.xAsyncStatus = xAction.xAsyncStateData.status;
                    }
                    newState[ xAction.xStateName ] = xAction.xAsyncStateData.data;
                    return {
                        ...state,
                        ...newState
                    };
                }
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





