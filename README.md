Redux X Action
==============
A tool helps creating smart (sync or async) redux action.

## Installation

```
npm install --save redux-thunk
```

Then, to enable Redux X Action:

```js
import { createStore, applyMiddleware } from 'redux';
import { createXMiddleware, createXReducer } from 'redux-x-action';

// Note: this API requires redux@>=3.1.0
const store = createStore(
  combineReducers( {
    xAction: createXReducer()
  } ),
  applyMiddleware( 
    createXMiddleware() 
  )
);
```

## Basic Usage

Update state (Synchronous): 
```js
// dispatch
...
function updateState(newState) {
  return {
    type: 'UPDATE_STATE',
    xAction: {
      xStateName: 'stateName',
      xStateData: newState
    }
  };
}

store.dispatch(updateState('New State'));
...

// props mapping
...
const mapStateToProps = ( state ) => {
  return {
    propName: state.xAction.stateName
  }
};
...
```

Update state (Asynchronous): 
```js
// dispatch
...
function updateState(ms) {
  return {
    type: 'UPDATE_STATE',
    xAction: {
      xStateName: 'stateName',
      xAsync: () => {
        let promise = new Promise(resolve => setTimeout(resolve, ms));
        return promise;
      }
    }
  };
}

store.dispatch(updateState(1000));
...

// props mapping
...
const mapStateToProps = ( state ) => {
  return {
    // async result including error 
    propName: state.xAction.stateName, 
    // async status: X_STATE_VALUE_ASYNC_RUNNING, X_STATE_VALUE_ASYNC_SUCCESS or X_STATE_VALUE_ASYNC_FAILURE
    // import { X_STATE_VALUE_ASYNC_RUNNING, X_STATE_VALUE_ASYNC_SUCCESS, X_STATE_VALUE_ASYNC_FAILURE } from 'redux-x-action';
    propAsyncStatus: state.xAction.xAsyncStatus
  }
};
...
```

## Advanced Usage
TODO