
export const X_TYPE_ACTION = "X_TYPE_ACTION";

export default function reduxXAction( extraArgument ) {
    return ( store ) => ( next ) => ( action ) => {
        if ( isXAction( action ) ) {
            if ( typeof action.xAsync === 'function' ) {
                let promise = action.xAsync();
                promise.then( ( result ) => {
                    action.xData = result;
                    next( action );
                } );
            }
        }
        return next( action );
    };
};

export function reduxXReducer() {
    return ( state = {}, action = null ) => {
        if ( isXAction( action ) ) {
            let newState = {};
            if ( typeof action.xSync === 'function' ) {
                newState = action.xSync( state, action );
            } else if ( action.xState != null ) {
                newState[ action.xState ] = action.xData;
            }
            return {
                ...state,
                ...newState
            };
        }
        return state;
    };
};

export const createXAction = ( action ) => {
    return {
        xType: X_TYPE_ACTION,
        ...action
    };
};

const isXAction = ( action ) => {
    return action.xType === X_TYPE_ACTION;
}