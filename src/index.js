
export const X_TYPE_ASYNC_STATUS = "X_UPDATE_ASYNC_STATUS";
export const X_STATE_ASYNC = "x_async_status";
export const X_STATE_VALUE_ASYNC_RUNNING = "x_async_running";
export const X_STATE_VALUE_ASYNC_DONE = "x_async_done";

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

const handleAsync = ( dispatch, xAction ) => {
    if ( typeof xAction.xAsync === 'function' ) {
        updateAsyncStatus( dispatch, xAction.xAsyncRunningAction != null ? xAction.xAsyncRunningAction : X_STATE_VALUE_ASYNC_RUNNING );
        let promise = xAction.xAsync();
        promise.then( ( result ) => {
            xAction.xData = result;
            updateAsyncStatus( dispatch, xAction.xAsyncDoneAction != null ? xAction.xAsyncDoneAction : X_STATE_VALUE_ASYNC_DONE );
            dispatch( action );
        } ).catch( ( error ) => {
            xAction.xData = error;
            xAction.xError = true;
            updateAsyncStatus( dispatch, xAction.xAsyncDoneAction != null ? xAction.xAsyncDoneAction : X_STATE_VALUE_ASYNC_DONE );
            dispatch( xAction );
        } );
    } else {
        xAction.xData = xAction.xAsync;
        dispatch( xAction );
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

export const createXReducer = () => {
    return new XReducer().create();
};

const createXActionMiddleware = ( args ) => {
    return ( store ) => ( next ) => ( action ) => {
        if ( isXAction( action ) ) {
            let xAction = action.xAction;
            if ( xAction.xAsync != null ) {
                handleAsync( next, xAction );
            }
        }
        return next( action );
    };
};
const reduxXAction = createXActionMiddleware();
reduxXAction.withExtraArgument = createXActionMiddleware;
export default reduxXAction;





