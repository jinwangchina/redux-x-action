import { createXMiddleware, createXReducer } from '../src/index';
import { X_STATE_VALUE_ASYNC_RUNNING, X_STATE_VALUE_ASYNC_SUCCESS, X_STATE_VALUE_ASYNC_FAILURE } from '../src/index';
import { createStore, combineReducers, applyMiddleware } from 'redux';

let store = createStore(
    combineReducers( {
        xAction: createXReducer()
    } ),
    applyMiddleware(
        createXMiddleware()
    )
);

test( 'Basic - sync update - xStateData - string', () => {
    const RESULT = 'myStateData';
    let unsubscribe = store.subscribe( () => {
        let state = store.getState();
        console.log( state.xAction.myStateName );
        expect( state.xAction.myStateName ).toBe( RESULT );
    } );
    store.dispatch( {
        type: 'myAction',
        xAction: {
            xStateName: 'myStateName',
            xStateData: RESULT
        }
    } );
    unsubscribe();
} );

test( 'Basic - sync update - xStateData - function', () => {
    const RESULT = 'myStateData - function';
    let unsubscribe = store.subscribe( () => {
        let state = store.getState();
        console.log( state.xAction.myStateName );
        expect( state.xAction.myStateName ).toBe( RESULT );
    } );
    store.dispatch( {
        type: 'myAction',
        xAction: {
            xStateName: 'myStateName',
            xStateData: () => RESULT
        }
    } );
    unsubscribe();
} );

test( 'Basic - sync update - xData - object', () => {
    const RESULT = 'myData';
    const RESULT_2 = 'myData2';
    let unsubscribe = store.subscribe( () => {
        let state = store.getState();
        console.log( state.xAction.myStateName );
        expect( state.xAction.myStateName ).toBe( RESULT );
        console.log( state.xAction.myStateName2 );
        expect( state.xAction.myStateName2 ).toBe( RESULT_2 );
    } );
    store.dispatch( {
        type: 'myAction',
        xAction: {
            xData: {
                myStateName: RESULT,
                myStateName2: RESULT_2
            }
        }
    } );
    unsubscribe();
} );

test( 'Basic - sync update - xData - function', () => {
    const RESULT = 'myData - fucntion';
    let unsubscribe = store.subscribe( () => {
        let state = store.getState();
        console.log( state.xAction.myStateName );
        expect( state.xAction.myStateName ).toBe( RESULT );
    } );
    store.dispatch( {
        type: 'myAction',
        xAction: {
            xData: ( state, action ) => {
                if ( action.type = 'myAction' ) {
                    return {
                        ...state,
                        myStateName: RESULT
                    };
                }
            }
        }
    } );
    unsubscribe();
} );


test( 'Basic - async update', () => {
    const RESULT = 'myAsyncStateData';
    let unsubscribe = store.subscribe( () => {
        let state = store.getState();
        console.log( state.xAction.xAsyncStatus );
        console.log( state.xAction.myStateName );
        if ( state.xAction.xAsyncStatus == X_STATE_VALUE_ASYNC_RUNNING ) {
            expect( state.xAction.myStateName ).toBe( undefined );
        }
        if ( state.xAction.xAsyncStatus == X_STATE_VALUE_ASYNC_SUCCESS ) {
            expect( state.xAction.myStateName ).toBe( RESULT );
        }
    } );
    store.dispatch( {
        type: 'myAction',
        xAction: {
            xStateName: 'myStateName',
            xAsync: RESULT
        }
    } );
    unsubscribe();
} );

