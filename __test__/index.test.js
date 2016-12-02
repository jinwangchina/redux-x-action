import { createXMiddleware, createXReducer } from "../src/index";
import { X_STATE_VALUE_ASYNC_RUNNING, X_STATE_VALUE_ASYNC_SUCCESS, X_STATE_VALUE_ASYNC_FAILURE } from "../src/index";
import { createStore, combineReducers, applyMiddleware } from "redux";

let store = createStore(
    combineReducers( {
        xReducer: createXReducer()
    } ),
    applyMiddleware(
        createXMiddleware()
    )
);

test( "Basic - sync update - xStateData - string", () => {
    const RESULT = "myStateData";
    let unsubscribe = store.subscribe( () => {
        let state = store.getState();
        console.log( state.xReducer.myStateName );
        expect( state.xReducer.myStateName ).toBe( RESULT );
    } );
    store.dispatch( {
        type: "myAction",
        xAction: {
            xStateName: "myStateName",
            xStateData: RESULT
        }
    } );
    unsubscribe();
} );

test( "Advance - sync update - xStateData - function", () => {
    const RESULT = "myStateData - function";
    let unsubscribe = store.subscribe( () => {
        let state = store.getState();
        console.log( state.xReducer.myStateName );
        expect( state.xReducer.myStateName ).toBe( RESULT );
    } );
    store.dispatch( {
        type: "myAction",
        xAction: {
            xStateName: "myStateName",
            xStateData: () => RESULT
        }
    } );
    unsubscribe();
} );

test( "Advance - sync update - xData - object", () => {
    const RESULT = "myData";
    const RESULT_2 = "myData2";
    let unsubscribe = store.subscribe( () => {
        let state = store.getState();
        console.log( state.xReducer.myStateName );
        expect( state.xReducer.myStateName ).toBe( RESULT );
        console.log( state.xReducer.myStateName2 );
        expect( state.xReducer.myStateName2 ).toBe( RESULT_2 );
    } );
    store.dispatch( {
        type: "myAction",
        xAction: {
            xData: {
                myStateName: RESULT,
                myStateName2: RESULT_2
            }
        }
    } );
    unsubscribe();
} );

test( "Advance - sync update - xData - function", () => {
    const RESULT = "myData - fucntion";
    let unsubscribe = store.subscribe( () => {
        let state = store.getState();
        console.log( state.xReducer.myStateName );
        expect( state.xReducer.myStateName ).toBe( RESULT );
    } );
    store.dispatch( {
        type: "myAction",
        xAction: {
            xData: ( state, action ) => {
                if ( action.type = "myAction" ) {
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

test( "Basic - async update", () => {
    const ACTION_TYPE = "myAction";
    const RESULT = "myAsyncStateData";
    let unsubscribe = store.subscribe( () => {
        let state = store.getState();
        console.log( state.xReducer.xAsyncActionType );
        console.log( state.xReducer.xAsyncStatus );
        console.log( state.xReducer.myStateName );
        if ( state.xReducer.xAsyncStatus == X_STATE_VALUE_ASYNC_RUNNING ) {
            expect( state.xReducer.xAsyncActionType ).toBe( ACTION_TYPE );
            expect( state.xReducer.myStateName ).toBe( undefined );
        }
        if ( state.xReducer.xAsyncStatus == X_STATE_VALUE_ASYNC_SUCCESS ) {
            expect( state.xReducer.xAsyncActionType ).toBe( ACTION_TYPE );
            expect( state.xReducer.myStateName ).toBe( RESULT );
        }
    } );
    store.dispatch( {
        type: ACTION_TYPE,
        xAction: {
            xStateName: "myStateName",
            xAsync: RESULT
        }
    } );
    unsubscribe();
} );

test( "Advance - async update", () => {
    const ACTION_TYPE = "myAction";
    const RESULT = "myAsyncStateData";
    let unsubscribe = store.subscribe( () => {
        let state = store.getState();
        console.log( state.xReducer.xAsyncActionType );
        console.log( state.xReducer.myAsyncStatusStateName );
        console.log( state.xReducer.myStateName );
        if ( state.xReducer.myAsyncStatusStateName == X_STATE_VALUE_ASYNC_RUNNING ) {
            expect( state.xReducer.xAsyncActionType ).toBe( ACTION_TYPE );
            expect( state.xReducer.myStateName ).toBe( undefined );
        }
        if ( state.xReducer.myAsyncStatusStateName == X_STATE_VALUE_ASYNC_SUCCESS ) {
            expect( state.xReducer.xAsyncActionType ).toBe( ACTION_TYPE );
            expect( state.xReducer.myStateName ).toBe( RESULT );
        }
    } );
    store.dispatch( {
        type: ACTION_TYPE,
        xAction: {
            xStateName: "myStateName",
            xAsyncStatusStateName: "myAsyncStatusStateName",
            xAsync: RESULT
        }
    } );
    unsubscribe();
} );

